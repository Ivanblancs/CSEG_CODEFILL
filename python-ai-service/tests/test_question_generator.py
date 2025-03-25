
# tests/test_question_generator.py
from src.question_generator import QuestionGenerator

def test_question_generator():
    generator = QuestionGenerator()
    
    # Test generating an easy question
    question = generator.generate_question("easy")
    
    assert question.problemId is not None
    assert question.problem is not None
    assert "___" in question.code
    assert len(question.fillers) >= 4
    assert question.answerSequence is not None
    assert question.explanation is not None
    assert question.hint is not None
    
    print("Test passed: Question generated successfully")