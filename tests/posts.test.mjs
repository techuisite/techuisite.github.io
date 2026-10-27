import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { parsePost, postId, bodyMetadata } from '../src/utils/post-format.mjs';
import { publicationDate } from '../src/utils/publication-date.mjs';

test('plain and linked headings yield one title and remove only the opening heading', () => {
  assert.deepEqual(parsePost('# An *iPad* thought\n\nHello.\n\n## More\n\nDetails.'), {
    title: 'An iPad thought', link: undefined, body: 'Hello.\n\n## More\n\nDetails.',
  });
  assert.deepEqual(parsePost('# [An article](https://example.com/story)\n\nMy commentary.'), {
    title: 'An article', link: 'https://example.com/story', body: 'My commentary.',
  });
  assert.equal(parsePost('# [Reference][article]\n\nCommentary.\n\n[article]: https://example.com/story').link, 'https://example.com/story');
  assert.throws(() => parsePost('---\ntitle: Old field\n---\nBody'), /# Title/);
  assert.throws(() => parsePost('# [Unsafe](javascript:alert)\n\nText'), /HTTP/);
  assert.throws(() => parsePost('#\n\nText'), /empty/);
  assert.equal(postId('where_does_the_ipad_mini_fit.md'), 'where_does_the_ipad_mini_fit');
});

test('first inline image and opening prose supply preview metadata without tag or markup text', () => {
  const metadata = bodyMetadata('<p><img src="/photo.jpg" alt="My desk"></p><p>I’m <em>still</em> using this iPad &amp; enjoying it.</p><p>Later.</p>');
  assert.equal(metadata.image, '/photo.jpg');
  assert.equal(metadata.description, 'I’m still using this iPad & enjoying it.');
  assert.equal(bodyMetadata('<p>No images.</p>').image, undefined);
  assert.ok(bodyMetadata('<p>' + 'A long sentence. '.repeat(40) + '</p>').description.length <= 160);
});

test('publication date persists across edits and renames, and old dates override import commits', () => {
  const root = mkdtempSync(join(tmpdir(), 'alvalog-dates-'));
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: 'pipe' });
  try {
    git('init', '-q'); git('config', 'user.name', 'Date test'); git('config', 'user.email', 'test@example.invalid');
    mkdirSync(join(root, 'src/content/blog'), { recursive: true });
    const file = join(root, 'src/content/blog/note.md');
    writeFileSync(file, '# First\n\nText.'); git('add', '.');
    const commit = (date) => execFileSync('git', ['commit', '-qm', 'Test post'], { cwd: root, env: { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date }, stdio: 'pipe' });
    commit('2026-01-01T12:00:00Z');
    const original = publicationDate('note.md', {}, root);
    assert.equal(original, '2026-01-01T12:00:00.000Z');
    writeFileSync(file, '# Edited\n\nMore text.'); git('add', '.'); commit('2026-02-01T12:00:00Z');
    assert.equal(publicationDate('note.md', {}, root), original);
    git('mv', 'src/content/blog/note.md', 'src/content/blog/renamed.md'); commit('2026-03-01T12:00:00Z');
    assert.equal(publicationDate('renamed.md', {}, root), original);
    assert.equal(publicationDate('renamed.md', { 'note.md': '2023-02-01T08:00:00Z' }, root), '2023-02-01T08:00:00.000Z');
    writeFileSync(join(root, 'src/content/blog/uncommitted.md'), '# Draft');
    assert.throws(() => publicationDate('uncommitted.md', {}, root), /commit this new post/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('a post drafted on a branch is dated when merged into the publishing branch', () => {
  const root = mkdtempSync(join(tmpdir(), 'alvalog-merge-date-'));
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: 'pipe' });
  const dated = (args, date) => execFileSync('git', args, { cwd: root, env: { ...process.env, GIT_AUTHOR_DATE: date, GIT_COMMITTER_DATE: date }, stdio: 'pipe' });
  try {
    git('init', '-q', '-b', 'main'); git('config', 'user.name', 'Date test'); git('config', 'user.email', 'test@example.invalid');
    writeFileSync(join(root, 'README.md'), 'Blog'); git('add', '.'); dated(['commit', '-qm', 'Initial'], '2026-01-01T00:00:00Z');
    git('checkout', '-qb', 'draft'); mkdirSync(join(root, 'src/content/blog'), { recursive: true });
    writeFileSync(join(root, 'src/content/blog/note.md'), '# Draft'); git('add', '.'); dated(['commit', '-qm', 'Draft'], '2026-01-02T00:00:00Z');
    git('checkout', '-q', 'main'); dated(['merge', '--no-ff', '-qm', 'Publish', 'draft'], '2026-01-10T00:00:00Z');
    assert.equal(publicationDate('note.md', {}, root), '2026-01-10T00:00:00.000Z');
  } finally { rmSync(root, { recursive: true, force: true }); }
});
