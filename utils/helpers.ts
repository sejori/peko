export const mergeHeaders = (base: Headers, source: Headers) => {
  for (const pair of source) {
    base.set(pair[0], pair[1])
  }

  return base
}

