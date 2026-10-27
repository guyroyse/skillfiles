---
name: npc-generator
description: Generate memorable non-player characters for tabletop RPGs by rolling on random tables and weaving the results into a cohesive character. Use this when the user wants an NPC, a quick character for a scene, a shopkeeper, villain, ally, or any other person for their players to meet.
---

# NPC Generator

Generate NPCs for tabletop role-playing games by rolling on a set of random
tables and turning the results into a single, cohesive character.

## Scripts

Every table is a Node.js script in `scripts/`. Each run makes one roll and
prints the result. Run a script once for each roll the workflow calls for.

| Script          | Table                     | Rolled    |
| --------------- | ------------------------- | --------- |
| `gender.js`     | Gender                    | Always    |
| `age.js`        | Age                       | Always    |
| `background.js` | Background                | Always    |
| `station.js`    | Station (role in society) | Always    |
| `problem.js`    | Biggest Problem           | Always    |
| `want.js`       | Greatest Desire           | Always    |
| `trait.js`      | Most Obvious Trait        | Always    |
| `mannerism.js`  | Mannerism                 | Always    |
| `secret.js`     | Secret                    | Sometimes |
| `offer.js`      | Offer                     | Sometimes |

## Rerolls

Some results tell you to roll again. When one does, run the same script again
and combine the two results:

- **Background**: a Minority or Outlanders result takes its background from
  the reroll, such as "Outlanders (Upper class)". Decide how far an Outlander
  has come, from a familiar neighbor to someone whose like the locals have
  never seen, based on what makes the most interesting character.
- **Problem**: "A loved one in trouble" takes the loved one's trouble from the
  reroll, such as "A loved one in trouble (Addiction)".
- **Secret**: "A secret about to come out" always rolls a Secret to say what
  it is.

If the reroll makes no sense in context, like a second roll-again result or a
loved one with no problems worth mentioning, roll again until it does. A
problem rerolled for a loved one is the loved one's problem, but it should
still weigh on the NPC.

## Secrets and Offers

Not every NPC has a secret or something to give the players. Roll Secret and
Offer only when the other results or the user's request call for them.

**Roll a Secret** when:

- The Problem is a secret about to come out, Guilt, Hunted, Wanted, Haunted,
  or Shunned.
- The Background is Fallen or Outlanders.
- The Station is Criminal, Official, Clergy, or Leader.
- The user wants a villain, a suspect, or an NPC with depth.

**Roll an Offer** when:

- The Station gives them something to trade, such as Merchant, Official,
  Leader, Healer, Traveler, Scholar, or Criminal.
- The Want needs help from someone like the players, such as Revenge,
  Justice, Answers, Safety, or To help someone.
- The user wants a quest giver, a contact, a patron, or an ally.

These are guides, not rules. If a result makes a secret or an offer feel
natural, roll it. If none of them do, leave it out.

## Workflow

1. **Gather context.** Check whether the user has given you a setting,
   location, role, or anything else the NPC needs to fit. Use it to interpret
   the rolls, not to replace them.
2. **Roll.** Run every script marked Always. Then decide whether to roll a
   Secret and an Offer, as described above.
3. **Interpret.** Find the connections between the results. When two rolls
   seem to clash, the tension between them is usually the most interesting
   thing about the character. Treat the Station as a category and pick or
   invent a role that fits the setting. Background is the class they were
   born into and Station is what they do now. An elite-born beggar or an
   underclass mayor has a story worth telling. The Mannerism is how the GM
   plays them at the table. A Secret is something the players might uncover,
   and it's strongest when it ties to their Problem or Want. An Offer is what
   they can give the players, and their Want is usually the price.
4. **Present** the NPC in the format below.

## Output Format

Present each NPC like this:

```
**[Name]**: [a one-line tagline the GM can say out loud]

_[Gender] · [Age] · [Background] · [Station] · [Problem] · [Want] · [Trait] · [Mannerism] · [Secret] · [Offer]_

[Two or three sentences that turn the rolls into one person: who they are,
how they got here, and why the pieces fit or clash.]

- **Play them:** [The Mannerism as something the GM can perform.]
- **Wants:** [The Want as something the players can act on.]
- **Secret:** [What the players might uncover.]
- **Offer:** [What they can give the players.]
- **Hook:** [Why the players would get involved with them right now.]
```

- **Name** them to fit the setting and their Background.
- **The rolls line** lists every result, using the label for each (such as
  "Outcast", not the examples), so the GM can see what you worked from.
- **The Problem and Trait** belong in the prose, not in their own lines.
- **Leave out** the Secret and Offer, in both the rolls line and the list,
  when you didn't roll them.
- **Always include a Hook.** An NPC without one tends to just stand there.

If the user asks for several NPCs, roll each one separately.

## Example

Rolls: Male, Young adult, Minority (rerolled: Upper class), Outcast, A rival,
Family, Honesty, Grooming. Nothing called for a Secret or an Offer.

```
**Tobin Asheri**: a disowned heir who sleeps rough but keeps his collar
straight

_Male · Young adult · Minority (Upper class) · Outcast · A rival · Family · Honesty · Grooming_

Tobin was born to the Asheri, a wealthy family of an old minority faith that
keeps to itself. When his older brother Calder cheated a business partner,
Tobin told the truth about it in front of the elders, and the family closed
ranks around Calder and turned Tobin out. He drifts now, honest to a fault,
and Calder makes sure no door in the community opens to him.

- **Play them:** Constantly smooths a threadbare coat and straightens a
  collar long past saving. Answers every question bluntly, even when it
  costs him.
- **Wants:** To be welcomed home by his mother, but he won't lie to get there.
- **Hook:** Calder needs a witness to swear he was elsewhere on a certain
  night, and he's offered to bring Tobin home in exchange.
```

## Guidelines

- **Respect the randomness.** Don't reroll a result because it seems odd. Find
  the creative potential in it instead.
- **Make them playable.** Give the GM something they can use at the table: a
  voice, a want, a reason to talk to the players.
- **Keep it concise.** An NPC should fit on an index card.

## Credits

Table structure inspired by _Stars Without Number_ by Kevin Crawford (Sine
Nomine Publishing).
