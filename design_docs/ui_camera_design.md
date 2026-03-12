# UI & Camera Design
**Plunder — Game Design Document**
*Weekend Platform · Pre-Alpha*

---

## Camera System

### The Reference: Jungle Strike + Starcraft Marriage

The camera is a **dynamic isometric follow-cam** that tracks the flagship. Think Jungle Strike's
diagonal world-follows-the-vehicle feel — the ship is always roughly centered, the sea stretches
out ahead, and the world scrolls around you as you move. The angle sits at roughly 45–55 degrees
off the horizon. Not top-down, not behind-the-shoulder — the sweet spot where you feel like you're
*on* the ship but can also read the tactical situation around it.

Jungle Strike specifically nails something Starcraft doesn't: you feel like you're *in* the action
rather than *commanding* it from orbit. That distinction matters here because the player isn't a
general — they're the Captain, physically present on their ship. The camera should reinforce that.

```
        ahead of ship (visible)
       /
      /   ~60% of screen
     /
  [SHIP] ← camera orbits around this point
     \
      \   ~40% of screen
       \
        wake / trailing water
```

The camera sits *ahead* of the ship slightly — you see more of where you're going than where
you've been. In combat, it pulls slightly wider and lowers angle to capture both ships in frame.

---

### Camera Modes

**Navigation Mode** *(default open sea)*
- Ship centered, moderate zoom, ~60% forward view
- Sees approximately 1.5 ship-lengths to each side
- Distant objects (other ships, land, storm) are visible as silhouettes before detail loads
- Wind direction visible via rigging and flag movement

**Combat Mode** *(triggered on engagement)*
- Camera pulls wider, angle drops slightly (more cinematic horizon)
- Enough frame to see both ships during a broadside
- When boarding begins: camera pushes closer, follows the boarding crew across
- Dynamic — reacts to explosions, recoil, fire

**Port Mode** *(on arrival)*
- Camera pulls back to show full port layout
- Ship moves into dock; camera gradually slows and settles
- The port feels like a destination, not just a menu trigger

**Inspection Mode** *(triggered by voice or crew strip tap)*
- "How is Mira doing?" → camera sweeps and finds Mira on deck, briefly holds on her
- Returns to navigation mode after 3–5 seconds
- Crew member briefly glances toward camera (acknowledgement)

**Fleet Overview Mode** *(manual, button/gesture)*
- Camera lifts and zooms out to show all ships in current region
- Ships labeled with name and status color
- Tap/voice selects which ship to switch focus to
- Tapping a ship here snaps the main camera back to Navigation Mode on that vessel

---

### Camera Following the Captain

The captain is always *on* the standard-bearer ship — the flagship. When you command a second
ship, you're doing it from the flagship's quarterdeck. The camera doesn't leave unless you
explicitly switch ships.

Voice commands that should feel like directing the camera:

| Voice Command | Camera Response |
|---|---|
| `"What's on the horizon?"` | Smooth pan forward, slight zoom toward horizon, holds 2s |
| `"How is Chen doing?"` | Sweeps to find Chen on deck, brief hold, returns |
| `"All hands on deck!"` | Camera pulls back slightly; crew visibly responds on ship |
| `"Fire the cannons!"` | Cuts slightly wider; follows cannon fire toward target |
| `"Take us to port"` | Camera gently shifts to show nearest port on horizon |
| `"What's our heading?"` | UI compass animates; no camera change needed |
| `"Give me a report on the fleet"` | Enters Fleet Overview Mode |

The camera becomes a storytelling collaborator with voice commands. The player *feels* their
words doing something immediately, even before the game state resolves.

---

## HUD Layout

The HUD is designed around three principles:
1. **Glanceable** — you should be able to read the state of your world in 2 seconds
2. **Non-intrusive** — the sea and ship should dominate the screen; UI lives at edges
3. **Voice-first** — every UI element has a voice equivalent; you never *need* to touch the screen

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [MINIMAP]          [WIND/HEADING]          [NOTORIETY]  [TIME/DATE]    │  ← Top bar
│                                                                          │
│                                                                          │
│                     [WORLD / SHIP / SEA]                                │
│                                                                          │
│                                                                          │
│  [SHIP STATUS]                                         [FIRST MATE LOG] │  ← Mid-sides
│  Hull: ████░░                                          "Sails spotted   │
│  Prov: ███░░░                                          to the east..."  │
│  Ammo: █████░                                                            │
│  Sail: ████░░                                                            │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│  [CREW STRIP]                                                            │  ← Bottom bar
│  ○Jack  ○Mira  ○Chen  ○Tom  ○Nkechi  ○Cormac  ○…         [SHIP TABS]   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### Top Bar

