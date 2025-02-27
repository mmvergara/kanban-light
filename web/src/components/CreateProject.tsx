import { FormEvent, useState } from "react";
import supabase from "../supabase";
import { useSession } from "../context/SessionContext";
import { ProjectsTable } from "../supabase/supabase-types";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type Props = {
  onNewProject: (project: ProjectsTable) => void;
};

const CreateProject = ({ onNewProject }: Props) => {
  const { user } = useSession();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>("");
  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault();
    if (projectName.trim() === "") return;
    if (!user) return;
    const { data, error } = await supabase
      .from("projects")
      .insert({
        name: projectName,
        owner_id: user.id,
      })
      .select("*");
    if (data && data.length == 1) {
      onNewProject(data[0]);
    }
    if (error) {
      console.error(error);
      return;
    }
    toast.success("Project created");
    navigate(`/app/${data[0].id}`);
    setProjectName("");
    setIsCreating(false);
  };
  return (
    <>
      {isCreating ? (
        <form onSubmit={handleCreateProject}>
          <input
            type="text"
            className="bg-[#191919] w-full p-1 px-2 text-sm outline-none"
            placeholder="Project Name"
            value={projectName}
            autoFocus
            onChange={(e) => setProjectName(e.target.value)}
          />
          <div className="w-[50%] ml-auto flex gap-1 mt-1">
            <button
              type="submit"
              className="text-sm p-1 w-[50%] bg-[#191919] hover:text-emerald-500"
            >
              add
            </button>
            <button
              type="button"
              className="text-sm p-1 w-[50%] bg-[#191919] hover:text-red-500"
              onClick={() => setIsCreating(false)}
            >
              close
            </button>
          </div>
        </form>
      ) : (
        <button
          className="p-2 text-sm hover:bg-[#191919] text-[#919191] w-full flex items-center gap-1 rounded-sm transition-all"
          draggable="true"
          onClick={() => {
            setIsCreating(true);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
          New
        </button>
      )}
    </>
  );
};

export default CreateProject;
