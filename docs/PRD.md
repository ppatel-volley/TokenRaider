# TokenRaider — Product Requirements Document

**Version:** 1.0
**Date:** 10 March 2026
**Status:** Production-ready

---

## 1. Vision & Pitch

**One-line pitch:** Your pirate ship sails on while you sleep — command your crew by voice, and come back to discover what your AI captain did in your absence.

TokenRaider is a persistent-world pirate game for smart TVs. The player captains a ship across a shared ocean using voice commands. The world never stops: when the player logs off, AI agents assume command of their ship, making real decisions — trading, navigating, fleeing from danger. When the player returns, they receive a spoken debrief from their first mate and take the helm again.

The core innovation is not the voice input — it is the **living, persistent world with AI agency**. Voice is the interaction method that makes commanding a crew feel natural on a television. The async AI simulation is the reason players return daily: to discover what happened while they were away, and to steer their ship's story forward.

**Design pillars:**

1. **Persistence with consequence.** The world ticks forward whether you play or not. Your choices (and your AI's choices) have lasting effects on your ship, crew, reputation, and the shared ocean.
2. **Tension through scarcity.** Supplies drain, storms brew, rivals lurk. Every voyage is a gamble between risk and reward. The player makes decisions under pressure, not in a vacuum.
3. **Voice-native commanding.** Speaking orders to a crew feels right. The game talks back through synthesised crew voices. No reading walls of text from across the room.
4. **Respect the player's time.** A satisfying session takes 10–15 minutes. The game signals natural exit points, auto-saves continuously, and never punishes the player for stepping away.

---

## 2. Target Audience

### Persona 1: "Couch Commander" — The Casual Dad (35–50)

- **Who:** Owns a Fire TV Stick, watches football, plays the occasional mobile game but has given up on console gaming because he cannot commit 2-hour sessions.
- **Motivation:** Wants to feel like he is progressing in a game without the guilt of "wasting time." Checking in on his ship for 10 minutes feels productive, not indulgent. Checks the captain's log like he checks fantasy football scores.
- **Play pattern:** 1–2 sessions per day, 10–15 minutes each. Plays after the children go to bed or during half-time.
- **Friction points:** Will not tolerate voice commands that fail on first attempt. Will abandon the game if the debrief is dull or meaningless. Will not pay upfront for a TV game.

### Persona 2: "The Tinkerer" — The AI-Curious Enthusiast (25–40)

- **Who:** Works in tech or adjacent. Fascinated by AI agents. Enjoys optimising systems and seeing emergent behaviour.
- **Motivation:** The behaviour profile system is the game for this person. They want to tune their AI, test strategies, and observe how the shared world evolves.
- **Play pattern:** Longer sessions (20–30 minutes) when actively playing; frequent check-ins (under 5 minutes) to review AI decisions. Likely to play on phone as much as TV.
- **Friction points:** Frustrated if AI behaviour profiles are too shallow or if there is no way to see detailed logs. Wants transparency into AI decision-making, not a black box.

### Persona 3: "The Family Pirate" — The Parent Playing With Kids (30–45)

- **Who:** Looking for something the whole family can do on the TV that is not another streaming show. Children aged 6–12.
- **Motivation:** Shared experience. Children shout commands, parent navigates decisions. The pirate theme is inherently family-friendly.
- **Play pattern:** Weekend sessions, 15–20 minutes, with children co-piloting vocally. Weekday check-ins solo.
- **Friction points:** Multiple voices confusing the microphone. Content must be appropriate — no graphic violence, no adult themes. If the game penalises them harshly while offline, children will be upset.

### Content Rating

The game targets an **E10+ (Everyone 10 and older)** rating. Combat is implied through cannonball impacts, splash effects, and ship damage — no blood, no death animations, no graphic violence. Crew "casualties" are framed as injuries requiring rest, not deaths. Pirate themes (treasure, rivalry, adventure) are presented in a family-friendly register.

---

## 3. Core Game Loop

### Minute-to-Minute (Active Play)

The player sails a ship across an ocean where **resources constantly drain** — food, water, gunpowder, and crew morale deplete during every voyage. This creates a ticking clock that makes every journey a gamble.

The ocean is not passive. Events are **telegraphed, not random**: smoke on the horizon signals a battle, dark clouds signal a storm, a fleet of sails signals danger or opportunity. The player sees what lies ahead and **chooses** to engage, avoid, or prepare. Every encounter is a decision, not something that simply happens to the player.

Navigation itself involves decisions. The world contains **chokepoints** (narrow straits where pirates lurk), **trade winds** (currents that speed travel in one direction), and **dangerous waters** (higher reward, faster supply drain). "Sail north" is an action; "Do I take the pirate strait or the long safe route around the cape?" is a decision.

**Micro-events every 30–60 seconds** ensure the ocean never feels empty: dolphins alongside the hull, a distant whale breach, floating wreckage, a crew member calling out a sighting, shifting weather. These are brief flavour moments that maintain the sense of a living world.

### Session-to-Session

Each session begins with the **captain's log debrief** — the first mate speaks a summary of what happened while the player was away. The debrief includes **deferred decisions**: situations where the AI marked a choice as too important to make autonomously. The player spends their first 2–3 minutes making these choices, which makes the return feel like a captain resuming command rather than reading a newspaper.

Between sessions, the player's ship continues sailing under AI control. The AI follows the player's configured behaviour profile and logs all significant events. Outcomes are **net-positive more often than not** (70/30 positive-to-negative ratio), so returning to the game feels rewarding rather than punishing.

### Week-to-Week

Long-term engagement comes from multiple overlapping progression systems:

- **Ship progression:** Upgrading through ship classes, unlocking new capabilities
- **Crew progression:** Named crew members levelling up, personal quests resolving
- **Map completion:** Filling in a personal chart of the ocean, discovering named islands
- **Story arcs:** A main questline revealing world lore, plus faction-specific quest chains
- **Seasonal events:** Time-limited content aligned with the battle pass (ghost ships, treasure hunts, kraken appearances)
- **Reputation:** A visible captain's rank that shapes how the world reacts to the player

Without these systems, there is no reason to play in week three that did not exist in week one. They are not optional features — they are load-bearing for retention.

---

## 4. Voice Interaction Design

### Command Categories

**Navigation**
- "Sail north" / "Head east" / "Turn hard to port"
- "Set course for Port Havana" / "Head to that island"
- "Drop anchor" / "Full sail" / "Dead slow"

**Crew Orders**
- "Fire cannons" / "Raise the sails" / "Repair the hull"
- "Send a boarding party" / "Load the cargo" / "Man the pumps"

**Conversational (Queries)**
- "What's our supplies looking like?" / "How's crew morale?"
- "Tell me about that island" / "Read me the captain's log"
- "What happened while I was away?"

**Strategic/Planning**
- "Set behaviour to cautious while I'm away"
- "Avoid combat" / "Prioritise trading"
- "Continue current objective" / "Return to nearest port"

**Social/Multiplayer**
- "Hail that ship" / "Offer to trade" / "Signal surrender"

**Meta**
- "Open the map" / "Show my inventory" / "What are my current objectives?"
- "Save and quit"

### Edge Cases

**Ambiguous referents.** "Head for that island" — when multiple islands are visible, the system enters a disambiguation loop. Navigator responds: "There are two islands to the east — the large one with the volcano, or the small cove?" The player clarifies by voice. If no clarification within 5 seconds, the navigator asks again. After two failed attempts, the D-pad menu highlights the options visually.

**Contradictory commands.** "Fire cannons" while in port. "Raise sails" while sails are already raised. These produce graceful crew responses: "We're in port, Captain — no targets to fire upon." Never error states, always in-character dialogue.

**Compound commands.** "Sail to the nearest port and sell all our sugar." The system decomposes multi-step instructions into a command queue. The navigator confirms: "Setting course for Port Havana. I'll remind you to sell the sugar when we dock." If decomposition fails, the system executes the first recognised command and asks for clarification on the rest.

**Command queuing.** Commands issued while the previous one is executing are queued. "Turn to port, then fire cannons" is two commands executed sequentially. The crew acknowledges the queue: "Coming about... ready to fire on your mark."

### Confidence Thresholds

Voice recognition uses Deepgram Nova-2 with a **custom vocabulary model** trained on the game's command set ("port," "starboard," "cannons," "anchor" receive boosted recognition priority).

- **Confidence >= 0.7:** Execute the command immediately. Crew confirms verbally.
- **Confidence 0.5–0.7:** Disambiguation menu. "Did you mean 'fire cannons' or 'find cannons'?" Displayed on screen and spoken aloud. Player confirms by voice or D-pad.
- **Confidence < 0.5:** Ignore the input. First mate says: "Didn't catch that, Captain. Say again?"

**Voice command retry rate** above 20% on any platform is treated as a P0 bug.

### Intent Parsing Pipeline

- **v1: Keyword-matching system with command templates.** A list of ~50 command patterns (regex + keyword matching). "Sail [direction]", "Fire [target]", "Head for [place]". No LLM, no ML classifier. Fast (<50ms), deterministic, runs client-side.
- **v1.1: Lightweight intent classifier** (fine-tuned small model or Deepgram's built-in intent detection) for natural language understanding.
- **Latency budget for intent parsing in v1:** <50ms (keyword matching is essentially instant).
- **Fallback:** If no command matches, show the top 3 closest matches as a disambiguation menu.

### Voice Latency Budget

| Step | Target (ms) | Notes |
|------|------------|-------|
| Mic capture + encoding | 50 | Push-to-talk button press to first audio packet |
| Network to Deepgram | 50 | WebSocket, already connected |
| Deepgram streaming transcription | 300–500 | Partial results arrive during speech; final result ~300ms after speech ends |
| Intent parsing (keyword match) | <10 | Client-side regex/keyword matching |
| Game state update | <50 | VGF dispatch |
| Response text generation | <10 | Template lookup |
| Audio feedback start | 100 | Sound effect trigger or TTS start |
| **Total** | **570–770ms** | Within 800ms budget |

Note: The 800ms target is from mic-button-release to audible crew acknowledgement. Deepgram's streaming mode returns partial transcripts during speech, so intent parsing can begin before the player finishes speaking.

### TTS Feedback (Voice Output) [v1.1]

Synthesised voice responses are a **hard requirement** for the full experience, not optional. A voice-commanded game on a television viewed from 3 metres away cannot rely on text alone. The crew must speak back. **Full TTS is implemented in v1.1.** See below for the v1 experience.

- **First Mate:** [v1.1] High-quality TTS (ElevenLabs Turbo or equivalent). This is the voice heard most often — debriefs, confirmations, key narrative moments.
- **Other crew roles** (Navigator, Gunner, Quartermaster, Lookout, Cook): [v1.1] Each has a distinct voice profile (pitch, speed, accent) using cost-effective TTS. Distinct enough to identify the speaker without looking at the screen.
- **Story NPCs** (merchants, governors, quest-givers): [v1.1] Higher-quality TTS reserved for narrative moments.
- **Background crew chatter:** [v1.1] Browser-native speech synthesis for incidental flavour ("Land ho!", "Storm's passing, Captain").

All voice output is accompanied by **subtitles** (see Accessibility, section 17).

### Audio Ducking

When the mic button is pressed, the game **hard-mutes all audio** — not volume reduction, full mute. This is non-negotiable for voice recognition accuracy in living rooms where TV speakers feed back into remote microphones. Audio resumes smoothly after the voice command is processed.

---

## 5. Session Flow

### Onboarding — First 5 Minutes ("The Storm")

New players experience a scripted tutorial that teaches voice commands through urgency, not UI tooltips.

**Minute 0–1: The Storm.**
Cold open. No menus, no settings screens. The player's ship is caught in a storm — waves, lightning, rain. The First Mate shouts [v1.1 TTS; v1: on-screen text + alert sound]: "Captain! We need your orders! Say 'turn to port' or 'turn to starboard'!" If the player is silent for 5 seconds, the First Mate says: "Captain? Press the mic button on your remote and tell us what to do!" A single visual prompt shows the remote's mic button, displayed once.

**Minute 1–2: Surviving the Storm.**
Two more commands taught through crew requests [v1.1 TTS; v1: on-screen text + sound effects]: "Raise the sails!" and "Brace for impact!" The storm clears. The ship is damaged but afloat. The player has now used three voice commands without seeing a tutorial tooltip.

**Minute 2–3: The First Island.**
The Lookout calls out [v1.1 TTS; v1: on-screen text + lookout sound effect]: "Land ho! Island to the east, Captain!" The Navigator says: "Shall we head for it? Say 'sail east' or tell me where you'd like to go." The player sails to the island — navigation commands taught.

**Minute 3–4: First Encounter.**
A short, self-contained island encounter: a merchant offering supplies. Branching voice choice: trade or refuse. This teaches conversational commands and the island mission loop.

**Minute 4–5: The Log-Off Hook.**
The First Mate says [v1.1 TTS; v1: on-screen text + sound effect]: "Captain, we'll keep watch while you rest. I'll keep a log of everything that happens." This explicitly teaches the AI agent system. The player accepts the default behaviour profile (cautious). The game saves. The hook is planted: come back tomorrow to see what your AI did.

**Key principles:** Zero UI tutorials. All teaching through diegetic crew dialogue. Progressive disclosure — crew management, trading, and ship upgrades are not taught in the first session. The D-pad fallback menu is discoverable but not shown during onboarding.

> **v1 Voice Output Experience:** In v1, crew responses appear as on-screen text with distinctive sound effects per crew role. The First Mate's debrief uses pre-recorded audio clips for key phrases ("Welcome back, Captain", "While you were away...") combined with text for specific details. Full TTS is added in v1.1.

### Typical Session — 12 Minutes

**0:00–0:30 — Login and Debrief.**
The game loads to the ship. The First Mate speaks [v1.1 TTS; v1: pre-recorded key phrases + on-screen text for details]: "Welcome back, Captain. You were away for 14 hours. We made port at Isla Verde and sold the sugar — good price, 120 gold. On the return trip, we were shadowed by a brigantine flying black colours, but she didn't engage. We're currently anchored off the Amber Shoals. Supplies are at 60%."

The screen shows a stylised captain's log timeline with key events highlighted. The player can drill into details: "Tell me more about that brigantine" or skip: "What's next?"

**0:30–2:00 — Deferred Decisions.**
The AI queued a decision: "Captain, we spotted a derelict ship while you were away. We marked its position but didn't investigate. It's half a day's sail northeast. Your orders?"

Player: "Set course for the derelict."
Navigator: "Aye, northeast it is. Should take about four minutes at full sail."

**2:00–5:00 — Sailing (with micro-events).**
- 2:30: Lookout spots dolphins. Flavour moment. Crew morale ticks up.
- 3:15: Another player's AI ship visible on the horizon — a merchant vessel. Player: "Ignore it. Eyes on the prize."
- 4:00: Weather shifts. Dark clouds. "Captain, storm brewing to the north. We can sail through or go around. Going around adds two minutes." Player: "Straight through. Reef the sails."

**5:00–5:30 — Storm Event.**
Quick action sequence. Ship rocks. Waves crash. Rapid commands: "Hard to starboard!" "Secure the cargo!" "Man the pumps!" Each has a visible effect. Minor hull damage sustained.

**5:30–8:00 — Derelict Encounter (Mission).**
Arrive at the derelict. Camera shifts closer. The ship is listing, sails torn. First Mate: "She looks abandoned, Captain. But there could be anything aboard." Player: "Send a boarding party. Quartermaster, take three men."

Quartermaster reports back: "Captain, the hold is full of silk — worth a fortune. But we found something else. Scratch marks on the walls. Something was kept in a cage down here, and it got out."

Player: "Take the silk. Get everyone back aboard. Now."

Silk loaded. A story flag is set — whatever was in that cage becomes a future encounter across multiple sessions.

**8:00–10:00 — Return Voyage.**
Player: "Set course for Port Havana. We'll sell this silk." The player uses the quieter voyage for crew management. "How's the crew?" / "Young Thomas has been practising with the cannons." / "Promote Thomas to junior gunner."

**10:00–11:30 — Port Arrival and Trading.**
Dock scene. "Sell all the silk." — Merchant: "Fine silk! 340 gold." — "That's robbery. 500." — "You drive a hard bargain. 420, final offer." — "Done." Hull repairs: "80 gold, Captain." — "Do it."

**11:30–12:00 — Logout.**
"Set behaviour to cautious. Avoid combat. Continue trading along this route." First Mate: "Understood, Captain. We'll keep her safe." Player logs out. AI takes over.

### Return Flow

1. Player logs in.
2. First Mate delivers a spoken summary of offline events (skimmable in under 60 seconds via a visual timeline).
3. **Deferred decision queue** is presented — situations the AI flagged as too important to decide autonomously. Player resolves 1–3 queued decisions through voice dialogue.
4. Player takes command from wherever the AI left the ship.

For players returning after **extended absence** (7+ days): the First Mate delivers an aggressive summary (top 3 events only), offers a "skip to now" option, and gently re-teaches key commands. "It's been a while, Captain. Remember, you can say 'open the map' to see where we are."

### Natural Exit Points

The game signals when a "chapter" is complete — after finishing an island mission, after the debrief, after docking at port. A gentle "Your crew has the helm" message appears. The game never traps the player in open-ended sailing with no closure point.

**Auto-save is continuous.** TV apps get killed without warning (user switches to Netflix, Alexa interrupts, remote battery dies). There is never a manual "save" action.

---

## 6. World Design

### The Ocean

The ocean is a **bounded, shared persistent space** — not infinite. At launch, the world is a curated region (approximately 50×50 grid tiles) containing enough islands for 30–40 hours of exploration before repetition. The ocean is shared: all players exist in the same world.

**Soft boundaries:** There are no invisible walls. Sailing toward the edge, the sea grows rougher, supplies drain faster, and encounters become more dangerous. Eventually, a **wall of storms** makes further progress impractical without a fully upgraded ship and maximum supplies. This creates a natural expansion frontier — as players upgrade, they push further. Post-launch content updates expand the map.

**Navigation features:**
- **Chokepoints:** Narrow straits where pirates lurk, offering faster transit at higher risk.
- **Trade winds:** Persistent ocean currents that speed travel in one direction. Sailing with the wind is fast; sailing against it is slow and costly.
- **Dangerous waters:** High-reward zones (rare resources, legendary encounters) with faster supply drain and tougher enemies.
- **Safe zones:** Waters near starting areas and major ports are protected — no AI-initiated combat within a defined radius.

### Islands

Each island is a self-contained mission area. Islands are visually distinct across **5 biome types at launch** (tropical, volcanic, frozen, ruins, port town), expanding to 8 post-launch (adding swamp, desert, forested).

| Element | Description |
|---------|-------------|
| **Resources** | Supplies, trade goods, ship materials, crew recruits |
| **Story encounters** | Branching narrative scenes resolved through voice choices |
| **Combat** | Ship-to-ship battles on approach, on-island skirmishes |
| **Secrets** | Hidden locations, buried treasure, lore fragments |

Island missions are instanced — the player sails to an island, the mission plays out, they return to the open ocean with rewards or consequences.

### Weather System

Weather is a persistent, visible system — not a random event toggle.

- **Clouds gather** before storms, giving the player time to decide: push through or shelter.
- **Wind direction and strength** affect sailing speed. Smart captains read the weather.
- **Rain and fog** reduce visibility — islands and ships cannot be spotted until close.
- **Storms** are navigable events requiring rapid voice commands (see session flow).
- Weather affects combat effectiveness (rain reduces cannon accuracy, fog enables ambushes).
- Weather is server-simulated and shared across the world — all players experience the same weather in the same region.

### Day/Night Cycle

A full day/night cycle runs on a compressed schedule (1 in-game day = approximately 20 minutes of real time).

- **Day:** Full visibility, normal encounters, active trade at ports.
- **Dusk/Dawn:** Atmospheric transitions. Lookout calls out the sunset/sunrise.
- **Night:** Visibility drops significantly. Islands and ships are harder to spot. Pirates prefer to attack at night. Night sailing is riskier but faster (less traffic, more direct routes). The player can choose to "Drop anchor until dawn" — a decision that costs time but reduces risk.

The cycle adds a natural rhythm to gameplay and enriches voice interactions ("Lookout, what can you see?" has different answers at night versus day).

---

## 7. Ship & Crew

### Ship Classes

Ships progress through six classes, each unlocking new capabilities:

| Class | Unlock | Crew Capacity | Cargo Hold | Cannons | Speed | Notes |
|-------|--------|---------------|------------|---------|-------|-------|
| **Dinghy** | Start | 3 | 10 | 0 | Slow | Tutorial vessel |
| **Sloop** | Story mission | 8 | 30 | 4 | Medium | First real ship |
| **Brigantine** | Level + gold | 15 | 60 | 8 | Fast | Glass cannon |
| **Frigate** | Reputation + gold | 25 | 100 | 16 | Medium | Balanced |
| **Galleon** | Faction quest | 40 | 200 | 24 | Slow | Trade powerhouse |
| **Man-of-War** | Endgame quest | 60 | 150 | 36 | Medium | Combat flagship |

### Ship Upgrades

Within each class, the player upgrades individual components:

- **Hull:** Wooden → reinforced → ironclad. Affects damage resistance.
- **Sails:** Canvas → silk → enchanted. Affects speed and wind utilisation.
- **Cannons:** Bronze → iron → steel. Affects damage and range.
- **Cargo hold:** Expanded storage tiers. Affects carrying capacity.

### Ship Customisation (Cosmetic)

The ship is the player's avatar. Cosmetic options (primary monetisation vector):

- Hull colour and material
- Sail design (pattern + colour)
- Figurehead selection
- Flag design
- Cabin interior (trophy display from adventures)
- Named ship (visible to other players in encounters)

### AI Crew

Crew members are **named NPCs with distinct personalities** who level up through experience.

**Crew Roles:**

| Role | Function | Voice Interaction |
|------|----------|-------------------|
| **First Mate** | Debriefs, manages crew, tutorial voice | Most frequent speaker. Highest TTS quality. |
| **Navigator** | Course-setting, weather reports, map info | "Navigator, what's ahead?" |
| **Gunner** | Combat commands, weapon management | "Gunner, target their masts" |
| **Quartermaster** | Supplies, cargo, trading | "Quartermaster, what have we got to trade?" |
| **Lookout** | Sighting reports, early warnings | "Lookout, what can you see?" |
| **Cook** | Morale management, ration distribution | "Cook, how are the supplies holding up?" |

**Crew Progression:**
- Crew members gain experience through their role activities. A gunner who survives 20 battles becomes a master gunner with improved accuracy.
- Crew members have **personal quests** that span multiple sessions: the navigator wants to find the island where her father was lost; the cook has a bounty on his head.
- **Crew casualties are injuries, not deaths** (E10+ rating). Injured crew need rest and recovery time at port. A crew member lost overboard can be rescued at a later island.
- Crew morale affects performance. Low morale leads to slower work, missed shots, and eventually mutiny events. Morale is managed through shore leave, rations, pay, and successful voyages.
- Crew can be recruited at ports. Each recruit has randomised stats and a personality trait that affects their dialogue and behaviour.

---

## 8. Mission Design

Island missions combine resource gathering, story encounters, and combat into concrete, voice-driven experiences. Each mission takes 3–8 minutes.

### Mission 1: The Cursed Cargo

Arrive at a small island to resupply. The harbourmaster reports a merchant ship ran aground on the reef — cargo is free for the taking, but locals say it is cursed. Sail to the wreck site.

**Voice choice:** "Salvage the cargo" or "Leave it be."

Salvaging yields valuable trade goods but drops crew morale (superstitious sailors). Over the next three voyages, "curse" events occur — storms, rats in the hold. A priestess on another island can lift the curse, or the player rides it out.

**Voice moment:** Quartermaster: "Captain, the men are uneasy about this cargo. Some talk of throwing it overboard." Player: "Tell them to hold steady" or "Dump the cursed lot."

### Mission 2: The Blockade Runner

A frequented port is under blockade by a rival faction's fleet — three warships patrol the entrance. The governor offers 500 gold and a permanent trade discount to break the blockade.

**Three approaches:**
- **Assault:** "All hands to battle stations." Full broadside combat encounter.
- **Stealth:** "Helmsman, find me a gap in their patrol." Night-time stealth run requiring timed voice commands: "Dead slow... hold... now, full sail!"
- **Diplomacy:** "Signal the lead ship — I want to parley." Conversation tree with the blockade commander.

Each path has different risks, rewards, and consequences for faction reputation.

### Mission 3: The Mutiny

Triggered when crew morale has been low for multiple sessions. The First Mate reports three crew members are planning a mutiny.

**Voice interaction:** Interrogate suspects one by one. "Bones, look me in the eye. Are you loyal?" Each responds differently based on personality. The player decides who to punish, who to forgive, and whether to address the underlying grievance (shore leave, better rations, a pay rise).

Wrong choices trigger the mutiny — lost crew and severe morale damage. Correct choices permanently increase crew loyalty.

### Mission 4: The Treasure Map

A torn map fragment found in a bottle shows half an island with an X. The other half is held by another player's AI ship (or an NPC). The player must track them down and trade for it, steal it, or convince them to partner up.

With both halves, navigate to a hidden island using voice directions from the map: "Sail between the twin rocks, then follow the setting sun until you see the dead tree."

The treasure is guarded — combat encounter. Reward: rare ship upgrade component.

### Mission 5: The Stowaway

After leaving port, the Lookout reports a stowaway hiding in the cargo hold. Voice conversation reveals a runaway from a powerful merchant family.

**Three choices:**
- **Return them** for a reward (and make an enemy of their family in the long term).
- **Keep them as crew** (unique skill, but their family sends bounty hunters in later sessions — recurring consequence).
- **Drop them at the next island** (neutral outcome).

This mission demonstrates consequences that span multiple play sessions.

---

## 9. Offline AI Simulation

### Behaviour Profiles

Before logging off, the player sets their AI behaviour profile through voice:

| Profile | Navigation | Combat | Trading |
|---------|------------|--------|---------|
| **Cautious** (default) | Stick to safe routes | Flee from all threats | Sell at fair prices, buy only necessities |
| **Aggressive** | Seek encounters | Engage when odds favour | Opportunistic trades |
| **Trading** | Route between profitable ports | Flee always | Buy low, sell high — maximise profit |
| **Hold Position** | Anchor at nearest safe port | N/A | N/A — ship waits for the captain |

Additionally, the player can set a **mission priority**: "Continue current objective," "Return to nearest port," or "Free roam within the local region." If the player was mid-quest, the AI continues that quest rather than wandering off.

### AI Decision Authority

**The AI decides autonomously:**
- Routine navigation (continue on set course, avoid obstacles)
- Basic trade execution at ports along the route
- Flee from encounters where the ship is outmatched
- Accept low-risk quests at ports
- Manage crew morale (distribute rations, make port stops)
- Minor resource expenditure (resupplying at ports)

**The AI defers to the player (queued for return):**
- Accepting high-risk missions
- Engaging in combat when the outcome is uncertain
- Spending large amounts of gold or rare resources
- Abandoning the current course for a new destination
- Any story-critical branching decisions
- Encounters with other players' ships that are not clear flee-or-trade situations

### Diminishing Returns

Offline consequences follow a **diminishing returns curve** to prevent punishment for extended absence:

| Time Offline | Simulation Intensity |
|-------------|---------------------|
| 0–4 hours | Full simulation. Normal event frequency, normal consequences. |
| 4–12 hours | Reduced event frequency. AI becomes more cautious regardless of profile. |
| 12–24 hours | Minimal events. Ship gravitates toward safe ports. |
| 24 hours–7 days | Ship docked at a safe port. Only minor events (crew chatter, small passive trades). |
| 7+ days | **Inactivity anchor.** Ship anchored at safe port, simulation paused. No further events generated. |

This ensures casual players logging in once daily get a manageable debrief (4–8 events), while preventing runaway consequences for players who step away for a week.

### Outcome Bias

Offline outcomes are biased toward the positive at a **70/30 ratio** (positive to negative). The AI finds resources, discovers islands, and completes successful trades more often than it loses battles or cargo. The game rewards the player for returning, never punishes them for leaving.

**Irreversible outcomes are forbidden.** Crew members are injured, not killed. Ships are damaged, not destroyed. Cargo is lost, not all of it. The player always has a viable path forward upon return.

---

## 10. Async Multiplayer

### Shared Ocean

All players exist in the same persistent ocean. When a player is offline, their AI-controlled ship continues sailing, trading, and encountering other ships. The world feels populated because it genuinely is — every ship on the horizon belongs to a real player (or is a clearly marked NPC vessel).

### Encounter Resolution

When two ships (AI or player-controlled) enter proximity:

1. **Server arbiter** determines the encounter based on both ships' behaviour profiles, ship stats, crew quality, and faction standings.
2. Encounters are resolved using a **seeded pseudo-random number generator** — given the same ship stats, crew quality, behaviour profiles, and world tick number as seed, the same outcome always results. This ensures encounter logs are reproducible for debugging and dispute resolution, while still allowing varied outcomes between different encounters.
3. Possible outcomes: trade (both benefit), flee (one or both disengage), combat (resolved through stat comparison and profile settings).
4. **AI-vs-AI combat** is resolved in a single tick. Neither ship is destroyed. Cargo, crew health, and reputation can change hands. Both players receive a captain's log entry.
5. **Player-vs-AI combat** (active player encounters another player's offline ship) gives the active player a significant advantage — they can make tactical decisions the AI cannot.

### Griefing Prevention

- **Level-matched encounters.** Ships only encounter others within a power band. A galleon does not attack a dinghy.
- **Safe zones.** No AI-initiated combat within a defined radius of starting areas and major ports.
- **Diminishing returns on repeated attacks.** If Ship A attacks Ship B twice within 24 hours, the second encounter is auto-resolved as a draw.
- **Bounty system.** Aggressive players accumulate a bounty. NPC navy ships hunt high-bounty players. This creates a natural check on piracy without removing it as a playstyle.
- **Offline combat caps.** A ship can only lose a maximum of 20% of its cargo and suffer moderate damage per offline period. No waking up to an empty hold.

### Faction System

Four factions shape the world's politics and the player's identity:

| Faction | Playstyle | Benefits | Penalties |
|---------|-----------|----------|-----------|
| **Merchant Guild** | Trade-focused | Better prices at guild ports, cargo insurance | Penalised for piracy, higher bounty accumulation |
| **Pirate Brotherhood** | Raiding-focused | Better loot from combat, access to pirate hideouts | Hostile at lawful ports, hunted by navy |
| **Royal Navy** | Order-focused | Navy escort missions, access to military upgrades | Must enforce law, cannot trade with pirates |
| **Free Traders** | Opportunistic | Welcome everywhere, no faction penalties | No faction-specific benefits, lower maximum reputation |

Faction reputation is earned through actions (completing faction missions, trading at faction ports, attacking faction enemies) and lost through opposing actions. Faction determines how NPC ships and ports react to the player, unlocks faction-specific ship classes and crew, and provides long-term identity.

**Launch scope:** Factions exist as a reputation system with NPC reactions and trade modifiers. Player-to-player faction mechanics (alliances, faction wars) are deferred to v2.

### Social Features (Incremental)

- **v1:** One-off encounters only. Trade, fight, or ignore. Other players' ships display their captain name, ship name, customisation, and reputation score. Post-encounter messages use a **pre-canned message system** in v1 — players select from 10–15 predefined messages ("Good fight!", "Fair winds, Captain", "You got lucky", "See you on the seas"). No free-text input. Free-text messaging with a profanity filter and report system is deferred to v2.
- **v1.1:** Players can mark each other as allies. Allied AIs cooperate when they meet — share information, offer assistance, avoid combat.
- **v2:** Player factions/guilds. Shared territory, faction wars, co-op missions. Players can leave messages at islands ("Captain Blackbeard was here — beware the northern passage").

---

## 11. Progression & Retention

### Ship Progression (Primary)

Six ship classes (see section 7) with upgrades within each class. Each ship class unlocks new capabilities: more cannons, larger cargo hold, faster speed, access to more dangerous waters. Upgrading from sloop to brigantine is a milestone that takes approximately 1–2 weeks of daily play.

### Crew Progression (Emotional Hook)

Named crew members level up through experience. A gunner who survives 20 battles becomes a master gunner. Crew members have personal quests that resolve over multiple sessions, creating emergent stories the player cares about. Losing a high-level crew member to injury (requiring weeks of recovery) motivates careful play.

### Map Progression (Exploration Drive)

A personal map fills in as the player explores. Percentage completion is visible. Named islands the player has discovered appear on their chart. **First discovery bonuses:** if the player is the first to find an island, it bears their name on the shared map. This creates a persistent legacy in the world.

### Story Arcs (Long-Term Engagement)

- **Main questline:** 10–15 chapters revealing the lore of the world. Completable over approximately 2 months of regular play.
- **Faction questlines:** Each faction has a 5–8 mission quest chain unlocking faction-specific ships and crew.
- **Recurring consequences:** Decisions in early missions create ripple effects in later ones (the stowaway's family, the creature from the derelict, the cursed cargo).

### Seasonal Content

Aligned with the battle pass (see Monetisation). Each season (6–8 weeks) introduces:
- A themed event (ghost ships in October, treasure hunt in summer)
- New island encounters (2–3 per season)
- New cosmetic rewards on the pass track
- A seasonal leaderboard

### Leaderboards

Weekly leaderboards for: most gold earned, most islands discovered, most ships defeated, longest voyage. A visible **Captain's Reputation rank** that other players see during encounters.

### Endgame

Players who reach maximum ship class and high reputation unlock:
- **Frontier zones:** Increasingly difficult waters at the edge of the known map with legendary encounters and rare resources.
- **Prestige system:** Optional reset of ship class (keeping cosmetics) for a prestige badge and bonus to passive AI trading income.
- **Competitive seasons:** Time-limited challenges with exclusive rewards for top-ranked captains.

---

## 12. Monetisation

**Model: Free-to-play with Battle Pass and rotating cosmetic shop.**

### Free Tier
- Full game access: all gameplay systems, all islands, all missions, all ship classes.
- Basic ship cosmetics (default hull, sails, flag).
- Basic crew appearance.

### Season Pass (£4.99 per season, 6–8 weeks)
- Premium cosmetic ship customisation (hull skins, sail designs, figureheads).
- Crew outfit sets.
- Exclusive captain's log visual themes.
- Sea shanty packs (ambient music variants).
- Exclusive seasonal island encounters (gameplay-light, cosmetic-reward-heavy).
- Enhanced AI behaviour profile options (additional profile slots, not stronger AI — convenience, not power).

### Cosmetic Shop (Rotating Weekly)
- Ship figureheads: £0.99–£1.99
- Flag designs: £0.99
- Crew hats and outfits: £0.99–£1.99
- Hull paint jobs: £1.99–£2.99

The shop is deliberately small (5–8 items at a time) and navigable by voice or D-pad in under 30 seconds. No browsing-heavy storefront.

### Hard Rules
- **No pay-to-win.** Never sell resources, combat advantage, ship stats, crew stats, or anything that affects gameplay balance.
- **No paying to undo offline damage.** No "insurance" microtransaction.
- **No loot boxes.** All purchases show exactly what the player receives.
- **No energy systems or play-gating.** The game is always playable.

### TTS Cost Model

- ElevenLabs Turbo: ~£0.15 per 1,000 characters.
- Estimated characters per session: ~800 (First Mate debrief ~300, crew confirmations ~200, story dialogue ~300).
- **Cost per session: ~£0.12**
- At 10K DAU with 1.5 sessions/day: ~£1,800/month in TTS costs.
- **Mitigation:** Use ElevenLabs only for the First Mate and story NPCs. Use browser-native SpeechSynthesis API (free) for routine crew confirmations ("Aye, Captain", "Coming about"). This reduces per-session ElevenLabs characters to ~400, halving the cost to ~£0.06/session (~£900/month at 10K DAU).
- **Fallback:** If TTS costs exceed £3,000/month, shift more lines to browser-native synthesis and reserve ElevenLabs for story-critical dialogue only.
- **v1 has no TTS cost** — crew responses are text + sound effects.

### Platform Revenue Share
Fire TV, Samsung, and LG all take 30% revenue share. All purchases use the platform's native IAP SDK (Amazon IAP on Fire TV, Samsung Checkout on Tizen, LG Content Store on webOS). No custom payment systems.

---

## 13. Platform & Technical

### Target Platforms

| Platform | Input | Mic Source | Launch Phase |
|----------|-------|------------|-------------|
| **Fire TV** (Stick 4K and above) | TV remote (D-pad + mic button) | Remote hardware mic | **v1** |
| **Samsung Tizen** (2020+ models) | TV remote | Remote hardware mic | v1.1 |
| **LG webOS** | TV remote + Magic Remote pointer | Remote hardware mic | v1.1 |
| **Phone (any)** | Touch + mic button | Phone mic | v1.1 |

The phone is an alternative controller only, not a companion screen.

**v1 is Fire TV only.** This is the largest install base with the best-understood mic behaviour. If the game works on Fire TV (the most constrained platform), it will work everywhere.

### Performance Budgets

| Metric | Target | Hard Limit |
|--------|--------|------------|
| Frame rate | 30fps stable | Never below 24fps |
| Triangles on screen | 30K typical | 50K maximum |
| Draw calls (ocean scene) | 8 typical | 10 maximum |
| Point lights | 3 typical | 5 maximum |
| Texture memory | 64MB | 96MB |
| Initial load time | Under 8 seconds | Under 12 seconds |
| Voice command round-trip | Under 800ms | Under 1200ms |

### Technology Stack

- **Rendering:** Three.js / React Three Fiber for 3D rendering in TV web views.
- **Browser target:** Chrome 68+ (Fire TV Silk). WebGL 1.0 only — no WebGL 2.0 features.
- **Art style:** Stylised low-poly with strong colour palettes. Invest art budget in water shaders (Three.js excels here) and lighting, not high-poly models. Reference: *Townscaper*, *Poly Bridge*.
- **Speech-to-Text:** Deepgram Nova-2 via WebSocket streaming. Linear16 PCM audio. Push-to-talk only — no always-listening mode.
- **TTS:** ElevenLabs Turbo for primary voices (First Mate, story NPCs). Browser-native SpeechSynthesis API for background crew chatter.
- **Server:** Tick-based batch simulation (see Architecture below).
- **State sync:** VGF 4.9.0 for real-time state sync during active play. `nextPhase` pattern for phase transitions.
- **Platform integration:** Volley Platform SDK for device identity, analytics, lifecycle. `MaybePlatformProvider` pattern for conditional TV wrapping.
- **Save:** Cloud-saved, continuous auto-save. Server-side authoritative state.

**Chrome 68 compatibility risk:** React Three Fiber depends on React 18+ which uses features that may not be fully supported on Chrome 68. **Mitigation:** v1 development begins with a compatibility spike in week 1 — a bare Three.js scene (no R3F) rendered on a physical Fire TV Stick 4K. If R3F fails on Chrome 68, fall back to raw Three.js with a thin React wrapper. Pin Three.js to r152 or earlier (last version with full WebGL 1.0 support). Pin React to 18.2.x (last version tested against older Chrome).

### Server Architecture

The offline simulation uses a **tick-based batch system**, not real-time per-ship simulation. This is the only architecture that scales to thousands of AI ships at reasonable cost.

- **World tick every 15 minutes.** Each tick: resolve ship movement, check for proximity encounters between ships, execute trades at ports, roll for events, log outcomes.
- **Lazy simulation.** Ships sailing across empty ocean with no nearby entities skip processing. Only ships that will generate a loggable event are fully simulated in each tick.
- **Event resolution is a decision table, not a full AI model.** A few weighted dice rolls per tick against the ship's behaviour profile and stats. The fidelity is sufficient for offline play — players will never watch the simulation in real time.
- **Login catch-up.** When a player logs in, their client reads the event log since last session and renders the debrief. No real-time replay of simulation.
- **Inactivity cap.** After 7 days of inactivity, the ship anchors at a safe port and simulation pauses. Server resources are not spent on abandoned ships.

### Platform-Specific Concerns

**Fire TV:**
- Fire TV Stick 4K is the minimum device. The basic Stick (1GB RAM) is dropped from the target.
- Amazon's mic button has variable UX (press-and-hold vs press-and-release depending on remote model). The game handles both.
- Certification requirements: no always-on microphone, proper Home button handling (save state immediately), Back button behaviour (no exit without confirmation on first press), Amazon content guidelines compliance.
- Alexa integration will cause accidental mic-focus stealing. The game handles the case where Alexa interrupts by pausing and resuming gracefully.

**Samsung Tizen (v1.1):**
- Minimum model year: 2020 (Chromium 76+). Older models (Chromium 56) are not supported.
- Higher percentage of D-pad-only users expected — the Samsung remote mic is less commonly used.
- Certification turnaround: 4–6 weeks. Plan accordingly.

**LG webOS (v1.1):**
- WebKit-based browser, not Chromium. Three.js rendering behaviour will differ — test early.
- Magic Remote pointer mode (like a Wii remote) is supported: pointer clicks on UI elements work alongside D-pad and voice.
- Microphone usage requires explicit user permission prompts that differ from Fire TV's model.

### VGF 4.9.0 Framework Summary

- VGF provides real-time state synchronisation between a Node.js server and React clients via Socket.IO.
- **Phase model:** The game defines phases (lobby, sailing, island, combat, captainLog, port). Each phase has `onBegin`, `endIf`, and `next` hooks. Phase transitions use the `nextPhase` pattern (a reducer sets `state.nextPhase`, the phase's `endIf` detects it, the phase runner transitions).
- **Reducers** are pure synchronous state transforms. **Thunks** are async operations that dispatch reducers.
- **WGFServer** is the production server class. It does NOT call `onConnect`/`onDisconnect` hooks and does NOT send Socket.IO acknowledgements.
- Full setup guide: see `BUILDING_TV_GAMES.md` in the repository root.

### Degraded State Handling

| Dependency | Failure Mode | Graceful Degradation |
|-----------|-------------|---------------------|
| Deepgram (STT) | API timeout or 5xx | Fall back to D-pad input. Show message: "Voice commands temporarily unavailable. Use your remote to navigate." Retry Deepgram every 30 seconds. |
| ElevenLabs (TTS) | API timeout or 5xx | Fall back to browser-native SpeechSynthesis for all voice output. Quality drops but functionality preserved. |
| VGF server | Connection lost | Show "Reconnecting..." overlay. VGF's built-in reconnection attempts (10 attempts, exponential backoff). If all fail: "Connection lost. Your crew will keep sailing. Come back later." Save last-known state locally. |
| Tick simulation server | Batch job fails | Ships freeze in place until next successful tick. No events generated for the failed period. Debrief skips the gap: "Quiet watch, Captain. Nothing to report." |

### Mic Input Abstraction

A `MicProvider` interface is implemented from day one, with platform-specific implementations. No platform-specific mic behaviour leaks into game logic.

---

## 14. Metrics & KPIs

### North Star Metric

**D7 retention.** If players do not return after a week, the async hook is not working. Everything else feeds into this.

### Critical Metrics

| Metric | Target (Month 3) | Target (Month 6) | Rationale |
|--------|-------------------|-------------------|-----------|
| DAU/MAU ratio | 20% | 30% | Measures habit formation. TV games typically 10–15%; async hook should push higher. |
| D1 retention | 40% | 50% | Did the first debrief bring them back? |
| D7 retention | 20% | 25% | Is the loop sticky? Make-or-break metric. |
| D30 retention | 10% | 15% | Long-term engagement. Above 10% is strong for TV. |
| Median session length | 8–12 min | 10–15 min | Under 5 min = debrief is not engaging. Over 20 min = no natural exit points. |
| Voice command success rate | 85% | 92% | Below 80% = players abandon voice for D-pad. Below 70% = core mechanic broken. |
| Voice vs D-pad usage ratio | 70/30 | 75/25 | If D-pad dominates, voice is not working. |
| Debrief engagement rate | 80% | 85% | Percentage listening to at least 50% of debrief. Low = debrief is dull. |
| Offline return rate | 60% | 70% | Of players who log off, what percentage return within 48 hours? Core loop metric. |
| Behaviour profile customisation rate | 15% | 30% | Engagement with AI tuning. Low = feature too hidden or shallow. |

### Anti-Metrics (Alarm Triggers)

- Session length over 30 minutes: players are lost, not engaged.
- Voice command retry rate over 20%: recognition is failing.
- Immediate log-off after debrief: transition to active play is broken.
- Offline outcomes predominantly negative: AI is too aggressive or world is too hostile.

---

## 15. MVP Scope

### v1 — Fire TV Only (Tests: "Do players return for the debrief?")

**Included:**
- Single platform: Fire TV Stick 4K
- Voice commands: navigation (5 commands), crew orders (4 commands), basic queries (3 commands)
- D-pad fallback for all commands
- Bounded procedural ocean (50×50 grid) with 5 island biome types
- 10 hand-crafted island encounters with branching voice choices
- Offline AI simulation with cautious-only default profile
- Captain's log debrief on return with spoken First Mate narration
- Ship upgrades: hull and cannons, 2 tiers each
- Single ship class (sloop) with upgrade path to brigantine
- AI ship encounters: trade or flee (no player-vs-player combat)
- Cloud save, continuous auto-save
- 30fps on Fire TV Stick 4K
- Basic sound design: ocean ambience, crew acknowledgements, combat effects
- Text + sound effects for crew responses (TTS deferred to v1.1)

**Cut from v1:**
- Samsung, LG, and phone platforms → v1.1
- Configurable AI behaviour profiles → v1.1 (default: cautious)
- TTS crew voice responses → v1.1 (v1 uses text + sound effects)
- Named crew with personalities and personal quests → v1.1 (generic crew)
- Crew morale system → v1.1
- Ship-to-ship combat with player ships → v2
- Faction system → v1.1 (reputation only), v2 (full factions)
- Alliances and direct player-to-player interaction → v2
- Cosmetic ship customisation → v1.1
- Battle pass and monetisation → v1.1
- Weather system (beyond storms as events) → v1.1
- Day/night cycle → v1.1
- Sea monsters → v1.1
- Player housing/base → v2

### v1.1 — Multi-Platform + Depth

- Samsung Tizen and LG webOS support
- Phone controller app
- TTS crew voices (ElevenLabs integration)
- Named crew with personalities and levelling
- Crew morale system
- Configurable AI behaviour profiles (cautious, aggressive, trading, hold position)
- Weather system and day/night cycle
- Faction reputation system with NPC reactions
- Cosmetic ship customisation
- Battle pass (Season 1)
- 3 additional ship classes (frigate, galleon unlocked)
- 10 additional island encounters
- Ally marking between players

### v2 — Social + Endgame

- Ship-to-ship combat with other players' ships
- Full faction system with faction wars
- Player guilds/alliances
- Co-op missions
- Player housing (home port)
- Prestige system
- Competitive seasons
- Man-of-War ship class
- Player-created Captain's Challenges (lightweight UGC)
- Map expansion beyond initial bounds

### The v1 Test

Launch on Fire TV. Measure D7 retention and offline return rate. If players return to read the captain's log and then choose to actively play, the hypothesis is validated — invest in depth, platforms, and content. If they read the log and leave, the debrief is the product and active play needs redesign. If they do not return at all, the async hook is not compelling and the core concept needs rethinking.

---

## 16. Content Strategy

### Launch Content (v1)

- 10 hand-crafted island encounters, each with 2–3 branching paths (~25–30 unique encounter paths)
- 5 island visual biome types
- 15–20 trade goods with regional price variation
- 8 ocean events (storms, floating wreckage, fog, whale sighting, merchant vessel, dolphins, reef, current)
- 15 captain's log event templates for the AI debrief system

### Content Scaling

- **Monthly additions:** 2–3 new island encounters per month, template-driven with variable parameters (different NPCs, different loot, different outcomes) to multiply effective content volume.
- **Seasonal content:** Themed encounters aligned with the battle pass. Ghost ships in October, treasure hunts in summer, trade festivals in December.
- **Procedural multiplication:** Authored encounter templates are combined with variable parameters — the same "merchant in distress" template plays differently with different NPCs, cargo, and outcomes depending on the island biome and the player's faction standing.

### Ocean Content Density

Empty sailing is the engagement killer. The ocean traversal is punctuated with **micro-events every 30–60 seconds**: dolphins, whale breaches, floating debris, crew banter, weather shifts, distant ship sightings, birds indicating nearby land. These are brief (5–10 seconds each) and require no player input, but they maintain the sense of a living world.

If a voyage between islands exceeds 5 minutes, the navigator offers a **time-skip option**: "It's a long haul, Captain. Shall I wake you when we arrive?" This compresses the voyage to 30 seconds of ambient sailing montage.

### User-Generated Content

Not viable for v1 or v1.1. In v2, "Captain's Challenges" allow players to design a mission (choose island type, set difficulty, pick reward) for others to attempt. Full player-authored narrative content is a v3+ aspiration — moderation alone would be a significant undertaking on a voice-first platform.

---

## 17. Accessibility

- **Subtitles:** All voice output (crew dialogue, TTS responses, story narration) has on-screen subtitles enabled by default. Subtitles are legible at TV viewing distance (minimum 24pt equivalent).
- **Adjustable text size:** Three tiers (standard, large, extra-large) for all UI text and subtitles.
- **High-contrast mode:** Optional high-contrast colour scheme for all UI elements.
- **Colourblind-safe UI:** All gameplay-critical information is conveyed through shape and label in addition to colour. No red/green-only indicators.
- **D-pad parity:** Every action available through voice is equally available through D-pad menus. D-pad is a first-class input method, not an afterthought. The command menu has the same depth as voice.
- **Screen reader support:** Menu navigation is compatible with platform screen readers for visually impaired players.
- **Audio descriptions:** Key visual events (approaching island, ship sighting, storm) are narrated by crew members, making the game playable with reduced vision.
- **Adjustable game speed:** Players can slow the pace of events during combat and storms if rapid voice commands are difficult.
- **Re-onboarding:** Players returning after extended absence receive gentle command reminders from the First Mate without being forced through a tutorial.

### 17.5 Privacy & COPPA Compliance

The Family Pirate persona includes children aged 6–12. Voice data is sent to Deepgram (third-party processor).

- **v1 requirement:** No personal data is collected from users under 13. Voice audio is streamed to Deepgram for real-time transcription only — it is not stored, replayed, or used for training.
- The game does not require account creation. Player identity uses device ID via Platform SDK (no email, no name, no age collection).
- A privacy policy must be published before platform certification. Legal review required before launch.
- If platform certification requires age gating, implement a simple "Are you over 13?" gate that routes under-13 users to a D-pad-only mode (no voice data transmitted).

---

## 18. Risk Assessment

### Design Risks

| Risk | Severity | Description | Mitigation |
|------|----------|-------------|------------|
| **Voice fatigue** | High | Talking to a TV for 15 minutes is more tiring than using a controller. After session 5–6, voice may feel tedious for routine actions. | D-pad fallback is a first-class citizen. Offer "quick commands" — single D-pad presses for the 5 most common actions. Voice is the premium experience, not the only one. |
| **Empty ocean syndrome** | High | Sailing for 3 minutes with nothing happening is death for a 10–15 minute session game. | Micro-events every 30–60 seconds. Time-skip option for long voyages. Front-load encounters early in each session. |
| **"Why bother playing live?"** | High | If the AI plays competently while away, what is the point of playing live? | Active play offers things the AI cannot do: story choices, complex combat tactics, crew conversations, treasure hunts. The AI is a caretaker, not a substitute captain. |
| **Offline AI frustration** | Medium | If the AI consistently makes choices the player disagrees with, the debrief becomes a frustration session. | Behaviour profiles must be granular enough that the AI rarely surprises. Include "hold position" for players who want full control. 70/30 positive/negative outcome bias. |
| **No endgame** | Medium | Players with the best ship and full map have nothing to do. | Frontier zones, prestige system, competitive seasons, and expanding world ensure there is always a next goal. |

### Product Risks

| Risk | Severity | Description | Mitigation |
|------|----------|-------------|------------|
| **Voice recognition in living rooms** | Critical | TV speakers, family conversations, dogs, kitchen noise. | Hard-mute game audio on mic activation. Custom Deepgram vocabulary. Confidence thresholds. Track success rate as P0 metric. |
| **Churn from offline penalties** | High | Casual players and families upset by AI losses. | 70/30 positive outcome bias. Diminishing returns on offline consequences. Never punish absence — reward returning. |
| **Platform certification delays** | Medium | Samsung certification alone can block launch by 4–6 weeks. | Staggered launches. Fire TV first. Start certification early with minimal builds. |
| **Shallow async multiplayer** | Medium | If encounters with player ships feel identical to NPC encounters, multiplayer adds nothing. | Display captain name, ship name, customisation, reputation. Post-encounter messages. Frequent encounters (at least 1 per session). |

### Technical Risks

| Risk | Severity | Description | Mitigation |
|------|----------|-------------|------------|
| **Three.js on Fire TV** | Critical | Sub-30fps makes the game feel broken. Fire TV hardware is severely constrained. | Build performance benchmark scene in week 1. If it does not hit 30fps on Stick 4K, stop and reassess. Low-poly art, aggressive LOD, max 50K triangles. |
| **Offline simulation at scale** | High | Running AI for thousands of ships could be expensive. | Tick-based batch processing every 15 minutes. Lazy simulation (skip idle ships). 7-day inactivity anchor. Decision tables, not full AI models. |
| **Cross-platform mic behaviour** | High | Voice works on one platform, broken on another. | `MicProvider` abstraction from day one. Per-platform testing. Fire TV first (worst case). Do not ship on any platform with voice accuracy below 85%. |
| **Persistent world state size** | Medium | Storage and bandwidth for thousands of ships, islands, event logs. | Delta syncs. Lazy island generation. Event log pruning after player reads debrief. |
| **VGF framework limitations** | Medium | Framework may not support all required state patterns. | Document workarounds early. Phase model (lobby, sailing, island, combat, captainLog, port) fits VGF's `nextPhase` pattern. |

---

## 19. Appendix: Terminology

| Term | Definition |
|------|------------|
| **Captain's log** | In-game journal of events, especially those occurring during offline AI control. Presented as a spoken debrief by the First Mate on login. |
| **AI agent** | Server-side logic controlling a player's ship while they are offline. Follows the player's behaviour profile. |
| **Async multiplayer** | Players share a persistent world but do not need to be online simultaneously. Encounters between offline ships are resolved server-side. |
| **Behaviour profile** | Player-configurable settings guiding AI agent decisions: cautious, aggressive, trading, or hold position. |
| **Deferred decision** | A choice the AI identified as too important to make autonomously, queued for the player's return. |
| **Diminishing returns** | The reduction in offline simulation intensity over time, preventing excessive consequences for extended absence. |
| **Micro-event** | A brief (5–10 second) ocean flavour moment requiring no player input: dolphins, crew chatter, weather shifts. Occurs every 30–60 seconds during sailing. |
| **Intent parsing** | Converting raw voice transcription into a structured game command via classification and entity extraction. |
| **Tick-based simulation** | Server architecture processing all offline ships in batch every 15 minutes, rather than real-time per-ship simulation. |
| **Inactivity anchor** | After 7 days offline, a ship automatically docks at a safe port and simulation pauses to conserve server resources. |
| **Safe zone** | Protected waters near starting areas and major ports where no AI-initiated combat occurs. |
| **Power band** | Level-matching system ensuring ships only encounter others of similar capability, preventing griefing. |
| **VGF/WGF** | Volley Game Framework — real-time state sync for TV games. Used during active play sessions. |
| **Platform SDK** | Volley's SDK for TV shell integration, device identity, and analytics. |
| **MicProvider** | Abstraction layer for platform-specific microphone input, preventing platform behaviour from leaking into game logic. |
| **Time-skip** | Optional compression of long ocean voyages to 30 seconds, offered by the Navigator when a journey exceeds 5 minutes. |
| **First discovery** | Bonus awarded when a player is the first to find an island; the island bears their name on the shared map. |
