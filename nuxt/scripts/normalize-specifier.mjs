export function normalizeSpecifier(specifier) {
  const withFilePrefixStripped = specifier.replace(/^file:[\\/]*/i, '')
  const isWindowsAbs = /^[A-Za-z]:[\\/]/.test(withFilePrefixStripped)
  const isBareWindowsAbs = /^[A-Za-z]:[\\/]/.test(specifier)

  if (isWindowsAbs) {
    return 'file:///' + withFilePrefixStripped.replace(/\\/g, '/')
  }
  if (isBareWindowsAbs) {
    return 'file:///' + specifier.replace(/\\/g, '/')
  }
  return specifier
}
