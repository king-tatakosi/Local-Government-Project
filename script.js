
const projects = [
  {
    id: 1,
    title: "Commissioning of educational facilities",
    status: "ongoing",
    imgSource: "images/school_facilities.webp",
    description:
      `Construction of infrastructural projects
       for schools across the municipality, including a 1,500-capacity 3-storey classroom block.${`<a href="https://www.facebook.com/100022485004943/posts/2118519012240912/?app=fbl" target="_blank" rel="noopener noreferrer" class="project-link"> Get full story on facebook</a>`}`,
    location: "Municipality-Wide",
    year: "2026",
  },
  {
    id: 2,
    title: "Construction of the Kpando-Torkor road",
    status: "ongoing",
    imgSource: "images/torkor.webp",
    description:
      `Reconstruction of the major road connecting constituents to Torkor, a suburb of Kpando which harbours fisheries and a vibrant market. This project will improve transportation, boost local commerce, and enhance access to essential services for residents in the area.${`<a href="https://vt.tiktok.com/ZSusLu1gN/" target="_blank" rel="noopener noreferrer" class="project-link"> Get videos on TikTok</a>`}`,
    location: "Kpando-Torkor",
    year: "2026",
  }
 
];


function createProjectCard(project) {
  const statusLabel = project.status.charAt(0).toUpperCase() + project.status.slice(1);

  return `
    <article class="project-card reveal" data-status="${project.status}" role="listitem">
      <div class="project-card-thumb">
        <img src="${project.imgSource}" alt="${project.title} thumbnail" class="project-thumb-image" loading="lazy" />
      </div>
      <div class="project-card-top">
        <h3 class="project-title">${project.title}</h3>
        <span class="status-badge ${project.status}" aria-label="Status: ${statusLabel}">
          ${statusLabel}
        </span>
      </div>
      <div class="project-card-body">
        <p class="project-description">${project.description}</p>
        <div class="project-meta">
          <span class="project-meta-icon">📍</span>
          <span>${project.location}</span>
          &nbsp;·&nbsp;
          <span class="project-meta-icon">📅</span>
          <span>${project.year}</span>
        </div>
      </div>
    </article>
  `;
}


function renderProjects(filter = "all") {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  
  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) => p.status === filter);

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="projects-empty">
        No projects found for this filter. Check back soon!
      </div>
    `;
    return;
  }


  grid.innerHTML = filtered.map(createProjectCard).join("");

  // Re-initialise scroll-reveal for newly added cards
  initScrollReveal();
}


function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      renderProjects(filter);
    });
  });
}


function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");

  if (!toggle || !navLinks) return;

  
  toggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    // Update ARIA for accessibility
    toggle.setAttribute("aria-expanded", isOpen.toString());
  });

  
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Close menu if the user clicks outside of it
  document.addEventListener("click", (e) => {
    if (
      navLinks.classList.contains("open") &&
      !navLinks.contains(e.target) &&
      !toggle.contains(e.target)
    ) {
      navLinks.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}



function initStickyHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 5);
  };

  // Use passive listener for performance
  window.addEventListener("scroll", onScroll, { passive: true });
  
  onScroll();
}



function initScrollReveal() {
  // Disconnect any existing observer to avoid duplicates
  if (window._revealObserver) {
    window._revealObserver.disconnect();
  }

  const revealEls = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Stop observing once revealed — no need to re-trigger
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,   // Trigger when 12% of the element is visible
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealEls.forEach((el) => observer.observe(el));

  // Store reference globally so we can disconnect it later
  window._revealObserver = observer;
}

/**
 * Adds .reveal (and optional delay-N) classes to section elements
 * so the scroll animation applies to them.
 */
function markRevealElements() {
  document
    .querySelectorAll(".section-label, .section-heading, .section-subtext")
    .forEach((el) => el.classList.add("reveal"));

  document
    .querySelectorAll(".about-image-col, .about-text-col")
    .forEach((el) => el.classList.add("reveal"));

  document.querySelectorAll(".official-card").forEach((card, i) => {
    card.classList.add("reveal", `delay-${(i % 4) + 1}`);
  });

  document
    .querySelectorAll(".hero-content, .hero-portrait-wrap")
    .forEach((el) => el.classList.add("reveal"));

  document
    .querySelectorAll(".contact-info-col, .contact-form-col")
    .forEach((el) => el.classList.add("reveal"));
}


 //Validates a single field and updates the error span.
 
function validateField(field, errorEl) {
  const value = field.value.trim();
  let message = "";

  if (field.required && !value) {
    message = "This field is required.";
  } else if (field.type === "email" && value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
      message = "Please enter a valid email address.";
    }
  }

  // Show or clear error
  errorEl.textContent = message;
  field.classList.toggle("error", !!message);

  return !message;
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nameField    = document.getElementById("name");
  const emailField   = document.getElementById("email");
  const messageField = document.getElementById("message");

  const nameError    = document.getElementById("name-error");
  const emailError   = document.getElementById("email-error");
  const messageError = document.getElementById("message-error");

  const submitBtn    = document.getElementById("submit-btn");
  const feedback     = document.getElementById("form-feedback");

  // Live validation — validate a field as soon as it loses focus
  nameField.addEventListener("blur", () => validateField(nameField, nameError));
  emailField.addEventListener("blur", () => validateField(emailField, emailError));
  messageField.addEventListener("blur", () => validateField(messageField, messageError));

  // Form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault(); 

    // Validate all required fields
    const isNameValid    = validateField(nameField, nameError);
    const isEmailValid   = validateField(emailField, emailError);
    const isMessageValid = validateField(messageField, messageError);

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      // Focus the first invalid field
      if (!isNameValid) nameField.focus();
      else if (!isEmailValid) emailField.focus();
      else messageField.focus();
      return;
    }

    const formData = {
      name:    nameField.value.trim(),
      email:   emailField.value.trim(),
      subject: document.getElementById("subject").value,
      message: messageField.value.trim()
    };

    console.log(" New Constituency Message Received:");
    console.table(formData);

    // Simulate a brief loading state on the button
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    //Send form data via EmailJs
    emailjs.init("wb2biSBH_uvtWwPPv")
    emailjs.send("service_1rgujg8", "template_vgaa0ex", formData)
      .then(() => {
        console.log("Email sent successfully!");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });


    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";

      // Show success feedback
      feedback.className = "form-feedback success";
      feedback.textContent =
        "Thank you! Your message has been received. We'll be in touch soon.";

      
      form.reset();

      // Auto-hide feedback after 8 seconds
      setTimeout(() => {
        feedback.className = "form-feedback";
        feedback.textContent = "";
      }, 8000);
    }, 900); // Simulated network delay
  });
}

const projectStat = document.getElementById("projects_stat");
if (projectStat) {
  projectStat.textContent = projects.length.toString();
}

document.addEventListener("DOMContentLoaded", () => {
  // Render projects with default "all" filter
  renderProjects("all");

  // Mark elements for scroll-reveal before observer runs
  markRevealElements();

  // Initialise all interactive features
  initProjectFilters();
  initMobileNav();
  initStickyHeader();
  initScrollReveal();
  initContactForm();

  console.log("Constituency website initialised successfully.");
});
