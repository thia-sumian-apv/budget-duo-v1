import AuthenticatedRoutes from "@/components/routes/AuthenticatedRoutes";
import UnauthenticatedRoutes from "@/components/routes/UnauthenticatedRoutes";

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
