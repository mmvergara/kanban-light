-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.binding;
DROP TABLE IF EXISTS public.tasks;
DROP TABLE IF EXISTS public.columns;
DROP TABLE IF EXISTS public.projects;

-- Create projects table
CREATE TABLE public.projects (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name CHARACTER VARYING NOT NULL,
    owner_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    CONSTRAINT projects_pkey PRIMARY KEY (id),
    CONSTRAINT projects_owner_id_fkey FOREIGN KEY (owner_id)
        REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT projects_name_unique UNIQUE (name),
    CONSTRAINT projects_name_length CHECK (char_length(name) >= 3 AND
        char_length(name) <= 50)
) TABLESPACE pg_default;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable users to access their own projects"
ON public.projects
TO authenticated
USING (auth.uid() = owner_id);

-- Create columns table
CREATE TABLE public.columns (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name CHARACTER VARYING NOT NULL,
    "order" INTEGER NOT NULL,
    project_id UUID NOT NULL,
    owner_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    CONSTRAINT columns_pkey PRIMARY KEY (id),
    CONSTRAINT columns_owner_id_fkey FOREIGN KEY (owner_id)
        REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT columns_project_id_fkey FOREIGN KEY (project_id)
        REFERENCES public.projects (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT columns_name_unique UNIQUE (name),
    CONSTRAINT columns_name_length CHECK (char_length(name) >= 3 AND
        char_length(name) <= 50)
) TABLESPACE pg_default;

ALTER TABLE public.columns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable users to access their own columns"
ON public.columns
TO authenticated
USING (auth.uid() = owner_id);

-- Create tasks table
CREATE TABLE public.tasks (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    name CHARACTER VARYING NOT NULL,
    "order" INTEGER NOT NULL,
    column_id UUID NOT NULL,
    owner_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    CONSTRAINT tasks_pkey PRIMARY KEY (id),
    CONSTRAINT tasks_column_id_fkey FOREIGN KEY (column_id)
        REFERENCES public.columns (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT tasks_owner_id_fkey FOREIGN KEY (owner_id)
        REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT tasks_name_unique UNIQUE (name),
    CONSTRAINT tasks_name_length CHECK (char_length(name) <= 255)
) TABLESPACE pg_default;

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable users to access their own tasks"
ON public.tasks
TO authenticated
USING (auth.uid() = owner_id);

-- Create binding table
CREATE TABLE public.binding (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL UNIQUE,
    key UUID NOT NULL DEFAULT gen_random_uuid(),
    discord_user_id BIGINT, 
    active_project UUID,
    active_column UUID,
    
    CONSTRAINT discord_user_id_length CHECK (discord_user_id IS NULL OR
        discord_user_id >= 0),
    CONSTRAINT binding_key_unique UNIQUE (key),
    CONSTRAINT binding_discord_user_id_unique UNIQUE (discord_user_id),
    CONSTRAINT binding_pkey PRIMARY KEY (id),
    CONSTRAINT binding_active_project_fkey FOREIGN KEY (active_project)
        REFERENCES public.projects (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT binding_active_column_fkey FOREIGN KEY (active_column)
        REFERENCES public.columns (id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT binding_owner_id_fkey FOREIGN KEY (owner_id)
        REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE
) TABLESPACE pg_default;

ALTER TABLE public.binding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable users to access their own binding"
ON public.binding
TO authenticated
USING (auth.uid() = owner_id);
