# Crew Incident Resolution Mechanics
**Plunder — Game Design Document**
*Weekend Platform · Pre-Alpha*

---

## Overview

An **Incident** is what happens when a crew member's proclivity reaches DRIVEN state and they act autonomously. Incidents are not punishments. They are **the game**. Each incident is a branching scenario delivered as a voice-command choice, always with meaningful tradeoffs, never with an objectively correct answer.

The captain's response to an incident reveals their leadership style and shapes their crew's culture over time.

---

## Incident Anatomy

Every incident has:

```
Incident {
  id:           string
  type:         IncidentType
  crew:         CrewMember[]    // who is involved
  factions:     Faction[]       // external parties affected, if any
  urgency:      IncidentUrgency
  resolution:   ResolutionOption[]
  autoResolve:  AutoResolveRule // what happens if captain doesn't respond
  consequences: ConsequenceMap  // downstream effects of each resolution
  narrative:    string          // First Mate briefing text
}
```

---

## Incident Types

| Type | Description | Urgency | Examples |
|---|---|---|---|
| **Internal** | Involves only your crew | Low | Brawl in the hold, card game got out of hand, crew member found hoarding |
| **Diplomatic** | Involves another ship or faction | Medium | Jack stole from Rivera, crew member revealed intel, raid went wrong |
| **Crisis** | Threatens the ship or lives | High | Mutiny vote called, fire in the hold, man overboard in a storm |
| **Opportunity** | A proclivity opened a door | Low | Curiosity found something remarkable, Cook acquired rare ingredients |

Opportunity incidents are the positive expression of proclivities — the curious crew member who wandered off and found a sea cave with a stash. Resolution options are about how to capitalize on it, not how to manage fallout.

---

## Incident Urgency

Urgency governs what happens if the captain doesn't respond:

| Urgency | Auto-Resolve Window | Auto-Resolve Default |
|---|---|---|
| **Low** | 72 hours | First Mate handles it conservatively; minor standing loss |
| **Medium** | 24 hours | First Mate makes a diplomatic attempt; 50/50 on outcome |
| **High** | 4 hours | Crew resolves by vote or worst-case default; captain loses authority |
| **Immediate** | Active session only | If captain doesn't respond in session, outcome locks |

High urgency incidents trigger push notifications. The First Mate does not let the captain sleep on a mutiny vote.

---

## Resolution Options

Every incident presents **3–4 voice-command resolution options**. Each option represents a distinct leadership philosophy with a real tradeoff. There is no correct answer — only answers that fit a given captain's style and priorities.

### Option Archetypes

| Archetype | Tone | Costs | Gains |
|---|---|---|---|
| **Strict** | Enforce discipline | Loyalty/morale with involved crew | Authority; crew-wide respect for rules |
| **Lenient** | Forgive and move on | Authority/respect broadly | Loyalty to the individual; morale relief |
| **Creative** | Find an angle | Resources (gold, goods, time) | Relationships maintained; often unlocks something new |
| **Brazen** | Double down | Faction standing, or risk catastrophic backfire | Big gains if it works; crew sees boldness |
| **Diplomatic** | Smooth it over | Gold and time | External standing restored; crew sees sophistication |
| **Channel** | Turn the liability into an asset | Requires the proclivity to be understood | Unlocks a special crew role or crew arc; highest long-term payoff |

Not every incident has every option. Option availability depends on the captain's renown, existing relationships, and prior choices.

---

## Case Study: The Jack Incident

*One-Eyed Jack (Grog proclivity, DRIVEN) has taken a rowboat at night and boarded Captain Rivera's anchored vessel, stealing a barrel of grog.*

### What Happened (Automated Resolution)

