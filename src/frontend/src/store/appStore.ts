import { type Dispatch, createContext, useContext, useReducer } from "react";

export interface UserProfile {
  id: string;
  principal: string;
  name: string;
  age: number;
  gender: "male" | "female" | "non-binary";
  location: string;
  relationshipStatus: string;
  bio: string;
  photoUrl: string;
  privacyBlurPhoto: boolean;
  privacyHideFromDiscover: boolean;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: number;
}

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt: number;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface Report {
  id: string;
  reporterId: string;
  targetId: string;
  reason: string;
  resolved: boolean;
  createdAt: number;
}

export interface Filters {
  ageMin: number;
  ageMax: number;
  gender: "all" | "male" | "female" | "non-binary";
  location: string;
  status: "all" | "attached" | "seeking";
}

export interface AppState {
  profiles: UserProfile[];
  currentUserId: string | null;
  likes: Record<string, string[]>;
  passes: Record<string, string[]>;
  matches: Match[];
  messages: Message[];
  reports: Report[];
  filters: Filters;
  discoverIndex: number;
}

const SEED_PROFILES: UserProfile[] = [
  {
    id: "profile-sarah",
    principal: "demo-sarah",
    name: "Sarah",
    age: 38,
    gender: "female",
    location: "Paris",
    relationshipStatus: "Married",
    bio: "Married but curious. Looking for adventure and those electric moments you never forget. Discretion is everything to me.",
    photoUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80",
    privacyBlurPhoto: true,
    privacyHideFromDiscover: false,
    isAdmin: false,
    isBanned: false,
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: "profile-marc",
    principal: "demo-marc",
    name: "Marc",
    age: 44,
    gender: "male",
    location: "London",
    relationshipStatus: "Attached",
    bio: "Businessman seeking excitement outside routine. Enjoy fine dining, jazz nights, and meaningful conversation with someone who understands.",
    photoUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
    privacyBlurPhoto: false,
    privacyHideFromDiscover: false,
    isAdmin: false,
    isBanned: false,
    createdAt: Date.now() - 86400000 * 25,
  },
  {
    id: "profile-sophie",
    principal: "demo-sophie",
    name: "Sophie",
    age: 35,
    gender: "female",
    location: "Berlin",
    relationshipStatus: "Married",
    bio: "Artist and traveler. Life is too short for regrets. I paint, I dream, I wander. Looking for someone who makes the world feel bigger.",
    photoUrl:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
    privacyBlurPhoto: false,
    privacyHideFromDiscover: false,
    isAdmin: false,
    isBanned: false,
    createdAt: Date.now() - 86400000 * 20,
  },
  {
    id: "profile-david",
    principal: "demo-david",
    name: "David",
    age: 41,
    gender: "male",
    location: "New York",
    relationshipStatus: "Married",
    bio: "Successful exec looking for genuine connection outside the boardroom. Smart, attentive, and absolutely discreet.",
    photoUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    privacyBlurPhoto: false,
    privacyHideFromDiscover: false,
    isAdmin: false,
    isBanned: false,
    createdAt: Date.now() - 86400000 * 18,
  },
  {
    id: "profile-isabelle",
    principal: "demo-isabelle",
    name: "Isabelle",
    age: 33,
    gender: "female",
    location: "Madrid",
    relationshipStatus: "Attached",
    bio: "Free spirit who loves good wine and long conversation. Not looking for complications — just those moments that make you feel truly alive.",
    photoUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600&q=80",
    privacyBlurPhoto: false,
    privacyHideFromDiscover: false,
    isAdmin: false,
    isBanned: false,
    createdAt: Date.now() - 86400000 * 15,
  },
  {
    id: "profile-thomas",
    principal: "demo-thomas",
    name: "Thomas",
    age: 47,
    gender: "male",
    location: "Amsterdam",
    relationshipStatus: "Married",
    bio: "Seeking discretion and real chemistry. I believe in connection without complications. Let's keep it elegant.",
    photoUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
    privacyBlurPhoto: false,
    privacyHideFromDiscover: false,
    isAdmin: false,
    isBanned: false,
    createdAt: Date.now() - 86400000 * 12,
  },
  {
    id: "profile-elena",
    principal: "demo-elena",
    name: "Elena",
    age: 36,
    gender: "female",
    location: "Rome",
    relationshipStatus: "Married",
    bio: "Passionate about art, music, and hidden connections. Rome taught me that beauty hides in unexpected places.",
    photoUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80",
    privacyBlurPhoto: false,
    privacyHideFromDiscover: false,
    isAdmin: false,
    isBanned: false,
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: "profile-james",
    principal: "demo-james",
    name: "James",
    age: 39,
    gender: "male",
    location: "Dubai",
    relationshipStatus: "Married",
    bio: "Entrepreneur. Married, seeking something real beyond the surface. Travel, ambition, and that rare spark — if you have it, I want to find you.",
    photoUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80",
    privacyBlurPhoto: false,
    privacyHideFromDiscover: false,
    isAdmin: false,
    isBanned: false,
    createdAt: Date.now() - 86400000 * 8,
  },
  {
    id: "profile-admin",
    principal: "demo-admin",
    name: "Admin",
    age: 30,
    gender: "non-binary",
    location: "Global",
    relationshipStatus: "N/A",
    bio: "App administrator.",
    photoUrl:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&q=80",
    privacyBlurPhoto: false,
    privacyHideFromDiscover: true,
    isAdmin: true,
    isBanned: false,
    createdAt: Date.now() - 86400000 * 60,
  },
];

