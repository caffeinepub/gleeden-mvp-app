# Gleeden MVP App

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- User registration and login with profile creation (name, age, gender, location, relationship status, bio, profile photo upload)
- Browse/discover profiles with filtering (age range, location, gender)
- Like / pass functionality on profiles
- Mutual match detection (when two users like each other)
- Private messaging between matched users
- Profile privacy settings (blur/hide photo, hide from discovery)
- Admin/management panel for managing users and reported content
- Sample/seed fake profiles for demo
- Dark, elegant, discreet UI

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
- User profiles: store name, age, gender, location, relationship status, bio, photo blob ID, privacy settings
- Authorization: Internet Identity / principal-based auth via authorization component
- Blob storage: profile photo uploads via blob-storage component
- Like/pass actions: store per-user liked/passed lists
- Match detection: when user A likes user B and user B has already liked user A, create a match
- Messaging: per-match message threads, store messages on-chain
- Report system: users can report profiles; admin can view and act on reports
- Admin role: special principal(s) can manage users and reports
- Seed data: fake profiles injected at init for demo

### Frontend (React/TypeScript/Tailwind)
- Auth flow: login/register with principal
- Profile setup: onboarding form for new users
- Discover page: swipeable card deck with filter sidebar (age, gender, location)
- Matches page: list of mutual matches
- Messages page: per-match chat thread
- My Profile page: view/edit own profile, privacy settings toggle
- Admin panel: user list, report queue, ban/unban actions
- Dark, elegant color scheme (deep charcoal/black with rose/burgundy accents)
- Mobile-friendly responsive layout
