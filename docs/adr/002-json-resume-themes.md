# ADR 002: JSON Resume Theme Rendering

## Status
Accepted

## Context
We need to render JSON Resume data as formatted CVs in our React frontend. Users should be able to choose from multiple themes/templates and see a real-time preview of their CV.

### Options Considered

1. **resumed CLI (Server-side HTML generation)**
   - Pros: Official JSON Resume tool, supports many themes
   - Cons: Requires server-side rendering, adds latency, complex infrastructure

2. **jsonresume-theme-* npm packages (Direct rendering)**
   - Pros: Native Node.js packages, can generate HTML from JSON Resume
   - Cons: Most themes use Handlebars templates, not React-friendly, would need iframe or dangerouslySetInnerHTML

3. **React-based themes**
   - Pros: Native React components, easy state management
   - Cons: Very few exist, limited selection

4. **Custom React components**
   - Pros: Full control over styling, matches our design system, no external dependencies
   - Cons: More initial development time, need to create multiple themes

## Decision
We will implement **Custom React components** for CV rendering.

### Rationale
1. **Design System Integration**: Custom components can use our Tailwind CSS design system from `styles.json`, ensuring visual consistency
2. **Real-time Preview**: React components enable instant updates as users edit their CV
3. **PDF Export**: Custom components give us full control over print-friendly CSS
4. **Performance**: No iframe overhead or external template parsing
5. **Maintainability**: All code in our codebase, no dependency on external theme updates

### Themes to Implement
We will create 3 initial themes:
1. **Professional** - Clean, traditional layout suitable for corporate roles
2. **Modern** - Contemporary design with visual flair
3. **Minimal** - Simple, content-focused layout

## Consequences

### Positive
- Complete control over rendering and styling
- Seamless integration with design system
- Better performance for real-time preview
- Easier PDF export implementation

### Negative
- More initial development effort
- Limited to our implemented themes (users can't use community JSON Resume themes)
- Must maintain theme code ourselves

## Implementation Notes
- Each theme is a React component that receives JSON Resume data as props
- Themes use Tailwind CSS with print-specific styles
- Components are located in `frontend/src/components/cv/themes/`
- Theme registry manages available themes and their metadata
