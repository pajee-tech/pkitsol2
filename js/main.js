/* ==========================================================================
   PK IT Sol landing page: interactions (no dependencies)
   1. Brand injection      5. Carousels          9. Forms (email delivery)
   2. Header & mobile nav  6. FAQ accordion
   3. Scroll helpers       7. Scroll reveal     10. Portfolio (SEO, marketing, web)
   4. Tabs                 8. Feature cards & proposal buttons
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");   // also set inline in <head> to avoid a flash

  var CFG = window.SITE_CONFIG || {};
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(selector, root) { return (root || document).querySelector(selector); }
  function $$(selector, root) { return Array.prototype.slice.call((root || document).querySelectorAll(selector)); }

  /* 1. BRAND INJECTION ----------------------------------------------------- */
  function applyBrand() {
    var social = CFG.social || {};
    var phone = CFG.phone || "";
    var waDigits = (CFG.whatsapp || phone).replace(/\D/g, "");
    var waText = CFG.whatsappMessage ? "?text=" + encodeURIComponent(CFG.whatsappMessage) : "";

    var text = {
      name: CFG.name,
      nameUpper: CFG.name ? CFG.name.toUpperCase() : "",
      tagline: CFG.tagline,
      taglineUpper: CFG.tagline ? CFG.tagline.toUpperCase() : "",
      phone: CFG.phoneDisplay || phone,
      email: CFG.email,
      address: CFG.address
    };
    var links = {
      phone: phone ? "tel:" + phone.replace(/[^\d+]/g, "") : "",
      email: CFG.email ? "mailto:" + CFG.email : "",
      whatsapp: waDigits ? "https://wa.me/" + waDigits + waText : "",
      facebook: social.facebook,
      instagram: social.instagram,
      linkedin: social.linkedin
    };

    $$("[data-brand]").forEach(function (el) {
      var value = text[el.getAttribute("data-brand")];
      if (value) el.textContent = value;
    });
    $$("[data-brand-link]").forEach(function (el) {
      var value = links[el.getAttribute("data-brand-link")];
      if (value) el.setAttribute("href", value);
      else el.hidden = true;                       // e.g. a social profile that is not set yet
    });
    if (CFG.name) {
      $$("[data-brand-alt]").forEach(function (el) { el.alt = CFG.name; });
      $$("[data-brand-label]").forEach(function (el) { el.setAttribute("aria-label", CFG.name + ", back to top"); });
    }

    var map = $("[data-brand-map]");
    var query = CFG.mapQuery || CFG.address;
    if (map && query) {
      var src = "https://www.google.com/maps?q=" + encodeURIComponent(query) + "&output=embed";
      if (map.getAttribute("src") !== src) map.setAttribute("src", src);
    }

    $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  // Links written as "/" or "/#section" point at the root of the domain. A page opened
  // from disk (file://) has no domain, so those links are pointed at index.html instead.
  function initHomeLinks() {
    if (location.protocol === "file:") {
      $$('a[href^="/"]').forEach(function (a) {
        var rest = a.getAttribute("href").slice(1);
        a.setAttribute("href", rest === "" || rest.charAt(0) === "#" ? "index.html" + rest : rest);
      });
    } else if (/\/index\.html$/.test(location.pathname) && window.history.replaceState) {
      // /index.html and / are the same page: show the root address
      window.history.replaceState(null, "", location.pathname.replace(/index\.html$/, "") + location.search + location.hash);
    }
  }

  /* 2. HEADER & MOBILE NAV ------------------------------------------------- */
  function initHeader() {
    var header = $("[data-header]");
    var toggle = $("[data-nav-toggle]");
    var menu = $("#mobile-menu");
    if (!header || !toggle || !menu) return;

    function setOpen(open) {
      menu.hidden = !open;
      header.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    toggle.addEventListener("click", function () { setOpen(menu.hidden); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function (e) { if (e.matches) setOpen(false); });
  }

  /* 3. SCROLL HELPERS (sticky shadow, back-to-top button) ------------------- */
  function initScroll() {
    var header = $("[data-header]");
    var toTop = $(".fab--top");
    var ticking = false;

    function update() {
      ticking = false;
      if (header) header.classList.toggle("is-stuck", window.scrollY > 4 && header.getBoundingClientRect().top <= 0);
      if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 500);
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* 4. TABS (industries, portfolio, why choose us) -------------------------- */
  function initTabs() {
    $$("[data-tabs]").forEach(function (root) {
      var tabs = $$('[role="tab"]', root);

      function select(tab, moveFocus) {
        tabs.forEach(function (t) {
          var active = t === tab;
          var panel = document.getElementById(t.getAttribute("aria-controls"));
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", String(active));
          t.tabIndex = active ? 0 : -1;
          if (panel) panel.hidden = !active;
        });
        if (moveFocus) tab.focus();
      }

      tabs.forEach(function (tab, i) {
        tab.addEventListener("click", function () { select(tab, false); });
        tab.addEventListener("keydown", function (e) {
          var next = null;
          if (e.key === "ArrowRight" || e.key === "ArrowDown") next = tabs[(i + 1) % tabs.length];
          else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = tabs[(i - 1 + tabs.length) % tabs.length];
          else if (e.key === "Home") next = tabs[0];
          else if (e.key === "End") next = tabs[tabs.length - 1];
          if (next) { e.preventDefault(); select(next, true); }
        });
      });
    });
  }

  /* 5. CAROUSELS ------------------------------------------------------------ */
  // Slides per view and gap come from the CSS variables --per-view and --gap,
  // so breakpoints stay in the stylesheet.
  function Carousel(root) {
    var viewport = $(".carousel__viewport", root);
    var track = $(".carousel__track", root);
    var slides = $$(".carousel__slide", root);
    var dotsWrap = $("[data-carousel-dots]", root);
    var prevBtn = $("[data-carousel-prev]", root);
    var nextBtn = $("[data-carousel-next]", root);
    var delay = reduceMotion ? 0 : parseInt(root.getAttribute("data-autoplay"), 10) || 0;
    var index = 0, pages = 1, timer = null, dots = [];
    if (!viewport || !track || !slides.length) return;

    function perView() {
      return Math.max(1, parseInt(getComputedStyle(root).getPropertyValue("--per-view"), 10) || 1);
    }
    function step() {
      return slides[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
    }
    function render() {
      track.style.transform = "translate3d(" + (-index * step()) + "px,0,0)";
      dots.forEach(function (dot, i) { dot.setAttribute("aria-current", String(i === index)); });
      var visible = perView();
      slides.forEach(function (slide, i) {
        var shown = i >= index && i < index + visible;
        slide.setAttribute("aria-hidden", String(!shown));
        if ("inert" in slide) slide.inert = !shown;
      });
    }
    function go(i) {
      index = (i + pages) % pages;
      render();
    }
    function build() {
      var count = Math.max(1, slides.length - perView() + 1);
      if (count !== pages || !dots.length) {
        pages = count;
        if (dotsWrap) {
          dotsWrap.innerHTML = "";
          dots = [];
          for (var i = 0; i < pages; i++) {
            var dot = document.createElement("button");
            dot.type = "button";
            dot.setAttribute("aria-label", "Show slide " + (i + 1) + " of " + pages);
            dot.addEventListener("click", go.bind(null, i));
            dotsWrap.appendChild(dot);
            dots.push(dot);
          }
          dotsWrap.hidden = pages < 2;
        }
      }
      index = Math.min(index, pages - 1);
      track.classList.add("is-dragging");            // skip the transition while re-measuring
      render();
      void track.offsetWidth;
      track.classList.remove("is-dragging");
    }

    function play() {
      stop();
      if (delay && pages > 1) timer = window.setInterval(function () { go(index + 1); }, delay);
    }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }

    if (prevBtn) prevBtn.addEventListener("click", function () { go(index - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { go(index + 1); });

    // Swipe / drag
    var startX = 0, startY = 0, dx = 0, dragging = false, pointerId = null;
    viewport.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.target.closest("button, a")) return;
      pointerId = e.pointerId; startX = e.clientX; startY = e.clientY; dx = 0; dragging = false;
    });
    viewport.addEventListener("pointermove", function (e) {
      if (e.pointerId !== pointerId) return;
      dx = e.clientX - startX;
      if (!dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(e.clientY - startY)) {
        dragging = true;
        track.classList.add("is-dragging");
        try { viewport.setPointerCapture(pointerId); } catch (err) { /* older browsers */ }
      }
      if (dragging) track.style.transform = "translate3d(" + (-index * step() + dx) + "px,0,0)";
    });
    function endDrag(e) {
      if (e.pointerId !== pointerId) return;
      pointerId = null;
      if (!dragging) return;
      dragging = false;
      track.classList.remove("is-dragging");
      if (dx < -50 && index < pages - 1) go(index + 1);
      else if (dx > 50 && index > 0) go(index - 1);
      else render();
    }
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") go(index - 1);
      else if (e.key === "ArrowRight") go(index + 1);
    });

    // Autoplay pauses while the visitor is interacting or the tab is hidden
    root.addEventListener("pointerenter", stop);
    root.addEventListener("pointerleave", play);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", play);
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : play(); });

    // Re-measure on resize and when a hidden tab panel becomes visible
    if ("ResizeObserver" in window) new ResizeObserver(build).observe(viewport);
    else window.addEventListener("resize", build);

    build();
    play();
  }

  /* 6. FAQ ACCORDION -------------------------------------------------------- */
  function initAccordion() {
    $$("[data-accordion]").forEach(function (root) {
      var buttons = $$(".faq__q", root);
      buttons.forEach(function (button) {
        button.addEventListener("click", function () {
          var open = button.getAttribute("aria-expanded") !== "true";
          buttons.forEach(function (b) {
            var on = b === button && open;
            b.setAttribute("aria-expanded", String(on));
            b.closest(".faq__item").classList.toggle("is-open", on);
          });
        });
      });
    });
  }

  /* 7. SCROLL REVEAL -------------------------------------------------------- */
  function initReveal() {
    var items = $$("[data-reveal]");
    if (!items.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-revealed"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* 8. FEATURE CARDS & PROPOSAL BUTTONS ------------------------------------- */
  function initFeatureCards() {
    var touch = window.matchMedia("(hover: none)");

    $$("[data-feature-card]").forEach(function (card) {
      // Hover reveals the overlay on desktop; on touch screens a tap toggles it
      card.addEventListener("click", function (e) {
        if (e.target.closest(".proposal")) return;
        if (touch.matches) {
          card.classList.toggle("is-open");
          if (!card.classList.contains("is-open")) card.blur();
        }
      });
      card.addEventListener("keydown", function (e) {
        if (e.target === card && e.key === "Escape") { card.classList.remove("is-open"); card.blur(); }
      });
    });

    // "Send Me a Proposal": carry the typed website to that service's own form
    $$("[data-proposal]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var website = form.elements.website.value.trim();
        window.location.href = form.getAttribute("data-proposal") +
          (website ? "?website=" + encodeURIComponent(website) : "") + "#quote";
      });
    });

    // "Get a Quote Now" and the footer button share the contact form
    $$("[data-quote]").forEach(function (link) {
      link.addEventListener("click", function () {
        var form = $('form[data-form="Contact"]');
        if (form && !form.elements.subject.value) form.elements.subject.value = "Quote request";
      });
    });
  }

  /* 9. FORMS (contact form + service quote forms) --------------------------- */
  var FIELD_LABELS = { name: "Name", email: "Email", subject: "Subject", message: "Message",
                       website: "Website", company: "Company", phone: "Phone", budget: "Budget" };

  function formEndpoint() {
    var forms = CFG.forms || {};
    var to = forms.to || CFG.email || "";
    return forms.endpoint ? String(forms.endpoint).replace("{email}", encodeURIComponent(to).replace(/%40/g, "@")) : "";
  }

  function sendForm(formName, data) {
    var endpoint = formEndpoint();
    var payload = {};
    var subject = (CFG.name || "Website") + ": " + formName + (data.Name ? " from " + data.Name : "");
    Object.keys(data).forEach(function (key) { if (data[key]) payload[key] = data[key]; });
    payload.Form = formName;
    payload.Page = location.href.split("#")[0];
    if (/formsubmit\.co/.test(endpoint)) {
      payload._subject = subject;
      payload._template = "table";
      payload._captcha = "false";
      if (data.Email) payload._replyto = data.Email;
    } else {
      payload.subject = subject;
    }
    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    }).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (body) {
        if (!response.ok || body.success === false || body.success === "false") {
          var error = new Error(body.message || "Request failed: " + response.status);
          error.needsActivation = /activat/i.test(body.message || "");
          throw error;
        }
        return body;
      });
    });
  }

  function initForms() {
    var params = new URLSearchParams(location.search);

    $$("form[data-form]").forEach(function (form) {
      var formName = form.getAttribute("data-form");
      var status = $("[data-form-status]", form);
      var button = $('button[type="submit"]', form);
      var label = button.textContent;
      var f = form.elements;

      // Values passed in from another page or set in the markup
      if (f.website && params.get("website")) f.website.value = params.get("website");
      if (f.subject && form.getAttribute("data-subject") && !f.subject.value) f.subject.value = form.getAttribute("data-subject");

      function say(message, kind) {
        status.className = "form-status" + (kind ? " is-" + kind : "");
        status.textContent = message;
      }
      function emailLink() {
        var link = document.createElement("a");
        link.href = "mailto:" + (CFG.email || "");
        link.textContent = CFG.email || "email";
        return link;
      }
      function invalid(field, message) {
        field.setAttribute("aria-invalid", "true");
        field.focus();
        say(message, "error");
      }
      function fieldName(field) {
        var lbl = field.id ? $('label[for="' + field.id + '"]', form) : null;
        return (lbl ? lbl.textContent : field.name).replace(/\s*\*\s*$/, "").trim();
      }

      form.addEventListener("input", function (e) { e.target.removeAttribute("aria-invalid"); });
      form.addEventListener("change", function (e) { e.target.removeAttribute("aria-invalid"); });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (f._honey && f._honey.value) return;                              // spam trap

        var data = {};
        var fields = $$("input, select, textarea", form).filter(function (el) { return el.name && el.name.charAt(0) !== "_"; });
        for (var i = 0; i < fields.length; i++) {
          var field = fields[i];
          var value = field.value.trim();
          if (field.required && !value) {
            return invalid(field, field.tagName === "SELECT" ? "Choose an option for " + fieldName(field) + "." : "Fill in " + fieldName(field) + ".");
          }
          if (field.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return invalid(field, "Enter a valid email address, like name@example.com.");
          }
          data[FIELD_LABELS[field.name] || field.name] = value;
        }

        if (location.protocol === "file:") {
          say("Forms send email only from the live website. Upload the site and test it there.", "error");
          return;
        }
        if (!formEndpoint()) {
          say("No form endpoint is set in js/config.js.", "error");
          return;
        }

        button.disabled = true;
        button.textContent = "Sending...";
        say("");
        sendForm(formName, data).then(function () {
          form.reset();
          if (f.subject && form.getAttribute("data-subject")) f.subject.value = form.getAttribute("data-subject");
          say("Message sent successfully. We will reply to " + data.Email + " soon.", "success");
        }).catch(function (error) {
          if (error.needsActivation) {
            say("One step left: this form needs a one-time activation. Open the inbox of " + (CFG.email || "the site email") + " and click the Activate link, then send again.", "error");
          } else {
            say("The message could not be sent. Check your connection and try again, or email us at ", "error");
            status.appendChild(emailLink());
          }
        }).then(function () {
          button.disabled = false;
          button.textContent = label;
        });
      });
    });
  }

  /* 10. PORTFOLIO (built from SITE_CONFIG.portfolio) ------------------------ */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function prettyUrl(url) {
    return String(url).trim().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
  }
  function withFallback(img, remote, placeholder) {
    if (remote) img.setAttribute("data-remote", remote);
    if (placeholder) img.setAttribute("data-placeholder", placeholder);
    img.onerror = function () { if (window.imgFallback) window.imgFallback(img); };
    return img;
  }

  // SEO tab: one slide per project, "Real Result" opens the ranking table
  function renderSeoProjects() {
    var track = $('[data-portfolio="seo"]');
    var projects = (CFG.portfolio && CFG.portfolio.seo) || [];
    if (!track) return;

    projects.forEach(function (project) {
      var slide = el("li", "carousel__slide");
      var card = el("article", "project");
      var media = el("div", "project__media");
      var img = withFallback(el("img"), project.remote, "assets/img/result-seo.svg");
      img.alt = project.title + " search performance graph";
      img.loading = "lazy";
      img.src = project.image || project.remote || "assets/img/result-seo.svg";
      media.appendChild(img);

      var button = el("button", "project__link", "Real Result");
      button.type = "button";
      button.addEventListener("click", function () {
        openResult({
          title: project.title,
          link: project.link,
          images: [{ src: project.image, remote: project.remote, alt: project.title + " search performance graph" }],
          placeholder: "assets/img/result-seo.svg",
          rows: project.rows,
          proposal: "seo-services.html"
        });
      });

      card.appendChild(media);
      card.appendChild(el("h4", "", project.title));
      card.appendChild(button);
      slide.appendChild(card);
      track.appendChild(slide);
    });
  }

  // Digital marketing tab: fanned cards, each with its campaign screenshots
  function renderMarketingCards() {
    var wrap = $('[data-portfolio="marketing"]');
    var cards = (CFG.portfolio && CFG.portfolio.marketing) || [];
    if (!wrap) return;

    cards.forEach(function (item) {
      var card = el("article", "fan__card");
      card.style.setProperty("--card", item.color || "var(--brand-600)");
      card.style.setProperty("--tilt", (Number(item.tilt) || 0) + "deg");

      var copy = el("div");
      copy.appendChild(el("h3", "", item.title));
      copy.appendChild(el("p", "", item.text));
      card.appendChild(copy);

      var shots = item.results || [];
      if (shots.length) {
        var button = el("button", "fan__btn", "Real Result");
        button.type = "button";
        button.setAttribute("aria-label", "Real result for " + item.title);
        button.addEventListener("click", function () {
          openResult({
            title: item.title,
            note: item.note,
            images: shots.map(function (src, n) {
              return { src: src, alt: item.title + " campaign performance screenshot " + (n + 1) };
            }),
            placeholder: "assets/img/result-marketing.svg",
            proposal: "digital-marketing.html"
          });
        });
        card.appendChild(button);
      }
      wrap.appendChild(card);
    });
  }

  // One dialog shows either kind of result: screenshots, plus a ranking table when rows are given
  function openResult(result) {
    var dialog = $("[data-result-dialog]");
    if (!dialog || !result) return;

    $("[data-result-title]", dialog).textContent = result.title;
    $("[data-result-project]", dialog).hidden = !result.link;
    if (result.link) $("[data-result-link]", dialog).href = result.link;
    $("[data-result-proposal]", dialog).setAttribute("href", (result.proposal || "seo-services.html") + "#quote");

    var figures = $("[data-result-images]", dialog);
    figures.textContent = "";
    if (result.note) figures.appendChild(el("p", "result__note", result.note));
    (result.images || []).forEach(function (image) {
      var figure = el("figure", "result__figure");
      var img = withFallback(el("img"), image.remote, result.placeholder);
      img.alt = image.alt || result.title;
      img.src = image.src || image.remote || result.placeholder;
      figure.appendChild(img);
      figures.appendChild(figure);
    });

    var rows = result.rows || [];
    var body = $("[data-result-rows]", dialog);
    body.textContent = "";
    rows.forEach(function (row, n) {
      var tr = el("tr");
      tr.appendChild(el("td", "", n + 1));
      tr.appendChild(el("td", "", row.keyword));

      var rankCell = el("td");
      if (row.proof) {
        var proof = el("a", "result__rank", row.rank);
        proof.href = row.proof; proof.target = "_blank"; proof.rel = "noopener";
        proof.setAttribute("aria-label", "Rank " + row.rank + " for " + row.keyword + ", open proof");
        rankCell.appendChild(proof);
      } else rankCell.textContent = row.rank;
      tr.appendChild(rankCell);

      var urlCell = el("td");
      if (row.url) {
        var link = el("a", "", prettyUrl(row.url));
        link.href = row.url.trim(); link.target = "_blank"; link.rel = "noopener";
        urlCell.appendChild(link);
      }
      tr.appendChild(urlCell);
      body.appendChild(tr);
    });
    $("[data-result-table-wrap]", dialog).hidden = !rows.length;

    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    dialog.scrollTop = 0;
  }

  function initResultDialog() {
    var dialog = $("[data-result-dialog]");
    if (!dialog) return;
    function close() { if (dialog.open) dialog.close(); }
    $("[data-result-close]", dialog).addEventListener("click", close);
    dialog.addEventListener("click", function (e) { if (e.target === dialog) close(); });   // click on the backdrop
    // "Send Me a Proposal" goes to that service's form; if we are already on that page, just scroll to it
    $("[data-result-proposal]", dialog).addEventListener("click", function (e) {
      var target = this.getAttribute("href").split("#")[0];
      var here = location.pathname.split("/").pop();
      var form = document.getElementById("quote");
      close();
      if (form && (here === target || here === target.replace(/\.html$/, ""))) {
        e.preventDefault();
        form.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    });
  }

  // Web tab: a laptop + phone mockup per URL, screenshots fetched from the
  // service set in SITE_CONFIG.screenshot
  function screenshotUrl(template, url) {
    return String(template || "").replace("{url}", encodeURIComponent(url)).replace("{rawurl}", url);
  }

  function loadShot(img, src, screen) {
    var tries = 0, maxTries = 8;
    img.onload = function () {
      // mShots answers with a 400x300 "generating" image while it works: ask again shortly
      if (img.naturalWidth === 400 && img.naturalHeight === 300 && /mshots/.test(src) && tries < maxTries) {
        tries++;
        window.setTimeout(function () { img.src = src + (src.indexOf("?") > -1 ? "&" : "?") + "retry=" + tries; }, 3500);
        return;
      }
      screen.classList.add("is-loaded");
    };
    img.onerror = function () { img.onerror = null; screen.classList.add("is-failed"); };
    img.src = src;
  }

  function buildScreen(src, label, alt) {
    var screen = el("span", "mockup__screen");
    screen.appendChild(el("span", "mockup__label", label));
    var img = el("img");
    img.alt = alt;
    img.loading = "lazy";
    screen.appendChild(img);
    loadShot(img, src, screen);
    return screen;
  }

  function renderWebProjects() {
    var grid = $('[data-portfolio="web"]');
    var projects = (CFG.portfolio && CFG.portfolio.web) || [];
    var shots = CFG.screenshot || {};
    if (!grid) return;

    projects.forEach(function (project) {
      if (!project || !project.url) return;
      var domain = prettyUrl(project.url).split("/")[0];
      var title = project.title || domain;

      var card = el("a", "mockup");
      card.href = project.url; card.target = "_blank"; card.rel = "noopener";
      card.setAttribute("aria-label", title + ", open " + domain + " in a new tab");

      var stage = el("span", "mockup__stage");
      var desktop = el("span", "mockup__desktop");
      var bar = el("span", "mockup__bar");
      bar.appendChild(el("i")); bar.appendChild(el("i")); bar.appendChild(el("i"));
      bar.appendChild(el("span", "mockup__url", domain));
      desktop.appendChild(bar);
      desktop.appendChild(buildScreen(project.image || screenshotUrl(shots.desktop, project.url), domain, title + " website on desktop"));
      stage.appendChild(desktop);

      var mobileSrc = project.mobileImage || (shots.mobile ? screenshotUrl(shots.mobile, project.url) : "");
      if (project.phone !== false && mobileSrc) {
        var phone = el("span", "mockup__phone");
        phone.appendChild(buildScreen(mobileSrc, "", ""));
        stage.appendChild(phone);
      }

      card.appendChild(stage);
      card.appendChild(el("span", "mockup__title", title));
      card.appendChild(el("span", "mockup__domain", domain));
      grid.appendChild(card);
    });
  }

  /* BOOT -------------------------------------------------------------------- */
  function init() {
    applyBrand();
    initHomeLinks();
    initHeader();
    initScroll();
    initTabs();
    renderSeoProjects();                              // must run before the carousels are measured
    renderMarketingCards();
    renderWebProjects();
    $$("[data-carousel]").forEach(Carousel);
    initAccordion();
    initReveal();
    initFeatureCards();
    initForms();
    initResultDialog();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
