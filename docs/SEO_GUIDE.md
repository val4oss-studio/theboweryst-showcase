# SEO Complete Guide for Next.js Tattoo Shop Showcase

## Table of Contents
1. [What Has Been Implemented](#what-has-been-implemented)
2. [Understanding SEO in Next.js](#understanding-seo-in-nextjs)
3. [Technical SEO Elements Explained](#technical-seo-elements-explained)
4. [Next Steps & Ongoing Optimization](#next-steps--ongoing-optimization)
5. [Selling SEO Services to Clients](#selling-seo-services-to-clients)
6. [SEO Checklist](#seo-checklist)

---

## What Has Been Implemented

### 1. **Metadata API (app/layout.tsx)**
✅ **Comprehensive metadata configuration including:**
- **Title Template**: Dynamic titles for better search results
- **Description**: Optimized for tattoo shop keywords in Lorient
- **Keywords**: 23+ targeted keywords including:
  - Local: "tatouage lorient", "tattoo lorient", "tatoueur lorient"
  - Business names: "the boweryst", "the bowery street", "bowery street lorient"
  - Artist names: "miss bunny tattoo", "manolita ink", "lisa yekita"
  - Regional: "tatouage bretagne", "tatouage morbihan"
  - Location: "56100 lorient tattoo", "rue turenne tatouage"

### 2. **Open Graph & Social Media**
✅ **Facebook & Instagram optimization:**
- Open Graph tags for rich previews when shared
- Twitter Card for better Twitter/X sharing
- Locale settings (fr_FR primary, en_US alternate)
- Social media images (logo.jpg)

### 3. **Structured Data (JSON-LD Schemas)**
✅ **Three comprehensive schemas:**

#### a) **TattooParlor Schema**
- Business type: TattooParlor (specific Google category)
- Complete business information
- Opening hours: Tuesday-Saturday 11:00-18:00
- Geographic coordinates
- Employee information (3 artists)
- Social media links
- Service catalog

#### b) **LocalBusiness Schema**
- Duplicate for better indexing
- Focus on local search
- Address and geo-coordinates
- Price range indicator

#### c) **BreadcrumbList Schema**
- Navigation structure for Google
- Helps search engines understand site hierarchy
- Improves rich snippets in search results

### 4. **Technical SEO Files**

#### robots.txt
```
User-agent: *
Allow: /
Sitemap: https://theboweryst.fr/sitemap.xml
```
- Allows all search engines to crawl
- Points to sitemap for better indexing

#### sitemap.xml
- Lists all important pages/sections
- Priority and update frequency for each section
- Multi-language support (hreflang)

### 5. **Next.js Configuration Optimizations**
✅ **Performance & SEO settings:**
- Image optimization (AVIF, WebP formats)
- Compression enabled
- Security headers (X-Frame-Options, X-Content-Type-Options)
- DNS prefetch control

### 6. **Internationalization (i18n) SEO**
✅ **Multi-language setup:**
- French as default (fr)
- English alternate (en)
- Canonical URLs
- hreflang tags for language targeting

---

## Understanding SEO in Next.js

### How Next.js Helps SEO

**1. Server-Side Rendering (SSR) & Static Generation**
- Next.js renders pages on the server
- Search engines receive fully rendered HTML
- Better than client-side React apps where content loads after JavaScript

**2. Metadata API**
- Built-in system for managing meta tags
- Type-safe with TypeScript
- Automatic generation of correct tags

**3. Image Optimization**
- Automatic lazy loading
- Responsive images
- Modern formats (WebP, AVIF)
- Better Core Web Vitals scores

**4. Performance**
- Fast loading = better SEO rankings
- Automatic code splitting
- Optimized JavaScript bundles

### Why This Matters for Business

**Local SEO is critical for tattoo shops:**
- 46% of all Google searches are looking for local information
- 76% of people who search on smartphone for something nearby visit a business within a day
- 28% of searches for something nearby result in a purchase

---

## Technical SEO Elements Explained

### 1. Title Tags
```typescript
title: {
  default: "The Bowery Street | Studio de Tatouage Professionnel à Lorient, Bretagne",
  template: "%s | The Bowery Street Tattoo"
}
```
**Why it matters:**
- First thing people see in search results
- Google displays ~60 characters
- Includes main keywords + location + business type

### 2. Meta Description
```typescript
description: "The Bowery Street (The Boweryst) - Studio de tatouage professionnel..."
```
**Why it matters:**
- Appears under title in search results
- Influences click-through rate (CTR)
- Should be 150-160 characters
- Includes call-to-action and key info

### 3. Keywords
```typescript
keywords: ["tatouage lorient", "tattoo lorient", ...]
```
**Why it matters:**
- Helps search engines understand page content
- Mix of:
  - **Head terms**: "tatouage lorient" (high volume, competitive)
  - **Long-tail**: "studio tatouage professionnel lorient" (specific, easier to rank)
  - **Brand terms**: "the boweryst", "bowery street lorient"

### 4. Structured Data (Schema.org)

**What is it?**
Structured data tells search engines exactly what your content means, not just what it says.

**TattooParlor Schema Benefits:**
- Appears in Google Knowledge Panel
- Shows business hours directly in search
- Displays address and map
- Shows social media links
- Can trigger rich results

**Example of what Google might show:**
```
The Bowery Street - Tattoo Parlor
★★★★★ (when you get reviews)
6 Rue de Turenne, Lorient · 56100
Open ⋅ Closes 18:00
Tattoo parlor in Lorient, Bretagne
```

### 5. Open Graph & Twitter Cards

**What happens:**
When someone shares your site on Facebook/Instagram:
- Shows logo image
- Displays optimized title and description
- Better click-through rate
- Professional appearance

### 6. Canonical URLs
```html
<link rel="canonical" href="https://theboweryst.fr" />
```
**Why it matters:**
- Prevents duplicate content issues
- Tells search engines which version is the "main" one
- Important when you have multiple URLs for same content

### 7. hreflang Tags
```html
<link rel="alternate" hreflang="fr" href="https://theboweryst.fr" />
<link rel="alternate" hreflang="en" href="https://theboweryst.fr/en" />
```
**Why it matters:**
- Tells Google which language version to show
- Better for international/bilingual businesses
- Prevents content being seen as duplicate

### 8. Geo-Targeting
```typescript
other: {
  'geo.region': 'FR-BRE',
  'geo.placename': 'Lorient',
  'geo.position': '47.748889;-3.366667',
}
```
**Why it matters:**
- Critical for local businesses
- Helps "near me" searches
- Better local map rankings

---

## Next Steps & Ongoing Optimization

### Immediate Next Steps (Week 1-2)

#### 1. **Google Business Profile (Critical - #1 Priority)**
🎯 **Action:** Create and verify Google Business Profile
- Go to: https://business.google.com
- Create profile for "The Bowery Street"
- **Add:**
  - Exact address: 6 Rue de Turenne, 56100 Lorient
  - Category: "Tattoo Shop" or "Tatouage"
  - Hours: Tuesday-Saturday 11:00-18:00
  - Phone number (get one if you don't have)
  - Website: https://theboweryst.fr
  - Photos: Logo, shop interior, artist photos, tattoo examples
  - Description (use the one from metadata)

**Why critical:** Shows up in Google Maps and local search. Free and essential.

#### 2. **Search Console Setup**
🎯 **Action:** Add site to Google Search Console
- Go to: https://search.google.com/search-console
- Add property: https://theboweryst.fr
- Verify ownership (multiple methods available)
- Submit sitemap: https://theboweryst.fr/sitemap.xml

**Gives you:**
- See what keywords you rank for
- Identify technical issues
- Monitor click-through rates
- Request re-indexing

#### 3. **Google Analytics 4**
🎯 **Action:** Install GA4
```typescript
// Add to app/layout.tsx in <head>
<Script
  strategy="afterInteractive"
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

**Track:**
- Visitor numbers
- Which pages are most viewed
- Where visitors come from
- Conversion tracking (contact form submissions, Instagram clicks)

#### 4. **Get Verification Codes**
Add to layout.tsx metadata:
```typescript
verification: {
  google: 'your-code-here',
  bing: 'your-code-here',
}
```

### Short-term Optimization (Month 1)

#### 5. **Content Optimization**
✅ **Current Status:** Basic content in place

🎯 **Improve:**
- Add more text content (Google likes 300+ words per section)
- Include keywords naturally
- Add FAQ section (common questions about tattoos)
- Blog posts (if feasible):
  - "Comment préparer votre premier tatouage"
  - "Styles de tatouage disponibles à Lorient"
  - "Aftercare: Prendre soin de votre nouveau tatouage"

#### 6. **Image SEO**
🎯 **Action:** Optimize all images
```typescript
// Add to every Image component
<Image
  src="/logo.jpg"
  alt="The Bowery Street - Studio de tatouage à Lorient"
  title="The Bowery Street Tattoo Studio"
  // ... other props
/>
```

**For gallery images:**
- Alt text: "Tatouage [style] par [artist name] - The Bowery Street Lorient"
- File names: descriptive (not "IMG_1234.jpg")
- Compress images (use tools like TinyPNG)

#### 7. **Local Citations & Directories**
🎯 **Action:** List business on:
- **Essential:**
  - Google Business Profile ⭐ (already mentioned)
  - Bing Places
  - Apple Maps
  
- **Local/French:**
  - PagesJaunes.fr
  - Yelp France
  - TripAdvisor
  
- **Industry-specific:**
  - Tattoo directories
  - Local Lorient business directories
  - Bretagne tourism sites

**Ensure NAP consistency:**
- **N**ame: The Bowery Street (consistent everywhere)
- **A**ddress: 6 Rue de Turenne, 56100 Lorient
- **P**hone: (get a business phone number)

#### 8. **Social Media Integration**
🎯 **Current:** Instagram links present

**Optimize:**
- Post regularly on Instagram (2-3x per week)
- Use location tags: "Lorient, France"
- Use hashtags:
  - #tatouagelorient
  - #tattoobretagne
  - #lorienttattoo
  - #bretagnetattoo
  - #theboweryst
- Engage with local Lorient accounts
- Share customer testimonials (with permission)

### Medium-term (Months 2-6)

#### 9. **Link Building**
🎯 **Goal:** Get other websites to link to you

**Strategies:**
- Local partnerships:
  - Other Lorient businesses
  - Bretagne tourism blogs
  - Local event websites
  
- Press coverage:
  - Local Lorient newspapers
  - Bretagne lifestyle magazines
  - Tattoo magazines/blogs
  
- Artist features:
  - Interviews with your artists
  - Guest posts on tattoo blogs
  - Convention participation (with link back)

#### 10. **Review Management**
🎯 **Goal:** Get 5-star reviews

**Why critical:**
- Reviews are a TOP ranking factor
- Builds trust
- Improves conversion

**How:**
- Ask happy customers to review on Google
- Make it easy (send direct link)
- Respond to all reviews (good and bad)
- Display reviews on website

#### 11. **Performance Optimization**
🎯 **Monitor Core Web Vitals:**
- Use PageSpeed Insights: https://pagespeed.web.dev
- Target scores:
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

**Optimize:**
- Compress images
- Lazy load below-fold content
- Minimize JavaScript
- Use CDN for static assets

#### 12. **Advanced Schema Markup**
Add more schemas:
- **Review Schema** (when you have reviews)
- **Event Schema** (for tattoo conventions, special events)
- **FAQ Schema** (if you add FAQ section)
- **Article Schema** (for blog posts)

### Long-term (6+ months)

#### 13. **Content Marketing**
- Regular blog posts
- Video content (YouTube SEO)
- Artist spotlight series
- Tattoo care guides

#### 14. **Advanced Analytics**
- Heat maps (Hotjar)
- A/B testing
- Conversion rate optimization
- User journey analysis

#### 15. **Backlink Analysis**
- Monitor competitors
- Find link opportunities
- Disavow toxic links

---

## Selling SEO Services to Clients

### SEO Service Packages

#### **Package 1: SEO Foundation (One-time)**
**What's included:**
- Technical SEO setup (already done)
- Google Business Profile creation & optimization
- Search Console & Analytics setup
- Social media optimization
- Initial keyword research
- Competitor analysis

**Price range:** €800 - €1,500
**Delivery:** 2-4 weeks

**Pitch:**
"Get your business visible on Google. One-time setup that puts you on the map - literally. Most customers find tattoo shops through Google Maps searches."

---

#### **Package 2: Local SEO Boost (Monthly)**
**What's included:**
- Google Business Profile management
- Monthly blog post (SEO optimized)
- Review monitoring & response
- Local directory submissions (ongoing)
- Monthly ranking reports
- Google Analytics reports

**Price range:** €300 - €600/month
**Minimum:** 6 months

**Pitch:**
"Stay ahead of competitors. Monthly work to improve your rankings and bring in more customers. See measurable results in search position and website traffic."

---

#### **Package 3: Full Digital Marketing (Monthly)**
**What's included:**
- Everything in Package 2
- Social media management (Instagram/Facebook)
- Content creation (4 blog posts/month)
- Link building outreach
- Email marketing
- Conversion optimization

**Price range:** €1,000 - €2,000/month
**Minimum:** 12 months

**Pitch:**
"Complete online presence management. We handle everything so you can focus on tattooing. From social media to getting you featured in local press."

---

### How to Demonstrate Value to Clients

#### **Before/After Metrics**

**Show them:**
1. **Current state** (use tools):
   - Google ranking for key terms: "Currently not in top 100"
   - Website traffic: "0 visits from Google"
   - Google Business Profile: "Doesn't exist"

2. **After 3 months:**
   - "Ranking #3 for 'tatouage lorient'"
   - "127 visits from Google last month"
   - "24 Google Maps views, 8 website clicks"

3. **After 6 months:**
   - "Ranking #1 for 'studio tatouage lorient'"
   - "340 visits from Google"
   - "15 new customers mentioned finding you on Google"

#### **ROI Calculator**

**Example pitch:**
```
If SEO brings you just 2 extra customers per month:
- 2 customers × €150 average tattoo = €300/month
- SEO cost: €400/month
- Break even at 2.7 customers

Typically, good local SEO brings 5-10 new customers/month
= €750-€1,500 in extra revenue
= ROI of 87%-275%
```

#### **Competitive Analysis**

**Show them:**
1. Search "tatouage lorient" on Google
2. Point out competitors who rank high
3. Show their SEO strategies
4. Explain: "They're getting customers that could be yours"

### Client Reporting Template

**Monthly SEO Report Should Include:**

1. **Rankings Progress**
   - Top 10 keywords and their positions
   - Movement up/down from last month

2. **Traffic Stats**
   - Total organic visits
   - Top landing pages
   - Bounce rate, time on site

3. **Google Business Profile**
   - Views
   - Clicks to website
   - Direction requests
   - Phone calls

4. **Work Completed**
   - Blog posts published
   - Links acquired
   - Reviews received
   - Technical optimizations

5. **Next Month's Plan**
   - Specific tasks
   - Goals

### Tools You Need

#### **Free Tools:**
- Google Search Console (essential)
- Google Analytics 4 (essential)
- Google Business Profile (essential)
- Google PageSpeed Insights
- Google Keyword Planner
- Bing Webmaster Tools

#### **Paid Tools (for agencies):**
- Ahrefs ($99-$999/mo) - Best for backlinks & keywords
- SEMrush ($119-$449/mo) - All-in-one SEO suite
- Moz ($99-$599/mo) - Local SEO focused
- Screaming Frog (€149/year) - Technical SEO audits

#### **Start with free, upgrade when:**
- Managing 5+ clients
- Need competitive analysis
- Want automation

---

## SEO Checklist

### ✅ Already Completed
- [x] Meta titles and descriptions
- [x] Comprehensive keywords
- [x] Open Graph tags
- [x] Structured data (JSON-LD)
- [x] robots.txt
- [x] sitemap.xml
- [x] Next.js SEO optimizations
- [x] Multi-language setup
- [x] Image alt tags (partially)
- [x] Mobile responsive design
- [x] Fast loading performance

### 🔲 To Do Immediately
- [ ] Create Google Business Profile
- [ ] Verify Google Search Console
- [ ] Submit sitemap to Search Console
- [ ] Install Google Analytics 4
- [ ] Get a business phone number
- [ ] Take professional photos of shop
- [ ] Add more descriptive alt text to all images

### 🔲 To Do This Month
- [ ] List on Bing Places
- [ ] List on PagesJaunes.fr
- [ ] List on Yelp France
- [ ] Create Apple Maps listing
- [ ] Ask first customers for Google reviews
- [ ] Optimize Instagram profiles (all 4 accounts)
- [ ] Add FAQ section to website
- [ ] Compress all images

### 🔲 Ongoing Tasks
- [ ] Post on Instagram 2-3x per week
- [ ] Monitor Google Search Console weekly
- [ ] Respond to reviews within 24h
- [ ] Update business hours if they change
- [ ] Add new gallery photos weekly
- [ ] Write monthly blog post
- [ ] Build 1-2 quality backlinks per month

---

## Key Metrics to Track

### **Month 1 Baseline:**
- Google Business Profile views: ___
- Organic search visits: ___
- Keyword rankings (top 10): ___
- Backlinks: ___
- Domain authority: ___

### **Goals After 3 Months:**
- Top 10 ranking for "tatouage lorient"
- 100+ organic visits/month
- 5+ Google reviews
- 50+ Google Business Profile views/month

### **Goals After 6 Months:**
- Top 3 ranking for "tatouage lorient"
- #1 for "studio tatouage lorient"
- 300+ organic visits/month
- 15+ Google reviews (4.5+ stars)
- 200+ Google Business Profile views/month
- 10+ backlinks from quality sites

---

## Common SEO Questions

### Q: How long until we see results?
**A:** 
- **Quick wins (1-2 weeks):** Google Business Profile appears
- **Initial rankings (1-3 months):** Start appearing for long-tail keywords
- **Significant traffic (3-6 months):** Top rankings for main keywords
- **Full maturity (6-12 months):** Strong organic presence

### Q: Why does SEO take so long?
**A:** 
- Google needs to discover, crawl, and index your site
- Trust is built over time (age of domain, backlinks, reviews)
- Competition takes time to outrank
- Content needs time to prove its value

### Q: What if we don't have budget for paid tools?
**A:** 
Free tools are sufficient for:
- Single site management
- Local SEO focus
- Basic reporting

Invest in paid tools when managing multiple clients.

### Q: How do we compete with established tattoo shops?
**A:** 
- **Local focus:** Target "lorient" specifically
- **Google Business Profile:** Easier to rank locally
- **Content:** Be more active (blog, social media)
- **Reviews:** Build up faster than they can
- **Niche keywords:** Target specific tattoo styles

### Q: What's the #1 most important thing?
**A:** 
**Google Business Profile.** 
- Free
- Immediate impact
- Shows in Google Maps
- Builds trust
- Easy to manage

---

## Conclusion

### Your Current State: ✅ Strong Foundation
The technical SEO is excellent. You have:
- Professional metadata
- Comprehensive structured data
- Multi-language support
- Performance optimizations
- Mobile-friendly design

### What Matters Most Now: 🎯 Execution
The difference between success and failure is:
1. **Creating Google Business Profile** (do this TODAY)
2. **Getting reviews** (ask every happy customer)
3. **Consistent posting** (Instagram 2-3x/week minimum)
4. **Local citations** (get listed everywhere)

### Timeline to Success:
- **Week 1:** Google Business Profile + Search Console
- **Month 1:** First organic traffic, appear in Maps
- **Month 3:** Top 10 for main keywords
- **Month 6:** Top 3 rankings, steady customer flow
- **Month 12:** Dominant local presence

### Investment Required:
- **Time:** 5-10 hours/month (or hire someone)
- **Money:** €50-200/month (tools, ads optional)
- **Or:** Charge clients €300-600/month to do it for them

---

**Remember:** SEO is a marathon, not a sprint. Consistency beats perfection. Start with the basics, measure results, and keep improving.

Good luck! 🚀
