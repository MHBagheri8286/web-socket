# Real-Time Chat Application

A modern, real-time chat application built with React and WebSocket technology. Features include instant messaging, user presence indicators, typing indicators, and a responsive Bootstrap-based UI.

## 🚀 Features

- **Real-time messaging** - Instant message delivery using WebSocket
- **User presence** - See who's online/offline in real-time
- **Typing indicators** - Know when someone is typing
- **Responsive design** - Mobile-friendly Bootstrap UI
- **User registration** - Simple username-based authentication
- **Form validation** - Input validation with Yup and React Hook Form
- **Modern React patterns** - Custom hooks, functional components
- **Clean architecture** - Separation of concerns with custom hooks

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **React Router DOM** - Client-side routing
- **React Hook Form** - Form state management and validation
- **Yup** - Schema validation
- **Bootstrap 5** - UI framework and styling
- **Bootstrap Icons** - Icon library
- **Webpack 5** - Module bundler
- **Babel** - JavaScript transpiler

### Backend Requirements
- **WebSocket Server** - Running on `ws://localhost:3001/server`

## 📁 Project Structure

```
client/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatSection.jsx        # Main chat interface
│   │   │   ├── OnlineUsersSection.jsx # Online users sidebar
│   │   │   ├── index.jsx              # Chat container component
│   │   │   ├── layout.css             # Chat-specific styles
│   │   │   ├── useChat.js             # Main chat logic hook
│   │   │   ├── useFormAction.js       # Form handling hook
│   │   │   ├── useSocket.js           # WebSocket management hook
│   │   │   ├── useTyping.js           # Typing indicator hook
│   │   │   └── useUserStatus.js       # User presence hook
│   │   └── registration/
│   │       ├── index.jsx              # User registration form
│   │       └── layout.css             # Registration styles
│   ├── App.jsx                 # Main app component with routing
│   ├── index.jsx              # React app entry point
│   └── index.css              # Global styles
├── .prettierrc                # Prettier configuration
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── webpack.config.js         # Webpack configuration

server/
├── modules/
│   ├── ChatServer.js          # Main server class
│   ├── UserManager.js         # User state management
│   ├── MessageBroadcaster.js  # WebSocket broadcasting
│   ├── WebSocketEventHandler.js # Event handling logic
│   └── index.js               # Module exports
├── tests/                     # Server test files
├── index.js                   # Server entry point
└── package.json              # Server dependencies
```

## 🧪 Test Structure

The application includes comprehensive test coverage for both client and server components using Jest and React Testing Library.

### Client Tests (`client/src/`)

```
src/
├── __tests__/
│   └── App.test.jsx           # Main app routing tests
└── components/
    ├── chat/
    │   └── __tests__/
    │       ├── ChatSection.test.jsx      # Chat UI component tests
    │       ├── OnlineUserSection.test.jsx # Users sidebar tests
    │       ├── useFormAction.test.js     # Form handling hook tests
    │       ├── useSocket.test.js         # WebSocket hook tests
    │       └── useTyping.test.js         # Typing indicator tests
    └── registration/
        └── __tests__/
            └── Registration.test.js      # Registration form tests
```

### Server Tests (`server/tests/`)

```
tests/
├── ChatServer.test.js         # Main server integration tests
├── UserManager.test.js        # User state management tests
├── MessageBroadcaster.test.js # Broadcasting logic tests
└── WebSocketEventHandler.test.js # Event handling tests
```

### Test Categories

#### **Frontend Tests**
- **Component Tests**: UI rendering, user interactions, prop handling
- **Hook Tests**: Custom hook logic, state management, side effects
- **Integration Tests**: Component interaction, routing, form submission

#### **Backend Tests**
- **Unit Tests**: Individual class methods, data manipulation
- **Integration Tests**: WebSocket connections, event handling
- **Mock Tests**: External dependencies, WebSocket server behavior

### Test Configuration

#### Client Testing Setup
- **Jest** - Test runner and assertion library
- **React Testing Library** - Component testing utilities
- **@testing-library/user-event** - User interaction simulation
- **jsdom** - DOM environment for testing

