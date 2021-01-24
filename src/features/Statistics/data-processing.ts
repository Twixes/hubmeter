import { Event } from '../../github-api'
import { DataPoint } from '../../components/Graph'

const HOUR_NUMBERS: number[] = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const HOURS: string[] = HOUR_NUMBERS.map((hour) => `${hour} AM`).concat(HOUR_NUMBERS.map((hour) => `${hour} PM`))
const DAYS_OF_WEEK: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
