-- Create profiles table for users (landlords)
create table if not exists public.profiles (
  id uuid primary key,
  email text,
  full_name text,
  phone text,
  created_at timestamp with time zone default now()
);

-- Tenant evaluation requests table
create table if not exists public.tenant_evaluations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  
  -- Tenant basic info
  tenant_full_name text not null,
  tenant_dni text not null,
  tenant_email text,
  tenant_phone text,
  
  -- Income info
  income_type text,
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
  status text default 'pending',
  score_result jsonb,
  
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Dependents table for tenant family members
create table if not exists public.tenant_dependents (
  id uuid primary key default gen_random_uuid(),
  evaluation_id uuid not null,
  full_name text not null,
  relationship text not null,
  age integer,
  created_at timestamp with time zone default now()
);