**Minimap** (top-left)
- Shows known region: current ship position, fleet positions, visible nearby ships, charted land
- Enemy ships appear as red silhouettes when spotted; disappear in fog/distance
- Tap minimap to enter Fleet Overview Mode

**Wind & Heading** (top-center)
- Compass rose with current heading and wind direction
- At-a-glance speed indicator (ripple rings around ship icon in minimap)

**Notoriety Gauge** (top-right)
- Your reputation in the current region — affects how ships react to you on sight
- Skull icons: 1 = unknown, 5 = legend; color indicates valence (gold = renown, red = bounty/feared)

**Time/Date** (top-right)
- In-world clock and date
- Small moon phase indicator (affects night encounters and certain crew proclivities)

---

### Side Panels

**Ship Status** (left, mid-screen) — semi-transparent, fades when not needed
- Four bars: Hull, Provisions, Ammunition, Sail & Rigging
- Bars change color: green → yellow → red
- Tapping a bar opens a detail view with specifics (which provision? which sail is damaged?)
- Voice equivalent: `"What's the state of the ship?"` reads all four aloud via First Mate

**First Mate Log** (right, mid-screen) — scrolling, semi-transparent
- Most recent 3–4 First Mate observations, quietly persistent on screen
- New entries slide in from top; old ones fade
- The last thing the First Mate said is always visible
- Tapping opens the full log (all session + since last login)

---

## The Crew Strip

The crew strip is the soul of the HUD. It runs across the bottom of the screen and gives the
captain a constant read on their people.

```
┌───────────────────────────────────────────────────────────────────┐
│                         CREW STRIP                                │
│                                                                   │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐     │
│  │  ████  │  │  ████  │  │  ████  │  │  ████  │  │  ████  │     │
│  │ JACK   │  │ MIRA   │  │ CHEN   │  │  TOM   │  │NKECHI  │     │
│  │▓▓▓░░░░ │  │▓▓▓▓▓░░ │  │▓▓▓▓▓▓░ │  │▓░░░░░░ │  │▓▓▓▓▓▓▓│     │
│  │▓▓▓░░░░ │  │▓▓▓▓▓░░ │  │▓▓▓▓▓▓░ │  │▓▓░░░░░ │  │▓▓▓▓▓░░│     │
│  │  [!]   │  │        │  │        │  │  [💀]  │  │       │     │
│  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘     │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Portrait Card Anatomy

Each crew member gets a card:
- **Portrait** — illustrated face; unique to the character; emotes subtly (happy, worried, angry)
- **Name** — first name or nickname
- **Needs bars** — 2 rows of compact bars (see below)
- **State indicator** — icon above the portrait when something is happening

### Needs Bars in the Crew Strip

Four bars, two rows of two, displayed as short compact bars below the portrait:

```
  Row 1:  [HEALTH ████░]  [MORALE ██░░░]
  Row 2:  [HUNGER ████░]  [BOREDOM ██░░░]
