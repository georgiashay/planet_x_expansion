export const IS_PROD = process.env.NODE_ENV === "production";
const SERVER_URL = IS_PROD ? "planetx.shaytech.net/api" : "localhost:7999";
const SELF_URL = IS_PROD ? "planetx.shaytech.net" : "localhost:8100";
const SECURE = IS_PROD;
const URL_PREFIX = SECURE ? "https://" : "http://";
const WS_PREFIX = SECURE ? "wss://" : "ws://";
export const API_URL = URL_PREFIX + SERVER_URL;
export const WEBSOCKET_URL = WS_PREFIX + SERVER_URL;
export const MY_URL = URL_PREFIX + SELF_URL;
export const THEME: "space" | "ocean" | "castle" = process.env.VUE_APP_THEME;
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
    numObjects: {
      "space": {X: 1, E: 2, G: 2, D: 1, A: 4, C: 2},
      "ocean": {O: 1, E: 2, D: 2, T: 1, S: 4, C: 2},
      "castle": {Q: 1, E: 2, J: 2, P: 1, K: 4, S: 2}
    }[THEME],
    logicSheetOrder: {
      "space": ['C', 'A', 'D', 'G', 'E', 'X'],
      "ocean": ['C', 'S', 'T', 'D', 'E', 'O'],
      "castle": ['S', 'K', 'P', 'J', 'E', 'Q']
    }[THEME],
    pointsOrder: {
      "space": ['A', 'C', 'G', 'D', 'X'],
      "ocean": ['S', 'C', 'D', 'T', 'O'],
      "castle": ['K', 'S', 'J', 'P', 'Q']
    }[THEME],
    constraintOrder: {
      "space": ['C', 'A', 'D', 'G', 'X', 'E'],
      "ocean": ['C', 'S', 'T', 'D', 'O', 'E'],
      "castle": ['S', 'K', 'P', 'J', 'Q', 'E']
    }[THEME],
    logicPatternInterval: 3,
    constraints: {
      "space": {
        "C": "Only in prime sectors",
        "A": "Adjacent to at least 1 other asteroid",
        "D": "Not adjacent to Planet X",
        "G": "Adjacent to at least 1 empty sector",
        "X": "Not adjacent to the dwarf planet, appears empty",
        "E": "Remember, Planet X appears empty"
      },
      "ocean": {
        "C": "Only in prime sectors",
        "S": "Adjacent to at least 1 other seahorse",
        "T": "Not adjacent to the octopus",
        "D": "Adjacent to at least 1 empty sector",
        "O": "Not adjacent to the turtle, appears empty",
        "E": "Remember, the octopus appears empty"
      },
      "castle": {
        "S": "Only in prime seats",
        "K": "Adjacent to at least 1 other knight",
        "P": "Not adjacent to the queen",
        "J": "Ajacent to at least 1 empty seat",
        "Q": "Not adjacent to the prince, appears empty",
        "E": "Remember, the queen's seat appears empty"
      }
    }[THEME],
    points: {
      "space": {
        "A": 2,
        "C": 3,
        "G": 4,
        "D": 4
      },
      "ocean": {
        "S": 2,
        "C": 3,
        "D": 4,
        "T": 4
      },
      "castle": {
        "K": 2,
        "S": 3,
        "J": 4,
        "P": 4
      }
    }[THEME]
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
    numObjects: {
      "space": {X: 1, E: 5, G: 2, D: 4, A: 4, C: 2},
      "ocean": {O: 1, E: 5, D: 2, T: 4, S: 4, C: 2},
      "castle": {Q: 1, E: 5, J: 2, P: 4, K: 4, S: 2}
    }[THEME],
    logicSheetOrder: {
      "space": ['C', 'A', 'D', 'G', 'E', 'X'],
      "ocean": ['C', 'S', 'T', 'D', 'E', 'O'],
      "castle": ['S', 'K', 'P', 'J', 'E', 'Q']
    }[THEME],
    pointsOrder: {
      "space": ['A', 'C', 'G', 'D', 'X'],
      "ocean": ['S', 'C', 'D', 'T', 'O'],
      "castle": ['K', 'S', 'J', 'P', 'Q']
    }[THEME],
    constraintOrder: {
      "space": ['C', 'A', 'D', 'G', 'X', 'E'],
      "ocean": ['C', 'S', 'T', 'D', 'O', 'E'],
      "castle": ['S', 'K', 'P', 'J', 'Q', 'E']
    }[THEME],
    logicPatternInterval: 3,
    constraints: {
      "space": {
        "C": "Only in prime sectors",
        "A": "Adjacent to at least 1 other asteroid",
        "D": "In a band of exactly 6, not adjacent to Planet X",
        "G": "Adjacent to at least 1 empty sector",
        "X": "Not adjacent to a dwarf planet, appears empty",
        "E": "Remember, Planet X appears empty"
      },
      "ocean": {
        "C": "Only in prime sectors",
        "S": "Adjacent to at least 1 other seahorse",
        "T": "In a band of exactly 6, not adjacent to the octopus",
        "D": "Adjacent to at least 1 empty sector",
        "O": "Not adjacent to a turtle, appears empty",
        "E": "Remember, the octopus appears empty"
      },
      "castle": {
        "S": "Only in prime seats",
        "K": "Adjacent to at least 1 other knight",
        "P": "In a band of exactly 6, not adjacent to the queen",
        "J": "Ajacent to at least 1 empty seat",
        "Q": "Not adjacent to a prince, appears empty",
        "E": "Remember, the queen's seat appears empty"
      }
    }[THEME],
    points: {
      "space": {
        "A": 2,
        "C": 3,
        "G": 4,
        "D": 2
      },
      "ocean": {
        "S": 2,
        "C": 3,
        "D": 4,
        "T": 2
      },
      "castle": {
        "K": 2,
        "S": 3,
        "J": 4,
        "P": 2
      }
    }[THEME]
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
    numObjects: {
      "space": {X: 1, E: 6, G: 3, D: 4, A: 6, C: 3, B: 1},
      "ocean": {O: 1, E: 6, D: 3, T: 4, S: 6, C: 3, R: 1},
      "castle": {Q: 1, E: 6, J: 3, P: 4, K: 6, S: 3, C: 1}
    }[THEME],
    logicSheetOrder: {
      "space": ['C', 'A', 'D', 'B', 'G', 'E', 'X'],
      "ocean": ['C', 'S', 'T', 'R', 'D', 'E', 'O'],
      "castle": ['S', 'K', 'P', 'C', 'J', 'E', 'Q']
    }[THEME],
    pointsOrder: {
      "space": ['A', 'C', 'G', 'D', 'B', 'X'],
      "ocean": ['S', 'C', 'D', 'T', 'R', 'O'],
      "castle": ['K', 'S', 'J', 'P', 'C', 'Q']
    }[THEME],
    constraintOrder: {
      "space": ['C', 'A', 'D', 'G', 'B', 'X', 'E'],
      "ocean": ['C', 'S', 'T', 'D', 'R', 'O', 'E'],
      "castle": ['S', 'K', 'P', 'J', 'C', 'Q', 'E']
    }[THEME],
    logicPatternInterval: 4,
    constraints: {
      "space": {
        "C": "Only in prime sectors",
        "A": "Adjacent to at least 1 other asteroid",
        "D": "In a band of exactly 6, not adjacent to Planet X",
        "G": "Adjacent to at least 1 empty sector",
        "B": "Not adjacent to an empty sector or Planet X",
        "X": "Not adjacent to a dwarf planet or the black hole, appears empty",
        "E": "Remember, Planet X appears empty"
      },
      "ocean": {
        "C": "Only in prime sectors",
        "S": "Adjacent to at least 1 other seahorse",
        "T": "n a band of exactly 6, not adjacent to the octopus",
        "D": "Adjacent to at least 1 empty sector",
        "R": "Not adjacent to an empty sector or the octopus",
        "O": "Not adjacent to a turtle or the remora, appears empty",
        "E": "Remember, the octopus appears empty"
      },
      "castle": {
        "S": "Only in prime seats",
        "K": "Adjacent to at least 1 other knight",
        "P": "In a band of exactly 6, not adjacent to the queen",
        "J": "Ajacent to at least 1 empty seat",
        "C": "Not adjacent to an empty seat or the queen",
        "Q": "Not adjacent to a prince or the chaplain, appears empty",
        "E": "Remember, the queen's seat appears empty"
      }
    }[THEME],
    points: {
      "space": {
        "A": 2,
        "D": 2,
        "C": 3,
        "G": 4,
        "B": 5
      },
      "ocean": {
        "S": 2,
        "T": 2,
        "C": 3,
        "D": 4,
        "R": 5
      },
      "castle": {
        "K": 2,
        "P": 2,
        "S": 3,
        "J": 4,
        "C": 5
      }
    }[THEME]
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

