# Smart Waste Classifier

An AI-powered waste classification tool that helps identify waste types and provides proper disposal guidance. Built with React, TypeScript, and Google's Gemini AI.

## Features

- 📸 Image-based waste classification
- 🤖 AI-powered analysis using Google Gemini
- ♻️ Disposal recommendations
- 📊 Classification history and statistics
- 🌙 Dark/Light theme support
- 📱 Responsive design

## Setup

### Prerequisites
- Node.js 16+
- Google Gemini API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the environment variable in Vercel dashboard:
   - `VITE_GEMINI_API_KEY`: Your Google Gemini API key
4. Deploy

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Copy the key and add it to your environment variables

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Google Generative AI
