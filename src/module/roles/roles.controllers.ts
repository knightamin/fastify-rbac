import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateRoleBody } from './roles.schemas';
import { createRole } from './roles.services';

export async function createRoleHandler(
    request: FastifyRequest<{
        Body: CreateRoleBody;
    }>,
    reply: FastifyReply
) {
    const { applicationId, name, permissions } = request.body;

    const role = await createRole({
        applicationId,
        name,
        permissions,
    });

    return role;
}
