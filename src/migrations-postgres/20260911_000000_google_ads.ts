import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Google Ads conversion tracking settings (tag id + contact form conversion event).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "google_ads_id" varchar;
    ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "google_ads_conversion_event" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "google_ads_id";
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "google_ads_conversion_event";
  `)
}
