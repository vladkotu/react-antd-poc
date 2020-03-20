const fetchIt = async (u, opts = {}) => {
  console.log(u)

  let url = new URL(u)
  const { searchParams, ...fetchOpts } = opts
  if (searchParams) {
    const paramsStr = new URLSearchParams(searchParams).toString()
    url = `${url}?${paramsStr}`
  }
  const body = await fetch(url, fetchOpts)
  return await body.json()
}

export default fetchIt
