import os
import base64
import tempfile
import yt_dlp
from pydub import AudioSegment

DOWNLOAD_DIR = 'downloades'
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# ── YouTube cookie support ────────────────────────────────────────────────────
# HF Spaces datacenter IPs are blocked by YouTube unless you use browser cookies.
# Set YOUTUBE_COOKIES_B64 as a secret in your HF Space:
#   base64-encode your exported youtube.com_cookies.txt and paste the value.
def _get_cookie_file() -> str | None:
    cookies_b64 = os.getenv("YOUTUBE_COOKIES_B64")
    if not cookies_b64:
        return None
    try:
        cookie_path = os.path.join(tempfile.gettempdir(), "yt_cookies.txt")
        with open(cookie_path, "w", encoding="utf-8") as f:
            f.write(base64.b64decode(cookies_b64).decode("utf-8"))
        print("YouTube cookies loaded from YOUTUBE_COOKIES_B64 secret.")
        return cookie_path
    except Exception as e:
        print(f"Warning: could not load YouTube cookies: {e}")
        return None

# ─────────────────────────────────────────────────────────────────────────────

def download_youtube_audio(url: str) -> str:
    output_path = os.path.join(DOWNLOAD_DIR, "%(title)s.%(ext)s")

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": output_path,
        "source_address": "0.0.0.0",    # Force IPv4
        "legacyserverconnect": True,
        "nocheckcertificate": True,
        "geo_bypass": True,
        "retries": 5,
        "extractor_args": {
            "youtube": {
                # tv_embedded + mweb work best from datacenter IPs
                "player_client": ["tv_embedded", "ios", "android", "web"]
            }
        },
        "http_headers": {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
            "Accept-Language": "en-US,en;q=0.9",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        "postprocessors": [
            {
                "key": "FFmpegExtractAudio",
                "preferredcodec": "wav",
                "preferredquality": "192",
            }
        ],
        "quiet": False,  # Show warnings so we can debug
    }

    # Use cookies if available (required for datacenter IPs like HF Spaces)
    cookie_file = _get_cookie_file()
    if cookie_file:
        ydl_opts["cookiefile"] = cookie_file
    else:
        print(
            "WARNING: YOUTUBE_COOKIES_B64 secret not set. "
            "YouTube may block requests from this server. "
            "See README for setup instructions."
        )

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info).replace(".webm", ".wav").replace(".m4a", ".wav")
        return filename
    except yt_dlp.utils.DownloadError as e:
        raise RuntimeError(
            "Could not download YouTube video. "
            "This usually happens because the server's IP is blocked by YouTube. "
            "Please upload your video/audio file directly instead of using a YouTube URL, "
            "or set the YOUTUBE_COOKIES_B64 secret in your Hugging Face Space settings."
        ) from e


def convert_to_wav(input_path: str) -> str:
    """Convert any audio/video file to WAV format using pydub."""
    output_path = os.path.splitext(input_path)[0] + "_converted.wav"
    audio = AudioSegment.from_file(input_path)
    audio = audio.set_channels(1).set_frame_rate(16000)  # 16kHz mono
    audio.export(output_path, format="wav")
    return output_path


def chunk_audio(wav_path: str, chunk_minutes: int = 10) -> list:
    audio = AudioSegment.from_wav(wav_path)
    chunk_ms = chunk_minutes * 60 * 1000

    chunks = []
    for i, start in enumerate(range(0, len(audio), chunk_ms)):
        chunk = audio[start: start + chunk_ms]
        chunk_path = f"{wav_path}_chunk_{i}.wav"
        chunk.export(chunk_path, format="wav")
        chunks.append(chunk_path)

    return chunks


def process_input(source: str) -> list:
    if source.startswith("http://") or source.startswith("https://"):
        print("Detected YouTube URL. Downloading audio...")
        wav_path = download_youtube_audio(source)
    else:
        print("Detected local file. Converting to WAV...")
        wav_path = convert_to_wav(source)

    print("Chunking audio...")
    chunks = chunk_audio(wav_path)
    print(f"Audio ready — {len(chunks)} chunk(s) created.")
    return chunks
