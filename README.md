# Ignatians Service Organization Sign-up App

This is a React application built with Vite and Firebase for managing service placement sign-ups for the Ignatians Service Organization.

## Purpose

The application serves two main user groups:
1.  **Students**: Allows them to view available service placements, read details, and sign up for weekly service slots. It also handles driver designation and passenger capacity.
2.  **Board Members**: Provides an administrative interface to create, edit, and delete placements, as well as manage student sign-ups.

## Features

*   **Real-time Updates**: Uses Firebase Firestore for real-time data synchronization.
*   **Authentication**: Supports Email/Password and Google Sign-In for board members.
*   **Capacity Management**: Automatically handles placement capacity and waitlists (visually indicating "FULL").
*   **Driver Tracking**: Tracks which students are drivers and their passenger capacity.
*   **Notifications**: Supports global notifications and specific alerts when placement capacities are reduced.

## Project Structure

*   `src/components/`: Contains React components.
    *   `StudentView.jsx`: The main view for students to browse and sign up.
    *   `BoardView.jsx`: The administrative dashboard.
*   `src/services/`: Contains business logic and data access layers.
    *   `dataService.js`: Handles all interactions with Firebase Firestore.
*   `src/firebase.js`: Firebase configuration and initialization.

## Setup and Installation

### Prerequisites

*   Node.js (v16 or higher recommended)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Firebase:**
    *   Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    *   Enable **Firestore Database** and **Authentication** (Email/Password and Google providers).
    *   Copy your web app configuration keys.
    *   Update `src/firebase.js` with your specific configuration values.

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be in the `dist/` directory.

## Testing

To run the unit tests (using Vitest):

```bash
npx vitest run
```

## Documentation

The codebase is fully documented with JSDoc comments. You can inspect the source files for detailed information on functions, parameters, and return values.
