# IoT Project Management Application

Welcome to the **IoT Project Management Application** repository! This project provides a comprehensive platform for managing IoT projects, modules, and real-time control.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Authentication System](#authentication-system)
  - [Registration](#registration)
  - [Email Activation](#email-activation)
  - [Login](#login)
  - [Reset Password](#reset-password)
  - [Logout](#logout)
- [Pages Overview](#pages-overview)
  - [Home Page](#home-page)
  - [Module Page](#module-page)
  - [Project Page](#project-page)
  - [Edit Project Page](#edit-project-page)
  - [Edit Rule Page](#edit-rule-page)
  - [Edit Image Page](#edit-image-page)
  - [Edit Safety Page](#edit-safety-page)
  - [Live Control Page](#live-control-page)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The **IoT Project Management Application** is a web-based platform that enables users to create, manage, and control IoT projects. It provides features such as module configuration, rule creation, real-time control, and safety settings. The application is designed to be user-friendly, secure, and scalable.

## Features

- **Authentication System:** Secure user registration, login, and password management.
- **Project Management:** Create, edit, and delete IoT projects.
- **Module Configuration:** Add, edit, and rearrange modules within projects.
- **Rule Creation:** Define rules for module interactions.
- **Real-Time Control:** Monitor and control modules in real-time using Socket.IO.
- **Safety Settings:** Configure safety modules like camera activation and pin settings.
- **Image Management:** Upload, view, and delete project-related images.

## Authentication System

### Registration

Users can register using:

- **Normal Registration:** Enter username, email, and password.
- **Google OAuth 2.0:** Register using a Google account.

### Email Activation

After registration, users must verify their email by entering a verification code sent to their inbox.

### Login

Users can log in using:

- **Normal Login:** Enter email and password.
- **Google OAuth 2.0:** Log in using a Google account.

### Reset Password

If a user forgets their password, they can reset it by:

- Entering their email.
- Verifying their identity with a code sent to their email.
- Setting a new password.

### Logout

Users can log out, which clears their session and redirects them to the login page.

## Pages Overview

### Home Page

- Provides an overview of the IoT platform.
- Includes a description of the platform's features.
- Displays team member introductions.

### Module Page

- Users can view their modules in **grid view** or **list view**.
- Selected view style is saved in local storage for consistency across sessions.

### Project Page

- Users can **create new projects**.
- Edit project details (name, description, controller type).
- Delete projects.
- Access detailed project views for module and rule management.

### Edit Project Page

- Allows users to **add, edit, and rearrange modules**.
- Configure module properties (e.g., pin settings).
- Save changes to the project.

### Edit Rule Page

- Users can **add new rules** to define module interactions.
- Edit or delete existing rules.
- Save rule changes.

### Edit Image Page

- Users can:
  - Upload new images (via file upload or camera capture).
  - View and delete existing images.

### Edit Safety Page

- Enable or disable the **camera safety module**.
- Configure **pin settings** for the camera module.

### Live Control Page

- Provides **real-time control** and monitoring of IoT modules.
- Users can:
  - Connect or disconnect from the WebSocket server.
  - View and control module states in real-time.
  - Switch between projects to manage different sets of modules.

## Installation

To set up the project locally, follow these steps:

### Clone the repository:

```bash
git clone https://github.com/your-username/iot-project-management.git
cd iot-project-management
```

### Install dependencies:

```bash
npm install
```

### Set up environment variables:

Create a `.env` file in the root directory and add the following:

```plaintext
PORT=3000
DATABASE_URL=your-database-url
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-jwt-secret
```

### Run the application:

```bash
npm start
```

### Access the application:

Open your browser and navigate to `http://localhost:3000`.

## Usage

1. Register or log in to access the platform.
2. Create a new project from the **Projects Page**.
3. Add modules, configure rules, and upload images as needed.
4. Use the **Live Control Page** to monitor and control your IoT modules in real-time.

## Contributing

We welcome contributions! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes.
4. Submit a pull request.
