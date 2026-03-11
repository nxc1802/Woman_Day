-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/xtxczpjwssuxhcgrlusn/sql
-- Step 1: Create the gift_messages table
create table if not exists gift_messages (
  id            serial primary key,
  text          text          not null,
  display_order int           not null default 0,
  created_at    timestamptz   not null default now()
);

-- Step 2: Enable Row Level Security
alter table gift_messages enable row level security;

-- Step 3: RLS policies (public read/write — same as other tables)
create policy "Public read"   on gift_messages for select using (true);
create policy "Public insert" on gift_messages for insert with check (true);
create policy "Public update" on gift_messages for update using (true) with check (true);
create policy "Public delete" on gift_messages for delete using (true);
