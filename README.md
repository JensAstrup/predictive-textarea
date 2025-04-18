# Predictive Textarea

A rich textarea component with AI-powered content prediction for React applications. It enables predictive text suggestions as users type, similar to GitHub Copilot's ghost text feature.

## Features

- 🤖 AI-powered content predictions
- 📱 Responsive design
- 🎨 Customizable styling
- 🧩 Easy integration with form libraries
- ♿ Accessible design
- 💻 Framework-agnostic (works with or without shadcn/ui)

## Installation

```bash
npm install predictive-textarea
# or
yarn add predictive-textarea
# or
pnpm add predictive-textarea
```

## Dependencies

The component has minimal dependencies:

- **React**: As this is a React component
- **Tailwind CSS**: For styling (or you can provide custom classes)
- **uuid**: Used internally for prediction ID generation

### Peer Dependencies

While not required, these are listed as peer dependencies for better integration:

```json
{
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "tailwindcss": "^3.0.0"
  }
}
```

## Demo

To run the demo locally:

```bash
# Install dependencies
yarn install

# Run the demo
yarn demo
```

The demo shows different examples of the PredictiveTextarea component:
- Basic usage with content prediction
- Disabled state
- Pre-filled content

Press Tab to accept suggestions when they appear.

## Usage

```tsx
import React from 'react';
import { PredictiveTextarea } from 'predictive-textarea';

// Your content prediction function
// This should connect to your AI service that generates predictions
async function getContentPrediction(text: string): Promise<string> {
  // Example using OpenAI API
  // Replace with your actual implementation
  const response = await fetch('your-prediction-api-endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  
  const data = await response.json();
  return data.prediction || '';
}

function MyForm() {
  return (
    <div className="my-form">
      <label htmlFor="content">Content:</label>
      <PredictiveTextarea
        name="content"
        getContentPredictionFn={getContentPrediction}
        debounceTime={300}
        placeholder="Start typing..."
      />
      <button type="submit">Submit</button>
    </div>
  );
}

export default MyForm;
```

## Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `getContentPredictionFn` | `(text: string, abortSignal?: AbortSignal) => string \| Promise<string>` | Yes | Function that returns prediction text based on user input |
| `debounceTime` | `number` | No | Time to wait after typing stops before fetching predictions (ms) |
| `disabled` | `boolean` | No | Disables the textarea |
| `placeholder` | `string` | No | Placeholder text |
| `value` | `string` | No | Initial value |
| `className` | `string` | No | Additional CSS classes |
| `...props` | `React.HTMLAttributes<HTMLDivElement>` | No | Any other props are passed to the underlying div |

## Advanced Usage

The package also exports utility components and hooks for advanced customization:

```tsx
import {
  PredictiveTextarea,
  ContentPrediction,
  useCaretPosition,
  useContentPrediction,
  // Types
  type PredictiveTextareaProps,
  type GetCompletionContentPredictionFn,
  // Utils
  cn,
  getTextUptilCaretInElement,
  isCaretAtLineEnd
} from 'predictive-textarea';
```

## Styling

The component uses utility classes that are compatible with Tailwind CSS by default.

To customize the appearance, you can provide a `className` prop:

```tsx
<PredictiveTextarea
  getContentPredictionFn={getContentPrediction}
  className="min-h-[200px] font-mono bg-gray-100 dark:bg-gray-800"
/>
```

### Integration with UI Libraries

This component is designed to be framework-agnostic and can be integrated with any UI library. The component uses Tailwind CSS conventions that make it easy to customize:

- It uses standard Tailwind CSS class naming conventions
- It follows common styling patterns for focus states, borders, and other UI elements
- The demo showcases integration with various UI component structures and themes

If you're using a UI library in your project, this component can be styled to match your theme's colors and styles automatically.

## License

MIT

## Attribution

This component was inspired by and adapted from [react-ghost-text](https://github.com/agdhruv/react-ghost-text).
