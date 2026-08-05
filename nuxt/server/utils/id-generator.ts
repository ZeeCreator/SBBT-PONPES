function randomDigits(length: number): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString()
  }
  return result
}

export function generateNIS(): string {
  return randomDigits(8)
}

export function generateNUPTK(): string {
  return randomDigits(8)
}
