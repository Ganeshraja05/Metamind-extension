document.addEventListener("DOMContentLoaded", () => {
    const history = JSON.parse(localStorage.getItem('metaMindHistory')) || [];
    const MAX_HISTORY_ITEMS = 50;

    // Elements
    const darkModeToggle = document.getElementById("darkModeToggle");
    const downloadButton = document.getElementById("download");
    const clearHistoryButton = document.getElementById("clearHistory");
    const searchHistoryInput = document.getElementById("searchHistory");
    const historyList = document.getElementById("historyList");

    // Check if elements exist before adding event listeners
    if (darkModeToggle) {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        darkModeToggle.checked = isDarkMode;
        document.body.classList.toggle("dark", isDarkMode);

        darkModeToggle.addEventListener("change", (e) => {
            const isDark = e.target.checked;
            document.body.classList.toggle("dark", isDark);
            localStorage.setItem('darkMode', isDark);
        });
    }

    document.querySelectorAll(".tab").forEach((tab) => {
        tab.addEventListener("click", (e) => {
            document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
            document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
            e.target.classList.add("active");
            document.getElementById(e.target.dataset.tab).classList.add("active");
        });
    });

   // Add CLS Measurement to Metadata Fetching
async function fetchMetadata() {
    document.getElementById("loading").style.display = "block";

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab.url.startsWith("chrome://") || tab.url.startsWith("about:")) {
            updateUIWithError("Restricted URL", "Cannot access metadata on this page.");
            return;
        }

        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                let clsValue = 0;

                // Monitor layout shifts
                const observer = new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        if (!entry.hadRecentInput && entry.value) {
                            clsValue += entry.value;
                        }
                    }
                });
                observer.observe({ type: "layout-shift", buffered: true });

                // Performance Metrics
                const performanceEntries = performance.getEntriesByType("navigation")[0];

                // Advanced Metadata Collection
                return {
                    url: window.location.href,
                    title: document.title,
                    description: document.querySelector('meta[name="description"]')?.content || "No description",
                    keywords: document.querySelector('meta[name="keywords"]')?.content || "No keywords",
                    ogTitle: document.querySelector('meta[property="og:title"]')?.content || "No OG Title",

                    // Performance Metrics
                    loadTime: performanceEntries ? performanceEntries.loadEventEnd - performanceEntries.startTime : "N/A",

                    // Resource Analysis
                    scriptCount: document.scripts.length,
                    stylesheetCount: document.styleSheets.length,

                    // SEO Checks
                    headings: {
                        h1: document.querySelectorAll('h1').length,
                        h2: document.querySelectorAll('h2').length,
                        h3: document.querySelectorAll('h3').length,
                    },

                    // Accessibility Checks
                    missingAltImages: Array.from(document.images).filter(img => !img.alt).length,

                    // CLS Metric
                    clsScore: clsValue,
                };
            },
        });

        if (results && results[0] && results[0].result) {
            const data = results[0].result;
            updateUIWithMetadata(data);
            saveToHistory(data);
        }
    } catch (error) {
        console.error("Metadata fetching error:", error);
        updateUIWithError("Error", "Could not fetch metadata");
    } finally {
        document.getElementById("loading").style.display = "none";
    }
}

// Update UI with CLS
function updateUIWithMetadata(data) {
    // Metadata Tab
    document.getElementById("title").textContent = data.title;
    document.getElementById("description").textContent = data.description;
    document.getElementById("keywords").textContent = data.keywords;
    document.getElementById("ogTitle").textContent = data.ogTitle;

    // Insights Tab
    document.getElementById("scriptCount").textContent = data.scriptCount;
    document.getElementById("styleCount").textContent = data.stylesheetCount;
    document.getElementById("FCP").textContent = `${data.loadTime}ms`;
    document.getElementById("CLS").textContent = `${data.clsScore.toFixed(2)}`;

    // SEO Tab
    document.getElementById("metaDescCheck").textContent =
        data.description !== "No description" ? "✓ Present" : "✗ Missing";
    document.getElementById("altCheck").textContent =
        `${data.missingAltImages} images missing alt text`;

    // Additional Insights
    document.getElementById("headingStats").textContent =
        `H1: ${data.headings.h1}, H2: ${data.headings.h2}, H3: ${data.headings.h3}`;
}

    function updateUIWithError(title, message) {
        document.getElementById("title").textContent = title;
        document.getElementById("description").textContent = message;
    }

    function saveToHistory(data) {
        if (history.length >= MAX_HISTORY_ITEMS) history.shift();
        data.timestamp = new Date().toISOString();
        history.push(data);
        localStorage.setItem('metaMindHistory', JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        if (!historyList) return;
        historyList.innerHTML = "";

        history.slice().reverse().forEach((item) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <strong>${item.title}</strong><br>
                URL: ${item.url}<br>
                Timestamp: ${new Date(item.timestamp).toLocaleString()}
            `;
            historyList.appendChild(listItem);
        });
    }

    if (searchHistoryInput) {
        searchHistoryInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = history.filter(item =>
                item.title.toLowerCase().includes(query) || item.url.toLowerCase().includes(query)
            );
            renderFilteredHistory(filtered);
        });
    }

    function renderFilteredHistory(filtered) {
        if (!historyList) return;
        historyList.innerHTML = "";

        filtered.forEach((item) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <strong>${item.title}</strong><br>
                URL: ${item.url}<br>
                Timestamp: ${new Date(item.timestamp).toLocaleString()}
            `;
            historyList.appendChild(listItem);
        });
    }

    if (downloadButton) {
        downloadButton.addEventListener("click", () => {
            const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `metamind_history_${new Date().toISOString()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    if (clearHistoryButton) {
        clearHistoryButton.addEventListener("click", () => {
            localStorage.removeItem('metaMindHistory');
            history.length = 0;
            renderHistory();
        });
    }

    fetchMetadata();
    renderHistory();
});
