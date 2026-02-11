# Assets Directory

This directory contains all the image assets for the AgentForge mobile app.

## Required Assets

### App Icons
- `icon.png` (1024x1024) - Main app icon
- `adaptive-icon.png` (1024x1024) - Android adaptive icon
- `favicon.png` (48x48) - Web favicon

### Splash Screen
- `splash.png` (2048x2048) - App splash screen

## Asset Guidelines

### Icon Requirements
- Format: PNG with transparency
- Size: 1024x1024 pixels
- Design: Should work on both light and dark backgrounds
- Style: Modern, minimalist, representing AI/automation

### Color Scheme
- Primary: #6C5CE7 (Purple)
- Secondary: #00B894 (Green)
- Accent: #FDCB6E (Yellow)
- Background: #1a1a2e (Dark Blue)

## Generating Assets

You can use tools like:
- Figma/Sketch for design
- [App Icon Generator](https://appicon.co/) for generating all sizes
- [Splash Screen Generator](https://apetools.webprofusion.com/app/#/tools/imagegorilla) for splash screens

## Adding New Assets

1. Add image files to this directory
2. Update `app.json` if changing app icons
3. For SVG icons, use `react-native-svg` components in `/src/components/`
