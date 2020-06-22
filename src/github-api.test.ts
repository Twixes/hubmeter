/* eslint-env jest */

import { User, Event, buildURL, fetchUserEventsPage, fetchUserEventsAll, fetchSearchUsers, fetchUser, fetchUserEventsPilot } from './github-api'

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
    expect(events[0].created_at).toBeInstanceOf(Date)
  })
})

describe('#fetchUserEventsPilot()', () => {
  it('should return an array of events', async () => {
    const [events, lastPageNumber]: [Event[], number] = await fetchUserEventsPilot('posthog')
    expect(events).toBeInstanceOf(Array)
    expect(events[0].id).toBeDefined()
    expect(events[0].type).toBeDefined()
    expect(events[0].actor).toBeDefined()
    expect(events[0].repo).toBeDefined()
    expect(events[0].created_at).toBeInstanceOf(Date)
    expect(lastPageNumber).toBeGreaterThanOrEqual(1)
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
    expect(events[0].created_at).toBeInstanceOf(Date)
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

describe('#fetchUser()', () => {
  it('should return a user', async () => {
    const user: User | null = await fetchUser('twixes')
    expect(user!.id).toBeDefined()
    expect(user!.login).toBeDefined()
    expect(user!.avatar_url).toBeDefined()
  })
  it('should return null if user does not exist', async () => {
    const user: User | null = await fetchUser('twixesssssssssssssssssssssssssssssssssssssssssssssssss')
    expect(user).toBeNull()
  })
})
