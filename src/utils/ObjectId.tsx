export default function objectId() {
  const rnd = (r16: number) => Math.floor(r16).toString(16);
  return rnd(Date.now() / 1000) +
    " ".repeat(16).replace(/./g, () => rnd(Math.random() * 16));
}
