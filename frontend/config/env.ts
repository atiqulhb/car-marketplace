import { z } from 'zod'

export const env = z
	.object({
		BACKEND_URL: z.string().url()
	})
	.parse(process.env)