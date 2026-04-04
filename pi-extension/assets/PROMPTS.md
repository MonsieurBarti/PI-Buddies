# PI Buddy Pixel Art Prompts

Complete prompt set for generating 125 buddy images (25 species × 5 evolution stages).

## Base Prompt Template

```
32x32 pixel art, cute chibi [STAGE] [SPECIES] creature, [DESCRIPTION], [STAGE_FEATURES], [SPECIES_UNIQUE], [STYLE], transparent background
```

## Evolution Stage Features

**Egg:**
- Shape appropriate to species (seed, orb, crystal, shell, etc.)
- Simple, smooth surface
- Species color scheme hints
- Inner glow or life energy visible

**Baby:**
- Tiny chibi proportions (head 50% of body)
- Oversized sparkly eyes
- Small nubby limbs
- Simple cute expression
- Bouncy/pose or gentle floating

**Child:**
- Growing proportions (head 40% of body)
- Developing features (wings, fins, limbs)
- Curious/playful expression
- Movement and personality emerging
- Basic accessories or features forming

**Teen:**
- Balanced proportions (head 30% of body)
- Distinct silhouette recognizable
- Confident/assertive expression
- Full accessory suite (wings, crown, etc.)
- Dynamic action pose
- Personality fully visible

**Adult:**
- Majestic proportions (head 25% of body)
- Masterful stance
- Wise/powerful expression
- Full mastery of elemental power visible
- Elegant refined details
- Commanding presence

## Species Themes by Rarity

### COMMON (50%)
**Blob:** Amorphous, gelatinous, adaptable, pastel colors, round shapes
**Puff:** Cloud, fluffy, soft, cotton texture, airy, white/pastel
**Wisp:** Ghost, ethereal, glowing, spirit-like, cyan/white
**Pebble:** Rock, sturdy, earthy, minerals, brown/gray/green
**Mote:** Spark, particle, energetic, bright, yellow/white
**Sprout:** Plant, growing, nature, green/brown, organic
**Droplet:** Water, fluid, adaptable, blue/cyan, flowing
**Spark:** Electric, lightning, energetic, yellow/blue, crackling

### UNCOMMON (30%)
**Fuzzle:** Fuzzy, warm, cozy, fur texture, orange/brown
**Drifter:** Wind, traveler, nomad, scarf, blue/white, wispy
**Lumo:** Lantern, light, guiding, warm glow, yellow/gold
**Shellbie:** Shell, protected, patient, spiral, pink/pearl
**Bitling:** Digital, pixel, tech, glitch, green/cyan
**Whisk:** Speed, swift, wind, fast, blur effects, blue/white

### RARE (15%)
**Glimmeron:** Crystal, jewel, refractive, shiny, rainbow/prismatic
**Barkle:** Tree, bark, ancient, forest spirit, brown/green
**Circuit:** Circuit board, electricity, tech-life, green/gold
**Aetheroot:** Spiritual, roots, ethereal, purple/white, ghostly

### EPIC (4%)
**Chronling:** Time, hourglass, clockwork, temporal, gold/bronze
**Voidlet:** Dark matter, void, cosmic, stars, purple/black

### LEGENDARY (0.1%)
**Solara:** Sun, phoenix, fire, rebirth, golden/orange, flames
**Abysswyrm:** Deep sea, dragon, ancient, dark, blue/purple
**Neuralink:** AI, neural, synthetic, learning, silver/blue

### MYTHIC (0.01%)
**Primordial:** Cosmic, entity, creation, universe, all colors/cosmos

## Style Keywords

**Always include:**
- `chibi` (cute proportions)
- `32x32` (size)
- `pixel art` (style)
- `transparent background` (for game use)
- `game boy color style` or `SNES style` (era reference)

**Add for mood:**
- `cute`, `adorable` (Baby/Child)
- `confident`, `determined` (Teen)
- `majestic`, `wise`, `powerful` (Adult)
- `sparkly`, `glowing` (magical)
- `smooth shading` or `limited palette` (style)

## Example Prompts

### Blob - Baby
```
32x32 pixel art, cute chibi baby blob creature, small round gelatinous body, oversized sparkly eyes, tiny nubby limbs, wobbling cute pose, pastel blue-green color, simple smooth shading, bouncing animation feel, transparent background, game boy color style
```

### Glimmeron - Adult
```
32x32 pixel art, majestic chibi adult glimmeron crystal spirit, grand multifaceted diamond form, wise brilliant expression, master of light, rainbow refraction aura surrounding body, prismatic crown, commanding radiant stance, brilliant prismatic colors with sparkle effects, transparent background, SNES style
```

### Solara - Adult
```
32x32 pixel art, majestic chibi adult solara sun phoenix, grand golden phoenix form with flowing flame feathers, wise powerful expression, master of fire and rebirth, solar flare aura surrounding, brilliant golden crown, commanding flaming stance, orange-gold with white-yellow flame effects, transparent background, SNES style
```

### Primordial - Adult
```
32x32 pixel art, transcendent chibi adult primordial cosmic entity, grand form containing stars and galaxies, wise ancient expression, master of creation itself, cosmic aura with nebulae, universe-crown, commanding eternal stance, deep space colors with all cosmic colors swirling, transparent background, SNES style
```

## Color Palette Guide

| Species Type | Primary | Secondary | Accent |
|--------------|---------|-----------|--------|
| Fire/Sun | #FF6B35 | #F7931E | #FFD23F |
| Water | #4ECDC4 | #44A08D | #96CEB4 |
| Electric | #FFD700 | #FFA500 | #FFFF00 |
| Plant/Nature | #2ECC71 | #27AE60 | #7ED321 |
| Crystal | #E8DAEF | #D6A2E8 | #F5B041 |
| Dark/Void | #2C3E50 | #34495E | #9B59B6 |
| Spirit/Ethereal | #AED6F1 | #85C1E9 | #D6EAF8 |
| Tech/Digital | #00FF41 | #008F11 | #003B00 |
| Time/Gold | #D4AF37 | #C5B358 | #F4E4C1 |

## Generation Tips

1. **Batch generate by stage:** Do all "Baby" prompts first for consistency
2. **Use seed for consistency:** Same seed across stages for same species
3. **Post-process:** Ensure 32×32 exactly, transparent PNG
4. **Name files:** `{species}-{stage}.png` (e.g., `blob-baby.png`)
5. **Test in terminal:** Verify images display well in Kitty/iTerm2

## Total Images Needed

- 25 species × 5 stages = 125 images
- Optional: 1-3 idle animation frames per stage (375 total with 3-frame idle)
- Optional: Evolution transition frames (25 × 5 transitions = 125 additional)

Start with Baby stage for all 25 species first (easiest to get right), then expand to full set.
