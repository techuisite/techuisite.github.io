import { fromMarkdown } from 'mdast-util-from-markdown';
import { toString } from 'mdast-util-to-string';
import { parseFragment } from 'parse5';
import { slug } from 'github-slugger';

export function postId(filename) {
  return filename.replace(/\.md$/i, '').split('/').map(slug).join('/').replace(/\/index$/, '');
}

export function parsePost(source, filename = 'Post') {
  const tree = fromMarkdown(source);
  const heading = tree.children[0];
  if (heading?.type !== 'heading' || heading.depth !== 1) {
    throw new Error(`${filename}: start the post with a # Title (no front matter needed).`);
  }
  const title = toString(heading).trim();
  if (!title) throw new Error(`${filename}: the title cannot be empty.`);
  const children = heading.children.filter((node) => node.type !== 'text' || node.value.trim());
  let link;
  if (children.length === 1 && ['link', 'linkReference'].includes(children[0].type)) {
    const node = children[0];
    const target = node.type === 'link' ? node.url : tree.children.find(
      (entry) => entry.type === 'definition' && entry.identifier === node.identifier
    )?.url;
    if (!target || !/^https?:\/\//i.test(target)) {
      throw new Error(`${filename}: a linked title must use a complete HTTP or HTTPS URL.`);
    }
    link = new URL(target).href;
  }
  return { title, link, body: source.slice(heading.position.end.offset).replace(/^\s*\n/, '').trimStart() };
}

// Extract metadata from the rendered body, never from Markdown syntax or HTML tags.
export function bodyMetadata(html) {
  const root = parseFragment(html);
  let image;
  const paragraphs = [];
  function text(node) {
    if (['script', 'style'].includes(node.tagName)) return '';
    if (node.nodeName === '#text') return node.value;
    if (node.tagName === 'br') return ' ';
    const value = (node.childNodes || []).map(text).join('');
    return ['p', 'div', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'tr', 'td', 'figcaption'].includes(node.tagName) ? ` ${value} ` : value;
  }
  function visit(node) {
    if (['script', 'style', 'pre'].includes(node.tagName)) return;
    if (node.tagName === 'img' && !image) {
      image = node.attrs.find((attr) => attr.name === 'src')?.value;
    }
    if (node.tagName === 'p') paragraphs.push(text(node));
    for (const child of node.childNodes || []) visit(child);
  }
  visit(root);
  const plainText = text(root).replace(/\s+/g, ' ').trim();
  const opening = (paragraphs.find((p) => p.trim()) || plainText).replace(/\s+/g, ' ').trim();
  const description = opening.length <= 160 ? opening : opening.slice(0, 157).replace(/\s+\S*$/, '') + '…';
  return { image, description, wordCount: plainText.split(/\s+/).filter(Boolean).length };
}
