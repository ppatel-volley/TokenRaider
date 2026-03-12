# Progression & Seasons
**Plunder — Game Design Document**
*Weekend Platform · Pre-Alpha*

---

## The Core Model

Plunder is a **seasonal live-ops game with a soft-reset loop.** There is no final boss. There is no credits screen. There is only the sea, and how much of a legend you made yourself before the sea took it back.

The structural reference is **Diablo 2 Ladder** — a seasonal competition where everyone starts fresh, the best players rise through knowledge and skill, the season ends with a leaderboard and rare rewards, and then it all begins again. What Plunder adds to that model is the **rowboat** — the diegetic reset state that is not a game over screen but the beginning of a new chapter. And the Animal Crossing layer: the world keeps moving whether you're playing or not, content accumulates each season, and there is always something new to find.

These two models resolve the central tension of async live-ops games: **how do you keep a veteran player engaged while keeping the game accessible to someone who just started?** The answer is that every captain — new or veteran — has been in a rowboat. The veteran just knows what to do next.

---

## Single-Season Progression Arc

Within one season, a captain progresses through five tiers. Tiers are not locked behind levels — they reflect the state of your fleet, renown, and reputation in the world.

### Tier 1: The Rowboat Captain

*You have: one ship, Tom, maybe Varney.*

This is the starting state — whether you're new to the game or you just lost everything. The world treats you as unknown. Navy ships ignore you. Merchants don't know your name.

**The tier's purpose:** Learn voice commands, establish core loop, form crew. Every player spends time here at the start of each season. A veteran moves through it faster — they know the routes, they know which early choices matter — but they still move through it. This creates mechanical parity without false equality.

**Exits tier when:** Second crew member recruited, first successful plunder, first port reputation established.

---

### Tier 2: Known Pirate

*You have: a named ship with a small crew, first port relationships, a modest reputation.*

The world starts to notice you. Merchants know your flag. Port towns have opinions. The first Campfire Stories (Hurricane, Kraken, Ghost Fleet) become possible. Rival pirates are aware you exist.

**New mechanics unlocked:**
- Trade relationships at ports (better prices for regulars)
- First alliance opportunity
- Shore leave events in full
- Crew proclivity stories start generating

**The tier's feel:** You're doing the thing. The core loop is running. The world feels alive. This is where most players find their rhythm.

**Exits tier when:** Renown crosses first threshold; second ship acquired or enough gold to purchase one.

---

### Tier 3: Feared Captain

*You have: two ships, a fleet, strong crew, meaningful world standing.*

The Rival Captain campfire story unlocks. The Royal Pardon offer becomes possible. The Navy treats you as a real threat — they respond to your presence differently. Port towns have rumors about you. New crew types become available who will only sail for a captain with reputation.

**New mechanics unlocked:**
- Fleet management (two ships, two crews, two sets of proclivities to manage)
- Faction standings with real diplomatic weight
- Bounty system — the Navy has a price on your head
- Rare crew archetypes (legendary skill sets, exotic proclivities)
- Seasonal world wedge access begins

**The tier's feel:** Complexity and consequence. The game becomes richer and harder simultaneously. The mutiny risk is real. Managing two ships' worth of crew proclivities while also maintaining faction relationships is genuinely demanding. This is where the game reveals its depth.

**Exits tier when:** Three ships in fleet OR Renown crosses the Pirate Lord threshold.

---

### Tier 4: Pirate Lord

*You have: a fleet, a reputation that precedes you, a legend in the making.*

The endgame state. Not a destination — a condition. The world has changed around you. Ports know your name. Your flag means something. The Pirate Lord tier is the Diablo 2 farming phase: you've hit the ceiling of the progression tree, but the rare booty is still out there. The rarest ships, the most powerful crew, the legendary encounters only available at this renown level — these are what you're chasing now.

**New mechanics unlocked:**
- Legendary ship classes (unique stats, unique narrative histories)
- Plunder's Armada event (fleet-scale battles, seasonal)
- Faction leadership roles — you're not just allied with a faction, you can influence their direction
- Cross-player interaction (rival Pirate Lords can affect your world)
- The Season's Legendary Event — the centerpiece campfire story that only triggers at Pirate Lord renown

**The tier's feel:** You've built something. And you know, with the precise clarity of experience, that you could lose all of it. The pressure doesn't go away — it becomes more expensive.

**No exit.** This is where seasons are won.

---

### The Rowboat (Reset State)

*You have: Tom. A rowboat. Your history.*

The reset state is not Tier 0. It is its own condition — the place you return to when the sea takes what you built. It can happen via:

- **Mutiny** — the crew votes you off your own ship; you're put ashore or set adrift
- **Catastrophic loss** — your flagship is sunk and you have no surviving ships
- **Betrayal** — a crew member with high Ambition proclivity successfully stages a coup (rare; endgame)
- **Voluntary** — a player can choose to start fresh (new season, new run, different choices)

