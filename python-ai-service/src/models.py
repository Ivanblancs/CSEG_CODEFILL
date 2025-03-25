# src/models.py
from dataclasses import dataclass
from typing import List

@dataclass
class Question:
    problemId: str
    problem: str
    code: str
    fillers: List[str]
    answerSequence: str
    explanation: str
    hint: str