# Assets Directory

This directory contains all static assets for the AgentForge mobile app.

## Directory Structure

```
assets/
├── icon.png              # App icon (1024x1024)
├── splash.png            # Splash screen (1242x2436)
├── adaptive-icon.png     # Android adaptive icon (1024x1024)
├── favicon.png           # Web favicon (48x48)
└── images/              # Additional images
    ├── onboarding/
    ├── illustrations/
    └── icons/
```

## Asset Guidelines

### App Icon
- **Size**: 1024x1024 px
- **Format**: PNG with transparency
- **Design**: Simple, recognizable logo on dark background

### Splash Screen
- **Size**: 1242x2436 px (iPhone 12 Pro Max)
- **Format**: PNG
- **Background**: #1a1a2e (matches app theme)

### Adaptive Icon (Android)
- **Size**: 1024x1024 px
- **Safe Zone**: 66% diameter circle in center
- **Format**: PNG with transparency

### Images
- Use optimized PNG or WebP format
- Keep file sizes under 200KB when possible
- Use SVG for icons and simple graphics

## Adding New Assets

1. Place assets in appropriate subdirectory
2. Use descriptive, lowercase names with hyphens
3. Document usage in this README
4. Update `app.json` if needed for app icons/splash

## Icon Sets

The app uses React Native Vector Icons with the following sets:
- MaterialCommunityIcons (primary)
- Ionicons (secondary)

No need to add icon files manually for these.
