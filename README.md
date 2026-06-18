# CollaborateX

A full-stack real-time collaborative document editing platform that enables multiple users to create, edit, and share documents simultaneously.

Built using React, Node.js, MongoDB, Socket.IO, Redux Toolkit, and Tailwind CSS.

🔗 Live Demo: https://collaborate-x-steel.vercel.app

## Overview

CollaborateX is a Google Docs-inspired collaboration platform where users can create documents, invite collaborators, edit content in real time, and see updates instantly across connected clients.

The application demonstrates real-world full-stack development concepts including authentication, authorization, realtime communication, state management, and collaborative editing.

---

## Features

### Authentication & Security

- JWT Authentication
- User Registration & Login
- Protected Routes
- Secure Password Hashing
- Persistent User Sessions

### Document Management

- Create Documents
- Edit Documents
- Delete Documents
- Search Documents
- Dashboard Overview

### Realtime Collaboration

- Socket.IO Realtime Synchronization
- Multi-user Editing
- Active User Tracking
- Instant Content Updates

### Collaboration Features

- Share Documents
- Collaborator Access Control
- Leave Shared Documents
- Owner Permissions

### User Experience

- Responsive Design
- Modern Dashboard
- Rich Text Editor
- Toast Notifications
- Confirmation Dialogs
- Autosave Functionality
- Sweet Alert

## Tech Stack

### Frontend

- React.js
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Axios
- React Hot Toast
- SweetAlert2
- Socket.IO Client

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Socket.IO

---

## System Architecture

Frontend (React)
       │
       ▼
Redux Toolkit
       │
       ▼
Axios API Layer
       │
       ▼
Express Backend
       │
 ┌─────┴─────┐
 ▼           ▼
MongoDB   Socket.IO
       │
       ▼
Realtime Collaboration


## Screenshots

### Landing Page

<img width="1535" height="953" alt="LandingPage" src="https://github.com/user-attachments/assets/c0ea2d2c-7112-4ab9-88dc-49b555146708" />


### User Dashboard

<img width="1535" height="953" alt="dashboard" src="https://github.com/user-attachments/assets/906868e0-89a3-4efb-ad2b-c2cc52f0e548" />


### Document Editor

<img width="1855" height="653" alt="EditorPage" src="https://github.com/user-attachments/assets/1be0acb1-ed3c-442c-8eb0-9a4d7b296080" />


### Share Document

<img width="1656" height="912" alt="image" src="https://github.com/user-attachments/assets/a1294218-ccfb-4701-a446-95eca52bf30b" />


## Project Workflow

1. User registers or logs in
2. JWT token is generated
3. User accesses dashboard
4. User creates a document
5. User opens document editor
6. Socket.IO connection is established
7. Changes are broadcast in realtime
8. Collaborators receive updates instantly
9. Document autosaves periodically
10. Data is persisted in MongoDB


## Key Learning Outcomes

This project helped me gain hands-on experience with:

- Realtime systems using Socket.IO
- JWT Authentication
- Protected API Routes
- MongoDB Data Modeling
- React State Management
- Redux Toolkit
- Rich Text Editors
- Full Stack Application Architecture
- Collaborative Software Design
- REST API Development
