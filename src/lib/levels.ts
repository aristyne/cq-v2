import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

export type Level = {
  id: number;
  topicId: number;
  topicTitle: string;
  isFirstInTopic: boolean;
  title: string;
  description: string;
  challenge: string;
  starterCode: string;
  solution: string;
  image: ImagePlaceholder;
  expectedOutput: string;
  xp: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  hints: string[];
};

const findImage = (id: string) => {
  const img = PlaceHolderImages.find((img) => img.id === id);
  if (!img) throw new Error(`Image with id ${id} not found`);
  return img;
};

export const levels: Level[] = [
  // Level 1: Basics
  {
    id: 1,
    topicId: 1,
    topicTitle: "The Journey Begins",
    isFirstInTopic: true,
    title: "A Classic Greeting",
    description: "Start your adventure by learning how to display messages.",
    challenge: "Use the `print()` function to output the text 'Hello, World!'",
    starterCode: "# Your code here\n",
    solution: "print('Hello, World!')",
    image: findImage('start-village'),
    expectedOutput: "Hello, World!",
    xp: 20,
    difficulty: 'Easy',
    hints: [
      "You need to use a special function to make text appear in the console.",
      "The function you're looking for is `print()`.",
      "Try writing `print()` with the text 'Hello, World!' inside the parentheses and quotes.",
    ],
  },
  // Level 2: Variables
  {
    id: 2,
    topicId: 2,
    topicTitle: "Forest of Variables",
    isFirstInTopic: true,
    title: "Storing Your Name",
    description: "Learn to store information in variables, like your name.",
    challenge: "Create a variable named `player_name` and set its value to 'Alex'. Then, print the variable.",
    starterCode: "# Create your variable here\n\n# Print your variable here\n",
    solution: "player_name = 'Alex'\nprint(player_name)",
    image: findImage('enchanted-forest'),
    expectedOutput: "Alex",
    xp: 25,
    difficulty: 'Easy',
    hints: [
      "To create a variable, type the name, an equals sign (`=`), and then the value.",
      "Text values (strings) need to be in quotes, like `'Alex'`.",
      "After creating the variable, use `print(player_name)` to see its value.",
    ],
  },
  // Level 3: Arithmetic
  {
    id: 3,
    topicId: 3,
    topicTitle: "Dragon's Hoard of Numbers",
    isFirstInTopic: true,
    title: "Counting Gold",
    description: "The dragon has two piles of gold. Add them together.",
    challenge: "Add `120` and `55` together and print the total.",
    starterCode: "# Calculate and print the total\n",
    solution: "print(120 + 55)",
    image: findImage('dragons-cave'),
    expectedOutput: "175",
    xp: 30,
    difficulty: 'Easy',
    hints: [
      "You can do math right inside the `print()` function.",
      "Use the `+` operator to add numbers.",
      "Place the expression `120 + 55` inside the parentheses of the `print()` function.",
    ],
  },
  // Level 4: String Concatenation
  {
    id: 4,
    topicId: 4,
    topicTitle: "The Weaver's Loom",
    isFirstInTopic: true,
    title: "Weaving Words",
    description: "Combine different pieces of text into a single message.",
    challenge: "Create two variables, `greeting` with value 'Hello, ' and `name` with value 'Adventurer'. Combine and print them to say 'Hello, Adventurer'.",
    starterCode: "greeting = 'Hello, '\nname = 'Adventurer'\n\n# Combine and print the variables\n",
    solution: "print(greeting + name)",
    image: findImage('weavers-loom'),
    expectedOutput: "Hello, Adventurer",
    xp: 35,
    difficulty: 'Easy',
    hints: [
      "The `+` operator can also be used to join strings together.",
      "Use `print(greeting + name)` to combine the two variables.",
    ],
  },
  // Level 5: Conditionals
  {
    id: 5,
    topicId: 5,
    topicTitle: "The Conditional Bridge",
    isFirstInTopic: true,
    title: "The Mana Check",
    description: "The bridge keeper will only let you pass if you have enough mana.",
    challenge: "You have 5 mana potions. If you have 10 or more, print 'You may pass'. Otherwise, print 'You shall not pass!'.",
    starterCode: "mana_potions = 5\n\n# Check your mana and print the correct message\n",
    solution: "if mana_potions >= 10:\n    print('You may pass')\nelse:\n    print('You shall not pass!')",
    image: findImage('conditional-bridge'),
    expectedOutput: "You shall not pass!",
    xp: 40,
    difficulty: 'Medium',
    hints: [
      "This requires an `if` statement to make a decision.",
      "Use `else` for the case where the `if` condition is not met.",
      "The condition should check if `mana_potions` is 'greater than or equal to' 10 (`>=`).",
    ],
  },
  // Level 6: Loops
  {
    id: 6,
    topicId: 6,
    topicTitle: "The Spire of Loops",
    isFirstInTopic: true,
    title: "The Magic Chant",
    description: "A spell requires you to repeat a magic word.",
    challenge: "Use a for loop to print the chant 'Abracadabra' 3 times, each on a new line.",
    starterCode: "# Use a loop to print the chant 3 times\n",
    solution: "for i in range(3):\n    print('Abracadabra')",
    image: findImage('loop-spire'),
    expectedOutput: "Abracadabra\nAbracadabra\nAbracadabra",
    xp: 50,
    difficulty: 'Medium',
    hints: [
      "A `for` loop is used to repeat actions.",
      "Python's `range()` function is key. `for i in range(3):` will run the code inside it 3 times.",
      "Inside your loop, you just need a single `print()` statement.",
    ],
  },
  // Level 7: Loops and Conditionals
  {
    id: 7,
    topicId: 7,
    topicTitle: "The Golem's Gauntlet",
    isFirstInTopic: true,
    title: "The Odd and Even Stones",
    description: "A golem presents a path of stones, some even, some odd.",
    challenge: "Loop from 1 to 5. If a number is 1, 3, or 5, print 'Odd'. If it's 2 or 4, print 'Even'. (Hint: you will need multiple `if` statements)",
    starterCode: "# Your code here\n",
    solution: "for i in range(1, 6):\n    if i == 1:\n        print('Odd')\n    if i == 2:\n        print('Even')\n    if i == 3:\n        print('Odd')\n    if i == 4:\n        print('Even')\n    if i == 5:\n        print('Odd')",
    image: findImage('golem-gauntlet'),
    expectedOutput: "Odd\nEven\nOdd\nEven\nOdd",
    xp: 60,
    difficulty: 'Medium',
    hints: [
        "You'll need a `for` loop that runs from 1 to 5. `range(1, 6)` will do this.",
        "Inside the loop, you'll need `if` statements to check the value of the loop variable `i`.",
        "Since you can't check for 'odd' or 'even' with math, check each number one-by-one, e.g., `if i == 1: ...`, `if i == 2: ...` and so on.",
    ],
  },
   // Level 8: Updating Variables in a Loop
  {
    id: 8,
    topicId: 8,
    topicTitle: "The Alchemist's Lab",
    isFirstInTopic: true,
    title: "The Alchemist's Brew",
    description: "An alchemist needs to mix a potion perfectly. Add ingredients in a sequence.",
    challenge: "Start with a `potion_value` of 0. Loop 5 times. In each loop, add the loop number (0, 1, 2, 3, 4) to `potion_value`. Print the final value after the loop.",
    starterCode: "potion_value = 0\n\n# Your code here\n",
    solution: "potion_value = 0\nfor i in range(5):\n    potion_value = potion_value + i\nprint(potion_value)",
    image: findImage('alchemists-lab'),
    expectedOutput: "10",
    xp: 70,
    difficulty: 'Hard',
    hints: [
      "Initialize `potion_value = 0` before the loop.",
      "Use a `for` loop that runs 5 times: `for i in range(5):`.",
      "Inside the loop, update the potion value: `potion_value = potion_value + i`.",
      "Print the final `potion_value` *after* the loop is finished.",
    ],
  },
   // Level 9: Nested Logic
  {
    id: 9,
    topicId: 9,
    topicTitle: "The Oracle's Chamber",
    isFirstInTopic: true,
    title: "The Oracle's Test",
    description: "The Oracle gives a complex riddle that requires careful logic to solve.",
    challenge: "Loop from 1 to 10. If the number is less than 5, print 'low'. If it is greater than 5, print 'high'. If it is exactly 5, print 'middle'.",
    starterCode: "# Your code here\n",
    solution: "for i in range(1, 11):\n    if i < 5:\n        print('low')\n    else:\n        if i > 5:\n            print('high')\n        else:\n            print('middle')",
    image: findImage('oracles-chamber'),
    expectedOutput: "low\nlow\nlow\nlow\nmiddle\nhigh\nhigh\nhigh\nhigh\nhigh",
    xp: 80,
    difficulty: 'Hard',
    hints: [
      "You need a `for` loop that goes from 1 to 10. `range(1, 11)` is what you need.",
      "Inside the loop, you'll need to check the value of the loop variable.",
      "Use an `if/else` structure. The first `if` can check `i < 5`.",
      "In the `else` block, you'll need another, nested `if/else` to tell the difference between `i > 5` and `i == 5`."
    ],
  },
];
