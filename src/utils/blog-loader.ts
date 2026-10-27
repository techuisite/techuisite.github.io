import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import type { Loader } from 'astro/loaders';
import { parsePost, postId, bodyMetadata } from './post-format.mjs';
import { publicationDate } from './publication-date.mjs';

export function blogLoader(): Loader {
  return {
    name: 'alvalog-markdown-posts',
    async load(context) {
      const { config, store, parseData, renderMarkdown, generateDigest, watcher } = context;
      const root = fileURLToPath(config.root);
      const directory = path.join(root, 'src/content/blog');
      const datesPath = path.join(root, 'src/content/publication-dates.json');
      async function files(directory: string, prefix = ''): Promise<string[]> {
        const entries = await readdir(directory, { withFileTypes: true });
        const result = await Promise.all(entries.map(async (entry) => {
          const name = path.posix.join(prefix, entry.name);
          return entry.isDirectory() ? files(path.join(directory, entry.name), name) : /\.md$/i.test(entry.name) ? [name] : [];
        }));
        return result.flat().sort();
      }
      async function sync() {
        const dates = JSON.parse(await readFile(datesPath, 'utf8'));
        const records = [];
        const ids = new Set<string>();
        for (const filename of await files(directory)) {
          const source = await readFile(path.join(directory, filename), 'utf8');
          const id = postId(filename);
          if (ids.has(id)) throw new Error(`Duplicate post URL: ${id}`);
          ids.add(id);
          const { title, link, body } = parsePost(source, filename);
          const pubDate = publicationDate(filename, dates, root);
          const rendered = await renderMarkdown(body);
          const metadata = bodyMetadata(rendered.html);
          const data = await parseData({ id, data: { title, link, pubDate, ...metadata }, filePath: path.join(directory, filename) });
          records.push({ id, data, body, rendered, filePath: `src/content/blog/${filename}`, digest: generateDigest({ source, pubDate, metadata }) });
        }
        // Only replace the collection after every post validates successfully.
        store.clear();
        for (const record of records) store.set(record);
      }
      await sync();
      if (watcher) {
        watcher.add([directory, datesPath]);
        let queue = Promise.resolve();
        const refresh = (filename: string) => {
          if (filename === datesPath || (filename.startsWith(directory + path.sep) && /\.md$/i.test(filename))) {
            queue = queue.then(sync).catch((error) => context.logger.error(error.message));
          }
        };
        watcher.on('add', refresh).on('change', refresh).on('unlink', refresh);
      }
    },
  };
}
