# Crew Proclivity System
**Plunder — Game Design Document**
*Weekend Platform · Pre-Alpha*

---

## Overview

Every crew member has **proclivities** — persistent, weighted desires that drive autonomous behavior when left unaddressed. Proclivities are the engine of emergent crew storytelling. They make crew members feel like people instead of stats.

A proclivity is always two things simultaneously:

- **A liability** when unsatisfied — crew members escalate toward autonomous action, create incidents, and disrupt the ship
- **An asset** when satisfied — the same trait that caused chaos delivers meaningful bonuses when the captain works with it instead of against it

One-Eyed Jack's grog habit will cause a diplomatic incident if ignored. But a captain who learns to channel it turns Jack into a gifted infiltrator. **The skill of the captain is knowing which proclivities to manage, which to suppress, and which to unleash.**

---

## Proclivity Data Model

Each crew member has **2–3 proclivities**, each represented as:

```
Proclivity {
  id:           string           // e.g. "grog", "gambling", "music"
  label:        string           // e.g. "Love of Grog"
  satisfaction: float (0–100)   // current fulfillment level
  decayRate:    float            // points lost per in-game hour; modified by crew traits
  threshold:    float            // below this, autonomous action becomes possible
  state:        ProclivityState
  satisfiedEffect:  Effect       // bonus applied when satisfaction >= 70
  drivenAction:     ActionTable  // what the crew member does when satisfaction == 0
}
```

Satisfaction decays in real time, including while the app is closed.

---

## Proclivity States

| State | Satisfaction | Behavior | Captain Visibility |
|---|---|---|---|
| **SATISFIED** | 70–100 | Passive bonus active; crew member is content | None required |
| **NEUTRAL** | 30–70 | No effect; crew defers to standing orders | None required |
| **WANTING** | 15–30 | Grumbles; may mention it to the captain | First Mate may note it in briefing |
| **COMPELLED** | 5–15 | Takes minor autonomous actions; creates small disruptions | Alert or briefing note |
| **DRIVEN** | 0–5 | Takes major autonomous action; generates an Incident | Incident created; notification |

The key state boundary is **WANTING → COMPELLED**. This is where players can still intervene cheaply with a single voice command before the crew member acts on their own. The **COMPELLED → DRIVEN** transition is where incidents happen.

---

## Proclivity Catalog

### Vices

**Grog** (`grog`)
- Decay: moderate; accelerates near ports and after combat victories
- Satisfied effect: +20% combat effectiveness for 48h; small morale aura to nearby crew
- Compelled action: pilfers small amounts from provisions; morale rises slightly, rations drop
- Driven action: steals a rowboat and acquires grog from the nearest available source (ship, port, allied vessel); see *The Jack Incident* below
- Captain channel: assign as Boarding Scout — their willingness to board unknown ships unsanctioned becomes a legitimate role

**Gambling** (`gambling`)
- Decay: slow; accelerates during long uneventful voyages
- Satisfied effect: +luck modifier on loot tables; crew member wins small amounts that go into ship's chest
- Compelled action: organizes card games in the hold; minor distraction penalty to nearby crew during work hours
- Driven action: wagers from the ship's treasury — rolls outcome (win: treasury +15%, lose: treasury -20%); regardless of outcome, other crew are split on it
- Captain channel: assign as Port Trader — gambling instincts transfer to market negotiation; gets better prices

**Fighting** (`brawler`)
- Decay: moderate; accelerates on long calm stretches
- Satisfied effect: +combat, morale bonus to crew in same boarding action ("goes first, others follow")
- Compelled action: picks arguments; chance of injuring self or another crew member in a brawl
- Driven action: challenges a crew member they have tension with to a formal duel; outcome affects both their stats and the crew's morale
- Captain channel: assign as Boarding Party Leader — proclivity is channeled into legitimate command; driven actions become "inspires crew before battle"

