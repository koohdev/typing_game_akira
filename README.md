# KANEDA_TERMINAL_V11 // PROJECT 28

> *"The singularity is approaching fast..."*

A high-fidelity, browser-based cyberpunk typing interface and game engine inspired by the visual aesthetics of *Akira (1988)*. Built with React, TypeScript, and a custom Web Audio synthesizer.

![Version](https://img.shields.io/badge/VERSION-11.0-red?style=for-the-badge)
![Status](https://img.shields.io/badge/NET_STATUS-ONLINE-green?style=for-the-badge)
![Tech](https://img.shields.io/badge/REACT-TYPESCRIPT-blue?style=for-the-badge)

## 🔌 System Overview

**KANEDA_TERMINAL** is a gamified typing trainer wrapped in a narrative cyber-deck OS. It features persistent progression, a dynamic economy, AI-driven lore, and a reactive audio engine generated entirely in code (no external assets).

## ✨ Features

### 🧠 Core Gameplay
- **Neural Link Combat**: Type against a decaying "Stability" timer. Speed and accuracy build "Heat" (Combo) and dynamic engine hum pitch.
- **Boss Nodes**: Face off against firewalls and AI constructs (The Gatekeeper, Sol Satellite) using Hex code and glitched text.
- **Zen Mode**: Infinite typing flow state with reduced rewards but no fail state. "Cash out" whenever you want.
- **Missions & Bounties**: Daily objectives and a dedicated Achievement tracking system.

### 💴 Economy & Progression
- **Black Market**: Spend Yen on **Software** (Consumables like Time Freeze/Proxy Shield) and **Hardware** (Passive buffs like Synaptic Accel).
- **Visual Themes**: Unlock CRT color profiles (Matrix Green, Amber, Ice Cyan, Synth Purple, Ghost White).
- **Persistence**: All stats, inventory, and unlockables are saved to `localStorage`.
- **Prestige**: Reset progress for permanent badges and earnings multipliers.

### 🔊 Audio & Visuals
- **Synth Engine**: No external audio files. All SFX (keystrokes, alarms, engine hum) are generated real-time via the Web Audio API.
- **Reactive Particles**: Canvas-based particle systems trigger at high WPM (>80).
- **CRT Effects**: CSS-based scanlines, vignette, RGB shifts, and screen shake.

### 🤖 AI Integration
- **CLI**: A functional command line (`~` key) integrated with Google Gemini API for dynamic system lore responses and system commands.

## 🛠️ Tech Stack

- **Core**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Visuals**: Lucide React (Icons), Recharts (Data viz), HTML5 Canvas
- **Audio**: Web Audio API (Oscillators/GainNodes)
- **AI**: @google/genai SDK

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/kaneda-terminal.git
   cd kaneda-terminal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root to enable the AI CLI features:
   ```env
   # Required for CLI "Chat" features
   API_KEY=your_google_gemini_api_key
   ```

4. **Initialize System**
   ```bash
   npm start
   ```

## 🎮 Controls

### Dashboard
- **[J]**: Jack In (Start Standard Run)
- **[B]**: Open Bounty Board (Boss Selection)
- **[Z]**: Enter Zen Mode
- **[M]**: Open Market / Shop
- **[P]**: Open Data Log / Profile
- **[~]**: Toggle Command Line Interface

### In-Game
- **Typing**: Match the text on screen to maintain Link Stability.
- **[1]**: Activate Time Freeze (Consumable).
- **[2]**: Activate Logic Bomb (Auto-complete word).
- **[ESC]**: Abort run / Cash Out (Zen Mode).

## 🔓 Secrets & CLI Commands

The terminal includes a hidden CLI. Press `~` (Tilde) to access.

| Command | Description |
|:---|:---|
| `clear` | Clear terminal history |
| `theme.set("matrix")` | Force set a visual theme |
| `system.hack(add:5000)` | **CHEAT**: Inject funds directly into account |
| `clear_cache()` | **WIPE DATA**: Hard reset of local storage |
| `API_KEY [key]` | Manually set Gemini API key in-session |
| *Any Query* | Chat with the "Central Computer" (AI) |

## 📜 License

MIT License.

---
*PROJECT 28 // SUBJECT 41 // NEO TOKYO*
