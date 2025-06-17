# My Writing Palace

Welcome to **My Writing Palace**! This poetry blog platform allows users to explore, favorite and manage poems. The application is built with React, Tailwind CSS, and Firebase.

## Features

- **User Authentication**: Log in with Google to unlock personalized features like adding and favoriting poems.
- **Favorites with Syncing**: Favorite poems are stored based on user login. Local storage is used for guests, and favorites automatically sync upon login.
- **Search, Filter, and Sort**: Quickly find poems with dynamic search and filtering options by themes, title, and recent posts.
- **Manage Content**: Authorized users can manage poems, making it easy to manage content.
- **Favorites Export**: Export any poem as a PNG image in a custom format, or share it directly to your favorite social media platform.
- **Data Persistence**: Firebase Cloud Firestore is used for secure storage of poems, user data, and favorites, ensuring seamless data access.
- **Real-Time Updates**: Changes are reflected immediately, leveraging Firebase’s real-time sync.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Vite
- **Backend & Auth**: Firebase Authentication, Firebase Cloud Firestore (serverless)
- **Routing**: React Router
- **State Management**: React Context API
- **Export**: html2canvas (for poem image exports)
- **UI Components**: react-select

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
    ```env
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

### Other npm Scripts
- `npm run build` – Build the app for production
- `npm run preview` – Preview the production build

## Folder Structure

```plaintext
├── public                  # Public assets
├── src
│   ├── assets              # Icons, images, and theme JSON
│   ├── components          # Reusable components (Header, Footer, LoadingSpinner, etc.)
│   ├── context             # Context files for state management (PoemsContext, SettingsContext)
│   ├── pages               # Application pages (HomePage, FavoritesPage, AddPoemPage, AdminPage, etc.)
│   ├── styles              # Global styles
│   ├── utils               # Utility functions
│   ├── firebaseConfig.js   # Firebase configuration and initialization
│   ├── App.jsx             # Base application component
│   └── main.jsx            # Entry point of the app
├── .env                    # Environment variables
├── package.json            # NPM dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint configuration
└── README.md               # Project documentation
```

## License

This project is open-source and available under the [MIT License](LICENSE).