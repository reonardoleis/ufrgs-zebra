create table puzzles(
  id serial primary key,
  play_code uuid unique default gen_random_uuid(),
  edit_code uuid unique default gen_random_uuid(),
  puzzle text not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);