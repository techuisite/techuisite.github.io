import { execFileSync } from 'node:child_process';

// Old posts retain their original recorded dates. New posts use the commit that
// first added their file; later edits, builds, and renames keep that date.
export function publicationDate(filename, dates, root, { allowHistoryFetch = true } = {}) {
  if (dates[filename]) return new Date(dates[filename]).toISOString();
  const git = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  if (git(['rev-parse', '--is-shallow-repository']) === 'true') {
    if (!allowHistoryFetch) throw new Error('Full Git history is required to preserve publication dates.');
    git(['fetch', '--unshallow', '--no-tags', 'origin']);
  }
  const filePath = `src/content/blog/${filename}`;
  // Follow renames to the original path and check legacy dates along the way.
  const history = git(['log', '--first-parent', '--follow', '--format=', '--name-only', '--', filePath]).split('\n');
  for (const path of history) {
    const oldName = path.replace(/^src\/content\/blog\//, '');
    if (dates[oldName]) return new Date(dates[oldName]).toISOString();
  }
  const additions = git(['log', '--first-parent', '--follow', '--diff-filter=A', '--format=%cI', '--', filePath]).split('\n').filter(Boolean);
  if (!additions.length) throw new Error(`${filename}: commit this new post to Git to record its publication date.`);
  return new Date(additions.at(-1)).toISOString();
}
