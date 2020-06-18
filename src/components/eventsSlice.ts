import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Event, fetchUserEventsAll } from '../api/github'
import { AppThunk } from '../app/store'

interface EventsState {
  eventsToLogin: Map<string, Event[]>
  currentLogin: string | null
  isLoading: boolean
  error: string | null
}

const eventsInitialState: EventsState = {
  eventsToLogin: new Map(),
  currentLogin: '',
  isLoading: false,
  error: null
}

function startLoading(state: EventsState) {
  state.isLoading = true
}

function endLoadingFailure(state: EventsState, action: PayloadAction<string>) {
  state.isLoading = false
  state.error = action.payload
}

const events = createSlice({
  name: 'events',
  initialState: eventsInitialState,
  reducers: {
    getEventsStart: startLoading,
    getEventsSuccess(state, { payload }: PayloadAction<{ login: string, events: Event[]}>) {
      state.eventsToLogin.set(payload.login, payload.events)
      state.isLoading = false
      state.error = null
    },
    getEventsFailure: endLoadingFailure
  }
})

export const {
  getEventsStart,
  getEventsSuccess,
  getEventsFailure
} = events.actions

export default events.reducer

export const fetchEvents = (login: string): AppThunk => async dispatch => {
  try {
    dispatch(getEventsStart())
    const events: Event[] = await fetchUserEventsAll(login)
    dispatch(getEventsSuccess({ login: login, events: events }))
  } catch (err) {
    dispatch(getEventsFailure(err.toString()))
  }
}
