export const capitalize = function(text: string): string {
  return text.split(" ").map((word: string) => word.substring(0,1).toUpperCase() + word.substring(1)).join(" ");
}
