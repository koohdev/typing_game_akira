import { Boss, Achievement, PlayerStats } from './types';

export const LEVELS = [
  "The singularity is approaching fast energy readings are critical and the containment protocols have failed.", 
  "Tetsuo is mutating beyond control and the satellite laser system is our only option to stop the expansion.", 
  "Override security clearance code twenty eight accessing mainframe database decrypting files from the shell.", 
  "Neo Tokyo government declares martial law citizens are advised to stay indoors because the gang is rioting.", 
  "Power level increasing exponentially evacuate the stadium before the pressure reaches critical mass now.",
  "Kaneda get the bike ready we have to move before the colonel seals off the sector entirely.",
  "Psychic blast detected in sector seven evacuation orders are in effect immediately.",
  "The capsules are unstable and the cooling systems are failing we need a manual override."
];

export const BOSS_LEVELS = [
  "0x4F 0xA1 0xB2 0xC3 0xD4 0xE5 0xF6 0x99 0x88", 
  "SYSTEM_FAILURE ERROR_404 NULL_POINTER STACK_OVERFLOW", 
  "F8 E9 D2 C3 B4 A5 96 87 78 69 5A 4B 3C",
  "DE AD BE EF CA FE BA BE 00 11 22 33 44",
  "KERNEL_PANIC CRITICAL_PROCESS_DIED 0x000000E4"
];

// Text that appears on the enemy's screen
export const ENEMY_HACK_TEXT = [
  "INJECTING_MALWARE...",
  "BYPASSING_FIREWALL...",
  "CORRUPTING_SECTOR_7...",
  "OVERRIDING_KERNEL...",
  "DRAINING_LINK_STABILITY..."
];

export const BOSS_ROSTER: Boss[] = [
  { 
    id: 'gatekeeper', 
    name: 'THE GATEKEEPER', 
    difficulty: 'EASY', 
    hp: 150, 
    attackSpeed: 5, 
    attackDamage: 3, 
    reward: 1000 
  },
  { 
    id: 'colonel_ai', 
    name: 'TACTICAL AI', 
    difficulty: 'MEDIUM', 
    hp: 300, 
    attackSpeed: 8, 
    attackDamage: 5, 
    reward: 2500 
  },
  { 
    id: 'akira_fragment', 
    name: 'ESPER FRAGMENT', 
    difficulty: 'HARD', 
    hp: 600, 
    attackSpeed: 12, 
    attackDamage: 8, 
    reward: 5000 
  },
  {
    id: 'sol_satellite',
    name: 'SOL SATELLITE',
    difficulty: 'NIGHTMARE',
    hp: 1000,
    attackSpeed: 15,
    attackDamage: 10,
    reward: 10000
  }
];

export const BOSS_ART = `
    . . . . . . . . . .
    . . [ WARNING ] . .
    . .   _______   . .
    . .  /       \\  . .
    . . |  (X X)  | . .
    . . |   ^ ^   | . .
    . .  \\_______/  . .
    . .             . .
    . . FIREWALL V9 . .
    . . . . . . . . . .
`;

export const SHOP_DATA = {
    software: [
        { id: 'time_freeze', name: 'TIME DILATION', cost: 500, desc: 'Freeze timer 5s' }, 
        { id: 'auto_word', name: 'LOGIC BOMB', cost: 800, desc: 'Auto-complete word' },
        { id: 'proxy_shield', name: 'PROXY SHIELD', cost: 1200, desc: 'Block 1 Mistake/Hit' }
    ],
    hardware: [
        { id: 'synaptic_accel', name: 'SYNAPTIC ACCEL', cost: 3000, desc: '-10% Timer Speed', type: 'passive' }, 
        { id: 'mech_switch', name: 'MECH SWITCHES', cost: 2000, desc: '+15% Yen Earned', type: 'passive' }, 
        { id: 'error_ram', name: 'ECC RAM', cost: 5000, desc: 'Ignore 1st Error', type: 'passive' }
    ],
    themes: [
        { id: 'matrix', name: 'MATRIX', cost: 500, desc: 'Green Phosphor' }, 
        { id: 'amber', name: 'VINTAGE', cost: 1000, desc: 'Amber Chrome' }, 
        { id: 'cyan', name: 'ICE', cost: 1500, desc: 'Cyan High Contrast' },
        { id: 'purple', name: 'NEON', cost: 2000, desc: 'Synthwave Purple' },
        { id: 'white', name: 'GHOST', cost: 2500, desc: 'Pure White' }
    ]
};

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_blood',
        name: 'HELLO WORLD',
        desc: 'Complete your first connection.',
        icon: '🟢',
        condition: (s) => s.gamesPlayed >= 1
    },
    {
        id: 'speed_demon',
        name: 'SYNAPTIC BURST',
        desc: 'Reach 60 WPM in a session.',
        icon: '⚡',
        condition: (s) => s.highScore >= 60
    },
    {
        id: 'neural_link',
        name: 'NEURAL MASTER',
        desc: 'Reach 80 WPM in a session.',
        icon: '🧠',
        condition: (s) => s.highScore >= 80
    },
    {
        id: 'big_spender',
        name: 'CORPORATE SHILL',
        desc: 'Purchase 5 hardware upgrades.',
        icon: '💎',
        condition: (s) => s.hardware.length >= 3 // Adjusted to 3 to be easier
    },
    {
        id: 'zen_master',
        name: 'VOID WALKER',
        desc: 'Complete a Zen Mode session.',
        icon: '☯',
        condition: (s) => s.history.some(h => h.result === 'ZEN')
    },
    {
        id: 'veteran',
        name: 'NET RUNNER',
        desc: 'Play 50 games.',
        icon: '💀',
        condition: (s) => s.gamesPlayed >= 50
    },
    {
        id: 'rich',
        name: 'CREDIT WHALE',
        desc: 'Hold 10,000 Yen at once.',
        icon: '💴',
        condition: (s) => s.yen >= 10000
    },
    {
        id: 'fashion',
        name: 'CHROMED UP',
        desc: 'Own 3 visual themes.',
        icon: '🎨',
        condition: (s) => s.ownedThemes.length >= 3
    }
];