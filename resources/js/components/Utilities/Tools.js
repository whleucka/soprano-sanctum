const htmlDecode = (input) => {
    const doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
};
const mod = (x, n) => ((x % n) + n) % n;
export { htmlDecode, mod };
