export interface LoginUser {
	email: string
	name: string
	shift: {
		startTime: number
		endTime: number
	}
}
