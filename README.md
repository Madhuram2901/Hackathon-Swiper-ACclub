# EventSwipe - Modular Architecture

EventSwipe is a modern event discovery application built with a modular, maintainable architecture. The application has been refactored from a monolithic HTML file into separate, well-organized modules.

## 📁 Project Structure

```
Hackathon-Swiper/
├── index.html          # Main HTML structure
├── styles.css          # All CSS styles and animations
├── js/                 # JavaScript modules
│   ├── data.js         # Data management and mock events
│   ├── auth.js         # Authentication and user management
│   ├── events.js       # Event cards and swiping functionality
│   ├── ui.js           # UI management and navigation
│   └── app.js          # Main application coordinator
└── README.md           # This file
```

## 🏗️ Architecture Overview

### 1. **HTML Structure** (`index.html`)
- Clean, semantic HTML markup
- Links to external CSS and JavaScript files
- No inline styles or scripts

### 2. **CSS Styles** (`styles.css`)
- All styling in one organized file
- CSS custom properties (variables) for consistent theming
- Responsive design with media queries
- Smooth animations and transitions

### 3. **JavaScript Modules**

#### **Data Manager** (`js/data.js`)
- Mock event data
- Data utility functions
- Search and filtering capabilities
- Date formatting utilities

#### **Authentication Manager** (`js/auth.js`)
- User login/signup functionality
- Session management with localStorage
- Authentication state handling
- User data persistence

#### **Events Manager** (`js/events.js`)
- Event card creation and rendering
- Touch/mouse swipe handling
- Shortlist management
- Card animations and interactions

#### **UI Manager** (`js/ui.js`)
- Navigation and view switching
- Responsive design handling
- Loading states and error handling
- Notification system

#### **Main App** (`js/app.js`)
- Module coordination and communication
- Global error handling
- Performance monitoring
- Application state management

## 🔧 Module Communication

Modules communicate through a well-defined interface:

- **Global Scope**: Each module exposes its functionality through `window.ModuleName`
- **Event-Based**: Modules can listen to and trigger events
- **Dependency Order**: Scripts are loaded in the correct order to ensure dependencies are available

## 🚀 Getting Started

1. **Open the application**:
   - Simply open `index.html` in a modern web browser
   - No build process or server required

2. **Development workflow**:
   - Edit individual modules in the `js/` folder
   - Modify styles in `styles.css`
   - Update HTML structure in `index.html`

3. **Testing**:
   - The app works offline
   - Test swipe functionality on touch devices
   - Check responsive design at different screen sizes

## 🎯 Key Features

- **Swipe Interface**: Intuitive card swiping for event discovery
- **User Authentication**: Mock login/signup system
- **Shortlist Management**: Save and manage favorite events
- **Responsive Design**: Works on desktop and mobile devices
- **Offline Support**: Basic offline functionality with localStorage
- **Modular Code**: Easy to maintain and extend

## 🔍 Development Tips

### Adding New Features
1. **New Module**: Create a new file in the `js/` folder
2. **Add to HTML**: Include the script tag in the correct order
3. **Register Module**: Add it to the main app's module list

### Modifying Existing Features
1. **UI Changes**: Edit `styles.css` for visual modifications
2. **Logic Changes**: Modify the appropriate module in `js/`
3. **Data Changes**: Update mock data in `data.js`

### Debugging
- Use browser developer tools
- Check console for module initialization messages
- Use `window.getAppStatus()` to check application state

## 📱 Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: iOS Safari, Chrome Mobile
- **Features**: ES6 classes, localStorage, CSS Grid, Flexbox

## 🔮 Future Enhancements

The modular architecture makes it easy to add:

- **Real API Integration**: Replace mock data with live endpoints
- **Additional Views**: New discovery modes or event categories
- **Advanced Features**: Push notifications, social sharing, etc.
- **Performance Optimizations**: Lazy loading, caching strategies
- **Testing Framework**: Unit tests for individual modules

## 🐛 Troubleshooting

### Common Issues
1. **Scripts not loading**: Check file paths and script order in HTML
2. **Styles not applying**: Ensure `styles.css` is in the same directory
3. **Touch not working**: Test on a touch device or enable touch simulation in dev tools

### Debug Commands
```javascript
// Check app status
window.getAppStatus()

// Check individual modules
window.DataManager
window.AuthManager
window.EventManager
window.UIManager
window.EventSwipeApp
```

## 📄 License

This project is open source and available under the MIT License.

---

**Happy Coding! 🎉**
