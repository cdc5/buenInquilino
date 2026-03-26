-- Create profiles table for users (landlords)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  phone text,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Tenant evaluation requests table
create table if not exists public.tenant_evaluations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  
  -- Tenant basic info
  tenant_full_name text not null,
  tenant_dni text not null,
  tenant_email text,
  tenant_phone text,
  
  -- Income info
  income_type text check (income_type in ('relacion', 'monotributo', 'autonomo', 'sin')),
  employer_name text,
  monthly_salary numeric,
  monotributo_category text,
  activity_name text,
  
  -- Contract info
  property_address text,
  property_city text,
  monthly_rent numeric,
  contract_start_date date,
  
  -- Status
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'cancelled')),
  score_result jsonb,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.tenant_evaluations enable row level security;

create policy "evaluations_select_own" on public.tenant_evaluations for select using (auth.uid() = user_id);
create policy "evaluations_insert_own" on public.tenant_evaluations for insert with check (auth.uid() = user_id);
create policy "evaluations_update_own" on public.tenant_evaluations for update using (auth.uid() = user_id);
create policy "evaluations_delete_own" on public.tenant_evaluations for delete using (auth.uid() = user_id);

-- Dependents table for tenant family members
create table if not exists public.tenant_dependents (
  id uuid primary key default gen_random_uuid(),
  evaluation_id uuid not null references public.tenant_evaluations(id) on delete cascade,
  full_name text not null,
  relationship text not null,
  age integer,
  created_at timestamp with time zone default now()
);

alter table public.tenant_dependents enable row level security;

-- RLS for dependents based on evaluation ownership
create policy "dependents_select" on public.tenant_dependents for select 
  using (exists (
    select 1 from public.tenant_evaluations 
    where tenant_evaluations.id = tenant_dependents.evaluation_id 
    and tenant_evaluations.user_id = auth.uid()
  ));

create policy "dependents_insert" on public.tenant_dependents for insert 
  with check (exists (
    select 1 from public.tenant_evaluations 
    where tenant_evaluations.id = tenant_dependents.evaluation_id 
    and tenant_evaluations.user_id = auth.uid()
  ));

create policy "dependents_delete" on public.tenant_dependents for delete 
  using (exists (
    select 1 from public.tenant_evaluations 
    where tenant_evaluations.id = tenant_dependents.evaluation_id 
    and tenant_evaluations.user_id = auth.uid()
  ));
