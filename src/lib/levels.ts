import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

export type Level = {
  id: number;
  title: string;
  description: string;
  challenge: string;
  starterCode: string;
  solution: string;
  image: ImagePlaceholder;
  expectedOutput?: string;
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
  {
    id: 1,
    title: "The Journey Begins",
    description: "You are a young adventurer in the village of Scripton. Your journey to become a Python master begins now. Your first task is to introduce yourself to the world.",
    challenge: "Use the `print()` function to output the text 'Hello, World!'",
    starterCode: "# Your code here\n",
    solution: "print('Hello, World!')",
    image: findImage('start-village'),
    expectedOutput: "Hello, World!",
    xp: 100,
    difficulty: 'Easy',
    hints: [
      "You need to use a special function to make text appear in the console.",
      "The function you're looking for is `print()`.",
      "Try writing `print()` with the text 'Hello, World!' inside the parentheses and quotes.",
    ],
  },
  {
    id: 2,
    title: "The Enchanted Forest of Variables",
    description: "You've entered the Enchanted Forest. A wise old owl asks for your name to grant you passage. You must store your name in a variable and then print it.",
    challenge: "Create a variable named `player_name` with your name as a string. Then print the variable.",
    starterCode: "# Create your variable here\nplayer_name = \"\"\n\n# Print your variable here\n",
    solution: "player_name = \"Alex\"\nprint(player_name)",
    image: findImage('enchanted-forest'),
    xp: 100,
    difficulty: 'Easy',
    hints: [
      "You need a way to store your name. In programming, we use 'variables' for that.",
      "Create a variable called `player_name` and assign your name to it using the `=` sign. Remember that text (strings) needs quotes around it.",
      "After creating the `player_name` variable, use the `print()` function to display its value.",
    ],
  },
  {
    id: 3,
    title: "The Dragon's Hoard of Numbers",
    description: "You've reached the dragon's cave! The dragon guards a treasure and will only share it if you can solve its riddle. The dragon has 120 gold coins and finds 55 more.",
    challenge: "Create two variables, `gold_coins` and `found_coins`. Add them together and print the total.",
    starterCode: "gold_coins = 120\nfound_coins = 55\n\n# Calculate and print the total\ntotal_coins = \n",
    solution: "total_coins = gold_coins + found_coins\nprint(total_coins)",
    image: findImage('dragons-cave'),
    expectedOutput: "175",
    xp: 150,
    difficulty: 'Medium',
    hints: [
      "To solve this, you first need to store the two numbers in variables.",
      "Once you have the variables, you can use the `+` operator to add them together and store the result in a new variable.",
      "Create a `total_coins` variable and set it to `gold_coins + found_coins`. Then print `total_coins`.",
    ],
  },
  {
    id: 4,
    title: "The Conditional Bridge",
    description: "You arrive at a chasm with a magical bridge. The bridge keeper will only let you pass if you can prove your wisdom in the art of conditionals.",
    challenge: "You have 10 mana potions. If you have 10 or more, print 'You may pass'. Otherwise, print 'You need more mana.'.",
    starterCode: "mana_potions = 10\n\n# Check if you have enough mana and print the result\n",
    solution: "if mana_potions >= 10:\n    print('You may pass')\nelse:\n    print('You need more mana.')",
    image: findImage('conditional-bridge'),
    expectedOutput: "You may pass",
    xp: 150,
    difficulty: 'Medium',
    hints: [
      "This problem requires you to make a decision in your code. An `if` statement is perfect for this.",
      "Your `if` statement should check if `mana_potions` is 'greater than or equal to' 10. The operator for this is `>=`.",
      "You'll need an `if` block for the success case and an `else` block for the other case.",
    ],
  },
  {
    id: 5,
    title: "The Spire of Loops",
    description: "You've reached a tall spire that seems to go on forever. To climb it, you must master the art of loops.",
    challenge: "A spell requires you to chant 'Abracadabra' 3 times. Use a for loop to print the chant on a new line for each time.",
    starterCode: "# Use a loop to print the chant 3 times\n",
    solution: "for i in range(3):\n    print('Abracadabra')",
    image: findImage('loop-spire'),
    expectedOutput: "Abracadabra\nAbracadabra\nAbracadabra",
    xp: 200,
    difficulty: 'Hard',
    hints: [
      "When you need to repeat an action a specific number of times, a `for` loop is the right tool.",
      "Python's `range()` function is often used with `for` loops. `for i in range(3):` will run the code inside it 3 times.",
      "Inside your loop, you just need a single `print()` statement for the chant.",
    ],
  },
];
