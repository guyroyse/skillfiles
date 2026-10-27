const stationTable = [
  'Criminal (Examples: thug, smuggler, con artist, fence)',
  'Menial (Examples: servant, janitor, dishwasher, stablehand)',
  'Laborer (Examples: miner, dockworker, porter, factory hand)',
  'Tradesperson (Examples: smith, mechanic, tailor, technician)',
  'Scholar (Examples: scribe, teacher, scientist, archivist)',
  'Merchant (Examples: shopkeeper, banker, trader, fixer)',
  'Official (Examples: bureaucrat, clerk, magistrate, inspector)',
  'Martial (Examples: soldier, guard, officer, mercenary)',
  'Clergy (Examples: priest, monk, cultist, missionary)',
  'Leader (Examples: noble, mayor, executive, crime boss)',
  'Farmer (Examples: farmer, herder, fisher, rancher)',
  'Healer (Examples: physician, herbalist, medic, midwife)',
  'Entertainer (Examples: bard, actor, gladiator, celebrity)',
  'Traveler (Examples: sailor, pilot, caravaneer, scout)',
  'Outcast (Examples: hermit, exile, drifter, beggar)'
]

console.log(stationTable[Math.floor(Math.random() * stationTable.length)])