#### Server Testing Setup
- **Jest** - Test runner and assertion library
- **WebSocket Mocking** - Simulated WebSocket connections
- **Module Mocking** - Isolated unit testing

### Running Tests

#### Client Tests
```bash
cd client
npm test                 # Run tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
```

#### Server Tests
```bash
cd server
npm test                 # Run tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
```

### Test Coverage

The test suite covers:
- ✅ **Components**: All React components with props and state
- ✅ **Custom Hooks**: WebSocket, form handling, typing, user status
- ✅ **Server Logic**: User management, message broadcasting, event handling
- ✅ **Error Handling**: Invalid inputs, connection failures, edge cases
- ✅ **Integration**: Component interaction, WebSocket communication

## 🚦 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **WebSocket server** running on port 3001

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

#### Client Scripts
- `npm start` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

#### Server Scripts
- `npm start` - Start server with nodemon
- `npm test` - Run server tests
- `npm run test:watch` - Run server tests in watch mode
- `npm run test:coverage` - Generate server test coverage

## 🔌 WebSocket API

The application expects a WebSocket server with the following events:

### Client Events (Sent to Server)
- `add_user` - Add user to chat room
- `remove_user` - Remove user from chat room
- `new_message` - Send new message
- `update_status` - Update user online/offline status
- `add_typing_users` - User started typing
- `remove_typing_users` - User stopped typing

### Server Events (Received from Server)
- `all_users` - List of all connected users
- `new_message` - New message received
- `show_typing_users` - List of users currently typing

### Message Format
```javascript
// Client to Server
{
  "event": "new_message",
  "data": { "message": "Hello world!" }
}

// Server to Client
{
  "event": "new_message",
  "data": {
    "user": { "name": "john_doe", "status": "online" },
    "message": "Hello world!"
  }
}
```

## 🎨 UI Components

### Registration Component
- Username validation (2-20 characters, alphanumeric + underscore)
- Responsive form with Bootstrap styling
- Real-time validation feedback

### Chat Interface
- **Chat Section**: Message display, input field, typing indicators
- **Online Users Section**: Real-time user list with status indicators
- **Responsive Design**: Mobile-friendly layout

## 🔧 Custom Hooks

### `useChat`
Main chat logic orchestrator that combines all other hooks.

### `useSocket`
WebSocket connection management with automatic reconnection and event handling.

### `useTyping`
Manages typing indicators with debounced start/stop logic.

### `useUserStatus`
Handles user presence based on browser visibility API.

### `useFormActions`
Form submission and validation handling.

## 🎯 Key Features Explained

### Real-time Messaging
Messages are sent via WebSocket and immediately displayed to all connected users.

### Typing Indicators
When users type, other participants see a "typing..." indicator that automatically disappears when they stop.

### User Presence
Users' online/offline status is automatically updated based on browser tab visibility.

### Form Validation
- Username: 2-20 characters, letters/numbers/underscores only
- Messages: Required, cannot be empty

### Responsive Design
The application adapts to different screen sizes:
- Desktop: Side-by-side chat and users panel
- Mobile: Stacked layout with collapsible sections

## 🔍 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Serve the built files**
   The build creates optimized static files that can be served by any web server.

3. **Update WebSocket URL**
   Change the `WS_URL` in `useSocket.js` to your production WebSocket server.

## 📝 Code Style

This project uses:
- **Prettier** for code formatting
- **ESLint** for code linting
- **React Hooks** best practices
- **Functional components** only

## 🐛 Troubleshooting

### WebSocket Connection Issues
- Ensure WebSocket server is running on port 3001
- Check browser console for connection errors

### Styling Issues
- Bootstrap CSS is loaded from CDN
- Custom styles are in component-specific CSS files
- Check browser developer tools for CSS conflicts

### Test Issues
- Ensure all dependencies are installed
- Check test configuration in `jest.config.js`
- Verify mock implementations are up to date

## 🙏 Acknowledgments

- React team for framework
- Bootstrap for the UI components
- WebSocket API for real-time communication
