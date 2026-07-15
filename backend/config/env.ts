import 'dotenv/config'
import { z } from 'zod'

export const env = z
	.object({
		DATABASE_URL: z.string().url(),
        FRONTEND_URL: z.string().url()
	})
	.parse(process.env)