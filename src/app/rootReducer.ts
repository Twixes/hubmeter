import { combineReducers } from '@reduxjs/toolkit'

import eventsReducer from '../components/eventsSlice'

const rootReducer = combineReducers({
  eventsDisplay: eventsReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
