# Step 08: Frontend Setup (Mokshit's Workspace)

## Objective

Initialize the frontend with a modern, clinical design using Tailwind CSS.

## Actions

1.  **Create `frontend/index.html`**:

    - Set up HTML5 boilerplate.
    - Include Tailwind CSS via CDN (for speed) or setup build process.
    - Define the color palette: Primary Blue (#2D5BFF), Background (#F5F7FA).

2.  **Create `frontend/styles.css`**:

    - Add custom styles for animations (e.g., the "pulse" effect for Red alerts).

3.  **Structure**:
    - Header: "DeepCare AI".
    - Main Container: Grid layout.
      - Left Column: Chat/Transcript.
      - Right Column: Dashboard/Risk Analysis.

## Modern UI Enhancements Implemented

### Animation Library

- **Framer Motion**: Smooth page transitions and component animations
- Installed via: `npm install framer-motion`
- Used for: Card animations, collapsible sections, page transitions

### Icon System

- **Lucide React**: Modern, consistent icon library
- Installed via: `npm install lucide-react`
- Icons used throughout for visual hierarchy

### Design System Features

- **Gradient Branding**: Purple-to-primary gradient for logo, buttons, and accents
- **Glassmorphism**: Semi-transparent cards with backdrop blur effect
- **Custom Scrollbars**: Consistent scrollbar styling with hover effects
- **Responsive Layouts**: Grid systems that adapt to all screen sizes

### Custom CSS Utilities (in `index.css`)

```css
/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
```

### Color System

- CSS custom properties for theming
- Consistent color tokens for primary, accent, border, background
- Support for light/dark mode (via Tailwind dark: prefix)

## Verification

- Open `frontend/index.html` in a browser.
- Verify the layout looks clean and the Tailwind classes are working.
- Check that animations are smooth and icons render correctly.
