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
    example: `player_name = "Alex"\nprint(player_name)`,
  },
  {
    term: 'String',
    definition: 'A sequence of characters, such as text. In Python, strings are enclosed in single quotes (\'\') or double quotes ("").',
    example: `greeting = "Hello there!"`,
  },
  {
    term: 'Integer',
    definition: 'A whole number (not a fraction) that can be positive, negative, or zero.',
    example: `score = 100`,
  },
  {
    term: 'if statement',
    definition: 'A conditional statement that executes a block of code only if a specified condition is true.',
    example: `if score > 50:\n    print("You win!")`,
  },
  {
    term: 'for loop',
    definition: 'A control flow statement for iterating over a sequence (like a list, tuple, dictionary, set, or string).',
    example: `for i in range(3):\n    print("Looping!")`,
  },
];
