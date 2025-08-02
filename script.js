document.addEventListener("DOMContentLoaded", () => {
  // Get main container for extensions
  const container = document.getElementById("extensions-container");
  let extensionsData = [];
  let currentFilter = "all";

  // Fetch extension data from local JSON file
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      extensionsData = data;
      displayExtensions();
    })
    .catch((error) => {
      console.error("Error loading extensions:", error);
      container.innerHTML = "<p>Failed to load extensions</p>";
    });

  // Map extension names to icon background colors for visual distinction
  const iconColors = {
    "DevLens": "#D7E6C6",
    "StyleSpy": "#C7E3F5",
    "SpeedBoost": "#F9D6DA",
    "JSONWizard": "#E7D1F5",
    "TabMaster Pro": "#D7D1F5",
    "ViewportBuddy": "#C7D7F5",
    "Markup Notes": "#C7F5F0",
    "GridGuides": "#D7D1F5",
    "Palette Picker": "#B8F5E0",
    "LinkChecker": "#F9E6D6",
    "DOM Snapshot": "#C7F5F0",
    "ConsolePlus": "#C7F5D7"
  };

  // Render extension cards based on current filter
  function displayExtensions() {
    container.innerHTML = "";
    let filtered = extensionsData;
    if (currentFilter === "active") {
      filtered = extensionsData.filter(ext => ext.isActive);
    } else if (currentFilter === "inactive") {
      filtered = extensionsData.filter(ext => !ext.isActive);
    }
    if (filtered.length === 0) {
      container.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>No extensions found.</p>";
      return;
    }
    filtered.forEach((ext, idx) => {
      const card = document.createElement("div");
      card.classList.add("tool-card");
      const iconBg = iconColors[ext.name] || "#eee";
      // Card inner HTML structure
      card.innerHTML = `
        <div class="icon-circle" style="background:${iconBg}">
          <img src="${ext.logo}" alt="${ext.name} icon" />
        </div>
        <h2>${ext.name}</h2>
        <p>${ext.description}</p>
        <button class="remove-btn">Remove</button>
        <label class="switch" title="Toggle extension active/inactive">
          <input type="checkbox" ${ext.isActive ? "checked" : ""} data-idx="${idx}" />
          <span class="slider"></span>
        </label>
      `;
      // Remove button event: remove extension from list
      card.querySelector(".remove-btn").addEventListener("click", () => {
        const name = ext.name;
        extensionsData = extensionsData.filter(e => e.name !== name);
        displayExtensions();
      });
      // Toggle switch event: update extension active state
      card.querySelector('.switch input[type="checkbox"]').addEventListener("change", (e) => {
        ext.isActive = e.target.checked;
        displayExtensions();
      });
      container.appendChild(card);
    });
  }

  // Filter buttons: All, Active, Inactive
  document.getElementById("filter-all").addEventListener("click", function() {
    setFilter("all", this);
  });
  document.getElementById("filter-active").addEventListener("click", function() {
    setFilter("active", this);
  });
  document.getElementById("filter-inactive").addEventListener("click", function() {
    setFilter("inactive", this);
  });

  // Set filter and update UI
  function setFilter(filter, btn) {
    currentFilter = filter;
    document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    displayExtensions();
  }

  // Theme toggle logic for topbar button
  const themeBtn = document.getElementById('theme-toggle');
  themeBtn.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    this.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
  });
  // Set correct icon on load
  if (document.body.classList.contains('dark-theme')) {
    themeBtn.textContent = "☀️";
  }
});