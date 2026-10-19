// Results 1-60 are two-word terrains, each covering two numbers on the d100.
// Their words can be mixed and matched with another two-word result, so the
// second word comes from a separate roll.
const twoWordTerrainTable = [
  ['Obsidian', 'Galleries'],
  ['Granite', 'Cliffs'],
  ['Winding', 'Road'],
  ['Fractured', 'Badlands'],
  ['Deep', 'Trench'],
  ['Narrow', 'Labyrinth'],
  ['Spacious', 'Passages'],
  ['Vertical', 'Junction'],
  ['Steep', 'Causeways'],
  ['Flooded', 'Caverns'],
  ['Dripping', 'Mines'],
  ['Muddy', 'Riverbed'],
  ['Sandy', 'Plains'],
  ['Crumbling', 'Crypts'],
  ['Sulfur', 'Vents'],
  ['Ice', 'Caves'],
  ['Misty', 'Warrens'],
  ['Marshy', 'Meadows'],
  ['Artificial', 'Shafts'],
  ['Crystal', 'Jumble'],
  ['Gem-studded', 'Grottos'],
  ['Endless', 'Ruins'],
  ['Fungus-choked', 'Crawlways'],
  ['Lava', 'Wasteland'],
  ['Noxious', 'Tunnels'],
  ["Giant's", 'Halls'],
  ['Jagged', 'Canyons'],
  ['Ashen', 'Shore'],
  ['Steaming', 'Chasms'],
  ['Haunted', 'Maze']
]

// Results 61-00 are single terrains, each covering one number on the d100.
const singleTerrainTable = [
  'Wormcasts',
  'Lava Tubes',
  'Vertical Rivers',
  'Suspended over dropoff',
  'Edge',
  'River System',
  'Underground Sea',
  'Magical Darkness',
  'Flowing Magma',
  'Wildlife Refuge',
  'Flowstone Wonderland',
  'Ooze',
  'Roots of the Earthtree',
  'Fungal Jungle',
  'Sandstone Arches',
  'Boulder Fields and Scree',
  'Massive Pillars',
  'Seismically Unstable',
  'Twisted',
  'Mostly Underwater',
  'Enchanted',
  'Cavern Network',
  'Vast Chamber',
  'Geysers',
  'Sand Dunes',
  'Antimagic Zone',
  'Veins of Ore',
  'Mushroom Forest',
  'Rushing Wind',
  'Spider Burrows',
  'Salt Mines',
  'Island',
  'Ancient Battlefield',
  'Railroad',
  'Ossuary',
  'Nesting Grounds',
  'Hunting Grounds',
  'Hot Springs',
  'Migration Route',
  'Strange Physics (Examples: gravity, motion, time)'
]

const roll = Math.floor(Math.random() * 100) + 1

if (roll <= 60) {
  const [firstWord] = twoWordTerrainTable[Math.floor((roll - 1) / 2)]
  const [, secondWord] =
    twoWordTerrainTable[Math.floor(Math.random() * twoWordTerrainTable.length)]
  console.log(`${firstWord} ${secondWord}`)
} else {
  console.log(singleTerrainTable[roll - 61])
}