```

Color coding: green (satisfied) → yellow (wanting) → orange (compelled) → red (driven/critical)

Bars are narrow and simple — readable at a glance, not a spreadsheet. The captain shouldn't
need to read numbers; they should be able to scan the strip and see which crew member has a
red bar.

### State Indicators (Above Portraits)

These icons appear *above* the portrait when a crew member enters a notable state:

| Icon | Meaning |
|---|---|
| `?` | Something interesting/unknown — first discovery of a proclivity, unexpected behavior |
| `!` | Urgent — proclivity at COMPELLED or approaching DRIVEN; action likely soon |
| `💬` | Wants to speak to the captain — has something to say, a request, information |
| `⚔️` | In conflict with another crew member — feud or brawl active |
| `💀` | Critical health or morale — needs immediate attention |
| `✨` | Proclivity recently satisfied — in bonus state; performing exceptionally |
| `🔒` | Assigned to special role — currently executing a mission or channeled task |
| `🎭` | Incident pending — resolution waiting for captain |

The `?` and `!` are the most common. The `?` has a specific design intention: it signals *discovery*,
not danger. When a new proclivity surfaces for the first time, it's a `?` — something is interesting,
not wrong. The player is invited to investigate, not alarmed.

### Tapping / Selecting a Crew Member

Tapping a portrait card does two things:
1. Camera does a brief Inspection sweep to find that crew member in the world
2. A crew detail drawer slides up from the bottom showing: full name, role, trait list, all needs in
   detail, current task, proclivity states (visible ones), loyalty meter, and any pending incidents

From this drawer the captain can issue direct orders to that crew member via voice:
`"Mira, take the helm"` / `"Chen, rest — you've been pushing hard"` / `"Jack, I'm watching you"`

---

## In-World Crew Representation

Crew members walk the deck as small human figures. They are recognizable but not detailed —
they move with personality (Jack sways slightly, Mira walks with purpose) but the camera isn't
close enough to see faces in Navigation Mode.

### Portrait Circles In-World

When a crew member is visible on deck and in a notable state (any icon active), a small circle
containing their portrait floats above their figure. This circle:

- Matches the portrait in the crew strip, so the player can connect strip → world instantly
- Pulses or has a colored outline that matches the indicator color (yellow for `!`, red for `💀`)
- Disappears when the crew member returns to a neutral state
- Can be tapped to trigger the same drawer as the strip card

When Jack is about to go rogue (COMPELLED state), you'll see:
1. His strip card going orange with a `!` above it
2. His in-world figure with a pulsing portrait circle floating above his model
3. His model moving differently — more agitated body language, glancing toward the water

The captain can respond *before* the incident fires. Voice: `"Jack — get back to work"` or
`"Jack, what are you after?"` (which triggers a short First Mate voice line revealing the proclivity
if not yet discovered). This is the intervention window.

---

## The Crew Strip at Fleet Scale

When the player has multiple ships, the strip needs to scale:

### Approach: Ship Tabs + Focused Strip

The bottom of the screen has ship tabs above the crew strip. The active tab shows that ship's
crew. Switching tabs is a fast swipe or voice command (`"Show me the Revenge's crew"`).

```
  ┌──────────────────────────────────────────────┐
  │  [The Black Meg ▼]  [The Revenge]  [Scout 1] │  ← Ship tabs
  ├──────────────────────────────────────────────┤
  │  [Jack] [Mira] [Chen] [Tom] [Nkechi]  ...    │  ← Crew for selected ship
  └──────────────────────────────────────────────┘
```

Ships with crew incidents glow or badge the tab with a `!` or `🎭` so the captain always knows
which ship needs attention without switching.

### Global Incident Queue

If multiple incidents are pending across ships, a small vertical queue appears on the right side
of the screen — stacked incident thumbnails (portrait + icon) showing what needs resolution.
Tapping one switches camera to that ship and opens the incident. Voice: `"What needs my attention?"`
reads the queue aloud in priority order.

---

## Voice + UI Interaction Model

The HUD should feel like a *response* to voice commands, not a parallel system. When the captain
speaks, the relevant UI element animates:

| Voice Command | UI Response |
|---|---|
| `"How is the hull?"` | Hull bar briefly pulses and enlarges; First Mate reads value |
| `"What's the crew's morale?"` | All morale bars briefly highlight across the strip |
| `"Is anyone hurt?"` | Health bars highlight; critical ones flash; First Mate names them |
| `"Who's causing trouble?"` | Any `!` indicators flash; First Mate names the crew member(s) |
| `"First Mate, full report"` | Full log expands; First Mate reads the three most urgent items |

The UI is never a substitute for voice — it's a confirmation layer. A captain who plays entirely by
voice should be able to manage their ship effectively. The HUD serves players who want to
visually verify what they just heard.

---

## Art Direction Notes for UI

The crew strip should feel like it belongs to the world — weathered, nautical, handcrafted.
Not clean game-UI chrome. Suggestions:

- Portrait frames look like painted lockets or carved wood — each unique to the character
- Needs bars styled as fill gauges on a ship instrument panel — brass fittings, glass tubes
- The strip itself has a texture suggesting the ship's railing or a row of posted portraits below
  the quarterdeck
- State indicator icons should feel hand-stamped or painted — not pixel-perfect UI icons
- First Mate log looks like a ship's log scroll — text appears as if being written

The world is beautiful. The UI is *of* the world, not in front of it.

---

*Related documents: `crew_proclivities.md`, `crew_resolution_mechanics.md`, `first_mate_briefing.md`*
