from faster_whisper import WhisperModel
from concurrent.futures import ThreadPoolExecutor
import os

WHISPER_MODEL = os.getenv("WHISPER_MODEL", "base")

# Auto-detect device: use CUDA if available, otherwise fall back to CPU
try:
    import torch
    _DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
except ImportError:
    _DEVICE = "cpu"

_COMPUTE_TYPE = "float16" if _DEVICE == "cuda" else "int8"  # int8 is faster on CPU

_model = None


def load_model():
    global _model

    if _model is None:
        print(f"Loading Faster-Whisper model: {WHISPER_MODEL} ...")

        print(f"Using device: {_DEVICE} | compute_type: {_COMPUTE_TYPE}")
        _model = WhisperModel(
            WHISPER_MODEL,
            device=_DEVICE,
            compute_type=_COMPUTE_TYPE
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

    print(f"Using Faster-Whisper transcription on {_DEVICE}.")

    transcripts = []

    # Use 2 workers on GPU, 1 on CPU to avoid OOM on cloud servers
    max_workers = 2 if _DEVICE == "cuda" else 1
    with ThreadPoolExecutor(max_workers=max_workers) as executor:

        for i, text in enumerate(
            executor.map(transcribe_chunk, chunks)
        ):
            print(f"Completed chunk {i+1}/{len(chunks)}")
            transcripts.append(text)

    print("Transcription complete.")

    return " ".join(transcripts)