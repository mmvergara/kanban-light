import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import NotFoundPage from "../pages/404Page";

const AuthProtectedRoute = () => {
  const { session } = useSession();
  if (!session) {
    // or you can redirect to a different page and show a message
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default AuthProtectedRoute;
