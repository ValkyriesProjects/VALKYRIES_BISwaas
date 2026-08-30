/* =========================================================
   BIS INTELLIGENT ASSISTANT
   Beginner-friendly frontend JavaScript
   ========================================================= */

/*
  BACKEND INTEGRATION MAP
  -----------------------
  Current demo:
    getMockBotResponse(message)
    simulateHallmarkVerification(huid, metal)
    simulateSignIn(email, password)

  Future API endpoints:
    POST /api/chat
    POST /api/hallmark/verify
    GET  /api/hallmark/info
    GET  /api/huid/info
    POST /api/auth/login

  When the backend is ready, replace the mock functions with
  fetch() calls while keeping the UI code mostly unchanged.
*/

document.addEventListener("DOMContentLoaded", function () {
  initializeNavbar();
  initializeNavigation();
  initializeHallmarkTabs();
  initializeMetalSelector();
  initializeVerification();
  initializeChatbot();
  initializeSignIn();
});

/* =========================================================
   NAVBAR
   ========================================================= */

function initializeNavbar() {
  const navbar = document.querySelector(".site-navbar");

  if (navbar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 15) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  document.querySelectorAll(".navbar-nav .nav-link, .navbar-brand").forEach(function (link) {
    link.addEventListener("click", function () {
      const nav = document.getElementById("mainNav");

      if (nav && nav.classList.contains("show") && window.bootstrap) {
        bootstrap.Collapse.getOrCreateInstance(nav).hide();
      }
    });
  });
}

/* =========================================================
   SMOOTH NAVIGATION
   ========================================================= */

function initializeNavigation() {
  document.querySelectorAll("[data-scroll]").forEach(function (button) {
    button.addEventListener("click", function () {
      const selector = button.getAttribute("data-scroll");
      const target = document.querySelector(selector);

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
}

/* =========================================================
   HALLMARKING TABS
   ========================================================= */

function initializeHallmarkTabs() {
  const tabButtons = document.querySelectorAll(".hallmark-feature");
  const panels = document.querySelectorAll(".hallmark-panel");

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const tabName = button.getAttribute("data-tab");

      tabButtons.forEach(function (item) {
        item.classList.remove("active");
      });

      panels.forEach(function (panel) {
        panel.classList.remove("active-panel");
      });

      button.classList.add("active");

      const selectedPanel = document.getElementById(tabName);

      if (selectedPanel) {
        selectedPanel.classList.add("active-panel");
        selectedPanel.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }
    });
  });
}

/* =========================================================
   METAL / MATERIAL SELECTOR
   ========================================================= */

let selectedMetal = "gold";

function initializeMetalSelector() {
  document.querySelectorAll(".metal-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      document.querySelectorAll(".metal-btn").forEach(function (item) {
        item.classList.remove("active");
      });

      button.classList.add("active");
      selectedMetal = button.getAttribute("data-metal");
    });
  });
}

/* =========================================================
   HALLMARK / HUID VERIFICATION
   ========================================================= */

function initializeVerification() {
  const form = document.getElementById("verificationForm");
  const input = document.getElementById("huidInput");
  const button = document.getElementById("verifyButton");
  const result = document.getElementById("verificationResult");

  if (!form || !input || !button || !result) return;

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const huid = input.value.trim();

    if (!huid) {
      showVerificationResult(
        "Please enter a Hallmark or HUID before checking.",
        "error"
      );
      input.focus();
      return;
    }

    button.disabled = true;
    button.innerHTML =
      '<span class="spinner-border spinner-border-sm me-2"></span>Checking...';

    result.classList.remove("d-none");
    result.classList.add("loading");
    result.innerHTML = "Submitting prototype verification request...";

    try {
      /*
        CURRENT:
          Mock prototype response.

        FUTURE:
          const data = await verifyHallmarkWithAPI(huid, selectedMetal);
      */
      const data = await simulateHallmarkVerification(huid, selectedMetal);

      showVerificationResult(
        `
        <span class="prototype-tag">PROTOTYPE RESULT</span>
        <div class="result-title">${escapeHTML(data.message)}</div>
        <p class="mb-1 mt-2"><strong>Material:</strong> ${escapeHTML(data.metal)}</p>
        <p class="mb-1"><strong>HUID / Hallmark:</strong> ${escapeHTML(data.huid)}</p>
        <small>This is a demo response. It is not connected to the live BIS verification system.</small>
        `,
        "success"
      );
    } catch (error) {
      showVerificationResult(
        "Something went wrong while processing the prototype request.",
        "error"
      );
    } finally {
      button.disabled = false;
      button.innerHTML = '<i class="bi bi-search me-1"></i> Check Now';
    }
  });
}

