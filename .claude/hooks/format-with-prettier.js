/*
  PostToolUse hook: formats any file Claude writes or edits in this repo with
  Prettier. Files outside the repo, and files Prettier can't parse, are skipped.
  Reads the hook payload from stdin.
*/

const { execFileSync } = require('node:child_process')
const path = require('node:path')

function insideProject(filePath) {
  const projectDir = process.env.CLAUDE_PROJECT_DIR
  if (!projectDir) return false

  const relative = path.relative(projectDir, path.resolve(filePath))
  return (
    relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative)
  )
}

let input = ''
process.stdin.on('data', chunk => (input += chunk))
process.stdin.on('end', () => {
  const payload = JSON.parse(input)
  const filePath =
    payload.tool_input?.file_path ?? payload.tool_response?.filePath ?? ''

  if (!filePath || !insideProject(filePath)) return

  execFileSync(
    'npx',
    ['--yes', 'prettier', '--write', '--ignore-unknown', filePath],
    { stdio: 'ignore' }
  )
})
