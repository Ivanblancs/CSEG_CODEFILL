from .ai_service import AIService
from .models import Question
import json
import uuid
import re
import hashlib

class QuestionGenerator:
    def __init__(self):
        self.ai_service = AIService()
        self.generated_hashes = set()  # Track hashes of generated questions to avoid duplicates

    def validate_question(self, question_data: dict) -> bool:
        """Validate the generated question for answerability."""
        try:
            required_fields = ["problemId", "problem", "code", "fillers", "answerSequence", "explanation", "hint"]
            if not all(field in question_data for field in required_fields):
                return False

            if not re.match(r"^[emh][a-f0-9]{5}$", question_data["problemId"]):
                return False

            if "___" not in question_data["code"]:
                return False

            if len(question_data["fillers"]) < 4:
                return False

            answer_indices = question_data["answerSequence"].replace(" ", "").split(",")
            if not all(idx.isdigit() and 0 <= int(idx) < len(question_data["fillers"]) for idx in answer_indices):
                return False

            blank_count = question_data["code"].count("___")
            if blank_count != len(answer_indices):
                return False

            code_lines = question_data["code"].split("\\n")
            if not all(line.strip() for line in code_lines if line.strip()):
                return False

            # Check for uniqueness by hashing the question content (excluding problemId)
            question_content = json.dumps({
                "problem": question_data["problem"],
                "code": question_data["code"],
                "fillers": question_data["fillers"],
                "answerSequence": question_data["answerSequence"]
            }, sort_keys=True)
            question_hash = hashlib.md5(question_content.encode()).hexdigest()
            if question_hash in self.generated_hashes:
                return False
            self.generated_hashes.add(question_hash)

            return True
        except Exception:
            return False

    def generate_question(self, difficulty: str) -> Question:
        if difficulty not in ["easy", "medium", "hard"]:
            raise ValueError(f"Invalid difficulty: {difficulty}")

        max_attempts = 5
        for attempt in range(max_attempts):
            prompt = f"""
            Generate a unique Python code-fill question for a {difficulty} level, distinct from previously generated questions. The question must cover a variety of basic Python concepts and avoid repetitive patterns like variable definition and printing.

            Examples for easy level:
            1. {{
                "problemId": "{difficulty[0]}{uuid.uuid4().hex[:5]}",
                "problem": "How do you create a loop to print numbers 1 to 3?",
                "code": "___ i ___ range(1, 4):\\n    print(i)",
                "fillers": ["for", "while", "in", "to"],
                "answerSequence": "0,2",
                "explanation": "'for' is used for iteration, and 'in' connects the variable to the range.",
                "hint": "Use a loop keyword and a preposition."
            }}
            2. {{
                "problemId": "{difficulty[0]}{uuid.uuid4().hex[:5]}",
                "problem": "How do you check if a number is positive?",
                "code": "x = 5\\n___ x > 0:\\n    print('Positive')",
                "fillers": ["if", "while", "for", "elif"],
                "answerSequence": "0",
                "explanation": "'if' is used to check conditions like x > 0.",
                "hint": "The keyword starts with 'i'."
            }}
            3. {{
                "problemId": "{difficulty[0]}{uuid.uuid4().hex[:5]}",
                "problem": "How do you concatenate two strings?",
                "code": "name = 'Hello'\\n___ = name ___ ' World'\\nprint(result)",
                "fillers": ["result", "+", "*", "concat"],
                "answerSequence": "0,1",
                "explanation": "'result' is the variable to store the concatenated string, and '+' is the operator for string concatenation.",
                "hint": "Use a variable name and an operator."
            }}

            Requirements:
            - The question must be unique, answerable, and use correct Python syntax.
            - The "problemId" must start with '{difficulty[0]}' (e.g., 'e' for easy) followed by a unique 5-character hexadecimal identifier.
            - The "problem" must clearly describe a distinct task (e.g., loops, conditionals, string operations, basic math) and avoid repetitive 'adding and printing' problems.
            - The "code" must contain blanks marked with '___' (at least one) and use '\\n' for newlines.
            - The "fillers" list must contain at least 4 unique options, including the correct answers.
            - The "answerSequence" must be a comma-separated string of indices (e.g., "0,1") corresponding to the correct fillers.
            - The number of '___' in "code" must match the number of indices in "answerSequence".
            - The "explanation" must explain why the correct fillers are right.
            - The "hint" must provide a helpful clue without revealing the answer.
            - Ensure the code is syntactically valid Python when the correct fillers are inserted.
            - For {difficulty} level:
                - Easy: Basic syntax (variables, loops, conditionals, basic operations, string manipulation). Examples include for/while loops, if statements, string concatenation, or simple arithmetic.
                - Medium: Intermediate concepts (lists, dictionaries, functions, conditionals).
                - Hard: Advanced topics (classes, file I/O, exceptions, lambdas, comprehensions).
            - Avoid repeating questions with similar code, problem, or fillers. For easy level, prioritize variety (e.g., avoid generating only print or addition problems).

            Return the result in JSON format, wrapped in ```json``` markers.
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
                
                # Validate the generated question
                if not self.validate_question(question_data):
                    if attempt == max_attempts - 1:
                        raise ValueError("Failed to generate a valid, unique question after maximum attempts")
                    continue

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
                print(f"Attempt {attempt + 1} failed: Failed to parse AI response: {str(e)}")
                continue
            except KeyError as e:
                print(f"Attempt {attempt + 1} failed: Missing required field: {str(e)}")
                continue
            except ValueError as e:
                print(f"Attempt {attempt + 1} failed: {str(e)}")
                continue
            except Exception as e:
                print(f"Attempt {attempt + 1} failed: Unexpected error: {str(e)}")
                continue
        
        raise Exception("Failed to generate a valid question after maximum attempts")