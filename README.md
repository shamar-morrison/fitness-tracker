# FitTrackr

FitTrackr is a web application designed to help users track their fitness journey. It allows authenticated users to manage their workouts, including creating new workouts, viewing existing ones, and potentially using templates. Users can also monitor their progress, view statistics, and manage their profiles through a personalized dashboard.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Project](#running-the-project)
- [Building the Project](#building-the-project)
- [Available Scripts](#available-scripts)
- [Technologies Used](#technologies-used)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (LTS version recommended)
- npm (comes with Node.js) or yarn

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/shamar-morrison/fitness-tracker.git
    cd fittrackr
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
    (or `yarn install` if you prefer yarn and have it installed)

## Environment Setup

This project requires certain environment variables to be set up. Create a `.env.local` file in the root of the project.

### Core Next.js Application Variables:

These are essential for running the Next.js application and connecting to Supabase from both client and server components:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Replace `your_supabase_url_here` and `your_supabase_anon_key_here` with your actual Supabase project URL and public anon key.

### Additional Server-Side / Database Variables:

These variables might be required for direct database access (e.g., migrations, seeding, scripts), specific server-side Supabase admin operations, or custom JWT handling. They are typically not needed for running the basic Next.js development server for UI work, but would be necessary for full backend functionality or if the project has separate backend services/scripts interacting with the database directly.

```env
# Supabase server-side settings
SUPABASE_URL=your_supabase_url_here # Often same as NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here # For admin operations, keep this secure
SUPABASE_JWT_SECRET=your_supabase_jwt_secret_here # For custom JWT handling

# Direct PostgreSQL connection (if used outside Supabase client or for specific tools)
POSTGRES_URL="your_postgres_connection_string_here"
POSTGRES_USER="your_postgres_user_here"
POSTGRES_HOST="your_postgres_host_here"
POSTGRES_PASSWORD="your_postgres_password_here"
POSTGRES_DATABASE="your_postgres_database_name_here"
POSTGRES_PRISMA_URL="your_postgres_connection_string_for_prisma_here" # If using Prisma
POSTGRES_URL_NON_POOLING="your_postgres_non_pooling_connection_string_here" # Alternative connection string
```

**Important Security Notes:**

- Always replace placeholder values with your actual credentials.
- **Never commit your `.env.local` file or files containing sensitive keys (like `SUPABASE_SERVICE_ROLE_KEY` or database passwords) to your Git repository.** Ensure `.env.local` is listed in your `.gitignore` file.
- For production deployments, use your hosting provider's system for managing environment variables securely.

## Running the Project

To run the project in development mode:

```bash
npm run dev
```

This will start the development server, usually on `http://localhost:3000`.

## Building the Project

To create a production build:

```bash
npm run build
```

This command compiles the application into static files for deployment.

## Available Scripts

In the `package.json` file, the following scripts are available:

- `dev`: Starts the development server.
- `build`: Builds the application for production.
- `start`: Starts the production server (after running `build`).
- `lint`: Lints the codebase using Next.js's ESLint configuration.
- `format`: Formats the code using Prettier.

You can run these scripts using `npm run <script-name>`. For example, `npm run lint`.

## Technologies Used

- Next.js
- React
- TypeScript
- Supabase
- Tailwind CSS
- Shadcn/ui (based on common Next.js project structures and dependencies like `@radix-ui/*`)
- ESLint
- Prettier

---

This README provides a basic guide to get the `fittrackr` project up and running.
