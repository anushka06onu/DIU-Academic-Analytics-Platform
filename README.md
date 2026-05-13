# DIU Academic Analytics Platform

A professional, full-stack web application designed specifically for Daffodil International University (DIU) students to track, analyze, and predict their academic performance.

## The Objective

The official student portal of Daffodil International University currently only displays individual semester-wise results. It lacks comprehensive analytics, a real-time overall CGPA view, PDF report generation, and predictive capabilities, forcing students to calculate their academic trajectories manually. 

The **DIU Academic Analytics Platform** bridges this gap by providing a centralized, automated dashboard where students can securely manage their academic data, track their progress, and make data-driven decisions about their future coursework.

## Key Features

* **Secure Authentication & Persistence**
  * Secure login system restricted exclusively to verified DIU student and faculty email domains.
  * Real-time data synchronization and persistent cloud storage powered by Firebase Firestore.

* **Comprehensive Academic Dashboard**
  * View current overall CGPA, total credits completed, and semester-wise GPA progression at a glance.
  * Input individual course results using the official DIU grading scale to automatically calculate semester performance.

* **Data-Driven Predictive Analytics**
  * **Goal Tracking**: Set a target graduation CGPA and receive real-time calculations on the exact average GPA required in upcoming semesters to achieve that goal.
  * **Feasibility Alerts**: Intelligent mathematical analysis that instantly warns the user if a desired target CGPA is mathematically impossible to achieve with their remaining degree credits.
  * **Consistency Tracking**: Auto-generated insights identifying academic trends, performance improvements, and credit-load efficiency.

* **Professional Report Generation**
  * Generate and download highly structured, formatted PDF academic transcripts.
  * Print-optimized layouts that automatically exclude UI elements and maintain vector-quality graphical progression charts.

## Technologies Used

* **Frontend**: React.js, Vite
* **Styling**: Tailwind CSS, Framer Motion
* **Database & Auth**: Google Firebase (Authentication, Firestore)
* **Data Visualization**: Recharts

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/anushka06onu/DIU-Academic-Analytics-Platform.git
   cd DIU-Academic-Analytics-Platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   Create a `.env` file in the root directory and add your Firebase credentials.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Developer

Developed by **Fateha Hossain Anushka**.
