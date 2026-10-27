const mannerismTable = [
  'Voice (Examples: booming, breathy, singsong, gravelly)',
  'Accent (Examples: thick, put-on, shifting, from somewhere unexpected)',
  'Speech (Examples: formal, slangy, rambling, terse)',
  'Laugh (Examples: braying, nervous, at their own jokes, never)',
  'Hands (Examples: fidgety, wild gestures, cracking knuckles, always hidden)',
  'Eyes (Examples: never meets your gaze, stares, squints, winks)',
  'Personal space (Examples: stands too close, keeps away, touchy, blocks the door)',
  'Posture (Examples: slouching, ramrod straight, leaning on things, pacing)',
  'Catchphrase (Examples: a saying, an oath, a pet name for everyone, a verbal tic)',
  'Noises (Examples: humming, whistling, sighing, sniffing)',
  'Appetite (Examples: always eating, always drinking, offering food, smoking)',
  'Fiddling (Examples: a coin, a ring, a knife, a pipe)',
  'Grooming (Examples: smoothing hair, adjusting clothes, checking reflection, picking teeth)',
  'Names (Examples: forgets them, mispronounces them, uses full titles, invents nicknames)',
  'Storytelling (Examples: tangents, name-dropping, exaggeration, old war stories)',
  'Nerves (Examples: stammering, sweating, watching the door, over-apologizing)',
  'Familiarity (Examples: calls everyone friend, overshares, backslaps, flirts)',
  'Distraction (Examples: daydreaming, doing two things at once, losing the thread, counting things)',
  'Superstition (Examples: knocking wood, warding signs, a lucky charm, avoiding a number)',
  'Questions (Examples: answers with questions, asks too many, never asks, interrogates)'
]

console.log(mannerismTable[Math.floor(Math.random() * mannerismTable.length)])