1. Jack's Grog satisfaction reached 0 (DRIVEN)
2. Game rolled available opportunities: Captain Rivera's ship is within rowboat range
3. Action triggered: `grog.drivenAction.boardNearbyShip`
4. Jack successfully acquired grog (Grog proclivity reset to SATISFIED)
5. Jack returned to ship drunk but functional
6. Side effects generated:
   - Jack's combat effectiveness: +20% for 48 hours
   - Grog provisions on Rivera's ship: -1 barrel
   - Rivera's standing with player faction: -15
   - Rivera's faction (Brotherhood of the Coast) standing: -5
   - Rowboat: returned with a hole; requires 1 crew-hour to repair
   - 3 crew members witnessed the event: morale split (2 amused, 1 scandalized)

### Captain Returns To

> *"Captain — good news and bad news. Jack is in fine spirits. The bad news is he sourced those spirits from Captain Rivera's hold. Rivera is anchored a half-league off and he knows it was our man. He hasn't done anything yet, but his mood's been dark since dawn. The rowboat also needs patching. Your orders?"*

### Resolution Options

---

**Option 1: "Send Rivera a cask of our best rum and my apologies."**

Voice command: `"Send Rivera a cask of our best rum and my personal apologies"`

- Costs: 1 cask of premium rum (if available), 2 hours of ship time
- Rivera standing: -15 → -5 (partial restore; Rivera respects the gesture)
- Brotherhood of the Coast standing: -5 → 0
- Jack's loyalty: unchanged (Jack doesn't care; he got his grog)
- Authority: slight drop (crew sees the captain cleaning up after Jack)
- Downstream: Rivera becomes a neutral-to-friendly contact again; incident closes

---

**Option 2: "Discipline Jack publicly. This can't stand."**

Voice command: `"Bring Jack before the crew. This kind of conduct ends now."`

- Jack's morale: -20
- Jack's loyalty: -15 (he feels genuinely treated unfairly — he got his grog and came back)
- Jack's proclivity decay rate: temporarily reduced (fear as suppression)
- Crew-wide authority: +8 (crew sees the captain will not tolerate insubordination)
- 2 amused crew members: morale -5 (they liked the story)
- Scandalized crew member: morale +5 (vindicated)
- Rivera: hears about it through Brotherhood channels; standing -15 → -8
- Downstream: Jack is more reliable short-term but resentful; risk of a deeper grudge incident later

---

**Option 3: "Let it go. Rivera knows the life."**

Voice command: `"It's done. Rivera knows we're pirates. Let him stew."`

