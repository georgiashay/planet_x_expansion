// export const SERVER_URL = "https://planetx.shaytech.net";
export const SERVER_URL = "http://localhost:8000";
export const GAME_TYPES: {[sector: number]: any} = {
  12: {
    name: "Standard",
    sectors: 12,
    difficulties: [
      {
        facts: 12,
        name: "Youth"
      },
      {
        facts: 8,
        name: "Beginner"
      },
      {
        facts: 4,
        name: "Experienced"
      },
      {
        facts: 0,
        name: "Genius"
      }
    ],
    surveyCost: {
      min: 3,
      max: 4,
      interval: 3
    },
    targetCost: 4,
    researchCost: 1,
    locatePlanetXCost: 5
  },
  18: {
    name: "Expert",
    sectors: 18,
    difficulties: [
      {
        facts: 12,
        name: "Youth"
      },
      {
        facts: 8,
        name: "Beginner"
      },
      {
        facts: 4,
        name: "Experienced"
      },
      {
        facts: 0,
        name: "Genius"
      }
    ],
    surveyCost: {
      min: 2,
      max: 4,
      interval: 3
    },
    targetCost: 4,
    researchCost: 1,
    locatePlanetXCost: 5
  },
  24: {
    name: "Ace",
    sectors: 24,
    difficulties: [
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
    ],
    surveyCost: {
      min: 2,
      max: 4,
      interval: 4
    },
    targetCost: 4,
    researchCost: 1,
    locatePlanetXCost: 5
  }
}

export const SeasonView: {[code: string]: {[info: string]: string}} = {
  SPRING: {
    name: "Spring",
    viewType: "Equinox",
    icon: "/assets/season_icons/spring.svg"
  },
  SUMMER: {
    name: "Summer",
    viewType: "Solstice",
    icon: "/assets/season_icons/summer.svg"
  },
  AUTUMN: {
    name: "Autumn",
    viewType: "Equinox",
    icon: "/assets/season_icons/fall.svg"
  },
  WINTER: {
    name: "Winter",
    viewType: "Solstice",
    icon: "/assets/season_icons/winter.svg"
  }
};

export const SpaceObject: {[code: string]: {[prop: string]: string}} = {
  ASTEROID: {
    name: "asteroid",
    proper: "Asteroid",
    plural: "asteroids",
    one: "an asteroid",
    the: "the asteroid",
    initial: "A",
    icon: "/assets/space_object_icons/asteroid.svg"
  },
  COMET: {
    name: "comet",
    proper: "Comet",
    plural: "comets",
    one: "a comet",
    the: "the comet",
    initial: "C",
    icon: "/assets/space_object_icons/comet.svg"
  },
  GAS_CLOUD: {
    name: "gas cloud",
    proper: "Gas Cloud",
    plural: "gas clouds",
    one: "a gas cloud",
    the: "the gas cloud",
    initial: "G",
    icon: "/assets/space_object_icons/gas_cloud.svg"
  },
  EMPTY: {
    name: "empty sector",
    proper: "Empty Sector",
    plural: "empty sectors",
    one: "an empty sector",
    the: "the empty sector",
    initial: "E",
    icon: "/assets/space_object_icons/empty.svg"
  },
  BLACK_HOLE: {
    name: "black hole",
    proper: "Black Hole",
    plural: "black holes",
    one: "a black hole",
    the: "the black hole",
    initial: "B",
    icon: "/assets/space_object_icons/black_hole.svg"
  },
  PLANET_X: {
    name: "Planet X",
    proper: "Planet X",
    plural: "Planet Xs",
    one: "a Planet X",
    the: "Planet X",
    initial: "X",
    icon: "/assets/space_object_icons/planet_x.svg"
  },
  DWARF_PLANET: {
    name: "dwarf planet",
    proper: "Dwarf Planet",
    plural: "dwarf planets",
    one: "a dwarf planet",
    the: "the dwarf planet",
    initial: "D",
    icon: "/assets/space_object_icons/dwarf_planet.svg"
  }
}

export const initialToSpaceObject: {[initial: string]: any} = {};
for (const code in SpaceObject) {
  initialToSpaceObject[SpaceObject[code].initial] = SpaceObject[code];
}
