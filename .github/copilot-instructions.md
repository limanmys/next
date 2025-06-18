# GitHub Copilot Instructions for Liman Next.js Project

## Project Overview

This is Liman Central Management System - a Next.js based server management platform with extension system, user management, and multi-language support.

## Technology Stack

- **Framework**: Next.js 15.2.4 with React 19.0.0
- **Language**: TypeScript
- **Styling**: TailwindCSS 4.0.15
- **UI Components**: Radix UI + Shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **Internationalization**: react-i18next (tr, en, de)
- **Package Manager**: pnpm
- **State Management**: React Context API

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui base components
│   ├── _layout/        # Layout components
│   ├── navigation/     # Navigation components
│   ├── settings/       # Settings-specific components
│   └── server/         # Server management components
├── pages/              # Next.js pages
├── types/              # TypeScript type definitions
├── services/           # API services
├── lib/                # Utility functions
├── hooks/              # Custom React hooks
└── styles/             # Global styles
```

## Coding Guidelines

### TypeScript

- Always use TypeScript for all files
- Define interfaces in `src/types/` directory
- Use strict typing, avoid `any` type
- Export interfaces with `I` prefix (e.g., `IUser`, `IServer`)

### Components

- Use functional components with hooks
- Import UI components from `@/components/ui/`
- Use `cn()` utility for conditional classes
- Follow Shadcn/ui patterns for new components

### Forms

- Use React Hook Form with Zod validation
- Define schemas with proper error messages
- Use `Form` components from `@/components/form/form`
- Handle form errors with `setFormErrors` utility

### Internationalization

- Use `useTranslation` hook for all text
- Translation keys should be organized by namespaces
- Supported languages: Turkish (tr), English (en), German (de)
- Translation files located in `public/locales/`

### API Integration

- Use `http` service from `@/services`
- Handle loading states properly
- Use `useToast` for user feedback
- Implement proper error handling
- API uses a Laravel 12 backend with JSON responses

### Styling

- Use TailwindCSS classes
- Follow existing color scheme and spacing
- Use CSS variables for theming
- Responsive design with mobile-first approach

## Common Patterns

### Page Layout

```tsx
import { NextPageWithLayout } from "@/pages/_app"

import Layout from "@/components/_layout/app_layout"

const PageName: NextPageWithLayout = () => {
  return (
    <>
      <PageHeader title={t("page.title")} description={t("page.description")} />
      <div className="p-8 pt-0">{/* Page content */}</div>
    </>
  )
}

PageName.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}
```

### Data Tables

```tsx
import DataTable from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"

const columns: DivergentColumn<TData, string>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("name")} />
    ),
    title: t("name"),
  },
]
```

### Forms with Validation

```tsx
const formSchema = z.object({
  name: z.string().min(1, t("validation.required")),
})

const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  defaultValues: { name: "" },
})

const handleSubmit = (data: z.infer<typeof formSchema>) => {
  // API call
}
```

## File Naming Conventions

- Components: PascalCase (e.g., `UserSettings.tsx`)
- Pages: snake-case (e.g., `user_settings.tsx`)
- Types: camelCase with I prefix (e.g., `IUserSettings`)
- Hooks: camelCase with use prefix (e.g., `useUserData`)

## Key Dependencies

- `@radix-ui/react-*`: Base UI primitives
- `@tanstack/react-table`: Data tables
- `react-hook-form`: Form handling
- `zod`: Schema validation
- `lucide-react`: Icons
- `class-variance-authority`: Component variants
- `tailwind-merge`: Class merging utility

## Development Practices

- Use absolute imports with `@/` prefix
- Implement proper loading states
- Handle errors gracefully with toast notifications
- Use semantic HTML elements
- Ensure components are accessible
- Follow React best practices for performance
- Use TypeScript strict mode
- Never import anything from radix-ui directly, always use shadcn/ui components

## Testing Considerations

- Components should be testable in isolation
- Use proper data attributes for testing
- Mock API calls appropriately
- Test form validation and error states

## Architecture Notes

- Server-side rendered pages with client-side interactivity
- Context-based state management for global state
- Modular component architecture
- Type-safe API integration
- Extensible plugin system for server management

When suggesting code, always consider:

1. TypeScript type safety
2. Internationalization requirements
3. Responsive design
4. Accessibility standards
5. Performance optimization
6. Error handling
7. Consistent code style with existing codebase
