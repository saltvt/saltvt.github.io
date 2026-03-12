const fs = require('fs');
const path = require('path');

const BLOG_DIR = path.join(__dirname, 'blog');
const POSTS_JSON = path.join(BLOG_DIR, 'posts.json');

function scanDirectory(dir, relativePath = '') {
    const posts = [];
    const categories = new Set();
    
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const relPath = path.join(relativePath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            // It's a category folder
            categories.add(item);
            // Recursively scan subdirectories
            const subPosts = scanDirectory(fullPath, relPath);
            posts.push(...subPosts);
        } else if (item.endsWith('.md') && item !== 'index.md' && item.toLowerCase() !== 'readme.md') {
            // It's a markdown post
            const category = relativePath || 'misc';
            const slug = relPath.replace(/\\/g, '/').replace('.md', '');
            const title = item.replace('.md', '');
            
            // Try to extract date from frontmatter or filename
            const content = fs.readFileSync(fullPath, 'utf8');
            let date = null;
            let tags = [];
            
            // Simple frontmatter parser
            if (content.startsWith('---')) {
                const endIdx = content.indexOf('---', 3);
                if (endIdx !== -1) {
                    const frontmatter = content.substring(3, endIdx).trim();
                    const lines = frontmatter.split('\n');
                    
                    for (const line of lines) {
                        if (line.startsWith('date:')) {
                            date = line.split(':')[1].trim();
                        } else if (line.startsWith('tags:')) {
                            const tagsStr = line.split(':')[1].trim();
                            tags = tagsStr.split(',').map(t => t.trim());
                        }
                    }
                }
            }
            
            // Default date if not found
            if (!date) {
                const stats = fs.statSync(fullPath);
                date = stats.mtime.toISOString().split('T')[0];
            }
            
            posts.push({
                slug: slug.toLowerCase().replace(/\s+/g, '-'),
                title: title,
                path: `blog/${relPath.replace(/\\/g, '/')}`,
                category: category,
                date: date,
                tags: tags
            });
        }
    }
    
    return posts;
}

function updatePostsJSON() {
    console.log('Scanning blog directory...');
    
    try {
        // Load existing posts.json to preserve any manual edits
        let existingData = { posts: [], categories: [] };
        if (fs.existsSync(POSTS_JSON)) {
            existingData = JSON.parse(fs.readFileSync(POSTS_JSON, 'utf8'));
        }
        
        // Scan directory for posts
        const posts = scanDirectory(BLOG_DIR);
        const categories = [...new Set(posts.map(p => p.category))];
        
        // Merge with existing data to preserve any manual metadata
        const postMap = new Map();
        existingData.posts.forEach(p => postMap.set(p.path, p));
        
        posts.forEach(p => {
            if (postMap.has(p.path)) {
                // Keep existing metadata but update basic info
                const existing = postMap.get(p.path);
                p.title = existing.title || p.title;
                p.tags = existing.tags && existing.tags.length > 0 ? existing.tags : p.tags;
            }
        });
        
        const output = {
            posts: posts.sort((a, b) => new Date(b.date) - new Date(a.date)),
            categories: categories.sort()
        };
        
        fs.writeFileSync(POSTS_JSON, JSON.stringify(output, null, 2));
        console.log(`✓ Updated posts.json with ${posts.length} posts`);
        console.log(`  Categories: ${categories.join(', ')}`);
        
    } catch (error) {
        console.error('Error updating posts.json:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    updatePostsJSON();
}

module.exports = { updatePostsJSON, scanDirectory };
