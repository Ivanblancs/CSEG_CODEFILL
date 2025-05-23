export const questions = {
  easy: [
    {
      problemId: "e1",
      problem: "How do you define a variable and print its value?",
      code: "___ = 5\n___(x)",
      fillers: ["x", "print", "show", "y"],
      answerSequence: "0,1",
      explanation: "'x' is the variable name, and 'print' displays its value.",
      hint: "The first is a letter, the second starts with 'p'."
    },
    {
      problemId: "e2",
      problem: "What keyword starts a loop and prints numbers?",
      code: "___ i in range(3):\n    ___(i)",
      fillers: ["for", "while", "print", "display"],
      answerSequence: "0,2",
      explanation: "'for' starts a loop, and 'print' outputs each number.",
      hint: "The first has three letters, the second starts with 'p'."
    },
    {
      problemId: "e3",
      problem: "How do you comment code and assign a string?",
      code: "___ This is a note\nname ___ 'Alice'",
      fillers: ["#", "=", "//", ":"],
      answerSequence: "0,1",
      explanation: "'#' marks a comment, and '=' assigns a value.",
      hint: "The first is a symbol, the second is an operator."
    }
   
  ],
  medium: [
    {
      problemId: "m1",
      problem: "How do you get user input and display it?",
      code: "name = ___('Your name: ')\n___(name)",
      fillers: ["input", "print", "read", "show"],
      answerSequence: "0,1",
      explanation: "'input' gets user input, and 'print' displays it.",
      hint: "The first starts with 'i', the second with 'p'."
    },
    {
      problemId: "m2",
      problem: "How do you define a dictionary?",
      code: "my_dict = ___'key': ___'value'___",
      fillers: ["{", "}", ":", "'"],
      answerSequence: "0,2,1",
      explanation: "'{' and '}' enclose a dictionary, ':' separates key-value pairs.",
      hint: "The first and third are braces, the second is a colon."
    },
    {
      problemId: "m3",
      problem: "What creates a sequence and loops over it?",
      code: "for x in ___(4):\n    ___(x)",
      fillers: ["range", "list", "print", "loop"],
      answerSequence: "0,2",
      explanation: "'range' generates numbers, and 'print' outputs them.",
      hint: "The first starts with 'r', the second with 'p'."
    },
    {
      problemId: "m4",
      problem: "How do you check a condition and act?",
      code: "___ x > 0:\n    ___('Positive')",
      fillers: ["if", "while", "print", "check"],
      answerSequence: "0,2",
      explanation: "'if' checks a condition, and 'print' outputs the result.",
      hint: "The first has two letters, the second starts with 'p'."
    },
    {
      problemId: "m5",
      problem: "How do you add an element to a list?",
      code: "numbers = [1, 2]\nnumbers.___(3)\n___(numbers)",
      fillers: ["append", "add", "print", "insert"],
      answerSequence: "0,2",
      explanation: "'append' adds to a list, and 'print' shows it.",
      hint: "The first starts with 'a', the second with 'p'."
    },
    {
      problemId: "m6",
      problem: "How do you return a value from a function?",
      code: "def calc():\n    ___ 10\nx = calc()\n___(x)",
      fillers: ["return", "yield", "print", "send"],
      answerSequence: "0,2",
      explanation: "'return' sends back a value, and 'print' displays it.",
      hint: "The first starts with 'r', the second with 'p'."
    },
    {
      problemId: "m7",
      problem: "What converts a number to a string?",
      code: "text = ___(42)\n___(text)",
      fillers: ["str", "int", "print", "float"],
      answerSequence: "0,2",
      explanation: "'str' converts to a string, and 'print' shows it.",
      hint: "The first has three letters, the second starts with 'p'."
    },
    {
      problemId: "m8",
      problem: "How do you check if an item is in a list?",
      code: "items = [1, 2, 3]\nif 2 ___ items:\n    ___('Found')",
      fillers: ["in", "==", "print", "is"],
      answerSequence: "0,2",
      explanation: "'in' checks membership, and 'print' outputs the result.",
      hint: "The first has two letters, the second starts with 'p'."
    }
  
  ],
  hard: [
    {
      problemId: "h2",
      problem: "How do you open and close a file?",
      code: "file = ___('data.txt', 'r')\nfile.___()\n___('Done')",
      fillers: ["open", "close", "print", "read"],
      answerSequence: "0,1,2",
      explanation: "'open' opens a file, 'close' closes it, 'print' confirms.",
      hint: "The first starts with 'o', the second with 'c', the third with 'p'."
    },
    {
      problemId: "h3",
      problem: "How do you handle an error?",
      code: "___:\n    1 / 0\n___ ZeroDivisionError:\n    ___('Error')",
      fillers: ["try", "except", "print", "catch"],
      answerSequence: "0,1,2",
      explanation: "'try' starts error handling, 'except' catches it, 'print' shows a message.",
      hint: "The first starts with 't', the second with 'e', the third with 'p'."
    },
    {
      problemId: "h4",
      problem: "How do you create a lambda function?",
      code: "f = ___ x: x * 2\n___(f(3))",
      fillers: ["lambda", "def", "print", "func"],
      answerSequence: "0,2",
      explanation: "'lambda' defines an anonymous function, 'print' outputs the result.",
      hint: "The first starts with 'l', the second with 'p'."
    }
  ]
};