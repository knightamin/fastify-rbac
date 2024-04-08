import { InferInsertModel } from 'drizzle-orm';
import { applications } from '../../db/schema';
import { db } from '../../db';

export async function createApplication(
    data: InferInsertModel<typeof applications>
) {
    const result = await db.insert(applications).values(data).returning();

    return result[0];
}

export async function getApplications() {
    const result = await db
        .select({
            id: applications.id,
            name: applications.name,
            createAt: applications.createAt,
        })
        .from(applications);
    return result;
}