**What the rowboat means mechanically:**
- Active fleet: gone
- Gold and active cargo: gone
- Current port standings: significantly reduced but not zero
- Renown: carries forward as *historical* renown — the world remembers you; this affects early-season progression speed

**What the rowboat means narratively:**
Tom is always there. Tom never mutinies. Tom never abandons the captain. He is the one constant across all resets, all seasons, all runs. When you find yourself in the rowboat, Tom is rowing.

His first line changes based on context:

> *After a mutiny:* "Well. That happened. Ship's still on the horizon if you want to take her back."

> *After a sinking:* "We're alive, Captain. That's more than some would say."

> *After a voluntary reset:* "New season. Same sea. Shall we?"

> *After betrayal:* "I told you about Varney." *(only if Varney was the one)*

**The key design principle:** The rowboat is not a punishment state. It is a narrative state. A captain who has been a Pirate Lord and finds themselves in a rowboat is not starting over — they are starting *again*. The game should honor that distinction in every line Tom delivers, in the way the world reacts to a captain with historical renown, in the slightly faster pace through early tiers for veterans.

A new player and a veteran are both in a rowboat. The veteran just rows differently.

---

## The Seasonal Model

Seasons are the primary live-ops vehicle for Plunder. Each season is a **distinct competitive era** with a theme, a new world region, a leaderboard, and content that can never be obtained again after that season ends.

### Season Structure

**Duration:** Approximately 12 weeks (3 months)

**The Season's Four Acts:**

| Act | Weeks | Focus |
|---|---|---|
| **The Opening** | 1–2 | Season launches; new world wedge accessible; everyone in rowboats |
| **The Climb** | 3–7 | Core progression; majority of players building toward Pirate Lord |
| **The Race** | 8–10 | Leaderboard visible; Pirate Lords competing for seasonal rare booty |
| **The Reckoning** | 11–12 | Final push; seasonal centerpiece Campfire Story triggers; leaderboard locks |

---

### The World Wedge

Each season opens a new permanent region of the world — an archipelago, a northern sea, a fog-bound passage, a mythic coastline. It is explorable immediately but yields its best content to captains with higher renown.

The wedge:
- Contains season-specific ports, factions, and encounter types
- Holds the season's rarest booty (ships, crew, cargo)
- Features the season's centerpiece campfire story
- Persists after the season ends — it becomes part of the permanent world, but its seasonal-exclusive content is gone

Over many seasons, the world grows. A player who has been around since Season 1 knows a world that a new player is still discovering. This is the Animal Crossing layer — the game accumulates. The veterans know things.

**Example season wedges:**
- *Season 1:* The Shallows — the starting region; establishes the world's geography
- *Season 2:* The Bone Coast — a haunted northern shoreline; introduces the ghost fleet at scale
- *Season 3:* The Deep Passage — a route through treacherous open ocean connecting two hemispheres
- *Season 4:* The Storm Isles — a volcanic archipelago with extreme weather; hurricane system expanded
- *Season 5:* The Old World Channel — first contact with a distant colonial power; new faction

---

### Renown as Seasonal Currency

Renown is both the progression metric and the leaderboard score. It accumulates from:
- Successful plunder
- Completed port quests and faction missions
- Campfire story outcomes (surviving earns renown; bold choices earn more)
- Fleet size and ship quality
- Crew loyalty and state (a well-run fleet earns more than a chaotic one)
- Other players' interactions with you (being talked about generates renown)

**The leaderboard is visible mid-season and becomes competitive in Act 3.** The top captains are named on port-town message boards in the game world — other players can see who is ahead. This creates social pressure and emergent rivalry.

**Season end rewards (permanent, cosmetic):**
- Top 10%: Seasonal flag variant for that season (displayed on ships permanently)
- Top 1%: Named title added to captain's legend ("Season 3 Sovereign of the Bone Coast")
- #1 Captain: A unique ship figurehead; a permanent entry in the game's Hall of Legends

These rewards are purely cosmetic and narrative — they confer no mechanical advantage in the next season. A Season 3 legend starts Season 4 in the same rowboat as everyone else. Their flag just looks different.

---

### Seasonal Rare Booty

Inspired by Diablo 2 Ladder's exclusive items — content only obtainable during the season it's introduced, which moves to the legacy pool afterward.

**Seasonal exclusives that can still be earned after the season ends (legacy pool):**
- Seasonal ship types (available in later seasons at reduced drop rates)
- Named crew from seasonal events (rare but possible to encounter in later content)

