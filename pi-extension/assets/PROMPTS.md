# PI Buddy Pixel Art Prompts

Complete prompt set for generating **168 buddy images** (24 species × 7 evolution stages).

> **⚠️ Shiny Variants:** Shiny versions use **runtime effects only** — gold tint filters, sparkle overlays, and glow effects applied programmatically. No separate shiny images needed.

---

## File Structure

Images are organized by species folder with stage-based filenames:

```
~/Downloads/pi-buddies/
├── Blob/
│   ├── egg.png
│   ├── baby.png
│   ├── child.png
│   ├── teen.png
│   ├── adult.png
│   ├── elder.png
│   └── ascended.png
├── Puff/
│   ├── egg.png
│   ├── baby.png
│   └── ...
└── Solara/
    ├── egg.png
    ├── baby.png
    └── ...
```

**Naming Convention:** `{species}/{stage}.png` (case-sensitive, lowercase stages)

---

## Base Prompt Template

```
32x32 pixel art, cute chibi [STAGE] [SPECIES] creature, [DESCRIPTION], [STAGE_FEATURES], [SPECIES_UNIQUE], [STYLE], transparent background
```

---

## Evolution Stage Features (7 Stages)

### Egg (Stage 0)
- **Visual:** Contained potential — seed, orb, crystal, shell, cocoon
- **Colors:** Muted version of species palette, hints at what's inside
- **Details:** Subtle inner glow, gentle pulsing energy visible
- **Size:** 16×16 to 20×20 (smaller than hatched forms)
- **Animation feel:** Gentle rocking, pulsing heartbeat glow

### Baby (Stage 1)
- **Visual:** Tiny chibi proportions (head 50% of body)
- **Eyes:** Oversized, sparkly, innocent, no pupils or large pupils
- **Limbs:** Small nubby stubs, barely functional
- **Expression:** Simple, cute, curious, no complex emotions
- **Pose:** Bouncy, wobbling, gentle floating, unstable
- **Colors:** Soft pastels, slightly lighter than adult form

### Child (Stage 2)
- **Visual:** Growing proportions (head 40% of body)
- **Features:** Developing distinguishing traits (wing buds, fin stubs, tiny horns)
- **Expression:** Playful, curious, mischievous
- **Movement:** Running, tumbling, exploring
- **Details:** Basic accessories forming (small scarf bud, tiny crystal nub)
- **Personality:** Emerging but not defined

### Teen (Stage 3)
- **Visual:** Balanced proportions (head 30% of body)
- **Silhouette:** Distinctly recognizable as the species
- **Expression:** Confident, eager, slightly awkward, determined
- **Pose:** Dynamic action — mid-jump, casting first spell, showing off
- **Features:** Full accessory suite visible but not refined (full wings but small, horns growing)
- **Personality:** Fully visible, attitude showing

### Adult (Stage 4)
- **Visual:** Majestic proportions (head 25% of body)
- **Stance:** Masterful, grounded, commanding presence
- **Expression:** Wise, powerful, calm confidence, knowing
- **Features:** Perfected form — wings fully spread, crown complete, aura controlled
- **Power:** Elemental mastery visible (flames controlled, water flowing elegantly)
- **Details:** Refined, elegant, no wasted lines

### Elder (Stage 5)
- **Visual:** Slightly weathered version of adult
- **Additions:** Small signs of age — wiser eyes, perhaps a small beard for some, faded colors
- **Presence:** Ancient wisdom, slow deliberate movements
- **Aura:** More subdued but deeper, inner power glow
- **Details:** Subtle scars or marks of experience, maybe a staff or elder accessory

### Ascended (Stage 6)
- **Visual:** Transcendent form — ethereal, semi-transparent, glowing from within
- **Form:** May float slightly, defy gravity, surrounded by elemental aura
- **Expression:** Beyond mortal understanding, serene, cosmic awareness
- **Colors:** Brighter, slightly translucent, inner light visible
- **Effects:** Cosmic/star particles, time distortion hints, reality bending subtle
- **Size:** May be slightly larger or have expanded aura field

---

## Species Themes by Rarity (24 Total)

### COMMON (8 species, 50% hatch rate)

**Blob:** Amorphous, gelatinous, adaptable, pastel blue-green, round soft shapes, wobbling form, no fixed shape

**Puff:** Cloud-like, fluffy cotton texture, airy, white with pastel tint, soft edges, floating

**Wisp:** Ghostly, ethereal, glowing core, cyan-white, spirit-like trailing effect, translucent edges

**Pebble:** Rock, mineral, sturdy, crystalline facets, brown-gray-green, geometric hard edges

**Mote:** Spark particle, bright yellow-white, energetic, small but intense glow, star-like

**Sprout:** Plant, seedling, organic curves, green-brown, leaf textures, growing upward

**Droplet:** Water, fluid, adaptable shape, blue-cyan, transparent water effects, flowing

**Spark:** Electric, lightning energy, yellow-blue crackling, jagged edges, energetic buzz

### UNCOMMON (6 species, 30% hatch rate)

