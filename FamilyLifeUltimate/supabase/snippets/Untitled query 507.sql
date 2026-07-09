ALTER TABLE join_family_requests
ADD created_at timestamp with time zone default timezone('utc'::text, now()) not null;

ALTER TABLE join_family_requests
ADD updated_at timestamp with time zone default timezone('utc'::text, now()) not null;