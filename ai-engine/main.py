from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from dotenv import load_dotenv
import os
import openai
import uvicorn
from pypdf import PdfReader
import io

# 1. Configuration
load_dotenv()
app = FastAPI()

# Setup OpenAI Client
openai.api_key = os.getenv("OPENAI_API_KEY")

# 2. Data Models
class VitalsRequest(BaseModel):
    age: int
    gender: str
    bp_systolic: int
    bp_diastolic: int
    sugar: int
    heart_rate: int

class TreatmentRequest(BaseModel):
    diagnosis: str
    symptoms: str
    age: int

class MedicineRequest(BaseModel):
    symptoms: str
    age: int
    allergies: str = "None"

# 3. Helper: Talk to GPT
def ask_gpt(prompt):
    if not os.getenv("OPENAI_API_KEY") or "sk-..." in os.getenv("OPENAI_API_KEY"):
        return " [MOCK AI RESPONSE] (No API Key detected): " + prompt[:50] + "..."

    try:
        response = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": "You are a helpful medical AI assistant."},
                      {"role": "user", "content": prompt}],
            max_tokens=200
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"AI Error: {str(e)}"

# --- ROUTES ---

@app.get("/")
def health_check():
    return {"status": "AI Engine Running", "port": 5001}

# 1. Vitals AI
@app.post("/analyze-vitals")
def analyze_vitals(data: VitalsRequest):
    prompt = (f"Analyze these vitals for a {data.age} year old {data.gender}: "
              f"BP {data.bp_systolic}/{data.bp_diastolic}, Sugar {data.sugar}, HR {data.heart_rate}. "
              "Is this normal? Output strict short advice.")
    analysis = ask_gpt(prompt)
    return {"analysis": analysis}

# 2. Doctor Assistant (Treatment)
@app.post("/generate-treatment")
def suggest_treatment(data: TreatmentRequest):
    prompt = (f"Suggest a standard treatment plan for Diagnosis: {data.diagnosis} "
              f"with Symptoms: {data.symptoms} for a {data.age} year old patient. "
              "Include medicines and advice.")
    suggestion = ask_gpt(prompt)
    return {"suggestion": suggestion}

# 3. Medicine AI (Safe Suggestions) -- NEW
@app.post("/suggest-medicines")
def suggest_medicines(data: MedicineRequest):
    prompt = (f"Suggest safe OTC medicines for a {data.age} year old patient with symptoms: {data.symptoms}. "
              f"Patient allergies: {data.allergies}. "
              "List only safe medicines and dosage.")
    suggestion = ask_gpt(prompt)
    return {"suggestion": suggestion}

# 4. PDF Summary
@app.post("/summarize-report")
async def summarize_pdf(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        reader = PdfReader(io.BytesIO(contents))
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        
        prompt = f"Summarize this medical report in 3 simple bullet points for a doctor:\n\n{text[:3000]}"
        summary = ask_gpt(prompt)
        
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5001)