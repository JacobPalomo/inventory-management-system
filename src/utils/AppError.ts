import { ERROR_CODES } from '../constants/error'

type ErrorCode = keyof typeof ERROR_CODES

export class AppError extends Error {
	public statusCode: number
	public code: string
	public details?: any

	constructor(code: ErrorCode, details?: any) {
		const errorConfig = ERROR_CODES[code]

		super(errorConfig.message)

		this.code = code
		this.statusCode = errorConfig.statusCode
		this.details = details
	}
}
