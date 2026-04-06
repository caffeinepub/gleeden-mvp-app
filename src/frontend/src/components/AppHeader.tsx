import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Shield } from "lucide-react";
import type { Page } from "../App";
import { getProfile, useAppStore } from "../store/appStore";

interface Props {
  currentPage: Page;
  navigate: (page: Page) => void;
}

const NAV_LINKS: { id: Page; label: string }[] = [
  { id: "discover", label: "Discover" },
  { id: "matches", label: "Matches" },
  { id: "messages", label: "Messages" },
  { id: "profile", label: "Profile" },
];

export default function AppHeader({ currentPage, navigate }: Props) {
  const { state } = useAppStore();
  const currentUserId = state.currentUserId || "profile-isabelle";
  const currentProfile = getProfile(state, currentUserId);

  const showNav = currentPage !== "landing" && currentPage !== "onboarding";

  return (
    <header
      className="sticky top-0 z-40 border-b border-white/5"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.155 0.004 260) 0%, oklch(0.140 0.004 260) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      data-ocid="nav.panel"
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <button
          type="button"
          onClick={() => navigate("landing")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-full gradient-wine-rose flex items-center justify-center">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-display text-xl text-rose tracking-wide">
            Discreet
          </span>
        </button>

        {/* Center nav */}
        {showNav && (
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="App navigation"
          >
            {NAV_LINKS.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  type="button"
                  key={link.id}
                  onClick={() => navigate(link.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "text-foreground bg-wine/20 border border-rose/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                  data-ocid={`nav.${link.id}.link`}
                >
                  {link.label}
                </button>
              );
            })}
            {currentProfile?.isAdmin && (
              <button
                type="button"
                onClick={() => navigate("admin")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                  currentPage === "admin"
                    ? "text-foreground bg-wine/20 border border-rose/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
                data-ocid="nav.admin.link"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </button>
            )}
          </nav>
        )}

        {/* Right: user avatar */}
        {showNav && currentProfile && (
          <button
            type="button"
            onClick={() => navigate("profile")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            data-ocid="nav.profile.link"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={
                  currentProfile.privacyBlurPhoto
                    ? undefined
                    : currentProfile.photoUrl
                }
                className="object-cover"
              />
              <AvatarFallback className="bg-wine text-foreground text-sm">
                {currentProfile.name[0]}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:block text-sm text-muted-foreground">
              {currentProfile.name}
            </span>
          </button>
        )}

        {!showNav && <div className="w-8" />}
      </div>
    </header>
  );
}
