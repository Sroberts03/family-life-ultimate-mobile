create type subscription_level as enum ('basic', 'premium');
create type family_role as enum ('parent', 'child', 'other');

create table if not exists families (
    family_id uuid primary key default gen_random_uuid(),
    owner_id uuid references auth.users(id) on delete cascade not null,
    subscription_level subscription_level not null default 'basic',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null, -- Added comma
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table authorized_edit_family_users (
    user_id uuid references auth.users(id) on delete cascade not null,
    family_id uuid references families(family_id) on delete cascade not null,
    primary key (user_id, family_id) 
);

create table if not exists user_families (
    user_id uuid references auth.users(id) on delete cascade not null,
    family_id uuid references families(family_id) on delete cascade not null,
    family_role family_role not null,
    primary key (user_id, family_id)
);

alter table user_families enable row level security;
alter table families enable row level security;
alter table authorized_edit_family_users enable row level security;

create policy "Users can view their own families" on user_families for select using (auth.uid() = user_id);
create policy "Users can insert their own families" on user_families for insert with check (auth.uid() = user_id);
create policy "Users can update their own families" on user_families for update using (auth.uid() = user_id);
create policy "Users can delete their own families" on user_families for delete using (auth.uid() = user_id);

create policy "Family Owner or authorized users can manage their families" 
on families for all 
using (
    auth.uid() = owner_id 
    or 
    exists (
        select 1 from authorized_edit_family_users 
        where authorized_edit_family_users.family_id = families.family_id 
        and authorized_edit_family_users.user_id = auth.uid()
    )
);

create policy "Family Owner or authorized users can manage authorized users" 
on authorized_edit_family_users for all 
using (
    auth.uid() = user_id 
    or 
    exists (
        select 1 from families 
        where families.family_id = authorized_edit_family_users.family_id 
        and families.owner_id = auth.uid()
    )
);