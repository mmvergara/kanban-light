create table
public.projects (
  id uuid not null default gen_random_uuid (),
  owner uuid not null,
  name character varying not null,
  "order" bigint not null,
  created_at timestamp with time zone not null default now(),
  constraint project_pkey primary key (id),
  constraint project_order_key unique ("order"),
  constraint project_owner_fkey foreign key (owner) references auth.users (id) on update cascade on delete cascade
) tablespace pg_default;

create table
  public.boards (
    id uuid not null default gen_random_uuid (),
    project_id uuid not null,
    name character varying not null,
    "order" bigint not null,
    created_at timestamp with time zone not null default now(),
    owner_id uuid not null,
    constraint boards_pkey primary key (id),
    constraint boards_order_key unique ("order"),
    constraint boards_owner_id_fkey foreign key (owner_id) references auth.users (id) on update cascade on delete cascade,
    constraint boards_project_id_fkey foreign key (project_id) references projects (id) on update cascade on delete cascade
  ) tablespace pg_default;

create table
public.tasks (
  id uuid not null default gen_random_uuid (),
  name text not null,
  "order" bigint not null,
  owner_id uuid not null,
  board_id uuid null,
  created_at timestamp with time zone not null default now(),
  constraint tasks_pkey primary key (id),
  constraint tasks_id_key unique (id),
  constraint tasks_board_id_fkey foreign key (board_id) references boards (id) on update cascade on delete cascade,
  constraint tasks_owner_id_fkey foreign key (owner_id) references auth.users (id) on update cascade on delete cascade
) tablespace pg_default;
