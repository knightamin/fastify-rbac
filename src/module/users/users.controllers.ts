import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { CreateUserBodySchema, LoginBody } from './users.schemas';
import { SYSTEM_ROLES } from '../../config/permissions';
import { getRoleByName } from '../roles/roles.services';
import {
    assignRoleToUser,
    createUser,
    getUserByEmail,
    getUsersByApplication,
} from './users.services';

export async function createUserHandler(
    request: FastifyRequest<{
        Body: CreateUserBodySchema;
    }>,
    reply: FastifyReply
) {
    const { initialUser, ...data } = request.body;

    const roleName = initialUser
        ? SYSTEM_ROLES.SUPER_ADMIN
        : SYSTEM_ROLES.APPLICATION_USER;

    if (roleName === SYSTEM_ROLES.SUPER_ADMIN) {
        const appUser = await getUsersByApplication(data.applicationId);

        if (appUser.length > 0) {
            return reply.code(400).send({
                message: 'Application already has super user',
                extensions: {
                    code: 'APPLICATION_ALREADY_SUPER_USER',
                    applicationsId: data.applicationId,
                },
            });
        }
    }

    const role = await getRoleByName({
        name: roleName,
        applicationId: data.applicationId,
    });

    if (!role) {
        return reply.code(404).send({
            message: 'Role not found',
        });
    }

    const user = await createUser(data);

    await assignRoleToUser({
        applicationId: data.applicationId,
        roleId: role.id,
        userId: user.id,
    });

    return user;
}

export async function loginHandler(
    request: FastifyRequest<{
        Body: LoginBody;
    }>,
    reply: FastifyReply
) {
    const { applicationId, email, password } = request.body;

    const user = await getUserByEmail({ email, applicationId });
    if (!user) {
        return reply.code(400).send({
            message: 'invalid email or password',
        });
    }

    const token = jwt.sign(
        {
            id: user.id,
            email,
            applicationId,
            scope: user.permissions,
        },
        'SECRET_KEY'
    );

    return { token };
}
