const secretTable = [
  'A crime (Examples: murder, theft, smuggling, arson)',
  'A hidden identity (Examples: false name, secret heir, deserter, disguised noble)',
  'Forbidden love (Examples: an affair, a rival, an enemy, someone above or below their station)',
  'Hidden loyalty (Examples: spy, informant, cultist, double agent)',
  'A dangerous debt (Examples: to a crime lord, a cult, a dark power, a former friend)',
  'Forbidden power (Examples: magic, psionics, illegal implants, a curse)',
  'Hidden wealth (Examples: buried treasure, a secret account, stolen goods, an inheritance)',
  'A hidden person (Examples: a fugitive in the cellar, a secret child, a captive, a twin)',
  'Fraud (Examples: fake credentials, forged documents, cooked books, a staged miracle)',
  'A witness (Examples: saw a murder, overheard a plot, knows where bodies are buried, has proof)',
  'A hidden weakness (Examples: an illness, an addiction, a phobia, failing senses)',
  'A betrayal (Examples: sold out a friend, informed on family, broke an oath, abandoned a comrade)',
  'Forbidden belief (Examples: heresy, revolution, a banned faith, loyalty to the old regime)',
  'Hidden knowledge (Examples: a treasure map, a secret passage, a password, a lost recipe)',
  'Not what they seem (Examples: shapeshifter, undead, android, possessed)',
  'Blackmail (Examples: blackmailing someone, being blackmailed, holding letters, keeping a ledger)',
  "A false reputation (Examples: a fake hero, took someone else's credit, fled the battle, never actually did it)",
  'A hidden skill (Examples: trained killer, former master, gifted forger, retired thief)',
  'A dark past (Examples: former cultist, ex-pirate, war criminal, reformed monster)'
]

console.log(secretTable[Math.floor(Math.random() * secretTable.length)])
