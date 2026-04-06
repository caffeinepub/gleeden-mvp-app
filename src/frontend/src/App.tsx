import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import AdminPage from "./pages/AdminPage";
import DiscoverPage from "./pages/DiscoverPage";
import LandingPage from "./pages/LandingPage";
import MatchesPage from "./pages/MatchesPage";
import MessagesPage from "./pages/MessagesPage";
import OnboardingPage from "./pages/OnboardingPage";
import ProfilePage from "./pages/ProfilePage";
import { AppContext, useAppReducer } from "./store/appStore";

export type Page =
  | "landing"
  | "onboarding"
  | "discover"
  | "matches"
  | "messages"
  | "profile"
  | "admin";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [state, dispatch] = useAppReducer();

  const navigate = (page: Page, options?: { matchId?: string }) => {
    if (options?.matchId) setSelectedMatchId(options.matchId);
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage navigate={navigate} />;
      case "onboarding":
        return <OnboardingPage navigate={navigate} />;
      case "discover":
        return <DiscoverPage navigate={navigate} />;
      case "matches":
        return (
          <MatchesPage
            navigate={navigate}
            onSelectMatch={(id) => {
              setSelectedMatchId(id);
              navigate("messages");
            }}
          />
        );
      case "messages":
        return (
          <MessagesPage navigate={navigate} selectedMatchId={selectedMatchId} />
        );
      case "profile":
        return <ProfilePage navigate={navigate} />;
      case "admin":
        return <AdminPage navigate={navigate} />;
      default:
        return <LandingPage navigate={navigate} />;
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="min-h-screen bg-background">{renderPage()}</div>
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            toast: "bg-surface-2 border border-rose/30 text-foreground",
          },
        }}
      />
    </AppContext.Provider>
  );
}
