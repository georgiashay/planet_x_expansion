export const SERVER_URL = "planetx.shaytech.net";
// export const SERVER_URL = "localhost:8000";
const SECURE = true;
// const SECURE = false;
const URL_PREFIX = SECURE ? "https://" : "http://";
export const API_URL = URL_PREFIX + SERVER_URL;
export const WEBSOCKET_URL = "ws://" + SERVER_URL;
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
    locatePlanetXCost: 5,
    theoriesPerTurn: 1,
    conferences: [8],
    theoryPhaseInterval: 3,
    numTargets: 2,
    numObjects: {X: 1, E: 2, G: 2, D: 1, A: 4, C: 2}
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
    locatePlanetXCost: 5,
    theoriesPerTurn: 2,
    conferences: [6, 15],
    theoryPhaseInterval: 3,
    numTargets: 2,
    numObjects: {X: 1, E: 5, G: 2, D: 4, A: 4, C: 2}
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
    locatePlanetXCost: 5,
    theoriesPerTurn: 2,
    conferences: [6, 15, 21],
    theoryPhaseInterval: 3,
    numTargets: 3,
    numObjects: {X: 1, E: 6, G: 3, D: 4, A: 6, C: 3, B: 1}
  }
}

export const SeasonView: {[code: string]: {[info: string]: string | number}} = {
  SPRING: {
    name: "Spring",
    viewType: "Equinox",
    icon: "/assets/season_icons/spring.svg",
    angle: 0
  },
  SUMMER: {
    name: "Summer",
    viewType: "Solstice",
    icon: "/assets/season_icons/summer.svg",
    angle: 3*Math.PI/2
  },
  AUTUMN: {
    name: "Autumn",
    viewType: "Equinox",
    icon: "/assets/season_icons/fall.svg",
    angle: Math.PI
  },
  WINTER: {
    name: "Winter",
    viewType: "Solstice",
    icon: "/assets/season_icons/winter.svg",
    angle: Math.PI/2
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
