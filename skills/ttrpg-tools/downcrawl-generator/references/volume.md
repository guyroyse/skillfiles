# Creating Volumes

A Volume is built in nine steps:

1. **Themes**: two themes that set the volume's character
2. **Terrain**: two terrains that set its physical environment
3. **Sketch**: a couple of sentences that pull it all together
4. **Name**: what it's called
5. **Abundant and Scarce**: what's plentiful here and what's hard to find
6. **Inhabitants**: the Folk who live here
7. **Remoteness**: how hard it is to find
8. **Touchstone**: the one massively strange and wonderful thing here
9. **Opportunities**: People, Places, and Seeds for the players to find

Then write the entry.

## 1. Themes

If the user already has a concept for the volume (say, a pitch-black prison
fortress), use it instead of rolling. Otherwise, run `scripts/volume-theme.js`
twice.

## 2. Terrain

Run `scripts/terrain.js` twice. Two-word results (like "Winding Canyons")
are already mixed and matched from the book's table, so they can be unusual
combinations. Lean into that.

## 3. Sketch

Let the themes and terrain sit for a moment, then reconcile them into a
coherent whole. Write down the spark of an idea in a couple of sentences.

For example, "Decadent" and "Weird City" with "Island" and "Narrow Galleries"
might suggest a city on an island in the center of a vast underground lake.
Maybe it's tightly packed, a cube of crushed-together streets and alleyways,
filled with wealthy urbanites obsessed with some decadent pleasure. Gourmands,
say. Maybe the city is famous for its ruinously expensive restaurants, where
the most delicious fungus in the world is served.

## 4. Name

