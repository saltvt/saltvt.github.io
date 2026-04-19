
console.log("Welcome to Saltvt.dev!");

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded'); // Trigger fade-in
    
    // ==================== BLOG SYSTEM ====================
    
    // Load blog index page
    const loadBlogIndex = async () => {
        try {
            // Load the markdown content for display
            const mdResponse = await fetch("./blog/index.md");
            if (mdResponse.ok) {
                const markdownText = await mdResponse.text();
                const blogContent = document.getElementById('blog-content');
                if (blogContent) {
                    blogContent.innerHTML = formatMarkdown(markdownText);
                }
            }
            
            // Load posts from JSON for dynamic loading
            await loadPostsFromJSON();
        } catch (error) {
            console.error('Error loading blog:', error);
            const blogContent = document.getElementById('blog-content');
            if (blogContent) {
                blogContent.innerHTML = `<span style="color: #ff6b6b">Loading blog...</span>`;
            }
        }
    };
    
    // Load posts from JSON file
    const loadPostsFromJSON = async () => {
        try {
            const response = await fetch("./blog/posts.json");
            if (!response.ok) throw new Error('Failed to load posts.json');
            
            const data = await response.json();
            window.blogPosts = data.posts || [];
            window.blogCategories = data.categories || [];
            
            console.log('Loaded posts:', window.blogPosts);
            
            // Display recent posts if container exists
            const recentContainer = document.getElementById('recent-posts');
            if (recentContainer) {
                displayAllRecentPosts(recentContainer);
            }
        } catch (error) {
            console.error('Error loading posts.json:', error);
            window.blogPosts = [];
            const recentContainer = document.getElementById('recent-posts');
            if (recentContainer) {
                recentContainer.innerHTML = '<p>Error loading posts.</p>';
            }
        }
    };
    
    // Load individual post
    const loadPost = async (postSlug) => {
        try {
            const response = await fetch(`./blog/${postSlug}.md`);
            if (!response.ok) throw new Error(`Failed to load ${postSlug}`);
            
            const markdownText = await response.text();
            const postContainer = document.getElementById('post-content');
            
            if (postContainer) {
                postContainer.innerHTML = formatMarkdown(markdownText);
                
                // Extract metadata for display
                extractPostMetadata(postSlug, markdownText);
            }
        } catch (error) {
            console.error(`Error loading ${postSlug}:`, error);
            const postContainer = document.getElementById('post-content');
            if (postContainer) {
                postContainer.innerHTML = `<span style="color: #ff6b6b">Loading post...</span>`;
            }
        }
    };
    
    // Parse markdown text to HTML
    function formatMarkdown(markdown) {
        // Simple markdown parser for headers, bold, italic, code, lists
        let html = markdown
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')  // H1
            .replace(/^## (.*$)/gm, '<h2>$1</h2>') // H2
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')// H3
            .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\*(.*)\*/g, '<em>$1</em>')           // Italic
            .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>') // Code blocks
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">') // Images
            .replace(/^\- (.*$)/gm, '<li>$1</li>')          // List items
            .replace(/^(\d+)\. (.*$)/gm, '<li>$1 $2</li>');  // Numbered lists
            
        return html;
    }
    
    // Extract metadata from a specific post
    function extractPostMetadata(slug, markdown) {
        const categories = [
            'Category: tutorials',
            'Category: streams', 
            'Category: misc'
        ];
        
        const dateRegex = /\*\*Date:\*\* (.*?)(?:\n|$)/;
        const tagsRegex = /\*\*Tags:\*\* (.*?)(?:\n|$)/;
        
        let categoryMatch = markdown.match(dateRegex);
        let tagsMatch = markdown.match(tagsRegex);
        
        // Extract date and tags
        const dateText = categoryMatch ? categoryMatch[1] : 'Unknown';
        const tagsText = tagsMatch ? tagsMatch[1] : 'No tags';
        
        // Parse tags into array
        const tagsArray = tagsText.split(',').map(tag => tag.trim());
        
        return {
            slug,
            date: dateText,
            tags: tagsArray
        };
    }
    
    // ==================== SEARCH FUNCTIONALITY ====================
    
    // Search posts by title or content
    async function searchPosts() {
        const query = document.getElementById('blog-search').value.toLowerCase().trim();
        const recentContainer = document.getElementById('recent-posts');
        
        if (!query) {
            displayAllRecentPosts(recentContainer);
            return;
        }
        
        if (!window.blogPosts || window.blogPosts.length === 0) {
            recentContainer.innerHTML = '<p>No posts available to search.</p>';
            return;
        }
        
        // Filter posts by search query
        const filteredPosts = window.blogPosts.filter(post => {
            const searchText = `${post.title || ''} ${post.slug || ''} ${post.category || ''} ${(post.tags || []).join(' ')}`.toLowerCase();
            return searchText.includes(query);
        });
        
        // Display filtered results
        displayFilteredPosts(filteredPosts, recentContainer, query);
    }
    
    // Display all recent posts
    async function displayAllRecentPosts(container) {
        if (!window.blogPosts || window.blogPosts.length === 0) {
            container.innerHTML = '<p>No posts found.</p>';
            return;
        }
        
        container.innerHTML = '<h3>Recent Posts</h3>';
        
        // Sort posts by date (newest first)
        const sortedPosts = [...window.blogPosts].sort((a, b) => {
            return new Date(b.date || 0) - new Date(a.date || 0);
        });
        
        // Load first 6 posts
        const postsToShow = sortedPosts.slice(0, 6);
        
        for (const post of postsToShow) {
            try {
                const postDiv = document.createElement('div');
                postDiv.className = 'post-card';
                postDiv.style.cssText = 'background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin: 10px 0;';
                
                const title = post.title || post.slug.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                const categoryLabel = post.category ? `<span style="background: rgba(127, 255, 212, 0.3); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; text-transform: uppercase;">${post.category}</span>` : '';
                
                postDiv.innerHTML = `
                    <div style="margin-bottom: 10px;">${categoryLabel}</div>
                    <h4 style="margin: 0 0 10px 0; cursor: pointer; color: var(--accent-aquamarine);" onclick="loadPostInline('${post.slug}')">${title}</h4>
                    <div style="color: #aaa; font-size: 0.9rem;">
                        ${post.date ? formatMetadataDisplay(post.date) : ''}
                        ${post.tags && post.tags.length > 0 ? `<span style="color: var(--accent-aquamarine); margin-left: 10px;">${formatTagsDisplay(post.tags)}</span>` : ''}
                    </div>
                `;
                
                container.appendChild(postDiv);
            } catch (e) {
                console.error('Error loading post:', post.slug, e);
            }
        }
    };
    
    // Display filtered posts
    async function displayFilteredPosts(posts, container, query) {
        container.innerHTML = `
            <h3>Search Results for "<span style="color: var(--accent-aquamarine)">${query}</span>"</h3>
            ${posts.length > 0 ? '' : '<p>No posts found matching your search.</p>'}
        `;
        
        if (posts.length === 0) return;
        
        for (const post of posts) {
            try {
                const postDiv = document.createElement('div');
                postDiv.className = 'post-card';
                postDiv.style.cssText = 'background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin: 10px 0;';
                
                const title = post.title || post.slug.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                const categoryLabel = post.category ? `<span style="background: rgba(127, 255, 212, 0.3); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 10px; display: inline-block;">${post.category}</span>` : '';
                
                postDiv.innerHTML = `
                    ${categoryLabel}
                    <h4 style="margin: 10px 0; cursor: pointer; color: var(--accent-aquamarine);" onclick="loadPostInline('${post.slug}')">${title}</h4>
                    <div style="color: #aaa; font-size: 0.9rem;">
                        ${post.date ? formatMetadataDisplay(post.date) : ''}
                        ${post.tags && post.tags.length > 0 ? `<span style="color: var(--accent-aquamarine); margin-left: 10px;">${formatTagsDisplay(post.tags)}</span>` : ''}
                    </div>
                `;
                
                container.appendChild(postDiv);
            } catch (e) {
                console.error('Error loading filtered post:', post.slug, e);
            }
        }
    };
    
    // Format date display
    function formatMetadataDisplay(dateStr) {
        if (!dateStr) return '';
        
        const date = new Date(dateStr);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        
        return `<span>${date.toLocaleDateString('en-US', options)}</span>`;
    }
    
    // Format tags display
    function formatTagsDisplay(tags) {
        if (!tags || tags.length === 0) return '';
        
        const tagHtml = tags.map(tag => 
            `<span style="background: rgba(127, 255, 212, 0.2); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${tag}</span>`
        ).join('');
        
        return `<span>${tagHtml}</span>`;
    }
    
    // ==================== CATEGORY FILTERING ====================
    
    // Filter posts by category
    async function filterByCategory(category) {
        const recentContainer = document.getElementById('recent-posts');
        
        if (!window.blogPosts || window.blogPosts.length === 0) {
            recentContainer.innerHTML = '<p>No posts available.</p>';
            return;
        }
        
        // Filter posts by category from JSON metadata
        const categoryPosts = window.blogPosts.filter(post => 
            post.category && post.category.toLowerCase() === category.toLowerCase()
        );
        
        displayFilteredPosts(categoryPosts, recentContainer, category);
    }
    
    // ==================== INLINE POST VIEWER ====================
    
    // Load post content inline on the blog page
    window.loadPostInline = async function(slug) {
        try {
            const post = window.blogPosts.find(p => p.slug === slug);
            if (!post) {
                console.error('Post not found:', slug);
                return;
            }
            
            // Show loading state
            const postContent = document.getElementById('post-content');
            const postViewer = document.getElementById('post-viewer');
            const blogList = document.getElementById('blog-list');
            
            if (postContent) {
                postContent.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--accent-aquamarine);"><i class="fas fa-spinner fa-spin" style="font-size: 2rem;"></i><p>Loading post...</p></div>';
            }
            
            // Show post viewer, hide blog list
            if (postViewer) postViewer.style.display = 'block';
            if (blogList) blogList.style.display = 'none';
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Fetch post content
            const response = await fetch(`./blog/${post.path}`);
            if (!response.ok) throw new Error('Failed to load post');
            
            const markdown = await response.text();
            
            // Parse and display
            if (postContent) {
                postContent.innerHTML = formatMarkdown(markdown);
            }
            
        } catch (error) {
            console.error('Error loading post:', error);
            const postContent = document.getElementById('post-content');
            if (postContent) {
                postContent.innerHTML = '<div style="color: #ff6b6b; text-align: center; padding: 40px;"><h3>Error Loading Post</h3><p>' + error.message + '</p></div>';
            }
        }
    };
    
    // Back button handler
    const backButton = document.getElementById('back-to-list');
    if (backButton) {
        backButton.addEventListener('click', () => {
            const postViewer = document.getElementById('post-viewer');
            const blogList = document.getElementById('blog-list');
            
            if (postViewer) postViewer.style.display = 'none';
            if (blogList) blogList.style.display = 'block';
            
            window.scrollTo(0, 0);
        });
    }
    
    // ==================== INITIALIZATION ====================
    
    // Load blog on page load
    setTimeout(() => {
        loadBlogIndex();
    }, 500);
    
    // Setup search functionality
    const searchInput = document.getElementById('blog-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            if (e.target.value.trim().length > 2) {
                searchPosts();
            } else {
                displayAllRecentPosts(document.getElementById('recent-posts'));
            }
        });
    }
    
    // Setup category filtering
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            filterByCategory(category);
        });
    });
    // Scroll Opacity Observer (existing functionality)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scrolled-in');
            } else {
                entry.target.classList.remove('scrolled-in');
            }
        });
    }, observerOptions);

    const bioTexts = document.querySelectorAll('.bio-text');
    bioTexts.forEach(el => observer.observe(el));
    
    // Infinite Scroll Art Loader (existing functionality)
    const artReference = document.getElementById('art-gallery-container');

    if (artReference) {
        const artContainer = document.querySelector('.hero');
        let artLoaded = false;
        const moreImages = [
            'images/CHIBI COMFY RAE STYLIZED.png',
            'images/chipiBlondeSalt.png'
        ];

        window.addEventListener('scroll', () => {
            if (artLoaded) return;

            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
                artLoaded = true;

                console.log("Loading more art...");

                moreImages.forEach(imgSrc => {
                    const newGalleryDiv = document.createElement('div');
                    newGalleryDiv.className = 'art-gallery';
                    newGalleryDiv.style.opacity = '0';
                    newGalleryDiv.style.animation = 'fadeInUp 1s ease forwards';

                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = "Unlockable Art";

                    newGalleryDiv.appendChild(img);
                    artContainer.appendChild(newGalleryDiv);
                });
            }
        });
    }
    
    // Global Cyberpunk Hover Sound (existing functionality)
    document.body.addEventListener('mouseover', (e) => {
        const target = e.target.closest('a, button, .art-gallery, .card, .btn-cta, .footer-socials a');

        if (target) {
            // Simple implementation: play on every mouseover event that matches
            console.log("Hover detected!");
        }
    });
    
});
