# Campfire Stories
**Plunder — Game Design Document**
*Weekend Platform · Pre-Alpha*

---

## What Is a Campfire Story?

A campfire story is a **legendary event** — a rare, high-drama moment that interrupts normal play and demands something extraordinary from the captain. They are the moments players recount to friends. They generate personal narrative that belongs to the player, not the game.

The name comes from the social behavior they're designed to produce: *"You won't believe what happened to my ship last night."*

### Rules for Campfire Stories

**They must be rare.** One campfire story every 7–14 in-game days per ship. Frequency is weighted away from back-to-back occurrences. The world should feel like it's *choosing* its moment.

**They must be timed for maximum drama.** The hurricane hits when you're three days from port with low provisions. The ghost fleet appears on your first night at sea and on subsequent difficult nights. The Kraken surfaces when you're carrying your most valuable haul. The game reads world state and holds the event until conditions maximize impact.

**Voice commands must feel discovered, not prescribed.** The right commands should be what any captain would naturally say — not prompts from a menu. Players who say the wrong things and fail still get a story. Players who figure out the right commands feel genuinely clever.

**They must be survivable but not guaranteed.** Real stakes. Real loss possible. A campfire story you barely escaped is better than one you breezes through.

**Each one tests a different captain quality:**
- Supernatural stories test knowledge and composure
- Natural disaster tests command under pressure
- Moral dilemma tests character and values
- Combat/encounter tests tactics and quick thinking
- Mystery tests trust and investigation

---

## The Campfire Story Template

```
Story {
  id:           string
  name:         string
  category:     "supernatural" | "disaster" | "moral" | "combat" | "mystery"
  triggerConditions: WorldStateCondition[]
  tutorialVariant:   boolean   // some stories have a first-time version
  minRenown:    int            // some stories require reputation to unlock
  crewDependencies: string[]   // some stories play differently based on crew
  commandsThatWork:  string[]  // voice commands that resolve the story well
  commandsThatFail:  string[]  // voice commands that don't work (with why)
  outcomes:     Outcome[]      // 2-4 outcomes with conditions and consequences
  campfirePayoff: string       // the story in one sentence — what players remember
}
```

---

## The Stories

---

### 1. The Ghost Fleet *(Supernatural)*
**Tutorial Variant fires on the player's first night at sea. All subsequent appearances are emergent.**

*Night on open water. The wind dies completely — unnatural stillness. Tom goes quiet. Then, one by one, lights appear on the water ahead. Ships. A lot of ships. Moving without wind. Their flags are wrong — colors that don't exist, forms that shouldn't be. They're sailing straight for you.*

**The test:** Conventional commands don't work. Firing cannons passes through them. Ramming speed makes the crew panic. The right response is folkloric — something a sailor would know.

| Command | Result |
|---|---|
| `"Fire at them!"` | Cannon fire passes through — no effect; crew morale drops |
| `"Full speed ahead, ram them!"` | Ship passes through — crew terrified; morale critical |
| `"Light every lantern on the ship"` | Ghost ships begin to thin — partial resolution |
| `"Ring the brass bell"` | Strong effect — ghosts retreat from the sound; works best at full peal |
| `"Hold your course and show no fear"` | High-renown captains can will through — crew looks to captain; morale steadies |
| `"All hands below decks"` | Crew protected; ship drifts through fleet; haunted atmosphere but no casualties |
| `"Make for open water — full sail"` | If wind returns enough, escape is possible; tense chase |

**Varney's role (if recruited):** On the first-night tutorial variant, Varney emerges from the brig and says: *"Ring the bell, Captain. Brass. Ring it full and don't stop."* He knows. If Varney was left behind, the player must figure it out alone — or take casualties.

**Outcomes:**
- Dispersed cleanly (bell/lanterns): crew shaken but intact; Tom makes a note in the log; occasional references to it afterward
- Drifted through passively: crew haunted; Boredom and Morale debuffs for 48 hours; but a spectral item may appear in the hold
- Fought through: crew casualties; survivors have permanent Superstition proclivity seeds
- Fled successfully: clean escape; no debuff; but the fleet is spotted again later in the campaign, closer

