PrimeEstate - Frontend Only

Pages:
- index.html: Homepage with hero, featured listings, and CTAs
- properties.html: Listing page with client-side filters
- property.html: Property details with gallery and schedule modal
- about.html: Company story and metrics
- contact.html: Contact form and map embed placeholder
- dashboard.html: Lightweight admin mock (static table and actions)

Run: Open index.html in your browser. No build required.

Deploy to Vercel:
1) Create a Git repo and push to GitHub:
   - Initialize repo
     - git init
     - git add .
     - git commit -m "feat: initial site"
     - git branch -M main
   - Create an empty GitHub repo (github.com/new), then:
     - git remote add origin https://github.com/<your-username>/<repo>.git
     - git push -u origin main

2) Import to Vercel (recommended):
   - Go to vercel.com/new and import the GitHub repo
   - Framework preset: "Other"
   - Build Command: None
   - Output Directory: . (project root)

Alternative CLI deploy:
   - npm i -g vercel
   - vercel --prod

Notes for static hosting:
- vercel.json already maps routes (/, /properties, etc.) to HTML files.
- Static assets under styles/ and scripts/ are cached aggressively.

Design:
- Theme: Dark, premium with gold and blue accents
- Fonts: Outfit (Google Fonts)
- Icons: Font Awesome CDN
- Images: Unsplash demo URLs

Notes:
- Demo-only data rendered on the client.
- Replace images and contact details before production use.