**Grudge** (`grudge`) — *directed at a specific entity*
- Decay: does not decay naturally; satisfied only through resolution
- Satisfied effect: when grudge target is defeated or humiliated, crew member gains +loyalty and a large stat bonus for one week
- Compelled action: undermines the grudge target's work; creates friction
- Driven action: direct confrontation — could mean insubordination, sabotage, or solo action against the target
- Captain channel: use the grudge as motivation — "we're going after Commodore Hayes"; crew member becomes a powerhouse when target is in the conflict

---

### Virtues (also cause chaos when suppressed)

**Music** (`music`)
- Decay: slow; accelerates after tense stretches
- Satisfied effect: crew morale +10 across entire ship for duration; small health recovery rate increase
- Compelled action: stops work to play/sing; productivity drops, morale rises for nearby crew
- Driven action: organizes a full deck concert — work stops entirely for 2 hours, but crew morale and health boost is significant
- Captain channel: schedule shanty time; give them "Morale Officer" role; their driven actions become sanctioned events instead of disruptions

**Curiosity** (`curiosity`)
- Decay: slow; accelerates on known routes
- Satisfied effect: chance to discover hidden cargo, hidden passages, or intel from encounters that others miss
- Compelled action: wanders off task; chance of discovering something useful, chance of getting lost or into trouble
- Driven action: explores without orders — goes ashore at an island, takes a rowboat to a derelict ship; could return with something extraordinary or not return at all
- Captain channel: designate as Scout; their driven actions become "volunteered for dangerous recon" which is actually useful

**Cook's Pride** (`cook`)
- Decay: tied to provisions; rises when unusual ingredients are acquired
- Satisfied effect: every meal cooked with care restores health and morale beyond standard provisions
- Compelled action: experiments with available provisions; uses more than standard ration to cook something special
- Driven action: spends significant provisions or ship funds at market buying specialty ingredients to cook a feast; morale boost is massive but resources take a hit
- Captain channel: assign as Ship's Cook; give them a provisions budget; their driven actions become "feast nights" that the whole crew looks forward to

---

### Social

**Jealousy** (`jealousy`) — *triggered by captain favoritism*
- Decay: triggered when another crew member is praised, promoted, or rewarded
- Satisfied effect: when they are the one being praised, they become a high performer — loyalty bonus, stat boost, champion behavior
- Compelled action: undermines the favored crew member; spreads discontent
- Driven action: formal challenge to the rival's position; crew takes sides; faction within the ship forms
- Captain channel: give them their own domain of excellence — make them best at *something* and praise them publicly for it; they will work hard to maintain that distinction

**Romance** (`romance`) — *directed at a crew member or port NPC*
- Decay: slow; accelerates on long voyages
- Satisfied effect: when together with the person they care about, stat and morale bonus
- Compelled action: sneaks time with the person; neglects duties
- Driven action: makes a grand gesture at the worst possible moment (mid-combat, mid-storm); could be hilarious, could be disastrous
- Captain channel: pair them in the same assignment; create "shore leave together" moments; their bond becomes a loyalty anchor for both

**Ambition** (`ambition`) — *wants to lead*
- Decay: slow; accelerates if the captain ignores their opinions
- Satisfied effect: excellent at independent mission command; drives their assigned team effectively
- Compelled action: starts offering unsolicited tactical opinions; other crew start listening
- Driven action: calls for a crew vote on a decision the captain made — a soft mutiny challenge
- Captain channel: give them a second ship to command; their ambition becomes the exact trait you want in a fleet captain

---

### Ideology

**Superstition** (`superstitious`)
- Decay: triggered by specific map regions, events, or astronomical states
- Compelled action: refuses certain tasks near cursed sites; spreads fear to other crew
- Driven action: demands the ship change course away from "ill-omened" waters; may incite others
- Captain channel: lean into it — superstitious crew members are often right about weather patterns and local hazards; give them "Navigator's Ear" role

**Code** (`code`) — *pirate's honor*
- Decay: triggered by orders that violate their personal code (attacking merchant civilians, killing surrendered enemies, abandoning crewmates)
- Compelled action: protests orders loudly; other ethically-aligned crew take note
- Driven action: defies the order, protects the civilians/surrendered/crew; crew morale split — some are inspired, some see it as insubordination
- Captain channel: do not give this crew member dishonorable orders; their code, when aligned with the captain's choices, makes them fiercely loyal and a rallying point for crew morale

