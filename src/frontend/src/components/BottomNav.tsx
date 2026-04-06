import { Compass, Heart, MessageSquare, User } from "lucide-react";
import type { Page } from "../App";
import { getUnreadCount, useAppStore } from "../store/appStore";

interface Props {
  currentPage: Page;
  navigate: (page: Page) => void;
}

const NAV_ITEMS = [
  { id: "discover" as Page, icon: Compass, label: "Discover" },
  { id: "matches" as Page, icon: Heart, label: "Matches" },
  { id: "messages" as Page, icon: MessageSquare, label: "Messages" },
  { id: "profile" as Page, icon: User, label: "Profile" },
];

export default function BottomNav({ currentPage, navigate }: Props) {
  const { state } = useAppStore();
  const currentUserId = state.currentUserId || "profile-isabelle";
  const unreadCount = getUnreadCount(state, currentUserId);

  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50 px-4">
      <nav
        className="flex items-center gap-1 px-2 py-2 rounded-full glass border border-white/10"
        style={{
          boxShadow:
            "0 8px 32px oklch(0 0 0 / 0.4), 0 2px 8px oklch(0 0 0 / 0.3)",
        }}
        aria-label="Main navigation"
        data-ocid="nav.panel"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = currentPage === item.id;
          const showBadge = item.id === "messages" && unreadCount > 0;

          return (
            <button
              type="button"
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, oklch(0.32 0.12 15), oklch(0.55 0.12 15))",
                    }
                  : {}
              }
              aria-current={isActive ? "page" : undefined}
              data-ocid={`nav.${item.id}.link`}
            >
              <item.icon className="w-4 h-4" />
              {isActive && <span className="text-xs">{item.label}</span>}
              {showBadge && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full gradient-rose text-white text-xs flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
