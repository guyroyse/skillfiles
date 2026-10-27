const backgroundTable = [
  'Underclass (Examples: destitute, indentured, slum-born, outlawed caste)',
  'Commoners (Examples: peasants, townsfolk, working families, citizens)',
  'Middle class (Examples: guild families, shopkeepers, yeomen, bourgeois)',
  'Upper class (Examples: gentry, old money, landed families, magnates)',
  'Elites (Examples: nobility, ruling dynasties, high priesthood, oligarchs)',
  'Fallen (Examples: disgraced nobles, bankrupt merchants, a house that lost a war)',
  'Nomads (Examples: caravan folk, sea-born, travelers, seasonal herders)',
  'Institutional (Examples: orphanage, monastery, military academy, guild)',
  'Minority (Examples: ethnic, religious, ancestral, cultural) — roll again for their background',
  'Outlanders (Examples: neighboring realms, distant lands, rare ancestry, otherworldly) — roll again for their background'
]

console.log(backgroundTable[Math.floor(Math.random() * backgroundTable.length)])
