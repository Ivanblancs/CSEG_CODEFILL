from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from src.question_generator import QuestionGenerator
from fastapi.middleware.cors import CORSMiddleware
import logging

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    difficulty: str

class QuestionResponse(BaseModel):
    problemId: str
    problem: str
    code: str
    fillers: list[str]
    answerSequence: str
    explanation: str
    hint: str

@app.post("/generate-question", response_model=QuestionResponse)
async def generate_question(request: QuestionRequest):
    max_attempts = 3
    for attempt in range(max_attempts):
        try:
            generator = QuestionGenerator()
            question = generator.generate_question(request.difficulty)
            logger.info(f"Generated question: {question.__dict__}")  # Log the question
            return QuestionResponse(
                problemId=question.problemId,
                problem=question.problem,
                code=question.code,
                fillers=question.fillers,
                answerSequence=question.answerSequence,
                explanation=question.explanation,
                hint=question.hint
            )
        except Exception as e:
            logger.error(f"Attempt {attempt + 1} failed: {str(e)}")
            if attempt == max_attempts - 1:
                raise HTTPException(status_code=500, detail=f"Failed to generate valid question after {max_attempts} attempts: {str(e)}")
            continue