export const SectorElement: {[code: string]: {[prop: string]: string}} = {
  "space": {
    ASTEROID: {
      name: "asteroid",
      proper: "Asteroid",
      plural: "asteroids",
      properPlural: "Asteroids",
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
      properPlural: "Comets",
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
      properPlural: "Gas Clouds",
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
      properPlural: "Empty Sectors",
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
      properPlural: "Black Holes",
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
      properPlural: "Planet Xs",
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
      properPlural: "Dwarf Planets",
      one: "a dwarf planet",
      the: "the dwarf planet",
      initial: "D",
      icon: "/assets/space_object_icons/dwarf_planet.svg",
      iconShort: "/assets/space_object_icons/dwarf_planet_short.svg",
      iconFull: "/assets/space_object_icons/dwarf_planet_full.svg"
    }
  },
  "ocean": {
    SEAHORSE: {
      name: "seahorse",
      proper: "Seahorse",
      plural: "seahorses",
      properPlural: "Seahorses",
      one: "a seahorse",
      the: "the seahorse",
      initial: "S",
      icon: "/assets/ocean_animal_icons/seahorse.svg",
      iconShort: "/assets/ocean_animal_icons/seahorse_short.svg",
      iconFull: "/assets/ocean_animal_icons/seahorse_full.svg"
    },
    CRAB: {
      name: "crab",
      proper: "Crab",
      plural: "crabs",
      properPlural: "Crabs",
      one: "a crab",
      the: "the crab",
      initial: "C",
      icon: "/assets/ocean_animal_icons/crab.svg",
      iconShort: "/assets/ocean_animal_icons/crab_short.svg",
      iconFull: "/assets/ocean_animal_icons/crab_full.svg"
    },
    DOLPHIN: {
      name: "dolphin",
      proper: "Dolphin",
      plural: "dolphins",
      properPlural: "Dolphins",
      one: "a dolphin",
      the: "the dolphin",
      initial: "D",
      icon: "/assets/ocean_animal_icons/dolphin.svg",
      iconShort: "/assets/ocean_animal_icons/dolphin_short.svg",
      iconFull: "/assets/ocean_animal_icons/dolphin_full.svg"
    },
    EMPTY: {
      name: "empty sector",
      proper: "Empty Sector",
      plural: "empty sectors",
      properPlural: "Empty Sectors",
      one: "an empty sector",
      the: "the empty sector",
      initial: "E",
      icon: "/assets/ocean_animal_icons/empty.svg",
      iconShort: "/assets/ocean_animal_icons/empty_short.svg",
      iconFull: "/assets/ocean_animal_icons/empty_full.svg"
    },
    REMORA: {
      name: "remora",
      proper: "Remora",
      plural: "remoras",
      properPlural: "Remoras",
      one: "a remora",
      the: "the remora",
      initial: "R",
      icon: "/assets/ocean_animal_icons/remora.svg",
      iconShort: "/assets/ocean_animal_icons/remora_short.svg",
      iconFull: "/assets/ocean_animal_icons/remora_full.svg"
    },
    OCTOPUS: {
      name: "octopus",
      proper: "The Octopus",
      plural: "ocotopuses",
      properPlural: "Octopuses",
      one: "an octopus",
      the: "the octopus",
      initial: "O",
      icon: "/assets/ocean_animal_icons/octopus.svg",
      iconShort: "/assets/ocean_animal_icons/octopus_short.svg",
      iconFull: "/assets/ocean_animal_icons/octopus_full.svg"
    },
    TURTLE: {
      name: "turtle",
      proper: "Turtle",
      plural: "turtles",
      properPlural: "Turtles",
      one: "a turtle",
      the: "the turtle",
      initial: "T",
      icon: "/assets/ocean_animal_icons/turtle.svg",
      iconShort: "/assets/ocean_animal_icons/turtle_short.svg",
      iconFull: "/assets/ocean_animal_icons/turtle_full.svg"
    }
  },
  "castle": {
    KNIGHT: {
      name: "knight",
      proper: "Knight",
      plural: "knights",
      properPlural: "Knights",
      one: "a knight",
      the: "the knight",
      initial: "K",
      icon: "/assets/round_table_icons/knight.svg",
      iconShort: "/assets/round_table_icons/knight_short.svg",
      iconFull: "/assets/round_table_icons/knight_full.svg"
    },
    COURT_SCHOLAR: {
      name: "court scholar",
      proper: "Court Scholar",
      plural: "court scholars",
      properPlural: "Court Scholars",
      one: "a court scholar",
      the: "the court scholar",
      initial: "S",
      icon: "/assets/round_table_icons/court_scholar.svg",
      iconShort: "/assets/round_table_icons/court_scholar_short.svg",
      iconFull: "/assets/round_table_icons/court_scholar_full.svg"
    },
    JESTER: {
      name: "jester",
      proper: "Jester",
      plural: "jesters",
      properPlural: "Jesters",
      one: "a jester",
      the: "the jester",
      initial: "J",
      icon: "/assets/round_table_icons/jester.svg",
      iconShort: "/assets/round_table_icons/jester_short.svg",
      iconFull: "/assets/round_table_icons/jester_full.svg"
    },
    EMPTY: {
      name: "empty seat",
      proper: "Empty Seat",
      plural: "empty seat",
      properPlural: "Empty Seats",
      one: "an empty seat",
      the: "the empty seat",
      initial: "E",
      icon: "/assets/round_table_icons/empty.svg",
      iconShort: "/assets/round_table_icons/empty_short.svg",
      iconFull: "/assets/round_table_icons/empty_full.svg"
    },
    CHAPLAIN: {
      name: "chaplain",
      proper: "Chaplain",
      plural: "chaplains",
      properPlural: "Chaplains",
      one: "a chaplain",
      the: "the chaplain",
      initial: "C",
      icon: "/assets/round_table_icons/chaplain.svg",
      iconShort: "/assets/round_table_icons/chaplain_short.svg",
      iconFull: "/assets/round_table_icons/chaplain_full.svg"
    },
    QUEEN: {
      name: "queen",
      proper: "The Queen",
      plural: "queens",
      properPlural: "Queens",
      one: "a queen",
      the: "the queen",
      initial: "Q",
      icon: "/assets/round_table_icons/queen.svg",
      iconShort: "/assets/round_table_icons/queen_short.svg",
      iconFull: "/assets/round_table_icons/queen_full.svg"
    },
    PRINCE: {
      name: "prince",
      proper: "Prince",
      plural: "princes",
      properPlural: "Princes",
      one: "a prince",
      the: "the prince",
      initial: "P",
      icon: "/assets/round_table_icons/prince.svg",
      iconShort: "/assets/round_table_icons/prince_short.svg",
      iconFull: "/assets/round_table_icons/prince_full.svg"
    }
  }
}[THEME];

