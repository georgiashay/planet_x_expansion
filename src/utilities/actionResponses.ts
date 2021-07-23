import { initialToSectorElement, GOAL_OBJECT, EMPTY_OBJECT, SECTOR_NAME, CONFERENCE_NAME } from "@/constants.ts";

export default {
  survey(game: any, gameType: any, turn: number, time: Date, surveyObject: any, startSector: number, endSector: number) {
    let sectors;

    // Get slice of only sectors being surveyed
    if (endSector >= startSector) {
      sectors = game.board.objects.slice(startSector, endSector+1);
    } else {
      sectors = game.board.objects.slice(0, endSector+1)
                  .concat(game.board.objects.slice(startSector));
    }

    // Find the number of the object being surveyed
    const numObject = sectors.filter((obj: any) => {
      // If the object is an empty sector, include Planet X in the count
      if (surveyObject.initial === EMPTY_OBJECT.initial) {
        return obj.initial === surveyObject.initial || obj.initial === GOAL_OBJECT.initial;
      } else {
        return obj.initial === surveyObject.initial;
      }
    }).length;

    // Construct text for result
    let text;
    if (startSector !== endSector) {
      text = (numObject == 1) ? "There is " : "There are ";
      text += (numObject == 0) ? "no " : numObject + " ";
      if (surveyObject.initial === EMPTY_OBJECT.initial) {
        text += (numObject == 1) ? (SECTOR_NAME.name + " ") : (SECTOR_NAME.plural + " ");
        text += "that ";
        text += (numObject == 1) ? "appears " : "appear ";
        text += "empty in " + SECTOR_NAME.plural + " " + (startSector+1) + "-" + (endSector+1) + ".";
        text += (numObject == 1) ? "\nIt may be truly empty, or it may be " + GOAL_OBJECT.the + "." : (numObject == 0) ? "" : "\nThey may all be truly empty, but one of them might be " + GOAL_OBJECT.the + ".";
      } else {
        text += (numObject == 1) ? surveyObject.name : surveyObject.plural;
        text += " in " + SECTOR_NAME.plural + " " + (startSector+1) + "-" + (endSector+1) + ".";
      }
    } else {
      text = SECTOR_NAME.proper + " " + (endSector+1) + " ";
      if (surveyObject.initial === EMPTY_OBJECT.initial) {
        if (numObject == 0) {
          text += " does not appear empty.";
        } else {
          text += " appears empty. It may be truly empty, or it may be " + GOAL_OBJECT.the + ".";
        }
      } else {
        if (numObject == 0) {
          text += " is not " + surveyObject.one + ".";
        } else {
          text += " is " + surveyObject.one + ".";
        }
      }
    }

    // Text to be displayed in history
    const actionText = "Survey, " + surveyObject.proper + ", " + (startSector+1) + "-" + (endSector+1);

    // Calculate time cost for survey
    const timeCost = gameType.surveyCost.max + 1 - Math.ceil(sectors.length/gameType.surveyCost.interval);

    const actionResult = {
      actionType: "SURVEY",
      actionName: "Survey",
      actionText,
      text,
      timeCost,
      spaceObject: surveyObject,
      startSector: startSector,
      endSector: endSector,
      numObject,
      turn,
      time
    }

    return actionResult;
  },
  target(game: any, turn: number, time: Date, sectorNumber: number) {
    // Check what is in that sector
    let foundObject = game.board.objects[sectorNumber];
    foundObject = initialToSectorElement[foundObject.initial];

    // If it is Planet X, show that it appears empty
    if (foundObject.initial === GOAL_OBJECT.initial) {
      foundObject = EMPTY_OBJECT;
    }

    // Construct text for the result
    let text;
    if (foundObject.initial == EMPTY_OBJECT.initial) {
      text = SECTOR_NAME.proper + " " + (sectorNumber+1) + " appears empty.\nRemember, Planet X appears empty.";
    } else {
      text = "There is " + foundObject.one + " in " + SECTOR_NAME.name + " " + (sectorNumber+1) + ".";
    }

    // Text to be displayed in history
    const actionText = "Target, " + SECTOR_NAME.proper + " " + (sectorNumber+1);

    const actionResult = {
      actionType: "TARGET",
      actionName: "Target",
      actionText,
      text,
      timeCost: 4,
      sector: sectorNumber,
      spaceObject: foundObject,
      turn,
      time
    }

    return actionResult;
  },
  research(game: any, turn: number, time: Date, index: number) {
    // Get research at specific index
    const actionResult = {
      actionType: "RESEARCH",
      actionName: "Research",
      actionText: "Research " + String.fromCharCode(index+65) + ": " + game.research[index].categoryName,
      text: String.fromCharCode(index+65) + ". " + game.research[index].text,
      timeCost: 1,
      index,
      shortText: game.research[index].shortText,
      multiInitialText: game.research[index].multiInitialText,
      turn,
      time
    }

    return actionResult;
  },
  conference(game: any, turn: number, time: Date, index: number) {
    // Get conference at specific index
    const actionResult = {
      actionType: "CONFERENCE",
      actionName: GOAL_OBJECT.proper + " " + CONFERENCE_NAME.proper,
      actionText: CONFERENCE_NAME.proper + " " + GOAL_OBJECT.initial + (index+1) + ": " + game.conference[index].categoryName,
      text: GOAL_OBJECT.initial + (index + 1) + ". " + game.conference[index].text,
      index,
      shortText: game.conference[index].shortText,
      multiInitialText: game.conference[index].multiInitialText,
      turn,
      time
    }

    return actionResult;
  },
  locatePlanetX(game: any, turn: number, time: Date, sector: number, leftObject: any, rightObject: any) {
    const numSectors = game.board.objects.length;
    const leftSector = (sector == 0) ? numSectors - 1 : sector - 1;
    const rightSector = (sector == numSectors - 1) ? 0 : sector + 1;

    // Check if objects are all correct
    const found = game.board.objects[sector].initial === GOAL_OBJECT.initial &&
                  game.board.objects[leftSector].initial === leftObject.initial &&
                  game.board.objects[rightSector].initial === rightObject.initial;

    // Construct text depending on success or failure
    let text;
    let upperText;
    let actionText;

    const locationText = leftObject.initial + "-" + (sector+1) + "-" + rightObject.initial;
    if (found) {
      text = "Congratulations! You found " + GOAL_OBJECT.the + "!";
      upperText = "If you are the first to find " + GOAL_OBJECT.the + ",";
      actionText = "Locate " + GOAL_OBJECT.the + ", " + locationText + ", Success";
    } else {
      text = "You did not locate " + GOAL_OBJECT.the + ". At least one piece of information you entered was incorrect."
      upperText = "If no one has yet found " + GOAL_OBJECT.the + ",";
      actionText = "Locate " + GOAL_OBJECT.the + ", " + locationText + ", Fail";
    }

    const actionResult = {
      actionType: "LOCATE_PLANET_X",
      actionName: "Locate " + GOAL_OBJECT.the,
      actionText,
      text,
      upperText,
      success: found,
      timeCost: 5,
      sector,
      leftObject,
      rightObject,
      turn,
      time
    }

    return actionResult;
  },
  peerReview(game: any, turn: number, time: Date, sector: number, spaceObject: any) {
    // Check if theory object is correct
    const realObject = game.board.objects[sector];
    let text;
    if (realObject.initial === spaceObject.initial) {
      text = "Correct. " + SECTOR_NAME.proper + " " + (sector+1) + " has " + spaceObject.one + ".";
    } else {
      text = "Incorrect. " + SECTOR_NAME.proper + " " + (sector+1) + " does not have " + spaceObject.one + ".";
    }

    const actionResult = {
      actionType: "PEER_REVIEW",
      actionName: "Peer Review",
      text,
      turn,
      time
    }

    return actionResult;
  },
  theories(turn: number, time: Date, theories: Array<any>) {
    const actionText = "Submit Theories, " + theories.map((theory: any) => (theory.sector+1) + theory.spaceObject.initial).join(" ");
    const text = "Submitted theories: " + theories.map((theory: any) => {
      const spaceObject = initialToSectorElement[theory.spaceObject.initial];
      return SECTOR_NAME.proper + " " + (theory.sector+1) + " is " + spaceObject.one;
    }).join("; ") + ".";

    const actionResult = {
      actionType: "THEORY",
      actionName: "Submit Theories",
      actionText,
      text,
      turn,
      time,
      theories
    }

    return actionResult;
  },
  theoryReveal(turn: number, time: Date, theories: Array<any>) {
    const actionText = "Revealed Theories, " + theories.map((theory: any) => (theory.sector + 1) + (theory.spaceObject.initial) + ":" + (theory.accurate ? "✓" : "X")).join(" ");
    const text = "Revealed theories: " + theories.map((theory: any) => {
      return SECTOR_NAME.proper + " " + (theory.sector + 1) + " is " + (theory.accurate ? "" : "not ") + theory.spaceObject.one;
    }).join("; ") + ".";

    const actionResult = {
      actionType: "THEORY_REVEAL",
      actionName: "Revealed Theories",
      actionText,
      text,
      time,
      turn
    }

    return actionResult
  }
};