const DEMO_USER_ID = "profile-isabelle";

const SEED_MATCHES: Match[] = [
  {
    id: "match-1",
    user1Id: DEMO_USER_ID,
    user2Id: "profile-marc",
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "match-2",
    user1Id: DEMO_USER_ID,
    user2Id: "profile-thomas",
    createdAt: Date.now() - 86400000 * 1,
  },
];

const SEED_MESSAGES: Message[] = [
  {
    id: "msg-1",
    matchId: "match-1",
    senderId: "profile-marc",
    content:
      "Hello Isabelle, your profile caught my eye. I'd love to get to know you better.",
    timestamp: Date.now() - 86400000 * 2 + 3600000,
    read: true,
  },
  {
    id: "msg-2",
    matchId: "match-1",
    senderId: DEMO_USER_ID,
    content:
      "Marc, I was wondering when you'd write! Tell me about London — is it as grey and wonderful as they say?",
    timestamp: Date.now() - 86400000 * 2 + 7200000,
    read: true,
  },
  {
    id: "msg-3",
    matchId: "match-1",
    senderId: "profile-marc",
    content:
      "Wonderfully grey, yes — but I find warmth in good company. Are you free this weekend?",
    timestamp: Date.now() - 86400000 * 2 + 10800000,
    read: true,
  },
  {
    id: "msg-4",
    matchId: "match-2",
    senderId: "profile-thomas",
    content:
      "Amsterdam is beautiful in autumn. I'd like to share it with someone worth knowing.",
    timestamp: Date.now() - 86400000 + 3600000,
    read: false,
  },
];

const SEED_REPORTS: Report[] = [
  {
    id: "report-1",
    reporterId: "profile-sophie",
    targetId: "profile-james",
    reason: "Inappropriate messages",
    resolved: false,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: "report-2",
    reporterId: "profile-marc",
    targetId: "profile-david",
    reason: "Fake profile / impersonation",
    resolved: true,
    createdAt: Date.now() - 86400000 * 5,
  },
];

const initialState: AppState = {
  profiles: SEED_PROFILES,
  currentUserId: null,
  likes: {
    "profile-marc": [DEMO_USER_ID],
    "profile-thomas": [DEMO_USER_ID],
    [DEMO_USER_ID]: ["profile-marc", "profile-thomas"],
  },
  passes: {},
  matches: SEED_MATCHES,
  messages: SEED_MESSAGES,
  reports: SEED_REPORTS,
  filters: {
    ageMin: 25,
    ageMax: 60,
    gender: "all",
    location: "",
    status: "all",
  },
  discoverIndex: 0,
};

