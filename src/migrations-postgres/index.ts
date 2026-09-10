import * as migration_20260702_082045_initial_schema from './20260702_082045_initial_schema';
import * as migration_20260910_000000_media_prefix from './20260910_000000_media_prefix';

export const migrations = [
  {
    up: migration_20260702_082045_initial_schema.up,
    down: migration_20260702_082045_initial_schema.down,
    name: '20260702_082045_initial_schema'
  },
  {
    up: migration_20260910_000000_media_prefix.up,
    down: migration_20260910_000000_media_prefix.down,
    name: '20260910_000000_media_prefix'
  },
];