- Jack: no change (he's already satisfied; doesn't register captain's response)
- Rivera standing: -15, then continues declining at -5 per day until the incident closes (max -30)
- Brotherhood standing: -5 per week until repaired at port
- Authority: slight drop crew-wide (crew reads captain as either relaxed or weak, depending on existing authority level)
- Downstream: Rivera becomes a persistent low-grade negative contact; could escalate to a raid or a bounty posting on the player at -30

---

**Option 4: "Tell Rivera it was on my orders — we needed intelligence."**

Voice command: `"Send word to Rivera: Jack was acting under my orders. We had reason to go aboard."`

*This is a bluff. The game rolls a Renown check.*

- **If renown is high (Feared Captain tier):** Rivera believes it or finds it plausible. Standing: -15 → 0. Crew morale: +10 (captain is bold and clever). Jack's loyalty: +5 (captain covered for him).
- **If renown is low:** Rivera doesn't buy it. Standing: -15 → -25 (insult added to injury). Crew morale: -5 (crew saw through it too). This outcome is flagged; Rivera tells others.
- Downstream: this option seeds a possible spy arc — if Rivera is suspicious, he may send someone to watch you

---

**Option 5 (Channel): "Make Jack my official Boarding Scout."**

*Available only if the captain has seen Jack's proclivity and Jack has loyalty ≥ 40.*

Voice command: `"Jack — you've proven you can get aboard a ship undetected. That's a skill. I'm making it your job."`

- Jack's proclivity: partially channeled; his driven actions in the future will resolve as "Volunteered Boarding Recon" instead of chaotic incidents
- Jack's loyalty: +20 (captain saw something in him)
- Jack's morale: +15 (he has a purpose)
- Jack's grog proclivity: decay rate slows (he has something to focus on)
- New crew role unlocked: **Boarding Scout** — Jack gets first-entry bonuses in boarding actions; chance to gather intel before combat
- Rivera: still needs to be addressed separately; Jack's new role doesn't retroactively fix the incident
- Downstream: Jack becomes a narrative anchor; his scouting missions become recurring events the player looks forward to

> *This is the best outcome — but only a captain who knows Jack well enough to see it.*

---

## Resolution Chain: Downstream Consequences

Incidents do not close cleanly. Resolutions create downstream states that persist in the world:

```
Incident closed
  → Standing changes applied
  → Crew state changes applied
  → "Memory" entry created in affected entities' history
  → Downstream conditions checked:
      if (Rivera.standing <= -25) → chance of Rivera posting bounty
      if (Jack.loyalty <= 20) → Jack's grudge proclivity seeds
      if (Jack has BoardingScout role) → Jack enters proclivity-channeled state
      if (incident ignored > 72h) → auto-resolve fires
```

These memories compound. A captain who has ignored three incidents involving Rivera will face a very different Rivera at the next port than a captain who has handled each one gracefully.

---

## The First Mate as Resolution Buffer

The First Mate is not just a narrator — they are the primary autonomous decision-maker in the captain's absence. Their capability scales with their own loyalty, experience, and the standing orders the captain has given.

| First Mate Experience | Autonomous Resolution Capability |
|---|---|
| Green | Delivers briefing only; waits for orders; low-urgency incidents may worsen |
| Experienced | Can execute standard resolutions (apologies, discipline) within defined parameters |
| Veteran | Can handle diplomatic incidents with external factions; escalates only truly novel situations |
| Legendary | Acts as a co-captain; significant autonomy; may make unexpected creative calls |

The First Mate's own personality affects how they handle things. A First Mate with a strict Code proclivity will discipline Jack regardless of what the captain would have preferred. A First Mate who is old friends with Jack might let it slide. The captain doesn't always know what their First Mate did until the briefing.

---

## Multi-Crew Incidents

Some incidents involve multiple crew members in entangled roles:

- **Feud**: Two crew members with tension proclivity escalate to a confrontation. Both parties have standing in the resolution. Siding with one costs the other.
- **Conspiracy**: A crew member with Ambition has recruited others to their cause. The incident involves a coalition, not an individual.
- **Collective Action**: Low morale across multiple crew triggers a collective incident — the crew collectively demands shore leave, better rations, or a change in course.

Collective Action incidents are the precursor to a Mutiny Event. They are the last warning.

---

## The Mutiny Vote

The Mutiny Event is the most complex resolution in the game. It is not a binary pass/fail — it is a negotiation.

**Trigger**: Crew morale fleet-wide drops below threshold AND at least one Ambition or Code proclivity crew member has been accumulating grievances.

**Resolution structure:**
1. The First Mate delivers the situation: "Captain — the crew has called a vote."
2. The captain has one chance to address the crew before the vote.
3. Voice command determines the tone of the address (appeal to loyalty, offer concessions, threaten consequences, appeal to pride in their accomplishments).
4. The vote resolves based on loyalty distribution across the crew — influenced by the captain's address.
5. **Outcomes:**
   - **Vote fails (captain wins)**: Morale improves (crisis resolved); loyalty redistributes upward; ringleader may face discipline
   - **Vote passes — negotiate**: Crew demands concessions (course change, shore leave, better rations, a share of a specific treasure). Captain can agree or refuse.
   - **Vote passes — hard mutiny**: Ringleader takes control. Captain is marooned or confined. Player must engineer a counter-coup or start over with a new ship.

A captain who has invested in crew relationships, satisfied proclivities, and built loyalty — even when it was inconvenient — will find the vote fails almost before it starts. A captain who has neglected their crew and suppressed warning signs will face a legitimate challenge.

The mutiny is not a random event. It is earned, in both directions.

---

*Related documents: `crew_proclivities.md`, `needs_system.md`, `first_mate_briefing.md`*
