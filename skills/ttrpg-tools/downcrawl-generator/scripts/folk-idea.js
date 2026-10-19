const folkIdeaConnectionTable = [
  '[Terrain]',
  '[Resource]',
  '[Volume]',
  '[Folk]'
]

const folkIdeaTable = [
  { idea: 'Experts', subtable: folkIdeaConnectionTable },
  { idea: 'Strange relationship', subtable: folkIdeaConnectionTable },
  { idea: 'Worship', subtable: folkIdeaConnectionTable },
  { idea: 'Conceptual opposite', subtable: folkIdeaConnectionTable },
  { idea: 'Love', subtable: folkIdeaConnectionTable },
  { idea: 'Trade for/with', subtable: folkIdeaConnectionTable },
  { idea: 'Need', subtable: folkIdeaConnectionTable },
  { idea: 'Hate', subtable: folkIdeaConnectionTable },
  { idea: 'Hunt for/in', subtable: folkIdeaConnectionTable },
  { idea: 'Disgusted by', subtable: folkIdeaConnectionTable },
  { idea: 'Protect', subtable: folkIdeaConnectionTable },
  { idea: 'Perfected survival in/with', subtable: folkIdeaConnectionTable },
  { idea: 'Create', subtable: folkIdeaConnectionTable },
  { idea: 'Destroy', subtable: folkIdeaConnectionTable },
  { idea: 'Known for', subtable: folkIdeaConnectionTable },
  { idea: "Can't come near", subtable: folkIdeaConnectionTable },
  { idea: 'Searching for the perfect', subtable: folkIdeaConnectionTable },
  { idea: 'Were once almost destroyed by', subtable: folkIdeaConnectionTable },
  { idea: 'Evolved to live in/with', subtable: folkIdeaConnectionTable },
  { idea: 'Exiled from/by', subtable: folkIdeaConnectionTable },
  { idea: 'Rarely venture far from', subtable: folkIdeaConnectionTable },
  { idea: 'Escaping', subtable: folkIdeaConnectionTable },
  { idea: 'Their legends speak of a great', subtable: folkIdeaConnectionTable },
  { idea: 'Feel superior to', subtable: folkIdeaConnectionTable },
  { idea: 'Mental/mystical connection to', subtable: folkIdeaConnectionTable },
  { idea: 'Parasites of', subtable: folkIdeaConnectionTable },
  { idea: 'Want to improve', subtable: folkIdeaConnectionTable },
  {
    idea: 'Only once in their lives do they approach',
    subtable: folkIdeaConnectionTable
  },
  { idea: 'Symbolic affinity', subtable: folkIdeaConnectionTable },
  { idea: 'Extremists', subtable: folkIdeaConnectionTable },
  { idea: 'Love/Hate relationship', subtable: folkIdeaConnectionTable },
  { idea: 'Exploit', subtable: folkIdeaConnectionTable },
  {
    idea: 'Made of',
    subtable: ['Machinery', 'a Primal Element', 'Hybrid Parts', 'Dead Pieces']
  },
  {
    idea: 'Great makers in the domain of',
    subtable: ['War', 'Work', 'Food', 'Infrastructure', 'Textiles', 'Art']
  },
  {
    idea: 'Navel-gazing, devoted to their own',
    subtable: ['Minds', 'Bodies', 'Beliefs', 'Works']
  },
  {
    idea: 'Code of conduct based around',
    subtable: ['Honor', 'Truth', 'Aesthetics', 'Economics']
  },
  {
    idea: 'Gender',
    subtable: [
      'One',
      'Performative',
      'Three',
      'Changeable',
      'Private',
      'Unimportant',
      'Unequal',
      'Complex'
    ]
  },
  {
    idea: 'Roll again on this table for how they relate to',
    subtable: [
      'Music',
      'Performance',
      'Sculpture',
      'Painting',
      'Stories',
      'Architecture'
    ]
  },
  {
    idea: 'Reproduction',
    subtable: ['Egg-laying', 'Mitosis', 'Recruitment', 'Rare']
  },
  {
    idea: 'Language based on',
    subtable: ['Light', 'Subsonics', 'Smell', 'Movement']
  }
]

const idea = folkIdeaTable[Math.floor(Math.random() * folkIdeaTable.length)]
const connection =
  idea.subtable[Math.floor(Math.random() * idea.subtable.length)]

console.log(`${idea.idea} ${connection}`)
