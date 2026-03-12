# The First Ten Minutes
**Plunder — Game Design Document**
*Weekend Platform · Pre-Alpha*

---

## Design Intention

The first ten minutes must accomplish four things without ever feeling like a tutorial:

1. Prove that your voice commands do real things in the world
2. Give you a ship and make you feel like you *earned* it
3. Present your first genuine choice — one with no correct answer
4. End with you at sea, with a crew, heading somewhere you chose

No loading screen tips. No button-mapping overlays. You are already the captain. You just don't have a ship yet.

---

## Beat 1: The Rowboat

*Open on water. Pre-dawn. The camera sits low — you feel the chop. Tom is rowing. He's not your First Mate yet; he's just the man who showed up when you needed someone. A ship sits on the horizon, still in the purple dark.*

**Tom:** *"There she is. Sitting quiet. No lights, no flag. Could be nothing. Could be everything. Your call, Captain."*

The player's first command is the most natural thing in the world:

> *"Head for it."* / *"Make for the ship."* / *"Let's take a look."*

Tom rows. The camera follows with the slow, purposeful pull of Jungle Strike momentum — the ship grows larger as you close the distance. This is the first proof-of-feel: the world moves because you spoke.

**Design note:** Tom calls the player "Captain" before they've earned anything. This is deliberate. The game confers the title immediately and trusts the player to grow into it. The first voice command — however they phrase it — is the moment they accept.

---

## Beat 2: The Abandoned Ship

*Alongside now. A Navy vessel, by its rigging. No crew visible on deck. A rope ladder hangs over the side.*

**Tom:** *"Navy ship. HMS Perseverance, by the nameplate. No one's home. Strange that."*

The player can investigate or just board:

> *"Why would a Navy ship be sitting empty?"* → Tom speculates; seeds the mystery
> *"We're going aboard."* → Skip straight to boarding
> *"Check for traps first."* → Tom does a cautious scan; slight delay, small safety info

**The mystery of why the ship was abandoned is not answered here.** It becomes a persistent thread — maybe a note in the captain's quarters, a later encounter with a sailor who was on that crew, or a campfire story that connects back to this moment. The first beat of the game plants a question the player might not get the answer to for weeks.

*The player boards. The ship is intact. Provisioned. Armed. Just... empty.*

**Tom:** *"She's in fine shape. Whoever left her, they left her in a hurry."*

**Design note:** Finding the ship in good condition is important. The player isn't starting with scraps — they're starting with something real. The game should feel generous in this moment. The challenges come later.

---

## Beat 3: The Navy Arrives

*The player has maybe thirty seconds to take stock — then shouting from the shore to the left.*

**Tom:** *"Captain! Men on the beach — Navy, by the coats. A dozen of them, maybe more. They don't look pleased."*

A small longboat is being launched. The soldiers are making for the ship.

This is the first pressure moment, and the player has real options:

> *"Cut the anchor and make sail — now!"* → Escape (the obvious call)
> *"Ready the cannons."* → Fight (they're on a longboat; it's not sporting, but it works)
> *"Hail them — maybe we can talk our way out."* → Bluff attempt; Tom is deeply skeptical
> *"Raise a white flag."* → Surrender; the game lets you do this; it does not go well

**The player is already a thief.** They boarded a Navy vessel and are clearly about to sail off with it. The game does not moralize. Tom might note that making enemies of the Navy this early is "bold," but he doesn't tell you to stop. This is the world. You're a pirate captain. Act like one.

**Design note:** The escape sequence is the first real sailing — the player learns that the ship moves when they give orders, that speed and heading are voice-commandable, and that getting out of a bad situation feels good. The Navy longboat doesn't catch up. The soldiers on the beach get smaller. Tom exhales.

---

## Beat 4: The Man in the Brig

*Below decks, as the player explores their new ship — or Tom mentions it during the escape:*

**Tom:** *"Captain. There's someone in the brig. Locked up proper. Says his name is Varney."*

*A beat.*

**Tom:** *"He can sail. Says he knows these waters. Also says he was put down there by the Navy for — and I'm quoting — 'refusing an immoral order.' Doesn't say what the order was."*

*Another beat.*

**Tom:** *"I'll say this plainly: he's got that look about him. The kind of man who decides things for himself. Your call."*

The player must choose:

> *"Bring him up."* → Varney joins the crew
> *"Leave him."* → Varney stays locked; they can revisit at the next port, or not
> *"What do you think, Tom?"* → Tom: *"I think he's trouble. I also think we're shorthanded."* — no further guidance
> *"Ask him what the order was."* → Varney: *"They wanted me to fire on a fishing village. I declined."* This is true. It doesn't change his proclivity.

