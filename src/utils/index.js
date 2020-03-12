export const preventAndCall = (f, ...args) => ev => {
  ev.preventDefault()
  return f.call(null, ...args)
}

export const randomNumBut = (from, to, exclude = [], retries = 10) => {
  const id = f.random.number({ min: from, max: to })
  if (-1 === exclude.indexOf(id)) {
    return id
  } else if (0 === retries) {
    return undefined
  } else {
    randomNumBut(from, to, exclude, --retries)
  }
}
