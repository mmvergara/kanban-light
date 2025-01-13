import { Outlet } from "react-router-dom";
import { SessionProvider } from "./context/SessionContext";
import Layout from "./components/Layout";
import { ToastContainer } from "react-toastify";

const Providers = () => {
  return (
    <SessionProvider>
      <ToastContainer theme="dark" autoClose={2000} />
      <Layout>
        <Outlet />
      </Layout>
    </SessionProvider>
  );
};

export default Providers;