function simulateHallmarkVerification(huid, metal) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve({
        success: true,
        status: "demo",
        message: "Verification Request Submitted",
        huid: huid,
        metal: capitalize(metal)
      });
    }, 1200);
  });
}

function showVerificationResult(message, type) {
  const result = document.getElementById("verificationResult");

  if (!result) return;

  result.classList.remove("d-none", "loading");
  result.innerHTML = message;

  if (type === "error") {
    result.style.background = "#fff7f7";
    result.style.borderColor = "#f0d0d0";
  } else {
    result.style.background = "#f7fbf8";
    result.style.borderColor = "#dce5df";
  }
}

/*
  FUTURE API FUNCTION
  -------------------

  async function verifyHallmarkWithAPI(huid, metal) {
    const response = await fetch("/api/hallmark/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        huid: huid,
        metal: metal
      })
    });

    if (!response.ok) {
      throw new Error("Verification API request failed");
    }

    return await response.json();
  }
*/

/* =========================================================
   CHATBOT
   ========================================================= */

let chatMessages;

function initializeChatbot() {
  chatMessages = document.getElementById("chatMessages");

  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  const clearButton = document.getElementById("clearChatBtn");

  if (!form || !input) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const message = input.value.trim();

    if (!message) return;

    sendChatMessage(message);
    input.value = "";
    input.focus();
  });

  if (clearButton) {
    clearButton.addEventListener("click", function () {
      resetChat();
    });
  }

  document.querySelectorAll("[data-question]").forEach(function (button) {
    button.addEventListener("click", function () {
      const question = button.getAttribute("data-question");

      const assistant = document.getElementById("assistant");

      if (assistant) {
        assistant.scrollIntoView({
          behavior: "smooth"
        });
      }

      setTimeout(function () {
        sendChatMessage(question);
      }, 450);
    });
  });

  const askHuidButton = document.getElementById("askHuidBtn");

  if (askHuidButton) {
    askHuidButton.addEventListener("click", function () {
      const assistant = document.getElementById("assistant");

      if (assistant) {
        assistant.scrollIntoView({
          behavior: "smooth"
        });
      }

      setTimeout(function () {
        sendChatMessage("What is HUID?");
      }, 450);
    });
  }
}

async function sendChatMessage(userMessage) {
  addMessage(userMessage, "user");
  showTypingIndicator();

  try {
    /*
      CURRENT:
        Use mock response.

      FUTURE:
        const response = await getBotResponseFromAPI(userMessage);
    */
    const response = await getMockBotResponse(userMessage);

    hideTypingIndicator();
    addMessage(response, "assistant");
  } catch (error) {
    hideTypingIndicator();

    addMessage(
      "Sorry, I could not process that question right now. Please try again.",
      "assistant"
    );
  }
}

/*
  MOCK AI RESPONSE FUNCTION
  -------------------------
  This function gives the prototype useful responses across
  the BIS domains listed on the homepage.
*/

