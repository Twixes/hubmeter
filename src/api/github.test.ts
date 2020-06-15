import { User, Event, buildURL, fetchUserEventsPage, fetchUserEventsAll, fetchSearchUsers } from './github';

describe('#buildURL()', () => {
  it('should return proper user events URL', () => {
    const url = buildURL(['users', 'Twixes', 'events'])
    expect(url.toString()).toEqual('https://api.github.com/users/Twixes/events')
  })
  it('should return proper search users URL with parameter', () => {
    const url = buildURL(['search', 'users'], { q: 'Twixes' })
    expect(url.toString()).toEqual('https://api.github.com/search/users?q=Twixes')
  })
})

describe('#fetchUserEventsPage()', () => {
  it('should return an array of events', async () => {
    const events: Event[] = await fetchUserEventsPage('posthog', 2)
    expect(events).toBeInstanceOf(Array)
    expect(events[0].id).toBeDefined()
    expect(events[0].type).toBeDefined()
    expect(events[0].actor).toBeDefined()
    expect(events[0].repo).toBeDefined()
  })
})

describe('#fetchUserEventsAll()', () => {
  it('should return an array of events', async () => {
    const events: Event[] = await fetchUserEventsAll('posthog')
    expect(events).toBeInstanceOf(Array)
    expect(events[0].id).toBeDefined()
    expect(events[0].type).toBeDefined()
    expect(events[0].actor).toBeDefined()
    expect(events[0].repo).toBeDefined()
  })
})

describe('#fetchSearchUsers()', () => {
  it('should return an array of user search results', async () => {
    const users: User[] = await fetchSearchUsers('posthog')
    expect(users).toBeInstanceOf(Array)
    expect(users[0].id).toBeDefined()
    expect(users[0].login).toBeDefined()
    expect(users[0].avatar_url).toBeDefined()
  })
})
