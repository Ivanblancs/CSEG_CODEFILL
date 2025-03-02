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
    },
    {
      problemId: "e4",
      problem: "What function converts a string to an integer?",
      code: "num = ___('10')\n___(num + 5)",
      fillers: ["int", "float", "print", "str"],
      answerSequence: "0,2",
      explanation: "'int' converts to an integer, and 'print' shows the result.",
      hint: "The first starts with 'i', the second with 'p'."
    },
    {
      problemId: "e5",
      problem: "How do you define a list?",
      code: "my_list = ___1, 2, 3___\n___(my_list)",
      fillers: ["[", "]", "(", "print"],
      answerSequence: "0,1,3",
      explanation: "'[' and ']' enclose a list, and 'print' displays it.",
      hint: "The first two are brackets, the third starts with 'p'."
    },
    {
      problemId: "e6",
      problem: "What keyword defines a function?",
      code: "___ my_func():\n    ___('Hi!')",
      fillers: ["def", "func", "print", "call"],
      answerSequence: "0,2",
      explanation: "'def' defines a function, and 'print' outputs a message.",
      hint: "The first starts with 'd', the second with 'p'."
    },
    {
      problemId: "e7",
      problem: "How do you add two numbers and show the result?",
      code: "x = 3 + 4\n___(___)",
      fillers: ["print", "x", "sum", "display"],
      answerSequence: "0,1",
      explanation: "'print' outputs the result, and 'x' is the variable.",
      hint: "The first is an output function, the second is the variable."
    },
    {
      problemId: "e8",
      problem: "What symbol compares equality?",
      code: "if 5 ___ 5:\n    ___('Equal')",
      fillers: ["==", "=", "print", "!="],
      answerSequence: "0,2",
      explanation: "'==' checks equality, and 'print' shows the message.",
      hint: "The first has two characters, the second starts with 'p'."
    },
    {
      problemId: "e9",
      problem: "How do you store a decimal number?",
      code: "pi = ___3.14___\n___(pi)",
      fillers: ["(", ")", "float", "print"],
      answerSequence: "2,3",
      explanation: "'float' defines a decimal, and 'print' displays it.",
      hint: "The first starts with 'f', the second with 'p'."
    },
    {
      problemId: "e10",
      problem: "What keyword repeats an action?",
      code: "___ x < 3:\n    ___('Looping')",
      fillers: ["while", "for", "print", "do"],
      answerSequence: "0,2",
      explanation: "'while' creates a loop, and 'print' outputs text.",
      hint: "The first starts with 'w', the second with 'p'."
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
    },
    {
      problemId: "m9",
      problem: "How do you combine two strings?",
      code: "a = 'Hello'\nb = a ___ ' World'\n___(b)",
      fillers: ["+", "-", "print", "*"],
      answerSequence: "0,2",
      explanation: "'+' concatenates strings, and 'print' displays them.",
      hint: "The first is an operator, the second starts with 'p'."
    },
    {
      problemId: "m10",
      problem: "What stops a loop early?",
      code: "for i in range(5):\n    if i == 2:\n        ___    \n    ___(i)",
      fillers: ["break", "continue", "print", "stop"],
      answerSequence: "0,2",
      explanation: "'break' exits a loop, and 'print' shows values.",
      hint: "The first starts with 'b', the second with 'p'."
    }
  ],
  hard: [
    {
      problemId: "h1",
      problem: "How do you define a class and initialize it?",
      code: "___ MyClass:\n    def ___self___:\n        self.x = 0",
      fillers: ["class", "__init__", "(", "def"],
      answerSequence: "0,1",
      explanation: "'class' defines a class, '__init__' initializes it.",
      hint: "The first starts with 'c', the second has double underscores."
    },
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
    },
    {
      problemId: "h5",
      problem: "How do you write a list comprehension?",
      code: "squares = [x**2 ___ x ___ range(5)]\n___(squares)",
      fillers: ["for", "in", "print", "if"],
      answerSequence: "0,1,2",
      explanation: "'for' and 'in' form the comprehension, 'print' displays it.",
      hint: "The first has three letters, the second has two, the third starts with 'p'."
    },
    {
      problemId: "h6",
      problem: "How do you inherit from a class?",
      code: "class Base:\n    pass\nclass Derived___Base___:\n    ___('Inherited')",
      fillers: ["(", ")", "print", ":"],
      answerSequence: "0,1,2",
      explanation: "'(' and ')' specify inheritance, 'print' confirms it.",
      hint: "The first two are parentheses, the third starts with 'p'."
    },
    {
      problemId: "h7",
      problem: "How do you write to a file?",
      code: "file = open('out.txt', ___)\nfile.___('Text')\nfile.close()",
      fillers: ["'w'", "write", "print", "'r'"],
      answerSequence: "0,1",
      explanation: "'w' sets write mode, 'write' adds text to the file.",
      hint: "The first is in quotes, the second starts with 'w'."
    },
    {
      problemId: "h8",
      problem: "How do you raise an exception?",
      code: "if True:\n    ___ ValueError('Oops')\n___('Raised')",
      fillers: ["raise", "throw", "print", "except"],
      answerSequence: "0,2",
      explanation: "'raise' triggers an exception, 'print' confirms it.",
      hint: "The first starts with 'r', the second with 'p'."
    },
    {
      problemId: "h9",
      problem: "How do you import a module and use it?",
      code: "___ math\nx = math.___(90)\nprint(x)",
      fillers: ["import", "sin", "from", "cos"],
      answerSequence: "0,1",
      explanation: "'import' loads a module, 'sin' is a math function.",
      hint: "The first starts with 'i', the second with 's'."
    },
    {
      problemId: "h10",
      problem: "How do you define a generator?",
      code: "def gen():\n    ___ 1\n    yield 2\nx = gen()\n___(next(x))",
      fillers: ["yield", "return", "print", "next"],
      answerSequence: "0,2",
      explanation: "'yield' makes a generator, 'print' shows the value.",
      hint: "The first starts with 'y', the second with 'p'."
    }
  ]
};