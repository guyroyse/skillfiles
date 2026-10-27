const offerTable = [
  'Information (Examples: a rumor, a secret, a name, a location)',
  'A job (Examples: an escort, a delivery, a theft, an investigation)',
  'Shelter (Examples: a room, a hiding place, a safe house, a meal and a bed)',
  'Access (Examples: an introduction, a password, a key, a place on the guest list)',
  'Goods (Examples: rare supplies, contraband, a fair price, credit)',
  'Healing (Examples: first aid, a cure, a remedy, a discreet doctor)',
  'Training (Examples: a skill, a language, a secret technique, a lesson in local customs)',
  'Transport (Examples: a ship, a mount, a vehicle, a shortcut)',
  'Directions (Examples: a map, a guide, a safe route, a way past the guards)',
  'Muscle (Examples: a bodyguard, an extra blade, a gang, a distraction)',
  'Forgery (Examples: papers, a seal, a disguise, a new identity)',
  'Black market (Examples: stolen goods, banned items, a fence, a smuggler)',
  'An alibi (Examples: a witness, a cover story, a record changed, a look the other way)',
  'Equipment (Examples: a loaned tool, a weapon, a repair, a rare part)',
  'A warning (Examples: an ambush, a trap, a traitor, a coming storm)',
  'A favor (Examples: a debt repaid, a good word, a vote, a blind eye)',
  'Lore (Examples: an old legend, a translation, an identified relic, a prophecy)',
  'Allies (Examples: their family, their crew, their guild, their congregation)',
  'A valuable object (Examples: an heirloom, a relic, a key item, a deed)',
  'Nothing, but they think they do'
]

console.log(offerTable[Math.floor(Math.random() * offerTable.length)])
