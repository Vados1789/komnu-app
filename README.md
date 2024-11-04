
# Komnu App

**Komnu App** is a social networking app built with React Native, designed to help users connect, share posts, and create meaningful communities.

## Features

- User Authentication and Profile Management
- Real-time Messaging
- Friends System for sending and accepting friend requests
- Posts and Comments functionality
- Event and Group participation
- Customizable Settings

## Installation and Setup

### Prerequisites

- [Node.js](https://nodejs.org/) installed
- [Expo CLI](https://expo.dev/) installed
- [.NET SDK](https://dotnet.microsoft.com/download) if setting up the backend

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Vados1789/komnu-app.git
   cd komnu-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   
3. **Set Up Server IP**:
   - Run `ipconfig` in your command prompt or terminal to find your local IP address.
   - Update the `API_BASE_URL` and file `IMAGE_BASE_URL` in files `apiConfig` and `imageConfig` to match your IP address:
     ```json
     "API_BASE_URL": "http://YOUR_LOCAL_IP:5000"
     ```
   - Replace `YOUR_LOCAL_IP` with the IPv4 address from `ipconfig`. This setup ensures the API is accessible on your network.
   

4. **Run the app**:
   ```bash
   npm start
   ```

   

4. **Backend Setup**:
   - In file `launchSettings.json` change url addresses with address of your local machine
   - Follow the backend setup instructions if you plan to run the C# API locally.

## Project Structure

```
komnu-app
├── assets         # Images and other assets
├── components     # Reusable components
├── context        # Context providers like AuthContext
├── data           # Sample data for testing
├── navigation     # App navigation configurations
├── screens        # Screens for each app feature
├── services       # API and service functions
├── styles         # Common styles
└── App.js         # Main app entry point
```

---

That’s it! You’re now ready to start exploring the **Komnu App**.
