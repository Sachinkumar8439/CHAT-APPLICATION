# FULL STACK CHAT-APPLICATION
A fully functional real-time chat application built using HTML, CSS, JavaScript, Node.js, Express.js, MongoDB, and Socket.io. It includes features like user authentication, one-to-one and group chats, file sharing, and real-time updates with a visually appealing and responsive design.
# 1.introduction
Welcome to the Real-Time Chat Application, a robust and interactive platform designed for seamless communication. This application enables users to connect instantly through private or group chats, offering real-time messaging and file-sharing capabilities. With a focus on performance, responsiveness, and user experience, this chat app leverages modern web technologies to deliver a smooth and engaging communication environment.

Whether you're looking to create personal connections, collaborate with a team, or explore the potential of web-based real-time chat systems, this application is a perfect blend of functionality and innovation
Features 

# 2. 🛠️ **Features**  

### 🔒 **User Authentication**  
- 🔑 Secure login and registration system.  
- 🔄 Forgot password functionality for credential recovery.  

### 💬 **Real-Time Communication**  
- 💌 **One-to-One Chats**: Instant private messaging.
- 👀 **read-reciept**:indicates when you seen any user message.
- 💬 **typing indicator**:current user can see your if you are typing.
- 🧑‍🤝‍🧑 **Group Chats**: Seamless collaboration with multiple users.  


### 📂 **File Sharing**  
- 📷 Share images, videos, and documents effortlessly.  
- 🔐 Secure file handling using **Multer** and **MongoDB**.  


### 🎨 **Responsive & Attractive UI**  
- 📱 Fully responsive design for all devices.  
- 🎨 Elegant login interface with a transparent box and a stunning background.  

### ⚡ **Performance & Optimization**  
- 🚀 Real-time updates powered by **Socket.io**.  
- 💾 Efficient database management with **MongoDB**.  


### ✨ **Extra Functionalities**  
- ✍️ Typing indicators to enhance user experience.
- 🔍 :user search API:user can search other users.  
- 🕒 Message timestamps for clear communication tracking.  
   

# 3. 🛠️ **Technologies Used**

This project uses a combination of modern web development technologies and tools to provide a smooth and efficient real-time chat application.

### **Languages**
- **HTML**: Markup language used to structure the web pages.
- **CSS**: Styling language used to design the layout and look of the application.
- **JavaScript**: Used for client-side and server-side scripting to make the app interactive.
- **jQuery**: JavaScript library used to simplify DOM manipulation and AJAX calls.

### **Modules & Libraries**
- **Node.js**: JavaScript runtime for building scalable server-side applications.
- **Express.js**: Web framework for building the API and handling routing.
- **Socket.io**: Library for enabling real-time, bidirectional communication between client and server.
- **MongoDB**: NoSQL database for storing user data, chat messages, and media.
- **EJS**: Template engine used for rendering HTML views with dynamic data.

### **Security & Authentication**
- **bcrypt**: Password hashing library used for secure user authentication.
- **Session**: Used to store session data for user login and persistence.
- **CORS**: Middleware used to handle Cross-Origin Resource Sharing (CORS) and secure API calls.

### **File Handling & Uploading**
- **Multer**: Middleware for handling `multipart/form-data`, used for uploading files (images, videos, etc.).

### **Other Tools**
- **Nodemon**: Utility for auto-restarting the server during development.
- **Dotenv**: Module used to load environment variables from a `.env` file for configuration.

These technologies work together to create a fast, secure, and interactive chat platform.


# 4. 🚀 **Getting Started: run in your device**  
Follow the [Setup Guide](#) to get the application running on your local machine.
---


---

### **Prerequisites**
Ensure you have the following installed on your system:
1. **Node.js** (v14 or above) - [Download Node.js](https://nodejs.org/)
2. **MongoDB** - [Install MongoDB](https://www.mongodb.com/try/download/community)
3. **Git** - [Install Git](https://git-scm.com/)

---

### **Step 1: Clone the Repository**
1. Open your terminal/command prompt.
2. Run the following command to clone the repository:
   ```bash
   git clone https://github.com/Sachinkumar8439/CHAT-APPLICATION.git
   ```
3. Navigate to the project directory:
   ```bash
   cd <repository-name>
   ```

---

### **Step 2: Install Dependencies**
Install all necessary dependencies using npm:
```bash
npm install
```

---

### **Step 3: Configure Environment Variables**
1. Create a `.env` file in the project root directory.
2. Add the following environment variables:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/chatapp
   JWT_SECRET=your-secret-key
   ```
   Replace `your-secret-key` with a secure string for JWT token signing.

---

### **Step 4: Start MongoDB**
1. Ensure MongoDB is running locally.  
   On Linux/Mac:
   ```bash
   mongod
   ```
   On Windows, start the MongoDB service from the Services Manager.

---

### **Step 5: Run the Application**
Start the server using the following command:
```bash
node app.js
```

The server will start running on `http://localhost:3000`.

---

### **Step 6: Access the Application**
1. Open a web browser.
2. Navigate to `http://localhost:3000` to access the chat application.

---

## 🔧 **Development Scripts**
For development purposes, you can use the following commands:
- Start the server in development mode (with auto-reload):
- ensure you have installed the nodemon   
  ```bash
  npm run app
  ```
  

---
 if there is any issue in running project then feel free to ask on **[my email](sachin39430@gmail.com)**.

 

# 5. 🔮 **Future Enhancements**

### 🔖 User Follower System
- Enable users to **follow/unfollow** others seamlessly.
- View **follower** and **following lists** for improved interaction.
- Get **notifications** when a new follower is added.

### 🔔 Notification Indication Feature
- Receive **real-time notifications** for:
  - New messages
  - Friend requests
- **Sound and visual alerts** for important updates.
- Customize notification preferences (e.g., mute specific chats).

### ✏️ Profile Editing API
- Update your **profile picture**, **bio**, and **status** effortlessly.
- Edit your **username** with validation to ensure uniqueness.
- Add customizable themes for **personalized UI appearance**.


### 🗂️ Chat Archiving & Search
- Archive old conversations for a **cleaner inbox**.
- Add a **powerful search** feature to find messages quickly.


### 🔐 Enhanced Privacy Controls
- Options to **block/unblock users**.
- Implement **end-to-end encryption** for sensitive conversations.
- Granular privacy settings for **online status** visibility.

---

Stay tuned for these updates, and feel free to contribute ideas or suggestions! Together, we’ll build a feature-rich and user-friendly chat platform.

---




## 📧 **Contact**  
For queries or feedback, feel free to reach out to **[Sachin Kumar](sachin39430@gmail.com)**.

