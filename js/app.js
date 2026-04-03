/**
 * app.js - Dynamic content renderer
 * Fetches content from data/content.json and renders the page dynamically.
 */

(function () {
  "use strict";

  const DATA_URL = "data/content.json";

  // ─── Utility ───────────────────────────────────────────────
  function el(tag, attrs, ...children) {
    const element = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([key, value]) => {
        if (key === "className") {
          element.className = value;
        } else if (key === "innerHTML") {
          element.innerHTML = value;
        } else if (key === "textContent") {
          element.textContent = value;
        } else {
          element.setAttribute(key, value);
        }
      });
    }
    children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else if (child) {
        element.appendChild(child);
      }
    });
    return element;
  }

  // ─── Renderers ─────────────────────────────────────────────

  function renderNavbar(data) {
    const navLinks = el("div", { className: "navbar-nav ml-auto" });
    data.links.forEach((link, i) => {
      navLinks.appendChild(
        el("a", {
          href: link.href,
          className: "nav-item nav-link" + (i === 0 ? " active" : ""),
          textContent: link.label,
        })
      );
    });

    const collapse = el(
      "div",
      { className: "collapse navbar-collapse justify-content-between", id: "navbarCollapse" },
      navLinks
    );

    const toggler = el("button", { type: "button", className: "navbar-toggler", "data-toggle": "collapse", "data-target": "#navbarCollapse" });
    toggler.appendChild(el("span", { className: "navbar-toggler-icon" }));

    const container = el(
      "div",
      { className: "container-fluid" },
      el("a", { href: "index.html", className: "navbar-brand", textContent: data.brand }),
      toggler,
      collapse
    );

    const navbar = el("div", { className: "navbar navbar-expand-lg bg-light navbar-light" }, container);
    return navbar;
  }

  function renderHero(data) {
    const heroText = el("div", { className: "hero-text" },
      el("p", {}, data.greeting),
      el("h1", {}, data.name),
      el("h2", {}),
      el("div", { className: "typed-text", textContent: data.typedTexts.join(", ") })
    );

    const heroBtn = el("div", { className: "hero-btn" });
    data.buttons.forEach((btn) => {
      heroBtn.appendChild(el("a", { className: "btn", href: btn.href, textContent: btn.label }));
    });

    const heroContent = el("div", { className: "hero-content" }, heroText, heroBtn);
    const leftCol = el("div", { className: "col-sm-12 col-md-6" }, heroContent);

    const heroImage = el("div", { className: "hero-image" },
      el("img", { src: data.heroImage, alt: "Hero Image" })
    );
    const rightCol = el("div", { className: "col-sm-12 col-md-6 d-none d-md-block" }, heroImage);

    const row = el("div", { className: "row align-items-center" }, leftCol, rightCol);
    const container = el("div", { className: "container-fluid" }, row);
    const hero = el("div", { className: "hero", id: "home" });

    // Add YouTube video background if configured
    if (data.videoBackground) {
      const videoId = data.videoBackground;
      const videoSrc = "https://www.youtube.com/embed/" + videoId +
        "?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&playlist=" + videoId;

      const videoBg = el("div", { className: "hero-video-bg" },
        el("iframe", {
          id: "hero-youtube-video",
          src: videoSrc,
          frameborder: "0",
          allow: "autoplay; encrypted-media",
          allowfullscreen: ""
        })
      );
      const overlay = el("div", { className: "hero-overlay" });
      hero.appendChild(videoBg);
      hero.appendChild(overlay);
    }

    hero.appendChild(container);
    return hero;
  }

  function renderAbout(data) {
    // Image column
    const aboutImg = el("div", { className: "about-img" },
      el("img", { src: data.image, alt: "Image" })
    );
    const imgCol = el("div", { className: "col-lg-6" }, aboutImg);

    // Content column
    const sectionHeader = el("div", { className: "section-header text-left" },
      el("p", {}, data.sectionLabel),
      el("h2", {}, data.sectionTitle)
    );

    const aboutText = el("div", { className: "about-text" },
      el("p", {}, data.description)
    );

    const skills = el("div", { className: "skills" });
    data.skills.forEach((skill) => {
      const skillName = el("div", { className: "skill-name" },
        el("p", {}, skill.name),
        el("p", {}, skill.percentage + "%")
      );
      const progressBar = el("div", {
        className: "progress-bar",
        role: "progressbar",
        "aria-valuenow": String(skill.percentage),
        "aria-valuemin": "0",
        "aria-valuemax": "100",
      });
      const progress = el("div", { className: "progress" }, progressBar);
      skills.appendChild(skillName);
      skills.appendChild(progress);
    });

    const aboutContent = el("div", { className: "about-content" }, sectionHeader, aboutText, skills);
    const contentCol = el("div", { className: "col-lg-6" }, aboutContent);

    const row = el("div", { className: "row align-items-center" }, imgCol, contentCol);
    const container = el("div", { className: "container-fluid" }, row);
    return el("div", { className: "about wow fadeInUp", id: "about", "data-wow-delay": "0.1s" }, container);
  }

  function renderServices(data) {
    const sectionHeader = el("div", { className: "section-header text-center wow zoomIn", "data-wow-delay": "0.1s" },
      el("p", {}, data.sectionLabel),
      el("h2", {}, data.sectionTitle)
    );

    const row = el("div", { className: "row" });
    data.items.forEach((item) => {
      const serviceIcon = el("div", { className: "service-icon" },
        el("i", { className: item.icon })
      );
      const serviceText = el("div", { className: "service-text" },
        el("h3", {}, item.title),
        el("p", {}, item.description)
      );
      const serviceItem = el("div", { className: "service-item" }, serviceIcon, serviceText);
      const col = el("div", { className: "col-lg-6 wow fadeInUp", "data-wow-delay": item.delay }, serviceItem);
      row.appendChild(col);
    });

    const container = el("div", { className: "container" }, sectionHeader, row);
    return el("div", { className: "service", id: "service" }, container);
  }

  function renderExperience(data) {
    const header = el("header", { className: "section-header text-center wow zoomIn", "data-wow-delay": "0.1s" },
      el("p", {}, data.sectionLabel),
      el("h2", {}, data.sectionTitle)
    );

    const timeline = el("div", { className: "timeline" });
    data.items.forEach((item) => {
      const animation = item.side === "right" ? "slideInRight" : "slideInLeft";
      const timelineText = el("div", { className: "timeline-text" },
        el("div", { className: "timeline-date", textContent: item.date }),
        el("h2", {}, item.title),
        el("h4", {}, item.company),
        el("p", {}, item.location)
      );
      const timelineItem = el("div", {
        className: "timeline-item " + item.side + " wow " + animation,
        "data-wow-delay": "0.1s"
      }, timelineText);
      timeline.appendChild(timelineItem);
    });

    const container = el("div", { className: "container" }, header, timeline);
    return el("div", { className: "experience", id: "experience" }, container);
  }

  function renderBlog(data) {
    const sectionHeader = el("div", { className: "section-header text-center wow zoomIn", "data-wow-delay": "0.1s" },
      el("p", {}, data.sectionLabel),
      el("h2", {}, data.sectionTitle)
    );

    const row = el("div", { className: "row" });
    data.posts.forEach((post) => {
      const blogImg = el("div", { className: "blog-img" },
        el("img", { src: post.image, alt: "Blog" })
      );

      const blogMeta = el("div", { className: "blog-meta" },
        el("p", { innerHTML: '<i class="far fa-user"></i>' + post.author }),
        el("p", { innerHTML: '<i class="far fa-list-alt"></i>' + post.category }),
        el("p", { innerHTML: '<i class="far fa-calendar-alt"></i>' + post.date }),
        el("p", { innerHTML: '<i class="far fa-comments"></i>' + post.comments })
      );

      const readMore = el("a", {
        className: "btn",
        href: post.url,
        innerHTML: 'Read More <i class="fa fa-angle-right"></i>'
      });

      const blogText = el("div", { className: "blog-text" },
        el("h2", {}, post.title),
        blogMeta,
        el("p", {}, post.excerpt),
        readMore
      );

      const blogItem = el("div", { className: "blog-item wow fadeInUp", "data-wow-delay": post.delay }, blogImg, blogText);
      const col = el("div", { className: "col-lg-6" }, blogItem);
      row.appendChild(col);
    });

    const container = el("div", { className: "container" }, sectionHeader, row);
    return el("div", { className: "blog", id: "blog" }, container);
  }

  function renderFooter(data) {
    const footerMenu = el("div", { className: "footer-menu" },
      el("p", {}, data.phone),
      el("p", {}, data.email)
    );

    const footerSocial = el("div", { className: "footer-social" });
    data.socials.forEach((social) => {
      footerSocial.appendChild(
        el("a", { href: social.url },
          el("i", { className: social.icon })
        )
      );
    });

    const footerInfo = el("div", { className: "footer-info" },
      el("h2", {}, data.name),
      el("h3", {}, data.address),
      footerMenu,
      footerSocial
    );

    const copyright = el("div", { className: "container copyright" },
      el("p", { innerHTML: '&copy; <a href="#">' + data.copyright + '</a>' })
    );

    const innerContainer = el("div", { className: "container" }, footerInfo);
    const container = el("div", { className: "container-fluid" }, innerContainer, copyright);
    return el("div", { id: "contact", className: "footer wow fadeIn", "data-wow-delay": "0.3s" }, container);
  }

  // ─── Main ──────────────────────────────────────────────────

  function renderApp(data) {
    const body = document.body;

    // Clear any existing content containers (keep scripts, loader, back-to-top)
    const appRoot = document.getElementById("app");

    // Build all sections
    appRoot.appendChild(renderNavbar(data.navbar));
    appRoot.appendChild(renderHero(data.hero));
    appRoot.appendChild(renderAbout(data.about));
    appRoot.appendChild(renderServices(data.services));
    appRoot.appendChild(renderExperience(data.experience));
    appRoot.appendChild(renderBlog(data.blog));
    appRoot.appendChild(renderFooter(data.footer));

    // Back to top button
    const backToTop = el("a", {
      href: "#",
      className: "btn back-to-top",
      innerHTML: '<i class="fa fa-chevron-up"></i>'
    });
    appRoot.appendChild(backToTop);
  }

  // Fetch JSON and render
  fetch(DATA_URL)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load content data");
      return response.json();
    })
    .then((data) => {
      renderApp(data);
      // Signal that dynamic content is ready for plugin initialization
      document.dispatchEvent(new CustomEvent("contentLoaded"));
    })
    .catch((error) => {
      console.error("Error loading content:", error);
      document.getElementById("app").innerHTML =
        '<div style="text-align:center;padding:50px;color:#e74c3c;">' +
        "<h2>Failed to load content</h2>" +
        "<p>" + error.message + "</p></div>";
    });
})();
