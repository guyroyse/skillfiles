const problemTable = [
  'Money (Examples: debt, poverty, a bad investment, an expensive habit)',
  'A loved one in trouble — roll again for their trouble',
  'Heartbreak (Examples: unrequited love, a failed marriage, an affair, a jilted lover)',
  'Addiction (Examples: drink, drugs, gambling, magic)',
  'A bad superior (Examples: hostile boss, demanding patron, cruel master, scheming commander)',
  'Poor health (Examples: chronic illness, old wound, curse, failing body)',
  'Trapped (Examples: hated job, loveless marriage, oppressive family, indenture)',
  'Hunted (Examples: assassin, monster, creditor, vengeful enemy)',
  'A disastrous goal (Examples: forbidden research, doomed quest, impossible revenge, bad plan)',
  'A rival (Examples: business competitor, sibling, former friend, nemesis)',
  'A secret about to come out (Examples: crime, affair, true identity, forbidden belief)',
  'Wanted (Examples: by the law, by a church, by a crime lord, by a foreign power)',
  'Loss (Examples: heirloom, home, reputation, memories)',
  'Guilt (Examples: a death they caused, a betrayal, an act of cowardice, an abandoned family)',
  'Grief (Examples: dead spouse, lost child, fallen comrade, vanished friend)',
  'Obligation (Examples: oath, life debt, sworn duty, binding contract)',
  'Shunned (Examples: exiled, excommunicated, blacklisted, disowned)',
  'Haunted (Examples: ghost, curse, nightmares, prophecy)',
  'Out of their depth (Examples: sudden promotion, inherited responsibility, a lie that got out of hand, impostor)',
  'Family conflict (Examples: feuding siblings, disapproving parent, inheritance dispute, arranged marriage)',
  'No problems worth mentioning'
]

console.log(problemTable[Math.floor(Math.random() * problemTable.length)])
