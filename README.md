# DIU Academic Analytics Platform 🎓

![DIU Academic Analytics Banner](public/icons.svg) <!-- Replace with your actual banner if needed -->

A modern, professional, and visually stunning full-stack web application designed specifically for Daffodil International University (DIU) students. This platform goes beyond a simple CGPA calculator to provide a real SaaS-level student productivity and academic intelligence experience.

## ✨ Features

*   **Dynamic Semester System**: Add unlimited semesters (e.g., Spring 2025, Summer 2025). Features smooth expand/collapse animations.
*   **Intelligent Course Management**: Add courses with codes, titles, and credits. Fully integrates the strict **DIU Grading System** (A+ = 4.00 to F = 0.00).
*   **Real-Time Analytics Dashboard**: Beautiful animated statistic cards tracking your Current CGPA, Total Credits Completed, and Predicted Graduation CGPA.
*   **Data Science / AI Features**: 
    *   **"What-if" Scenario Simulator**: Predict what happens to your overall CGPA if you get a specific GPA next semester.
    *   **Smart Insights**: Get auto-generated insights ("Your performance is improving", "You perform best in theory-heavy semesters").
*   **Interactive Visualizations**: High-quality animated charts (using Recharts) for GPA progression line charts and credit completion pie charts.
*   **Goal Tracking System**: Set a target CGPA and visually track the required performance to reach your goals.
*   **Modern Premium UI/UX**: Designed with inspiration from Linear and Apple Dashboard. Features glassmorphism, soft shadows, animated gradient backgrounds, and fully responsive mobile-first layouts.

## 🛠️ Tech Stack

*   **Core**: React + Vite (Fast and optimized builds)
*   **Styling**: Tailwind CSS v4 (Utility-first styling with custom glassmorphism directives)
*   **Animations**: Framer Motion (Fluid page transitions and micro-interactions)
*   **Data Visualization**: Recharts (Interactive, responsive charts)
*   **Icons**: Lucide React
*   **Future Integrations**: Firebase/Supabase for cloud sync and authentication; jsPDF & html2canvas for PDF report generation.

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/anushka06onu/DIU-Academic-Analytics-Platform.git
   cd DIU-Academic-Analytics-Platform
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` to see the app running!

## 📂 Project Structure

```
src/
├── components/       # Reusable UI components
├── context/          # React Context for global state (Auth, Data)
├── layouts/          # Main application layouts (Sidebar, Topbar)
├── lib/              # Utility functions and constants
├── pages/            # Main application pages (Dashboard, Semesters, etc.)
├── App.jsx           # Main routing configuration
└── index.css         # Global Tailwind directives and base styles
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---
*Designed & Developed with ❤️ for DIU Students.*
