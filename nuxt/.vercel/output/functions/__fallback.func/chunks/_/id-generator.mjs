function randomDigits(length) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}
function generateNIS() {
  return randomDigits(8);
}
function generateNUPTK() {
  return randomDigits(8);
}

export { generateNIS as a, generateNUPTK as g };
//# sourceMappingURL=id-generator.mjs.map
