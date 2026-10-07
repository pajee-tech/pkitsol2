# PK IT Sol landing page

A static, single-page marketing site: plain HTML, CSS and vanilla JavaScript.
No build step, no dependencies, no framework.

## Structure

```
.
├── index.html            Home page (all sections, inline SVG icon sprite)
├── seo-services.html     Service page with the SEO proposal form
├── web-solutions.html    Service page with the web quote form
├── digital-marketing.html  Service page with the marketing proposal form
├── service-template.html Blank service page to copy for new services
├── robots.txt, sitemap.xml  Only the home page is listed
├── css/
│   └── style.css         Design tokens, logo recolouring, sections, breakpoints
├── js/
│   ├── config.js         Brand settings and portfolio projects
│   └── main.js           Nav, tabs, carousels, accordion, forms, lightbox
├── assets/
│   └── img/              Logo files, favicon, photos and placeholder artwork
│       └── portfolio/    Search Console screenshots for the SEO portfolio
└── tools/
    ├── download-images.bat   Windows: downloads the section photos and GSC graphs
    ├── download-images.sh    macOS / Linux version of the same
    └── split_logo.py         Regenerates the logo masks from a new logo PNG
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8080      # then visit http://localhost:8080
```

## Deploy (GitHub + Vercel)

The pages only work when the folders are uploaded as folders. `index.html`
looks for `css/style.css`, `js/main.js` and `assets/img/...`; if those files
are uploaded loose next to `index.html`, the site shows as plain text with
giant icons.

1. Unzip the download. Open the folder so you can see `index.html`, `css`,
   `js`, `assets`, `tools`.
2. In the GitHub repository delete the old files, then choose
   Add file → Upload files.
3. Select everything inside the folder (Ctrl+A) and **drag it onto the upload
   box**. Dragging keeps the folders; the "choose your files" button does not.
4. Before committing, check the list shows paths such as `css/style.css` and
   `js/main.js`, not just `style.css`.
5. Commit. Vercel redeploys by itself. In Vercel keep Framework Preset "Other"
   and Root Directory empty.
6. Check these addresses open (they must not say 404):
   `/css/style.css`, `/js/main.js`, `/js/config.js`, `/assets/img/logo.png`

## Change the brand details

Edit `js/config.js`. Name, tagline, phone, WhatsApp, email, address, map,
social links, form delivery and the portfolio are read from there and written into every element marked with
`data-brand` or `data-brand-link`. Social icons stay hidden until you add a URL.

`index.html` also contains the same details as plain text so the page reads
correctly for search engines and without JavaScript. For a full rebrand, run a
find-and-replace on `index.html` as well (and update `<title>` and the meta tags).

## Change the colours

All colours are CSS variables at the top of `css/style.css`. Replace the
`--brand-50` … `--brand-950` scale and the whole page follows.

### How the logo follows the palette

The logo is not shown as a coloured image. It is split into two alpha masks,
`logo-ink.png` (dark artwork) and `logo-accent.png` (highlight artwork), and
CSS fills each mask with a variable:

```css
--logo-ink: var(--brand-900);
--logo-accent: var(--brand-500);
```

Add the class `logo--on-dark` to use the white version on dark backgrounds.
Browsers without CSS mask support fall back to `logo.png` with a hue filter.

To swap in a different logo:

```bash
pip install pillow numpy
python3 tools/split_logo.py path/to/new-logo.png
```

Then copy the printed `aspect-ratio` into the `.logo` rule in `css/style.css`.

## Indexing and the home address

- Only `index.html` is set to `index, follow`. Every other page is
  `noindex, nofollow` until its content is final.
- The logo and every "Home" link point to `/` (the root of the domain), never
  to `index.html` or `#top`. If someone opens `/index.html`, the address bar
  is rewritten to `/`, and the canonical tag points to the root.
- The canonical tag, `og:url`, the business data in `index.html`, `robots.txt`
  and `sitemap.xml` use `https://pkitsol.com/`. Change them if the site goes
  on a different domain.
- Opened from disk (double-click), `/` links are pointed at `index.html`
  automatically so local preview still works.

## Forms and email

