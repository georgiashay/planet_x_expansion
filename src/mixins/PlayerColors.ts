const distinctColors = [
  "#0000ff", // blue
  "#ff0000", // red
  "#ffff00", // yellow
  "#7fff00", // chartreuse
  "#ffa500", // orange
  "#ff00ff", // fuchsia
  "#00fa9a", // mediumspringgreen
  "#00ffff", // aqua
  "#ffa07a", // lightsalmon
  "#d8bfd8", // thistle
  "#eee8aa", // palegoldenrod
  "#4169e1", // royalblue
  "#808000", // olive
  "#da70d6", // orchid
  "#00bfff", // deepskyblue
  "#2e8b57", // seagreen
  "#b03060", // maroon3
  "#2e8b57", // seagreen
  "#8b0000", // darkred
  "#2f4f4f", // darkslategray
];

export default {
  methods: {
    playerColor: function (playerNum: number): string {
      return distinctColors[(playerNum-1) % distinctColors.length];
    },
    playerStyle: function(playerNum: number): any {
      return {
        "--player-color": this.playerColor(playerNum)
      }
    }
  }
};
