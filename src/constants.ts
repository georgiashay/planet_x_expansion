const IS_PROD = process.env.NODE_ENV === "production";
const SERVER_URL = IS_PROD ? "planetx.shaytech.net/api" : "localhost:8000";
const SECURE = IS_PROD;
const URL_PREFIX = SECURE ? "https://" : "http://";
const WS_PREFIX = SECURE ? "wss://" : "ws://";
export const API_URL = URL_PREFIX + SERVER_URL;
export const WEBSOCKET_URL = WS_PREFIX + SERVER_URL;
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
    numObjects: {X: 1, E: 2, G: 2, D: 1, A: 4, C: 2},
    logicSheetOrder: ['C', 'A', 'D', 'G', 'E', 'X'],
    logicPatternInterval: 3,
    constraints: {
      "C": "Only in prime sectors",
      "A": "Adjacent to an asteroid",
      "D": "Not adjacent to Planet X",
      "G": "Adjacent to an empty sector",
      "E": "Remember, Planet X appears empty",
      "X": "Not adjacent to the dwarf planet, appears empty"
    },
    points: {
      "A": 2,
      "C": 3,
      "G": 4,
      "D": 4
    }
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
    numObjects: {X: 1, E: 5, G: 2, D: 4, A: 4, C: 2},
    logicSheetOrder: ['C', 'A', 'D', 'G', 'E', 'X'],
    logicPatternInterval: 3,
    constraints: {
      "C": "Only in prime sectors",
      "A": "Adjacent to an asteroid",
      "D": "In a band of exactly 6, not adjacent to Planet X",
      "G": "Adjacent to an empty sector",
      "E": "Remember, Planet X appears empty",
      "X": "Not adjacent to a dwarf planet, appears empty"
    },
    points: {
      "A": 2,
      "C": 3,
      "G": 4,
      "D": 2
    }
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
    numObjects: {X: 1, E: 6, G: 3, D: 4, A: 6, C: 3, B: 1},
    logicSheetOrder: ['C', 'A', 'D', 'B', 'G', 'E', 'X'],
    logicPatternInterval: 4,
    constraints: {
      "C": "Only in prime sectors",
      "A": "Adjacent to an asteroid",
      "D": "In a band of exactly 6, not adjacent to Planet X",
      "G": "Adjacent to an empty sector",
      "E": "Not adjacent to the black hole. Remember, Planet X appears empty",
      "B": "Not adjacent to an empty sector or Planet X",
      "X": "Not adjacent to a dwarf planet or the black hole, appears empty"
    },
    points: {
      "A": 2,
      "D": 2,
      "C": 3,
      "G": 4,
      "B": 5
    }
  }
}

export const SeasonView: {[code: string]: {[info: string]: string | number}} = {
  SPRING: {
    name: "Spring",
    viewType: "Equinox",
    icon: "/assets/season_icons/spring.svg",
		iconShort: "/assets/season_icons/spring_short.svg",
		iconFull: "/assets/season_icons/spring_full.svg",
    angle: 0
  },
  SUMMER: {
    name: "Summer",
    viewType: "Solstice",
    icon: "/assets/season_icons/summer.svg",
		iconShort: "/assets/season_icons/summer_short.svg",
		iconFull: "/assets/season_icons/summer_full.svg",
    angle: 3*Math.PI/2
  },
  AUTUMN: {
    name: "Autumn",
    viewType: "Equinox",
    icon: "/assets/season_icons/fall.svg",
		iconShort: "/assets/season_icons/fall_short.svg",
		iconFull: "/assets/season_icons/fall_full.svg",
    angle: Math.PI
  },
  WINTER: {
    name: "Winter",
    viewType: "Solstice",
    icon: "/assets/season_icons/winter.svg",
		iconShort: "/assets/season_icons/winter_short.svg",
		iconFull: "/assets/season_icons/winter_full.svg",
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
    icon: "/assets/space_object_icons/asteroid.svg",
		iconShort: "/assets/space_object_icons/asteroid_short.svg",
		iconFull: "/assets/space_object_icons/asteroid_full.svg"
  },
  COMET: {
    name: "comet",
    proper: "Comet",
    plural: "comets",
    one: "a comet",
    the: "the comet",
    initial: "C",
    icon: "/assets/space_object_icons/comet.svg",
		iconShort: "/assets/space_object_icons/comet_short.svg",
		iconFull: "/assets/space_object_icons/comet_full.svg"
  },
  GAS_CLOUD: {
    name: "gas cloud",
    proper: "Gas Cloud",
    plural: "gas clouds",
    one: "a gas cloud",
    the: "the gas cloud",
    initial: "G",
    icon: "/assets/space_object_icons/gas_cloud.svg",
		iconShort: "/assets/space_object_icons/gas_cloud_short.svg",
		iconFull: "/assets/space_object_icons/gas_cloud_full.svg"
  },
  EMPTY: {
    name: "empty sector",
    proper: "Empty Sector",
    plural: "empty sectors",
    one: "an empty sector",
    the: "the empty sector",
    initial: "E",
    icon: "/assets/space_object_icons/empty.svg",
		iconShort: "/assets/space_object_icons/empty_short.svg",
		iconFull: "/assets/space_object_icons/empty_full.svg"
  },
  BLACK_HOLE: {
    name: "black hole",
    proper: "Black Hole",
    plural: "black holes",
    one: "a black hole",
    the: "the black hole",
    initial: "B",
    icon: "/assets/space_object_icons/black_hole.svg",
		iconShort: "/assets/space_object_icons/black_hole_short.svg",
		iconFull: "/assets/space_object_icons/black_hole_full.svg"
  },
  PLANET_X: {
    name: "Planet X",
    proper: "Planet X",
    plural: "Planet Xs",
    one: "a Planet X",
    the: "Planet X",
    initial: "X",
    icon: "/assets/space_object_icons/planet_x.svg",
		iconShort: "/assets/space_object_icons/planet_x_short.svg",
		iconFull: "/assets/space_object_icons/planet_x_full.svg"
  },
  DWARF_PLANET: {
    name: "dwarf planet",
    proper: "Dwarf Planet",
    plural: "dwarf planets",
    one: "a dwarf planet",
    the: "the dwarf planet",
    initial: "D",
    icon: "/assets/space_object_icons/dwarf_planet.svg",
		iconShort: "/assets/space_object_icons/dwarf_planet_short.svg",
		iconFull: "/assets/space_object_icons/dwarf_planet_full.svg"
  }
}

export const initialToSpaceObject: {[initial: string]: any} = {};
for (const code in SpaceObject) {
  initialToSpaceObject[SpaceObject[code].initial] = SpaceObject[code];
}

interface SuspicionLevel {
  level: number;
  name: string;
  color: string;
}

export const SUSPICION_LEVELS: Array<SuspicionLevel> = [
  {
    level: 0,
    name: "Certain",
    color: "--ion-color-light-contrast"
  },
  {
    level: 1,
    name: "Uncertain",
    color: "--ion-color-tertiary"
  }
];
