# IssueProxyBot Color Palette

This document defines the official color palette for IssueProxyBot. These colors are derived from the logo and should be used consistently.

## Primary Colors

These are our main colors based on the logo. Use them for primary actions, navigation elements, and brand identification.

| Color Name    | Hex Code  | RGB                |                        Preview                        |
| ------------- | --------- | ------------------ | :---------------------------------------------------: |
| Azure Blue    | `#0366d6` | `rgb(3, 102, 214)` | ![#0366d6](https://placehold.co/10/0366D6/0366D6.png) |
| Emerald Green | `#28a745` | `rgb(40, 167, 69)` | ![#28a745](https://placehold.co/10/28A745/28A745.png) |
| Charcoal      | `#24292e` | `rgb(36, 41, 46)`  | ![#24292e](https://placehold.co/10/24292E/24292E.png) |

## Secondary Colors

These colors complement the primary palette and should be used for accents, highlights, and secondary elements.

| Color Name                      | Hex Code  | RGB                 |                        Preview                        |
| ------------------------------- | --------- | ------------------- | :---------------------------------------------------: |
| Crimson (Issue Red)             | `#d73a49` | `rgb(215, 58, 73)`  | ![#d73a49](https://placehold.co/10/d73a49/d73a49.png) |
| Tangerine (Notification Orange) | `#f66a0a` | `rgb(246, 106, 10)` | ![#f66a0a](https://placehold.co/10/f66a0a/f66a0a.png) |
| Amethyst (Pull Request Purple)  | `#6f42c1` | `rgb(111, 66, 193)` | ![#6f42c1](https://placehold.co/10/6f42c1/6f42c1.png) |

## Neutral Colors

These grayscale colors should be used for text, backgrounds, and UI elements.

| Color Name               | Hex Code  | RGB                  |                        Preview                        |
| ------------------------ | --------- | -------------------- | :---------------------------------------------------: |
| Anthracite (GitHub Dark) | `#24292e` | `rgb(36, 41, 46)`    | ![#24292e](https://placehold.co/10/24292e/24292e.png) |
| Slate Gray (Medium Gray) | `#586069` | `rgb(88, 96, 105)`   | ![#586069](https://placehold.co/10/586069/586069.png) |
| Ghost White (Light Gray) | `#f6f8fa` | `rgb(246, 248, 250)` | ![#f6f8fa](https://placehold.co/10/f6f8fa/f6f8fa.png) |
| Platinum (Border Gray)   | `#e1e4e8` | `rgb(225, 228, 232)` | ![#e1e4e8](https://placehold.co/10/e1e4e8/e1e4e8.png) |
| Pure White               | `#ffffff` | `rgb(255, 255, 255)` | ![#ffffff](https://placehold.co/10/ffffff/ffffff.png) |

## Semantic Colors

These colors convey specific meanings and should be used consistently for their respective purposes.

| Color Name    | Hex Code  | RGB                 |                        Preview                        | Purpose                              |
| ------------- | --------- | ------------------- | :---------------------------------------------------: | ------------------------------------ |
| Emerald Green | `#28A745` | `rgb(40, 167, 69)`  | ![#28A745](https://placehold.co/10/28A745/28A745.png) | Successful operations, confirmations |
| Amber         | `#f9C513` | `rgb(249, 197, 19)` | ![#f9C513](https://placehold.co/10/f9C513/f9C513.png) | Warnings, attention needed           |
| Crimson       | `#D73A49` | `rgb(215, 58, 73)`  | ![#D73A49](https://placehold.co/10/D73A49/D73A49.png) | Errors, failed operations            |
| Azure Blue    | `#0366D6` | `rgb(3, 102, 214)`  | ![#0366D6](https://placehold.co/10/0366D6/0366D6.png) | Informational messages               |

## Usage Guidelines

### Application Interface

- Use the Azure Blue for primary actions and interactive elements
- Use Emerald Green for success states and confirmation actions
- Use Charcoal for headers and important UI elements
- Use neutral colors for backgrounds and text content
- Apply semantic colors consistently to convey status information

### Accessibility

- Ensure text has sufficient contrast against its background according to WCAG 2.1 AA standards
- For text on colored backgrounds, use a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text
- Use the WebAIM contrast checker to verify contrast ratios: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Example Usage

```css
/* Primary button */
.btn-primary {
  background-color: #0366d6;
  color: #ffffff;
}

/* Secondary button */
.btn-secondary {
  background-color: #24292e;
  color: #ffffff;
}

/* Success message */
.alert-success {
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
  border: 1px solid rgba(40, 167, 69, 0.2);
}

/* Error message */
.alert-error {
  background-color: rgba(215, 58, 73, 0.1);
  color: #d73a49;
  border: 1px solid rgba(215, 58, 73, 0.2);
}
```
