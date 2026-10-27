(() => {
  const welcomeModal = document.getElementById("welcome-modal");
  const welcomeForm = document.getElementById("welcome-form");
  const visitorNameInput = document.getElementById("visitor-name");
  const welcomeMessage = document.getElementById("welcome-message");
  const tourBackdrop = document.getElementById("tour-backdrop");
  const tourCard = document.getElementById("tour-card");
  const tourStepLabel = document.getElementById("tour-step");
  const tourTitle = document.getElementById("tour-title");
  const tourDescription = document.getElementById("tour-description");
  const tourNext = document.getElementById("tour-next");
  const tourSkip = document.getElementById("tour-skip");
  const tourSkipLink = document.getElementById("tour-skip-link");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const whatsappFab = document.getElementById("whatsapp-fab");
  const chatBubble = document.getElementById("chat-bubble");
  const chatClose = document.getElementById("chat-close");

  const tourSteps = [
    {
      target: "about",
      title: "About Me",
      description: "Discover my journey as a full-stack web developer and how my robotics experience helps me connect software with the real world."
    },
    {
      target: "projects",
      title: "My Creations",
      description: "Explore a selection of web applications, games, and robotics projects I've built."
    },
    {
      target: "contact",
      title: "Let's Build",
      description: "Have an idea in mind? Share your project details in the contact form and let's talk about making it real."
    }
  ];
  let tourIndex = 0;
  let activeTourTarget = null;

  function readVisitorName() {
    try {
      return localStorage.getItem("bello-portfolio-visitor") || "";
    } catch (error) {
      console.error("Could not read the saved visitor name.", error);
      return "";
    }
  }

  function saveVisitorName(name) {
    try {
      localStorage.setItem("bello-portfolio-visitor", name);
    } catch (error) {
      console.error("Could not save the visitor name.", error);
    }
  }

  function showGreeting(name) {
    welcomeMessage.textContent = `Hello ${name}, welcome to my digital workspace!`;
  }

  function closeWelcomeModal() {
    welcomeModal.classList.remove("is-open");
    welcomeModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  function openTourStep(index) {
    if (activeTourTarget) {
      activeTourTarget.classList.remove("tour-highlight");
    }

    tourIndex = index;
    const step = tourSteps[tourIndex];
    activeTourTarget = document.querySelector(`[data-tour="${step.target}"]`);
    if (!activeTourTarget) {
      console.error(`Guided tour target not found: ${step.target}`);
      finishTour();
      return;
    }

    activeTourTarget.scrollIntoView({ behavior: "smooth", block: "center" });
    activeTourTarget.classList.add("tour-highlight");
    tourStepLabel.textContent = `${String(tourIndex + 1).padStart(2, "0")} / ${String(tourSteps.length).padStart(2, "0")}`;
    tourTitle.textContent = step.title;
    tourDescription.textContent = step.description;
    tourNext.innerHTML = tourIndex === tourSteps.length - 1
      ? 'Finish <span aria-hidden="true">✓</span>'
      : 'Next <span aria-hidden="true">→</span>';
    tourCard.hidden = false;
    tourBackdrop.classList.add("is-open");
    tourBackdrop.setAttribute("aria-hidden", "false");
    document.body.classList.add("tour-open");
  }

  function finishTour() {
    if (activeTourTarget) {
      activeTourTarget.classList.remove("tour-highlight");
      activeTourTarget = null;
    }
    tourCard.hidden = true;
    tourBackdrop.classList.remove("is-open");
    tourBackdrop.setAttribute("aria-hidden", "true");
    document.body.classList.remove("tour-open");
  }

  const savedName = readVisitorName();
  if (savedName) {
    showGreeting(savedName);
  } else {
    welcomeModal.classList.add("is-open");
    welcomeModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    window.setTimeout(() => visitorNameInput.focus(), 100);
  }

  welcomeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = visitorNameInput.value.trim();
    if (!name) {
      visitorNameInput.focus();
      return;
    }
    saveVisitorName(name);
    showGreeting(name);
    closeWelcomeModal();
    window.setTimeout(() => openTourStep(0), 300);
  });

  tourNext.addEventListener("click", () => {
    if (tourIndex === tourSteps.length - 1) {
      finishTour();
      return;
    }
    openTourStep(tourIndex + 1);
  });
  tourSkip.addEventListener("click", finishTour);
  tourSkipLink.addEventListener("click", finishTour);

  function setMenuOpen(isOpen) {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    mobileMenu.classList.toggle("is-open", isOpen);
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  }

  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });
  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
      finishTour();
      closeChat();
    }
  });

  document.querySelectorAll("[data-project]").forEach((link) => {
    link.addEventListener("click", () => {
      const outline = document.getElementById("brief-outline");
      if (!outline.value.trim()) {
        outline.value = `I'd like to discuss a project similar to ${link.dataset.project}.`;
      }
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);
    const proposal = [
      "Hello Bello, I viewed your portfolio and would like to discuss a project.",
      "",
      `Name of Business: ${formData.get("businessName")}`,
      `Project Type: ${formData.get("projectType")}`,
      `Brief Outline: ${formData.get("briefOutline")}`,
      `Key Features Needed: ${formData.get("keyFeatures")}`
    ].join("\n");
    const whatsappUrl = `https://wa.me/2349030221179?text=${encodeURIComponent(proposal)}`;
    const chatWindow = window.open(whatsappUrl, "_blank");

    if (chatWindow) {
      chatWindow.opener = null;
      formStatus.textContent = "Your proposal is ready in WhatsApp. Send the message to reach Bello.";
    } else {
      formStatus.textContent = "Your browser blocked the new tab. Use the Start Chat button to open WhatsApp.";
    }
  });

  function closeChat() {
    chatBubble.classList.remove("is-open");
    chatBubble.setAttribute("aria-hidden", "true");
    whatsappFab.setAttribute("aria-expanded", "false");
  }

  whatsappFab.addEventListener("click", () => {
    const isOpen = !chatBubble.classList.contains("is-open");
    chatBubble.classList.toggle("is-open", isOpen);
    chatBubble.setAttribute("aria-hidden", String(!isOpen));
    whatsappFab.setAttribute("aria-expanded", String(isOpen));
  });
  chatClose.addEventListener("click", closeChat);
})();
