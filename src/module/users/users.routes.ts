import { FastifyInstance } from 'fastify';
import { createUserHandler, loginHandler } from './users.controllers';
import { createUserbJsonSchema, loginJsonSchema } from './users.schemas';

export async function usersRoutes(app: FastifyInstance) {
    app.post('/', { schema: createUserbJsonSchema }, createUserHandler);

    app.post('/login', { schema: loginJsonSchema }, loginHandler);
}
