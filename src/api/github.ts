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

export interface Problem {
  message: string
}

const ROOT_API_URL: string = 'https://api.github.com/'

export function buildURL(parts: string[], params?: object): URL {
  const url: URL = new URL(`${ROOT_API_URL}${parts.map(encodeURIComponent).join('/')}`)
  if (params) for (const [key, value] of Object.entries(params)) url.searchParams.append(key, value)
  return url
}

async function checkForProblem(response: Response): Promise<void> {
  if (response.status === 403) {
    const rateLimitResetEpoch: number = parseInt(response.headers.get('X-Ratelimit-Reset')!) * 1000
    const rateLimitReset: Date = new Date(rateLimitResetEpoch)
    const deltaMilliseconds: number = rateLimitResetEpoch - Date.now()
    throw Error(
      `GitHub rate limit exceeded for now. Reset at ${rateLimitReset.getHours()}:${rateLimitReset.getMinutes()} ` +
      `(in ${Math.round(deltaMilliseconds / 1000 / 60)} min).`
    )
  } else if (!response.ok) {
    const problem: Problem = await response.json()
    throw Error(problem.message)
  }
}

export async function fetchUserEventsPage(login: string, page: number): Promise<Event[]> {
    const url: URL = buildURL(['users', login, 'events'])
    url.searchParams.set('page', page.toString())
    const response: Response = await fetch(url.toString())
    await checkForProblem(response)
    const events: Event[] = await response.json()
    return events
}

export async function fetchUserEventsAll(login: string): Promise<Event[]> {
  const promises: Promise<Event[]>[] = []
  for (let page = 1; page <= 10; page++) promises.push(fetchUserEventsPage(login, page))
  const pages: Event[][] = await Promise.all(promises)
  return pages.flat()
}

export async function fetchSearchUsers(query: string): Promise<User[]> {
  const url: URL = buildURL(['search', 'users'], { q: query })
  const response: Response = await fetch(url.toString())
  await checkForProblem(response)
  const searchResults: SearchResults = await response.json()
  const users: User[] = searchResults.items
  return users
}

export async function fetchUser(login: string): Promise<User | null> {
  const url: URL = buildURL(['users', login])
  const response: Response = await fetch(url.toString())
  if (response.status === 404) return null
  await checkForProblem(response)
  const user: User = await response.json()
  return user
}
