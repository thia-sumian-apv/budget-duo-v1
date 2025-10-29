import LandingPage from "@/components/pages/LandingPage";

const UnauthenticatedRoutes = () => {
  // Default unauthenticated experience is the marketing landing page.
  // Keep AuthPage available via explicit link/button.
  return <LandingPage />;
};

export default UnauthenticatedRoutes;
