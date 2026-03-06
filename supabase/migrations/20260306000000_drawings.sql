create table if not exists drawings (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique,
  snapshot_encrypted text not null,
  iv text not null,
  updated_at timestamptz not null default now()
);

alter table drawings enable row level security;

create policy "users can read own drawing"
  on drawings for select
  using (user_id = current_setting('app.user_id', true));

create policy "users can upsert own drawing"
  on drawings for insert
  with check (user_id = current_setting('app.user_id', true));

create policy "users can update own drawing"
  on drawings for update
  using (user_id = current_setting('app.user_id', true));
