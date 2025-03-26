# Equity Research Assistant Frontend

A React-based frontend application for the Equity Research Assistant API, featuring a Perplexity-like chat interface with citation support, document analysis, and user authentication.

## Features

- **Chat Interface**: Ask equity research questions and get AI-generated answers with citations
- **Suggestion Selection**: Select from multiple research directions to customize responses
- **Citation Display**: View and click on citations to see source details
- **PDF Analysis**: Upload PDF documents and ask questions about their content
- **User Authentication**: Register and login to access research features

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory
   ```
   cd frontend
   ```
3. Install dependencies
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

4. Create a `.env` file in the frontend directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:8000/api/v1
   ```
   Adjust the URL based on where your backend API is running.

### Running the Development Server

```
npm start
```
or
```
yarn start
```

This will start the development server at http://localhost:3000

### Building for Production

```
npm run build
```
or
```
yarn build
```

This will create an optimized production build in the `build` folder.

## Project Structure

```
frontend/
├── public/             # Static files
├── src/                # Source files
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Reusable components
│   ├── contexts/       # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── utils/          # Utility functions and constants
│   ├── App.js          # Main application component
│   ├── index.js        # Application entry point
│   └── index.css       # Global styles
├── .env                # Environment variables
├── package.json        # Dependencies and scripts
└── tailwind.config.js  # Tailwind CSS configuration
```

## Technologies Used

- **React**: Frontend UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client for API requests
- **TailwindCSS**: Utility-first CSS framework
- **React Markdown**: Markdown rendering
- **React Icons**: Icon library
- **React PDF**: PDF document handling

## API Integration

The frontend integrates with the following API endpoints:

- `/api/v1/generate/suggestions`: Generate research suggestions for a query
- `/api/v1/select/suggestions`: Select suggestions and get a final response
- `/api/v1/citations/details`: Get details about citation sources
- `/api/v1/rag/qa`: Process PDF documents with queries
- `/api/v1/auth/*`: Authentication endpoints for login/registration

## License

This project is proprietary and confidential. 