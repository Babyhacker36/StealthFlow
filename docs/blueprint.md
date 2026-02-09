# **App Name**: StealthFlow Outreach

## Core Features:

- Playwright Browser Initialization: Handle Playwright browser setup and configuration using core/browser.py.
- Human-Mimicry Timing: Implement randomized, human-like timing between actions using logic/jitter.py and a Gaussian distribution.
- SQLite Database Setup: Set up a local SQLite database for lead storage using data/database.py.
- Program Execution: Entry point to run the program defined in main.py.
- AI-Powered Content Generation: Generative AI tool analyzes the lead's public information and creates personalized outreach message variations. It will decide whether to use the person's job title or university information in its opening personalization.
- Campaign Management Dashboard: User interface to create, manage, and monitor outreach campaigns.
- Lead Tracking: Track the status and interactions of each lead within the outreach campaigns.

## Style Guidelines:

- Primary color: Deep blue (#293B5F) to convey trust and professionalism.
- Background color: Light gray (#F0F4F8) for a clean, modern look.
- Accent color: Teal (#3D5A80) to highlight key actions and elements.
- Body text: 'Inter' (sans-serif) for a modern, neutral, and readable text.
- Headline text: 'Space Grotesk' (sans-serif) which pairs well with 'Inter'; its slight techiness reflects the technical sophistication of the app
- Use clean, professional icons from a consistent icon set (e.g., Font Awesome) to represent different actions and data points.
- Implement a clean, intuitive layout with clear hierarchy and easy navigation. Use whitespace effectively to create a sense of calm and clarity.
- Subtle animations and transitions to provide feedback and enhance the user experience, avoiding distracting or unnecessary animations.