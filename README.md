# Decision Making Application

A full-stack web application for managing and analyzing decision-making processes, built with React, Node.js, and MongoDB.

## Features

- User-friendly interface for submitting and managing rankings
- Real-time data storage and retrieval
- Support for multiple AI models (Claude and GPT)
- Organized chat history with folder structure
- Persistent storage using IndexedDB
- RESTful API endpoints for data management

## Tech Stack

### Frontend
- React 18.3.1
- IndexedDB (idb) for client-side storage
- Modern JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS support
- Body-parser for request handling

### AI Integration
- Anthropic Claude API
- OpenAI GPT API

## Project Structure

```
├── config/             # Configuration files
├── models/            # MongoDB models
├── public/            # Static files
├── src/              # React source code
│   ├── components/   # React components
│   ├── services/     # Service layer (including storage)
│   └── ...
├── server.js         # Express server
├── package.json      # Project dependencies
└── vercel.json       # Vercel deployment configuration
```

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd decission_making
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   MONGODB_URI=your_mongodb_connection_string
   REACT_APP_ANTHROPIC_API_KEY=your_anthropic_api_key
   REACT_APP_OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## API Endpoints

### Rankings
- `POST /api/rankings` - Submit new rankings
- `GET /api/rankings/:username` - Get rankings for a specific user

## Storage Service

The application uses IndexedDB for client-side storage with the following features:
- Save and load chat messages
- Manage chat folders
- Clear chat history
- Default folder structure:
  - All Chats
  - No Model
  - Claude Chats
  - GPT Chats

## Development

- The frontend runs on port 3000
- The backend server runs on port 3001
- The proxy is configured to forward API requests to the backend

## Deployment

The application is configured for deployment on Vercel:
1. Build the application: `npm run build`
2. Deploy to Vercel: `vercel deploy`

## Browser Support

The application supports:
- Production: All modern browsers
- Development: Latest versions of Chrome, Firefox, and Safari
