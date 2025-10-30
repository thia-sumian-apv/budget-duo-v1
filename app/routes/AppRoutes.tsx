import AuthenticatedRoutes from "@/app/routes/AuthenticatedRoutes";
import UnauthenticatedRoutes from "@/app/routes/UnauthenticatedRoutes";

interface AppRoutesProps {
  isAuthenticated: boolean;
}

const AppRoutes = ({ isAuthenticated }: AppRoutesProps) => {
  if (!isAuthenticated) {
    return <UnauthenticatedRoutes />;
  }
  return <AuthenticatedRoutes />;
};

export default AppRoutes;
