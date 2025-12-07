## 1. Persona (Read Only)
  
You are an expert web developer with great experience in building performant, efficient web apps.
  

## 2. Requirement (Read Only)

I work at an organisation that requires to hire developers of many platforms, like Android, iOS, Flutter, React Native, etc.

Each candidate has to go through two rounds ('L1' and 'L2') of platform-specific technical interviews. The results of these rounds are passed on to the management in a template form.

There can be multiple requirements within a platform, like 'android fresher', 'iOS 3+ YOE'

These panels of the L1 and L2 rounds are working independently and do not have any idea of the questions asked by the other panel.

Also there should be some standardisation in the process, so that the candidates are evaluated on the basis of all the required areas of concepts. This also helps in avoiding the panel of the L2 round not to ask the same/similar set of questions that were asked by the L1 panel.

To make this interview process more simple and consistent for the interview panel, across the different platforms, I want develop an interviewer assistant as a web app. 

The mocks for the requirement could be found in the file @Interviewer-Assistant.png


## 3. Requirement Details (Read Only)

1. Ability to add platforms. This just needs the platform name.

2. Ability to manage "Areas of Evaluation" for a particular platform.

3. 'Manage Areas of Evaluation' screen

3.1. Ability to add/remove a category. Clicking on 'Delete' next to a category, removes the category after confirmation.

3.2. Ability to add/remove concepts under a category. Clicking on 'Delete' next to a concept, removes the concept without confirmation.

3.3. From this screen, you can also delete the platform and navigate back to the platform listing screen. Clicking on 'Delete Platform', removes the platform after confirmation.

3.4. From this screen, you can configure different interviews by navigating to the 'Manage Platform Interviews' screen

4. 'Manage Platform Interviews' screen

4.1. Ability to add/remove/clone interviews

4.2. Clicking on 'Delete', will remove the interview after confirmation

4.3. Clicking on 'Clone', will create a copy interview without confirmation. The copy interview will have the same name suffixed with 'copy'.

4.4. Clicking on an interview, you can configure the interview by navigating to the 'Configure Interview' screen. 

5. 'Configure Interview' screen

5.1. You can configure an interview, with the category and concepts, for both  L1 and L2 round of the interview.

5.2. Ability to also add/remove custom category and concepts, which might be the case for certain special hirings.


## 4. Initial Requirement (Read Only)

Understand the 'Requirement' and create a project planning doc (file 'PRD.md') that breaks down the requirement into logical phases/milestones and brief subtasks within each phase. 

Clarify any doubts or missing details that is required and give feedback/suggestions where required.

DO NOT assume if it is not mentioned or ambiguous, but ask for clarification promptly.

DO NOT start coding without confirmation.

***

# 5. Project Reference Document (PRD) - Interviewer Assistant (Read Only)

## 1. Project Overview
**Goal:** Develop a lightweight, performant web application to assist interviewers in conducting standardized 
    technical interviews. The app will run as a Docker container. It allows management of platforms, evaluation 
    criteria, and interview templates, ultimately providing an interface to conduct interviews and generate feedback.

## 2. Tech Stack (Refined)
*   **Core Framework:** React (SPA) built with **Vite**.
    *   *Reasoning:* Extremely lightweight, fast build times, produces static assets that can be served by a minim
    Nginx container (perfect for Docker).
*   **Styling:** **Tailwind CSS**.
    *   *Reasoning:* Utility-first, purges unused CSS at build time (tiny bundle size), highly maintainable.
*   **State Management:** **Zustand**.
    *   *Reasoning:* Minimal boilerplate compared to Redux, perfect for managing the complex nested state of 
    platforms/interviews.
*   **Routing:** **React Router**.
*   **Icons:** Lucide React.
*   **Persistence Strategy:**
    *   **Phase 1 (MVP):** Browser **LocalStorage**. Data is local to the specific user's machine.
    *   **Phase 2 (Docker/Shared):** A lightweight Node.js/Express backend reading/writing to a `db.json` file. Th
    file will be mounted as a **Docker Volume**, allowing data persistence and sharing across users accessing the same
    container.

## 3. Phased Development Plan

### Phase 1: Foundation & Setup
*   **Objective:** Initialize project, basic UI layout, and State Store.
*   **Subtasks:**
    *   Scaffold project with Vite + React + TypeScript.
    *   Configure Tailwind CSS.
    *   Implement generic UI components (Card, Button, Input, Modal, ConfirmDialog).
    *   Set up Global Store (Zustand) with LocalStorage persistence middleware.

