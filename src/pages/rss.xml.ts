import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: any) {
  const posts = await getCollection('blog');
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: 'Alvalog — By Paul Alvarez',
    description: 'A personal publication exploring technology, writing tools, and modern craft. Written by Paul Alvarez.',
    site: context.site || 'https://alvalog.net',
    items: sorted.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/posts/${post.id}`,
    })),
    customData: `<language>en-us</language>`,
  });
}