**Seasonal exclusives that are gone when the season ends:**
- The seasonal #1 ship figurehead
- Seasonal title and flag variant (can't earn Season 3 awards in Season 5)
- The centerpiece campfire story (won't trigger again — it happened; you either saw it or you didn't)

**The "max level farming" loop for Pirate Lords:**
Once at Pirate Lord renown, captains are farming for:
- Legendary ship variants (unique stat distributions, unique lore histories)
- Proclivity-perfect crew members (very rare recruitment events)
- Seasonal exclusive cargo types
- The rarest campfire story outcomes (certain endings to campfire stories are extremely low-probability; seeing them all is a long-term goal)

This is the endgame that keeps veterans playing at the top of each season — not power progression, but collection and mastery.

---

### What Carries Over Between Seasons

| Element | Carries Over? | Notes |
|---|---|---|
| Active fleet | No | Reset each season |
| Gold and cargo | No | Reset each season |
| Tom | Yes | Always |
| Historical renown | Yes | Affects early-tier progression speed |
| Seasonal cosmetic rewards | Yes | Permanent display |
| World knowledge (map, locations) | Yes | Veterans know the world; newcomers don't |
| Previously unlocked crew archetypes | Partial | Veteran captains have slightly better early recruitment options |
| Varney (if previously recruited and loyal) | Optional | Can appear in rowboat at season start if high loyalty was established |

**The veteran advantage is knowledge, not power.** A veteran captain moves through the early tiers faster because they know the routes, know which crew to take, know which campfire story choices work. They do not start with better equipment. The playing field is mechanically level; the experiential advantage is real and earned.

---

## Live Ops Cadence

### Weekly
- **World Events:** Rotating regional conditions ("The Navy has blockaded Port Maren," "The storm season has reached the Shallows," "A treasure fleet was spotted in the Deep Passage")
- **Market Fluctuations:** Port prices shift; creates trade opportunity and urgency
- **Crew Recruitment Events:** A specific named crew member is available at a specific port this week only
- **Encounter Rotations:** Weighted encounter tables shift to feature certain event archetypes

### Monthly (Mid-Season Drops)
- New ship variant available in the seasonal wedge
- A new campfire story seed goes live (starts triggering in the world)
- A new faction mission chain becomes available
- Community event: if X captains complete Y condition across the playerbase, a global world event fires

### Seasonal Milestone Events
- **The Opening Event** (Week 1): The season's world wedge is revealed; a First Mate briefing plays for every active captain describing what's been discovered; the race begins
- **The Reckoning Event** (Weeks 11–12): The season's centerpiece campfire story triggers for every captain who has reached Pirate Lord renown; non-Pirate Lords can still witness its effects in the world; the leaderboard is visible to all
- **The Season Close** (Week 12): Awards distributed; legacy pool updated; the world wedge is locked into permanent geography; one week of "offseason" before the next season begins

### The Offseason Week
Between seasons: the leaderboard is displayed in every port. You can still play — your current ship and crew persist — but no new renown accumulates. It's shore leave, essentially. A week to spend your booty, maintain your crew, and prepare.

Then Tom says: *"New season starts tomorrow, Captain. Rowboat's ready."*

---

## The Rowboat as Competitive Design

The soft reset creates competitive health in a way that permanent progression cannot:

**It keeps the leaderboard contested.** A Pirate Lord who gets complacent can be overtaken by a focused climber. No one's position is safe. The best players maintain their tier by continuing to play well — not by having gotten there first.

**It makes early-season exciting.** The first week of a season is equal footing. Everyone is small. Veterans and newcomers are both scrapping for their first ship. This is the most social and competitive moment of the season — the scramble.

**It makes the campfire stories hit harder.** When you have everything to lose, the hurricane matters. The Kraken's pearl is a genuine decision. The Royal Pardon is tempting. Consequence is proportional to stakes.

**It creates community narrative.** *"Season 4, I had a fleet of five ships, and Varney mutinied at the Bone Coast. Lost everything in a night. Best campfire story I ever had."*

The rowboat is not the punishment. It is the price of ambition. And the sea is worth it.

---

## Season 1 Plan: The Shallows

*Establishing the world. Teaching the systems. Building the community.*

**Theme:** Discovery — the uncharted region closest to the starting point; mystery and exploration
**Centerpiece campfire story:** The Night the Stars Went Wrong — the first signal that the world has a supernatural layer
**Seasonal rare:** A derelict ship of unusual design that can be repaired and sailed — unknown origin, unknown history
**Season arc:** Three competing factions vying to claim The Shallows as their territory; captains can choose sides, play all three, or remain independent; faction that has the most captain support at season end "wins" the territory politically (affects Season 2 world state)
**Community milestone:** If enough captains collectively plunder 1,000,000 gold worth of cargo in The Shallows during the season, a new port town is founded there in Season 2

**Season 1's real job:** Prove the model. Prove voice commands work. Prove the rowboat is compelling and not frustrating. Prove Tom is someone players love. Establish that campfire stories are talked about. Set up Season 2.

---

*Related documents: `first_ten_minutes.md`, `campfire_stories.md`, `crew_proclivities.md`, `crew_resolution_mechanics.md`*