export type AppAction =
  | { type: "SET_CURRENT_USER"; payload: string | null }
  | { type: "CREATE_PROFILE"; payload: UserProfile }
  | { type: "UPDATE_PROFILE"; payload: Partial<UserProfile> & { id: string } }
  | { type: "LIKE_PROFILE"; payload: { likerId: string; targetId: string } }
  | { type: "PASS_PROFILE"; payload: { userId: string; targetId: string } }
  | { type: "ADD_MATCH"; payload: Match }
  | { type: "SEND_MESSAGE"; payload: Message }
  | { type: "MARK_MESSAGES_READ"; payload: { matchId: string } }
  | { type: "UPDATE_FILTERS"; payload: Partial<Filters> }
  | { type: "SET_DISCOVER_INDEX"; payload: number }
  | { type: "BAN_USER"; payload: { userId: string; banned: boolean } }
  | { type: "ADD_REPORT"; payload: Report }
  | { type: "RESOLVE_REPORT"; payload: string };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return { ...state, currentUserId: action.payload };

    case "CREATE_PROFILE":
      return { ...state, profiles: [...state.profiles, action.payload] };

    case "UPDATE_PROFILE": {
      const { id, ...updates } = action.payload;
      return {
        ...state,
        profiles: state.profiles.map((p) =>
          p.id === id ? { ...p, ...updates } : p,
        ),
      };
    }

    case "LIKE_PROFILE": {
      const { likerId, targetId } = action.payload;
      const existingLikes = state.likes[likerId] || [];
      if (existingLikes.includes(targetId)) return state;
      return {
        ...state,
        likes: {
          ...state.likes,
          [likerId]: [...existingLikes, targetId],
        },
      };
    }

    case "PASS_PROFILE": {
      const { userId, targetId } = action.payload;
      const existingPasses = state.passes[userId] || [];
      if (existingPasses.includes(targetId)) return state;
      return {
        ...state,
        passes: {
          ...state.passes,
          [userId]: [...existingPasses, targetId],
        },
        discoverIndex: state.discoverIndex + 1,
      };
    }

    case "ADD_MATCH":
      return {
        ...state,
        matches: [...state.matches, action.payload],
        discoverIndex: state.discoverIndex + 1,
      };

    case "SEND_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };

    case "MARK_MESSAGES_READ":
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.matchId === action.payload.matchId ? { ...m, read: true } : m,
        ),
      };

    case "UPDATE_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        discoverIndex: 0,
      };

    case "SET_DISCOVER_INDEX":
      return { ...state, discoverIndex: action.payload };

    case "BAN_USER":
      return {
        ...state,
        profiles: state.profiles.map((p) =>
          p.id === action.payload.userId
            ? { ...p, isBanned: action.payload.banned }
            : p,
        ),
      };

    case "ADD_REPORT":
      return { ...state, reports: [...state.reports, action.payload] };

    case "RESOLVE_REPORT":
      return {
        ...state,
        reports: state.reports.map((r) =>
          r.id === action.payload ? { ...r, resolved: true } : r,
        ),
      };

    default:
      return state;
  }
}

export interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<AppAction>;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("AppContext not found");
  return ctx;
}

export function useAppReducer() {
  return useReducer(appReducer, initialState);
}

export function getProfile(
  state: AppState,
  id: string,
): UserProfile | undefined {
  return state.profiles.find((p) => p.id === id);
}

export function getDiscoverQueue(
  state: AppState,
  currentUserId: string,
): UserProfile[] {
  const myLikes = state.likes[currentUserId] || [];
  const myPasses = state.passes[currentUserId] || [];
  const seen = new Set([...myLikes, ...myPasses, currentUserId]);

  const matchedUserIds = new Set(
    state.matches
      .filter((m) => m.user1Id === currentUserId || m.user2Id === currentUserId)
      .flatMap((m) => [m.user1Id, m.user2Id])
      .filter((id) => id !== currentUserId),
  );

  return state.profiles.filter((p) => {
    if (seen.has(p.id)) return false;
    if (matchedUserIds.has(p.id)) return false;
    if (p.privacyHideFromDiscover) return false;
    if (p.isBanned) return false;
    if (p.age < state.filters.ageMin || p.age > state.filters.ageMax)
      return false;
    if (state.filters.gender !== "all" && p.gender !== state.filters.gender)
      return false;
    if (
      state.filters.location &&
      !p.location.toLowerCase().includes(state.filters.location.toLowerCase())
    )
      return false;
    return true;
  });
}

export function getMatches(state: AppState, userId: string): Match[] {
  return state.matches.filter(
    (m) => m.user1Id === userId || m.user2Id === userId,
  );
}

export function getMatchPartner(
  state: AppState,
  match: Match,
  userId: string,
): UserProfile | undefined {
  const partnerId = match.user1Id === userId ? match.user2Id : match.user1Id;
  return state.profiles.find((p) => p.id === partnerId);
}

export function getMatchMessages(state: AppState, matchId: string): Message[] {
  return state.messages
    .filter((m) => m.matchId === matchId)
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function getUnreadCount(state: AppState, userId: string): number {
  const userMatchIds = state.matches
    .filter((m) => m.user1Id === userId || m.user2Id === userId)
    .map((m) => m.id);
  return state.messages.filter(
    (m) => userMatchIds.includes(m.matchId) && m.senderId !== userId && !m.read,
  ).length;
}
