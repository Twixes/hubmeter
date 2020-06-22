export interface User {
  id: string
  login: string
  avatar_url: string // eslint-disable-line camelcase
}

export interface SearchResults {
  total_count: number // eslint-disable-line camelcase
  incomplete_results: boolean // eslint-disable-line camelcase
  items: User[]
}

export interface Repo {
  id: string
  name: string
}

export enum EventType {
  CommitCommentEvent = 'CommitCommentEvent',
  CreateEvent = 'CreateEvent',
  DeleteEvent = 'DeleteEvent',
  ForkEvent = 'ForkEvent',
  GollumEvent = 'GollumEvent',
  IssueCommentEvent = 'IssueCommentEvent',
  IssuesEvent = 'IssuesEvent',
  MemberEvent = 'MemberEvent',
  PublicEvent = 'PublicEvent',
  PullRequestEvent = 'PullRequestEvent',
  PullRequestReviewCommentEvent = 'PullRequestReviewCommentEvent',
  PushEvent = 'PushEvent',
  ReleaseEvent = 'ReleaseEvent',
  SponsorshipEvent = 'SponsorshipEvent',
  WatchEvent = 'WatchEvent'
}

export interface Event {
  id: string
  type: EventType
  actor: User
  repo: Repo
  created_at: Date // eslint-disable-line camelcase
}

interface Problem {
  message: string
}

const ROOT_API_URL: string = 'https://api.github.com/'

async function checkForProblem(response: Response, ignoreStatuses: number[] = []): Promise<void> {
  if (response.status === 403) {
    const rateLimitResetEpoch: number = parseInt(response.headers.get('X-Ratelimit-Reset')!) * 1000
    const rateLimitReset: Date = new Date(rateLimitResetEpoch)
    const deltaMinutes: number = Math.ceil((rateLimitResetEpoch - Date.now()) / 60_000)
    throw Error(
      // eslint-disable-next-line no-irregular-whitespace
      `Exceeded GitHub rate limit for now. Try again in ${deltaMinutes} min ` +
      // eslint-disable-next-line no-irregular-whitespace
      `at ${rateLimitReset.getHours() % 12 || 12}:${rateLimitReset.getMinutes().toString().padStart(2, '0')} ` +
      `${rateLimitReset.getHours() >= 12 ? 'PM' : 'AM'}.`
    )
  } else if (!response.ok && !ignoreStatuses.includes(response.status)) {
    const problem: Problem = await response.json()
    throw Error(problem.message)
  }
}

export function buildURL(parts: string[], params?: object): URL {
  const url: URL = new URL(`${ROOT_API_URL}${parts.map(encodeURIComponent).join('/')}`)
  if (params) for (const [key, value] of Object.entries(params)) url.searchParams.append(key, value)
  return url
}

export async function fetchUserEventsPage(login: string, page: number): Promise<Event[]> {
  const url: URL = buildURL(['users', login, 'events'])
  url.searchParams.set('page', page.toString())
  const response: Response = await fetch(url.toString())
  await checkForProblem(response)
  const events: Event[] = await response.json()
  const eventsWithDates: Event[] = events.map(event => {
    return { ...event, created_at: new Date(event.created_at) }
  })
  return eventsWithDates
}

export async function fetchUserEventsPilot(login: string): Promise<[Event[], number]> {
  const url: URL = buildURL(['users', login, 'events'])
  url.searchParams.set('page', '1')
  const response: Response = await fetch(url.toString())
  await checkForProblem(response)
  const events: Event[] = await response.json()
  const eventsWithDates: Event[] = events.map(event => {
    return { ...event, created_at: new Date(event.created_at) }
  })
  const linkHeader: string | null = response.headers.get('link')
  let lastPageNumber: number = 1
  if (linkHeader) lastPageNumber = parseInt(linkHeader.match(/events\?page=(\d+)>; rel="last"/)![1])
  return [eventsWithDates, lastPageNumber]
}

export async function fetchUserEventsAll(login: string): Promise<Event[]> {
  const [pilotEvents, lastPageNumber] = await fetchUserEventsPilot(login)
  const promises: Promise<Event[]>[] = []
  for (let page = 2; page <= lastPageNumber; page++) promises.push(fetchUserEventsPage(login, page))
  const pages: Event[][] = await Promise.all(promises)
  return pages.flat().concat(pilotEvents)
}

export async function fetchSearchUsers(query: string): Promise<User[]> {
  const url: URL = buildURL(['search', 'users'], { q: query })
  const response: Response = await fetch(url.toString())
  await checkForProblem(response)
  const searchResults: SearchResults = await response.json()
  const users: User[] = searchResults.items
  return users
}

export async function fetchUser(login: string): Promise<User> {
  const url: URL = buildURL(['users', login])
  const response: Response = await fetch(url.toString())
  await checkForProblem(response, [404])
  // eslint-disable-next-line no-irregular-whitespace
  if (response.status === 404) throw Error(`User ${login} doesn't exist.`)
  const user: User = await response.json()
  return user
}
