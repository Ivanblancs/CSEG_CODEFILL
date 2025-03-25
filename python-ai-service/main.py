# main.py
from src.question_generator import QuestionGenerator
import json

def get_difficulty() -> str:
    valid_difficulties = ["easy", "medium", "hard"]
    while True:
        difficulty = input("Enter difficulty level (easy, medium, hard): ").lower().strip()
        if difficulty in valid_difficulties:
            return difficulty
        print("Invalid input. Please choose 'easy', 'medium', or 'hard'.")

def main():
    generator = QuestionGenerator()
    difficulty = get_difficulty()
    questions = []
    
    print(f"\nGenerating 10 {difficulty} questions:")
    try:
        for i in range(10):
            print(f"\nGenerating question {i + 1}...")
            question = generator.generate_question(difficulty)
            questions.append({
                "problemId": question.problemId,
                "problem": question.problem,
                "code": question.code,
                "fillers": question.fillers,
                "answerSequence": question.answerSequence,
                "explanation": question.explanation,
                "hint": question.hint
            })
            print(f"Generated: {question.problemId} - {question.problem}")

        # Save to JSON file
        filename = f"{difficulty}_questions.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(questions, f, indent=4)
        print(f"\nSaved 10 questions to {filename}")

    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main()