function getMockBotResponse(message) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      const normalized = message.toLowerCase();

      if (normalized.includes("huid")) {
        resolve(
          "HUID stands for Hallmark Unique Identification. In this prototype, it is presented as a unique identification number associated with a hallmarked jewellery article."
        );
        return;
      }

      if (
        normalized.includes("916") ||
        normalized.includes("22 karat") ||
        normalized.includes("22k")
      ) {
        resolve(
          "916 is a fineness number commonly associated with 22-karat gold, meaning 916 parts per thousand gold by fineness."
        );
        return;
      }

      if (
        normalized.includes("hallmark") &&
        (normalized.includes("check") || normalized.includes("verify"))
      ) {
        resolve(
          "You can use the Check Hallmark interface in this prototype to enter a Hallmark or HUID. The current result is only a demo and is not official BIS verification."
        );
        return;
      }

      if (normalized.includes("hallmarking")) {
        resolve(
          "Hallmarking is a system used to indicate the purity or fineness of precious-metal articles through prescribed marks and processes. Use the Hallmarking Assistant section to explore the prototype tools."
        );
        return;
      }

      if (
        normalized.includes("indian standard") ||
        normalized.includes("indian standards") ||
        normalized.includes("standard")
      ) {
        resolve(
          "Indian Standards are standards developed or adopted by BIS for products, processes, services and other areas. In this prototype, you can use the assistant to ask for simpler explanations of standards-related terminology."
        );
        return;
      }

      if (
        normalized.includes("product certification") ||
        normalized.includes("certification")
      ) {
        resolve(
          "Product Certification is one of the BIS domains included in this prototype. You can ask about certification concepts, processes and terminology. For official requirements, users should consult the appropriate BIS services."
        );
        return;
      }

      if (
        normalized.includes("licensing") ||
        normalized.includes("license")
      ) {
        resolve(
          "Licensing and Certification Process is included as a BIS domain in this prototype. The future backend can connect users to detailed process information, eligibility, documents and status-related services."
        );
        return;
      }

      if (
        normalized.includes("testing laborator") ||
        normalized.includes("laborator")
      ) {
        resolve(
          "Testing Laboratories is a BIS domain covered by this prototype. The assistant can be connected later to official laboratory information and service data through a backend API."
        );
        return;
      }

      if (
        normalized.includes("consumer affair") ||
        normalized.includes("consumer")
      ) {
        resolve(
          "Consumer Affairs is included as a BIS domain so users can ask consumer-focused questions and understand BIS-related information in simpler language."
        );
        return;
      }

      if (
        normalized.includes("standards club") ||
        normalized.includes("training")
      ) {
        resolve(
          "Standards Clubs & Training is one of the domains shown on the homepage. The prototype is designed to make learning-related BIS information easier to discover."
        );
        return;
      }

      if (
        normalized.includes("conformity assessment") ||
        normalized.includes("conformity")
      ) {
        resolve(
          "Conformity Assessment is a BIS domain included in this prototype. It relates to assessing whether specified requirements are fulfilled. A future backend can provide official, detailed BIS information."
        );
        return;
      }

      if (
        normalized.includes("multilingual") ||
        normalized.includes("language")
      ) {
        resolve(
          "Multilingual Support is included as a future-facing feature of the prototype. The backend can later support multiple Indian languages so users can interact with BIS information more comfortably."
        );
        return;
      }

      if (
        normalized.includes("identify") &&
        normalized.includes("jewellery")
      ) {
        resolve(
          "For this prototype, use the Hallmarking Guide to understand common concepts and use the assistant to clarify terminology. For official verification, users should rely on appropriate official BIS services."
        );
        return;
      }

      resolve(
        "I can help with Indian Standards, Product Certification, Licensing & Certification, Testing Laboratories, Hallmarking, Consumer Affairs, Standards Clubs & Training, Conformity Assessment and Multilingual Support. Try asking about any of these BIS domains."
      );
    }, 900);
  });
}

/*
  FUTURE CHAT API FUNCTION
  ------------------------

  async function getBotResponseFromAPI(userMessage) {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userMessage
      })
    });

    if (!response.ok) {
      throw new Error("Chat API request failed");
    }

    const data = await response.json();
    return data.reply;
  }
*/

function addMessage(text, sender) {
  if (!chatMessages) return;

  const row = document.createElement("div");
  row.className = "message-row " + sender;

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.innerHTML =
    sender === "assistant"
      ? '<i class="bi bi-stars"></i>'
      : '<i class="bi bi-person"></i>';

  const content = document.createElement("div");
  content.className = "message-content";

  const name = document.createElement("span");
  name.className = "message-name";
  name.textContent = sender === "assistant" ? "BIS Assistant" : "You";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = text;

  content.appendChild(name);
  content.appendChild(bubble);
  row.appendChild(avatar);
  row.appendChild(content);

  chatMessages.appendChild(row);
  scrollChatToBottom();
}

