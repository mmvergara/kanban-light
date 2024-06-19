import { toast } from "react-toastify";
import supabase from "../../supabase";
import { getRandomQuote } from "../../utils/quotes";
import { Link } from "react-router-dom";
import Clock from "./Clock";
import CreateProject from "../CreateProject";

const Sidebar = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };
  return (
    <aside className="bg-[#202020] w-[240px] drop-shadow-xl flex flex-col justify-between p-2">
      <section className="w-full flex flex-col">
        <h1 className="text-center items-center bg-[#191919] p-2 rounded-sm text-emerald-400 mb-1">
          Kanban Light
          <p className="text-xs text-center text-zinc-400 mt-1">
            {getRandomQuote()}
          </p>
        </h1>
        <Link
          to="/projects"
          className="p-2 text-sm hover:bg-[#191919] text-[#b6b6b6] w-full flex items-center gap-1 rounded-sm transition-all"
          draggable="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
          </svg>
          Todo list
        </Link>{" "}
        <Link
          to="/projects"
          className="p-2 text-sm hover:bg-[#191919] text-[#b6b6b6] w-full flex items-center gap-1 rounded-sm transition-all"
          draggable="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
          </svg>
          Todo list
        </Link>{" "}
        <Link
          to="/projects"
          className="p-2 text-sm hover:bg-[#191919] text-[#e9e9e9] w-full flex items-center gap-1 rounded-sm transition-all"
          draggable="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
          </svg>
          Todo list
        </Link>
        <CreateProject />
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
