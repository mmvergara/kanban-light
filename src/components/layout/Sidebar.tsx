import { toast } from "react-toastify";
import supabase from "../../supabase";
import { getRandomQuote } from "../../utils/quotes";
import { Link } from "react-router-dom";
import Clock from "./Clock";
import CreateProject from "../CreateProject";
import { ProjectsTable } from "../../supabase/supabase-types";
import { useEffect, useState } from "react";
import { Reorder } from "framer-motion";

const Sidebar = () => {
  const [projects, setProjects] = useState<ProjectsTable[]>([]);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  const handleGetProjects = async () => {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) {
      console.error(error);
      return;
    }
    if (data) {
      setProjects(data);
      console.log(data);
    }
  };

  useEffect(() => {
    handleGetProjects();
  }, []);
  // #e9e9e9
  const highestOrder = Math.max(...projects.map((p) => p.order), 0);
  return (
    <aside className="bg-[#202020] w-[240px] drop-shadow-xl flex flex-col justify-between p-2">
      <section className="w-full flex flex-col">
        <h1 className="text-center items-center bg-[#191919] p-2 rounded-sm text-emerald-400 mb-1">
          Kanban Light
          <p className="text-xs text-center text-zinc-400 mt-1">
            {getRandomQuote()}
          </p>
        </h1>

        <Reorder.Group
          axis="y"
          values={projects}
          onReorder={(e) => {
            console.log(e);
            setProjects(e);
          }}
        >
          {projects.map((p) => {
            return (
              <Reorder.Item key={p.id} value={p}>
                <button
                  // to={`/projects/${p.id}`}
                  className="p-2 text-sm bg-[#191919] text-[#b6b6b6] w-full flex items-center gap-1 mb-1 rounded-sm transition-all"
                  // draggable="true"
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
                    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                  </svg>
                  {p.name}
                </button>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>

        <CreateProject
          highestOrder={highestOrder}
          onNewProject={(p) => {
            setProjects([...projects, p]);
          }}
        />
      </section>
      <div>
        <div className="bg-[#191919] p-1 px-2 rounded-">
          <button
            onClick={handleLogout}
            className=" hover:text-red-600 text-xs"
          >
            Sign Out
          </button>
          <Clock />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
