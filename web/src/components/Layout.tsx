import { useSession } from "../context/SessionContext";
import Sidebar from "./Sidebar";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const { session } = useSession();
  return (
    <main className="flex h-[100vh] overflow-hidden bg-[#191919]">
      {session && <Sidebar />}
      {children}
    </main>
  );
};

export default Layout;
