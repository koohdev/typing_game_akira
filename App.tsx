import React, { useState, useEffect } from "react";
import {
  GameMode,
  PlayerStats,
  INITIAL_STATS,
  GameResult,
  Settings as SettingsType,
} from "./types";
import { loadStats, saveStats, resetData } from "./services/storage";
import { audioEngine } from "./services/audioEngine";
import { ACHIEVEMENTS } from "./constants";
import Dashboard from "./components/Dashboard";
import Terminal from "./components/Terminal";
import Shop from "./components/Shop";
import Profile from "./components/Profile";
import Results from "./components/Results";
import Settings from "./components/Settings";
import CRTOverlay from "./components/CRTOverlay";
import CLI from "./components/CLI";
import BountyBoard from "./components/BountyBoard";
import BiosBoot from "./components/BiosBoot";
import Missions from "./components/Missions";

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>(GameMode.BOOT);
  const [stats, setStats] = useState<PlayerStats>(INITIAL_STATS);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [bounty, setBounty] = useState({
    text: "SPEED: >50 WPM",
    reward: 800,
    c: (w: number, a: number) => w > 50,
  });
  const [showCLI, setShowCLI] = useState(false);
  const [selectedBoss, setSelectedBoss] = useState<string | undefined>(
    undefined
  );
  const [toast, setToast] = useState<string | null>(null);

  // Init
  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/07d90fc4-a1cd-44cc-af5c-0e5ea6c6f390", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "App.tsx:28",
        message: "App initializing",
        data: { initialMode: mode },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "A",
      }),
    }).catch(() => {});
    // #endregion
    const loaded = loadStats();
    setStats(loaded);
    applyTheme(loaded.settings.theme);
    generateBounty();
  }, []);

  // Track mode changes
  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/07d90fc4-a1cd-44cc-af5c-0e5ea6c6f390", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "App.tsx:38",
        message: "Mode state changed",
        data: { mode },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "C",
      }),
    }).catch(() => {});
    // #endregion
  }, [mode]);

  useEffect(() => {
    saveStats(stats);
    checkAchievements(stats);
  }, [stats]);

  const checkAchievements = (currentStats: PlayerStats) => {
    let newUnlocks: string[] = [];
    ACHIEVEMENTS.forEach((ach) => {
      if (!currentStats.unlockedAchievements.includes(ach.id)) {
        if (ach.condition(currentStats)) {
          newUnlocks.push(ach.id);
          showToast(`ACHIEVEMENT UNLOCKED: ${ach.name}`);
          audioEngine.playSuccess(); // Re-use success sound for achievement
        }
      }
    });

    if (newUnlocks.length > 0) {
      setStats((prev) => ({
        ...prev,
        unlockedAchievements: [...prev.unlockedAchievements, ...newUnlocks],
      }));
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleBootComplete = () => {
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/07d90fc4-a1cd-44cc-af5c-0e5ea6c6f390", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "App.tsx:65",
        message: "handleBootComplete called",
        data: { currentMode: mode },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "C",
      }),
    }).catch(() => {});
    // #endregion
    audioEngine.init();
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/07d90fc4-a1cd-44cc-af5c-0e5ea6c6f390", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "App.tsx:68",
        message: "Setting mode to DASH",
        data: { targetMode: GameMode.DASH },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "C",
      }),
    }).catch(() => {});
    // #endregion
    setMode(GameMode.DASH);
  };

  const applyTheme = (t: string) => {
    document.body.className = `bg-black text-gray-300 ${
      t !== "default" ? "theme-" + t : ""
    }`;
  };

  const generateBounty = () => {
    const types = [
      {
        text: "SPEED: >50 WPM",
        reward: 800,
        c: (w: number, a: number) => w > 50,
      },
      {
        text: "ACCURACY: >95%",
        reward: 600,
        c: (w: number, a: number) => a > 95,
      },
    ];
    setBounty(types[Math.floor(Math.random() * types.length)]);
  };

  const updateSettings = (key: keyof SettingsType, val: any) => {
    const newSettings = { ...stats.settings, [key]: val };
    setStats((prev) => ({ ...prev, settings: newSettings }));
    if (key === "theme") applyTheme(val);
  };

  const handleGameComplete = (result: GameResult) => {
    let payout = result.yen;
    // Only check bounty if passed and not Zen (or Zen payout handled internally)
    if (
      result.passed &&
      !result.isZen &&
      bounty.c(result.wpm, result.accuracy)
    ) {
      payout += bounty.reward;
      generateBounty();
    }

    const now = new Date();
    const timeStr = `${now.getHours()}:${
      now.getMinutes() < 10 ? "0" : ""
    }${now.getMinutes()}`;

    setStats((prev) => ({
      ...prev,
      yen: prev.yen + payout,
      gamesPlayed: prev.gamesPlayed + 1,
      totalWordsTyped: prev.totalWordsTyped + 1,
      highScore: result.isZen
        ? prev.highScore
        : Math.max(prev.highScore, result.wpm),
      decryptionKeys: prev.decryptionKeys + (result.decryptionKeyFound ? 1 : 0),
      history: [
        ...prev.history,
        {
          date: timeStr,
          wpm: result.wpm,
          accuracy: result.accuracy,
          yen: payout,
          result: result.isZen ? "ZEN" : result.passed ? "WIN" : "FAIL",
        },
      ],
    }));

    setLastResult({ ...result, yen: payout });
    setMode(GameMode.RESULTS);
  };

  const handlePurchase = (
    category: "software" | "hardware" | "themes",
    item: any
  ) => {
    if (stats.yen < item.cost) return;

    setStats((prev) => {
      const next = { ...prev, yen: prev.yen - item.cost };

      if (category === "software") {
        next.inventory = {
          ...prev.inventory,
          [item.id]: (prev.inventory as any)[item.id] + 1,
        };
      } else if (category === "hardware") {
        next.hardware = [...prev.hardware, item.id];
      } else if (category === "themes") {
        next.ownedThemes = [...prev.ownedThemes, item.id];
        next.settings.theme = item.id;
        applyTheme(item.id);
      }
      return next;
    });
    audioEngine.playSuccess();
  };

  const handlePrestige = () => {
    if (
      window.confirm("WARNING: SYSTEM REBOOT. ALL ITEMS WILL BE LOST. PROCEED?")
    ) {
      setStats((prev) => ({
        ...INITIAL_STATS,
        highScore: prev.highScore,
        gamesPlayed: prev.gamesPlayed,
        prestigeLevel: prev.prestigeLevel + 1,
        settings: prev.settings,
      }));
      audioEngine.playLevelUp();
      setMode(GameMode.DASH);
    }
  };

  const consumeItem = (
    type: "time_freeze" | "auto_word" | "proxy_shield"
  ): boolean => {
    if (stats.inventory[type] > 0) {
      setStats((prev) => ({
        ...prev,
        inventory: { ...prev.inventory, [type]: prev.inventory[type] - 1 },
      }));
      return true;
    }
    return false;
  };

  // CLI Action Handler
  const handleCLIAction = (action: string, payload?: any) => {
    if (action === "RESET_DATA") {
      resetData();
    }
    if (action === "SET_THEME") {
      updateSettings("theme", payload);
    }
    if (action === "ADD_FUNDS") {
      setStats((prev) => ({ ...prev, yen: prev.yen + payload }));
      audioEngine.playSuccess();
    }
  };

  // Start a Boss Battle
  const startBoss = (bossId: string) => {
    setSelectedBoss(bossId);
    setMode(GameMode.GAME);
  };

  // Start normal game
  const startNormal = () => {
    setSelectedBoss(undefined);
    setMode(GameMode.GAME);
  };

  // CLI listener
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        setShowCLI((prev) => !prev);
      }
      if (e.key === "Escape" && showCLI) setShowCLI(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showCLI]);

  return (
    <div className="h-full w-full relative overflow-hidden">
      <CRTOverlay />

      {/* Global Toast */}
      {toast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-accent text-black px-6 py-3 font-header text-lg clip-corner-1 animate-in slide-in-from-top fade-in duration-300">
          {toast}
        </div>
      )}

      <CLI
        isOpen={showCLI}
        onClose={() => setShowCLI(false)}
        onAction={handleCLIAction}
      />

      <div className="absolute inset-4 md:inset-8 lg:inset-12 overflow-hidden z-[110] h-[calc(100%-2rem)] md:h-[calc(100%-4rem)] lg:h-[calc(100%-6rem)]">
        {mode === GameMode.BOOT ? (
          <BiosBoot key="bios-boot" onComplete={handleBootComplete} />
        ) : null}

        {mode === GameMode.DASH ? (
          <Dashboard
            key="dashboard"
            stats={stats}
            onNavigate={setMode}
            onJackIn={startNormal}
            bounty={bounty}
          />
        ) : null}

        {mode === GameMode.BOUNTY_BOARD && (
          <BountyBoard
            onSelect={startBoss}
            onBack={() => setMode(GameMode.DASH)}
          />
        )}

        {(mode === GameMode.GAME || mode === GameMode.ZEN) && (
          <Terminal
            stats={stats}
            bossId={mode === GameMode.GAME ? selectedBoss : undefined}
            isZenMode={mode === GameMode.ZEN}
            onComplete={handleGameComplete}
            onAbort={() => setMode(GameMode.DASH)}
            consumeItem={consumeItem}
          />
        )}

        {mode === GameMode.SHOP && (
          <Shop
            stats={stats}
            onPurchase={handlePurchase}
            onPrestige={handlePrestige}
            onClose={() => setMode(GameMode.DASH)}
          />
        )}
        {mode === GameMode.PROFILE && (
          <Profile stats={stats} onClose={() => setMode(GameMode.DASH)} />
        )}
        {mode === GameMode.MISSIONS && (
          <Missions
            stats={stats}
            onClose={() => setMode(GameMode.DASH)}
            bounty={bounty}
          />
        )}
        {mode === GameMode.RESULTS && lastResult && (
          <Results
            result={lastResult}
            onRetry={() =>
              selectedBoss ? startBoss(selectedBoss) : startNormal()
            }
            onMenu={() => setMode(GameMode.DASH)}
          />
        )}
        {mode === GameMode.SETTINGS && (
          <Settings
            settings={stats.settings}
            updateSettings={updateSettings}
            onClose={() => setMode(GameMode.DASH)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
