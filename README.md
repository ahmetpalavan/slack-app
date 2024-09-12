# Slack App

Slack App is a web application designed to replicate the core features of the popular Slack messaging platform. This project allows users to communicate and collaborate in real-time with an intuitive interface. The application includes channels, messaging, and reactions to enhance user interactions.

## Project Features

- **Channel-Based Communication**: Organize conversations into different channels.
- **Direct Messaging**: Send private messages to other users.
- **Message Reactions**: Add emoji reactions to messages.
- **User Authentication**: Secure user login and session management.
- **Rich Text Editor**: Use a Quill-based editor for formatting messages.
- **Real-Time Updates**: Ensure instant message delivery and updates across users.

## Technologies Used

- **Next.js**: Framework for server-side rendering and static site generation.
- **TypeScript**: Strongly-typed JavaScript.
- **TanStack Query (React Query)**: Data fetching, caching, and synchronization.
- **Convex**: Backend for state synchronization and database.
- **Shadcn/UI**: Accessible and unstyled UI components.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Zustand**: State management.
- **Quill**: Rich text editor for messages.
- **Sonner**: Notifications and toasts.
- **React-Icons**: Icon library for React.
- **Emoji Picker React**: Easy emoji selection for message reactions.

## Installation and Setup

Follow these steps to set up and run the project locally:

### Install Dependencies

```bash
bun install
```

### Start Development Server

To run the application locally:

```bash
bun run dev
```

This command will start the development server and open the application in your browser at http://localhost:3000.

### Build for Production

To build the application for production:

```bash
bun run build
```

## Commands

- **dev**: Starts the development server.
- **build**: Builds the application for production.
- **start**: Starts the application in production mode.
- **lint**: Runs ESLint to check the code.

## Live Demo

You can check out the live demo of the application [here](https://slack-app-nu.vercel.app/).
