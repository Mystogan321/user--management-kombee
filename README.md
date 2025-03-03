# User Management Module

## Features

### 1. User Authentication
- Login and Logout functionality.

### 2. User CRUD
- Create, Read, Update, and Delete users.

### 3. User Listing (Server Table)
- Fetch user data from the server.
- Display a loader while fetching data using mock api.
- Paginated user listing.

### 4. Search, Sorting, Filtering, and Pagination
- Global Search.
- Sorting on Name & Email columns.
- Role-based filtering.
- Pagination for efficient navigation.

### 5. Add/Edit User
- Form-level validation to prevent invalid submissions.
- Disable submission until the form is valid.
- Use the same reusable form component for adding and editing users.

### 6. User View (Popup)
- Clicking the eye icon in the listing will open a user info popup.

### 7. Delete Users
- Support for single and multiple deletions.

### 8. Export Users
- Export user data to a CSV file.

### 9. State Management
- Utilize Redux Toolkit for state management.

## Tech Stack
- **Frontend:** React with Vite
- **Styling:** Tailwind CSS
- **State Management:** Redux Toolkit
- **Type Checking:** TypeScript
- **UI Components:** Radix UI
- **Rich Text Editor:** Quill.js

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd <project-folder>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Usage
- Navigate to the authentication page to log in.
- Manage users via CRUD operations.
- Search, filter, and sort user entries efficiently.
- Export user data when required.

## Notes
- Ensure the server API is running for proper functionality.
- Modify configurations in the `.env` file as needed.

## File Structure
```
user-management-system/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Loader.tsx
│   │   ├── UserForm.tsx
│   │   ├── UserModal.tsx
│   │   └── UserTable.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useUsers.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   └── Login.tsx
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   └── usersSlice.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── uuid.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── App.css
│   └── vite-env.d.ts
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── eslint.config.js
└── vite.config.ts
```