**The campfire payoff:** *"I sailed through a fleet of ghost ships on my first night at sea. Varney rang the bell until his arms gave out."*

---

### 2. The Hurricane *(Disaster)*

*The barometer drops fast. Tom reads the sky. A wall of black cloud is coming from the south — not a storm, a hurricane. Hours away, maybe less. You have time to prepare. Maybe.*

**The test:** A sequence of voice commands under escalating pressure. The commands aren't secret — any sailor would know them. The challenge is executing them fast enough and in the right order before conditions become unrecoverable.

**Preparation phase** (before the storm hits):
| Command | Effect |
|---|---|
| `"Batten down the hatches"` | Reduces interior flooding risk |
| `"Lash everything to the deck"` | Reduces cargo loss |
| `"Reef the sails — take them in"` | Critical; unmanaged sails in a hurricane mean lost rigging |
| `"Make for the nearest shore"` | Risk of grounding vs. risk of open water — a real choice |
| `"All hands on deck"` | Maximizes response speed during storm; everyone exposed to weather |
| `"Send non-essential crew below"` | Protects most of the crew; reduces response capacity |

**During the storm** (fast commands, dynamic camera, screaming wind):
| Command | Effect |
|---|---|
| `"Hold the wheel — don't let her turn broadside!"` | Prevents capsizing |
| `"Cut the foremast — it's going to take us over!"` | Drastic; saves the ship; costs the mast (repair required) |
| `"Man overboard — hard to port!"` | If crew fell; recovery attempt; costs time and maneuver |
| `"Full into the wind — punch through!"` | Aggressive; high risk, high reward; works with skilled navigator |

**Outcome variables:** Hull condition, provisions, crew health and morale, whether rigging was secured, whether the ship made port or rode it out.

**Outcomes:** Ship intact / ship damaged / mast down / crew lost / miraculous survival with legend bonus

**The campfire payoff:** *"We cut the foremast in the middle of a hurricane to stop the ship rolling over. Tom didn't sleep for three days."*

---

### 3. The Kraken *(Creature)*

*Deep water. No warning. The sea goes dark beneath you — a darkness that moves. Then the first arm breaks the surface. It's bigger than the ship.*

**The test:** Unlike most campfire stories, The Kraken offers a genuine choice before the crisis: **fight, flee, or negotiate.** There is no obviously correct answer.

**The Pearl:** The Kraken has a massive iridescent pearl visible in the water near where it surfaces. Taking it is optional. Its presence is obvious. Its consequences are unknown at first encounter.

| Command | Outcome Path |
|---|---|
| `"Fire everything — kill it!"` | Extended combat; ship takes serious damage; possible victory at high cost; Kraken retreats wounded; may return |
| `"Run — full sail away from it!"` | Escape if you have speed; Kraken pursues but can't sustain; clean exit, no pearl |
| `"Hold position — don't provoke it"` | The Kraken circles, surfaces, and eventually submerges; no engagement; no pearl |
| `"Take the pearl"` | Crew retrieves it; Kraken reacts — combat or retreat depending on how it's done |
| `"Offer it something"` | Requires cargo sacrifice; Kraken considers; may retreat satisfied |
| `"Speak to it"` | A high-renown captain with a legendary First Mate gets a response — something ancient and not quite intelligible; seeds a long-term arc |

