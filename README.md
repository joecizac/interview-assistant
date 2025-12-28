# Interviewer Assistant

The Interviewer Assistant is a comprehensive web application designed to streamline and standardize the technical interview process across various platforms (e.g., Android, iOS, Flutter, React Native). It provides a structured approach for interviewers to evaluate candidates, ensuring consistency and thoroughness in assessments.

## Project Overview

This application addresses common challenges in technical hiring by offering a centralized system to manage interview content, configure specific interview profiles, conduct live evaluations, and generate detailed reports. It aims to prevent redundant questioning, enforce standardized evaluation criteria, and simplify the feedback generation process for both L1 and L2 rounds of interviews.

## Features

The Interviewer Assistant provides the following key functionalities:

*   **Platform & Knowledge Base Management:**
    *   Define and manage various development platforms (e.g., "Android", "iOS").
    *   For each platform, create a hierarchical "Areas of Evaluation" structure consisting of Categories and their associated Concepts.
    *   Effortlessly add, edit, and delete Categories and Concepts, forming a reusable knowledge base for interviews.

*   **Interview Configuration:**
    *   Create and manage custom interview profiles for different hiring needs (e.g., "Android L1 Freshers", "iOS Senior 3+ YOE").
    *   Configure L1 and L2 rounds for each interview profile, selecting relevant categories and concepts from the master knowledge base.
    *   Ability to add ad-hoc custom categories and concepts specific to an interview profile without polluting the master data.
    *   Clone existing interview profiles to quickly create new ones.

*   **Interview Assistant (Execution Core):**
    *   A dedicated interface for conducting live interviews.
    *   Capture candidate details such as Name, Experience, and general Remarks.
    *   Evaluate candidates on each category with a score (0-10) and concepts acting as checklists.
    *   Real-time calculation of total scores based on configured category weights.
    *   Automatic session recovery to prevent data loss during accidental refreshes or browser closures.

*   **Output Generation:**
    *   **Copy Report:** Generate a clipboard-ready text summary of the interview results.
    *   **Download PDF Report:** Create and download a professionally formatted PDF report of the interview, including candidate details, evaluation breakdown, and overall scores.

*   **Persistence & Deployment:**
    *   **File-Based Persistence:** Data is stored in a lightweight `db.json` file, managed by a Node.js/Express backend.
    *   **Dockerized Deployment:** The entire application (frontend and backend) is containerized using Docker, allowing for easy deployment and ensuring data persistence via Docker volumes.

## Tech Stack

*   **Frontend:**
    *   **React:** A declarative, component-based JavaScript library for building user interfaces.
    *   **Vite:** A lightning-fast build tool and development server for modern web projects.
    *   **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
    *   **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
    *   **Zustand:** A small, fast, and scalable bear-necessities state-management solution for React.
    *   **React Router:** Declarative routing for React applications.
    *   **Lucide React:** A beautiful and consistent icon library.
    *   **jspdf & jspdf-autotable:** Libraries for client-side PDF generation.
*   **Backend:**
    *   **Node.js & Express.js:** A minimal and flexible Node.js web application framework, handling API requests and file-based data persistence.
*   **Containerization:**
    *   **Docker:** Platform for developing, shipping, and running applications in containers.
    *   **Nginx:** High-performance web server used to serve the React frontend and proxy API requests.

## Getting Started

To get a local copy up and running, follow these simple steps. The application is designed to be run as Docker containers.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/interviewer-assistant.git
    cd interviewer-assistant
    ```
2.  **Build and run the Docker containers:**
    ```bash
    docker compose up --build
    ```
3.  **Access the application:**
    Open your web browser and navigate to `http://localhost:8080`.

## Usage

*   **Manage Platforms:** Start by adding new platforms from the "Manage Platforms" section.
*   **Manage Areas of Evaluation:** Configure categories and concepts for each platform.
*   **Manage Platform Interviews:** Create and customize interview profiles, selecting relevant evaluation criteria for L1 and L2 rounds.
*   **Conduct Interviews:** Use the "Interview Assistant" to conduct structured interviews, score candidates, and generate reports.