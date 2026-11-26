// PostToolUse hook: formats a Markdown file with Prettier after Claude writes
// or edits it. Reads the hook payload from stdin.

const { execFileSync } = require('node:child_process')

let input = ''
process.stdin.on('data', chunk => (input += chunk))
process.stdin.on('end', () => {
  const payload = JSON.parse(input)
  const filePath =
    payload.tool_input?.file_path ?? payload.tool_response?.filePath ?? ''

  if (!filePath.endsWith('.md')) return

  execFileSync('npx', ['--yes', 'prettier', '--write', filePath], {
    stdio: 'ignore'
  })
})
