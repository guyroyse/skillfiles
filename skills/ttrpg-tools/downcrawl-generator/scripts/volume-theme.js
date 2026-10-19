const volumeThemeRelationTable = [
  'Ruled by',
  'Famous for',
  'Hostile to',
  'Unusual'
]

const volumeThemeTable = [
  'Anarchy',
  'War Zone',
  'Rebellion',
  'Colony',
  'In Decline',
  'Booming',
  'Cultural Upheaval',
  'Radical Lifestyle',
  'Failed State',
  'Second Chance',
  'Exiles',
  'Isolationist',
  'Forbidden Knowledge',
  'Impending Doom',
  'Melting Pot',
  'Quarantined',
  'Rare Magic',
  'Barely Contained Magic',
  'Ruined by Magic',
  'University',
  'Lair',
  'Monumental Project',
  'Profoundly Weird',
  'Last Bastion',
  'Trading Post',
  'Wasteland',
  'Mecca',
  'Lap of Luxury',
  'Poverty',
  'Kingdom',
  'Empire',
  'Gears and mechanisms',
  'Rare Resource',
  'Necropolis',
  'Great City',
  'Scattered Holdfasts',
  'Lazy Villages',
  'Rival Forces',
  'Dictator',
  'Decadent',
  'Library',
  'Prison',
  'Crusaders',
  'Monster City',
  'Weird City',
  'Legendary',
  'Crossroads',
  'Grand Market',
  'Utopia',
  'Mining Operation',
  'Holy Site',
  'Repugnant',
  { theme: 'Mages', subtable: volumeThemeRelationTable },
  { theme: 'Farmers', subtable: volumeThemeRelationTable },
  { theme: 'Elementals', subtable: volumeThemeRelationTable },
  { theme: 'Merchants', subtable: volumeThemeRelationTable },
  { theme: 'Nomads', subtable: volumeThemeRelationTable },
  { theme: 'Priests', subtable: volumeThemeRelationTable },
  { theme: 'Artists', subtable: volumeThemeRelationTable },
  { theme: 'Undead', subtable: volumeThemeRelationTable },
  { theme: 'Sages', subtable: volumeThemeRelationTable },
  { theme: 'Warriors', subtable: volumeThemeRelationTable },
  { theme: 'Hunters', subtable: volumeThemeRelationTable },
  { theme: 'Makers', subtable: volumeThemeRelationTable }
]

const theme =
  volumeThemeTable[Math.floor(Math.random() * volumeThemeTable.length)]

if (typeof theme === 'string') {
  console.log(theme)
} else {
  const relation =
    theme.subtable[Math.floor(Math.random() * theme.subtable.length)]
  console.log(`${relation} ${theme.theme}`)
}
