---
name: downcrawl-generator
description: Generate Folk (the strange peoples and cultures of the underworld) and Volumes (the places worth journeying to) using the random tables from Downcrawl by Aaron A. Reed. Use this when the user wants to create a Folk or a Volume, seed or grow their Folk Lore or Guidebook, or invent a new people, culture, or underground location for a Downcrawl (or any underworld/dungeon) campaign.
license: CC-BY-4.0 (Downcrawl material) and CC-BY-SA-4.0 (example Folk and Volumes). See LICENSE.md.
---

# Downcrawl Generator

Generate Folk and Volumes for [Downcrawl](https://downcrawl.textories.com/),
Aaron A. Reed's game of underworld exploration.

- **Folk** are the peoples of the Down: strange cultures and creatures for the
  players to meet, trade with, fight, and learn from. The GM keeps them in a
  catalogue called the **Folk Lore**.
- **Volumes** are the stages for the story: places of wonder and possibility
  worth journeying toward. The GM keeps them in a **Guidebook**.

The two depend on each other. A Folk's ideas can point at a Volume or another
Folk, and every Volume has Folk living in it.

## Which Workflow

- To create a **Folk**, follow [references/folk.md](references/folk.md).
- To create a **Volume**, follow [references/volume.md](references/volume.md).

Read only the reference you need. If one workflow calls for the other, use the
abbreviated version described below rather than reading the full reference
again.

## Scripts

Every table is a Node.js script in `scripts/`. Each run makes one roll and
prints the result. Run a script once for each roll the workflow calls for.

| Script               | Table                    | Used by      |
| -------------------- | ------------------------ | ------------ |
| `folk-idea.js`       | Folk Ideas + Connections | Folk         |
| `folk-appearance.js` | Folk Appearances         | Folk         |
| `folk-reputation.js` | Reputations              | Folk         |
| `volume-theme.js`    | Volume Themes            | Volume       |
| `terrain.js`         | Terrains                 | Folk, Volume |
| `resource.js`        | Resource Types           | Folk, Volume |
| `remoteness.js`      | Remoteness               | Volume       |

## The User's Folk Lore and Guidebook

Before generating, check whether the user has existing Folk or Volumes: in
the conversation, in files they've pointed you to, or on a site they've
shared. If they have, use them:

- When a Folk idea rolls `[Folk]` or `[Volume]`, pick one from their Folk Lore
  or Guidebook that makes for an interesting connection.
- When a Volume needs inhabitants, choose from their Folk Lore first (see the
  Volume reference).
- Match the format and tone of their existing entries.
- If they keep their entries as files, offer to save the new entry alongside
  them.

If they have none, or none that fit, create an abbreviated one.

## Abbreviated Folk and Volumes

When one workflow needs a Folk or Volume that doesn't exist yet, roll it up in
short form. Each is a new entry in its own right, so present it after the
main entry and offer to flesh it out later.

**Abbreviated Folk**: roll ideas, appearance, and reputation as normal, then
write only the heading, tagline, results block, and two or three sentences.

**Abbreviated Volume**: roll themes, terrain, two abundances, two scarcities,
and remoteness, then write only the heading, tagline, results block, two or
three sentences of sketch, and a one-line touchstone. Skip the Folk, People,
Places, and Seeds sections.

**Don't nest.** If an abbreviated entry rolls `[Folk]` or `[Volume]` itself,
connect it back to the entry that spawned it, or to something already in the
user's Folk Lore or Guidebook. Never create a third generation.

## Attribution

The Folk and Volume creation methods, tables, and book examples are adapted
from _Downcrawl_ (First Edition, 2019) by Aaron A. Reed, licensed under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). See
[LICENSE.md](LICENSE.md) for details and changes.
