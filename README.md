
# Metamind Chrome Extension

## Overview

**Metamind** is a Chrome extension that helps users gather detailed metadata, SEO insights, and performance metrics from the current webpage. It provides information such as the page title, meta description, keywords, open graph (OG) tags, and more. Additionally, it offers real-time performance data like First Contentful Paint (FCP) and Cumulative Layout Shift (CLS) along with SEO and accessibility checks. Metamind also allows users to track and view the metadata history for pages they’ve previously visited.

## Features

- **Metadata Extraction**: Displays essential metadata like page title, meta description, keywords, and OG tags.
- **Performance Insights**: Measures page load time, FCP, CLS, and other performance metrics.
- **SEO Checks**: Verifies the presence of a meta description, heading structure, and image alt text.
- **Dark Mode**: Toggle between light and dark modes for better readability.
- **History Tracking**: Stores metadata for previously visited pages and allows easy access to historical data.
- **Export to JSON**: Download the metadata history as a JSON file.
- **Accessibility Insights**: Analyze image alt text and contrast ratios for better accessibility.
- **Real-time Updates**: Continuously monitor page performance as the user interacts with it.

## Installation

### 1. Clone the Repository

```bash
git clone repo link
cd metamind-chrome-extension
```

### 2. Install the Extension

1. Open Chrome and go to `chrome://extensions/`.
2. Enable "Developer mode" by toggling the switch in the top-right corner.
3. Click on "Load unpacked" and select the folder where you cloned the project.

Your extension will be installed and ready to use.

## Usage

1. **Click on the Metamind extension icon** in the Chrome toolbar.
2. The extension will display a detailed view of the current page's metadata, performance, and SEO insights.
3. You can toggle between different tabs like **Metadata**, **Insights**, **SEO**, and **History**.
4. Use the **Refresh** button to re-fetch the data from the current webpage.
5. You can also **download the metadata history** as a JSON file by clicking on the "Download Metadata" button.

### Dark Mode
You can toggle dark mode by clicking the checkbox in the settings, making it easier to view the data in low-light environments.

## Development

To contribute or develop the project further:

1. Clone the repository.
2. Make the desired changes to the code.
3. Test your changes locally by reloading the extension via `chrome://extensions/`.
4. Submit a pull request with your changes.

## Pics
![Screenshot 2025-02-15 172551](https://github.com/user-attachments/assets/99bc1f21-73f2-46d6-b4f2-f22fa83d96fb)
![Screenshot 2025-02-15 172513](https://github.com/user-attachments/assets/345b762d-f876-49c1-b9ca-b2de6a57a113)
![Screenshot 2025-02-15 172500](https://github.com/user-attachments/assets/7545c5f3-5eb3-4da7-be37-b74ac49ad30a)
![Screenshot 2025-02-15 172438](https://github.com/user-attachments/assets/56a8dfae-b798-40ed-9bb9-3594617688da)

## Technologies Used

- **HTML5**: Structure of the popup interface.
- **CSS3**: Styling the user interface with responsive design and dark mode support.
- **JavaScript**: Logic to fetch, analyze, and display the webpage's metadata and performance data.
- **Chrome Extensions API**: Used to interact with browser tabs, fetch metadata, and manage extension features.

## Features in Progress

- Real-time performance monitoring with dynamic updates.
- Exporting performance data as CSV.
- Integration with AI-powered SEO suggestions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
