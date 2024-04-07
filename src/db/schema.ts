import {
    pgTable,
    timestamp,
    uuid,
    varchar,
    primaryKey,
    uniqueIndex,
    text,
} from 'drizzle-orm/pg-core';

export const applications = pgTable('applications', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 256 }).notNull(),
    createAt: timestamp('created_at').defaultNow().notNull(),
    updateAt: timestamp('updated_at').defaultNow().notNull(),
});

export const users = pgTable(
    'users',
    {
        id: uuid('id').defaultRandom().notNull(),
        email: varchar('email', { length: 256 }).notNull(),
        name: varchar('name', { length: 256 }).notNull(),
        applicationId: uuid('applicationId').references(() => applications.id),
        password: varchar('password', { length: 256 }).notNull(),
        createAt: timestamp('created_at').defaultNow().notNull(),
        updateAt: timestamp('updated_at').defaultNow().notNull(),
    },
    (users) => {
        return {
            cpk: primaryKey({
                name: 'users_cpk',
                columns: [users.email, users.applicationId],
            }),
            idIndex: uniqueIndex('users_id_index').on(users.id),
        };
    }
);

export const roles = pgTable(
    'roles',
    {
        id: uuid('id').defaultRandom().notNull(),
        name: varchar('name', { length: 256 }).notNull(),
        applicationId: uuid('applicationId').references(() => applications.id),
        permissions: text('permissions').array().$type<Array<string>>(),
        createAt: timestamp('created_at').defaultNow().notNull(),
        updateAt: timestamp('updated_at').defaultNow().notNull(),
    },
    (roles) => {
        return {
            cpk: primaryKey({
                name: 'role_cpk',
                columns: [roles.name, roles.applicationId],
            }),
            idIndex: uniqueIndex('roles_id_index').on(roles.id),
        };
    }
);

export const usersToRoles = pgTable(
    'usersToRoles',
    {
        applicationId: uuid('applicationId')
            .references(() => applications.id)
            .notNull(),
        roleId: uuid('roledId')
            .references(() => roles.id)
            .notNull(),
        userId: uuid('userId')
            .references(() => users.id)
            .notNull(),
    },
    (usersToRoles) => {
        return {
            cpk: primaryKey({
                name: 'user_roles_cpk',
                columns: [
                    usersToRoles.applicationId,
                    usersToRoles.roleId,
                    usersToRoles.userId,
                ],
            }),
        };
    }
);
