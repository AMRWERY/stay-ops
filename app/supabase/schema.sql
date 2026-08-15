-- StayOps database schema
-- Run in Supabase SQL editor. Enables RLS on every table; policies are
-- intentionally simple (role-based) and should be tightened per deployment.

create extension if not exists "uuid-ossp";

-- ── Properties (multi-property support) ─────────────────────────────
create table properties (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text,
  timezone text default 'UTC',
  created_at timestamptz default now()
);

-- ── Staff / profiles (extends auth.users) ───────────────────────────
create type staff_role as enum ('admin', 'warehouse_manager', 'room_service_staff', 'supervisor', 'housekeeping');
create type staff_status as enum ('active', 'on_shift', 'off_shift', 'inactive');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  property_id uuid references properties(id),
  full_name text not null,
  role staff_role not null default 'room_service_staff',
  status staff_status not null default 'active',
  phone text,
  avatar_url text,
  hired_at date,
  created_at timestamptz default now()
);

-- ── Rooms ────────────────────────────────────────────────────────────
create type room_status as enum ('vacant_clean', 'vacant_dirty', 'occupied', 'out_of_service', 'maintenance');

create table rooms (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id),
  room_number text not null,
  floor text,
  room_type text,
  status room_status not null default 'vacant_clean',
  qr_token text unique default uuid_generate_v4(),
  created_at timestamptz default now(),
  unique (property_id, room_number)
);

-- ── Inventory: categories, suppliers, items, stock movements ───────
create table item_categories (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id),
  name text not null,
  parent_id uuid references item_categories(id)
);

create table suppliers (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id),
  name text not null,
  contact_name text,
  email text,
  phone text,
  notes text,
  created_at timestamptz default now()
);

create table inventory_items (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id),
  category_id uuid references item_categories(id),
  supplier_id uuid references suppliers(id),
  sku text,
  name text not null,
  unit text not null default 'unit', -- e.g. box, bottle, kg
  quantity_on_hand numeric not null default 0,
  reorder_threshold numeric not null default 0,
  unit_cost numeric,
  is_perishable boolean not null default false,
  expiry_date date,
  location text, -- shelf / bin in warehouse
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create type stock_movement_type as enum ('stock_in', 'stock_out', 'adjustment', 'waste', 'transfer');

create table stock_movements (
  id uuid primary key default uuid_generate_v4(),
  item_id uuid references inventory_items(id) on delete cascade,
  type stock_movement_type not null,
  quantity numeric not null, -- positive or negative
  reason text,
  related_order_id uuid, -- optional link to room_service_orders
  performed_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- ── Purchase orders (reorder from suppliers) ────────────────────────
create type purchase_order_status as enum ('draft', 'sent', 'partially_received', 'received', 'cancelled');

create table purchase_orders (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id),
  supplier_id uuid references suppliers(id),
  status purchase_order_status not null default 'draft',
  created_by uuid references profiles(id),
  expected_date date,
  created_at timestamptz default now()
);

create table purchase_order_lines (
  id uuid primary key default uuid_generate_v4(),
  purchase_order_id uuid references purchase_orders(id) on delete cascade,
  item_id uuid references inventory_items(id),
  quantity numeric not null,
  unit_cost numeric
);

-- ── Room service orders ─────────────────────────────────────────────
create type order_status as enum ('pending', 'preparing', 'on_the_way', 'delivered', 'cancelled');
create type order_priority as enum ('normal', 'high', 'urgent');

create table room_service_orders (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id),
  room_id uuid references rooms(id),
  status order_status not null default 'pending',
  priority order_priority not null default 'normal',
  assigned_to uuid references profiles(id),
  requested_by_guest boolean default true,
  notes text,
  guest_rating smallint check (guest_rating between 1 and 5),
  guest_feedback text,
  created_at timestamptz default now(),
  preparing_at timestamptz,
  on_the_way_at timestamptz,
  delivered_at timestamptz
);

create table room_service_order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references room_service_orders(id) on delete cascade,
  item_id uuid references inventory_items(id),
  quantity numeric not null default 1,
  notes text
);

-- ── Notifications ────────────────────────────────────────────────────
create type notification_type as enum ('low_stock', 'expiry', 'new_order', 'order_urgent', 'purchase_order', 'shift');

create table notifications (
  id uuid primary key default uuid_generate_v4(),
  property_id uuid references properties(id),
  profile_id uuid references profiles(id), -- null = broadcast to role
  role staff_role,
  type notification_type not null,
  title text not null,
  body text,
  read boolean default false,
  created_at timestamptz default now()
);

-- ── Shifts ───────────────────────────────────────────────────────────
create table shifts (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  checked_in_at timestamptz,
  checked_out_at timestamptz
);

-- ── RLS (enable + minimal authenticated policy; refine per property) ─
alter table properties enable row level security;
alter table profiles enable row level security;
alter table rooms enable row level security;
alter table item_categories enable row level security;
alter table suppliers enable row level security;
alter table inventory_items enable row level security;
alter table stock_movements enable row level security;
alter table purchase_orders enable row level security;
alter table purchase_order_lines enable row level security;
alter table room_service_orders enable row level security;
alter table room_service_order_items enable row level security;
alter table notifications enable row level security;
alter table shifts enable row level security;

create policy "authenticated read" on properties for select using (auth.role() = 'authenticated');
create policy "authenticated read" on profiles for select using (auth.role() = 'authenticated');
create policy "authenticated all" on rooms for all using (auth.role() = 'authenticated');
create policy "authenticated all" on item_categories for all using (auth.role() = 'authenticated');
create policy "authenticated all" on suppliers for all using (auth.role() = 'authenticated');
create policy "authenticated all" on inventory_items for all using (auth.role() = 'authenticated');
create policy "authenticated all" on stock_movements for all using (auth.role() = 'authenticated');
create policy "authenticated all" on purchase_orders for all using (auth.role() = 'authenticated');
create policy "authenticated all" on purchase_order_lines for all using (auth.role() = 'authenticated');
create policy "authenticated all" on room_service_orders for all using (auth.role() = 'authenticated');
create policy "authenticated all" on room_service_order_items for all using (auth.role() = 'authenticated');
create policy "authenticated all" on notifications for all using (auth.role() = 'authenticated');
create policy "authenticated all" on shifts for all using (auth.role() = 'authenticated');

-- Guests reach a single room via QR code with no login: expose a narrow,
-- anonymous-insert-only policy on room_service_orders instead if you want
-- guests to submit requests directly without auth. Example:
-- create policy "guest can create order" on room_service_orders
--   for insert to anon with check (true);
