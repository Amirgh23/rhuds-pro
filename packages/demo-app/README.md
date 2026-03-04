# RHUDS Demo Application

Interactive demonstration and documentation platform for RHUDS components.

## Features

### 🎮 Showcase
- View all 49 components organized by category
- See components in action with real examples
- Interactive component demonstrations

### 🎯 Playground
- Test components with customizable properties
- Real-time code preview
- Adjust props and see instant results
- Copy code snippets

### 📚 Documentation
- Complete API reference
- Component props tables
- Usage examples
- Best practices

## Running the Demo

```bash
# From the demo-app directory
npm run dev

# Or from the root
npm run dev --workspace=@rhuds/demo-app
```

The demo will be available at http://localhost:3001

## Navigation

- **Showcase**: Browse all components by category
- **Playground**: Interactive component testing
- **Documentation**: Complete API reference and guides

## Component Categories

1. **Basic** (5 components)
   - Text, Button, Icon, Input, Select

2. **Layout** (3 components)
   - Container, Grid, Stack

3. **Form** (5 components)
   - Checkbox, Radio, RadioGroup, Switch, Slider

4. **Navigation** (6 components)
   - Navbar, Sidebar, Breadcrumb, Tabs, Menu, Pagination

5. **Data Display** (3 components)
   - Table, DataGrid, Tree

6. **Feedback** (3 components)
   - Modal, Dialog, Notification

7. **Utility** (3 components)
   - Tooltip, Popover, Dropdown

8. **Advanced** (5 components)
   - Carousel, Accordion, Stepper, CodeEditor, RichTextEditor

9. **Specialized** (4 components)
   - Slider, DatePicker, ColorPicker, FileUpload

10. **Visualization** (1 component)
    - Chart

11. **Backgrounds** (8 effects)
    - GridLines, Particles, Nebula, Stars, etc.

12. **Frames** (6 variants)
    - Hexagon, Pentagon, Corners, etc.

## Development

### Adding New Components to Showcase

Edit `src/App.tsx` and add your component to the appropriate tab section.

### Adding to Playground

1. Create state for component props
2. Add ComponentPlayground wrapper
3. Include preview and controls sections

### Adding Documentation

1. Add markdown content to `docs/` directory
2. Update `src/pages/DocsPage.tsx` with new doc entry
3. Add to sidebar navigation

## Technologies

- React 18
- TypeScript
- Vite
- RHUDS Core & Components

## License

MIT
