import { toast } from "react-toastify";
import supabase from "../../supabase";
import { getRandomQuote } from "../../utils/quotes";
import { Link } from "react-router-dom";
import Clock from "./Clock";
import CreateProject from "./CreateProject";
import { ProjectsTable } from "../../supabase/supabase-types";
import { useEffect, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const Sidebar = () => {
  const [localProjects, setLocalProjects] = useLocalStorage<ProjectsTable[]>(
    `projects`,
    []
  );
  const [projects, setProjects] = useState<ProjectsTable[]>(localProjects);
  const [isLoading, setIsloading] = useState<boolean>(true);
  const [quote] = useState(getRandomQuote());
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.localStorage.clear();
    toast.success("Signed out successfully");
  };

  const handleGetProjects = async () => {
    const { data, error } = await supabase.from("projects").select("*");
    if (error) {
      console.error(error);
      setIsloading(false);
      return;
    }
    if (data) {
      setProjects(data);
      console.log(data);
    }
    setIsloading(false);
  };

  useEffect(() => {
    handleGetProjects();
  }, []);

  useEffect(() => {
    setLocalProjects(projects);
  }, [projects]);
  // #e9e9e9
  const highestOrder = Math.max(...projects.map((p) => p.order), 0);
  return (
    <aside className="bg-[#202020] w-[240px] drop-shadow-xl flex flex-col justify-between p-2">
      <section className="w-full flex flex-col">
        <h1 className="text-center items-center bg-[#191919] p-2 rounded-sm text-emerald-400 mb-1">
          Kanban Light
          <p className="text-xs text-center text-zinc-400 mt-1">{quote}</p>
        </h1>
        <Clock />
        {projects.map((p) => {
          return (
            <Link
              key={p.id}
              to={`/app/${p.id}`}
              className="p-2 text-sm hover:bg-[#191919] text-[#b6b6b6] w-full flex items-center gap-1 mb-1 rounded-sm transition-all"
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
            </Link>
          );
        })}
        {/* {isLoading && (
          <>
            <div className="p-2 text-sm h-[36px] animate-pulse bg-[#353535] w-full flex items-center gap-1 mb-1 rounded-sm transition-all" />
            <div className="p-2 text-sm h-[36px] animate-pulse bg-[#353535] w-full flex items-center gap-1 mb-1 rounded-sm transition-all" />
            <div className="p-2 text-sm h-[36px] animate-pulse bg-[#353535] w-full flex items-center gap-1 mb-1 rounded-sm transition-all" />
          </>
        )} */}
        {isLoading ? (
          <div className="p-2 text-sm hover:bg-[#191919] text-[#919191] w-full flex items-center gap-1 rounded-sm transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="animate-spin"
            >
              <path d="M3 2v6h6" />
              <path d="M21 12A9 9 0 0 0 6 5.3L3 8" />
              <path d="M21 22v-6h-6" />
              <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
              <circle cx="12" cy="12" r="1" />
            </svg>
            Syncing...
          </div>
        ) : (
          <CreateProject
            highestOrder={highestOrder}
            onNewProject={(p) => {
              setProjects([...projects, p]);
            }}
          />
        )}
      </section>
      <div className="bg-[#191919] p-1 px-2 w-fit">
        <button onClick={handleLogout} className=" hover:text-red-600 text-xs">
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
