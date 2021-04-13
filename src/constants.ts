export const SERVER_URL = "http://localhost:8000";
export const GAME_TYPES: {[sector: number]: string} = {
  12: "Standard",
  18: "Expert",
  24: "Ace"
}
export const Equinox: {[name: string]: string} = {
  SPRING: "Spring",
  SUMMER: "Summer",
  AUTUMN: "Autumn",
  WINTER: "Winter"
};

export const DIFFICULTY_LEVELS = [
  {
    facts: 18,
    name: "Youth"
  },
  {
    facts: 12,
    name: "Beginner"
  },
  {
    facts: 6,
    name: "Experienced"
  },
  {
    facts: 0,
    name: "Genius"
  }
]
