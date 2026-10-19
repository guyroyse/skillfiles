// Indexed by the total of d20 + d10, from 2 to 30. Results in the middle of
// the table come up more often than those at either end.
const resourceTable = [
  'Privacy',
  'Fuzz',
  'Harmless Animals',
  'Leaders',
  'Buildings',
  'Defenses',
  'Skilled Labor',
  'Tack',
  'Food',
  'Magic',
  'Useful Animals',
  'Trade',
  'Wealth',
  'Light',
  'Monsters',
  'Fungus',
  'Water',
  'Heat',
  'Drugs',
  'People',
  'Religion',
  'Safety',
  'Community',
  'Art/Culture',
  'Patience',
  'Medicine/Healing',
  'Air',
  'Open Space',
  'Knowledge'
]

const d20 = Math.floor(Math.random() * 20) + 1
const d10 = Math.floor(Math.random() * 10) + 1

console.log(resourceTable[d20 + d10 - 2])
