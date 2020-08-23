import { Event } from '../../github-api'
import { DataPoint } from '../../components/Graph'

const HOUR_NUMBERS: number[] = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const HOURS: string[] = HOUR_NUMBERS.map((hour) => `${hour} AM`).concat(HOUR_NUMBERS.map((hour) => `${hour} PM`))
const DAYS_OF_WEEK: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function * insightByHour() {
  const points: DataPoint[] = HOURS.map((hour) => [hour, 0])
  yield points
  let currentEvent: Event = yield
  while (true) {
    points[currentEvent.created_at.getUTCHours()][1] += 1
    currentEvent = yield
  }
}

export function * insightByDayOfWeek() {
  const points: DataPoint[] = DAYS_OF_WEEK.map((dayOfWeek) => [dayOfWeek, 0])
  yield points
  let currentEvent: Event = yield
  while (true) {
    points[currentEvent.created_at.getUTCHours()][1] += 1
    currentEvent = yield
  }
}

/*      const userEvents: Event[] = events[currentUser.login.toLowerCase()]!
      const oldestEventCreatedAt: Date | null = userEvents.length ? userEvents[userEvents.length - 1].created_at : null
      for (const event of userEvents) {
        byHourPointsTentative[event.created_at.getUTCHours()][1] += 1
        byDayOfWeekPointsTentative[(event.created_at.getUTCDay() + 6) % 7][1] += 1
      }
      byHourPointsTentative.push(...byHourPointsTentative.splice(0, 6)) // rearrange to make points start with 6 AM
*/