export const GOAL_OBJECT = {
  "space": SectorElement.PLANET_X,
  "ocean": SectorElement.OCTOPUS,
  "castle": SectorElement.QUEEN
}[THEME];

export const EMPTY_OBJECT = {
  "space": SectorElement.EMPTY,
  "ocean": SectorElement.EMPTY,
  "castle": SectorElement.EMPTY
}[THEME];

export const PRIME_OBJECT = {
  "space": SectorElement.COMET,
  "ocean": SectorElement.CRAB,
  "castle": SectorElement.COURT_SCHOLAR
}[THEME];

export const CLUSTERED_OBJECT = {
  "space": SectorElement.ASTEROID,
  "ocean": SectorElement.SEAHORSE,
  "castle": SectorElement.KNIGHT
}[THEME];

export const NEEDS_SPACE_OBJECT = {
  "space": SectorElement.GAS_CLOUD,
  "ocean": SectorElement.DOLPHIN,
  "castle": SectorElement.JESTER
}[THEME];

export const BANDED_OBJECT = {
  "space": SectorElement.DWARF_PLANET,
  "ocean": SectorElement.TURTLE,
  "castle": SectorElement.PRINCE
}[THEME];

export const SURROUNDED_OBJECT = {
  "space": SectorElement.BLACK_HOLE,
  "ocean": SectorElement.REMORA,
  "castle": SectorElement.CHAPLAIN
}[THEME];

