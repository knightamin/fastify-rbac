import zenvv from 'zennv';
import { z } from 'zod';

export const env = zenvv({
    dotenv: true,
    schema: z.object({
        PORT: z.number().default(3000),
        HOST: z.string().default('0.0.0.0'),
        DB_CONNECTION_URI: z.string(),
    }),
});
