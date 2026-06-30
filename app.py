from fastapi import FastAPI, UploadFile, File, Form
import os
import shutil
from uuid import uuid4
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from main import run_pipeline, ask_question
from core.rag_engine import build_rag_chain

app = FastAPI(
    title="AI Video Assistant API",
    description="API for processing videos and answering questions.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class VideoRequest(BaseModel):
    source: str
    language: str = "english"

class QuestionRequest(BaseModel):
    question: str
    transcript: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Video Assistant API"}

@app.post("/process-video/")
def process_video(request: VideoRequest):
    """
    Process a video from a YouTube URL or local file path and return the analysis.
    """
    result = run_pipeline(source=request.source, language=request.language)
    # RAG chain is not serializable, so we remove it from the response.
    if "rag_chain" in result:
        del result["rag_chain"]
    return result

@app.post("/upload-video/")
def upload_video(file: UploadFile = File(...), language: str = Form("english")):
    """
    Process a video uploaded directly to the backend.
    """
    os.makedirs("temp_videos", exist_ok=True)
    file_path = f"temp_videos/{uuid4()}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    result = run_pipeline(source=file_path, language=language)
    
    if os.path.exists(file_path):
        os.remove(file_path)

    if "rag_chain" in result:
        del result["rag_chain"]
    return result

@app.post("/ask/")
def ask(request: QuestionRequest):
    """
    Ask a question about the video transcript.
    """
    rag_chain = build_rag_chain(request.transcript)
    answer = ask_question(rag_chain, request.question)
    return {"answer": answer}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
