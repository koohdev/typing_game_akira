import React, { useState, useEffect, useRef } from "react";
import { PlayerStats, GameResult, Boss } from "../types";
import {
  LEVELS,
  BOSS_LEVELS,
  ENEMY_HACK_TEXT,
  BOSS_ROSTER,
  BOSS_ART,
} from "../constants";
import { audioEngine } from "../services/audioEngine";
import VirtualKeyboard from "./VirtualKeyboard";

interface TerminalProps {
  stats: PlayerStats;
  bossId?: string;
  isZenMode?: boolean;
  onComplete: (result: GameResult) => void;
  onAbort: () => void;
  consumeItem: (item: "time_freeze" | "auto_word" | "proxy_shield") => boolean;
}

const Terminal: React.FC<TerminalProps> = ({
  stats,
  bossId,
  isZenMode = false,
  onComplete,
  onAbort,
  consumeItem,
}) => {
  const [text, setText] = useState("");
  const [displayText, setDisplayText] = useState(""); // For decryption effect
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [heat, setHeat] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(true);

  // Boss State
  const [boss, setBoss] = useState<Boss | null>(null);
  const [bossHp, setBossHp] = useState(0);
  const [bossAttackProgress, setBossAttackProgress] = useState(0);
  const [bossLog, setBossLog] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number>(0);
  const frozenUntilRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<
    { x: number; y: number; vx: number; vy: number; life: number }[]
  >([]);

  // Stats refs for loop access
  const statsRef = useRef(stats);
  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  // Audio Hum Management
  useEffect(() => {
    if (isActive) {
      audioEngine.startEngineHum();
    } else {
      audioEngine.stopEngineHum();
    }
    return () => audioEngine.stopEngineHum();
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      audioEngine.updateEngineHum(heat);
    }
  }, [heat, isActive]);

  // Level Setup
  useEffect(() => {
    let targetText = "";
    if (bossId) {
      const selectedBoss = BOSS_ROSTER.find((b) => b.id === bossId);
      if (selectedBoss) {
        setBoss(selectedBoss);
        setBossHp(selectedBoss.hp);
        targetText =
          BOSS_LEVELS[Math.floor(Math.random() * BOSS_LEVELS.length)];
        setTimeLeft(60);
      }
    } else {
      const pool = LEVELS;
      targetText = pool[Math.floor(Math.random() * pool.length)];
      setTimeLeft(isZenMode ? 9999 : 30);
    }

    setText(targetText);
    decryptTextEffect(targetText);
  }, [bossId, isZenMode]);

  const decryptTextEffect = (target: string) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@&%";
    let iter = 0;
    const interval = setInterval(() => {
      setDisplayText(
        target
          .split("")
          .map((c, i) => {
            if (i < iter) return target[i];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      iter += 2;
      if (iter >= target.length) {
        clearInterval(interval);
        setDisplayText(target);
      }
    }, 30);
  };

  // Particle System
  useEffect(() => {
    if (!isActive) return;

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;

    const loopParticles = () => {
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);

      if (wpm > 80) {
        // Add particles
        particlesRef.current.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.05;

          ctx.fillStyle = `rgba(225, 33, 32, ${p.life})`;
          ctx.fillRect(p.x, p.y, 2, 2);

          if (p.life <= 0) particlesRef.current.splice(i, 1);
        });
      }
      requestAnimationFrame(loopParticles);
    };
    const pid = requestAnimationFrame(loopParticles);
    return () => cancelAnimationFrame(pid);
  }, [isActive, wpm]);

  const spawnParticles = () => {
    if (wpm < 80) return;
    const rect = document.querySelector(".active")?.getBoundingClientRect();
    const canvasRect = canvasRef.current?.getBoundingClientRect();

    if (rect && canvasRect) {
      const x = rect.left - canvasRect.left + rect.width;
      const y = rect.top - canvasRect.top + rect.height / 2;

      for (let i = 0; i < 3; i++) {
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 1.0,
        });
      }
    }
  };

  // Global keydown (Abort & Start)
  useEffect(() => {
    const handleGlobalDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isZenMode) finishGame(true); // Escape in Zen mode = "Cash Out"
        else onAbort();
      }

      if (
        !isActive &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.metaKey &&
        e.key.length === 1 &&
        isFocused
      ) {
        startGame();
      }
      if (isActive) {
        setActiveKey(e.key.toUpperCase());
      }
    };

    const handleGlobalUp = () => {
      setActiveKey(null);
    };

    window.addEventListener("keydown", handleGlobalDown);
    window.addEventListener("keyup", handleGlobalUp);
    return () => {
      window.removeEventListener("keydown", handleGlobalDown);
      window.removeEventListener("keyup", handleGlobalUp);
    };
  }, [isActive, onAbort, isFocused, isZenMode]);

  const startGame = () => {
    if (isActive) return;
    setIsActive(true);
    setInput("");
    setHeat(0);
    setStreak(0);
    startTimeRef.current = Date.now();

    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 10);
  };

  // Game Loop
  useEffect(() => {
    if (!isActive) return;

    let lastTime = Date.now();

    const loop = () => {
      const now = Date.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Handle Freeze
      if (now < frozenUntilRef.current) {
        startTimeRef.current += delta * 1000;
        animationFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      // --- Player Timer Logic ---
      if (!isZenMode) {
        const hwMod = statsRef.current.hardware.includes("synaptic_accel")
          ? 0.9
          : 1.0;
        const drain = delta * hwMod;
        setTimeLeft((prev) => Math.max(0, prev - drain));
      }

      // --- Boss Logic (Disabled in Zen) ---
      if (boss && !isZenMode) {
        const chargeRate = boss.attackSpeed * 2.5;
        setBossAttackProgress((prev) => {
          const next = prev + chargeRate * delta;
          if (next >= 100) {
            // Attack!
            // Check Proxy Shield
            if (statsRef.current.inventory.proxy_shield > 0) {
              consumeItem("proxy_shield");
              audioEngine.playShield();
              setBossLog((l) => [...l, "ATTACK_BLOCKED_BY_PROXY"].slice(-6));
              return 0;
            }

            setTimeLeft((t) => Math.max(0, t - boss.attackDamage));
            audioEngine.playDamage();
            setBossLog((l) =>
              [
                ...l,
                ENEMY_HACK_TEXT[
                  Math.floor(Math.random() * ENEMY_HACK_TEXT.length)
                ],
              ].slice(-6)
            );
            return 0;
          }
          return next;
        });
      }

      // --- WPM Calc ---
      const elapsedSec = (now - startTimeRef.current) / 1000;
      const words = input.length / 5;
      const minutes = elapsedSec / 60;
      const currentWpm = minutes > 0 ? Math.round(words / minutes) : 0;
      setWpm(currentWpm);

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [isActive, boss, input.length, isZenMode]);

  // Check Death
  useEffect(() => {
    if (!isZenMode && timeLeft <= 0 && isActive) {
      finishGame(false);
    }
  }, [timeLeft, isActive, isZenMode]);

  const finishGame = (success: boolean) => {
    setIsActive(false);
    cancelAnimationFrame(animationFrameRef.current);

    // Calculate accuracy
    let correctChars = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === text[i]) correctChars++;
    }

    const accuracy =
      input.length > 0 ? Math.floor((correctChars / input.length) * 100) : 0;
    const passed = success && (isZenMode || accuracy > 80);

    let payout = 0;
    if (passed) {
      const hwMod = stats.hardware.includes("mech_switch") ? 1.15 : 1.0;
      const heatMod = heat >= 20 ? 2.0 : 1.0;
      const prestigeMod = 1 + stats.prestigeLevel * 0.1;

      let baseReward = wpm * 5;
      if (boss) baseReward += boss.reward;

      // Zen mode penalty (50%)
      if (isZenMode) baseReward *= 0.5;

      payout = Math.floor(baseReward * hwMod * heatMod * prestigeMod);
    }

    if (passed) audioEngine.playSuccess();
    else audioEngine.playError();

    onComplete({
      wpm,
      accuracy,
      yen: payout,
      passed,
      bossDefeated: !!boss && passed,
      isZen: isZenMode,
    });
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (input === text && !boss && !isZenMode) return;

    const diff = val.length - input.length;

    if (diff > 0) {
      const charTyped = val.slice(-1);
      const targetChar = text[input.length % text.length];

      if (charTyped === targetChar) {
        audioEngine.playKeystroke();
        setStreak((s) => s + 1);
        updateHeat(1);
        spawnParticles();

        if (boss && !isZenMode) {
          const dmg = 1 + (heat >= 10 ? 1 : 0) + (streak > 50 ? 1 : 0);
          const newHp = bossHp - dmg;
          setBossHp(newHp);
          if (newHp <= 0) {
            finishGame(true);
            return;
          }
        }
      } else {
        // Mistake handling
        if (stats.inventory.proxy_shield > 0) {
          consumeItem("proxy_shield");
          audioEngine.playShield();
          // Do NOT break streak or heat
        } else {
          audioEngine.playError();
          setStreak(0);
          updateHeat(-5);
        }
      }
    }

    setInput(val);

    if (val === text) {
      if (boss || isZenMode) {
        setInput("");
        const nextText = isZenMode
          ? LEVELS[Math.floor(Math.random() * LEVELS.length)]
          : BOSS_LEVELS[Math.floor(Math.random() * BOSS_LEVELS.length)];

        setText(nextText);
        decryptTextEffect(nextText);

        if (boss) setBossLog((l) => [...l, "FIREWALL_LAYER_BREACHED"]);
      } else {
        finishGame(true);
      }
    }
  };

  const updateHeat = (change: number) => {
    setHeat((h) => Math.max(0, Math.min(20, h + (change > 0 ? 1 : -20))));
  };

  const useItem = (type: "time_freeze" | "auto_word") => {
    if (consumeItem(type)) {
      audioEngine.playSuccess();
      if (type === "time_freeze") {
        frozenUntilRef.current = Date.now() + 5000;
      }
      if (type === "auto_word") {
        const remaining = text.slice(input.length);
        const chars = remaining.slice(0, 5);
        const newVal = input + chars;

        if (boss) setBossHp((h) => Math.max(0, h - 5));

        setInput(newVal);
        if (newVal === text) {
          if (boss) {
            if (bossHp - 5 <= 0) finishGame(true);
            else {
              setInput("");
              setText(
                BOSS_LEVELS[Math.floor(Math.random() * BOSS_LEVELS.length)]
              );
            }
          } else {
            finishGame(true);
          }
        }
      }
    }
  };

  const getCaretStyle = () => {
    switch (stats.settings.caretStyle) {
      case "underscore":
        return "border-b-2 border-accent animate-pulse";
      case "beam":
        return "border-r-2 border-accent animate-pulse";
      default:
        return "bg-accent text-black animate-pulse";
    }
  };

  const renderChars = () => {
    return displayText.split("").map((char, i) => {
      let className = "char font-code ";
      if (i < input.length) {
        if (input[i] === text[i])
          className +=
            " correct text-white text-shadow"; // Note: check against real text for color, not displayText
        else className += " wrong text-accent bg-accent-dim";
      } else if (i === input.length) {
        className += ` active ${getCaretStyle()}`;
      } else {
        className += " pending opacity-30";
      }
      return (
        <span key={i} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div
      className="absolute inset-0 z-40 flex flex-col h-full w-full bg-black/50"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Connection Lost Overlay */}
      {isActive && !isFocused && (
        <div
          className="absolute inset-0 z-[60] bg-black/80 flex items-center justify-center backdrop-blur-sm cursor-pointer"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="text-center animate-pulse border-2 border-red-500 p-6 bg-black">
            <div className="text-3xl font-header text-red-500 mb-2">
              ⚠ CONNECTION LOST
            </div>
            <div className="text-sm font-ui text-gray-400">
              CLICK TO RESUME NEURAL LINK
            </div>
          </div>
        </div>
      )}

      {/* Particles Canvas */}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute inset-0 pointer-events-none z-30"
      />

      {/* TOP HUD BAR */}
      <div className="absolute top-0 left-0 w-full px-12 pt-8 flex items-start justify-between z-30 pointer-events-none">
        {/* Left Block */}
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div
              className={`text-sm font-header ${
                boss ? "text-red-500 animate-pulse" : "text-gray-400"
              }`}
            >
              {boss
                ? "⚠️ INTRUDER ALERT"
                : isZenMode
                ? "☯ ZEN MODE"
                : "LINK STABLE"}
            </div>
            {!isZenMode && (
              <>
                <div className="h-4 w-[1px] bg-gray-700"></div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-600 font-ui leading-none">
                    REMAINING TIME
                  </span>
                  <span
                    className={`text-xl font-header leading-none ${
                      timeLeft < 10 ? "text-red-500" : "text-white"
                    }`}
                  >
                    {timeLeft.toFixed(1)}
                    <span className="text-xs ml-1">SEC</span>
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Heat Gauge */}
          <div className="w-64">
            <div className="flex justify-between text-[10px] font-ui text-gray-600 mb-1">
              <span>SYNC RATE (HEAT)</span>
              <span className={heat >= 20 ? "text-yellow-400" : ""}>
                {heat}X
              </span>
            </div>
            <div className="flex gap-0.5 h-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 transition-colors ${
                    i < heat
                      ? "bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]"
                      : "bg-gray-800"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Block (Items) */}
        <div className="flex items-start gap-4 pointer-events-auto">
          <div className="flex gap-2">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-gray-600 mb-1">[1] FREEZE</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  useItem("time_freeze");
                }}
                disabled={stats.inventory.time_freeze <= 0}
                className="px-3 py-1 bg-black/50 border border-gray-700 text-xs text-accent disabled:opacity-30 hover:bg-gray-900"
              >
                {stats.inventory.time_freeze}
              </button>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-gray-600 mb-1">[2] AUTO</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  useItem("auto_word");
                }}
                disabled={stats.inventory.auto_word <= 0}
                className="px-3 py-1 bg-black/50 border border-gray-700 text-xs text-accent disabled:opacity-30 hover:bg-gray-900"
              >
                {stats.inventory.auto_word}
              </button>
            </div>
            {/* Passive item indicator */}
            {stats.inventory.proxy_shield > 0 && (
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-gray-600 mb-1">SHIELD</span>
                <div className="px-3 py-1 bg-blue-900/30 border border-blue-500/50 text-xs text-blue-400">
                  {stats.inventory.proxy_shield}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              if (isZenMode) finishGame(true);
              else onAbort();
            }}
            className="text-red-700 hover:text-white text-[10px] border border-red-900/30 px-3 py-2 font-ui transition-colors"
          >
            {isZenMode ? "CASH OUT [ESC]" : "ABORT [ESC]"}
          </button>
        </div>
      </div>

      {/* TIME BAR (Full Width Floating) - Hidden in Zen */}
      {!isZenMode && (
        <div className="absolute top-20 left-0 w-full px-12 z-20 opacity-50">
          <div className="h-0.5 w-full bg-gray-900 relative">
            <div
              className="h-full transition-all duration-100 ease-linear shadow-[0_0_10px_var(--accent)]"
              style={{
                width: `${(timeLeft / (boss ? 60 : 30)) * 100}%`,
                backgroundColor: timeLeft < 10 ? "#E12120" : "var(--accent)",
              }}
            ></div>
          </div>
        </div>
      )}

      {/* MAIN GAME AREA */}
      <div className="relative flex-1 flex w-full h-full">
        {/* PLAYER/TEXT ZONE */}
        <div
          className={`relative h-full flex items-center justify-center transition-all duration-500 ${
            boss && !isZenMode ? "w-1/2 border-r border-gray-800/50" : "w-full"
          }`}
        >
          {/* Typing Text Centered Upper */}
          <div className="absolute top-1/3 w-full max-w-2xl px-8 font-code leading-relaxed text-left break-words -translate-y-1/2">
            <div
              className={`transition-all ${
                stats.settings.fontSize === "large"
                  ? "text-3xl"
                  : stats.settings.fontSize === "small"
                  ? "text-lg"
                  : "text-2xl"
              }`}
            >
              {renderChars()}
            </div>
          </div>

          {/* Virtual Keyboard Floating Bottom Center */}
          {stats.settings.virtualKeyboard && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl scale-90">
              <VirtualKeyboard activeKey={activeKey} />
            </div>
          )}
        </div>

        {/* BOSS ZONE (Disabled in Zen) */}
        {boss && !isZenMode && (
          <div className="w-1/2 bg-black/20 flex flex-col relative overflow-hidden pt-24">
            <div className="absolute inset-0 scanlines opacity-30"></div>
            <div className="absolute inset-0 bg-red-900/5 pointer-events-none"></div>

            {/* Boss Header */}
            <div className="p-6 border-b border-gray-800/30 flex justify-between items-end">
              <div>
                <div className="text-[10px] text-red-500 font-ui mb-1">
                  TARGET IDENTIFIED
                </div>
                <div className="text-2xl font-header text-white">
                  {boss.name}
                </div>
              </div>
              <div className="text-xs font-ui border border-red-900 text-red-500 px-2 py-1">
                {boss.difficulty}
              </div>
            </div>

            <div className="flex-1 p-6 flex flex-col gap-6">
              {/* HP Bar */}
              <div>
                <div className="flex justify-between text-xs font-ui text-gray-400 mb-2">
                  <span>INTEGRITY</span>
                  <span>{Math.ceil((bossHp / boss.hp) * 100)}%</span>
                </div>
                <div className="h-6 w-full bg-black/50 border border-gray-800 p-1">
                  <div
                    className="h-full bg-red-600 transition-all duration-200 relative overflow-hidden"
                    style={{ width: `${(bossHp / boss.hp) * 100}%` }}
                  >
                    <div className="absolute inset-0 caution-tape opacity-30"></div>
                  </div>
                </div>
              </div>

              {/* Attack Charge */}
              <div>
                <div className="flex justify-between text-xs font-ui text-gray-400 mb-2">
                  <span>INTRUSION SEQUENCE</span>
                  <span className="text-red-500 animate-pulse">
                    {Math.floor(bossAttackProgress)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-900">
                  <div
                    className="h-full bg-white transition-all duration-75"
                    style={{ width: `${bossAttackProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* ASCII ART */}
              <div className="flex-1 flex items-center justify-center opacity-20 pointer-events-none">
                <pre className="text-[10px] font-ui text-red-500 whitespace-pre">
                  {BOSS_ART}
                </pre>
              </div>

              {/* Logs */}
              <div className="font-code text-xs text-red-800 opacity-80 h-32 overflow-hidden flex flex-col justify-end border-t border-gray-800 pt-2">
                {bossLog.map((line, i) => (
                  <div key={i} className="mb-1">
                    {"> "}
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Start Overlay */}
      {!isActive && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 cursor-pointer backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            startGame();
          }}
        >
          <div className="border-2 border-accent bg-black p-8 text-center shadow-[0_0_50px_rgba(225,33,32,0.5)] clip-corner-4">
            <div className="text-accent font-header text-3xl mb-2 animate-pulse">
              {isZenMode ? "ZEN UPLINK" : "READY LINK"}
            </div>
            <div className="text-xs font-ui text-gray-500">
              PRESS ANY KEY TO START
            </div>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="text"
        value={input}
        className="opacity-0 absolute top-0 left-0 h-full w-full z-10 cursor-default text-base pointer-events-none"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        onChange={handleInput}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        autoFocus={isActive}
      />
    </div>
  );
};

export default Terminal;
