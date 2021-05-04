// Colors are at assets/css/coursecolors.css
export default {
  data: function () {
    return {
      colors: [
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
      ]
    };
  },
  methods: {
    playerColor: function (playerNum) {
      return this.colors[(playerNum-1) % this.colors.length];
    },
    playerStyle: function(playerNum) {
      return {
        "--player-color": this.playerColor(playerNum)
      }
    }
  }
};
