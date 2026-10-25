import rss from '@astrojs/rss';
import { getCollection, render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import sanitizeHtml from 'sanitize-html';

export async function GET(context: any) {
  const site = context.site || new URL('https://alvalog.net');
  const posts = await getCollection('blog');
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
  const container = await AstroContainer.create();
  const items = [];

  for (const post of sorted) {
    const permalink = new URL(`/posts/${post.id}`, site);
    const { Content } = await render(post);
    const body = await container.renderToString(Content);
    // Keep article media and formatting while removing site-only scripts/styles.
    const hero = post.data.heroImage
      ? `<p><img src="${new URL(post.data.heroImage, site).href.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}" alt="" /></p>`
      : '';
    const content = sanitizeHtml(hero + body, {
      allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'figure', 'figcaption', 'video', 'audio', 'source'],
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        '*': ['id'],
        a: ['href', 'title'],
        img: ['src', 'alt', 'title', 'width', 'height'],
        video: ['src', 'controls', 'poster'],
        audio: ['src', 'controls'],
        source: ['src', 'type'],
      },
      transformTags: {
        '*': (tagName, attribs) => {
          for (const attr of ['href', 'src', 'poster']) {
            if (attribs[attr]) {
              try { attribs[attr] = new URL(attribs[attr], permalink).href; }
              catch { delete attribs[attr]; }
            }
          }
          return { tagName, attribs };
        },
      },
    });
    items.push({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/posts/${post.id}`,
      content,
    });
  }

  return rss({
    title: 'Alvalog — By Paul Alvarez',
    description: 'A personal publication exploring technology, writing tools, and modern craft. Written by Paul Alvarez.',
    site,
    items,
    customData: `<language>en-us</language>`,
  });
}
