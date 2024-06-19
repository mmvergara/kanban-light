import { toast } from "react-toastify";
import supabase from "../../supabase";

const Sidebar = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };
  return (
    <aside className="bg-[#202020] w-[240px] drop-shadow-xl flex flex-col justify-between">
      <div>asdasd</div>
      <button onClick={handleLogout} className="p-2">
        Sign Out
      </button>
    </aside>
  );
};

export default Sidebar;
