export const timeToMinutes = (time: string): number => {
	const [hours, minutes] = time.split(':').map(Number)
	return hours * 60 + minutes
}

export const minutesToTime = (minutes: number): string => {
	const h = Math.floor(minutes / 60)
		.toString()
		.padStart(2, '0')

	const m = (minutes % 60).toString().padStart(2, '0')

	return `${h}:${m}`
}
