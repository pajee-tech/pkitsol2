/**
 * Brand settings
 * ---------------------------------------------------------------------------
 * Every brand detail on the page is filled in from this object by js/main.js:
 *   text  -> elements marked  data-brand="name | phone | email | address | tagline"
 *   links -> elements marked  data-brand-link="phone | email | whatsapp | facebook | instagram | linkedin"
 *   map   -> the iframe marked data-brand-map
 *   portfolio -> the SEO slides, result tables, marketing cards and website mockups
 *   forms     -> where form submissions are emailed
 * To rebrand the site, edit the values below. Nothing else needs to change.
 * (index.html also carries the same values as plain text so the page still
 *  reads correctly for search engines and with JavaScript turned off.)
 */
window.SITE_CONFIG = {
  name: "PK IT Sol",
  tagline: "Your Digital Partner",

  phone: "+923006540558",          // used for tel: links and shown as text
  whatsapp: "+923006540558",       // WhatsApp number (any format; digits are extracted)
  whatsappMessage: "Hello, I would like to book a strategy call.",   // pre-filled chat text, optional

  email: "pkitsols@gmail.com",

  address: "Plaza Number 55, Office Number 505 5th Floor, Civic Center Bahria Town Phase 4 Bahria Town, Islamabad, 44000",
  // Search text for the Google Maps embed. Leave empty to use the address above.
  mapQuery: "Plaza Number 55, Civic Center, Bahria Town Phase 4, Islamabad 44000",

  // Social profiles. An icon is hidden automatically while its URL is empty.
  social: {
    facebook: "",
    instagram: "",
    linkedin: ""
  },

  /* ------------------------------------------------------------------------
     FORMS  (Contact / Get a Quote on the home page + one form per service page)
     ------------------------------------------------------------------------
     Every form sends its fields to "endpoint" and the message arrives by email.
     Default: FormSubmit.co (free, no account). {email} is replaced by "to",
     or by the email above when "to" is empty.
       1. Upload the site, open it on the real domain and send one test message.
       2. FormSubmit emails an "Activate Form" link to that address. Click it once.
       3. From then on every submission is delivered to the inbox.
     Forms do NOT send from a page opened by double-click (file://); test online.
     To use another service (Formspree, Web3Forms, your own API) put its URL here. */
  forms: {
    endpoint: "https://formsubmit.co/ajax/{email}",
    to: ""
  },

  /* ------------------------------------------------------------------------
     PORTFOLIO
     ------------------------------------------------------------------------ */
  portfolio: {

    /* SEO tab. One block per project.
         title   project name shown under the graph
         link    client website ("PROJECT: VISIT WEBSITE" in the result panel)
         image   Search Console screenshot. Put the file in assets/img/portfolio/
         remote  optional web address of the same image, used only while the
                 local file is missing
         rows    the "Real Result" table: keyword, rank, proof (screenshot or
                 page that opens when the rank number is clicked), url (ranked page)
       To add a project: copy one block, paste it after the last one, edit it. */
    seo: [
      {
        title: "Two Guys",
        link: "https://www.twoguys.ae/",
        image: "assets/img/portfolio/gsc-two-guys.png",
        remote: "https://techwiz-solution.vercel.app/Graph.png",
        rows: [
          { keyword: "sintered stone flooring", rank: 1,  proof: "https://i.imgur.com/lSY8kcm.png", url: "https://www.twoguys.ae/floors/sintered-stone/" },
          { keyword: "linen curtains dubai",    rank: 9,  proof: "https://i.imgur.com/KGWiNyR.png", url: "https://www.twoguys.ae/curtains/linen-curtains/" },
          { keyword: "Home Furnishing",         rank: 11, proof: "https://i.imgur.com/U9shyx0.png", url: "https://www.twoguys.ae/" },
          { keyword: "shutters in Dubai",       rank: 15, proof: "https://i.imgur.com/jlHLRTG.png", url: "https://www.twoguys.ae/shutters/" },
          { keyword: "LVT flooring UAE",        rank: 28, proof: "https://i.imgur.com/OHxbZeg.png", url: "https://www.twoguys.ae/floors/lvt/" },
          { keyword: "blackout curtains dubai", rank: 29, proof: "https://i.imgur.com/7NfGVdP.png", url: "https://www.twoguys.ae/curtains/blackout-curtains/" },
          { keyword: "Window Curtains Dubai",   rank: 30, proof: "https://www.twoguys.ae/curtains/", url: "https://www.twoguys.ae/curtains/" },
          { keyword: "blinds in dubai",         rank: 33, proof: "https://i.imgur.com/DCjFJTz.png", url: "https://www.twoguys.ae/blinds/" },
          { keyword: "SPC flooring dubai",      rank: 35, proof: "https://i.imgur.com/o97DbQq.png", url: "https://www.twoguys.ae/floors/spc/" },
          { keyword: "wall decor dubai",        rank: 35, proof: "https://i.imgur.com/JGhNT7f.png", url: "https://www.twoguys.ae/furniture/bedroom/" }
        ]
      },
      {
        title: "BnC",
        link: "https://blindsandcurtains.ae/",
        image: "assets/img/portfolio/gsc-bnc.png",
        remote: "https://techwiz-solution.vercel.app/blindgraph.png",
        rows: [
          { keyword: "dubai curtains and blinds", rank: 2, proof: "https://i.imgur.com/4lIsfVU.png", url: "https://blindsandcurtains.ae/" },
          { keyword: "motorised curtains",        rank: 2, proof: "https://i.imgur.com/V6rRZiZ.png", url: "https://blindsandcurtains.ae/curtains/motorised-curtains/" },
          { keyword: "dubai blinds",              rank: 2, proof: "https://i.imgur.com/RVglZtR.png", url: "https://blindsandcurtains.ae/" },
          { keyword: "conservatory blinds",       rank: 2, proof: "https://i.imgur.com/U4WS8xk.png", url: "https://blindsandcurtains.ae/blinds/conservatory-blinds/" },
          { keyword: "full height shutters",      rank: 3, proof: "https://i.imgur.com/B8sgbJJ.png", url: "https://blindsandcurtains.ae/shutters-range/full-heig/" },
          { keyword: "office curtains",           rank: 3, proof: "https://i.imgur.com/jIs6iFO.png", url: "https://blindsandcurtains.ae/curtains/office-window-curtains/" },
          { keyword: "duplex blinds dubai",       rank: 3, proof: "https://i.imgur.com/T4FG9Wc.png", url: "https://blindsandcurtains.ae/blinds/duplex-blinds/" },
          { keyword: "outdoor blinds dubai",      rank: 4, proof: "https://blindsandcurtains.ae/balcony-blinds-and-curtains/", url: "https://blindsandcurtains.ae/balcony-blinds-and-curtains/" },
          { keyword: "motorised curtains",        rank: 6, proof: "https://i.imgur.com/QygFSUg.png", url: "https://blindsandcurtains.ae/curtains/motorised-curtains/" },
          { keyword: "blackout roller blinds",    rank: 6, proof: "https://i.imgur.com/D33DhGo.png", url: "https://blindsandcurtains.ae/blinds/roller-blinds/blackout-roller-blinds/" }
        ]
      },
      {
        title: "Interior Films Dubai",
        link: "https://interiorfilm.ae/",
        image: "assets/img/portfolio/gsc-interior-films.png",
        remote: "https://techwiz-solution.vercel.app/interiorgraph.png",
        rows: [
          { keyword: "Interior Vinyl Film",       rank: 1, proof: "https://interiorfilm.ae/", url: "https://interiorfilm.ae/" },
          { keyword: "Pure Gold Vinyl",           rank: 1, proof: "https://i.imgur.com/9RL1AFb.png", url: "https://interiorfilm.ae/products?category=cement-grey-series" },
          { keyword: "Cement Grey Vinyl",         rank: 1, proof: "https://interiorfilm.ae/products?category=cement-grey-series", url: "https://interiorfilm.ae/products?category=cement-grey-series" },
          { keyword: "Offwhite Fabric Vinyl",     rank: 1, proof: "https://i.imgur.com/lWinmSJ.png", url: "https://interiorfilm.ae/product/offwhite-fabric-vinyl" },
          { keyword: "White Vinyl Film",          rank: 1, proof: "https://i.imgur.com/PCLnfCd.png", url: "https://interiorfilm.ae/product/pure-white-vinyl-film" },
          { keyword: "Interior Film Accessories", rank: 1, proof: "https://i.imgur.com/M5TL6qz.png", url: "https://interiorfilm.ae/" },
          { keyword: "wood vinyl wrap",           rank: 2, proof: "https://i.imgur.com/WRa05ZP.png", url: "https://interiorfilm.ae/products?category=wood-grain-series" },
          { keyword: "Grey Wood Vinyl",           rank: 2, proof: "https://i.imgur.com/uPqLixN.png", url: "https://interiorfilm.ae/product/grey-wood-vinyl" },
          { keyword: "Metallic Vinyl",            rank: 3, proof: "https://i.imgur.com/rptamdb.png", url: "https://interiorfilm.ae/product/metallic-silver-vinyl" },
          { keyword: "Marble Wrap",               rank: 3, proof: "https://i.imgur.com/yQcwRM8.png", url: "https://interiorfilm.ae/product/grey-marble-vinyl-wrap" }
        ]
      }
    ],

    /* Digital Marketing tab. One block per card.
         title    card heading
         text     one or two lines under the heading
         color    card colour
         tilt     how far the card leans, in degrees (negative = left)
         results  campaign screenshots shown when "Real Result" is clicked
                  (Ads Manager, Google Ads, Mailchimp ...). Save them in
                  assets/img/portfolio/ and list one or more here. A card with
                  an empty list  results: []  shows no button.
         note     optional line shown above the screenshots */
    marketing: [
      { title: "SEO Optimization",       color: "#9810fa", tilt: -8,
        text: "Keyword targeting, technical fixes and faster pages that move you up the search results.",
        results: ["assets/img/portfolio/result-seo-campaign.png"], note: "" },
      { title: "Content Marketing",      color: "#ff6900", tilt: -4,
        text: "Content plans that earn attention, build authority and bring steady organic traffic.",
        results: ["assets/img/portfolio/result-content.png"], note: "" },
      { title: "Social Media Marketing", color: "#00a63e", tilt: 3,
        text: "Creative campaigns that grow your following, build loyalty and turn fans into buyers.",
        results: ["assets/img/portfolio/result-social.png"], note: "" },
      { title: "PPC Advertising",        color: "#155dfc", tilt: 7,
        text: "Google and Meta campaigns with tight targeting and results you can measure.",
        results: ["assets/img/portfolio/result-ppc.png"], note: "" },
      { title: "Email Marketing",        color: "#e17100", tilt: -6,
        text: "Automated, personal emails that nurture leads and keep customers returning.",
        results: ["assets/img/portfolio/result-email.png"], note: "" }
    ],

    /* Web Solutions tab. Add a website address and the page builds a laptop +
       phone mockup of it automatically (see "screenshot" below).
         url          the live website (required)
         title        name shown under the mockup (optional; the domain is used if empty)
         image        optional: your own desktop screenshot instead of the automatic one
         mobileImage  optional: your own phone screenshot
         phone        set to false to hide the phone mockup */
    web: [
      { url: "https://zarwa.store/",         title: "Zarwa Store" },
      { url: "https://kazmifoundation.com/", title: "Kazmi Foundation" }
    ]
  },

  /* Service that turns a URL into a screenshot for the mockups above.
     {url} is replaced with the encoded website address. The default is the free
     WordPress.com mShots service (no account needed; the first view of a new
     site can take a few seconds while the screenshot is made).
     Another option: "https://image.thum.io/get/width/1280/crop/800/{rawurl}" */
  screenshot: {
    desktop: "https://s.wordpress.com/mshots/v1/{url}?w=1280&h=800",
    mobile:  "https://s.wordpress.com/mshots/v1/{url}?w=390&h=844&vpw=390&vph=844"
  }
};
