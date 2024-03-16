export function generateId(len = 5) {
  let id = "";
  let chars = "abcdefghijklmnopqrstuvqxyz1234567890";
  for (let i = 0; i < len; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

// example: "hej jag älskar kläder" converts to "hej-jag-alskar-klader"
export function slugifyString(str: string): string {
  const slug = str
    .trim()
    .toLowerCase()
    .replace(/å|ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/&/g, "and")
    .replaceAll(" ", "-");

  return slug;
}

export function firstLetterToUpperCase(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}
