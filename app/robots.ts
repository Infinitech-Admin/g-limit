# Robots.txt for G-Limit Studio
# https://g-limitstudio.com/robots.txt

# Allow all search engines to crawl the site
User-agent: *
Allow: /

# Disallow private/admin areas (adjust as needed)
Disallow: /admin/
Disallow: /api/private/
Disallow: /_next/
Disallow: /private/

# Allow access to public API routes if any
Allow: /api/contact
Allow: /api/booking

# Sitemap location
Sitemap: https://g-limitstudio.com/sitemap.xml

# Specific rules for major search engines
User-agent: Googlebot
Crawl-delay: 0
Allow: /

User-agent: Googlebot-Image
Allow: /

User-agent: Bingbot
Crawl-delay: 0
Allow: /

User-agent: Slurp
Crawl-delay: 0
Allow: /

# Block bad bots (optional - uncomment if needed)
# User-agent: AhrefsBot
# Disallow: /

# User-agent: SemrushBot
# Disallow: /
