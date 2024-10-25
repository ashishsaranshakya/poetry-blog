# My Writing Palace

Welcome to **My Writing Palace**! This is a poetry blog platform that allows users to explore, favorite, and add poems. The application is built with React, Tailwind CSS, and Firebase.

## Features

- **User Authentication**: Users can log in with Google to access personalized features.
- **Favorites**: Save favorite poems for quick access.
- **Add Poem**: Only a designated user can add new poems to the platform.
- **Dark Mode**: Toggle between dark and light themes to suit your reading preference.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Data Persistence**: Poems and user favorites are stored using Firebase Cloud Firestore.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend & Auth**: Firebase Authentication, Firebase Cloud Firestore
- **Routing**: React Router
- **State Management**: React Context API

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v14 or higher)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/ashishsaranshakya/poetry-blog.git
    cd poetry-blog
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up Firebase:
   - Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
   - Enable Authentication (Google Sign-In).
   - Create a Firestore database and configure security rules.
	```js
	rules_version = '2';
	service cloud.firestore {
		match /databases/{database}/documents {
			match /poems/{poemId} {
				// Anyone can read poems
				allow read: if true; 
				// Only allow authorized UIDs to write to poems
				allow write: if request.auth.uid in ['authorized_uid'];
			}
			// Allow users to read and write their own favorites
			match /users/{userId}/favorites/{document=**} {
				allow read, write: if request.auth.uid == userId;
			}
		}
	}
	```

4. Create a `.env` file at the root of your project and add your Firebase configuration:
    ```plaintext
    VITE_API_KEY=your_api_key
    VITE_AUTH_DOMAIN=your_auth_domain
    VITE_PROJECT_ID=your_project_id
    VITE_STORAGE_BUCKET=your_storage_bucket
    VITE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_APP_ID=your_app_id

    VITE_USER_ID=authorized_user_id
    ```

### Running the App

Run the application with the following command:
```bash
npm run dev
```

The app will start on `http://localhost:5173` (or as indicated in the terminal).

## Folder Structure

```plaintext
├── public                  # Public assets
├── src
│   ├── assets              # Icons and images
│   ├── components          # Reusable components (Header, Footer, etc.)
│   ├── context             # Context files for state management (PoemContext, ThemeContext)
│   ├── pages               # Application pages (HomePage, Favorites, AddPoem, etc.)
|   ├── styles			    # Global styles
│   ├── firebaseConfig.js   # Firebase configuration and initialization
│   ├── App.js              # App component
│   └── main.jsx            # Entry point of the app
├── .env		            # Environment variables
└── package.json			# NPM dependencies
```

## License

This project is open-source and available under the [MIT License](LICENSE).