/*
  PostToolUse hook: formats any file Claude writes or edits with Prettier.
  Files Prettier can't parse are skipped. Reads the hook payload from stdin.
*/

const { execFileSync } = require('node:child_process')

let input = ''
process.stdin.on('data', chunk => (input += chunk))
process.stdin.on('end', () => {
  const payload = JSON.parse(input)
  const filePath =
    payload.tool_input?.file_path ?? payload.tool_response?.filePath ?? ''

  if (!filePath) return

  execFileSync(
    'npx',
    ['--yes', 'prettier', '--write', '--ignore-unknown', filePath],
    { stdio: 'ignore' }
  )
})
