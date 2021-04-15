export const SERVER_URL = "https://planetx.shaytech.net";
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

export const SpaceObject: {[code: string]: {[prop: string]: string}} = {
  ASTEROID: {
    name: "asteroid",
    proper: "Asteroid",
    plural: "asteroids",
    one: "an asteroid",
    the: "the asteroid",
    initial: "A"
  },
  COMET: {
    name: "comet",
    proper: "Comet",
    plural: "comets",
    one: "a comet",
    the: "the comet",
    initial: "C"
  },
  GAS_CLOUD: {
    name: "gas cloud",
    proper: "Gas Cloud",
    plural: "gas clouds",
    one: "a gas cloud",
    the: "the gas cloud",
    initial: "G"
  },
  EMPTY: {
    name: "empty sector",
    proper: "Empty Sector",
    plural: "empty sectors",
    one: "an empty sector",
    the: "the empty sector",
    initial: "E"
  },
  BLACK_HOLE: {
    name: "black hole",
    proper: "Black Hole",
    plural: "black holes",
    one: "a black hole",
    the: "the black hole",
    initial: "B"
  },
  PLANET_X: {
    name: "Planet X",
    proper: "Planet X",
    plural: "Planet Xs",
    one: "a Planet X",
    the: "Planet X",
    initial: "X"
  },
  DWARF_PLANET: {
    name: "dwarf planet",
    proper: "Dwarf Planet",
    plural: "dwarf planets",
    one: "a dwarf planet",
    the: "the dwarf planet",
    initial: "D"
  }
}
