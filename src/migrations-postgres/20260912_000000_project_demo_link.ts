import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Optional demo link on projects (name + url), shown in the project sidebar
 * under Client and Industry. Group fields flatten to `demo_*` on the
 * collection table and `version_demo_*` on the drafts table.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "demo_name" varchar;
    ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "demo_url" varchar;
    ALTER TABLE "_projects_v" ADD COLUMN IF NOT EXISTS "version_demo_name" varchar;
    ALTER TABLE "_projects_v" ADD COLUMN IF NOT EXISTS "version_demo_url" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "projects" DROP COLUMN IF EXISTS "demo_name";
    ALTER TABLE "projects" DROP COLUMN IF EXISTS "demo_url";
    ALTER TABLE "_projects_v" DROP COLUMN IF EXISTS "version_demo_name";
    ALTER TABLE "_projects_v" DROP COLUMN IF EXISTS "version_demo_url";
  `)
}
