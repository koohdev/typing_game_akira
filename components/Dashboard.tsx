import React, { useEffect } from "react";
import { PlayerStats, GameMode } from "../types";
import { ACHIEVEMENTS } from "../constants";
import {
  Trophy,
  Target,
  Play,
  ShoppingCart,
  User,
  Settings as SettingsIcon,
} from "lucide-react";

interface DashboardProps {
  stats: PlayerStats;
  onNavigate: (mode: GameMode) => void;
  onJackIn: () => void;
  bounty: { text: string; reward: number };
}

const Dashboard: React.FC<DashboardProps> = ({
  stats,
  onNavigate,
  onJackIn,
  bounty,
}) => {
  // #region agent log
  useEffect(() => {
    fetch("http://127.0.0.1:7243/ingest/07d90fc4-a1cd-44cc-af5c-0e5ea6c6f390", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "Dashboard.tsx:13",
        message: "Dashboard component mounted",
        data: { yen: stats.yen, gamesPlayed: stats.gamesPlayed },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "D",
      }),
    }).catch(() => {});

    // Check DOM element visibility
    setTimeout(() => {
      const dashboardEl = document.querySelector("[data-dashboard-root]");
      if (dashboardEl) {
        const rect = dashboardEl.getBoundingClientRect();
        const styles = window.getComputedStyle(dashboardEl);
        fetch(
          "http://127.0.0.1:7243/ingest/07d90fc4-a1cd-44cc-af5c-0e5ea6c6f390",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "Dashboard.tsx:44",
              message: "Dashboard DOM element check",
              data: {
                exists: !!dashboardEl,
                width: rect.width,
                height: rect.height,
                top: rect.top,
                left: rect.left,
                zIndex: styles.zIndex,
                opacity: styles.opacity,
                display: styles.display,
                visibility: styles.visibility,
              },
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "run1",
              hypothesisId: "F",
            }),
          }
        ).catch(() => {});
      } else {
        fetch(
          "http://127.0.0.1:7243/ingest/07d90fc4-a1cd-44cc-af5c-0e5ea6c6f390",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              location: "Dashboard.tsx:44",
              message: "Dashboard DOM element NOT FOUND",
              data: {},
              timestamp: Date.now(),
              sessionId: "debug-session",
              runId: "run1",
              hypothesisId: "F",
            }),
          }
        ).catch(() => {});
      }
    }, 100);
  }, []);
  // #endregion

  const time = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();
      if (k === "J") onJackIn(); // J for Jack In
      if (k === "B") onNavigate(GameMode.BOUNTY_BOARD);
      if (k === "M") onNavigate(GameMode.SHOP);
      if (k === "P") onNavigate(GameMode.PROFILE);
      if (k === "S") onNavigate(GameMode.SETTINGS);
      if (k === "Z") onNavigate(GameMode.ZEN);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onNavigate, onJackIn]);

  // Sort achievements: Locked first, but prioritize Daily Bounty
  // Only take top 5 for dashboard
  const sortedAchievements = [...ACHIEVEMENTS]
    .sort((a, b) => {
      const aUnlocked = stats.unlockedAchievements.includes(a.id);
      const bUnlocked = stats.unlockedAchievements.includes(b.id);
      if (aUnlocked === bUnlocked) return 0;
      return aUnlocked ? 1 : -1;
    })
    .slice(0, 5);

  // #region agent log
  useEffect(() => {
    fetch("http://127.0.0.1:7243/ingest/07d90fc4-a1cd-44cc-af5c-0e5ea6c6f390", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "Dashboard.tsx:45",
        message: "Dashboard render - returning JSX",
        data: { yen: stats.yen },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "E",
      }),
    }).catch(() => {});
  });
  // #endregion

  return (
    <div
      data-dashboard-root
      className="absolute inset-0 z-[110] flex flex-col p-4 xs:p-6 bg-transparent overflow-hidden"
      style={{ height: "100%", minHeight: "100%" }}
    >
      {/* Top Bar */}
      <div className="w-full flex justify-between items-start mb-4">
        <div className="clip-corner-1 bg-panel-bg p-4 pr-10 relative border-l-2 border-accent">
          <h1 className="font-header text-2xl xs:text-4xl text-white tracking-wider leading-none">
            KANEDA
            <br />
            <span className="text-accent text-lg">TERMINAL V11</span>
          </h1>
        </div>

        <div className="hidden md:block clip-corner-1 bg-panel-bg p-4 text-right border-r-2 border-gray-700">
          <div className="text-4xl font-header text-white mb-1">{time}</div>
          <div className="text-xs font-ui text-accent animate-pulse">
            NET STATUS: ONLINE
          </div>
          <div className="text-xs font-ui text-gray-500">
            CREDITS: ¥{stats.yen.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Main Content Centered */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl mx-auto gap-8 md:flex-row md:items-center">
        {/* LEFT: MISSION CONTROL (Compact) */}
        <div className="w-full md:w-1/3 flex flex-col h-[400px] relative">
          <div className="bg-panel-bg/90 border border-gray-800 h-full flex flex-col clip-corner-4 shadow-2xl">
            <div className="p-3 bg-gray-900 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-accent" />
                <span className="font-header text-sm text-white">
                  MISSION LOG
                </span>
              </div>
              <button
                onClick={() => onNavigate(GameMode.MISSIONS)}
                className="text-[10px] text-gray-500 hover:text-white font-ui uppercase"
              >
                View All
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Daily Bounty (Pinned) */}
              <div className="bg-black border border-accent/50 p-3 relative group">
                <div className="absolute top-0 right-0 bg-accent text-black text-[9px] px-1 font-bold">
                  PRIORITY
                </div>
                <div className="text-[10px] text-gray-500 font-ui mb-1">
                  DAILY BOUNTY
                </div>
                <div className="text-sm font-code text-white mb-1">
                  {bounty.text}
                </div>
                <div className="text-xs text-accent">
                  REWARD: ¥{bounty.reward}
                </div>
              </div>

              <div className="h-[1px] bg-gray-800 w-full my-2"></div>

              {/* Achievements List (Limited) */}
              {sortedAchievements.map((ach) => {
                const isUnlocked = stats.unlockedAchievements.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`p-2 border transition-all ${
                      isUnlocked
                        ? "bg-gray-900/50 border-gray-800 opacity-60"
                        : "bg-black border-gray-700"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className={`font-header text-xs ${
                          isUnlocked
                            ? "text-gray-500 line-through"
                            : "text-gray-300"
                        }`}
                      >
                        {ach.name}
                      </span>
                      <span className="text-xs">
                        {isUnlocked ? "✅" : "🔒"}
                      </span>
                    </div>
                    <div className="text-[9px] text-gray-500 font-ui truncate">
                      {ach.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTER/RIGHT: MAIN ACTION CARD */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative">
          {/* Decorative Spinners */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-gray-800/30 rounded-full animate-spin-[20s_linear_infinite] pointer-events-none hidden md:block"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-dashed border-gray-800/30 rounded-full animate-spin-[15s_linear_infinite_reverse] pointer-events-none hidden md:block"></div>

          <div className="w-full max-w-md bg-black/80 backdrop-blur-md border border-gray-800 p-8 clip-corner-2 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between mb-8 text-sm font-ui border-b border-gray-800 pb-4">
              <div>
                <div className="text-gray-500 text-[10px]">OPERATOR</div>
                <div className="text-white">GUEST</div>
              </div>
              <div className="text-right">
                <div className="text-gray-500 text-[10px]">FUNDS</div>
                <div className="text-accent text-lg font-header">
                  ¥{stats.yen.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Main Ignition */}
            <button
              onClick={onJackIn}
              className="w-full group relative h-28 bg-accent/10 border border-accent hover:bg-accent hover:text-black transition-all flex items-center justify-center overflow-hidden mb-4 clip-corner-4"
            >
              <div className="absolute inset-0 caution-tape mix-blend-overlay"></div>
              <div className="flex flex-col items-center z-10">
                <Play size={32} className="mb-2 group-hover:fill-current" />
                <span className="font-header text-3xl tracking-[0.2em]">
                  JACK IN
                </span>
                <span className="font-ui text-xs mt-1 opacity-70">
                  [PRESS J]
                </span>
              </div>
            </button>

            <div className="flex gap-3">
              {/* Bounty Link */}
              <button
                onClick={() => onNavigate(GameMode.BOUNTY_BOARD)}
                className="flex-1 flex flex-col items-center justify-center p-4 border border-gray-800 bg-gray-900/50 hover:border-red-500 hover:text-red-500 transition-colors group"
              >
                <span className="font-header text-sm text-gray-400 group-hover:text-red-500 mb-1">
                  BOUNTY
                </span>
                <span className="font-ui text-[10px]">[B]</span>
              </button>
              {/* Zen Mode */}
              <button
                onClick={() => onNavigate(GameMode.ZEN)}
                className="flex-1 flex flex-col items-center justify-center p-4 border border-gray-800 bg-gray-900/50 hover:border-blue-500 hover:text-blue-500 transition-colors group"
              >
                <span className="font-header text-sm text-gray-400 group-hover:text-blue-500 mb-1">
                  ZEN MODE
                </span>
                <span className="font-ui text-[10px]">[Z]</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CENTER: NAVIGATION */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-50">
        <button
          onClick={() => onNavigate(GameMode.MISSIONS)}
          className="group relative bg-black border border-gray-800 hover:border-accent w-20 h-20 flex flex-col items-center justify-center clip-corner-1 transition-all hover:-translate-y-1"
        >
          <Target
            className="text-gray-400 group-hover:text-accent mb-1"
            size={20}
          />
          <span className="text-[10px] font-header text-gray-500 group-hover:text-white">
            MISSIONS
          </span>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-gray-800 group-hover:bg-accent"></div>
        </button>

        <button
          onClick={() => onNavigate(GameMode.SHOP)}
          className="group relative bg-black border border-gray-800 hover:border-accent w-20 h-20 flex flex-col items-center justify-center clip-corner-1 transition-all hover:-translate-y-1"
        >
          <ShoppingCart
            className="text-gray-400 group-hover:text-accent mb-1"
            size={20}
          />
          <span className="text-[10px] font-header text-gray-500 group-hover:text-white">
            MARKET
          </span>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-gray-800 group-hover:bg-accent"></div>
        </button>

        <button
          onClick={() => onNavigate(GameMode.PROFILE)}
          className="group relative bg-black border border-gray-800 hover:border-accent w-24 h-24 flex flex-col items-center justify-center clip-corner-1 transition-all hover:-translate-y-2 -mt-4 border-t-2 border-t-accent"
        >
          <User
            className="text-gray-400 group-hover:text-accent mb-1"
            size={24}
          />
          <span className="text-[10px] font-header text-gray-500 group-hover:text-white">
            DATA LOG
          </span>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-gray-800 group-hover:bg-accent"></div>
        </button>

        <button
          onClick={() => onNavigate(GameMode.SETTINGS)}
          className="group relative bg-black border border-gray-800 hover:border-accent w-20 h-20 flex flex-col items-center justify-center clip-corner-1 transition-all hover:-translate-y-1"
        >
          <SettingsIcon
            className="text-gray-400 group-hover:text-accent mb-1"
            size={20}
          />
          <span className="text-[10px] font-header text-gray-500 group-hover:text-white">
            CONFIG
          </span>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-gray-800 group-hover:bg-accent"></div>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