**The Pearl's effects (if taken):**
- Navigation bonus: holder of the pearl always knows weather 24 hours ahead
- The Kraken remembers: it will appear again, specifically seeking the pearl, within 2–4 weeks
- It can be sold at certain ports for extraordinary gold (and the buyer's problem becomes apparent later)
- A crew member with Superstition proclivity will refuse to sleep near it

**The campfire payoff:** *"I took the pearl. Best decision I ever made. Worst decision I ever made. The Kraken came back."*

---

### 4. The Siren's Coast *(Supernatural)*

*Beautiful singing, just at the edge of hearing. The crew starts behaving strangely — drawn toward a rocky coastline to the west. Tom is not immune. The helmsman has drifted course without noticing. The rocks are closer than they should be.*

**The test:** Managing affected crew while maintaining ship control. Some crew are more susceptible (Boredom high = more vulnerable; Music proclivity = extremely vulnerable; Loyalty high to captain = partial resistance).

| Command | Result |
|---|---|
| `"All hands below decks — seal the portholes"` | Removes crew from exposure; ship steers itself poorly |
| `"Cover your ears — all of you"` | Partial effectiveness; some crew comply, some don't |
| `"Tom — take the wheel, hold course"` | If Tom is resisting — works; if Tom is affected — he ignores you |
| `"Make noise — drums, bells, anything!"` | Competing sound disrupts the song; effective if started early enough |
| `"Turn us east — hard over"` | Tests helmsman's loyalty vs. the pull; requires direct command to a specific crew member |
| `"Sing back at them"` | This works if a musician crew member leads it. Unexpected. Memorable. |

**Crew dependencies:** A musician crew member (Music proclivity satisfied) can counter-sing — their voice competes with the sirens and protects nearby crew. This is a *proclivity turning into a campfire story save.* If you've been investing in your musician, they save the ship.

**The campfire payoff:** *"My cook started singing shanties so loud the sirens gave up. I think he genuinely enjoyed himself."*

---

### 5. The Plague Ship *(Moral Dilemma)*

*A merchant vessel, sitting low in the water. No response to hailing. You board to find the crew dead — not from violence. From illness. The cargo hold is full. Valuable goods, untouched.*

**The test:** There is no right answer. Only captain answers.

| Command | Consequence |
|---|---|
| `"Take the cargo — all of it"` | Significant haul; 40% chance of illness spreading to your crew over next 72 hours |
| `"Take what we can quickly and go"` | Partial haul; reduced risk |
| `"Leave it — it's not worth it"` | Nothing gained; crew safe; Tom notes the decision; certain crew gain +loyalty (Code crew especially) |
| `"Burn the ship"` | Safe; pious; eliminates the risk for any ship that finds it; no gain; costs oil |
| `"Mark the location and report it at port"` | Gains standing with merchant factions; reward possible; Navy may ask questions about how you found it |
| `"Strip the navigation equipment — leave the rest"` | Selective; maps and instruments carry lower disease risk; modest gain |

**The illness mechanic (if triggered):** Spreads slowly. First one crew member, then possibly more. Requires medical supplies and a crew member with health-focused skills. If the Cook has their proclivity satisfied, they recognize the symptoms early and slow the spread. This is the Plague Ship's lingering consequence — not a campfire story that ends cleanly, but one with a tail.

**The campfire payoff:** *"We found a dead ship worth ten thousand in silk. We burned it. I still think about that sometimes."*

---

### 6. The Rival Captain *(Combat / Reputation)*

*A ship flying a flag you recognize — a notorious pirate, someone whose name you've heard in port. They pull alongside and hail you. Their captain appears on deck. They want to talk. Or they want to fight. It's not entirely clear which.*

**Unlocks at:** Moderate renown (the rival captain only bothers with someone worth their attention)

**The encounter is social before it's physical.** The rival captain opens with a proposition — could be an alliance, a challenge, a threat, or a test of character. The player's response shapes everything that follows.

| Opening command | What it signals |
|---|---|
| `"What do you want?"` | Neutral; rival reads you cautiously |
| `"I know your name. I'm not afraid of it."` | Bold; rival is amused or offended depending on their proclivity |
| `"Hail them back — friendlily"` | Opens diplomatic path |
| `"Run out the guns but hold fire"` | Shows strength without aggression; rival respects it |
| `"Blow them out of the water"` | Immediate combat; no parley; possible gain or devastating loss |

**If dueling is chosen or provoked:** The rival captain boards personally. Varney is useful here. So is the Fighting proclivity crew member. The outcome affects renown substantially in either direction.

**Long-term:** A rival captain who survives this encounter becomes a recurring character. If defeated and spared, they may become an ally, a contact, or a slow-burning enemy. If humiliated and released, they will be back.

**The campfire payoff:** *"Captain Rourke came alongside with a hundred guns. I invited her aboard for rum. Now she owes me a favor."*

---

### 7. The Fog of War *(Supernatural / Disaster)*

*A fog comes in. Not unusual. But the compass starts spinning. The stars disappear. The crew gets quiet in a way that isn't quite fear — it's more like they've forgotten what they were afraid of. The ship is sailing, but no one is entirely sure where.*

**The test:** Navigation by instinct, crew management, and finding the exit. The fog is a puzzle more than a threat — but panic makes it worse.

**Crew effects:** Superstition proclivity crew become extreme liabilities (if not managed, they take autonomous action — praying loudly, throwing cargo overboard as offerings). High Morale crew hold steadier. Experienced navigators (Mira, Varney) can make sense of the environment better than raw sailors.

| Command | Effect |
|---|---|
| `"Steady — hold your heading"` | Maintains composure; buys time |
| `"Drop anchor — wait it out"` | Safe; may work; takes time (fog has a duration) |
| `"Ask Varney what he makes of it"` | If Varney is aboard: he has a theory; gives navigation hint |
| `"Listen — what do you hear?"` | Audio clue: faint sounds from coast, other ships, birds — directional |
| `"Follow the birds"` | Works — birds fly toward land even in unnatural fog |
| `"Increase speed"` | Risky; might sail onto rocks; might exit faster |
| `"Light signal flares"` | Attracts another ship — could be rescue; could be unwanted attention |

**Hidden mechanic:** The fog is weakest in the direction the wind was coming from before it appeared. A crew member with the Curiosity proclivity will notice this and say so — if they're in a satisfied state.

**The campfire payoff:** *"We were lost in a fog that ate the compass. Cormac said follow the gulls. He was right."*

---

### 8. The Marooned Soldier *(Moral Dilemma)*

*A figure on a rock — or a very small island. Navy uniform. Waving something white. They've clearly been there a while.*

**The question is immediate:** Why is a Navy soldier marooned? By their own side? Why?

**Tom:** *"We could leave them. No one would know. Or blame us."*

| Command | Path |
|---|---|
| `"Leave them"` | Clean; no complication; but Tom's Code proclivity notes it; certain crew lose morale |
| `"Pick them up"` | Rescue; they have information; they create a complication |
| `"Hail them first — what happened?"` | They explain (partially truthfully); helps the decision |

**If rescued:** The soldier's story is interesting. They were marooned for refusing the same order Varney refused — or a different one. They have information about naval patrol routes. They have a name that means something at a port. They are not grateful in the way you might hope — they're complicated about being rescued by pirates.

**Resolution options after rescue:**
- Drop them at the nearest neutral port (safe; they'll talk)
- Keep them aboard (volatile; they have skills; they will eventually try to leave)
- Ransom them (risky; Navy may or may not pay; creates attention)
- Recruit them (very high friction; they are not a pirate; they might become one)

**Connection point:** If Varney is aboard and was marooned by the same officer, their reunion is a scene. Tom doesn't know what to do with it.

**The campfire payoff:** *"We pulled a Navy lieutenant off a rock. He ended up navigating us through the Bay of Storms. Never did tell us his real name."*

---

### 9. The Cursed Cargo *(Supernatural)*

*You boarded a ship, won the fight, took the cargo. Standard. But one crate was different from the others — sealed with wax that had a symbol none of your crew recognized. Someone opened it.*

**The trigger:** Something was in that crate. Small. Doesn't look like much. But strange things have been happening since.

**Escalating weirdness:** Each night, something new — food spoiling faster, ropes unknotting themselves, a crew member seeing something in the water at midnight, the ship's compass drifting five degrees toward the crate's location. Creeping, not sudden.

**The test:** Investigating and resolving before the effects become serious. The game rewards curiosity and penalizes ignoring it.

| Command | Effect |
|---|---|
| `"What's in that crate?"` | Investigation; First Mate describes; seeds clues |
| `"Throw it overboard"` | Works eventually; but something in the water now |
| `"Lock it away and post a watch"` | Containment; slows effects; buys time to find a solution |
| `"Find someone who knows what this is"` | At port, a specific contact can identify it; leads to a side arc |
| `"Open it"` | Crew member who opens it acquires a proclivity (random from a "cursed" set) |
| `"Burn it"` | Effective; dramatic; smoke does something unexpected |

**The campfire payoff:** *"We had a crate that spoiled everything near it. We threw it overboard in the Bay of Maris. Something came up to collect it."*

---

### 10. The Royal Pardon *(Mystery / Choice)*

*A small Navy sloop approaches under a white flag. No guns run out. An officer in formal dress asks to come aboard. They carry a sealed letter from the Governor.*

**The offer:** A pardon. Legitimate. Detailed. Signed. For you specifically, by name. In exchange for one thing — something specific that the Governor wants and believes only a pirate captain of your reputation could obtain or accomplish.

**The test:** Do you trust it? The pardon is real — it can be verified at port. But the thing they're asking for is complicated. Maybe dangerous. Possibly damaging to people you've met. The Governor is not offering a pardon out of generosity.

This is a multi-session arc, not a single encounter. The campfire story is the choice to take the deal.

| Command | Path |
|---|---|
| `"What do they want?"` | Officer explains; seeds the arc |
| `"Tell the Governor to go to the devil"` | Pardon withdrawn; Navy attitude toward you hardens slightly; Tom thinks you made the right call |
| `"We're interested — tell us more"` | Arc begins; no commitment yet |
| `"Arrest the officer"` | Ransom potential; serious diplomatic consequences; Tom is appalled |
| `"Accept"` | Immediate commitment; arc locked in; crew has opinions |

**Long-term:** Whether the player ultimately completes the Governor's task, double-crosses them, or finds a third path defines a significant chunk of mid-game narrative.

**The campfire payoff:** *"The Governor offered me a pardon once. I should probably have taken it."*

---

### 11. The Night the Stars Went Wrong *(Supernatural)*

*Navigation as normal — then the stars aren't where they should be. Not clouds. The stars themselves are displaced. Tom checks the charts. The charts are right. The sky is wrong.*

Brief, strange, ominous. No mechanical threat. Just something the player witnesses.

This is a *mystery seed*, not a full campfire story. It connects to a larger arc — the world has a supernatural layer that the player can choose to engage with or ignore. The Night the Stars Went Wrong is the first signal that something is there.

**The campfire payoff:** It doesn't have one yet. That's the point. Players file it away. Months later, when the arc resolves, they remember: *"The stars went wrong that night. Now I know why."*

---

## Campfire Story Unlock Tiers

| Tier | Renown Required | Stories Available |
|---|---|---|
| New Captain | None | Ghost Fleet (tutorial), Hurricane, Kraken |
| Known Pirate | Low | Plague Ship, Fog of War, Siren's Coast |
| Feared Captain | Moderate | Rival Captain, Marooned Soldier, Cursed Cargo |
| Pirate Lord | High | Royal Pardon, Night the Stars Went Wrong, and beyond |

Higher tiers don't replace lower ones — they add. A Pirate Lord still sails through hurricanes. But they also get stories that require weight of history to land.

---

## Future Campfire Story Seeds

*Documented for development backlog — not yet fully designed:*

- **The Other Captain's Ship** — you find your own ship, somehow, flying under different colors
- **The Leviathan's Island** — what you anchored near was not an island
- **The Sea Witch's Bargain** — an old woman in a small boat; infinite ocean; no explanation
- **The Mutineer's Map** — a dying sailor hands you something; *"Don't trust your First Mate"*
- **The Ship That Follows** — nothing wrong with it; it's just always there, just at the edge of sight
- **The Port That Wasn't** — you arrive at a port that the charts say exists; it does not; it did

---

*Related documents: `first_ten_minutes.md`, `crew_proclivities.md`, `needs_system.md`*
