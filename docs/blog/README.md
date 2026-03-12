# Blog System

The blog now uses a JSON-based system that's much easier to maintain than parsing markdown links.

## How it works

1. **posts.json** - Contains metadata for all blog posts (title, path, category, date, tags)
2. **script.js** - Reads posts.json and displays posts dynamically
3. **update-blog.js** - Helper script to auto-generate posts.json from your blog folder

## Adding a new post

### Option 1: Automatic (Recommended)

1. Create your markdown file in the appropriate folder (e.g., `blog/tutorials/my-post.md`)
2. Run the update script:
   ```bash
   node update-blog.js
   ```
3. The script will scan the blog folder and update `posts.json` automatically

### Option 2: Manual

1. Create your markdown file in the appropriate folder
2. Edit `blog/posts.json` and add a new entry:
   ```json
   {
     "slug": "tutorials/my-post",
     "title": "My Awesome Post",
     "path": "blog/tutorials/my-post.md",
     "category": "tutorials",
     "date": "2024-03-12",
     "tags": ["tutorial", "guide"]
   }
   ```

## Post Format

Your markdown posts can include frontmatter at the top:

```markdown
---
date: 2024-03-12
tags: tutorial, guide, tips
---

# Your Post Title

Your content here...
```

The update script will automatically extract this metadata.

## Folder Structure

```
blog/
├── index.md          # Welcome message (optional)
├── posts.json        # Auto-generated post list
├── tutorials/        # Tutorial posts
├── streams/          # Stream-related posts
├── misc/            # Miscellaneous posts
└── update-blog.js   # Helper script
```

## Features

- ✅ Automatic post discovery
- ✅ Search functionality
- ✅ Category filtering
- ✅ Sorted by date (newest first)
- ✅ Tag support
- ✅ Easy to maintain
