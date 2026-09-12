import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/**
 * Optional demo link on projects (name + url), shown in the project sidebar
 * under Client and Industry. SQLite has no `ADD COLUMN IF NOT EXISTS`, so each
 * ALTER is tolerated if the column is already present.
 */
const columns: [table: string, column: string][] = [
  ['projects', 'demo_name'],
  ['projects', 'demo_url'],
  ['_projects_v', 'version_demo_name'],
  ['_projects_v', 'version_demo_url'],
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const [table, column] of columns) {
    try {
      await db.run(sql.raw(`ALTER TABLE \`${table}\` ADD \`${column}\` text;`))
    } catch {
      // column already exists
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const [table, column] of columns) {
    try {
      await db.run(sql.raw(`ALTER TABLE \`${table}\` DROP COLUMN \`${column}\`;`))
    } catch {
      // column already gone
    }
  }
}
