drop table if exists public.tasks;
drop table if exists public.columns;
drop table if exists public.projects;
drop table if exists public.binding_keys;

create table
  public.binding_keys(
    id uuid not null default gen_random_uuid(),
    owner_id uuid not null,
    key uuid not null default gen_random_uuid(),
    constraint binding_keys_pkey primary key (id),
    constraint binding_keys_owner_id_fkey foreign key (owner_id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;
alter table binding_keys enable row level security;

create policy "Enable users to access their own binding_keys"
on "public"."binding_keys"
to authenticated
using (auth.uid() = owner_id);

create table
  public.projects (
    id uuid not null default gen_random_uuid (),
    name character varying not null,
    "order" integer not null,
    owner_id uuid not null,
    created_at timestamp with time zone not null default now(),
    constraint projects_pkey primary key (id),
    constraint projects_owner_id_fkey foreign key (owner_id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;
alter table projects enable row level security;

create policy "Enable users to access their own projects"
on "public"."projects"
to authenticated
using (auth.uid() = owner_id);


create table
  public.columns (
    id uuid not null default gen_random_uuid (),
    name character varying not null,
    "order" integer not null,
    project_id uuid not null,
    owner_id uuid not null,
    created_at timestamp with time zone not null default now(),
    constraint columns_pkey primary key (id),
    constraint columns_owner_id_fkey foreign key (owner_id) references auth.users (id) on update cascade on delete cascade,
    constraint columns_project_id_fkey foreign key (project_id) references projects (id) on update cascade on delete cascade
  ) tablespace pg_default;
alter table columns enable row level security;

create policy "Enable users to access their own columns"
on "public"."columns"
to authenticated
using (auth.uid() = owner_id);

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
alter table tasks enable row level security;

create policy "Enable users to access their own tasks"
on "public"."tasks"
to authenticated
using (auth.uid() = owner_id);