| Form | Where | Fields |
| --- | --- | --- |
| Contact (also used by "Get a Quote Now" and the footer button) | `index.html#contact` | Name, Email, Subject, Message |
| SEO proposal | `seo-services.html#quote` | Name, Email, Website, Company, Phone, Budget, Comments |
| Web quote | `web-solutions.html#quote` | Same fields, web budget ranges, website optional |
| Digital marketing proposal | `digital-marketing.html#quote` | Same fields, "Work Email Address" |

The "Send Me a Proposal" boxes on the home page pass the typed website to the
matching service form.

Every form is sent by `js/main.js` to the address in `js/config.js` → `forms`
and arrives by email. The default service is FormSubmit.co (free, no account):

1. Upload the site and open it on the real domain.
2. Send one test message from any form.
3. FormSubmit emails an "Activate Form" link to `pkitsols@gmail.com`. Click it.
4. Send a second test. It should arrive in the inbox (check Spam the first time).

Forms do not send from a page opened by double-click; test on the live site.
To deliver to a different inbox set `forms.to`. To use another service, put
its URL in `forms.endpoint`; the form then posts the same fields as JSON.

To change budget options or add a field, edit the form in that page's HTML.
Give every new `<input>` a `name`; that name becomes the label in the email.

## Images

Run the download script once. It saves the About and What We Offer photos, the
three Why Choose Us photos and the three Search Console graphs into `assets/img`.

- Windows: double-click `tools/download-images.bat`
- macOS / Linux: `bash tools/download-images.sh`

Until the files exist locally, each image loads from its web address
(`data-remote`), and if that also fails it shows the blue placeholder
(`data-placeholder`). Commit the downloaded files so the live site does not
depend on another server.

| Image | Local file | To change it |
| --- | --- | --- |
| About Our Company | `assets/img/about.avif` | Replace the file, or edit `src` in `index.html` |
| What We Offer | `assets/img/offer.jpg` | Same |
| Why Choose Us (3 tabs) | `assets/img/why-1.jpg`, `why-2.jpg`, `why-3.jpg` | Same. Square photos, 800 x 800 or larger |
| SEO graphs | `assets/img/portfolio/*.png` | Listed in `js/config.js` |

The Why Choose Us photos come from Unsplash (free licence, no attribution required).

## Portfolio

Everything in the portfolio is listed in `js/config.js` under `portfolio`.

### Add an SEO project (graph + "Real Result" table)

1. Take the Search Console screenshot and save it in `assets/img/portfolio/`,
   for example `gsc-my-client.png`.
2. In `js/config.js`, copy one block inside `portfolio.seo`, paste it after the
   last block (keep the comma between blocks) and edit it:

```js
{
  title: "My Client",
  link: "https://myclient.com/",
  image: "assets/img/portfolio/gsc-my-client.png",
  rows: [
    { keyword: "best keyword", rank: 1, proof: "https://i.imgur.com/xxxx.png", url: "https://myclient.com/page/" },
    { keyword: "second keyword", rank: 3, proof: "https://i.imgur.com/yyyy.png", url: "https://myclient.com/other/" }
  ]
}
```

`proof` is what opens when a visitor clicks the rank number (a SERP screenshot
uploaded to Imgur, or any link). Leave `rows` out to show only the graph.

### Add a website mockup (Web Solutions tab)

Add one line to `portfolio.web`. The laptop and phone mockups are generated
from the address:

```js
web: [
  { url: "https://zarwa.store/", title: "Zarwa Store" },
  { url: "https://newclient.com/", title: "New Client" }
]
```

Screenshots come from the service set in `screenshot` (default: WordPress.com
mShots, free, no account). The first time a new address is shown the service
needs a few seconds; the page retries by itself. To use your own screenshot
instead, add `image: "assets/img/portfolio/newclient.png"` (and optionally
`mobileImage`). Use `phone: false` to hide the phone.

### Digital Marketing tab (cards + campaign screenshots)

The five cards are listed in `portfolio.marketing`. Each has a "Real Result"
button that opens its screenshots.

1. Take the screenshot (Meta Ads Manager, Google Ads, Mailchimp ...) and hide
   anything the client would not want public.
2. Save it in `assets/img/portfolio/`, for example `result-ppc.png`.
3. In `js/config.js` put the file in that card's `results` list. Several
   screenshots are allowed:

