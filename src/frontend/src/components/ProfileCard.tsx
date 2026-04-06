import { EyeOff, Heart, X } from "lucide-react";
import type { UserProfile } from "../store/appStore";

interface Props {
  profile: UserProfile;
  onLike: (id: string) => void;
  onPass: (id: string) => void;
  featured?: boolean;
}

export default function ProfileCard({
  profile,
  onLike,
  onPass,
  featured = false,
}: Props) {
  return (
    <div
      className={`relative rounded-3xl overflow-hidden ${
        featured ? "card-shadow-featured h-full" : "card-shadow h-52"
      }`}
      style={{
        border: featured
          ? "1px solid oklch(0.75 0.08 15 / 0.4)"
          : "1px solid oklch(1 0 0 / 0.08)",
      }}
      data-ocid="discover.card"
    >
      {/* Photo */}
      <div className="absolute inset-0">
        <img
          src={profile.photoUrl}
          alt={`${profile.name}'s profile`}
          className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${
            profile.privacyBlurPhoto ? "blur-photo" : ""
          }`}
          loading="lazy"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 gradient-card-overlay" />

      {/* Privacy indicator */}
      {profile.privacyBlurPhoto && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full glass text-xs text-white/80">
          <EyeOff className="w-3 h-3" />
          <span>Private</span>
        </div>
      )}

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="mb-4">
          <h2
            className={`font-bold text-white leading-tight ${featured ? "text-3xl" : "text-xl"}`}
          >
            {profile.name}, <span className="font-normal">{profile.age}</span>
          </h2>
          <p className="text-white/70 text-sm mt-1">
            {profile.location}
            {profile.relationshipStatus && (
              <>
                <span className="mx-1.5 opacity-50">·</span>
                {profile.relationshipStatus}
              </>
            )}
          </p>
          {featured && (
            <p className="text-white/60 text-sm mt-2 line-clamp-2">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Action buttons */}
        {featured && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onPass(profile.id)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-medium text-sm text-white/90 transition-all hover:opacity-90 active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.25 0.10 15), oklch(0.32 0.12 15))",
                border: "1px solid oklch(1 0 0 / 0.1)",
              }}
              data-ocid="discover.secondary_button"
            >
              <X className="w-4 h-4" />
              Pass
            </button>
            <button
              type="button"
              onClick={() => onLike(profile.id)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-medium text-sm text-white transition-all hover:opacity-90 active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.12 15), oklch(0.75 0.08 15))",
                border: "1px solid oklch(0.75 0.08 15 / 0.3)",
              }}
              data-ocid="discover.primary_button"
            >
              <Heart className="w-4 h-4 fill-white" />
              Like
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
