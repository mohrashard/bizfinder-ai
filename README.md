# 🚀 BizFinder AI

![BizFinder AI Logo](/public/logooo.png)

> **Supercharge Your Lead Generation with Artificial Intelligence.**

**BizFinder AI** is a cutting-edge lead generation tool designed for digital marketing agencies and sales professionals. It leverages the power of **Google Gemini 2.0** and **SerpAPI** to find high-value business prospects that traditional search engines miss.

---

## 🧐 The Problem

 finding quality leads is manual, tedious, and inefficient. 
- **Google Maps** is great for finding locations but lacks "negative filters." You can't search for *"businesses that DO NOT have a website"* or *"restaurants with LOW ratings."*
- **Digital Agencies** need these exact clients—businesses that are underserved and need help with web design, SEO, or reputation management.
- Manual searching wastes hours of valuable time.

## 💡 The Solution

**BizFinder AI** automates this entire process. 

1. **Natural Language Search**: Just type what you want in plain English.
   - *"Find dentists in Miami with no website"*
   - *"Mechanics in Dubai with bad ratings"*
2. **AI Interpretation**: We use **Google Gemini AI** to understand your intent and extract strict criteria (e.g., `filter: { noWebsite: true }`).
3. **Real-Time Data**: We fetch live data from Google Maps via **SerpAPI**, ensuring you get the most up-to-date contact info, hours, and status.
4. **Smart Filtering**: The app automatically filters the raw data to match your specific needs, revealing hidden opportunities.
5. **Built-in CRM**: Save interesting leads directly to your personal "My Leads" dashboard to track and export later.

---

## 🛠️ Tech Stack

Built with the latest modern web technologies for performance and experience.

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Glassmorphism & Dark Mode)
- **AI Engine**: [Google Gemini 2.0 Flash](https://aistudio.google.com/)
- **Data Source**: [SerpAPI](https://serpapi.com/) (Google Maps Engine)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

---

## ⚙️ How It Works (Architecture)

1. **User Input**: The user enters a query like *"Italian restaurants in Chicago without social media."*
2. **Gemini Processing**: The app sends this text to Google Gemini. The AI parses it into a structured JSON object:
   ```json
   {
     "category": "Italian restaurants",
     "location": "Chicago",
     "filters": { "noSocials": true }
   }
   ```
3. **Data Retrieval**: utilizing SerpAPI, the app searches Google Maps for the category and location.
4. **Client-Side Filtering**: The application receives the raw list and applies the strict "negative filters" (checking for missing website fields, parsing social media links, analyzing ratings) in real-time.
5. **Lead Management**: Users can "Save" promising leads to their local storage, view them in the "My Leads" tab, adding notes or status updates (e.g. "Contacted").
6. **Export**: Both search results and saved leads can be exported to CSV.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed.
- API Keys for **Gemini** (free tier available) and **SerpAPI**.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohrashard/bizfinder-ai.git
   cd bizfinder-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to `http://localhost:3000`.

### Configuration
You don't need environment variables to start! 
1. Launch the app.
2. Click on **"Configure APIs"** in the top right corner.
3. Paste your **Gemini API Key** and **SerpAPI Key**.
4. Keys are saved securely in your browser's LocalStorage for convenience.

---

## 📖 How To Use

1. **Go to the "Finder" page**.
2. **Enter a query**. Be specific about what you are looking for.
   - *Example 1*: "Gyms in London with less than 4 stars" (Great for Reputation Management)
   - *Example 2*: "Plumbers in Toronto no website" (Great for Web Design agencies)
   - *Example 3*: "Coffee shops in Austin open now"
3. **Review Results**: The app will show you exactly which businesses match your criteria.
4. **Save Leads**: Click the "Save" button on any result to add it to your personal list.
5. **Manage Leads**: Go to the **"My Leads"** page to view your saved prospects, add notes, or remove them.
6. **Export**: Click "Export CSV" to download your leads and import them into your CRM or cold email tool.

---

## 👨‍💻 Developed By

**Mohamed Rashard Rizmi**

Designed and built with a focus on modern aesthetics, user experience, and solving real-world business problems.

---

*© 2025 BizFinder AI.*
