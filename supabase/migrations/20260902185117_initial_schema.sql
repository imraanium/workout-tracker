create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  name text not null, description text, type text not null check (type in ('strength','running')),
  target_day smallint check (target_day between 0 and 6), created_at timestamptz not null default now()
);
create table if not exists public.template_exercises (
  id uuid primary key default gen_random_uuid(), template_id uuid not null references public.templates(id) on delete cascade,
  exercise_name text not null, order_index integer not null, target_sets integer not null check (target_sets > 0),
  target_reps text not null, target_weight numeric, rest_seconds integer
);
create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  template_id uuid references public.templates(id) on delete set null, name text not null,
  type text not null check (type in ('strength','running')), logged_at timestamptz not null default now()
);
create table if not exists public.workout_exercises (
  id uuid primary key default gen_random_uuid(), workout_id uuid not null references public.workouts(id) on delete cascade,
  exercise_name text not null, target_reps text not null, order_index integer not null
);
create table if not exists public.sets (
  id uuid primary key default gen_random_uuid(), workout_exercise_id uuid not null references public.workout_exercises(id) on delete cascade,
  set_number integer not null, weight numeric, reps integer, is_completed boolean not null default false
);
create table if not exists public.warmup_references (
  id uuid primary key default gen_random_uuid(), title text not null, description text not null, category text not null
);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public
as $$ begin insert into public.profiles (id, email) values (new.id, new.email) on conflict (id) do update set email = excluded.email; return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert or update of email on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.templates enable row level security;
alter table public.template_exercises enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.sets enable row level security;
alter table public.warmup_references enable row level security;

create policy "profiles own data" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "templates own data" on public.templates for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "template exercises through owner" on public.template_exercises for all using (exists (select 1 from public.templates t where t.id = template_id and t.user_id = auth.uid())) with check (exists (select 1 from public.templates t where t.id = template_id and t.user_id = auth.uid()));
create policy "workouts own data" on public.workouts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workout exercises through owner" on public.workout_exercises for all using (exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid())) with check (exists (select 1 from public.workouts w where w.id = workout_id and w.user_id = auth.uid()));
create policy "sets through owner" on public.sets for all using (exists (select 1 from public.workout_exercises e join public.workouts w on w.id = e.workout_id where e.id = workout_exercise_id and w.user_id = auth.uid())) with check (exists (select 1 from public.workout_exercises e join public.workouts w on w.id = e.workout_id where e.id = workout_exercise_id and w.user_id = auth.uid()));
create policy "warmups are public" on public.warmup_references for select using (true);
