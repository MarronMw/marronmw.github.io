// Mobile menu toggle
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Theme toggle functionality
const themeToggle = document.getElementById("theme-toggle");
const mobileThemeToggle = document.getElementById("mobile-theme-toggle");
const themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
const themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");
const mobileThemeToggleDarkIcon = document.getElementById(
  "mobile-theme-toggle-dark-icon"
);
const mobileThemeToggleLightIcon = document.getElementById(
  "mobile-theme-toggle-light-icon"
);

// Check for saved theme preference or use system preference
if (localStorage.getItem("color-theme")) {
  if (localStorage.getItem("color-theme") === "dark") {
    document.documentElement.classList.add("dark");
    themeToggleLightIcon.classList.remove("hidden");
    mobileThemeToggleLightIcon.classList.remove("hidden");
  } else {
    document.documentElement.classList.remove("dark");
    themeToggleDarkIcon.classList.remove("hidden");
    mobileThemeToggleDarkIcon.classList.remove("hidden");
  }
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.documentElement.classList.add("dark");
  themeToggleLightIcon.classList.remove("hidden");
  mobileThemeToggleLightIcon.classList.remove("hidden");
} else {
  themeToggleDarkIcon.classList.remove("hidden");
  mobileThemeToggleDarkIcon.classList.remove("hidden");
}

// Toggle theme
const toggleTheme = () => {
  themeToggleDarkIcon.classList.toggle("hidden");
  themeToggleLightIcon.classList.toggle("hidden");
  mobileThemeToggleDarkIcon.classList.toggle("hidden");
  mobileThemeToggleLightIcon.classList.toggle("hidden");

  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("color-theme", "light");
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("color-theme", "dark");
  }
};

themeToggle.addEventListener("click", toggleTheme);
mobileThemeToggle.addEventListener("click", toggleTheme);

// PARSING RESUME
document
  .getElementById("parseResumeBtn")
  .addEventListener("click", async () => {
    const btn = document.getElementById("parseResumeBtn");
    btn.disabled = true;
    btn.innerHTML = "⏳ Analyzing...";

    try {
      const response = await fetch(
        "https://marronmw.netlify.app/api/parse-resume",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resumeUrl:
              "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID",
          }),
        }
      );

      const { skills } = await response.json();
      renderResumeSkills(skills);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      btn.disabled = false;
      btn.innerHTML = "🔍 Analyze Resume with AI";
    }
  });