**Varney's proclivity manifest:**
- High Mutiny proclivity (he will challenge authority when he disagrees strongly)
- High Code proclivity (he won't follow orders that violate his ethics)
- Exceptional navigation skill (best in any early crew)
- Hidden: deep loyalty once trust is established — if the player earns it

The player does not see his stats. They see Tom's read of him and their own instinct.

**If Varney joins:** He is immediately useful. He also, eventually, will challenge the player. The first time the player gives an order Varney considers dishonorable, he'll say so. Loudly. In front of the crew. This is not a bug. It is Varney.

**If Varney stays:** The brig door remains. They sail with one less crew member. At the first port, they can recruit others. The ghost pirates will be harder to navigate without Varney's knowledge. Some players won't know what they missed. Others will figure it out.

**Design note:** This choice cannot be fully evaluated at the time it's made. That is the point. The game is training the player that choices here have texture — not "good option / bad option" but "different paths with different costs." The player who takes Varney and survives his first challenge becomes a better captain. The player who leaves him and struggles through the ghost pirates earns their knowledge a different way. Both stories are valid.

---

## Beat 5: Naming the Ship

*Clear water now. The Navy is behind them. Tom is at the helm. The sun is coming up.*

**Tom:** *"She'll need a name, Captain. Can't just call her 'the ship.'"*

The player speaks the name:

> *"She's the [Black Meridian]."* / *"Call her the Pale Duchess."* / *"The Wrathful."*

Tom repeats it back, and for the rest of the game, that is her name. The ship's nameplate visually updates. The First Mate log begins: *"Day 1 aboard [ship name]."*

**Design note:** This is a thirty-second beat that costs nothing and earns enormous attachment. The player named her. She is theirs now in a way that commandeering her wasn't. Ship-naming is a genre tradition for a reason.

---

## Beat 6: First Heading

*Tom produces a rough chart. Three options visible within range:*

- **Port Maren** — a small trading post; civilization, supplies, possibly wanted posters already going up
- **The Shallows** — an uncharted cluster of islands; unknown, possibly profitable, possibly dangerous
- **Open Water South** — deeper sea; no destination, just away from here

> *"Make for Port Maren."* / *"Head for those islands."* / *"Take us south — open water."*

Each choice shapes the early game differently. Port Maren introduces the economy and reputation systems early. The Shallows introduce exploration and discovery. Open Water introduces the pure sailing experience and the first encounter event.

Tom sets the heading. The sails catch wind. The ship moves.

**Tom:** *"Right then. Just the two of us and our new friend in the brig. How do you feel, Captain?"*

This is the first moment the game invites the player to speak freely — not to issue an order, but just to say something. Whatever they say, Tom responds in kind. It is brief. It is not mechanically significant. It is the moment the relationship between captain and first mate begins.

---

## Beat 7: The First Night

*The tutorial arc closes at nightfall. The sun sets in amber and red. Tom lights a lantern on the stern.*

**Tom:** *"First night at sea, Captain. Should be peaceful enough."*

*It is not.*

This is the trigger point for the **Ghost Fleet** campfire story — the first legendary event. It fires here by design, not by chance. Every new captain encounters it on their first night. After that, campfire stories are emergent.

*See: `campfire_stories.md` — "The Ghost Fleet (Tutorial Variant)"*

---

## The Ten-Minute Arc Summary

| Beat | Duration | What It Teaches | What It Feels Like |
|---|---|---|---|
| Rowboat approach | ~90s | Voice commands move the world | I'm already the captain |
| The abandoned ship | ~60s | The world has mysteries | Something happened here |
| Navy arrival | ~90s | Pressure + real choices | This is dangerous and good |
| Varney in the brig | ~120s | Choices have hidden texture | I'm not sure what I just did |
| Naming the ship | ~30s | Ownership and attachment | She's mine |
| First heading | ~60s | The world is open | I can go anywhere |
| First night | ~60s | Something is always coming | I'm not ready. Let's go. |

---

## Voice Commands Introduced in the First Ten Minutes

The player discovers these organically — no prompt, no list:

- Navigation commands (`"Head for…"`, `"Make sail"`, `"Full speed"`)
- Investigation commands (`"What do you make of it?"`, `"Check below decks"`)
- Crew commands (`"Bring him up"`, `"Ready the cannons"`)
- Naming / declaration (`"She's the [name]"`)
- Open conversation with Tom (`"How does she handle?"`, `"What's our heading?"`)

No command fails silently. If the parser doesn't understand, Tom asks for clarification in character: *"Say again, Captain?"* — never a UI error, never a dead moment.

---

*Related documents: `campfire_stories.md`, `crew_proclivities.md` (Varney), `crew_resolution_mechanics.md`*