interface Name {
  name: string;
  plural: string;
  proper: string;
  properPlural: string;
}

export const SECTOR_NAME: Name = {
  "space": {
    name: "sector",
    plural: "sectors",
    proper: "Sector",
    properPlural: "Sectors"
  },
  "ocean": {
    name: "sector",
    plural: "sectors",
    proper: "Sector",
    properPlural: "Sectors"
  },
  "castle": {
    name: "seat",
    plural: "seats",
    proper: "Seat",
    properPlural: "Seats"
  }
}[THEME];

export const OBJECT_NAME: Name = {
  "space": {
    name: "object",
    plural: "objects",
    proper: "Object",
    properPlural: "Objects"
  },
  "ocean": {
    name: "animal",
    plural: "animals",
    proper: "Animal",
    properPlural: "Animals"
  },
  "castle": {
    name: "person",
    plural: "people",
    proper: "Person",
    properPlural: "People"
  }
}[THEME];

export const THEME_NAME: Name = {
  "space": {
    name: "space",
    plural: "spaces",
    proper: "Space",
    properPlural: "Spaces"
  },
  "ocean": {
    name: "ocean",
    plural: "oceans",
    proper: "Ocean",
    properPlural: "Oceans"
  },
  "castle": {
    name: "castle",
    plural: "castles",
    proper: "Castle",
    properPlural: "Castles"
  }
}[THEME];

export const SKY_NAME: Name = {
  "space": {
    name: "sky",
    plural: "skies",
    proper: "Sky",
    properPlural: "Skies"
  },
  "ocean": {
    name: "radar",
    plural: "radars",
    proper: "Radar",
    properPlural: "Radars"
  },
  "castle": {
    name: "table",
    plural: "tables",
    proper: "Table",
    properPlural: "Tables"
  }
}[THEME];

export const initialToSectorElement: {[initial: string]: any} = {};
for (const code in SectorElement) {
  initialToSectorElement[SectorElement[code].initial] = SectorElement[code];
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

export const INNER_WHEEL_COLORS = ["#4379d1", "#d14d4d", "#65b85c", "#ccc84b"];
