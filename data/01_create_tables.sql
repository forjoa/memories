-- =========================
-- users
-- =========================
create table users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  created_at timestamp not null default now()
);

-- =========================
-- records
-- =========================
create table records (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references users(id) on delete cascade,
  created_at timestamp not null default now()
);

-- =========================
-- memories
-- =========================
create table memories (
  id uuid primary key default gen_random_uuid(),

  record_id uuid not null references records(id) on delete cascade,
  author_id uuid not null references users(id),

  data jsonb not null,

  valid_from timestamp not null,
  valid_to   timestamp,

  created_at timestamp not null default now()
);

-- =========================
-- constraint critica
-- =========================
create unique index one_active_memory_per_record
on memories (record_id)
where valid_to is null;

-- =========================
-- indices
-- =========================
create index idx_memories_record_time
on memories (record_id, valid_from);

create index idx_memories_author
on memories (author_id);

create index idx_memories_data
on memories using gin (data);