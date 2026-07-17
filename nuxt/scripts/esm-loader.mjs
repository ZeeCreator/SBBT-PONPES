import { normalizeSpecifier } from './normalize-specifier.mjs'

export async function resolve(specifier, context, nextResolve) {
  const normalized = normalizeSpecifier(specifier)
  return nextResolve(normalized, context)
}
