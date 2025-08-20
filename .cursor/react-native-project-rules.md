# React Native Project Rules & Guidelines

## Project Overview

- **Project Name**: Learner App
- **Framework**: React Native 0.74.2
- **UI Library**: UI Kitten with Eva Design System
- **Navigation**: React Navigation v6
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Yup validation

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
├── context/        # React Context providers
├── Routes/         # Navigation configuration
├── assets/         # Images, fonts, and static files
├── utils/          # Utility functions and helpers
└── App.js          # Main application component
```

## 🎯 Coding Standards

### File Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.js`, `LoginScreen.js`)
- **Utilities**: camelCase (e.g., `apiHelper.js`, `dateUtils.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.js`, `useApi.js`)

### Component Structure

```javascript
// 1. Imports (React, third-party, local)
import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@ui-kitten/components';

// 2. PropTypes (if using)
import PropTypes from 'prop-types';

// 3. Component definition
const MyComponent = ({ title, onPress }) => {
  // 4. Hooks and state
  const [loading, setLoading] = useState(false);

  // 5. Event handlers
  const handlePress = () => {
    // Implementation
  };

  // 6. Render method
  return (
    <View>
      <Text>{title}</Text>
      <Button onPress={handlePress}>Click me</Button>
    </View>
  );
};

// 7. PropTypes
MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

// 8. Default props
MyComponent.defaultProps = {
  title: 'Default Title',
};

export default MyComponent;
```

### Styling Guidelines

- Use UI Kitten components and themes when possible
- Follow Eva Design System principles
- Use consistent spacing and typography
- Implement responsive design for different screen sizes
- Use theme colors from UI Kitten instead of hardcoded values

### State Management

- Use React Context for global state
- Keep component state local when possible
- Use `useReducer` for complex state logic
- Implement proper error boundaries

## 🔧 Development Workflow

### Environment Setup

- **Development**: `.env.dev`
- **UAT**: `.env.uat`
- **Production**: `.env.prod`

### Available Scripts

```bash
# Development
npm run android:dev      # Build and run dev APK
npm run android:uat      # Build and run UAT APK
npm run android:prod     # Build and run production APK

# Debug builds
npm run android:dev_debug_apk
npm run android:uat_debug_apk
npm run android:prod_debug_apk

# Release builds
npm run android:dev_release_apk
npm run android:uat_release_apk
npm run android:prod_release_apk

# Signed bundles
npm run android:dev_signed_bundle_aab
npm run android:uat_signed_bundle_aab
npm run android:prod_signed_bundle_aab

# Code quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run prettier         # Format code with Prettier
npm run prettier-check   # Check code formatting
```

## 📱 UI/UX Guidelines

### UI Kitten Integration

- Use UI Kitten components consistently
- Follow Eva Design System patterns
- Implement proper theming with light/dark mode support
- Use Eva icons for consistency

### Navigation

- Use React Navigation v6
- Implement proper navigation patterns
- Handle back navigation appropriately
- Use navigation lifecycle methods

### Forms

- Use React Hook Form for form management
- Implement Yup validation schemas
- Provide clear error messages
- Use proper input types and accessibility

## 🔒 Security & Performance

### Security

- Never commit sensitive data to version control
- Use environment variables for API keys
- Implement proper input validation
- Sanitize user inputs
- Use secure storage for sensitive data

### Performance

- Implement proper image optimization
- Use React Native Fast Image for better image performance
- Implement lazy loading where appropriate
- Optimize bundle size
- Use proper list virtualization for large datasets

## 🧪 Testing Guidelines

### Unit Testing

- Write tests for utility functions
- Test component logic with React Testing Library
- Mock external dependencies
- Maintain good test coverage

### Integration Testing

- Test navigation flows
- Test API integrations
- Test form submissions
- Test error scenarios

## 📦 Dependencies Management

### Adding New Dependencies

- Check for React Native compatibility
- Verify license compatibility
- Consider bundle size impact
- Test thoroughly before adding

### Key Dependencies

- **UI**: UI Kitten, Eva Design System
- **Navigation**: React Navigation
- **Forms**: React Hook Form, Yup
- **Networking**: Axios
- **Storage**: AsyncStorage, SQLite
- **Images**: React Native Fast Image
- **Icons**: Eva Icons, React Native Vector Icons

## 🚀 Deployment

### Android Build Process

1. Set appropriate environment file
2. Clean previous builds
3. Bundle assets
4. Build APK/AAB
5. Sign with release keystore (for production)

### Build Variants

- **Debug**: Development builds with debugging enabled
- **Release**: Production builds with optimizations
- **Signed**: Release builds with proper signing

## 📋 Code Review Checklist

### Before Submitting PR

- [ ] Code follows naming conventions
- [ ] Components are properly structured
- [ ] UI Kitten components used appropriately
- [ ] Proper error handling implemented
- [ ] No console.log statements in production code
- [ ] Environment variables properly configured
- [ ] Tests pass
- [ ] Linting passes
- [ ] Prettier formatting applied
- [ ] No sensitive data in code

### Review Points

- Code readability and maintainability
- Performance considerations
- Security implications
- UI/UX consistency
- Error handling
- Accessibility compliance

## 🐛 Debugging Guidelines

### Common Issues

- Metro bundler cache issues
- Android build problems
- Navigation state issues
- Memory leaks
- Performance bottlenecks

### Debug Tools

- React Native Debugger
- Flipper
- Chrome DevTools
- Network logger
- Performance profiler

## 📚 Resources

### Documentation

- [React Native Documentation](https://reactnative.dev/)
- [UI Kitten Documentation](https://akveo.github.io/react-native-ui-kitten/)
- [Eva Design System](https://eva.design/)
- [React Navigation](https://reactnavigation.org/)

### Best Practices

- Follow React Native performance guidelines
- Implement proper error boundaries
- Use TypeScript for better type safety
- Maintain consistent code style
- Write self-documenting code

---

**Last Updated**: $(date)
**Version**: 1.0.0
