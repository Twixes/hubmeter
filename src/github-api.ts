import { formatTime } from './utils'

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

/** GitHub event type.
 *
 * Reference: https://docs.github.com/en/developers/webhooks-and-events/github-event-types
 */
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

export const eventTypeToName: Record<EventType, string> = {
    [EventType.CommitCommentEvent]: 'Commit comment',
    [EventType.CreateEvent]: 'Git branch or tag created',
    [EventType.DeleteEvent]: 'Git branch or tag deleted',
    [EventType.ForkEvent]: 'Repository forked',
    [EventType.GollumEvent]: 'Wiki activity',
    [EventType.IssueCommentEvent]: 'Issue comment activity',
    [EventType.IssuesEvent]: 'Issue activity',
    [EventType.MemberEvent]: 'Repository collaboration activity',
    [EventType.PublicEvent]: 'Repository made public',
    [EventType.PullRequestEvent]: 'Pull request activity',
    [EventType.PullRequestReviewCommentEvent]: 'Pull request review comment',
    [EventType.PushEvent]: 'Commit(s) pushed',
    [EventType.ReleaseEvent]: 'Release published',
    [EventType.SponsorshipEvent]: 'Sponsorship activity',
    [EventType.WatchEvent]: 'Star given'
}

export interface Event {
    id: string
    type: EventType
    actor: User
    repo: Repo
    created_at: Date // eslint-disable-line camelcase
}

const ROOT_API_URL = 'https://api.github.com/'

export function buildApiUrl(parts: string[], params?: Record<string, any>): URL {
    const url: URL = new URL(`${ROOT_API_URL}${parts.map(encodeURIComponent).join('/')}`)
    if (params) for (const [key, value] of Object.entries(params)) url.searchParams.append(key, value)
    return url
}

async function throwOnProblem(response: Response, ignoredStatuses: number[] = []): Promise<void> {
    if (response.status === 403) {
        const rateLimitResetEpoch: number = parseInt(response.headers.get('X-Ratelimit-Reset')!) * 1000
        const rateLimitReset: Date = new Date(rateLimitResetEpoch)
        const deltaMinutes: number = Math.ceil((rateLimitResetEpoch - Date.now()) / 60_000)
        throw new Error(
            `Exceeded GitHub rate limit for now. Try again in ${deltaMinutes} min at ${formatTime(rateLimitReset)}.`
        )
    } else if (!response.ok && !ignoredStatuses.includes(response.status)) {
        const problem: { message: string } = await response.json()
        throw new Error(problem.message)
    }
}

export async function fetchFromApi(url: URL, ignoredErrorStatuses?: number[]): Promise<Response> {
    const username = localStorage.getItem('username') || process?.env.USERNAME
    const pat = localStorage.getItem('pat') || process?.env.PAT
    let fetchOptions: RequestInit | undefined
    if (username && pat) {
        console.info(`Using GitHub as user ${username}`)
        fetchOptions = { headers: new Headers([['Authorization', `Basic ${btoa(username + ':' + pat)}`]]) }
    }
    const response: Response = await fetch(url.toString(), fetchOptions)
    await throwOnProblem(response, ignoredErrorStatuses)
    return response
}

export async function fetchUserEventsPage(login: string, page: number): Promise<Event[]> {
    const url: URL = buildApiUrl(['users', login, 'events'])
    url.searchParams.set('page', page.toString())
    const response = await fetchFromApi(url)
    const events: Event[] = await response.json()
    const eventsWithDates: Event[] = events.map((event) => {
        return { ...event, created_at: new Date(event.created_at) }
    })
    return eventsWithDates
}

export async function fetchUserEventsPilot(login: string): Promise<[Event[], number]> {
    const url: URL = buildApiUrl(['users', login, 'events'])
    url.searchParams.set('page', '1')
    const response = await fetchFromApi(url)
    const events: Event[] = await response.json()
    const eventsWithDates: Event[] = events.map((event) => {
        return { ...event, created_at: new Date(event.created_at) }
    })
    const linkHeader: string | null = response.headers.get('link')
    let lastPageNumber = 1
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
    const url: URL = buildApiUrl(['search', 'users'], { q: query })
    const response = await fetchFromApi(url)
    const searchResults: SearchResults = await response.json()
    const users: User[] = searchResults.items
    return users
}

export async function fetchUser(login: string): Promise<User> {
    const url: URL = buildApiUrl(['users', login])
    const response = await fetchFromApi(url, [404])
    if (response.status === 404) throw new Error(`User ${login} doesn't exist.`)
    const user: User = await response.json()
    return user
}
