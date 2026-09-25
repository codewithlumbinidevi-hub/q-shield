"""
Document API Module
Provides real document file upload, text extraction, SHA3-256 document hashing,
and Bloch sphere state parameter derivation (theta, phi).
"""
import io
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel, Field
from app.crypto.hashing import compute_sha3_256, derive_quantum_angles

router = APIRouter()

class DocumentHashRequest(BaseModel):
    document: str = Field(..., description="Document content string to hash")

class DocumentUploadResponse(BaseModel):
    filename: str
    content_type: str
    size_bytes: int
    sha3_256: str
    text_preview: str
    status: str
    theta: float
    phi: float
    timestamp: str

def extract_file_text_and_bytes(filename: str, content_bytes: bytes) -> tuple[str, str]:
    """
    Extracts text content string and computes SHA3-256 hash from raw bytes.
    Supports .txt, .pdf, .docx, .json, .csv files.
    """
    sha3_256_hash = compute_sha3_256(content_bytes)
    ext = filename.lower().split('.')[-1] if '.' in filename else ''

    extracted_text = ""

    if ext in ['txt', 'json', 'csv', 'md', 'log']:
        extracted_text = content_bytes.decode('utf-8', errors='ignore')
    elif ext == 'pdf':
        try:
            from pypdf import PdfReader
            reader = PdfReader(io.BytesIO(content_bytes))
            pages_text = [page.extract_text() for page in reader.pages if page.extract_text()]
            extracted_text = "\n".join(pages_text) if pages_text else f"PDF Document: {filename} ({len(content_bytes)} bytes)"
        except Exception:
            extracted_text = f"PDF Document: {filename} ({len(content_bytes)} bytes)"
    elif ext in ['docx', 'doc']:
        try:
            import docx
            doc = docx.Document(io.BytesIO(content_bytes))
            paragraphs = [p.text for p in doc.paragraphs if p.text]
            extracted_text = "\n".join(paragraphs) if paragraphs else f"DOCX Document: {filename} ({len(content_bytes)} bytes)"
        except Exception:
            extracted_text = f"DOCX Document: {filename} ({len(content_bytes)} bytes)"
    else:
        extracted_text = content_bytes.decode('utf-8', errors='ignore') or f"Binary Document: {filename} ({len(content_bytes)} bytes)"

    return extracted_text, sha3_256_hash

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """
    Receives uploaded document file (multipart/form-data).
    Calculates SHA3-256 hash from raw file bytes, extracts text preview,
    and derives Bloch sphere state parameters (theta, phi).
    """
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded file is empty (0 bytes).")

    extracted_text, hash_hex = extract_file_text_and_bytes(file.filename, content)
    theta, phi = derive_quantum_angles(hash_hex)
    text_preview = extracted_text[:300] + ("..." if len(extracted_text) > 300 else "")

    return DocumentUploadResponse(
        filename=file.filename,
        content_type=file.content_type or "application/octet-stream",
        size_bytes=len(content),
        sha3_256=hash_hex,
        text_preview=text_preview,
        status="uploaded",
        theta=theta,
        phi=phi,
        timestamp=datetime.utcnow().isoformat() + "Z"
    )

@router.post("/hash")
async def hash_document(request: DocumentHashRequest):
    """
    Computes SHA3-256 hash of provided string document text.
    """
    if not request.document:
        raise HTTPException(status_code=400, detail="Document text cannot be empty.")

    hash_hex = compute_sha3_256(request.document)
    theta, phi = derive_quantum_angles(hash_hex)
    
    return {
        "hash": hash_hex,
        "byte_size": len(request.document.encode('utf-8')),
        "theta": theta,
        "phi": phi,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }
