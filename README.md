# AgentForge Mobile

**Visual workflow builder for autonomous agents with OpenClaw integration**

AgentForge is a React Native mobile application that enables users to create, manage, and monitor AI agent workflows with an intuitive drag-and-drop interface. Built with OpenClaw integration for powerful agent orchestration.

## Features

### 🎨 Visual Workflow Builder
- Drag-and-drop node-based interface
- Real-time workflow validation
- Multiple node types: Input, Process, Decision, Output, API Call
- Connection management with automatic routing
- Zoom and pan canvas controls

### 📋 Template System
- Pre-built workflow templates
- Custom template creation
- Template categories (Data Processing, Communication, Analysis, Automation)
- One-tap template deployment

### 📊 Real-time Monitoring
- Live agent execution dashboard
- Performance metrics and analytics
- Error tracking and logging
- Execution history

### 🔧 OpenClaw Integration
- Direct API integration with OpenClaw platform
- Agent deployment and management
- Real-time status updates
- Configuration synchronization

## Tech Stack

- **Framework**: React Native (Expo)
- **Navigation**: React Navigation v6
- **State Management**: Zustand
- **UI Components**: React Native Paper
- **Storage**: AsyncStorage
- **API Client**: Axios
- **Graphics**: React Native SVG

## Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Studio (for emulators)
- Expo Go app on physical device (optional)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/wuweillove/agentforge-mobile.git
   cd agentforge-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Create a `.env` file in the root directory:
   ```env
   OPENCLAW_API_URL=https://api.openclaw.io
   OPENCLAW_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

## Running the App

### iOS Simulator
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

### Expo Go (Physical Device)
1. Install Expo Go from App Store or Google Play
2. Scan the QR code from the terminal

### Web Browser
```bash
npm run web
```

## Project Structure

```
agentforge-mobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── WorkflowCanvas.js     # Main canvas for workflow building
│   │   ├── NodePalette.js        # Node selection palette
│   │   ├── AgentNode.js          # Individual workflow node
│   │   ├── TemplateCard.js       # Template display card
│   │   └── DashboardMetrics.js   # Monitoring metrics
│   ├── screens/             # App screens
│   │   ├── HomeScreen.js         # Dashboard home
│   │   ├── WorkflowBuilderScreen.js  # Workflow editor
│   │   ├── TemplatesScreen.js    # Template library
│   │   ├── MonitorScreen.js      # Agent monitoring
│   │   └── SettingsScreen.js     # App settings
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.js       # Main navigator
│   ├── services/            # API and data services
│   │   ├── OpenClawAPI.js        # OpenClaw API client
│   │   └── StorageService.js     # Local storage
│   ├── store/               # State management
│   │   └── workflowStore.js      # Workflow state
│   └── utils/               # Utility functions
│       ├── constants.js          # App constants
│       └── helpers.js            # Helper functions
├── assets/                  # Images and icons
├── App.js                   # App entry point
├── app.json                 # Expo configuration
└── package.json             # Dependencies
```

## Usage Guide

### Creating a Workflow

1. **Navigate to Workflow Builder**
   - Tap the "Workflow" tab or "New Workflow" button

2. **Add Nodes**
   - Tap on a node type in the palette
   - Tap on the canvas to place the node
   - Configure node properties

3. **Connect Nodes**
   - Drag from one node's output to another's input
   - Connections validate automatically

4. **Save and Deploy**
   - Tap "Save" to store locally
   - Tap "Deploy" to push to OpenClaw

### Using Templates

1. Go to the "Templates" tab
2. Browse available templates by category
3. Tap a template to preview
4. Tap "Use Template" to create a new workflow
5. Customize as needed

### Monitoring Agents

1. Navigate to "Monitor" tab
2. View active agents and their status
3. Tap an agent for detailed metrics
4. Check execution logs and errors

## API Configuration

The app connects to OpenClaw API for agent management. Configure in `src/services/OpenClawAPI.js`:

```javascript
const API_BASE_URL = 'https://api.openclaw.io/v1';
const API_KEY = 'your-api-key';
```

## Building for Production

### Create production build
```bash
expo build:android
expo build:ios
```

### Using EAS Build (Recommended)
```bash
npm install -g eas-cli
eas login
eas build --platform android
eas build --platform ios
```

## Testing

```bash
npm test
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Roadmap

- [ ] Multi-user collaboration
- [ ] Cloud workflow sync
- [ ] Advanced node types (ML models, webhooks)
- [ ] Workflow versioning
- [ ] Export/import workflows
- [ ] Dark/light theme toggle
- [ ] Offline mode with sync
- [ ] Widget support
- [ ] Voice commands
- [ ] AR workflow visualization

## Troubleshooting

### Common Issues

**Metro bundler not starting**
```bash
npm start -- --reset-cache
```

**iOS build fails**
```bash
cd ios && pod install && cd ..
```

**Android build fails**
```bash
cd android && ./gradlew clean && cd ..
```

## License

MIT License - See LICENSE file for details

## Support

- 📧 Email: support@agentforge.io
- 🐛 Issues: [GitHub Issues](https://github.com/wuweillove/agentforge-mobile/issues)
- 📖 Docs: [Documentation](https://docs.agentforge.io)

## Acknowledgments

- OpenClaw platform for agent orchestration
- React Native community
- Expo team for excellent tooling

---

**Built with ❤️ by Sebastian Llovera Studio**
