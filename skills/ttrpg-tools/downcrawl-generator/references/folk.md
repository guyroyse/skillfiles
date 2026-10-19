# Creating Folk

Each Folk is built in four steps:

1. **Basic Concept**: two ideas that make up the heart of the Folk
2. **Appearance**: two traits that suggest a basic look
3. **Reputation**: two words for how others see them
4. **Name**: what they're called

Then write the entry.

## 1. Basic Concept

Run `scripts/folk-idea.js` twice. Each result is an idea phrase followed by a
noun or a bracketed connection.

- **A bracketed connection**: fill it in with something specific.
  - `[Terrain]`: run `scripts/terrain.js`.
  - `[Resource]`: run `scripts/resource.js`.
  - `[Volume]`: pick a Volume from the user's Guidebook, or create an
    abbreviated Volume (see `SKILL.md`).
  - `[Folk]`: pick a Folk from the user's Folk Lore, or create an abbreviated
    Folk (see `SKILL.md`).
- **A noun already in the result** (for example `Made of Machinery` or
  `Code of conduct based around Truth`): use it as is.
- **`Roll again on this table for how they relate to <art form>`**: run
  `scripts/folk-idea.js` again. Keep the idea phrase from the new roll and
  throw away its noun or connection. The art form is the subject instead. For
  example, a reroll of `Hate [Terrain]` with Music gives "Hate Music." If the
  reroll also has its own noun built in, roll again.

Turn each result into a short, natural phrase with the connection filled in:
`Worship [Resource]` and Fungus becomes **Worship Fungus**.
`Feel superior to [Folk]` and the Allos becomes **Feel superior to Allos**.
It's fine to bend a result a little to make it work. For example,
`Their legends speak of a great [Volume]` could become **Legends speak of a
great leader**.

## 2. Appearance

Run `scripts/folk-appearance.js` twice. If a result lists examples in
parentheses, pick one of them, or come up with something along the same lines.
Write the trait the way it reads best: **Arms (many)**, **Memories (long)**,
**Smells sweet**, or **Immune to magic**.

Results can be read in many ways. "Bones and rot" with "Heat and flames"
could mean zombies with burning eyes, or a folk who paint their bodies a
bright red-orange that smells like death. **Contradictory results are the
best ones.** Huge _and_ tiny? Maybe they're huge for snails but tiny for
people, or have huge eyes but tiny teeth, or they're tiny but use mental
powers to loom large in the minds of others.

## 3. Reputation

Run `scripts/folk-reputation.js` twice. Reputation is how _others_ describe
these folk in a word or two. It's a stereotype: a broad generalization at
best, slander at worst. Maybe the Folk choose to be seen this way to hide a
deeper truth. Maybe some outsiders believe it and others believe the opposite.
Treat it as a starting point, not a complete characterization.

## 4. Name

- Write down the first, most obvious thing that comes to mind. Spider-folk
  that live in cold caves? _Ice Spiders_ or _Cold Crawlers_. Obvious names
  are easy for the players to remember.
- If you want something more fantastical, rearrange the letters until a few
  syllables sound interesting. "Ice Spiders" could become _Sedri_, _Pridic_,
  _Redisps_, or _Dris_. Adjust spelling and style as needed (_The Ridisps_,
  _Spiders of Driss_, _the Lost Sedrians_).

After the entry, offer one or two alternate names in case the user wants a
different one.

## Writing the Entry

```markdown
# [Folk Name]

**[One-sentence tagline: who they are and what drives them.]**

**Basic Concept**: [Idea 1], [Idea 2]

**Appearance**: [Trait 1], [Trait 2]

**Reputation**: [Reputation 1], [Reputation 2]

[First paragraph: what they look like and how they live. Weave the appearance
and ideas together into concrete, physical detail.]

[Second paragraph: their history, beliefs, or relationships, especially to any
Folk, Volume, or Resource named in their ideas.]

## Relationships with Other Folk

[Optional. How they get along with outsiders in general, plus a subsection for
any specific Folk they have strong feelings about.]
```

Add the relationships section only when the ideas tie the Folk to another
Folk, or when the user asks for it.

## Guidelines