```js
{ title: "PPC Advertising", color: "#155dfc", tilt: 7,
  text: "Google and Meta campaigns with tight targeting and results you can measure.",
  results: ["assets/img/portfolio/result-ppc.png", "assets/img/portfolio/result-ppc-2.png"],
  note: "Lead campaign, 30 days" }
```

Until a file exists the dialog shows a placeholder chart. `results: []` hides
the button on that card. Add or remove cards by adding or removing blocks.

## Add a service page

`seo-services.html`, `web-solutions.html` and `digital-marketing.html` are
finished pages. `service-template.html` is the same layout with the text
replaced by `[CAPITALS IN BRACKETS]`.

1. Copy `service-template.html` and rename the copy in lowercase with hyphens,
   for example `web-solutions.html`. Keep it in the same folder as `index.html`.
2. Open the copy and replace every `[...]` placeholder. Search for `[` to find
   them all. The parts, top to bottom:
   - `<title>` and `<meta name="description">`: unique for every page
   - Page hero: breadcrumb name, one `<h1>` with the main keyword, intro
   - What is included: six cards. Change the icon with `<use href="#i-NAME"/>`
     (the list of names is in the comment above the icon sprite). Delete or
     duplicate an `<article class="service-card">` block to change the count
   - How we work: four steps (`<li class="step">`); numbers are added automatically
   - Results: optional. Copy the block from `seo-services.html` for SEO graphs,
     or use `<div class="mockups" data-portfolio="web"></div>` for website mockups
   - Questions: each `faq__item` needs its own `sfaq-1`, `sfaq-2` ... id
   - Quote form at the bottom: change `data-form="..."` to the service name
     (it appears in the email subject) and edit the budget options if needed
3. The page stays `noindex, nofollow` while you work on it. When the content
   is final, change it to `index, follow` and add the page to `sitemap.xml`.
4. Link the page from the home page so visitors and Google can reach it:
   - footer list in `index.html`: `<li><a href="web-solutions.html">Web Solutions</a></li>`
   - optionally the main nav: change `href="#web"` to `href="web-solutions.html"`
     (do the same in the other pages' headers)
5. Open the page in a browser, check it on a phone width, then upload it.

Header, footer, floating buttons and contact details are already in the
template and read the brand settings from `js/config.js`. If you change the
header or footer in `index.html` later, repeat the change in each service page.

## Before going live

| Item | Where | What to do |
| --- | --- | --- |
| Images | `tools/download-images` | Run it once and commit the files (see Images). |
| Other artwork | `assets/img/*.svg` | Hero, industries and service-card backgrounds are still illustrations. Replace when you have photos (hero background is set in `css/style.css`, `.hero`). |
| Testimonials | `index.html`, section `.testimonials` | Replace the placeholder quotes with real ones. Put an `<img>` inside `.testimonial__avatar` to show a photo. |
| Social links | `js/config.js` | Add your Facebook, Instagram and LinkedIn URLs. |
| Forms | live site | Send one test message and click the FormSubmit activation link (see Forms and email). |
| Domain | `index.html`, `robots.txt`, `sitemap.xml` | Uses `https://pkitsol.com/`. Change it if the domain is different. |
| Template | `service-template.html` | It is `noindex`; you can leave it out of the upload. |
| Share image | `index.html` `<head>` | `og:image` needs an absolute URL once you know the domain. |

## Interactive parts

| Component | Markup hook | Notes |
| --- | --- | --- |
| Sticky header, mobile menu | `data-header`, `data-nav-toggle` | Closes on link tap, Escape and resize |
| Tabs (industries, portfolio, why us) | `data-tabs` + `role="tab"` | Arrow-key navigation |
| Carousels (SEO projects, testimonials) | `data-carousel` | Swipe, arrows, dots, optional `data-autoplay="5000"`; slides per view set by `--per-view` in CSS |
| Service cards with proposal form | `data-feature-card`, `data-proposal` | Hover on desktop, tap on touch; submitting pre-fills the contact form |
| SEO result panel | `data-result-dialog` | Opens from "Real Result"; rank numbers link to proof |
| Website mockups | `data-portfolio="web"` | Built from URLs in `config.js` |
| FAQ accordion | `data-accordion` | One item open at a time |
| Scroll reveal | `data-reveal="left"` or `"up"` | Skipped when the visitor prefers reduced motion |

## Browser support

Current Chrome, Edge, Firefox and Safari (desktop and mobile).
