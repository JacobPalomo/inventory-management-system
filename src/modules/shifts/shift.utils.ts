import { Shift } from '@prisma/client'
import { minutesToTime } from '../../shared/utils/time'

export const generateShiftResponse = (shift: Shift) => {
	const { startTime, endTime, ...safeShift } = shift
	const convertedStartTime = minutesToTime(startTime)
	const convertedEndTime = minutesToTime(endTime)

	return {
		...safeShift,
		startTime: convertedStartTime,
		endTime: convertedEndTime,
	}
}