It's okay to be obvious: "The Icy Caverns" is fine. To punch it up, reach for
obscure or archaic synonyms ("The Rime Grottos," "The Burrows of Frigid
Winds"). After the entry, offer one or two alternate names.

## 5. Abundant and Scarce

Based on the sketch:

- **Choose** one resource that's abundant and one that's scarce. Pick from the
  Resource Types in `scripts/resource.js`.
- Then run `scripts/resource.js` twice more. Assign one result as a second
  abundance and the other as a second scarcity, whichever way fits better.

Add or remove one if the fiction suggests it.

## 6. Inhabitants

Choose two Folk commonly found here:

- one Folk the players have encountered before
- one Folk they haven't

Take them from the user's Folk Lore when you can. Ask which Folk the players
have met if it isn't clear. If the Folk Lore is empty or nothing fits, create
new Folk with the full process in [folk.md](folk.md). Their Basic Concepts
can connect to this Volume and to each other.

Then decide how the two relate in this volume: friendship, subjugation,
indifference, uneasy alliance? How do the residents here differ from each
Folk's usual norms and reputation?

Alternatively, the volume might be a true melting pot where folk of all kinds
are found, an isolated monoculture where outsiders are rare, or a lonely place
with few or no inhabitants.

## 7. Remoteness

If the fiction already implies how hard this volume is to find, use that.
Otherwise run `scripts/remoteness.js`. Record just the word (Well-Known,
Sheltered, or Secret). The base difficulty is for the GM's reference.

## 8. Touchstone

Every volume has a touchstone: something massively strange and massively
wonderful. It might be the coolest thing here, something that represents the
place as a whole, the reason it exists, or something hidden. Whatever it is,
the party will hear about it and probably interact with it.

There's no table: grow it from everything created so far. A few nudges:
palace, tavern, library, dungeon, festival, university, tower, fortress,
curiosity shoppe, ossuary, avenue, speakeasy, specialty market, zoo, monument,
haunted battlefield, queen, art gallery, secret garden, arena, exclusive club,
salon, bookshop, vista, town square, park, grove, clock, factory, machine,
wonder of the Down, map, castle, immortal, pier, ride, train, wall, theater,
circus, tomb, portal, pit, temple, graveyard, mystery, competition,
phenomenon.

## 9. Opportunities

Come up with intriguing hooks for the players, pulling from everything above.
Sort them into:

- **People**: three or four NPCs, each with a name and a sentence or two
  covering who they are and what they want, know, or need. Draw them from the
  inhabiting Folk, and include at least one who cuts against their Folk's
  reputation.
- **Places**: three or four locations in the volume, a sentence or two each.
  Leave a question open: who built it, what lurks there, why it was abandoned.
- **Seeds**: one or two events or dangers the party can't help but get caught
  up in.

Some ways to brainstorm:

- **Reversal.** Take something ordinary and flip a key quality: a tiny
  dragon, a kindly vampire, a frozen fountain, unspendable money. Why does it
  exist here, and where would it be found?
- **Danger.** What threat lives in this volume or is drawn to it? Lava caverns
  might have flame-wolves and the ruthless guild that hunts them. How does
  the danger make itself known?
- **Only here.** What could happen only in this place? Worm breeders might
  hold worm races. In a temple of shadow, lighting a lamp might be the ultimate
  blasphemy. When does it happen, and how do the players get involved?

Keep opportunities open-ended. A sentence or two each is plenty.

## Writing the Entry

```markdown
# [Volume Name]

**[One-sentence tagline: who is here, doing what, in what kind of place.]**

**Themes**: [Theme 1], [Theme 2]

**Terrain**: [Terrain 1], [Terrain 2]

**Abundant**: [Resource], [Resource]

**Scarce**: [Resource], [Resource]

**Remoteness**: [Well-Known | Sheltered | Secret]

[Three to six paragraphs. Open with the terrain and how it feels to arrive.
Then the settlements or structures, the inhabitants and how they live, and
the tension between them. Show the themes and resources in the description
rather than naming them.]

## [Touchstone Name]

[A paragraph or two on the touchstone: what it looks like, why it matters,
and what happens when someone interacts with it.]

## Folk

### [Folk Name]

[Their results block (Basic Concept, Appearance, Reputation), if they are new
or the user's Folk Lore isn't at hand. Then a paragraph on how this Folk lives
in this particular volume.]

### [Folk Name]

[Same as above.]

## People

### [NPC Name]

[A sentence or two.]

## Places

### [Place Name]

[A sentence or two.]

## Seeds

- [An event or danger.]
```

Name the touchstone section after the touchstone itself (for example, "The
Everpool"), not "Touchstone."

## Guidelines

- **Respect the randomness.** Find the interpretation that makes odd results
  interesting rather than rerolling them. You may drop a result that truly
  doesn't fit, but be open to radical ideas first.
- **Make it feel physical.** Describe light, temperature, sound, texture, and
  how people get around. A volume should feel like a place you could get lost
  in.
- **Build in conflict.** The relationship between the two Folk, a scarce
  resource, or the touchstone itself should give the players something to get
  tangled up in.
- **More than the players will see.** The book encourages creating more
  volumes than the players will ever visit. Hints about distant places make
  the Down feel huge and endless.

## Example

This volume comes from the user's own Downcrawl compendium. It shows the
format, tone, and length to aim for. The Allos and Brachions it mentions are
the example Folk in [folk.md](folk.md).

```markdown
# Canyon Falls

**Zealots fight in an ancient and alien city that looms in forgotten
canyons.**

**Themes**: Rival Forces, Weird City

**Terrain**: Vertical Rivers, Winding Canyons

**Abundant**: Fungi, Religion, Water

**Scarce**: Trade, Wealth

**Remoteness**: Secret

There are few entrances, and fewer visitors, to these deep and meandering
ravines. Torrents, streams, and dribbles fall thousands of feet from openings
far above before flowing along the mesas, walls, and canyon floors. On the
shores of these flows grow Fungi, becoming ever more fecund as the rivers join
and widen and eventually enter the City.

No one knows the name of the City. It is merely the City. Its buildings are
tall, rounded, metallic, and alien. Sleek, slick, and covered with fungal
growth, there are no openings. They are blood-warm to the touch and a faint
double pulsing can be felt beneath their surface.

Some say the buildings of the City look alive. Others say they _are_ alive. If
you look at a building, turn, and look again, sometimes it changes. Sometimes
it might even open. But if one dares to enter, they should hurry, lest they be
trapped within.

Wide canals, glowing with miniature luminescent life, flow through the City,
between the buildings, and toward the City's center. Narrow walkways, slick
with moisture and growth, follow alongside the canals with an occasional
bridge over or set of stairs down to, the water.

Not far outside—and on opposite sides of—the City, the Allos and the Brachion
live in tents and pavilions pitched along the shores of two of the widest
rivers that flow into and between the dark towers of the City. Both groups
believe the City to be a holy site and send pilgrims to bathe in the living
water of the Everpool at the center of the City.

The Brachion are crude, uncivilized, and understand perfectly that they are
superior to the mutated and misshapen Allos. The Allos, taciturn and surly,
have no words and no patience for the uncouth Brachions. More than just
pilgrims, both sides send warriors into the City. Conflict is common. The dark
flow of blood is often added to the glowing flow of water between the strange
towers.

## The Everpool

All of the canals in the City ultimately come to a single, central, and
perfectly circular reservoir hundreds of feet in diameter. The walkways
terminate at an enormous, stepped quay ringing the Everpool and inviting
visitors to enter. Bridges connect the ring where the canals enter. Various
colors of glow flow and merge at the edges of the Everpool, speckled with
bright motes. At the center is a hole in the water where a calm yet powerful
laminar flow takes from the reservoir what the canals put in, dumping it
beyond sight into unknowable depths.

Bathing in the water induces deeply meaningful hallucinations and creates a
random Fungal Effect. However, there is risk as the current is strong and the
hole in the water is impossibly deep. Only the brave, the foolish, or the true
believer dare swim in the waters of the Everpool.

## Folk

### Allos

**Basic Concept**: Disgusted by Brachions, Worship Fungus

**Appearance**: Huge, Hybrids and mutants

**Reputation**: Dour, Introspective

Standing over 12 feet tall, the Allos are massive, misshapen, and mutated due
to the toxic Fungi they worshipfully smoke. Fungi of all forms are holy to
them, but the Fungal infusions of the Everpool are the holy of holies. Bathing
there is a pilgrimage that all Allos are expected to make at least once in
their lives.

### Brachion

**Basic Concept**: Feel superior to Allos, Legends speak of a great leader

**Appearance**: Arms (many), Memories (long)

**Reputation**: Decadent, Uncivilized

Brachion legend tells of a two-armed God-king who will arise from the Everpool
to unite their scattered people, defeat their enemies, and usher in a new age.

## People

### Ji-rab

Mute leader of the Brachions. She communicates using Fuzz.

### Son-rab

Mystic who has amputated four of his arms—three on the right and one on the
left—believing he is the prophesied God-king. Frequently bathes in the
Everpool. Could he be the one?

### Ormon

Outcast Allos heretic trying to bring peace between the Allos and the
Brachions. He has more supporters than believed.

### Umatrum

High priest of the Allos camp. Very knowledgeable about Fungi. Seeks someone
brave (or foolish) to seek a particularly hard-to-find Fungus.

## Places

### Cave of Knowledge

Wise and telepathic Fungi share their knowledge with those who make the proper
sacrifice. The Allos would believe this place holy if they knew of it.

### Fungal Circles

Rings of Fungi found throughout the canyons said to make magic less
predictable—inhibiting, amplifying, and randomizing its effects.

### The Narrows

Narrow, shoreless flows with dangerous rapids. A predator lurks nearby.

### Hermit Falls

Box canyon with numerous and voluminous falls pouring over the edge. A deaf
hermit of another Folk lives here.
```
