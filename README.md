# Alvalog

A personal Astro blog published to GitHub Pages at https://alvalog.net.

## Writing a post

Add a Markdown file to `src/content/blog/`. Start with a level-one heading:

```markdown
# A quieter setup

Your writing goes here.

![My desk](/content/images/desk.jpg)
```

For a linked post, make the entire heading a link:

```markdown
# [An interesting article](https://example.com/article)

Your commentary goes here.
```

No YAML front matter is needed. Do not add separate title, date, link, image,
summary, tag, updated-date, or featured fields.

- The heading supplies the title and is displayed once, above the post.
- A linked heading points to the external article. The date remains your post's permalink.
- Images display only where you place them. The first image supplies sharing previews.
- The opening paragraph supplies a plain-text description for search, sharing, and RSS.
- Linked posts and posts under 250 words get the side line on the homepage.
- The filename determines the URL. Keep it unchanged after publishing.
- Use `/content/images/...` for images uploaded under `public/content/images/`.

## Publication dates

Existing publication dates are preserved in `src/content/publication-dates.json`.
This is migration data maintained by the site, not a field authors need to fill out.

For a new post, the site uses the Git commit that first adds the file on the
publishing branch. First-parent history uses the merge date when a draft branch
is merged normally; squash publishing uses the squash commit date. Edits and
rebuilds retain the original date. Dates are ISO timestamps; the homepage displays
calendar dates in UTC, as before.

Commit new posts before building or previewing them. A build fails clearly if a
post has no title or no recorded Git date, instead of silently inventing a date.
On a shallow checkout, the loader fetches full history only when a new post needs
its date resolved. Do not rewrite publishing-branch history: Git is the persistent
record for new publication dates. Existing date records remain authoritative.

## Development

```sh
npm ci
npm test
npm run build
npm run dev
```

RSS at `/rss.xml` includes full post content with absolute image and link URLs.
