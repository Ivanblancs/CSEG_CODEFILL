export const questions = {
  easy: [
    {
      problemId: "e1",
      problem: "Which keyword is used to define a function in Python?",
      code: "___ my_function():\n    ___('Hello!')",
      fillers: ["def", "return", "print"],
      answerSequence: "0,2",
      explanation: "Functions in Python are defined using 'def', and 'print' is used for output.",
      hint: "The first starts with 'd', and the second starts with 'p'."
    },
    {
      problemId: "e2",
      problem: "How do you create a variable and assign a value?",
      code: "___ = 10\n___(x)",
      fillers: ["x", "print", "show"],
      answerSequence: "0,1",
      explanation: "'x' is a variable, and 'print' is used to display its value.",
      hint: "The second word is a function that displays output."
    },
    {
      problemId: "e3",
      problem: "Which symbols are used for comments and assignment?",
      code: "___ This is a comment\nx ___ 5",
      fillers: ["#", "=", "//"],
      answerSequence: "0,1",
      explanation: "Python uses '#' for comments and '=' for assignment.",
      hint: "The first is a single character, the second is an operator."
    },
    {
      problemId: "e4",
      problem: "How do you store a floating-point number?",
      code: "y = ___(3.14)\nprint(type(y)) # Output: <class '___'>",
      fillers: ["float", "int", "float"],
      answerSequence: "0,2",
      explanation: "Python uses 'float()' to store decimals, and the type of a float is 'float'.",
      hint: "Both answers are the same."
    },
    {
      problemId: "e5",
      problem: "What is the correct way to write a list?",
      code: "my_list = ___1, 2, 3___",
      fillers: ["(", "[", "]"],
      answerSequence: "1,2",
      explanation: "Lists in Python are written using square brackets '[ ]'.",
      hint: "Both symbols are brackets."
    }
  ],
  
  medium: [
    {
      problemId: "m1",
      problem: "How do you get input and store it in a variable?",
      code: "name = ___('Enter your name: ')\n___('Hello,', name)",
      fillers: ["input", "print", "read"],
      answerSequence: "0,1",
      explanation: "'input()' gets user input, and 'print()' displays output.",
      hint: "First is for input, second is for output."
    },
    {
      problemId: "m2",
      problem: "Which data structure uses key-value pairs?",
      code: "my_dict = ___('name': 'Alice', 'age': 25___)",
      fillers: ["{", "}", "["],
      answerSequence: "0,1",
      explanation: "Dictionaries are enclosed in curly braces '{ }'.",
      hint: "Think of dictionary brackets."
    },
    {
      problemId: "m3",
      problem: "How do you create a loop and range?",
      code: "for i in ___(5):\n    ___(i)",
      fillers: ["range", "loop", "print"],
      answerSequence: "0,2",
      explanation: "'range()' generates numbers, and 'print()' outputs them.",
      hint: "One generates numbers, one displays output."
    },
    {
      problemId: "m4",
      problem: "What is the correct syntax for checking conditions?",
      code: "if x ___ 10:\n    ___('x is 10')",
      fillers: ["==", "=", "print"],
      answerSequence: "0,2",
      explanation: "'==' checks equality, and 'print()' outputs a message.",
      hint: "One is a comparison operator, one is a function."
    },
    {
      problemId: "m5",
      problem: "How do you add an item to a list?",
      code: "my_list = [1, 2, 3]\nmy_list.___ (4)\nprint(my_list) # Output: [1, 2, 3, 4]",
      fillers: ["add", "append", "insert"],
      answerSequence: "1",
      explanation: "'append()' adds an item to the end of a list.",
      hint: "The word means 'attach'."
    }
  ],
  

  hard: [
    {
      problemId: "h1",
      problem: "How do you correctly return a value?",
      code: "def my_function():\n    ___ 42\nx = my_function()\n___(x)",
      fillers: ["return", "yield", "print"],
      answerSequence: "0,2",
      explanation: "'return' sends back a value, and 'print()' displays it.",
      hint: "One is for sending back values, one is for output."
    },
    {
      problemId: "h2",
      problem: "Which function is used to open and read a file?",
      code: "file = ___('data.txt', 'r')\ndata = file.___()\nprint(data)",
      fillers: ["open", "read", "load"],
      answerSequence: "0,1",
      explanation: "'open()' opens files, and 'read()' retrieves content.",
      hint: "Both are basic file operations."
    },
    {
      problemId: "h3",
      problem: "How do you handle exceptions?",
      code: "try:\n    x = 1 / 0\n___ ZeroDivisionError:\n    ___('Cannot divide by zero')",
      fillers: ["catch", "except", "print"],
      answerSequence: "1,2",
      explanation: "'except' catches errors, and 'print()' displays messages.",
      hint: "One handles errors, the other outputs text."
    },
    {
      problemId: "h4",
      problem: "How do you define a class with an initializer?",
      code: "___ MyClass:\n    def ___(self, name):\n        self.name = name",
      fillers: ["class", "__init__", "define"],
      answerSequence: "0,1",
      explanation: "'class' defines a class, and '__init__' is the constructor.",
      hint: "One starts a class, one initializes it."
    },
    {
      problemId: "h5",
      problem: "How do you write a lambda function?",
      code: "square = ___ x: x ** 2\n___(square(5))",
      fillers: ["lambda", "print", "function"],
      answerSequence: "0,1",
      explanation: "'lambda' creates anonymous functions, and 'print()' outputs the result.",
      hint: "One creates a function, one outputs it."
    }
  ]
  
};