function showTypingIndicator() {
  const indicator = document.getElementById("typingIndicator");

  if (!indicator) return;

  indicator.classList.remove("d-none");
  scrollChatToBottom();
}

function hideTypingIndicator() {
  const indicator = document.getElementById("typingIndicator");

  if (indicator) {
    indicator.classList.add("d-none");
  }
}

function scrollChatToBottom() {
  if (chatMessages) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

function resetChat() {
  if (!chatMessages) return;

  chatMessages.innerHTML = `
    <div class="message-row assistant">
      <div class="message-avatar"><i class="bi bi-stars"></i></div>
      <div class="message-content">
        <span class="message-name">BIS Assistant</span>
        <div class="message-bubble">
          Hello! I'm your BIS Intelligent Assistant. How can I help you today?
        </div>
      </div>
    </div>
  `;
}

/* =========================================================
   SIGN IN MODAL
   ========================================================= */

function initializeSignIn() {
  const signInButton = document.getElementById("signInBtn");
  const domainSignInButton = document.getElementById("domainSignInBtn");
  const form = document.getElementById("signInForm");
  const togglePassword = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("signInPassword");

  function openSignInModal() {
    const modalElement = document.getElementById("signInModal");

    if (modalElement && window.bootstrap) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
      modal.show();
    }
  }

  if (signInButton) {
    signInButton.addEventListener("click", openSignInModal);
  }

  if (domainSignInButton) {
    domainSignInButton.addEventListener("click", openSignInModal);
  }

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", function () {
      const isPassword = passwordInput.type === "password";

      passwordInput.type = isPassword ? "text" : "password";
      togglePassword.innerHTML = isPassword
        ? '<i class="bi bi-eye-slash"></i>'
        : '<i class="bi bi-eye"></i>';

      togglePassword.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password"
      );
    });
  }

  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      const email = document.getElementById("signInEmail").value.trim();
      const password = passwordInput.value.trim();
      const result = document.getElementById("signInResult");
      const submitButton = form.querySelector('button[type="submit"]');

      if (!email || !password) return;

      submitButton.disabled = true;
      submitButton.innerHTML =
        '<span class="spinner-border spinner-border-sm me-2"></span>Signing in...';

      result.classList.remove("d-none");
      result.className = "signin-result";
      result.textContent = "Checking demo credentials...";

      try {
        const data = await simulateSignIn(email, password);

        if (data.success) {
          result.classList.add("success");
          result.textContent =
            "Demo sign-in successful. Backend authentication is not connected yet.";
        }
      } catch (error) {
        result.classList.add("error");
        result.textContent = "Demo sign-in failed. Please try again.";
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML =
          '<i class="bi bi-box-arrow-in-right me-1"></i> Sign In';
      }
    });
  }
}

function simulateSignIn(email, password) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      if (email && password.length >= 6) {
        resolve({
          success: true,
          email: email
        });
      } else {
        reject(new Error("Invalid demo input"));
      }
    }, 900);
  });
}

/*
  FUTURE AUTH API FUNCTION
  ------------------------

  async function signInWithAPI(email, password) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (!response.ok) {
      throw new Error("Login request failed");
    }

    return await response.json();
  }

  IMPORTANT:
  Never put database passwords, API secrets or private keys
  directly inside frontend JavaScript.
*/

/* =========================================================
   HELPERS
   ========================================================= */

function capitalize(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

/*
  FUTURE BACKEND CHECKLIST
  ------------------------

  1. Chatbot:
       POST /api/chat
       Request:  { message: "..." }
       Response: { reply: "..." }

  2. Hallmark/HUID verification:
       POST /api/hallmark/verify
       Request:  { huid: "...", metal: "gold" }
       Response: { success: true, status: "...", message: "..." }

  3. Hallmark information:
       GET /api/hallmark/info

  4. HUID information:
       GET /api/huid/info

  5. Authentication:
       POST /api/auth/login
       Add register/logout/user-profile endpoints later.

  6. Database:
       Save user profiles, chat history and verification history
       through backend APIs.

  7. Multilingual support:
       Add a language preference and connect the chatbot to
       translated/locale-aware backend responses.

  8. Never put database credentials or private API keys in
     frontend JavaScript.
*/
