import { minutesToTime } from '../../utils/time'
import { LoginUser } from './auth.types'

export const formatLoginUser = (user: LoginUser) => {
	const { shift, ...safeUser } = user
	const convertedStartTime = minutesToTime(shift.startTime)
	const convertedEndTime = minutesToTime(shift.endTime)

	return {
		...safeUser,
		shift: {
			startTime: convertedStartTime,
			endTime: convertedEndTime,
		},
	}
}
