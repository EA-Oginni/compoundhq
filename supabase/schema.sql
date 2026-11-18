-- CompoundHQ starter schema. Review and adapt before production.
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'tenant' check (role in ('tenant','landlord','admin')),
  phone text,
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending','verified','rejected','suspended')),
  created_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  city text not null,
  area text not null,
  property_type text not null,
  bedrooms integer not null default 0,
  bathrooms integer not null default 0,
  annual_rent numeric(14,2) not null check (annual_rent >= 0),
  agency_fee numeric(14,2) not null default 0,
  agreement_fee numeric(14,2) not null default 0,
  caution_fee numeric(14,2) not null default 0,
  image_urls text[] not null default '{}',
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending','verified','rejected','suspended')),
  availability_status text not null default 'available'
    check (availability_status in ('available','rented','pending')),
  created_at timestamptz not null default now()
);

create table if not exists public.favourites (
  tenant_id uuid not null references public.profiles(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tenant_id, property_id)
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.profiles(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  message text not null,
  status text not null default 'sent',
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.profiles(id),
  property_id uuid not null references public.properties(id),
  provider text not null check (provider in ('paystack','flutterwave')),
  provider_reference text not null unique,
  amount numeric(14,2) not null check (amount > 0),
  currency text not null default 'NGN',
  status text not null default 'pending'
    check (status in ('pending','successful','failed','cancelled','refunded')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.favourites enable row level security;
alter table public.enquiries enable row level security;
alter table public.payments enable row level security;

-- Public users can view available listings; only the owning landlord can manage their listings.
create policy "Anyone can view available properties"
on public.properties for select using (availability_status = 'available' or landlord_id = auth.uid());

create policy "Landlords can insert own properties"
on public.properties for insert with check (landlord_id = auth.uid());

create policy "Landlords can update own properties"
on public.properties for update using (landlord_id = auth.uid()) with check (landlord_id = auth.uid());

create policy "Users can view own profile"
on public.profiles for select using (id = auth.uid());

create policy "Users can update own profile"
on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create policy "Tenants manage own favourites"
on public.favourites for all using (tenant_id = auth.uid()) with check (tenant_id = auth.uid());

create policy "Tenants create own enquiries"
on public.enquiries for insert with check (tenant_id = auth.uid());

create policy "Tenant and listing landlord view enquiries"
on public.enquiries for select using (
  tenant_id = auth.uid() or exists (
    select 1 from public.properties p
    where p.id = property_id and p.landlord_id = auth.uid()
  )
);

create policy "Users view own payments"
on public.payments for select using (tenant_id = auth.uid());

-- IMPORTANT:
-- Do not let clients insert successful payment records.
-- Create payment records and update statuses only through trusted server functions
-- after verifying the provider response/webhook. Add admin policies only after
-- implementing a secure role/claims strategy.
