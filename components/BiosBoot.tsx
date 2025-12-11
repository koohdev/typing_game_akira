import React, { useEffect, useState } from "react";

interface BiosBootProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  "BIOS CHECKING MEMORY...",
  "LOAD KANEDA_OS_V11.2...",
  "MOUNTING VOLUMES [OK]",
  "INITIALIZING NEURAL NET INTERFACE...",
  "DECRYPTING DRIVERS...",
  "AUDIO_ENGINE: WAITING FOR USER INPUT",
];

const BiosBoot: React.FC<BiosBootProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let delay = 0;
    BOOT_LOGS.forEach((log, i) => {
      delay += Math.random() * 300 + 100;
      setTimeout(() => {
        setLines((prev) => [...prev, log]);
        if (i === BOOT_LOGS.length - 1) {
          // #region agent log
          fetch(
            "http://127.0.0.1:7243/ingest/07d90fc4-a1cd-44cc-af5c-0e5ea6c6f390",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                location: "BiosBoot.tsx:27",
                message: "Boot sequence ready set to true",
                data: { logIndex: i, totalLogs: BOOT_LOGS.length },
                timestamp: Date.now(),
                sessionId: "debug-session",
                runId: "run1",
                hypothesisId: "A",
              }),
            }
          ).catch(() => {});
          // #endregion
          setReady(true);
        }
      }, delay);
    });
  }, []);

  const handleBoot = () => {
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/07d90fc4-a1cd-44cc-af5c-0e5ea6c6f390", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "BiosBoot.tsx:33",
        message: "handleBoot called",
        data: { ready },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "B",
      }),
    }).catch(() => {});
    // #endregion
    if (!ready) {
      // #region agent log
      fetch(
        "http://127.0.0.1:7243/ingest/07d90fc4-a1cd-44cc-af5c-0e5ea6c6f390",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: "BiosBoot.tsx:36",
            message: "handleBoot early return - not ready",
            data: { ready },
            timestamp: Date.now(),
            sessionId: "debug-session",
            runId: "run1",
            hypothesisId: "B",
          }),
        }
      ).catch(() => {});
      // #endregion
      return;
    }
    // #region agent log
    fetch("http://127.0.0.1:7243/ingest/07d90fc4-a1cd-44cc-af5c-0e5ea6c6f390", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        location: "BiosBoot.tsx:40",
        message: "handleBoot calling onComplete",
        data: { ready },
        timestamp: Date.now(),
        sessionId: "debug-session",
        runId: "run1",
        hypothesisId: "C",
      }),
    }).catch(() => {});
    // #endregion
    onComplete();
  };

  return (
    <div
      className="fixed inset-0 bg-black z-[100] font-ui text-xs p-8 cursor-pointer flex flex-col justify-end pb-20"
      onClick={handleBoot}
    >
      <div className="max-w-xl w-full mx-auto">
        <div className="mb-8 font-header text-xl text-white">
          KANEDA SYSTEM BIOS
        </div>
        <div className="space-y-1 mb-8 text-gray-400">
          {lines.map((l, i) => (
            <div key={i} className="flex gap-2">
              <span className="opacity-50">
                [{new Date().toISOString().slice(11, 19)}]
              </span>
              <span>{l}</span>
            </div>
          ))}
          {ready && (
            <div className="text-accent animate-pulse mt-4">
              {"> PRESS ANY KEY OR CLICK TO INITIALIZE_"}
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-1 bg-accent/20">
        <div
          className={`h-full bg-accent transition-all duration-[2000ms] ${
            ready ? "w-full" : "w-[10%]"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default BiosBoot;
