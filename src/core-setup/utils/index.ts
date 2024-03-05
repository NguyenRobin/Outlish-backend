export function generateId(len = 5) {
  let id = "";
  let chars = "abcdefghijklmnopqrstuvqxyz1234567890";
  for (let i = 0; i < len; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}
