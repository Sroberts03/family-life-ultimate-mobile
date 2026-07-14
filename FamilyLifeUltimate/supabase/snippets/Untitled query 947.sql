drop table user_chore;

create table if not exists user_chore (
    user_id uuid references auth.users(id) on delete cascade not null,
    chore_id integer references chores(id) on delete cascade not null,
    primary key (user_id, chore_id)
);

alter table user_chore enable row level security;
