export type GlossaryTopic = {
  term: string;
  definition: string;
  example: string;
};

export const glossary: GlossaryTopic[] = [
  {
    term: 'print()',
    definition: 'A built-in Python function that outputs text, numbers, or other data to the console.',
    example: `print("Hello, World!")`,
  },
  {
    term: 'Variable',
    definition: 'A named storage location in memory that holds a value. You can change the value of a variable.',
    example: `player_name = "Alex"\nscore = 100\nprint(player_name)`,
  },
  {
    term: 'Data Types',
    definition: 'The classification of a data item. Common types are String (text), and Integer (whole numbers).',
    example: `message = "I am a string"\ncount = 10 # This is an integer`,
  },
  {
    term: 'Arithmetic Operators',
    definition: 'Symbols used to perform math. Common operators are `+` (add), `-` (subtract), and `*` (multiply).',
    example: `health = 100 - 25\ndamage = 10 * 4\nprint(health)`,
  },
  {
    term: 'String Concatenation',
    definition: 'The process of joining two or more strings together using the `+` operator.',
    example: `word1 = "Python"\nword2 = " is fun"\nprint(word1 + word2)`,
  },
  {
    term: 'if/else Statement',
    definition: 'A control structure that runs one block of code if a condition is true, and another if it is false.',
    example: `age = 15\nif age >= 18:\n    print("Access granted")\nelse:\n    print("Access denied")`,
  },
  {
    term: 'for loop with range()',
    definition: "A statement for iterating a specific number of times. `range(end)` loops from 0 to `end-1`. `range(start, end)` loops from `start` to `end-1`.",
    example: `# Loops 0, 1, 2\nfor i in range(3):\n    print(i)\n\n# Loops 2, 3, 4\nfor j in range(2, 5):\n    print(j)`,
  },
  {
    term: 'Updating Variables in a Loop',
    definition: 'Modifying the value of a variable repeatedly inside a loop to keep a running total or count.',
    example: `total_xp = 0\nfor i in range(3):\n    total_xp = total_xp + 10\nprint(total_xp)`,
  },
  {
    term: 'Nested Loop',
    definition: 'A loop that is placed inside another loop. The inner loop completes all its runs for each single run of the outer loop.',
    example: `# The inner loop runs 3 times for each run of the outer loop.\nfor i in range(2):\n    print("Outer")\n    for j in range(3):\n        print("  Inner")`,
  },
  {
    term: 'input()',
    definition: 'A function that pauses your program and waits for the user to type some text and press Enter. It always returns the text as a string.',
    example: `name = input("What's your name? ")\nprint("Hello, " + name)`,
  },
  {
    term: 'int()',
    definition: 'A function that converts a string or a number into an integer (a whole number). This is essential for doing math with user input.',
    example: `age_string = "25"\nage_number = int(age_string)\nprint(age_number + 5) # Prints 30`,
  },
];
