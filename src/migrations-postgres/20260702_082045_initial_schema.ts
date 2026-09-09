import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_pages_blocks_text_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_image_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_buttons_buttons_style" AS ENUM('primary', 'secondary', 'outline', 'text');
  CREATE TYPE "public"."enum_pages_blocks_buttons_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_form_fields_type" AS ENUM('text', 'email', 'phone', 'textarea', 'select', 'checkbox');
  CREATE TYPE "public"."enum_pages_blocks_form_fields_width" AS ENUM('full', 'half');
  CREATE TYPE "public"."enum_pages_blocks_form_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_contact_details_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_map_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_gallery_gallery_layout" AS ENUM('grid', 'masonry', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_gallery_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_slider_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_video_video_type" AS ENUM('youtube', 'vimeo', 'upload');
  CREATE TYPE "public"."enum_pages_blocks_video_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_accordion_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_file_table_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_statistics_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_cta_style" AS ENUM('primary', 'secondary', 'outline', 'text');
  CREATE TYPE "public"."enum_pages_blocks_cta_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_feature_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_icon_card_layout" AS ENUM('centered', 'left');
  CREATE TYPE "public"."enum_pages_blocks_icon_card_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_project_cards_source" AS ENUM('featured', 'latest', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_project_cards_display_style" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum_pages_blocks_project_cards_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_source" AS ENUM('collection', 'manual');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_display_style" AS ENUM('grid', 'carousel', 'single');
  CREATE TYPE "public"."enum_pages_blocks_testimonials_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_blocks_booking_search_form_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_content_builder_rows_row_layout" AS ENUM('full', 'half-half', 'third-third-third', 'quarter-quarter-quarter-quarter', 'third-two-thirds', 'two-thirds-third', 'quarter-three-quarters', 'three-quarters-quarter', 'half-quarter-quarter', 'quarter-half-quarter', 'quarter-quarter-half');
  CREATE TYPE "public"."enum_pages_content_builder_rows_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_content_builder_rows_column1_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_content_builder_rows_column2_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_content_builder_rows_column3_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_content_builder_rows_column4_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_content_builder_theme_style" AS ENUM('default', 'light', 'dark', 'primary', 'accent', 'muted');
  CREATE TYPE "public"."enum_pages_content_builder_vertical_alignment" AS ENUM('top', 'middle', 'bottom');
  CREATE TYPE "public"."enum_pages_content_builder_padding_level" AS ENUM('none', 'level1', 'level2', 'level3', 'level4', 'level5');
  CREATE TYPE "public"."enum_pages_content_builder_full_width" AS ENUM('no', 'yes');
  CREATE TYPE "public"."enum_pages_content_builder_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum_pages_content_builder_background_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
  CREATE TYPE "public"."enum_pages_content_builder_background_size" AS ENUM('cover', 'contain', 'auto');
  CREATE TYPE "public"."enum_pages_content_builder_background_position" AS ENUM('center', 'top', 'bottom', 'left', 'right', 'center top', 'center bottom');
  CREATE TYPE "public"."enum_pages_seo_schema_type" AS ENUM('WebPage', 'Article', 'BlogPosting', 'Product', 'Service', 'FAQPage', 'ContactPage', 'AboutPage', 'Organization', 'LocalBusiness');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_text_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_image_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_buttons_buttons_style" AS ENUM('primary', 'secondary', 'outline', 'text');
  CREATE TYPE "public"."enum__pages_v_blocks_buttons_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_form_fields_type" AS ENUM('text', 'email', 'phone', 'textarea', 'select', 'checkbox');
  CREATE TYPE "public"."enum__pages_v_blocks_form_fields_width" AS ENUM('full', 'half');
  CREATE TYPE "public"."enum__pages_v_blocks_form_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_contact_details_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_map_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_gallery_layout" AS ENUM('grid', 'masonry', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_gallery_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_slider_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_video_video_type" AS ENUM('youtube', 'vimeo', 'upload');
  CREATE TYPE "public"."enum__pages_v_blocks_video_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_accordion_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_file_table_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_statistics_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_style" AS ENUM('primary', 'secondary', 'outline', 'text');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_feature_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_icon_card_layout" AS ENUM('centered', 'left');
  CREATE TYPE "public"."enum__pages_v_blocks_icon_card_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_project_cards_source" AS ENUM('featured', 'latest', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_project_cards_display_style" AS ENUM('grid', 'carousel');
  CREATE TYPE "public"."enum__pages_v_blocks_project_cards_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_source" AS ENUM('collection', 'manual');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_display_style" AS ENUM('grid', 'carousel', 'single');
  CREATE TYPE "public"."enum__pages_v_blocks_testimonials_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_blocks_booking_search_form_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_version_content_builder_rows_row_layout" AS ENUM('full', 'half-half', 'third-third-third', 'quarter-quarter-quarter-quarter', 'third-two-thirds', 'two-thirds-third', 'quarter-three-quarters', 'three-quarters-quarter', 'half-quarter-quarter', 'quarter-half-quarter', 'quarter-quarter-half');
  CREATE TYPE "public"."enum__pages_v_version_content_builder_rows_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_version_content_builder_rows_column1_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_version_content_builder_rows_column2_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_version_content_builder_rows_column3_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_version_content_builder_rows_column4_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_version_content_builder_theme_style" AS ENUM('default', 'light', 'dark', 'primary', 'accent', 'muted');
  CREATE TYPE "public"."enum__pages_v_version_content_builder_vertical_alignment" AS ENUM('top', 'middle', 'bottom');
  CREATE TYPE "public"."enum__pages_v_version_content_builder_padding_level" AS ENUM('none', 'level1', 'level2', 'level3', 'level4', 'level5');
  CREATE TYPE "public"."enum__pages_v_version_content_builder_full_width" AS ENUM('no', 'yes');
  CREATE TYPE "public"."enum__pages_v_version_content_builder_hide" AS ENUM('no', 'all', 'mobile', 'tablet', 'desktop');
  CREATE TYPE "public"."enum__pages_v_version_content_builder_background_repeat" AS ENUM('no-repeat', 'repeat', 'repeat-x', 'repeat-y');
  CREATE TYPE "public"."enum__pages_v_version_content_builder_background_size" AS ENUM('cover', 'contain', 'auto');
  CREATE TYPE "public"."enum__pages_v_version_content_builder_background_position" AS ENUM('center', 'top', 'bottom', 'left', 'right', 'center top', 'center bottom');
  CREATE TYPE "public"."enum__pages_v_version_seo_schema_type" AS ENUM('WebPage', 'Article', 'BlogPosting', 'Product', 'Service', 'FAQPage', 'ContactPage', 'AboutPage', 'Organization', 'LocalBusiness');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_backup_history_backup_type" AS ENUM('database', 'full-site');
  CREATE TYPE "public"."enum_backup_history_status" AS ENUM('running', 'success', 'failed');
  CREATE TYPE "public"."enum_projects_seo_schema_type" AS ENUM('WebPage', 'Article', 'BlogPosting', 'Product', 'Service', 'FAQPage', 'ContactPage', 'AboutPage', 'Organization', 'LocalBusiness');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_seo_schema_type" AS ENUM('WebPage', 'Article', 'BlogPosting', 'Product', 'Service', 'FAQPage', 'ContactPage', 'AboutPage', 'Organization', 'LocalBusiness');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "pages_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"content" varchar,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_blocks_text_hide" DEFAULT 'no'
  );
  
  CREATE TABLE "pages_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"image_id" uuid,
  	"alt_text" varchar,
  	"caption" varchar,
  	"link_url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_blocks_image_hide" DEFAULT 'no'
  );
  
  CREATE TABLE "pages_blocks_buttons_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"style" "enum_pages_blocks_buttons_buttons_style" DEFAULT 'primary',
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_blocks_buttons_hide" DEFAULT 'no'
  );
  
  CREATE TABLE "pages_blocks_form_fields_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "pages_blocks_form_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"name" varchar,
  	"placeholder" varchar,
  	"required" boolean DEFAULT false,
  	"type" "enum_pages_blocks_form_fields_type" DEFAULT 'text',
  	"width" "enum_pages_blocks_form_fields_width" DEFAULT 'full'
  );
  
  CREATE TABLE "pages_blocks_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"form_title" varchar,
  	"form_description" varchar,
  	"recipient_email" varchar,
  	"show_field_labels" boolean DEFAULT true,
  	"submit_button_text" varchar DEFAULT 'Send enquiry',
  	"privacy_note" varchar,
  	"success_message" varchar DEFAULT 'Thanks for getting in touch.',
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_blocks_form_hide" DEFAULT 'no'
  );
  
  CREATE TABLE "pages_blocks_contact_details_items_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"link_url" varchar,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_contact_details_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar,
  	"title" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_details_inset_panel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_contact_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"heading" varchar,
  	"inset_panel_heading" varchar,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_blocks_contact_details_hide" DEFAULT 'no'
  );
  
  CREATE TABLE "pages_blocks_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"address" varchar,
  	"latitude" varchar,
  	"longitude" varchar,
  	"zoom" numeric DEFAULT 14,
  	"map_height" varchar DEFAULT '420px',
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_blocks_map_hide" DEFAULT 'no'
  );
  
  CREATE TABLE "pages_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" uuid,
  	"caption" varchar
  );
  
  CREATE TABLE "pages_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"gallery_layout" "enum_pages_blocks_gallery_gallery_layout" DEFAULT 'grid',
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_blocks_gallery_hide" DEFAULT 'no'
  );
  
  CREATE TABLE "pages_blocks_slider_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" uuid,
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"button_url" varchar
  );
  
  CREATE TABLE "pages_blocks_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_blocks_slider_hide" DEFAULT 'no'
  );
  
  CREATE TABLE "pages_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"video_type" "enum_pages_blocks_video_video_type" DEFAULT 'youtube',
  	"youtube_url" varchar,
  	"vimeo_url" varchar,
  	"upload_video_id" uuid,
  	"poster_image_id" uuid,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_blocks_video_hide" DEFAULT 'no'
  );
  
  CREATE TABLE "pages_blocks_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"content" jsonb
  );
  
  CREATE TABLE "pages_blocks_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_blocks_accordion_hide" DEFAULT 'no'
  );
  
  CREATE TABLE "pages_blocks_file_table_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" uuid,
  	"label" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_file_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_blocks_file_table_hide" DEFAULT 'no'
  );
  
  CREATE TABLE "pages_blocks_statistics_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"label" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_statistics" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_blocks_statistics_hide" DEFAULT 'no'
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"button_url" varchar,
  	"style" "enum_pages_blocks_cta_style" DEFAULT 'primary',
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_blocks_cta_hide" DEFAULT 'no'
  );
  
  CREATE TABLE "pages_blocks_feature" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"title" varchar,
  	"text" varchar,
  	"image_id" uuid,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_blocks_feature_hide" DEFAULT 'no'
  );
  
  CREATE TABLE "pages_blocks_icon_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"icon" varchar,
  	"layout" "enum_pages_blocks_icon_card_layout" DEFAULT 'centered',
  	"title" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_blocks_icon_card_hide" DEFAULT 'no'
  );
  
  CREATE TABLE "pages_blocks_project_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"source" "enum_pages_blocks_project_cards_source" DEFAULT 'featured',
  	"limit" numeric DEFAULT 3,
  	"display_style" "enum_pages_blocks_project_cards_display_style" DEFAULT 'grid',
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_blocks_project_cards_hide" DEFAULT 'no'
  );
  
  CREATE TABLE "pages_blocks_testimonials_manual_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"company" varchar,
  	"quote" varchar
  );
  
  CREATE TABLE "pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"source" "enum_pages_blocks_testimonials_source" DEFAULT 'collection',
  	"display_style" "enum_pages_blocks_testimonials_display_style" DEFAULT 'grid',
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_blocks_testimonials_hide" DEFAULT 'no'
  );
  
  CREATE TABLE "pages_blocks_booking_search_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"button_text" varchar DEFAULT 'Search',
  	"destination_url" varchar,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_blocks_booking_search_form_hide" DEFAULT 'no'
  );
  
  CREATE TABLE "pages_content_builder_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"row_name" varchar,
  	"row_layout" "enum_pages_content_builder_rows_row_layout" DEFAULT 'full',
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_content_builder_rows_hide" DEFAULT 'no',
  	"column1_column_name" varchar,
  	"column1_custom_css_class" varchar,
  	"column1_custom_css_id" varchar,
  	"column1_custom_inline_style" varchar,
  	"column1_hide" "enum_pages_content_builder_rows_column1_hide" DEFAULT 'no',
  	"column2_column_name" varchar,
  	"column2_custom_css_class" varchar,
  	"column2_custom_css_id" varchar,
  	"column2_custom_inline_style" varchar,
  	"column2_hide" "enum_pages_content_builder_rows_column2_hide" DEFAULT 'no',
  	"column3_column_name" varchar,
  	"column3_custom_css_class" varchar,
  	"column3_custom_css_id" varchar,
  	"column3_custom_inline_style" varchar,
  	"column3_hide" "enum_pages_content_builder_rows_column3_hide" DEFAULT 'no',
  	"column4_column_name" varchar,
  	"column4_custom_css_class" varchar,
  	"column4_custom_css_id" varchar,
  	"column4_custom_inline_style" varchar,
  	"column4_hide" "enum_pages_content_builder_rows_column4_hide" DEFAULT 'no'
  );
  
  CREATE TABLE "pages_content_builder" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_name" varchar,
  	"theme_style" "enum_pages_content_builder_theme_style" DEFAULT 'default',
  	"vertical_alignment" "enum_pages_content_builder_vertical_alignment" DEFAULT 'top',
  	"padding_level" "enum_pages_content_builder_padding_level" DEFAULT 'level4',
  	"full_width" "enum_pages_content_builder_full_width" DEFAULT 'no',
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum_pages_content_builder_hide" DEFAULT 'no',
  	"custom_background_image_id" uuid,
  	"background_repeat" "enum_pages_content_builder_background_repeat" DEFAULT 'no-repeat',
  	"background_size" "enum_pages_content_builder_background_size" DEFAULT 'cover',
  	"background_position" "enum_pages_content_builder_background_position" DEFAULT 'center'
  );
  
  CREATE TABLE "pages" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_open_graph_image_id" uuid,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"seo_no_follow" boolean DEFAULT false,
  	"seo_schema_type" "enum_pages_seo_schema_type",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" uuid,
  	"testimonials_id" uuid
  );
  
  CREATE TABLE "_pages_v_blocks_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"block_name" varchar,
  	"content" varchar,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_blocks_text_hide" DEFAULT 'no',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"block_name" varchar,
  	"image_id" uuid,
  	"alt_text" varchar,
  	"caption" varchar,
  	"link_url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_blocks_image_hide" DEFAULT 'no',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_buttons_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"style" "enum__pages_v_blocks_buttons_buttons_style" DEFAULT 'primary',
  	"new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"block_name" varchar,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_blocks_buttons_hide" DEFAULT 'no',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_fields_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"label" varchar,
  	"name" varchar,
  	"placeholder" varchar,
  	"required" boolean DEFAULT false,
  	"type" "enum__pages_v_blocks_form_fields_type" DEFAULT 'text',
  	"width" "enum__pages_v_blocks_form_fields_width" DEFAULT 'full',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"block_name" varchar,
  	"form_title" varchar,
  	"form_description" varchar,
  	"recipient_email" varchar,
  	"show_field_labels" boolean DEFAULT true,
  	"submit_button_text" varchar DEFAULT 'Send enquiry',
  	"privacy_note" varchar,
  	"success_message" varchar DEFAULT 'Thanks for getting in touch.',
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_blocks_form_hide" DEFAULT 'no',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_details_items_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"text" varchar,
  	"link_url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_details_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"icon" varchar,
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_details_inset_panel_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contact_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"block_name" varchar,
  	"heading" varchar,
  	"inset_panel_heading" varchar,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_blocks_contact_details_hide" DEFAULT 'no',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_map" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"block_name" varchar,
  	"address" varchar,
  	"latitude" varchar,
  	"longitude" varchar,
  	"zoom" numeric DEFAULT 14,
  	"map_height" varchar DEFAULT '420px',
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_blocks_map_hide" DEFAULT 'no',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"image_id" uuid,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"block_name" varchar,
  	"gallery_layout" "enum__pages_v_blocks_gallery_gallery_layout" DEFAULT 'grid',
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_blocks_gallery_hide" DEFAULT 'no',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_slider_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"image_id" uuid,
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"button_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_slider" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"block_name" varchar,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_blocks_slider_hide" DEFAULT 'no',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_video" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"block_name" varchar,
  	"video_type" "enum__pages_v_blocks_video_video_type" DEFAULT 'youtube',
  	"youtube_url" varchar,
  	"vimeo_url" varchar,
  	"upload_video_id" uuid,
  	"poster_image_id" uuid,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_blocks_video_hide" DEFAULT 'no',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_accordion_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar,
  	"content" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"block_name" varchar,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_blocks_accordion_hide" DEFAULT 'no',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_file_table_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"file_id" uuid,
  	"label" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_file_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"block_name" varchar,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_blocks_file_table_hide" DEFAULT 'no',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_statistics_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"number" varchar,
  	"label" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_statistics" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"block_name" varchar,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_blocks_statistics_hide" DEFAULT 'no',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"block_name" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"button_url" varchar,
  	"style" "enum__pages_v_blocks_cta_style" DEFAULT 'primary',
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_blocks_cta_hide" DEFAULT 'no',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_feature" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"block_name" varchar,
  	"title" varchar,
  	"text" varchar,
  	"image_id" uuid,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_blocks_feature_hide" DEFAULT 'no',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_icon_card" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"block_name" varchar,
  	"icon" varchar,
  	"layout" "enum__pages_v_blocks_icon_card_layout" DEFAULT 'centered',
  	"title" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"new_tab" boolean DEFAULT false,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_blocks_icon_card_hide" DEFAULT 'no',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_project_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"block_name" varchar,
  	"source" "enum__pages_v_blocks_project_cards_source" DEFAULT 'featured',
  	"limit" numeric DEFAULT 3,
  	"display_style" "enum__pages_v_blocks_project_cards_display_style" DEFAULT 'grid',
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_blocks_project_cards_hide" DEFAULT 'no',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials_manual_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"role" varchar,
  	"company" varchar,
  	"quote" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"block_name" varchar,
  	"source" "enum__pages_v_blocks_testimonials_source" DEFAULT 'collection',
  	"display_style" "enum__pages_v_blocks_testimonials_display_style" DEFAULT 'grid',
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_blocks_testimonials_hide" DEFAULT 'no',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_booking_search_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"_path" text NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"block_name" varchar,
  	"heading" varchar,
  	"subheading" varchar,
  	"button_text" varchar DEFAULT 'Search',
  	"destination_url" varchar,
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_blocks_booking_search_form_hide" DEFAULT 'no',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_content_builder_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"row_name" varchar,
  	"row_layout" "enum__pages_v_version_content_builder_rows_row_layout" DEFAULT 'full',
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_version_content_builder_rows_hide" DEFAULT 'no',
  	"column1_column_name" varchar,
  	"column1_custom_css_class" varchar,
  	"column1_custom_css_id" varchar,
  	"column1_custom_inline_style" varchar,
  	"column1_hide" "enum__pages_v_version_content_builder_rows_column1_hide" DEFAULT 'no',
  	"column2_column_name" varchar,
  	"column2_custom_css_class" varchar,
  	"column2_custom_css_id" varchar,
  	"column2_custom_inline_style" varchar,
  	"column2_hide" "enum__pages_v_version_content_builder_rows_column2_hide" DEFAULT 'no',
  	"column3_column_name" varchar,
  	"column3_custom_css_class" varchar,
  	"column3_custom_css_id" varchar,
  	"column3_custom_inline_style" varchar,
  	"column3_hide" "enum__pages_v_version_content_builder_rows_column3_hide" DEFAULT 'no',
  	"column4_column_name" varchar,
  	"column4_custom_css_class" varchar,
  	"column4_custom_css_id" varchar,
  	"column4_custom_inline_style" varchar,
  	"column4_hide" "enum__pages_v_version_content_builder_rows_column4_hide" DEFAULT 'no',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_version_content_builder" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"section_name" varchar,
  	"theme_style" "enum__pages_v_version_content_builder_theme_style" DEFAULT 'default',
  	"vertical_alignment" "enum__pages_v_version_content_builder_vertical_alignment" DEFAULT 'top',
  	"padding_level" "enum__pages_v_version_content_builder_padding_level" DEFAULT 'level4',
  	"full_width" "enum__pages_v_version_content_builder_full_width" DEFAULT 'no',
  	"custom_css_class" varchar,
  	"custom_css_id" varchar,
  	"custom_inline_style" varchar,
  	"hide" "enum__pages_v_version_content_builder_hide" DEFAULT 'no',
  	"custom_background_image_id" uuid,
  	"background_repeat" "enum__pages_v_version_content_builder_background_repeat" DEFAULT 'no-repeat',
  	"background_size" "enum__pages_v_version_content_builder_background_size" DEFAULT 'cover',
  	"background_position" "enum__pages_v_version_content_builder_background_position" DEFAULT 'center',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_open_graph_image_id" uuid,
  	"version_seo_canonical_url" varchar,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_seo_no_follow" boolean DEFAULT false,
  	"version_seo_schema_type" "enum__pages_v_version_seo_schema_type",
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" uuid,
  	"testimonials_id" uuid
  );
  
  CREATE TABLE "site_settings_primary_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"slug" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_footer_navigation" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"slug" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"site_name" varchar NOT NULL,
  	"site_tagline" varchar,
  	"logo_id" uuid,
  	"favicon_id" uuid,
  	"announcement" varchar,
  	"email" varchar,
  	"phone" varchar,
  	"address" varchar,
  	"footer_blurb" varchar,
  	"global_custom_css" varchar,
  	"ga4_measurement_id" varchar,
  	"seo_open_graph_image_id" uuid,
  	"seo_canonical_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contact_submissions" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"form_title" varchar NOT NULL,
  	"page_title" varchar,
  	"page_slug" varchar,
  	"recipient_email" varchar,
  	"submission_data" jsonb NOT NULL,
  	"utm_source" varchar,
  	"utm_medium" varchar,
  	"utm_campaign" varchar,
  	"utm_content" varchar,
  	"utm_term" varchar,
  	"referrer" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "backup_history" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"backup_type" "enum_backup_history_backup_type" NOT NULL,
  	"status" "enum_backup_history_status" NOT NULL,
  	"started_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone,
  	"duration_ms" numeric,
  	"file_size_bytes" numeric,
  	"r2_object_key" varchar,
  	"error_message" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "projects_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"client" varchar,
  	"industry" varchar,
  	"summary" varchar,
  	"featured" boolean DEFAULT false,
  	"hero_image_id" uuid,
  	"challenge" jsonb,
  	"solution" jsonb,
  	"outcome" jsonb,
  	"testimonial_id" uuid,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_open_graph_image_id" uuid,
  	"seo_canonical_url" varchar,
  	"seo_no_index" boolean DEFAULT false,
  	"seo_no_follow" boolean DEFAULT false,
  	"seo_schema_type" "enum_projects_seo_schema_type",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" uuid
  );
  
  CREATE TABLE "_projects_v_version_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" uuid NOT NULL,
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"parent_id" uuid,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_client" varchar,
  	"version_industry" varchar,
  	"version_summary" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_hero_image_id" uuid,
  	"version_challenge" jsonb,
  	"version_solution" jsonb,
  	"version_outcome" jsonb,
  	"version_testimonial_id" uuid,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_open_graph_image_id" uuid,
  	"version_seo_canonical_url" varchar,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_seo_no_follow" boolean DEFAULT false,
  	"version_seo_schema_type" "enum__projects_v_version_seo_schema_type",
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" uuid
  );
  
  CREATE TABLE "testimonials" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"company" varchar NOT NULL,
  	"quote" varchar NOT NULL,
  	"featured" boolean DEFAULT false,
  	"avatar_id" uuid,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid,
  	"media_id" uuid,
  	"pages_id" uuid,
  	"site_settings_id" uuid,
  	"contact_submissions_id" uuid,
  	"backup_history_id" uuid,
  	"projects_id" uuid,
  	"testimonials_id" uuid
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" uuid NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" uuid
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "backup_settings" (
  	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  	"site_name" varchar,
  	"r2_account_id" varchar,
  	"r2_bucket_name" varchar,
  	"r2_endpoint" varchar,
  	"r2_access_key" varchar,
  	"r2_secret_key" varchar,
  	"r2_region" varchar DEFAULT 'auto',
  	"db_backup_cron" varchar DEFAULT '0 1 * * *',
  	"full_backup_cron" varchar DEFAULT '0 2 * * *',
  	"db_retention_count" numeric DEFAULT 30,
  	"full_retention_count" numeric DEFAULT 30,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_text" ADD CONSTRAINT "pages_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_image" ADD CONSTRAINT "pages_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_buttons_buttons" ADD CONSTRAINT "pages_blocks_buttons_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_buttons" ADD CONSTRAINT "pages_blocks_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_fields_options" ADD CONSTRAINT "pages_blocks_form_fields_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_form_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form_fields" ADD CONSTRAINT "pages_blocks_form_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_form" ADD CONSTRAINT "pages_blocks_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_details_items_lines" ADD CONSTRAINT "pages_blocks_contact_details_items_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_details_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_details_items" ADD CONSTRAINT "pages_blocks_contact_details_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_details_inset_panel_items" ADD CONSTRAINT "pages_blocks_contact_details_inset_panel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contact_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contact_details" ADD CONSTRAINT "pages_blocks_contact_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_map" ADD CONSTRAINT "pages_blocks_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery_images" ADD CONSTRAINT "pages_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_gallery" ADD CONSTRAINT "pages_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_slider_slides" ADD CONSTRAINT "pages_blocks_slider_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_slider_slides" ADD CONSTRAINT "pages_blocks_slider_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_slider" ADD CONSTRAINT "pages_blocks_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_upload_video_id_media_id_fk" FOREIGN KEY ("upload_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_video" ADD CONSTRAINT "pages_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion_items" ADD CONSTRAINT "pages_blocks_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_accordion" ADD CONSTRAINT "pages_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_file_table_files" ADD CONSTRAINT "pages_blocks_file_table_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_file_table_files" ADD CONSTRAINT "pages_blocks_file_table_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_file_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_file_table" ADD CONSTRAINT "pages_blocks_file_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_statistics_stats" ADD CONSTRAINT "pages_blocks_statistics_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_statistics" ADD CONSTRAINT "pages_blocks_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature" ADD CONSTRAINT "pages_blocks_feature_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_feature" ADD CONSTRAINT "pages_blocks_feature_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_icon_card" ADD CONSTRAINT "pages_blocks_icon_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_project_cards" ADD CONSTRAINT "pages_blocks_project_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials_manual_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_manual_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_booking_search_form" ADD CONSTRAINT "pages_blocks_booking_search_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_content_builder_rows" ADD CONSTRAINT "pages_content_builder_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_content_builder"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_content_builder" ADD CONSTRAINT "pages_content_builder_custom_background_image_id_media_id_fk" FOREIGN KEY ("custom_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_content_builder" ADD CONSTRAINT "pages_content_builder_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_text" ADD CONSTRAINT "_pages_v_blocks_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_image" ADD CONSTRAINT "_pages_v_blocks_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_buttons_buttons" ADD CONSTRAINT "_pages_v_blocks_buttons_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_buttons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_buttons" ADD CONSTRAINT "_pages_v_blocks_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_fields_options" ADD CONSTRAINT "_pages_v_blocks_form_fields_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_form_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form_fields" ADD CONSTRAINT "_pages_v_blocks_form_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_form" ADD CONSTRAINT "_pages_v_blocks_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_details_items_lines" ADD CONSTRAINT "_pages_v_blocks_contact_details_items_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact_details_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_details_items" ADD CONSTRAINT "_pages_v_blocks_contact_details_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_details_inset_panel_items" ADD CONSTRAINT "_pages_v_blocks_contact_details_inset_panel_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contact_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contact_details" ADD CONSTRAINT "_pages_v_blocks_contact_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_map" ADD CONSTRAINT "_pages_v_blocks_map_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_images" ADD CONSTRAINT "_pages_v_blocks_gallery_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery_images" ADD CONSTRAINT "_pages_v_blocks_gallery_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_gallery" ADD CONSTRAINT "_pages_v_blocks_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_slider_slides" ADD CONSTRAINT "_pages_v_blocks_slider_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_slider_slides" ADD CONSTRAINT "_pages_v_blocks_slider_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_slider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_slider" ADD CONSTRAINT "_pages_v_blocks_slider_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_upload_video_id_media_id_fk" FOREIGN KEY ("upload_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_poster_image_id_media_id_fk" FOREIGN KEY ("poster_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_video" ADD CONSTRAINT "_pages_v_blocks_video_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion_items" ADD CONSTRAINT "_pages_v_blocks_accordion_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_accordion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_accordion" ADD CONSTRAINT "_pages_v_blocks_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_file_table_files" ADD CONSTRAINT "_pages_v_blocks_file_table_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_file_table_files" ADD CONSTRAINT "_pages_v_blocks_file_table_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_file_table"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_file_table" ADD CONSTRAINT "_pages_v_blocks_file_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_statistics_stats" ADD CONSTRAINT "_pages_v_blocks_statistics_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_statistics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_statistics" ADD CONSTRAINT "_pages_v_blocks_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_cta" ADD CONSTRAINT "_pages_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature" ADD CONSTRAINT "_pages_v_blocks_feature_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_feature" ADD CONSTRAINT "_pages_v_blocks_feature_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_icon_card" ADD CONSTRAINT "_pages_v_blocks_icon_card_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_project_cards" ADD CONSTRAINT "_pages_v_blocks_project_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials_manual_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_manual_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_booking_search_form" ADD CONSTRAINT "_pages_v_blocks_booking_search_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_content_builder_rows" ADD CONSTRAINT "_pages_v_version_content_builder_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_version_content_builder"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_content_builder" ADD CONSTRAINT "_pages_v_version_content_builder_custom_background_image_id_media_id_fk" FOREIGN KEY ("custom_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_version_content_builder" ADD CONSTRAINT "_pages_v_version_content_builder_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("version_seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_primary_navigation" ADD CONSTRAINT "site_settings_primary_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_footer_navigation" ADD CONSTRAINT "site_settings_footer_navigation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_services" ADD CONSTRAINT "projects_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_results" ADD CONSTRAINT "projects_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_testimonial_id_testimonials_id_fk" FOREIGN KEY ("testimonial_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_services" ADD CONSTRAINT "_projects_v_version_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_results" ADD CONSTRAINT "_projects_v_version_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_testimonial_id_testimonials_id_fk" FOREIGN KEY ("version_testimonial_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("version_seo_open_graph_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_site_settings_fk" FOREIGN KEY ("site_settings_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contact_submissions_fk" FOREIGN KEY ("contact_submissions_id") REFERENCES "public"."contact_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_backup_history_fk" FOREIGN KEY ("backup_history_id") REFERENCES "public"."backup_history"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "pages_blocks_text_order_idx" ON "pages_blocks_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_text_parent_id_idx" ON "pages_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_text_path_idx" ON "pages_blocks_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_order_idx" ON "pages_blocks_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_parent_id_idx" ON "pages_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_path_idx" ON "pages_blocks_image" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_image_idx" ON "pages_blocks_image" USING btree ("image_id");
  CREATE INDEX "pages_blocks_buttons_buttons_order_idx" ON "pages_blocks_buttons_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_buttons_buttons_parent_id_idx" ON "pages_blocks_buttons_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_buttons_order_idx" ON "pages_blocks_buttons" USING btree ("_order");
  CREATE INDEX "pages_blocks_buttons_parent_id_idx" ON "pages_blocks_buttons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_buttons_path_idx" ON "pages_blocks_buttons" USING btree ("_path");
  CREATE INDEX "pages_blocks_form_fields_options_order_idx" ON "pages_blocks_form_fields_options" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_fields_options_parent_id_idx" ON "pages_blocks_form_fields_options" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_fields_order_idx" ON "pages_blocks_form_fields" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_fields_parent_id_idx" ON "pages_blocks_form_fields" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_order_idx" ON "pages_blocks_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_form_parent_id_idx" ON "pages_blocks_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_form_path_idx" ON "pages_blocks_form" USING btree ("_path");
  CREATE INDEX "pages_blocks_contact_details_items_lines_order_idx" ON "pages_blocks_contact_details_items_lines" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_details_items_lines_parent_id_idx" ON "pages_blocks_contact_details_items_lines" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_details_items_order_idx" ON "pages_blocks_contact_details_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_details_items_parent_id_idx" ON "pages_blocks_contact_details_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_details_inset_panel_items_order_idx" ON "pages_blocks_contact_details_inset_panel_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_details_inset_panel_items_parent_id_idx" ON "pages_blocks_contact_details_inset_panel_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_details_order_idx" ON "pages_blocks_contact_details" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_details_parent_id_idx" ON "pages_blocks_contact_details" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_details_path_idx" ON "pages_blocks_contact_details" USING btree ("_path");
  CREATE INDEX "pages_blocks_map_order_idx" ON "pages_blocks_map" USING btree ("_order");
  CREATE INDEX "pages_blocks_map_parent_id_idx" ON "pages_blocks_map" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_map_path_idx" ON "pages_blocks_map" USING btree ("_path");
  CREATE INDEX "pages_blocks_gallery_images_order_idx" ON "pages_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_images_parent_id_idx" ON "pages_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_images_image_idx" ON "pages_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_gallery_order_idx" ON "pages_blocks_gallery" USING btree ("_order");
  CREATE INDEX "pages_blocks_gallery_parent_id_idx" ON "pages_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_gallery_path_idx" ON "pages_blocks_gallery" USING btree ("_path");
  CREATE INDEX "pages_blocks_slider_slides_order_idx" ON "pages_blocks_slider_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_slider_slides_parent_id_idx" ON "pages_blocks_slider_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_slider_slides_image_idx" ON "pages_blocks_slider_slides" USING btree ("image_id");
  CREATE INDEX "pages_blocks_slider_order_idx" ON "pages_blocks_slider" USING btree ("_order");
  CREATE INDEX "pages_blocks_slider_parent_id_idx" ON "pages_blocks_slider" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_slider_path_idx" ON "pages_blocks_slider" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_order_idx" ON "pages_blocks_video" USING btree ("_order");
  CREATE INDEX "pages_blocks_video_parent_id_idx" ON "pages_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_video_path_idx" ON "pages_blocks_video" USING btree ("_path");
  CREATE INDEX "pages_blocks_video_upload_video_idx" ON "pages_blocks_video" USING btree ("upload_video_id");
  CREATE INDEX "pages_blocks_video_poster_image_idx" ON "pages_blocks_video" USING btree ("poster_image_id");
  CREATE INDEX "pages_blocks_accordion_items_order_idx" ON "pages_blocks_accordion_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_items_parent_id_idx" ON "pages_blocks_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_order_idx" ON "pages_blocks_accordion" USING btree ("_order");
  CREATE INDEX "pages_blocks_accordion_parent_id_idx" ON "pages_blocks_accordion" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_accordion_path_idx" ON "pages_blocks_accordion" USING btree ("_path");
  CREATE INDEX "pages_blocks_file_table_files_order_idx" ON "pages_blocks_file_table_files" USING btree ("_order");
  CREATE INDEX "pages_blocks_file_table_files_parent_id_idx" ON "pages_blocks_file_table_files" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_file_table_files_file_idx" ON "pages_blocks_file_table_files" USING btree ("file_id");
  CREATE INDEX "pages_blocks_file_table_order_idx" ON "pages_blocks_file_table" USING btree ("_order");
  CREATE INDEX "pages_blocks_file_table_parent_id_idx" ON "pages_blocks_file_table" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_file_table_path_idx" ON "pages_blocks_file_table" USING btree ("_path");
  CREATE INDEX "pages_blocks_statistics_stats_order_idx" ON "pages_blocks_statistics_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_statistics_stats_parent_id_idx" ON "pages_blocks_statistics_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_statistics_order_idx" ON "pages_blocks_statistics" USING btree ("_order");
  CREATE INDEX "pages_blocks_statistics_parent_id_idx" ON "pages_blocks_statistics" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_statistics_path_idx" ON "pages_blocks_statistics" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_order_idx" ON "pages_blocks_feature" USING btree ("_order");
  CREATE INDEX "pages_blocks_feature_parent_id_idx" ON "pages_blocks_feature" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_feature_path_idx" ON "pages_blocks_feature" USING btree ("_path");
  CREATE INDEX "pages_blocks_feature_image_idx" ON "pages_blocks_feature" USING btree ("image_id");
  CREATE INDEX "pages_blocks_icon_card_order_idx" ON "pages_blocks_icon_card" USING btree ("_order");
  CREATE INDEX "pages_blocks_icon_card_parent_id_idx" ON "pages_blocks_icon_card" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_icon_card_path_idx" ON "pages_blocks_icon_card" USING btree ("_path");
  CREATE INDEX "pages_blocks_project_cards_order_idx" ON "pages_blocks_project_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_project_cards_parent_id_idx" ON "pages_blocks_project_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_project_cards_path_idx" ON "pages_blocks_project_cards" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_manual_testimonials_order_idx" ON "pages_blocks_testimonials_manual_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_manual_testimonials_parent_id_idx" ON "pages_blocks_testimonials_manual_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_booking_search_form_order_idx" ON "pages_blocks_booking_search_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_booking_search_form_parent_id_idx" ON "pages_blocks_booking_search_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_booking_search_form_path_idx" ON "pages_blocks_booking_search_form" USING btree ("_path");
  CREATE INDEX "pages_content_builder_rows_order_idx" ON "pages_content_builder_rows" USING btree ("_order");
  CREATE INDEX "pages_content_builder_rows_parent_id_idx" ON "pages_content_builder_rows" USING btree ("_parent_id");
  CREATE INDEX "pages_content_builder_order_idx" ON "pages_content_builder" USING btree ("_order");
  CREATE INDEX "pages_content_builder_parent_id_idx" ON "pages_content_builder" USING btree ("_parent_id");
  CREATE INDEX "pages_content_builder_custom_background_image_idx" ON "pages_content_builder" USING btree ("custom_background_image_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_seo_seo_open_graph_image_idx" ON "pages" USING btree ("seo_open_graph_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_projects_id_idx" ON "pages_rels" USING btree ("projects_id");
  CREATE INDEX "pages_rels_testimonials_id_idx" ON "pages_rels" USING btree ("testimonials_id");
  CREATE INDEX "_pages_v_blocks_text_order_idx" ON "_pages_v_blocks_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_text_parent_id_idx" ON "_pages_v_blocks_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_text_path_idx" ON "_pages_v_blocks_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_order_idx" ON "_pages_v_blocks_image" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_parent_id_idx" ON "_pages_v_blocks_image" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_path_idx" ON "_pages_v_blocks_image" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_image_idx" ON "_pages_v_blocks_image" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_buttons_buttons_order_idx" ON "_pages_v_blocks_buttons_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_buttons_buttons_parent_id_idx" ON "_pages_v_blocks_buttons_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_buttons_order_idx" ON "_pages_v_blocks_buttons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_buttons_parent_id_idx" ON "_pages_v_blocks_buttons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_buttons_path_idx" ON "_pages_v_blocks_buttons" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_form_fields_options_order_idx" ON "_pages_v_blocks_form_fields_options" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_fields_options_parent_id_idx" ON "_pages_v_blocks_form_fields_options" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_fields_order_idx" ON "_pages_v_blocks_form_fields" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_fields_parent_id_idx" ON "_pages_v_blocks_form_fields" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_order_idx" ON "_pages_v_blocks_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_form_parent_id_idx" ON "_pages_v_blocks_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_form_path_idx" ON "_pages_v_blocks_form" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contact_details_items_lines_order_idx" ON "_pages_v_blocks_contact_details_items_lines" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_details_items_lines_parent_id_idx" ON "_pages_v_blocks_contact_details_items_lines" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_details_items_order_idx" ON "_pages_v_blocks_contact_details_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_details_items_parent_id_idx" ON "_pages_v_blocks_contact_details_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_details_inset_panel_items_order_idx" ON "_pages_v_blocks_contact_details_inset_panel_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_details_inset_panel_items_parent_id_idx" ON "_pages_v_blocks_contact_details_inset_panel_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_details_order_idx" ON "_pages_v_blocks_contact_details" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_details_parent_id_idx" ON "_pages_v_blocks_contact_details" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_details_path_idx" ON "_pages_v_blocks_contact_details" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_map_order_idx" ON "_pages_v_blocks_map" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_map_parent_id_idx" ON "_pages_v_blocks_map" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_map_path_idx" ON "_pages_v_blocks_map" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_gallery_images_order_idx" ON "_pages_v_blocks_gallery_images" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_images_parent_id_idx" ON "_pages_v_blocks_gallery_images" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_images_image_idx" ON "_pages_v_blocks_gallery_images" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_gallery_order_idx" ON "_pages_v_blocks_gallery" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_gallery_parent_id_idx" ON "_pages_v_blocks_gallery" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_gallery_path_idx" ON "_pages_v_blocks_gallery" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_slider_slides_order_idx" ON "_pages_v_blocks_slider_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_slider_slides_parent_id_idx" ON "_pages_v_blocks_slider_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_slider_slides_image_idx" ON "_pages_v_blocks_slider_slides" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_slider_order_idx" ON "_pages_v_blocks_slider" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_slider_parent_id_idx" ON "_pages_v_blocks_slider" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_slider_path_idx" ON "_pages_v_blocks_slider" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_order_idx" ON "_pages_v_blocks_video" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_video_parent_id_idx" ON "_pages_v_blocks_video" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_video_path_idx" ON "_pages_v_blocks_video" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_video_upload_video_idx" ON "_pages_v_blocks_video" USING btree ("upload_video_id");
  CREATE INDEX "_pages_v_blocks_video_poster_image_idx" ON "_pages_v_blocks_video" USING btree ("poster_image_id");
  CREATE INDEX "_pages_v_blocks_accordion_items_order_idx" ON "_pages_v_blocks_accordion_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_items_parent_id_idx" ON "_pages_v_blocks_accordion_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_order_idx" ON "_pages_v_blocks_accordion" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_accordion_parent_id_idx" ON "_pages_v_blocks_accordion" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_accordion_path_idx" ON "_pages_v_blocks_accordion" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_file_table_files_order_idx" ON "_pages_v_blocks_file_table_files" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_file_table_files_parent_id_idx" ON "_pages_v_blocks_file_table_files" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_file_table_files_file_idx" ON "_pages_v_blocks_file_table_files" USING btree ("file_id");
  CREATE INDEX "_pages_v_blocks_file_table_order_idx" ON "_pages_v_blocks_file_table" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_file_table_parent_id_idx" ON "_pages_v_blocks_file_table" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_file_table_path_idx" ON "_pages_v_blocks_file_table" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_statistics_stats_order_idx" ON "_pages_v_blocks_statistics_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_statistics_stats_parent_id_idx" ON "_pages_v_blocks_statistics_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_statistics_order_idx" ON "_pages_v_blocks_statistics" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_statistics_parent_id_idx" ON "_pages_v_blocks_statistics" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_statistics_path_idx" ON "_pages_v_blocks_statistics" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_cta_order_idx" ON "_pages_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_cta_parent_id_idx" ON "_pages_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_cta_path_idx" ON "_pages_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_order_idx" ON "_pages_v_blocks_feature" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_feature_parent_id_idx" ON "_pages_v_blocks_feature" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_feature_path_idx" ON "_pages_v_blocks_feature" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_feature_image_idx" ON "_pages_v_blocks_feature" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_icon_card_order_idx" ON "_pages_v_blocks_icon_card" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_icon_card_parent_id_idx" ON "_pages_v_blocks_icon_card" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_icon_card_path_idx" ON "_pages_v_blocks_icon_card" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_project_cards_order_idx" ON "_pages_v_blocks_project_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_project_cards_parent_id_idx" ON "_pages_v_blocks_project_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_project_cards_path_idx" ON "_pages_v_blocks_project_cards" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_manual_testimonials_order_idx" ON "_pages_v_blocks_testimonials_manual_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_manual_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials_manual_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_booking_search_form_order_idx" ON "_pages_v_blocks_booking_search_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_booking_search_form_parent_id_idx" ON "_pages_v_blocks_booking_search_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_booking_search_form_path_idx" ON "_pages_v_blocks_booking_search_form" USING btree ("_path");
  CREATE INDEX "_pages_v_version_content_builder_rows_order_idx" ON "_pages_v_version_content_builder_rows" USING btree ("_order");
  CREATE INDEX "_pages_v_version_content_builder_rows_parent_id_idx" ON "_pages_v_version_content_builder_rows" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_content_builder_order_idx" ON "_pages_v_version_content_builder" USING btree ("_order");
  CREATE INDEX "_pages_v_version_content_builder_parent_id_idx" ON "_pages_v_version_content_builder" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_content_builder_custom_background_image_idx" ON "_pages_v_version_content_builder" USING btree ("custom_background_image_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_seo_version_seo_open_graph_image_idx" ON "_pages_v" USING btree ("version_seo_open_graph_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_projects_id_idx" ON "_pages_v_rels" USING btree ("projects_id");
  CREATE INDEX "_pages_v_rels_testimonials_id_idx" ON "_pages_v_rels" USING btree ("testimonials_id");
  CREATE INDEX "site_settings_primary_navigation_order_idx" ON "site_settings_primary_navigation" USING btree ("_order");
  CREATE INDEX "site_settings_primary_navigation_parent_id_idx" ON "site_settings_primary_navigation" USING btree ("_parent_id");
  CREATE INDEX "site_settings_footer_navigation_order_idx" ON "site_settings_footer_navigation" USING btree ("_order");
  CREATE INDEX "site_settings_footer_navigation_parent_id_idx" ON "site_settings_footer_navigation" USING btree ("_parent_id");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE INDEX "site_settings_seo_seo_open_graph_image_idx" ON "site_settings" USING btree ("seo_open_graph_image_id");
  CREATE INDEX "site_settings_updated_at_idx" ON "site_settings" USING btree ("updated_at");
  CREATE INDEX "site_settings_created_at_idx" ON "site_settings" USING btree ("created_at");
  CREATE INDEX "contact_submissions_updated_at_idx" ON "contact_submissions" USING btree ("updated_at");
  CREATE INDEX "contact_submissions_created_at_idx" ON "contact_submissions" USING btree ("created_at");
  CREATE INDEX "backup_history_updated_at_idx" ON "backup_history" USING btree ("updated_at");
  CREATE INDEX "backup_history_created_at_idx" ON "backup_history" USING btree ("created_at");
  CREATE INDEX "projects_services_order_idx" ON "projects_services" USING btree ("_order");
  CREATE INDEX "projects_services_parent_id_idx" ON "projects_services" USING btree ("_parent_id");
  CREATE INDEX "projects_results_order_idx" ON "projects_results" USING btree ("_order");
  CREATE INDEX "projects_results_parent_id_idx" ON "projects_results" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_hero_image_idx" ON "projects" USING btree ("hero_image_id");
  CREATE INDEX "projects_testimonial_idx" ON "projects" USING btree ("testimonial_id");
  CREATE INDEX "projects_seo_seo_open_graph_image_idx" ON "projects" USING btree ("seo_open_graph_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_media_id_idx" ON "projects_rels" USING btree ("media_id");
  CREATE INDEX "_projects_v_version_services_order_idx" ON "_projects_v_version_services" USING btree ("_order");
  CREATE INDEX "_projects_v_version_services_parent_id_idx" ON "_projects_v_version_services" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_results_order_idx" ON "_projects_v_version_results" USING btree ("_order");
  CREATE INDEX "_projects_v_version_results_parent_id_idx" ON "_projects_v_version_results" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_hero_image_idx" ON "_projects_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_projects_v_version_version_testimonial_idx" ON "_projects_v" USING btree ("version_testimonial_id");
  CREATE INDEX "_projects_v_version_seo_version_seo_open_graph_image_idx" ON "_projects_v" USING btree ("version_seo_open_graph_image_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_media_id_idx" ON "_projects_v_rels" USING btree ("media_id");
  CREATE INDEX "testimonials_avatar_idx" ON "testimonials" USING btree ("avatar_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_site_settings_id_idx" ON "payload_locked_documents_rels" USING btree ("site_settings_id");
  CREATE INDEX "payload_locked_documents_rels_contact_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("contact_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_backup_history_id_idx" ON "payload_locked_documents_rels" USING btree ("backup_history_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "pages_blocks_text" CASCADE;
  DROP TABLE "pages_blocks_image" CASCADE;
  DROP TABLE "pages_blocks_buttons_buttons" CASCADE;
  DROP TABLE "pages_blocks_buttons" CASCADE;
  DROP TABLE "pages_blocks_form_fields_options" CASCADE;
  DROP TABLE "pages_blocks_form_fields" CASCADE;
  DROP TABLE "pages_blocks_form" CASCADE;
  DROP TABLE "pages_blocks_contact_details_items_lines" CASCADE;
  DROP TABLE "pages_blocks_contact_details_items" CASCADE;
  DROP TABLE "pages_blocks_contact_details_inset_panel_items" CASCADE;
  DROP TABLE "pages_blocks_contact_details" CASCADE;
  DROP TABLE "pages_blocks_map" CASCADE;
  DROP TABLE "pages_blocks_gallery_images" CASCADE;
  DROP TABLE "pages_blocks_gallery" CASCADE;
  DROP TABLE "pages_blocks_slider_slides" CASCADE;
  DROP TABLE "pages_blocks_slider" CASCADE;
  DROP TABLE "pages_blocks_video" CASCADE;
  DROP TABLE "pages_blocks_accordion_items" CASCADE;
  DROP TABLE "pages_blocks_accordion" CASCADE;
  DROP TABLE "pages_blocks_file_table_files" CASCADE;
  DROP TABLE "pages_blocks_file_table" CASCADE;
  DROP TABLE "pages_blocks_statistics_stats" CASCADE;
  DROP TABLE "pages_blocks_statistics" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_feature" CASCADE;
  DROP TABLE "pages_blocks_icon_card" CASCADE;
  DROP TABLE "pages_blocks_project_cards" CASCADE;
  DROP TABLE "pages_blocks_testimonials_manual_testimonials" CASCADE;
  DROP TABLE "pages_blocks_testimonials" CASCADE;
  DROP TABLE "pages_blocks_booking_search_form" CASCADE;
  DROP TABLE "pages_content_builder_rows" CASCADE;
  DROP TABLE "pages_content_builder" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_text" CASCADE;
  DROP TABLE "_pages_v_blocks_image" CASCADE;
  DROP TABLE "_pages_v_blocks_buttons_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_buttons" CASCADE;
  DROP TABLE "_pages_v_blocks_form_fields_options" CASCADE;
  DROP TABLE "_pages_v_blocks_form_fields" CASCADE;
  DROP TABLE "_pages_v_blocks_form" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_details_items_lines" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_details_items" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_details_inset_panel_items" CASCADE;
  DROP TABLE "_pages_v_blocks_contact_details" CASCADE;
  DROP TABLE "_pages_v_blocks_map" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery_images" CASCADE;
  DROP TABLE "_pages_v_blocks_gallery" CASCADE;
  DROP TABLE "_pages_v_blocks_slider_slides" CASCADE;
  DROP TABLE "_pages_v_blocks_slider" CASCADE;
  DROP TABLE "_pages_v_blocks_video" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion_items" CASCADE;
  DROP TABLE "_pages_v_blocks_accordion" CASCADE;
  DROP TABLE "_pages_v_blocks_file_table_files" CASCADE;
  DROP TABLE "_pages_v_blocks_file_table" CASCADE;
  DROP TABLE "_pages_v_blocks_statistics_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_statistics" CASCADE;
  DROP TABLE "_pages_v_blocks_cta" CASCADE;
  DROP TABLE "_pages_v_blocks_feature" CASCADE;
  DROP TABLE "_pages_v_blocks_icon_card" CASCADE;
  DROP TABLE "_pages_v_blocks_project_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials_manual_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "_pages_v_blocks_booking_search_form" CASCADE;
  DROP TABLE "_pages_v_version_content_builder_rows" CASCADE;
  DROP TABLE "_pages_v_version_content_builder" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "site_settings_primary_navigation" CASCADE;
  DROP TABLE "site_settings_footer_navigation" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "contact_submissions" CASCADE;
  DROP TABLE "backup_history" CASCADE;
  DROP TABLE "projects_services" CASCADE;
  DROP TABLE "projects_results" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v_version_services" CASCADE;
  DROP TABLE "_projects_v_version_results" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "backup_settings" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_pages_blocks_text_hide";
  DROP TYPE "public"."enum_pages_blocks_image_hide";
  DROP TYPE "public"."enum_pages_blocks_buttons_buttons_style";
  DROP TYPE "public"."enum_pages_blocks_buttons_hide";
  DROP TYPE "public"."enum_pages_blocks_form_fields_type";
  DROP TYPE "public"."enum_pages_blocks_form_fields_width";
  DROP TYPE "public"."enum_pages_blocks_form_hide";
  DROP TYPE "public"."enum_pages_blocks_contact_details_hide";
  DROP TYPE "public"."enum_pages_blocks_map_hide";
  DROP TYPE "public"."enum_pages_blocks_gallery_gallery_layout";
  DROP TYPE "public"."enum_pages_blocks_gallery_hide";
  DROP TYPE "public"."enum_pages_blocks_slider_hide";
  DROP TYPE "public"."enum_pages_blocks_video_video_type";
  DROP TYPE "public"."enum_pages_blocks_video_hide";
  DROP TYPE "public"."enum_pages_blocks_accordion_hide";
  DROP TYPE "public"."enum_pages_blocks_file_table_hide";
  DROP TYPE "public"."enum_pages_blocks_statistics_hide";
  DROP TYPE "public"."enum_pages_blocks_cta_style";
  DROP TYPE "public"."enum_pages_blocks_cta_hide";
  DROP TYPE "public"."enum_pages_blocks_feature_hide";
  DROP TYPE "public"."enum_pages_blocks_icon_card_layout";
  DROP TYPE "public"."enum_pages_blocks_icon_card_hide";
  DROP TYPE "public"."enum_pages_blocks_project_cards_source";
  DROP TYPE "public"."enum_pages_blocks_project_cards_display_style";
  DROP TYPE "public"."enum_pages_blocks_project_cards_hide";
  DROP TYPE "public"."enum_pages_blocks_testimonials_source";
  DROP TYPE "public"."enum_pages_blocks_testimonials_display_style";
  DROP TYPE "public"."enum_pages_blocks_testimonials_hide";
  DROP TYPE "public"."enum_pages_blocks_booking_search_form_hide";
  DROP TYPE "public"."enum_pages_content_builder_rows_row_layout";
  DROP TYPE "public"."enum_pages_content_builder_rows_hide";
  DROP TYPE "public"."enum_pages_content_builder_rows_column1_hide";
  DROP TYPE "public"."enum_pages_content_builder_rows_column2_hide";
  DROP TYPE "public"."enum_pages_content_builder_rows_column3_hide";
  DROP TYPE "public"."enum_pages_content_builder_rows_column4_hide";
  DROP TYPE "public"."enum_pages_content_builder_theme_style";
  DROP TYPE "public"."enum_pages_content_builder_vertical_alignment";
  DROP TYPE "public"."enum_pages_content_builder_padding_level";
  DROP TYPE "public"."enum_pages_content_builder_full_width";
  DROP TYPE "public"."enum_pages_content_builder_hide";
  DROP TYPE "public"."enum_pages_content_builder_background_repeat";
  DROP TYPE "public"."enum_pages_content_builder_background_size";
  DROP TYPE "public"."enum_pages_content_builder_background_position";
  DROP TYPE "public"."enum_pages_seo_schema_type";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_text_hide";
  DROP TYPE "public"."enum__pages_v_blocks_image_hide";
  DROP TYPE "public"."enum__pages_v_blocks_buttons_buttons_style";
  DROP TYPE "public"."enum__pages_v_blocks_buttons_hide";
  DROP TYPE "public"."enum__pages_v_blocks_form_fields_type";
  DROP TYPE "public"."enum__pages_v_blocks_form_fields_width";
  DROP TYPE "public"."enum__pages_v_blocks_form_hide";
  DROP TYPE "public"."enum__pages_v_blocks_contact_details_hide";
  DROP TYPE "public"."enum__pages_v_blocks_map_hide";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_gallery_layout";
  DROP TYPE "public"."enum__pages_v_blocks_gallery_hide";
  DROP TYPE "public"."enum__pages_v_blocks_slider_hide";
  DROP TYPE "public"."enum__pages_v_blocks_video_video_type";
  DROP TYPE "public"."enum__pages_v_blocks_video_hide";
  DROP TYPE "public"."enum__pages_v_blocks_accordion_hide";
  DROP TYPE "public"."enum__pages_v_blocks_file_table_hide";
  DROP TYPE "public"."enum__pages_v_blocks_statistics_hide";
  DROP TYPE "public"."enum__pages_v_blocks_cta_style";
  DROP TYPE "public"."enum__pages_v_blocks_cta_hide";
  DROP TYPE "public"."enum__pages_v_blocks_feature_hide";
  DROP TYPE "public"."enum__pages_v_blocks_icon_card_layout";
  DROP TYPE "public"."enum__pages_v_blocks_icon_card_hide";
  DROP TYPE "public"."enum__pages_v_blocks_project_cards_source";
  DROP TYPE "public"."enum__pages_v_blocks_project_cards_display_style";
  DROP TYPE "public"."enum__pages_v_blocks_project_cards_hide";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_source";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_display_style";
  DROP TYPE "public"."enum__pages_v_blocks_testimonials_hide";
  DROP TYPE "public"."enum__pages_v_blocks_booking_search_form_hide";
  DROP TYPE "public"."enum__pages_v_version_content_builder_rows_row_layout";
  DROP TYPE "public"."enum__pages_v_version_content_builder_rows_hide";
  DROP TYPE "public"."enum__pages_v_version_content_builder_rows_column1_hide";
  DROP TYPE "public"."enum__pages_v_version_content_builder_rows_column2_hide";
  DROP TYPE "public"."enum__pages_v_version_content_builder_rows_column3_hide";
  DROP TYPE "public"."enum__pages_v_version_content_builder_rows_column4_hide";
  DROP TYPE "public"."enum__pages_v_version_content_builder_theme_style";
  DROP TYPE "public"."enum__pages_v_version_content_builder_vertical_alignment";
  DROP TYPE "public"."enum__pages_v_version_content_builder_padding_level";
  DROP TYPE "public"."enum__pages_v_version_content_builder_full_width";
  DROP TYPE "public"."enum__pages_v_version_content_builder_hide";
  DROP TYPE "public"."enum__pages_v_version_content_builder_background_repeat";
  DROP TYPE "public"."enum__pages_v_version_content_builder_background_size";
  DROP TYPE "public"."enum__pages_v_version_content_builder_background_position";
  DROP TYPE "public"."enum__pages_v_version_seo_schema_type";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_backup_history_backup_type";
  DROP TYPE "public"."enum_backup_history_status";
  DROP TYPE "public"."enum_projects_seo_schema_type";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_seo_schema_type";
  DROP TYPE "public"."enum__projects_v_version_status";`)
}
