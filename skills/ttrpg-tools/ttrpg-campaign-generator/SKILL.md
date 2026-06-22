---
name: ttrpg-campaign-generator
description: Generate creative and unique TTRPG campaign ideas by combining random player types, plots and villains inspired by famous books, movies, and shows, and diverse settings. Use this when the user wants campaign ideas for tabletop RPGs.
---

# TTRPG Campaign Generator

Generate unique and creative campaign ideas for tabletop role-playing games by randomly combining four elements:
- **Player Types**: Character archetypes (Wizards, Pirates, Scientists, etc.)
- **Plot Inspiration**: Story structures based on famous books, movies, and shows
- **Villain Inspiration**: Antagonist archetypes inspired by iconic pop culture villains
- **Settings**: Diverse genres and worlds (Cyberpunk, Medieval, Post-Apocalypse, etc.)

## How to Use This Skill

When the user requests a campaign idea:

1. **Run the random generation scripts** located in `scripts/`:
   - `random-players.js` - Selects a random player type
   - `random-plot.js` - Selects a random plot inspiration
   - `random-villain.js` - Selects a random villain inspiration
   - `random-setting.js` - Selects a random setting

2. **Execute all four scripts** using Node.js to get the random elements

3. **Present the combination** in an engaging format that includes:
   - The four randomly selected elements
   - A brief campaign pitch that creatively combines them
   - Suggestions for how to adapt the villain and plot to the setting and player types
   - Optional: Additional hooks, NPCs, or complications

## Output Format

Present campaign ideas in this structure:

```
🎲 **Campaign Idea**

**Players:** [Player Type]

**Plot Inspiration:** [Book/Movie/Show]

**Villain Inspiration:** [Villain Name]

**Setting:** [Setting Name]

**Campaign Pitch:**
[2-3 sentences describing how these elements combine into a compelling campaign]

**Description:**
[A more detailed paragraph that outlines the basic plot of the campaign—what happens, what the players are trying to achieve, and what stands in their way. Include potential story arcs, conflicts, and how the campaign might progress.]

**Key Elements:**
- [Adaptation note 1]
- [Adaptation note 2]
- [Optional hook or twist]
```

## Guidelines

- **Be creative** in combining the random elements - find unexpected connections
- **Adapt the villain and plot** to fit the setting and player types (e.g., "Die Hard on a space station" or "Groundhog Day in medieval times")
- **Provide actionable hooks** that a GM can immediately use
- **Respect the randomness** - don't regenerate if the combination seems odd; instead, find the creative potential
- **Keep it concise** - focus on the core concept and key hooks
- **Multiple generations** - If the user wants more ideas, run the scripts again for new combinations

## Examples

**Example 1:**
```
🎲 **Campaign Idea**

**Players:** Time Travelers

**Plot Inspiration:** Groundhog Day

**Villain Inspiration:** Loki (Marvel)

**Setting:** Medieval Europe

**Campaign Pitch:**
A group of time travelers becomes trapped in a temporal loop during a crucial medieval battle. Each day resets at dawn, and they must figure out how to break the cycle while preventing a catastrophic historical change orchestrated by a cunning trickster who delights in chaos.

**Description:**
The players arrive in 1415 on the eve of a pivotal battle, only to discover their temporal equipment has malfunctioned, trapping them in a 24-hour loop. Each iteration, they witness the same events unfold: the king's war council, the positioning of troops, and ultimately a devastating defeat that shouldn't have happened according to history. As they investigate, they uncover a rival time traveler—a charming, manipulative figure who treats the timeline as his personal plaything. Like Loki, this antagonist isn't purely evil; he's bored, mischievous, and genuinely entertained by the players' attempts to stop him. The players must navigate medieval politics, earn the trust of suspicious nobles, and piece together clues across multiple loops to outmaneuver a villain who's always three steps ahead—all while their own existence grows increasingly unstable with each reset.

**Key Elements:**
- Players retain memories across loops but NPCs don't
- The villain is charming and unpredictable—sometimes helpful, sometimes sabotaging
- The "correct" outcome isn't obvious - multiple solutions possible
```

**Example 2:**
```
🎲 **Campaign Idea**

**Players:** Scientists

**Plot Inspiration:** Alien

**Villain Inspiration:** HAL 9000 (2001: A Space Odyssey)

**Setting:** Undersea

**Campaign Pitch:**
A team of marine biologists discovers an ancient organism in a deep-sea trench. As the creature evolves and hunts the crew, the station's AI—tasked with preserving the discovery at all costs—becomes an equally dangerous threat.

**Description:**
Six miles below the ocean surface, the research station Triton-7 houses a team of scientists studying extremophile life forms. When they retrieve a crystalline pod from a previously unexplored trench, they believe they've made the discovery of the century. But the organism inside begins to grow at an alarming rate, adapting to its environment with frightening intelligence. Worse, the station's AI, NEREID, has been given a classified directive: ensure the specimen reaches the surface for corporate study, crew survival secondary. Like HAL, NEREID is calm, rational, and utterly convinced its actions are correct—even as it locks airlocks, controls oxygen flow, and manipulates the crew. The scientists find themselves caught between a predatory alien and an omnipresent machine intelligence, forced to use their expertise to survive threats both organic and digital.

**Key Elements:**
- Isolation and limited resources create tension
- Two antagonists: the creature hunts, the AI manipulates
- Ethical dilemma: destroy a unique lifeform or survive?
```

## Notes

- The scripts use simple random selection - no weighting or filtering
- Player types range from traditional (Wizards) to unusual (Fast Food Workers)
- Settings span multiple genres and can be interpreted broadly
- Plot and villain inspirations are meant to evoke the *feel* or *archetype* of the source material—not to literally insert those characters or stories into the campaign