### Phase 2: Platform & Knowledge Base Management
*   **Objective:** Manage the "Master Data" (Platforms -> Categories -> Concepts).
*   **Subtasks:**
    *   **Manage Platforms:** List/Add/Delete.
    *   **Manage Areas of Evaluation:**
        *   Nested structure: Platform -> Categories -> Concepts.
        *   Add/Delete Categories (Confirm required).
        *   Add/Delete Concepts (Instant delete).

### Phase 3: Interview Configuration
*   **Objective:** Create templates for specific interview types (e.g., "Android L1", "iOS Senior").
*   **Subtasks:**
    *   **Manage Platform Interviews:**
        *   CRUD operations for Interview Profiles (Clone adds 'copy' suffix).
        *   **Entry Point:** Add "Start Interview" button to profile cards to launch the Assistant.
    *   **Configure Interview Matrix:**
        *   Select which Master Data concepts apply to L1 / L2 rounds.
        *   **Custom Logic:** Ability to add "Ad-hoc" Categories/Concepts that exist *only* for this specific 
    Interview Profile (does not pollute Master Data).

### Phase 4: The Interview Assistant (Execution Core)
*   **Objective:** The active interface for conducting the interview (Mock 1).
*   **Subtasks:**
    *   **Candidate Details Form:** Name, Experience, Remarks text area.
    *   **Scoring Engine:**
        *   Render accordion/list of Categories active for the selected Profile.
        *   Input field for **Category Score** (0-10).
        *   Display list of concepts under each category as reminders/checklists.
    *   **Live Totals:** Auto-calculate total score based on inputs.
    *   **Session Recovery:** Auto-save current interview state (scores, candidate info) to LocalStorage to preven
    data loss on accidental refresh/close.
    *   **Output Generation:**
        *   **Copy Report:** Formats the results into a clipboard-ready text summary.
        *   **Generate Cover Letter:** Creates a templated feedback paragraph.

### Phase 5: Dockerization & Persistence Migration
*   **Objective:** Deployment readiness and Data Sharing.
*   **Subtasks:**
    *   **Persistence Strategy:**
        *   **Step 1:** MVP uses Browser LocalStorage (implemented in Phases 1-4).
        *   **Step 2:** Migration to File-Based DB (JSON or SQLite) for Docker.
            *   Create Node.js/Express backend to read/write `db.json` or `db.sqlite`.
            *   Update Frontend API layer to switch from LocalStorage to REST API calls.
    *   **Containerization:**
        *   Create `Dockerfile` (Multi-stage: Build React -> Serve Nginx).
        *   Create `docker-compose.yml` mounting the DB file as a volume for persistence.
    *   Final UI Polish (Transitions, Responsive adjustments).

## 4. Data Structure (Draft)
  type Platform = {
    id: string;
    name: string;
    categories: Category[];
  }

  type Category = {
    id: string;
    name: string;
    concepts: Concept[];
  }

  type Concept = {
    id: string;
    name: string;
  }

  type InterviewProfile = {
    id: string;
    platformId: string;
    name: string;
    // Configuration for which concepts are active for L1/L2
    config: {
      [categoryId: string]: {
        l1: string[]; // Array of concept IDs active for L1
        l2: string[]; // Array of concept IDs active for L2
      }
    };
    // Custom additions specific to this profile
    customCategories: Category[]; 
  }

***


## 6. Important Instructions (Read Only)
  
1. Use the web search tool to learn about the latest about a library/framework from the official docs.
     
2. Use chain-of-thoughts and trees-of-thought to improve the accuracy of your response.  
     
3. Do not assume anything which is not explicitly mentioned in the requirement. Immediately clarify by asking questions or feedbacks.  
     
4. Mark every response of yours with a unique identifier (example: "RES_001"), so that I can refer it to reply or ask follow-up questions and to callback.  
     
5. It is OK for you to say that you do not know something and we will figure about it together.  
  
6. IT IS VERY IMPORTANT THAT YOU ask me as many questions required, so that we have the best understanding between us. DO NOT ASSUME AND GENERATE CODE DIRECTLY.    

  
## 7. Changelog (for Gemini's use)
  


## 8. Active Tasks (for Gemini's use)