**Fuzzle:** Fuzzy fur ball, warm orange-brown, soft texture, cozy round, gentle eyes

**Drifter:** Wind spirit, traveler aesthetic, flowing scarf-trails, blue-white, nomadic feel

**Lumo:** Lantern-creature, warm yellow glow, guiding light, soft gold, helpful presence

**Shellbie:** Spiral shell, protected, pearl-pink iridescent, patient, spiral patterns

**Bitling:** Digital pixel entity, tech-green-cyan, glitch effects, circuit patterns, angular

**Whisk:** Speed demon, swift, wind trails, blue-white blur effects, streamlined, fast pose

### RARE (4 species, 15% hatch rate)

**Glimmeron:** Crystal jewel, prismatic rainbow refraction, shiny facets, brilliant light, geometric

**Barkle:** Ancient tree spirit, bark texture, brown-green moss, weathered, wise, organic rugged

**Circuit:** Living circuit board, electricity gold-green, tech-life fusion, angular patterns

**Aetheroot:** Spirit-root entity, ethereal purple-white, ghostly roots, mystical, floating

### EPIC (2 species, 4% hatch rate)

**Chronling:** Time entity, hourglass motifs, clockwork gears, gold-bronze, temporal effects

**Voidlet:** Dark matter, cosmic void, purple-black with star specks, mysterious, shadowy

### LEGENDARY (3 species, 0.9% hatch rate)

**Solara:** Sun phoenix, golden-orange flames, rebirth motifs, majestic fire bird, radiant

**Abysswyrm:** Deep sea dragon, dark blue-purple, ancient scales, bioluminescent spots, massive

**Neuralink:** AI consciousness, silver-blue synthetic, neural patterns, learning/evolving feel

### MYTHIC (1 species, 0.1% hatch rate)

**Primordial:** Cosmic entity, universe contained, all colors cosmos, starfield body, transcendent

---

## Shiny Effects (Runtime Applied)

**No separate shiny images needed.** Apply these effects programmatically:

### Visual Shiny Indicators

