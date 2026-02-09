# **StealthFlow: Enterprise-Grade Outreach Orchestrator**

StealthFlow is a high-performance, AI-powered outreach engine designed for professional engagement. It leverages advanced "human-mimicry" algorithms and real-time monitoring to ensure secure, high-deliverability outreach operations.

## 🚀 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend/Database**: [Firebase (Firestore)](https://firebase.google.com/)
- **Authentication**: [Firebase Auth (Anonymous & Password)](https://firebase.google.com/products/auth)
- **AI/Personalization**: [Genkit](https://firebase.google.com/docs/genkit) (Gemini 2.5 Flash)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Automation Core**: [Playwright](https://playwright.dev/) (Interface Layer)

## ✨ Key Features

- **Anti-Detection Timing**: Utilizes Gaussian distribution (Jitter) algorithms to mimic human interaction patterns and avoid rate-limiting or flagging.
- **Real-time Monitoring**: A live "Stealth Console" provides instant feedback on engine activity, browser navigation, and outreach success.
- **AI-Personalized Outreach**: Integrated Gemini-powered agents generate unique message variations based on lead professional data.
- **Secure Cloud-Sync**: Multi-tenant architecture with Firestore ensuring data persistence and real-time state management across all sessions.
- **Enterprise UI**: A professional "Command Center" dashboard with interactive stat cards, health gauges, and automated target tracking.

## 🛠️ Quick Start

Follow these steps to get the orchestrator running in your local environment:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd stealthflow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file in the root directory and add your Firebase and Gemini API keys:
   ```env
   GOOGLE_GENAI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Access the Dashboard**:
   Open [http://localhost:9002](http://localhost:9002) in your browser.

## 🔑 Demo Credentials

StealthFlow is configured with **Anonymous Authentication** for ease of review.
- **Recruiters/Reviewers**: Simply open the application. The system will automatically generate a secure, anonymous session for you.
- **Dashboard Access**: You will have immediate, full access to the Command Center, Live Logs, and Lead Database without needing to create an account.

---

*Built with precision for the modern outreach professional.*
