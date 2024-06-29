create table
  public.projects (
    id uuid not null default gen_random_uuid (),
    name character varying not null,
    "order" integer not null,
    owner_id uuid not null,
    created_at timestamp with time zone not null default now(),
    constraint projects_pkey primary key (id),
    constraint projects_owner_fkey foreign key (owner_id) references auth.users (id) on update cascade on delete cascade,
    constraint projects_owner_id_fkey foreign key (owner_id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;

create table
  public.projects (
    id uuid not null default gen_random_uuid (),
    name character varying not null,
    "order" integer not null,
    owner_id uuid not null,
    created_at timestamp with time zone not null default now(),
    constraint projects_pkey primary key (id),
    constraint projects_order_key unique ("order"),
    constraint projects_owner_fkey foreign key (owner_id) references auth.users (id) on update cascade on delete cascade,
    constraint projects_owner_id_fkey foreign key (owner_id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;

create table
  public.tasks (
    id uuid not null default gen_random_uuid (),
    name character varying not null,
    "order" integer not null,
    column_id uuid not null,
    owner_id uuid not null,
    created_at timestamp with time zone not null default now(),
    constraint tasks_pkey primary key (id),
    constraint tasks_column_id_fkey foreign key (column_id) references columns (id) on update cascade on delete cascade,
    constraint tasks_owner_id_fkey foreign key (owner_id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;