| Effect | Implementation | Intensity |
|--------|---------------|-----------|
| **Gold Tint** | Color overlay/shader (multiply #FFD700 at 30% opacity) | All stages |
| **Sparkle Particles** | ✨ emoji overlay or particle system | Random intervals |
| **Glow Bloom** | Gaussian blur glow effect, gold/white | Adult+ stages |
| **Star Pupils** | Eye highlight modification | Baby-Teen |
| **Aura Pulse** | Subtle pulsing glow animation | All stages |

### Stage-Specific Shiny Enhancements

- **Egg:** Stronger inner glow, occasional sparkle burst
- **Baby:** Star-shaped pupils, soft gold shimmer
- **Child:** Playful sparkles when moving
- **Teen:** Confident golden aura, dramatic shine on features
- **Adult:** Majestic crown glow, refined golden light
- **Elder:** Ancient wisdom shimmer, deeper gold tones
- **Ascended:** Cosmic starfield enhancement, reality distortion gold

### Terminal/Shiny Display (ASCII Fallback)

When no images available, use gold/yellow ANSI color codes:
```
Normal: \x1b[36m (cyan) for Wisp
Shiny:  \x1b[33;1m (bold yellow) + ✨ prefix
```

---

## Style Guide

### Always Include
- `32x32 pixel art` — exact size
- `chibi` — cute proportions
- `transparent background` — PNG alpha
- `SNES style` or `Game Boy Color style` — era reference
- `limited palette` — 4-8 colors per sprite

### Stage Keywords
| Stage | Mood Keywords |
|-------|--------------|
| Egg | potential, contained, waiting |
| Baby | cute, adorable, innocent, soft |
| Child | playful, curious, growing, energetic |
| Teen | confident, awkward, eager, determined |
| Adult | majestic, wise, powerful, graceful |
| Elder | ancient, weathered, deliberate, profound |
| Ascended | transcendent, ethereal, cosmic, serene |

### Species Keywords by Type
| Type | Visual Keywords |
|------|-----------------|
| Fire/Sun | flames, warm glow, orange-gold, heat shimmer |
| Water | flowing, transparent, blue-cyan, ripple effects |
| Electric | crackling, jagged, yellow-blue, energy arcs |
| Plant | organic, growing, green-brown, leaf details |
| Crystal | faceted, refractive, shiny, geometric |
| Dark/Void | shadows, purple-black, star specks, mysterious |
| Spirit | ethereal, translucent, glowing, soft edges |
| Tech | angular, circuit patterns, green, pixel effects |
| Time | clockwork, gold, hourglass, gears |
| Cosmic | nebula, stars, deep space, all colors |

---

## Generation Workflow

### Phase 1: Foundation (56 images)
Generate all 7 stages for Common species first (8 × 7 = 56):
1. Blob (all 7 stages) — establish base style
2. Puff through Spark (remaining 7 species × 7 stages)

**Goal:** Lock in consistent style, palette rules, proportions

### Phase 2: Expansion (42 images)
Uncommon species (6 × 7 = 42):
- Maintain style consistency from Phase 1
- Add complexity appropriate to rarity

### Phase 3: Rare+ (70 images)
Rare (4 × 7 = 28) + Epic (2 × 7 = 14) + Legendary (3 × 7 = 21) + Mythic (1 × 7 = 7) = 70

**Goal:** More detail, unique features, spectacular Adult/Ascended forms

### Phase 4: Shiny Effects (Runtime)
Implement gold tint shaders, sparkle particle systems, glow effects in code

---

## Example Prompts

### Blob - Egg
```
32x32 pixel art, potential-contained egg blob creature, smooth gelatinous sphere, muted pastel blue-green hinting at jelly inside, gentle inner pulse glow, small bouncy shadow beneath, soft shading, transparent background, Game Boy Color style
```

### Blob - Baby
```
32x32 pixel art, cute chibi baby blob creature, small round gelatinous body 50% head, oversized sparkly innocent eyes, tiny nubby limb stubs, wobbling unstable cute pose, soft pastel blue-green, simple smooth shading, bouncing feel, transparent background, Game Boy Color style
```

### Blob - Adult
```
32x32 pixel art, majestic chibi adult blob creature, refined gelatinous form 25% head, wise knowing calm eyes, confident grounded stance, mastery of shapeshifting visible in controlled wobble, elegant blue-green with depth shading, refined details, commanding presence, transparent background, SNES style
```

### Solara - Ascended (Shiny = gold tint applied in code)
```
32x32 pixel art, transcendent chibi ascended solara sun phoenix, semi-transparent ethereal form containing solar flares, cosmic awareness serene expression, reality-bending golden-white aura surrounding, transcendent beyond mortal form, brilliant orange-gold base colors for gold tint overlay, transparent background, SNES style
```

### Primordial - Elder
```
32x32 pixel art, ancient chibi elder primordial cosmic entity, weathered form with subtle ancient marks, deep cosmic wisdom in eyes, slower deliberate pose, subdued but deep inner starfield glow, faint elder staff, deep space colors with cosmic dust, transparent background, SNES style
```

---

## Color Palette Reference

| Type | Primary | Secondary | Accent | Glow |
|------|---------|-----------|--------|------|
| Water | #4ECDC4 | #44A08D | #96CEB4 | #A8E6CF |
| Fire | #FF6B35 | #F7931E | #FFD23F | #FFE66D |
| Electric | #FFD700 | #FFA500 | #FFFF00 | #FFFACD |
| Plant | #2ECC71 | #27AE60 | #7ED321 | #A8E6CF |
| Crystal | #E8DAEF | #D6A2E8 | #F5B041 | #FFF5E6 |
| Dark | #2C3E50 | #34495E | #9B59B6 | #8E44AD |
| Spirit | #AED6F1 | #85C1E9 | #D6EAF8 | #EBF5FB |
| Tech | #00FF41 | #008F11 | #003B00 | #39FF14 |
| Time/Gold | #D4AF37 | #C5B358 | #F4E4C1 | #FFD700 |
| Cosmos | #1A1A2E | #16213E | #0F3460 | #E94560 |

---

## Technical Specifications

### Image Requirements
- **Size:** 32×32 pixels exact
- **Format:** PNG with alpha transparency
- **Color depth:** 8-bit indexed or 32-bit RGBA
- **File size:** < 5KB per image (optimize with pngquant)

### Terminal Display
- **Kitty:** Full color + transparency support
- **iTerm2:** Full color + transparency support
- **Fallback:** ANSI 256-color ASCII art

### Naming Validation
```typescript
// Valid paths
~/Downloads/pi-buddies/Blob/baby.png
~/Downloads/pi-buddies/solara/adult.png
~/Downloads/pi-buddies/Primordial/ascended.png

// Invalid paths (will fallback to ASCII)
~/Downloads/pi-buddies/blob-baby.png  // wrong structure
~/Downloads/pi-buddies/Blob/Baby.PNG // wrong case
```

---

## Post-Generation Checklist

- [ ] All 7 stages present for species
- [ ] Consistent 32×32 size across all images
- [ ] Transparent background verified
- [ ] Color palette matches species type
- [ ] Stage progression logical (Baby → Adult)
- [ ] Shiny effects testable (run with `isShiny: true`)
- [ ] File names lowercase, PNG format
- [ ] Folder names match species exactly

---

## Total Asset Count

| Asset Type | Count | Notes |
|------------|-------|-------|
| Base Images | 168 | 24 species × 7 stages |
| Shiny Variants | 0 | Runtime effects only |
| Animation Frames | Optional | 2-3 idle frames per stage |
| Evolution Transitions | Optional | 25 transition sprites |
| **Minimum Required** | **168** | Base set only |

---

## Generation Priority

1. **P0 — All Baby stages** (24 images) — Most common view
2. **P1 — All Egg + Adult** (48 images) — Hatch and final form
3. **P2 — Child + Teen** (48 images) — Growth progression
4. **P3 — Elder + Ascended** (48 images) — Endgame prestige
5. **P4 — Shiny effects code** — Gold tint, sparkles, glow

Start with P0, test in terminal, iterate style, then expand.
