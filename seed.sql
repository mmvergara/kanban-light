drop table if exists public.binding;
drop table if exists public.tasks;
drop table if exists public.columns;
drop table if exists public.projects;

create table
  public.projects (
    id uuid not null default gen_random_uuid(),
    name character varying not null,
    owner_id uuid not null,
    created_at timestamp with time zone not null default now(),
    constraint projects_pkey primary key (id),
    constraint projects_owner_id_fkey foreign key (owner_id)
      references auth.users (id) on update cascade on delete cascade,
    constraint projects_name_unique unique (name),
    constraint projects_name_length check (char_length(name) <= 255)
  ) tablespace pg_default;
alter table projects enable row level security;

create policy "Enable users to access their own projects"
on "public"."projects"
to authenticated
using (auth.uid() = owner_id);

create table
  public.columns (
    id uuid not null default gen_random_uuid(),
    name character varying not null,
    "order" integer not null,
    project_id uuid not null,
    owner_id uuid not null,
    created_at timestamp with time zone not null default now(),
    constraint columns_pkey primary key (id),
    constraint columns_owner_id_fkey foreign key (owner_id)
      references auth.users (id) on update cascade on delete cascade,
    constraint columns_project_id_fkey foreign key (project_id)
      references projects (id) on update cascade on delete cascade,
    constraint columns_name_unique unique (name),
    constraint columns_name_length check (char_length(name) <= 255)
  ) tablespace pg_default;
alter table columns enable row level security;

create policy "Enable users to access their own columns"
on "public"."columns"
to authenticated
using (auth.uid() = owner_id);

create table
  public.tasks (
    id uuid not null default gen_random_uuid(),
    name character varying not null,
    "order" integer not null,
    column_id uuid not null,
    owner_id uuid not null,
    created_at timestamp with time zone not null default now(),
    constraint tasks_pkey primary key (id),
    constraint tasks_column_id_fkey foreign key (column_id)
      references columns (id) on update cascade on delete cascade,
    constraint tasks_owner_id_fkey foreign key (owner_id)
      references auth.users (id) on update cascade on delete cascade,
    constraint tasks_name_unique unique (name),
    constraint tasks_name_length check (char_length(name) <= 255)
  ) tablespace pg_default;
alter table tasks enable row level security;

create policy "Enable users to access their own tasks"
on "public"."tasks"
to authenticated
using (auth.uid() = owner_id);

create table
  public.binding (
    id uuid not null default gen_random_uuid(),
    owner_id uuid not null,
    key uuid not null default gen_random_uuid(),
    discord_userd_id character varying,
    active_project uuid,
    active_column uuid,
    constraint discord_userd_id_length check (char_length(discord_userd_id) <= 255),
    constraint binding_key_unique unique (key),
    constraint binding_discord_userd_id_unique unique (discord_userd_id),
    constraint binding_pkey primary key (id),
    constraint binding_active_project_fkey foreign key (active_project)
      references projects (id) on update cascade on delete cascade,
    constraint binding_active_column_fkey foreign key (active_column)
      references columns (id) on update cascade on delete cascade,
    constraint binding_owner_id_fkey foreign key (owner_id)
      references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;
alter table binding enable row level security;

create policy "Enable users to access their own binding"
on "public"."binding"
to authenticated
using (auth.uid() = owner_id);
