export interface User {
  id: string
  login: string
  avatar_url: string
}

export interface SearchResults {
  total_count: number
  incomplete_results: boolean
  items: User[]
}

export interface Repo {
  id: string
  name: string
}

export interface Event {
  id: string
  type: string
  actor: User
  repo: Repo
}

const ROOT_API_URL: string = 'https://api.github.com/'

function buildURL(parts: string[], params?: object): URL {
  const url: URL = new URL(`${ROOT_API_URL}${parts.map(encodeURIComponent).join('/')}`)
  if (params) for (const [key, value] of Object.entries(params)) url.searchParams.append(key, value)
  return url
}

export async function fetchUserEvents(login: string, page = 1): Promise<Event[]> {
  if (page < 1 || page > 10) throw Error('only pages between 1 and 10 (inclusive) can be fetched')
  const url: URL = buildURL(['users', login, 'events'], { page: page })
  const response: Response = await fetch(url.toString())
  const events: Event[] = await response.json()
  return events
}

export async function fetchSearchUsers(query: string): Promise<User[]> {
  const url: URL = buildURL(['search', 'users'], { q: query })
  const response: Response = await fetch(url.toString())
  const searchResults: SearchResults = await response.json()
  const users: User[] = searchResults.items
  return users
}
