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
  },
  {
    id: 2,
    title: "The Enchanted Forest of Variables",
    description: "You've entered the Enchanted Forest. A wise old owl asks for your name to grant you passage. You must store your name in a variable and then print it.",
    challenge: "Create a variable named `player_name` with your name as a string. Then print the variable.",
    starterCode: "# Create your variable here\nplayer_name = \"\"\n\n# Print your variable here\n",
    solution: "print(player_name)",
    image: findImage('enchanted-forest'),
  },
  {
    id: 3,
    title: "The Dragon's Hoard of Numbers",
    description: "You've reached the dragon's cave! The dragon guards a treasure and will only share it if you can solve its riddle. The dragon has 120 gold coins and finds 55 more.",
    challenge: "Create two variables, `gold_coins` and `found_coins`. Add them together and print the total.",
    starterCode: "gold_coins = 120\nfound_coins = 55\n\n# Calculate and print the total\ntotal_coins = \n",
    solution: "total_coins = gold_coins + found_coins\nprint(total_coins)",
    image: findImage('dragons-cave'),
  },
];