- **Respect the randomness.** Don't reroll a result just because it seems
  odd. Find the interpretation that makes it interesting. You may loosely
  interpret or drop a result that truly doesn't fit, but be open to radical
  ideas first.
- **Weave the rolls together.** The best Folk turn their ideas, appearance,
  and reputation into one picture. In the Allos example below, the
  mutations, the size, the Fungus worship, and the dour reputation all come
  from the same thing: the toxic Fungi they smoke.
- **Be specific and playable.** Concrete details like a pilgrimage, a taboo,
  a strange way of speaking, or something they want from outsiders give a GM
  more to work with than general description.
- **Keep it short.** Two paragraphs, not a gazetteer.
- **Building a Folk Lore.** For a new campaign, the book suggests starting
  with at least four Folk and adding one or two between sessions. If the user
  asks for several, generate each one separately. Later Folk can use earlier
  ones for `[Folk]` connections.

## Examples

These two Folk come from the user's own Downcrawl compendium. They show the
format, tone, and length to aim for, and how two Folk can be connected through
their ideas.

```markdown
# Allos

**Massive, mutated humanoids reverently collect, catalog, and consume Fungi.**

**Basic Concept**: Disgusted by Brachions, Worship Fungus

**Appearance**: Huge, Hybrids and mutants

**Reputation**: Dour, Introspective

Standing over 12 feet tall, the Allos are massive, misshapen, and mutated due
to the toxic Fungi they worshipfully smoke. Fungi of all forms are holy to
them, but the Fungal infusions of the Everpool are the holy of holies. Bathing
there is a pilgrimage that all Allos are expected to make at least once in
their lives. More interested in inner spirituality, they are laconic and
impatient with others.

The Allos were once the slaves of the Brachions, whom they regard as unclean.
To the Allos, Brachion bathing in the sacred pool is blasphemous.

## Relationships with Other Folk

Think grumpy old man. Doesn't want to be bothered. Perfectly fine neighbors
but they tend not to make friends outside of their own.

### Brachions

Hatred and disgust. The Brachions are arrogant, aggressive, and still view
Allos as subcreatures. While Allos won't go out of their way to use violence
against one, if they are in their space, they also won't hesitate. See the
Brachions as unclean.
```

```markdown
# Brachions

**Tattooed, six-armed warriors who await the coming of their God-king.**

**Basic Concept**: Feel superior to Allos, Legends speak of a great leader

**Appearance**: Arms (many), Memories (long)

**Reputation**: Decadent, Uncivilized

The Brachions are hairless, humanoid, and have six arms that they famously use
to wield multiple knives in combat. Their history—personal, familial, and
cultural—is literally written on their bodies in white tattoos that contrast
starkly with their ebony black skin.

A once great Folk—ruling an empire that spanned Volumes—they have fallen in
power and prominence and now live as primitive tribes scattered across the
Down. Their former servants, the Allos, are still looked down upon. Brachion
legend tells of a two-armed God-king who will arise from the Everpool to unite
their scattered people, defeat their enemies, and usher in a new age.
```

### From the Downcrawl Book

Shorter entries, useful for tone or as a `[Folk]` connection when the user has
no Folk Lore yet:

- **The Catanae.** Skeleton wanderers, a dead race brought back by a
  whimsical god. They love life and music and paint their bones fantastic
  colors. Every ten years is their glorious festival, the Ebon Fantastic,
  where their souls swirl together: some new Catanae are born, others return
  to eternal sleep.
- **The Chitter.** Insectoid constructs, creepy but polite, many ceremonial
  rituals. They graft parts of living creatures to themselves, which they
  believe gives them a soul. Can be extremely persistent if they find a part
  they like, even if still attached to someone else.
- **Elltin.** Short, skittish folk terrified of water, always seeking higher
  ground. Believe in a mythical folk called the Dessicators who are destined
  to save them. Wear great colorful shells on their backs which they withdraw
  into if frightened or bored.
- **Pesh.** Gnome-sized rock folk with rough-hewn features. Can shape solid
  stone in their hands like clay, and merge into cavern walls when they
  sleep. Keen planners and administrators, often in positions of power.
