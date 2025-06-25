# My Writing Palace

**My Writing Palace** is a personal project and poetry blog, built to share my original poems with a wider audience. The platform is designed for readers to easily discover, favorite and revisit my work, while also serving as a showcase of modern web development practices using React, Tailwind CSS, and Firebase.

## Features

- **Personalized Home Page**: The home page features sections for "Your Favorites," "Featured Poems," and "Recent Poems," all personalized and shuffled for variety.
- **Advanced Explore Page Filters**: Filter poems by title, themes, featured status, favorites, and untitled poems. Includes advanced sorting and smart search suggestions.
- **Favorites with Syncing**: Favorite poems are stored based on user login. Local storage is used for guests, and favorites automatically sync upon login.
- **Related Poems Section**: View and expand a list of related poems based on text similarity on each poem's page.
- **Reader Personalization**: Customize the theme (light/dark), font size, font style (sans-serif, serif, typewriter), and line spacing. Preferences are saved in local storage.
- **User Authentication**: Log in with Google to unlock personalized features like adding and favoriting poems.
- **Poem Export**: Export any poem as a PNG image in a custom format, or share it directly to your favorite social media platform.
- **Pagination for Explore and Favorites**: Easily browse large collections of poems with pagination controls on both the Explore and Favorites pages.
- **Manage Content**: Authorized users can manage poems, making it easy to maintain content.
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
   - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
   - Enable Authentication (Google Sign-In).
   - Create a Firestore database and configure security rules.
	```js
	rules_version = '2';
	service cloud.firestore {
		match /databases/{database}/documents {
			match /poems/{poemId} {
				// Anyone can read poems
				allow read: if true;
				// Allow anyone to only update the 'reads' field
				allow update: if 
					request.resource.data.diff(resource.data).changedKeys().hasOnly(['reads']) && 
					request.resource.data.reads is int;
				// Only allow authorized UIDs to write to poems
				allow write: if request.auth.uid in ['authorized_uid'];
			}
			// Allow users to read and write their own favorites
			match /users/{userId}/favorites/{document=**} {
				allow read, write: if request.auth.uid == userId;
			}
			// Allow users to read and write their own readPoems
			match /users/{userId}/readPoems/{document=**} {
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
├── index.html              # Main HTML entry point
├── package.json            # NPM dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint configuration
└── README.md               # Project documentation
```

## License

This project is open-source and available under the [MIT License](LICENSE)
