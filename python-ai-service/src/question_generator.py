# src/question_generator.py
from .ai_service import AIService
from .models import Question
import json

class QuestionGenerator:
    def __init__(self):
        self.ai_service = AIService()

    def generate_question(self, difficulty: str) -> Question:
        prompt = f"""
        Generate a Python code-fill question for a {difficulty} level similar to this example:
        
        Example:
        {{
            "problemId": "e1",
            "problem": "How do you define a variable and print its value?",
            "code": "___ = 5\\n___(x)",
            "fillers": ["x", "print", "show", "y"],
            "answerSequence": "0,1",
            "explanation": "'x' is the variable name, and 'print' displays its value.",
            "hint": "The first is a letter, the second starts with 'p'."
        }}
        
        Return the result in JSON format with the same structure.
        Ensure the code has blanks marked with ___ and provide at least 4 fillers including correct answers.
        The answerSequence should be comma-separated indices of correct fillers.
        Use \\n for newlines in the "code" field to ensure proper JSON formatting.
        """
        
        try:
            response = self.ai_service.generate_content(prompt)
            print(f"Raw AI response: {response}")  # Debug output
            
            # Clean up the response and parse JSON
            cleaned_response = response.strip()
            if cleaned_response.startswith('```json'):
                cleaned_response = cleaned_response[7:-3].strip()
            elif cleaned_response.startswith('```'):
                cleaned_response = cleaned_response[3:-3].strip()
            
            print(f"Cleaned response: {cleaned_response}")  # Debug output
            
            question_data = json.loads(cleaned_response)
            
            return Question(
                problemId=question_data["problemId"],
                problem=question_data["problem"],
                code=question_data["code"],
                fillers=question_data["fillers"],
                answerSequence=question_data["answerSequence"],
                explanation=question_data["explanation"],
                hint=question_data["hint"]
            )
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to parse AI response: {str(e)}\nResponse: {cleaned_response}")
        except KeyError as e:
            raise Exception(f"Missing required field in AI response: {str(e)}\nResponse: {cleaned_response}")
        except Exception as e:
            raise Exception(f"Unexpected error: {str(e)}\nResponse: {response}")