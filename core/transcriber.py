from faster_whisper import WhisperModel
from concurrent.futures import ThreadPoolExecutor
import os

WHISPER_MODEL = os.getenv("WHISPER_MODEL", "base")

_model = None


def load_model():
    global _model

    if _model is None:
        print(f"Loading Faster-Whisper model: {WHISPER_MODEL} ...")

        _model = WhisperModel(
            WHISPER_MODEL,
            device="cuda",          # GPU
            compute_type="float16"  # Faster on GPU
        )

        print("Faster-Whisper model loaded.")

    return _model


def transcribe_chunk(chunk_path: str) -> str:
    model = load_model()

    segments, _ = model.transcribe(
        chunk_path,
        beam_size=5
    )

    text = " ".join(segment.text for segment in segments)

    return text.strip()


def transcribe_all(chunks: list, language: str = "english") -> str:

    print("Using Faster-Whisper GPU transcription.")

    transcripts = []

    # For your 4GB GPU start with 2 workers
    with ThreadPoolExecutor(max_workers=2) as executor:

        for i, text in enumerate(
            executor.map(transcribe_chunk, chunks)
        ):
            print(f"Completed chunk {i+1}/{len(chunks)}")
            transcripts.append(text)

    print("Transcription complete.")

    return " ".join(transcripts)