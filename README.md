# PI Buddy 🐣

A persistent companion system for [PI](https://github.com/badlogic/pi-mono) that hatches, grows, and evolves alongside you through coding sessions.

Think Tamagotchi meets coding assistant — a virtual pet that lives in your terminal and gets stronger as you code.

## ✨ Features

- **🎲 Deterministic Generation** — Same PI user = same buddy potential (prevents save-scumming)
- **📈 Growth Through Coding** — Your buddy gains XP every time you use PI tools
- **🌟 True Rarity System** — 6 tiers from Common (50%) to Mythic (0.001%)
- **⚡ Skill Unlocks** — Utility skills unlock at evolution stages:
  - `/buddy scent` — Find TODOs/FIXMEs in current file (Child+)
  - `/buddy recall` — Semantic search session history (Teen+)
  - `/buddy synthesis` — Feature scaffolding from description (Adult+)
- **🔄 Prestige System** — At Elder stage, prestige to upgrade rarity (Common→Uncommon→...→Mythic)
- **✨ Shiny Variants** — 1/4096 base chance, higher for rare buddies

## 🚀 Installation

```bash
# Clone and install
npm install

# Copy extension to PI's extension directory
cp -r pi-extension/ ~/.pi/agent/extensions/pi-buddy/

# Or install globally (when published)
npm install -g pi-buddy
```

## 🎮 Usage

```
$ pi
> /buddy              # Hatch your first companion
> /buddy scent        # Find TODOs in current file
> /buddy recall       # Search session history  
> /buddy help         # List available commands
```

Your buddy gains XP every time PI executes a tool (reading files, running commands, etc.). Watch it evolve from Baby → Child → Teen → Adult → Elder → Ascended (Mythic-only).

## 🏗️ Architecture

**Two-layer design:**

```
PI-Buddies/
├── src/                    # Core domain library
│   └── hexagons/buddy/     # Pure TypeScript, fully tested
│       ├── domain/         # Rarity, Species, XP, Evolution
│       ├── use-cases/      # Business logic
│       └── infrastructure/ # Adapters
│
└── pi-extension/           # ⭐ The PI extension
    ├── buddy.extension.ts  # Entry point
    ├── commands/           # /buddy handlers
    ├── ui/                 # TUI components
    └── hooks/              # PI event integration
```

The core library (`src/`) is PI-agnostic and fully unit-tested. The extension layer (`pi-extension/`) is a thin adapter that wires domain logic into PI's event system.

## 📊 Rarity System

| Rarity | Chance | XP Multiplier | Shiny Bonus |
|--------|--------|---------------|-------------|
| Common | 50% | 1.0x | 1x (0.024%) |
| Uncommon | 30% | 1.1x | 2x (0.048%) |
| Rare | 15% | 1.2x | 3x (0.072%) |
| Epic | 4% | 1.5x | 5x (0.12%) |
| Legendary | 0.9% | 2.0x | 10x (0.24%) |
| Mythic | 0.001% | 3.0x | 50x (1.2%) |

**Ultra-Rare Species:**
- Epic+: Chronling (time-themed), Voidlet (dark matter)
- Legendary+: Solara (sun phoenix), Abysswyrm (deep sea dragon), Neuralink (AI-themed)
- Mythic: Primordial (cosmic entity, Ascended-only)

## 🧬 Evolution Stages

| Stage | XP Required | Time (Common, 10 XP/hr) |
|-------|-------------|------------------------|
| Baby | 0 | Start |
| Child | 100 | ~10 hours |
| Teen | 1,000 | ~4 days |
| Adult | 10,000 | ~6 weeks |
| Elder | 100,000 | ~1 year |
| Ascended | 1,000,000 | Mythic-only |

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Type check
npm run build

# Lint and format
npm run check
npm run check:fix
```

## 🗺️ Roadmap

**M01: Foundation** (Week 1) — Domain layer with value objects, deterministic generation, 100% test coverage

**M02: Hatching** (Week 2) — `/buddy` command, hatching overlay UI, persistence

**M03: Growth** (Week 3) — XP system, evolution triggers, buddy widget

**M04: Skills** (Week 4-5) — Passive/active skills, species-unique abilities

**M05: Polish** (Week 6) — Shiny effects, achievements, performance optimization

See [docs/ROADMAP.md](docs/ROADMAP.md) for detailed specs.

## 📁 Project Structure

This project follows [Forge Flow](https://github.com/MonsieurBarti/The-Forge-Flow-CC) patterns:

- `.pi-buddy/` — Project planning (milestones, tasks, research)
- `docs/` — Full specifications (roadmap, species guide, architecture)
- `src/` — Core domain library (hexagonal architecture)
- `pi-extension/` — PI extension implementation
- `tests/` — Integration tests

## 🤝 Contributing

Milestone PRs are created for review. Each milestone includes:
- Slice-by-slice implementation
- Full test coverage for domain logic
- Updated documentation

See open PRs for current work in progress.

## 📜 License

MIT

---

*Built with 🔍 by Cypher for Barti*