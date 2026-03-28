import type { Quote } from '../types';

export const quotes: Quote[] = [
  {
    text: "In ancient times cats were worshipped as gods; they have not forgotten this.",
    author: "Terry Pratchett"
  },
  {
    text: "Time spent with cats is never wasted.",
    author: "Sigmund Freud"
  },
  {
    text: "The greatness of a nation and its moral progress can be judged by the way its animals are treated.",
    author: "Mahatma Gandhi"
  },
  {
    text: "I have studied many philosophers and many cats. The wisdom of cats is infinitely superior.",
    author: "Hippolyte Taine"
  },
  {
    text: "A day without sunshine is like, you know, night.",
    author: "Steve Martin"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein"
  },
  {
    text: "Cats choose us; we don't own them.",
    author: "Kristin Cast"
  },
  {
    text: "The trouble with cats is that they've got no respect for human superstition.",
    author: "P.G. Wodehouse"
  },
  {
    text: "Type fast, make mistakes, learn faster. That is the way of the keyboard warrior.",
    author: "Unknown"
  },
  {
    text: "Practice makes perfect, but nobody's perfect, so why practice?",
    author: "Billie Joe Armstrong"
  },
  {
    text: "The best preparation for tomorrow is doing your best today.",
    author: "H. Jackson Brown Jr."
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "There are two means of refuge from the miseries of life: music and cats.",
    author: "Albert Schweitzer"
  },
  {
    text: "If you want to write fast, first learn to write well.",
    author: "Unknown"
  },
  {
    text: "A happy cat means a happy life, and a fast typist means more coffee breaks.",
    author: "Anonymous"
  },
  {
    text: "Cats are connoisseurs of comfort.",
    author: "James Herriot"
  },
  {
    text: "Every day is a new beginning. Take a deep breath, smile, and start again.",
    author: "Unknown"
  },
  {
    text: "Not all those who wander are lost.",
    author: "J.R.R. Tolkien"
  },
  {
    text: "The more I learn about people, the more I like my cat.",
    author: "Mark Twain"
  }
];

export function getRandomQuote(): Quote {
  return quotes[Math.floor(Math.random() * quotes.length)];
}
