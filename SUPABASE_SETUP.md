# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be initialized

## 2. Get Your Supabase Credentials

1. Go to your project settings
2. Find the API section
3. Copy:
   - **Project URL** - Use this for `NEXT_PUBLIC_SUPABASE_URL`
   - **Anon Public Key** - Use this for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service Role Key** - Use this for `SUPABASE_SERVICE_ROLE_KEY`

## 3. Add Credentials to .env.local

Update `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 4. Create Database Schema

1. Go to your Supabase project dashboard
2. Click on "SQL Editor"
3. Create a new query
4. Copy and paste the contents of `database/schema.sql`
5. Run the query

## 5. Test the Connection

Run the development server:

```bash
npm run dev
```

Test the registration and login endpoints.

## Tables Created

- **users** - Store user account information
- **admins** - Store admin accounts and roles
- **payments** - Store payment records
- **settings** - Store application settings (like registration fee)
- **contacts** - Store contact form submissions

## Security Notes

- Never commit `.env.local` to GitHub (it's in .gitignore)
- Use Row Level Security (RLS) policies for data protection
- Always use the Service Role Key only on the server side
- The Anon Key is safe to expose in the browser
