import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "../store/appStore";

export default function FilterSidebar() {
  const { state, dispatch } = useAppStore();
  const { filters } = state;
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = <K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K],
  ) => {
    dispatch({ type: "UPDATE_FILTERS", payload: { [key]: value } });
  };

  const content = (
    <div
      className="bg-surface-2 rounded-3xl p-5 border border-white/5 card-shadow space-y-5"
      data-ocid="discover.panel"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground text-sm">
          Refine Your Search
        </h3>
        <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Gender */}
      <div>
        <span className="text-xs text-muted-foreground mb-2 block">
          Interested in
        </span>
        <div className="flex flex-col gap-1.5">
          {(["all", "female", "male", "non-binary"] as const).map((g) => (
            <button
              type="button"
              key={g}
              onClick={() => updateFilter("gender", g)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all text-left ${
                filters.gender === g
                  ? "bg-wine/30 text-foreground border border-rose/30"
                  : "text-muted-foreground hover:bg-white/5 border border-transparent"
              }`}
              data-ocid="discover.radio"
            >
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 transition-all ${
                  filters.gender === g ? "bg-rose" : "bg-white/20"
                }`}
              />
              <span className="capitalize">{g === "all" ? "Everyone" : g}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Age range */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Age range</span>
          <span className="text-xs text-rose font-medium">
            {filters.ageMin}–{filters.ageMax}
          </span>
        </div>
        <div className="space-y-3">
          <Slider
            min={18}
            max={70}
            step={1}
            value={[filters.ageMin]}
            onValueChange={([v]) =>
              v !== undefined && updateFilter("ageMin", v)
            }
            className="[&_[role=slider]]:bg-rose [&_[role=slider]]:border-rose"
            data-ocid="discover.toggle"
          />
          <Slider
            min={18}
            max={70}
            step={1}
            value={[filters.ageMax]}
            onValueChange={([v]) =>
              v !== undefined && updateFilter("ageMax", v)
            }
            className="[&_[role=slider]]:bg-rose [&_[role=slider]]:border-rose"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <span className="text-xs text-muted-foreground mb-2 block">
          Location
        </span>
        <input
          id="filter-location"
          type="text"
          value={filters.location}
          onChange={(e) => updateFilter("location", e.target.value)}
          placeholder="Any city..."
          className="w-full px-3 py-2 rounded-xl text-sm bg-surface-3 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-rose/40 transition-colors"
          data-ocid="discover.search_input"
        />
      </div>

      {/* Status */}
      <div>
        <span className="text-xs text-muted-foreground mb-2 block">Status</span>
        <div className="flex gap-1.5">
          {(["all", "attached", "seeking"] as const).map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => updateFilter("status", s)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                filters.status === s
                  ? "gradient-wine text-foreground border-rose/30"
                  : "bg-surface-3 text-muted-foreground border-white/10 hover:border-white/20"
              }`}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="w-full border-white/15 bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/5 text-xs"
        onClick={() =>
          dispatch({
            type: "UPDATE_FILTERS",
            payload: {
              ageMin: 25,
              ageMax: 60,
              gender: "all",
              location: "",
              status: "all",
            },
          })
        }
      >
        Reset Filters
      </Button>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-white/15 bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/5 mb-3"
          onClick={() => setIsOpen(!isOpen)}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          {isOpen ? "Hide Filters" : "Show Filters"}
        </Button>
        {isOpen && content}
      </div>
      {/* Desktop always visible */}
      <div className="hidden lg:block">{content}</div>
    </>
  );
}
