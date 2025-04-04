# Domain Swap - Development Guidelines

## Build Commands
- `npm run dev` - Development mode with watch
- `npm run build` - Build the extension for production
- `npm run icons` - Generate themed icons
- `npm test` - Run all tests
- `npm test -- path/to/test` - Run a specific test
- `npm run lint` - Run ESLint to check code quality

## Code Style
- **JS Style**: Use modern ES6+, async/await for asynchronous operations
- **Indentation**: 2 spaces
- **Quotes**: Double quotes for strings
- **Semicolons**: Required at end of statements
- **Functions**: Prefer arrow functions for callbacks
- **Variables**: Use `const` by default, `let` when necessary
- **Error Handling**: Use try/catch blocks for storage operations
- **Naming**: camelCase for variables/functions, PascalCase for classes

## Extension-specific Guidelines
- Keep DOM manipulation within event listeners
- Use browser.storage.local for persisting data
- Add proper error handling for all storage operations
- Follow Firefox extension manifest v2 format
- Use async/await for browser API calls
- Maintain theme support for all UI elements
- Document complex regex patterns

## Project Structure
- `/src` - Extension source code
- `/assets` - Original SVG icons
- `/scripts` - Build and utility scripts