**Cowardice** (`cowardice`)
- Decay: triggered by fear-inducing events; resets slowly
- Compelled action: suggests retreat options; creates anxiety in nearby crew
- Driven action: abandons post during crisis; may take a small group with them
- Captain channel: use them in low-risk but critical roles (supplies, navigation, repair); a coward who feels safe is reliable; a coward who feels respected can surprise you

---

## The Satisfaction Curve

The crucial design principle: **satisfied proclivities pay dividends**.

When a proclivity is satisfied — whether by a captain's deliberate action or the crew member's own autonomous action — the Satisfied Effect activates. Jack got his grog (even if he stole it). He is now in excellent form. His combat bonus is real. The chaos was worth it — if the captain handles the fallout correctly.

This means the captain's calculus is never simply "stop the behavior." It is:

> "Is the cost of this incident worth the bonus that comes with it? And can I turn the incident into something useful?"

---

## Interaction with Standing Orders

Captains can issue proclivity-aware standing orders via voice:

| Command | Effect |
|---|---|
| `"Let Jack have a tot of rum — he's earned it"` | Manual partial satisfaction; loyalty +3; costs 1 ration of provisions |
| `"Jack is on rations until we make port"` | Sets SUPPRESS flag; slows decay but builds resentment; satisfaction can still fall |
| `"Keep Jack busy on the rigging — no idle time"` | DISTRACT tactic; halves decay rate for the session; does not satisfy |
| `"Give the band a slot on the deck tonight"` | Satisfies musician proclivities; morale event fires; work stops for 2 hours |
| `"Let the crew play cards after watch"` | Satisfies gambling proclivities for group; small treasury risk |
| `"Get Jack to teach the new men to fight"` | CHANNEL command; fighting proclivity satisfaction + Jack gains trainer XP |

The most powerful commands are CHANNEL commands — they satisfy a proclivity by directing it toward something useful. These unlock as captains gain experience and renown.

---

## Proclivity Discovery

Players do not know a crew member's full proclivity list when they recruit them. Discovery happens through:

- **Observation** — crew member mentions something ("Jack keeps eyeing the grog stores")
- **First Mate hints** — "Captain, a word about Jack — I've noticed he gets restless after a dry stretch"
- **Incidents** — the first time a proclivity drives action, its nature is revealed
- **Rapport** — as loyalty increases, crew members open up; proclivities become visible in the crew manifest

This means early crew management involves learning your people. A captain who has sailed with Jack for six months knows his proclivities cold. A captain with a new recruit is flying partially blind.

---

## The Fleet-Scale Problem

As the player expands to a fleet, proclivity management becomes a coordination challenge. You cannot watch three ships at once. Crew on ships you aren't directly commanding will have proclivities decaying. Those ships' First Mates will handle minor incidents autonomously, but major incidents require the captain.

This creates the **fleet captain's dilemma**: assign your volatile crew members to your personal ship where you can manage them, or spread them across your fleet for their stat bonuses and accept that incidents will occur on ships you're not watching.

High-loyalty crew members have wider autonomy tolerances — they'll hold on longer before acting, and their First Mates can resolve more on their behalf.

---

## Proclivity and Renown

As the captain's renown increases, new proclivity archetypes become recruitablee:

| Renown Tier | Unlocked Proclivity Types |
|---|---|
| Known Pirate | Standard vices and virtues |
| Feared Captain | Vengeance, Fanatical Loyalty, Blood Oath |
| Pirate Lord | Legend-Chaser, Dynasty-Builder, Sea's Own (tied to world lore) |

Legendary crew members have more powerful proclivities with more dramatic satisfied effects and more catastrophic driven actions. They are worth the management cost — if you can handle them.

---

*Related documents: `crew_resolution_mechanics.md`, `needs_system.md`, `the_jack_incident.md`*
