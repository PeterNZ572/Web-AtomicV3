import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

/**
 * Google Ads conversion tracking settings (tag id + contact form conversion event).
 * SQLite has no `ADD COLUMN IF NOT EXISTS`, so each ALTER is tolerated if the
 * column is already present.
 */
const columns = ['google_ads_id', 'google_ads_conversion_event']

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const column of columns) {
    try {
      await db.run(sql.raw(`ALTER TABLE \`site_settings\` ADD \`${column}\` text;`))
    } catch {
      // column already exists
    }
  }
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  for (const column of columns) {
    try {
      await db.run(sql.raw(`ALTER TABLE \`site_settings\` DROP COLUMN \`${column}\`;`))
    } catch {
      // column already gone
    }
  }
}
