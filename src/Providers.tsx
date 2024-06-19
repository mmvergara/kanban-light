import { Outlet } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext";
import Layout from "./components/layout/Layout";

const Providers = () => {
  return (
    <SessionProvider>
      <Layout>
        <Outlet />
      </Layout>
    </SessionProvider>
  );
};

export default Providers;
