import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text DEFAULT 'editor' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`caption\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	\`sizes_card_url\` text,
  	\`sizes_card_width\` numeric,
  	\`sizes_card_height\` numeric,
  	\`sizes_card_mime_type\` text,
  	\`sizes_card_filesize\` numeric,
  	\`sizes_card_filename\` text,
  	\`sizes_hero_url\` text,
  	\`sizes_hero_width\` numeric,
  	\`sizes_hero_height\` numeric,
  	\`sizes_hero_mime_type\` text,
  	\`sizes_hero_filesize\` numeric,
  	\`sizes_hero_filename\` text,
  	\`sizes_og_url\` text,
  	\`sizes_og_width\` numeric,
  	\`sizes_og_height\` numeric,
  	\`sizes_og_mime_type\` text,
  	\`sizes_og_filesize\` numeric,
  	\`sizes_og_filename\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_card_sizes_card_filename_idx\` ON \`media\` (\`sizes_card_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_hero_sizes_hero_filename_idx\` ON \`media\` (\`sizes_hero_filename\`);`)
  await db.run(sql`CREATE INDEX \`media_sizes_og_sizes_og_filename_idx\` ON \`media\` (\`sizes_og_filename\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`content\` text,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_text_order_idx\` ON \`pages_blocks_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_text_parent_id_idx\` ON \`pages_blocks_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_text_path_idx\` ON \`pages_blocks_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`image_id\` text(36),
  	\`alt_text\` text,
  	\`caption\` text,
  	\`link_url\` text,
  	\`new_tab\` integer DEFAULT false,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_order_idx\` ON \`pages_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_parent_id_idx\` ON \`pages_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_path_idx\` ON \`pages_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_image_image_idx\` ON \`pages_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_buttons_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`url\` text,
  	\`style\` text DEFAULT 'primary',
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_buttons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_buttons_buttons_order_idx\` ON \`pages_blocks_buttons_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_buttons_buttons_parent_id_idx\` ON \`pages_blocks_buttons_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_buttons_order_idx\` ON \`pages_blocks_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_buttons_parent_id_idx\` ON \`pages_blocks_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_buttons_path_idx\` ON \`pages_blocks_buttons\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_form_fields_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_form_fields\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_form_fields_options_order_idx\` ON \`pages_blocks_form_fields_options\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_form_fields_options_parent_id_idx\` ON \`pages_blocks_form_fields_options\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_form_fields\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`name\` text,
  	\`placeholder\` text,
  	\`required\` integer DEFAULT false,
  	\`type\` text DEFAULT 'text',
  	\`width\` text DEFAULT 'full',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_form\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_form_fields_order_idx\` ON \`pages_blocks_form_fields\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_form_fields_parent_id_idx\` ON \`pages_blocks_form_fields\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_form\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`form_title\` text,
  	\`form_description\` text,
  	\`recipient_email\` text,
  	\`show_field_labels\` integer DEFAULT true,
  	\`submit_button_text\` text DEFAULT 'Send enquiry',
  	\`privacy_note\` text,
  	\`success_message\` text DEFAULT 'Thanks for getting in touch.',
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_form_order_idx\` ON \`pages_blocks_form\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_form_parent_id_idx\` ON \`pages_blocks_form\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_form_path_idx\` ON \`pages_blocks_form\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_contact_details_items_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`link_url\` text,
  	\`new_tab\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_contact_details_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_details_items_lines_order_idx\` ON \`pages_blocks_contact_details_items_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_details_items_lines_parent_id_idx\` ON \`pages_blocks_contact_details_items_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_contact_details_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`title\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_contact_details\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_details_items_order_idx\` ON \`pages_blocks_contact_details_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_details_items_parent_id_idx\` ON \`pages_blocks_contact_details_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_contact_details_inset_panel_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_contact_details\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_details_inset_panel_items_order_idx\` ON \`pages_blocks_contact_details_inset_panel_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_details_inset_panel_items_parent_id_idx\` ON \`pages_blocks_contact_details_inset_panel_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_contact_details\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`heading\` text,
  	\`inset_panel_heading\` text,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_details_order_idx\` ON \`pages_blocks_contact_details\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_details_parent_id_idx\` ON \`pages_blocks_contact_details\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_contact_details_path_idx\` ON \`pages_blocks_contact_details\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_map\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`address\` text,
  	\`latitude\` text,
  	\`longitude\` text,
  	\`zoom\` numeric DEFAULT 14,
  	\`map_height\` text DEFAULT '420px',
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_map_order_idx\` ON \`pages_blocks_map\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_map_parent_id_idx\` ON \`pages_blocks_map\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_map_path_idx\` ON \`pages_blocks_map\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_gallery_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` text(36),
  	\`caption\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_images_order_idx\` ON \`pages_blocks_gallery_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_images_parent_id_idx\` ON \`pages_blocks_gallery_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_images_image_idx\` ON \`pages_blocks_gallery_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`gallery_layout\` text DEFAULT 'grid',
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_order_idx\` ON \`pages_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_parent_id_idx\` ON \`pages_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_path_idx\` ON \`pages_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_slider_slides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` text(36),
  	\`heading\` text,
  	\`text\` text,
  	\`button_label\` text,
  	\`button_url\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_slider\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_slider_slides_order_idx\` ON \`pages_blocks_slider_slides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_slider_slides_parent_id_idx\` ON \`pages_blocks_slider_slides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_slider_slides_image_idx\` ON \`pages_blocks_slider_slides\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_slider\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_slider_order_idx\` ON \`pages_blocks_slider\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_slider_parent_id_idx\` ON \`pages_blocks_slider\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_slider_path_idx\` ON \`pages_blocks_slider\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`video_type\` text DEFAULT 'youtube',
  	\`youtube_url\` text,
  	\`vimeo_url\` text,
  	\`upload_video_id\` text(36),
  	\`poster_image_id\` text(36),
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	FOREIGN KEY (\`upload_video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`poster_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_order_idx\` ON \`pages_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_parent_id_idx\` ON \`pages_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_path_idx\` ON \`pages_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_upload_video_idx\` ON \`pages_blocks_video\` (\`upload_video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_video_poster_image_idx\` ON \`pages_blocks_video\` (\`poster_image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_accordion_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`content\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_accordion\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_accordion_items_order_idx\` ON \`pages_blocks_accordion_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_accordion_items_parent_id_idx\` ON \`pages_blocks_accordion_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_accordion\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_accordion_order_idx\` ON \`pages_blocks_accordion\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_accordion_parent_id_idx\` ON \`pages_blocks_accordion\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_accordion_path_idx\` ON \`pages_blocks_accordion\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_file_table_files\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`file_id\` text(36),
  	\`label\` text,
  	\`description\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_file_table\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_file_table_files_order_idx\` ON \`pages_blocks_file_table_files\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_file_table_files_parent_id_idx\` ON \`pages_blocks_file_table_files\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_file_table_files_file_idx\` ON \`pages_blocks_file_table_files\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_file_table\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_file_table_order_idx\` ON \`pages_blocks_file_table\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_file_table_parent_id_idx\` ON \`pages_blocks_file_table\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_file_table_path_idx\` ON \`pages_blocks_file_table\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_statistics_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`number\` text,
  	\`label\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_statistics\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_statistics_stats_order_idx\` ON \`pages_blocks_statistics_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_statistics_stats_parent_id_idx\` ON \`pages_blocks_statistics_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_statistics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_statistics_order_idx\` ON \`pages_blocks_statistics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_statistics_parent_id_idx\` ON \`pages_blocks_statistics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_statistics_path_idx\` ON \`pages_blocks_statistics\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`heading\` text,
  	\`text\` text,
  	\`button_label\` text,
  	\`button_url\` text,
  	\`style\` text DEFAULT 'primary',
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_order_idx\` ON \`pages_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_parent_id_idx\` ON \`pages_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_cta_path_idx\` ON \`pages_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_feature\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` text(36),
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_feature_order_idx\` ON \`pages_blocks_feature\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_feature_parent_id_idx\` ON \`pages_blocks_feature\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_feature_path_idx\` ON \`pages_blocks_feature\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_feature_image_idx\` ON \`pages_blocks_feature\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_icon_card\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`icon\` text,
  	\`layout\` text DEFAULT 'centered',
  	\`title\` text,
  	\`text\` text,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`new_tab\` integer DEFAULT false,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_icon_card_order_idx\` ON \`pages_blocks_icon_card\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_icon_card_parent_id_idx\` ON \`pages_blocks_icon_card\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_icon_card_path_idx\` ON \`pages_blocks_icon_card\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_project_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`source\` text DEFAULT 'featured',
  	\`limit\` numeric DEFAULT 3,
  	\`display_style\` text DEFAULT 'grid',
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_project_cards_order_idx\` ON \`pages_blocks_project_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_project_cards_parent_id_idx\` ON \`pages_blocks_project_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_project_cards_path_idx\` ON \`pages_blocks_project_cards\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_testimonials_manual_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`role\` text,
  	\`company\` text,
  	\`quote\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_manual_testimonials_order_idx\` ON \`pages_blocks_testimonials_manual_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_manual_testimonials_parent_id_idx\` ON \`pages_blocks_testimonials_manual_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`source\` text DEFAULT 'collection',
  	\`display_style\` text DEFAULT 'grid',
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_order_idx\` ON \`pages_blocks_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_parent_id_idx\` ON \`pages_blocks_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_path_idx\` ON \`pages_blocks_testimonials\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_booking_search_form\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`heading\` text,
  	\`subheading\` text,
  	\`button_text\` text DEFAULT 'Search',
  	\`destination_url\` text,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_search_form_order_idx\` ON \`pages_blocks_booking_search_form\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_search_form_parent_id_idx\` ON \`pages_blocks_booking_search_form\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_search_form_path_idx\` ON \`pages_blocks_booking_search_form\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_content_builder_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`row_name\` text,
  	\`row_layout\` text DEFAULT 'full',
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`column1_column_name\` text,
  	\`column1_custom_css_class\` text,
  	\`column1_custom_css_id\` text,
  	\`column1_custom_inline_style\` text,
  	\`column1_hide\` text DEFAULT 'no',
  	\`column2_column_name\` text,
  	\`column2_custom_css_class\` text,
  	\`column2_custom_css_id\` text,
  	\`column2_custom_inline_style\` text,
  	\`column2_hide\` text DEFAULT 'no',
  	\`column3_column_name\` text,
  	\`column3_custom_css_class\` text,
  	\`column3_custom_css_id\` text,
  	\`column3_custom_inline_style\` text,
  	\`column3_hide\` text DEFAULT 'no',
  	\`column4_column_name\` text,
  	\`column4_custom_css_class\` text,
  	\`column4_custom_css_id\` text,
  	\`column4_custom_inline_style\` text,
  	\`column4_hide\` text DEFAULT 'no',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_content_builder\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_content_builder_rows_order_idx\` ON \`pages_content_builder_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_content_builder_rows_parent_id_idx\` ON \`pages_content_builder_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_content_builder\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`section_name\` text,
  	\`theme_style\` text DEFAULT 'default',
  	\`vertical_alignment\` text DEFAULT 'top',
  	\`padding_level\` text DEFAULT 'level4',
  	\`full_width\` text DEFAULT 'no',
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`custom_background_image_id\` text(36),
  	\`background_repeat\` text DEFAULT 'no-repeat',
  	\`background_size\` text DEFAULT 'cover',
  	\`background_position\` text DEFAULT 'center',
  	FOREIGN KEY (\`custom_background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_content_builder_order_idx\` ON \`pages_content_builder\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_content_builder_parent_id_idx\` ON \`pages_content_builder\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_content_builder_custom_background_image_idx\` ON \`pages_content_builder\` (\`custom_background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`excerpt\` text,
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_open_graph_image_id\` text(36),
  	\`seo_canonical_url\` text,
  	\`seo_no_index\` integer DEFAULT false,
  	\`seo_no_follow\` integer DEFAULT false,
  	\`seo_schema_type\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`seo_open_graph_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`pages_seo_seo_open_graph_image_idx\` ON \`pages\` (\`seo_open_graph_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`pages__status_idx\` ON \`pages\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`pages_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`projects_id\` text(36),
  	\`testimonials_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_rels_order_idx\` ON \`pages_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_parent_idx\` ON \`pages_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_path_idx\` ON \`pages_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_projects_id_idx\` ON \`pages_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_rels_testimonials_id_idx\` ON \`pages_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`content\` text,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_text_order_idx\` ON \`_pages_v_blocks_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_text_parent_id_idx\` ON \`_pages_v_blocks_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_text_path_idx\` ON \`_pages_v_blocks_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_image\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`image_id\` text(36),
  	\`alt_text\` text,
  	\`caption\` text,
  	\`link_url\` text,
  	\`new_tab\` integer DEFAULT false,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_image_order_idx\` ON \`_pages_v_blocks_image\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_image_parent_id_idx\` ON \`_pages_v_blocks_image\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_image_path_idx\` ON \`_pages_v_blocks_image\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_image_image_idx\` ON \`_pages_v_blocks_image\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_buttons_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`url\` text,
  	\`style\` text DEFAULT 'primary',
  	\`new_tab\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_buttons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_buttons_buttons_order_idx\` ON \`_pages_v_blocks_buttons_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_buttons_buttons_parent_id_idx\` ON \`_pages_v_blocks_buttons_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_buttons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_buttons_order_idx\` ON \`_pages_v_blocks_buttons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_buttons_parent_id_idx\` ON \`_pages_v_blocks_buttons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_buttons_path_idx\` ON \`_pages_v_blocks_buttons\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_form_fields_options\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_form_fields\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_form_fields_options_order_idx\` ON \`_pages_v_blocks_form_fields_options\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_form_fields_options_parent_id_idx\` ON \`_pages_v_blocks_form_fields_options\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_form_fields\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`name\` text,
  	\`placeholder\` text,
  	\`required\` integer DEFAULT false,
  	\`type\` text DEFAULT 'text',
  	\`width\` text DEFAULT 'full',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_form\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_form_fields_order_idx\` ON \`_pages_v_blocks_form_fields\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_form_fields_parent_id_idx\` ON \`_pages_v_blocks_form_fields\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_form\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`form_title\` text,
  	\`form_description\` text,
  	\`recipient_email\` text,
  	\`show_field_labels\` integer DEFAULT true,
  	\`submit_button_text\` text DEFAULT 'Send enquiry',
  	\`privacy_note\` text,
  	\`success_message\` text DEFAULT 'Thanks for getting in touch.',
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_form_order_idx\` ON \`_pages_v_blocks_form\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_form_parent_id_idx\` ON \`_pages_v_blocks_form\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_form_path_idx\` ON \`_pages_v_blocks_form\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_contact_details_items_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`link_url\` text,
  	\`new_tab\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_contact_details_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_details_items_lines_order_idx\` ON \`_pages_v_blocks_contact_details_items_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_details_items_lines_parent_id_idx\` ON \`_pages_v_blocks_contact_details_items_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_contact_details_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`title\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_contact_details\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_details_items_order_idx\` ON \`_pages_v_blocks_contact_details_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_details_items_parent_id_idx\` ON \`_pages_v_blocks_contact_details_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_contact_details_inset_panel_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_contact_details\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_details_inset_panel_items_order_idx\` ON \`_pages_v_blocks_contact_details_inset_panel_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_details_inset_panel_items_parent_id_idx\` ON \`_pages_v_blocks_contact_details_inset_panel_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_contact_details\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`heading\` text,
  	\`inset_panel_heading\` text,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_details_order_idx\` ON \`_pages_v_blocks_contact_details\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_details_parent_id_idx\` ON \`_pages_v_blocks_contact_details\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_contact_details_path_idx\` ON \`_pages_v_blocks_contact_details\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_map\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`address\` text,
  	\`latitude\` text,
  	\`longitude\` text,
  	\`zoom\` numeric DEFAULT 14,
  	\`map_height\` text DEFAULT '420px',
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_map_order_idx\` ON \`_pages_v_blocks_map\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_map_parent_id_idx\` ON \`_pages_v_blocks_map\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_map_path_idx\` ON \`_pages_v_blocks_map\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_gallery_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`image_id\` text(36),
  	\`caption\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_images_order_idx\` ON \`_pages_v_blocks_gallery_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_images_parent_id_idx\` ON \`_pages_v_blocks_gallery_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_images_image_idx\` ON \`_pages_v_blocks_gallery_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`gallery_layout\` text DEFAULT 'grid',
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_order_idx\` ON \`_pages_v_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_parent_id_idx\` ON \`_pages_v_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_path_idx\` ON \`_pages_v_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_slider_slides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`image_id\` text(36),
  	\`heading\` text,
  	\`text\` text,
  	\`button_label\` text,
  	\`button_url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_slider\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_slider_slides_order_idx\` ON \`_pages_v_blocks_slider_slides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_slider_slides_parent_id_idx\` ON \`_pages_v_blocks_slider_slides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_slider_slides_image_idx\` ON \`_pages_v_blocks_slider_slides\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_slider\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_slider_order_idx\` ON \`_pages_v_blocks_slider\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_slider_parent_id_idx\` ON \`_pages_v_blocks_slider\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_slider_path_idx\` ON \`_pages_v_blocks_slider\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_video\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`video_type\` text DEFAULT 'youtube',
  	\`youtube_url\` text,
  	\`vimeo_url\` text,
  	\`upload_video_id\` text(36),
  	\`poster_image_id\` text(36),
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`_uuid\` text,
  	FOREIGN KEY (\`upload_video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`poster_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_order_idx\` ON \`_pages_v_blocks_video\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_parent_id_idx\` ON \`_pages_v_blocks_video\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_path_idx\` ON \`_pages_v_blocks_video\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_upload_video_idx\` ON \`_pages_v_blocks_video\` (\`upload_video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_video_poster_image_idx\` ON \`_pages_v_blocks_video\` (\`poster_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_accordion_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`content\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_accordion\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_accordion_items_order_idx\` ON \`_pages_v_blocks_accordion_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_accordion_items_parent_id_idx\` ON \`_pages_v_blocks_accordion_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_accordion\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_accordion_order_idx\` ON \`_pages_v_blocks_accordion\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_accordion_parent_id_idx\` ON \`_pages_v_blocks_accordion\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_accordion_path_idx\` ON \`_pages_v_blocks_accordion\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_file_table_files\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`file_id\` text(36),
  	\`label\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`file_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_file_table\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_file_table_files_order_idx\` ON \`_pages_v_blocks_file_table_files\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_file_table_files_parent_id_idx\` ON \`_pages_v_blocks_file_table_files\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_file_table_files_file_idx\` ON \`_pages_v_blocks_file_table_files\` (\`file_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_file_table\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_file_table_order_idx\` ON \`_pages_v_blocks_file_table\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_file_table_parent_id_idx\` ON \`_pages_v_blocks_file_table\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_file_table_path_idx\` ON \`_pages_v_blocks_file_table\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_statistics_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`number\` text,
  	\`label\` text,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_statistics\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_statistics_stats_order_idx\` ON \`_pages_v_blocks_statistics_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_statistics_stats_parent_id_idx\` ON \`_pages_v_blocks_statistics_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_statistics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_statistics_order_idx\` ON \`_pages_v_blocks_statistics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_statistics_parent_id_idx\` ON \`_pages_v_blocks_statistics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_statistics_path_idx\` ON \`_pages_v_blocks_statistics\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_cta\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`heading\` text,
  	\`text\` text,
  	\`button_label\` text,
  	\`button_url\` text,
  	\`style\` text DEFAULT 'primary',
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_order_idx\` ON \`_pages_v_blocks_cta\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_parent_id_idx\` ON \`_pages_v_blocks_cta\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_cta_path_idx\` ON \`_pages_v_blocks_cta\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_feature\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`title\` text,
  	\`text\` text,
  	\`image_id\` text(36),
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_feature_order_idx\` ON \`_pages_v_blocks_feature\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_feature_parent_id_idx\` ON \`_pages_v_blocks_feature\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_feature_path_idx\` ON \`_pages_v_blocks_feature\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_feature_image_idx\` ON \`_pages_v_blocks_feature\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_icon_card\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`icon\` text,
  	\`layout\` text DEFAULT 'centered',
  	\`title\` text,
  	\`text\` text,
  	\`link_label\` text,
  	\`link_url\` text,
  	\`new_tab\` integer DEFAULT false,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_icon_card_order_idx\` ON \`_pages_v_blocks_icon_card\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_icon_card_parent_id_idx\` ON \`_pages_v_blocks_icon_card\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_icon_card_path_idx\` ON \`_pages_v_blocks_icon_card\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_project_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`source\` text DEFAULT 'featured',
  	\`limit\` numeric DEFAULT 3,
  	\`display_style\` text DEFAULT 'grid',
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_project_cards_order_idx\` ON \`_pages_v_blocks_project_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_project_cards_parent_id_idx\` ON \`_pages_v_blocks_project_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_project_cards_path_idx\` ON \`_pages_v_blocks_project_cards\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_testimonials_manual_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`role\` text,
  	\`company\` text,
  	\`quote\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_manual_testimonials_order_idx\` ON \`_pages_v_blocks_testimonials_manual_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_manual_testimonials_parent_id_idx\` ON \`_pages_v_blocks_testimonials_manual_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`source\` text DEFAULT 'collection',
  	\`display_style\` text DEFAULT 'grid',
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_order_idx\` ON \`_pages_v_blocks_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_parent_id_idx\` ON \`_pages_v_blocks_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_path_idx\` ON \`_pages_v_blocks_testimonials\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_booking_search_form\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`block_name\` text,
  	\`heading\` text,
  	\`subheading\` text,
  	\`button_text\` text DEFAULT 'Search',
  	\`destination_url\` text,
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_search_form_order_idx\` ON \`_pages_v_blocks_booking_search_form\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_search_form_parent_id_idx\` ON \`_pages_v_blocks_booking_search_form\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_search_form_path_idx\` ON \`_pages_v_blocks_booking_search_form\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_content_builder_rows\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`row_name\` text,
  	\`row_layout\` text DEFAULT 'full',
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`column1_column_name\` text,
  	\`column1_custom_css_class\` text,
  	\`column1_custom_css_id\` text,
  	\`column1_custom_inline_style\` text,
  	\`column1_hide\` text DEFAULT 'no',
  	\`column2_column_name\` text,
  	\`column2_custom_css_class\` text,
  	\`column2_custom_css_id\` text,
  	\`column2_custom_inline_style\` text,
  	\`column2_hide\` text DEFAULT 'no',
  	\`column3_column_name\` text,
  	\`column3_custom_css_class\` text,
  	\`column3_custom_css_id\` text,
  	\`column3_custom_inline_style\` text,
  	\`column3_hide\` text DEFAULT 'no',
  	\`column4_column_name\` text,
  	\`column4_custom_css_class\` text,
  	\`column4_custom_css_id\` text,
  	\`column4_custom_inline_style\` text,
  	\`column4_hide\` text DEFAULT 'no',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_version_content_builder\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_content_builder_rows_order_idx\` ON \`_pages_v_version_content_builder_rows\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_content_builder_rows_parent_id_idx\` ON \`_pages_v_version_content_builder_rows\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_version_content_builder\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`section_name\` text,
  	\`theme_style\` text DEFAULT 'default',
  	\`vertical_alignment\` text DEFAULT 'top',
  	\`padding_level\` text DEFAULT 'level4',
  	\`full_width\` text DEFAULT 'no',
  	\`custom_css_class\` text,
  	\`custom_css_id\` text,
  	\`custom_inline_style\` text,
  	\`hide\` text DEFAULT 'no',
  	\`custom_background_image_id\` text(36),
  	\`background_repeat\` text DEFAULT 'no-repeat',
  	\`background_size\` text DEFAULT 'cover',
  	\`background_position\` text DEFAULT 'center',
  	\`_uuid\` text,
  	FOREIGN KEY (\`custom_background_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_version_content_builder_order_idx\` ON \`_pages_v_version_content_builder\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_content_builder_parent_id_idx\` ON \`_pages_v_version_content_builder\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_content_builder_custom_background_image_idx\` ON \`_pages_v_version_content_builder\` (\`custom_background_image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`parent_id\` text(36),
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_excerpt\` text,
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_open_graph_image_id\` text(36),
  	\`version_seo_canonical_url\` text,
  	\`version_seo_no_index\` integer DEFAULT false,
  	\`version_seo_no_follow\` integer DEFAULT false,
  	\`version_seo_schema_type\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_open_graph_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_parent_idx\` ON \`_pages_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_slug_idx\` ON \`_pages_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_seo_version_seo_open_graph_image_idx\` ON \`_pages_v\` (\`version_seo_open_graph_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_updated_at_idx\` ON \`_pages_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version_created_at_idx\` ON \`_pages_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_version_version__status_idx\` ON \`_pages_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_created_at_idx\` ON \`_pages_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_updated_at_idx\` ON \`_pages_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_latest_idx\` ON \`_pages_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`projects_id\` text(36),
  	\`testimonials_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_order_idx\` ON \`_pages_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_parent_idx\` ON \`_pages_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_path_idx\` ON \`_pages_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_projects_id_idx\` ON \`_pages_v_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_rels_testimonials_id_idx\` ON \`_pages_v_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_primary_navigation\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_primary_navigation_order_idx\` ON \`site_settings_primary_navigation\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_primary_navigation_parent_id_idx\` ON \`site_settings_primary_navigation\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_footer_navigation\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_footer_navigation_order_idx\` ON \`site_settings_footer_navigation\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_footer_navigation_parent_id_idx\` ON \`site_settings_footer_navigation\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_social_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`platform\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_social_links_order_idx\` ON \`site_settings_social_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_social_links_parent_id_idx\` ON \`site_settings_social_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`site_name\` text NOT NULL,
  	\`site_tagline\` text,
  	\`logo_id\` text(36),
  	\`favicon_id\` text(36),
  	\`announcement\` text,
  	\`email\` text,
  	\`phone\` text,
  	\`address\` text,
  	\`footer_blurb\` text,
  	\`global_custom_css\` text,
  	\`ga4_measurement_id\` text,
  	\`seo_open_graph_image_id\` text(36),
  	\`seo_canonical_url\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`favicon_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_open_graph_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_logo_idx\` ON \`site_settings\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_favicon_idx\` ON \`site_settings\` (\`favicon_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_seo_seo_open_graph_image_idx\` ON \`site_settings\` (\`seo_open_graph_image_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_updated_at_idx\` ON \`site_settings\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_created_at_idx\` ON \`site_settings\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`contact_submissions\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`form_title\` text NOT NULL,
  	\`page_title\` text,
  	\`page_slug\` text,
  	\`recipient_email\` text,
  	\`submission_data\` text NOT NULL,
  	\`utm_source\` text,
  	\`utm_medium\` text,
  	\`utm_campaign\` text,
  	\`utm_content\` text,
  	\`utm_term\` text,
  	\`referrer\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`contact_submissions_updated_at_idx\` ON \`contact_submissions\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`contact_submissions_created_at_idx\` ON \`contact_submissions\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`backup_history\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`backup_type\` text NOT NULL,
  	\`status\` text NOT NULL,
  	\`started_at\` text NOT NULL,
  	\`completed_at\` text,
  	\`duration_ms\` numeric,
  	\`file_size_bytes\` numeric,
  	\`r2_object_key\` text,
  	\`error_message\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`backup_history_updated_at_idx\` ON \`backup_history\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`backup_history_created_at_idx\` ON \`backup_history\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`projects_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`item\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_services_order_idx\` ON \`projects_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`projects_services_parent_id_idx\` ON \`projects_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`projects_results\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_results_order_idx\` ON \`projects_results\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`projects_results_parent_id_idx\` ON \`projects_results\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`projects\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`client\` text,
  	\`industry\` text,
  	\`summary\` text,
  	\`featured\` integer DEFAULT false,
  	\`hero_image_id\` text(36),
  	\`challenge\` text,
  	\`solution\` text,
  	\`outcome\` text,
  	\`testimonial_id\` text(36),
  	\`seo_title\` text,
  	\`seo_description\` text,
  	\`seo_open_graph_image_id\` text(36),
  	\`seo_canonical_url\` text,
  	\`seo_no_index\` integer DEFAULT false,
  	\`seo_no_follow\` integer DEFAULT false,
  	\`seo_schema_type\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`testimonial_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`seo_open_graph_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`projects_slug_idx\` ON \`projects\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`projects_hero_image_idx\` ON \`projects\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_testimonial_idx\` ON \`projects\` (\`testimonial_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_seo_seo_open_graph_image_idx\` ON \`projects\` (\`seo_open_graph_image_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_updated_at_idx\` ON \`projects\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`projects_created_at_idx\` ON \`projects\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`projects__status_idx\` ON \`projects\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`projects_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`projects_rels_order_idx\` ON \`projects_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_parent_idx\` ON \`projects_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_path_idx\` ON \`projects_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`projects_rels_media_id_idx\` ON \`projects_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v_version_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`item\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_v_version_services_order_idx\` ON \`_projects_v_version_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_services_parent_id_idx\` ON \`_projects_v_version_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v_version_results\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_v_version_results_order_idx\` ON \`_projects_v_version_results\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_results_parent_id_idx\` ON \`_projects_v_version_results\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`parent_id\` text(36),
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_client\` text,
  	\`version_industry\` text,
  	\`version_summary\` text,
  	\`version_featured\` integer DEFAULT false,
  	\`version_hero_image_id\` text(36),
  	\`version_challenge\` text,
  	\`version_solution\` text,
  	\`version_outcome\` text,
  	\`version_testimonial_id\` text(36),
  	\`version_seo_title\` text,
  	\`version_seo_description\` text,
  	\`version_seo_open_graph_image_id\` text(36),
  	\`version_seo_canonical_url\` text,
  	\`version_seo_no_index\` integer DEFAULT false,
  	\`version_seo_no_follow\` integer DEFAULT false,
  	\`version_seo_schema_type\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_testimonial_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_seo_open_graph_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_v_parent_idx\` ON \`_projects_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_slug_idx\` ON \`_projects_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_hero_image_idx\` ON \`_projects_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_testimonial_idx\` ON \`_projects_v\` (\`version_testimonial_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_seo_version_seo_open_graph_image_idx\` ON \`_projects_v\` (\`version_seo_open_graph_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_updated_at_idx\` ON \`_projects_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version_created_at_idx\` ON \`_projects_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_version_version__status_idx\` ON \`_projects_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_created_at_idx\` ON \`_projects_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_updated_at_idx\` ON \`_projects_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_latest_idx\` ON \`_projects_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_projects_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_projects_v_rels_order_idx\` ON \`_projects_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_rels_parent_idx\` ON \`_projects_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_rels_path_idx\` ON \`_projects_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_projects_v_rels_media_id_idx\` ON \`_projects_v_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`testimonials\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text NOT NULL,
  	\`company\` text NOT NULL,
  	\`quote\` text NOT NULL,
  	\`featured\` integer DEFAULT false,
  	\`avatar_id\` text(36),
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`avatar_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`testimonials_avatar_idx\` ON \`testimonials\` (\`avatar_id\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_updated_at_idx\` ON \`testimonials\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_created_at_idx\` ON \`testimonials\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` text(36),
  	\`media_id\` text(36),
  	\`pages_id\` text(36),
  	\`site_settings_id\` text(36),
  	\`contact_submissions_id\` text(36),
  	\`backup_history_id\` text(36),
  	\`projects_id\` text(36),
  	\`testimonials_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`site_settings_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`contact_submissions_id\`) REFERENCES \`contact_submissions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`backup_history_id\`) REFERENCES \`backup_history\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_site_settings_id_idx\` ON \`payload_locked_documents_rels\` (\`site_settings_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_contact_submissions_id_idx\` ON \`payload_locked_documents_rels\` (\`contact_submissions_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_backup_history_id_idx\` ON \`payload_locked_documents_rels\` (\`backup_history_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_projects_id_idx\` ON \`payload_locked_documents_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`backup_settings\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`site_name\` text,
  	\`r2_account_id\` text,
  	\`r2_bucket_name\` text,
  	\`r2_endpoint\` text,
  	\`r2_access_key\` text,
  	\`r2_secret_key\` text,
  	\`r2_region\` text DEFAULT 'auto',
  	\`db_backup_cron\` text DEFAULT '0 1 * * *',
  	\`full_backup_cron\` text DEFAULT '0 2 * * *',
  	\`db_retention_count\` numeric DEFAULT 30,
  	\`full_retention_count\` numeric DEFAULT 30,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_text\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_buttons_buttons\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_buttons\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_form_fields_options\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_form_fields\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_form\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_contact_details_items_lines\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_contact_details_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_contact_details_inset_panel_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_contact_details\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_map\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_gallery_images\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_slider_slides\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_slider\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_accordion_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_accordion\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_file_table_files\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_file_table\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_statistics_stats\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_statistics\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_feature\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_icon_card\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_project_cards\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_testimonials_manual_testimonials\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_testimonials\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_booking_search_form\`;`)
  await db.run(sql`DROP TABLE \`pages_content_builder_rows\`;`)
  await db.run(sql`DROP TABLE \`pages_content_builder\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`DROP TABLE \`pages_rels\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_text\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_image\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_buttons_buttons\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_buttons\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_form_fields_options\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_form_fields\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_form\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_contact_details_items_lines\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_contact_details_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_contact_details_inset_panel_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_contact_details\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_map\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_gallery_images\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_slider_slides\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_slider\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_video\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_accordion_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_accordion\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_file_table_files\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_file_table\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_statistics_stats\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_statistics\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_cta\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_feature\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_icon_card\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_project_cards\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_testimonials_manual_testimonials\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_testimonials\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_booking_search_form\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_content_builder_rows\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_version_content_builder\`;`)
  await db.run(sql`DROP TABLE \`_pages_v\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_rels\`;`)
  await db.run(sql`DROP TABLE \`site_settings_primary_navigation\`;`)
  await db.run(sql`DROP TABLE \`site_settings_footer_navigation\`;`)
  await db.run(sql`DROP TABLE \`site_settings_social_links\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`contact_submissions\`;`)
  await db.run(sql`DROP TABLE \`backup_history\`;`)
  await db.run(sql`DROP TABLE \`projects_services\`;`)
  await db.run(sql`DROP TABLE \`projects_results\`;`)
  await db.run(sql`DROP TABLE \`projects\`;`)
  await db.run(sql`DROP TABLE \`projects_rels\`;`)
  await db.run(sql`DROP TABLE \`_projects_v_version_services\`;`)
  await db.run(sql`DROP TABLE \`_projects_v_version_results\`;`)
  await db.run(sql`DROP TABLE \`_projects_v\`;`)
  await db.run(sql`DROP TABLE \`_projects_v_rels\`;`)
  await db.run(sql`DROP TABLE \`testimonials\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
  await db.run(sql`DROP TABLE \`backup_settings\`;`)
}
