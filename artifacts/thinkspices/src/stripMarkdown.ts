export function stripMarkdown(text: string = ""): string {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")      // **bold** → bold
    .replace(/\*(.*?)\*/g, "$1")           // *italic* → italic
    .replace(/#{1,6}\s/g, "")             // ### headers → plain
    .replace(/^\s*[-•]\s/gm, "• ")       // normalize bullets
    .replace(/`(.*?)`/g, "$1")            // `code` → plain
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")  // [link](url) → link text
    .replace(/\*/g, "")                  // catch-all: strip all leftover asterisks completely to protect aesthetics
    .trim();
}
