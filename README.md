# KesiList

A cross-platform mobile shopping list application built with React Native, featuring offline-first architecture, cloud synchronization, and real-time collaboration.

## Overview

KesiList is a modern shopping list application designed with scalability, maintainability, and user experience in mind. The application enables users to create, manage, and share shopping lists across devices while maintaining full functionality offline.

## Technical Stack

### Core Technologies
- **React Native 0.73.6** - Cross-platform mobile framework
- **TypeScript** - Type-safe development with enhanced IDE support
- **React 18.2** - Latest React features including concurrent rendering
- **Node.js ≥18** - Runtime environment

### State Management & Navigation
- **Redux Toolkit** - Centralized state management with minimal boilerplate
- **React Navigation v6** - Type-safe navigation with native stack navigator
- **Redux Thunk** - Asynchronous action handling

### Data & Persistence
- **WatermelonDB** - High-performance reactive SQLite database for local-first architecture
- **AWS Amplify v6** - Backend-as-a-Service for authentication and data synchronization
- **AsyncStorage** - Key-value storage for app settings

### UI & Theming
- **React Native Paper v5** - Material Design component library
- **Custom Theme System** - Dark/light mode support with Material Design 3
- **React Native Vector Icons** - Comprehensive icon library
- **Gesture Handler** - Native-driven gesture system

### Developer Experience
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **Babel Module Resolver** - Path aliasing for cleaner imports
- **Patch Package** - Maintaining custom package modifications

## Architecture

### Clean Architecture Principles

The application follows Clean Architecture principles with clear separation of concerns across multiple layers:

```
┌─────────────────────────────────────────┐
│          Presentation Layer             │
│   (Screens, Components, Redux)          │
├─────────────────────────────────────────┤
│           Service Layer                 │
│  (Business Logic, Use Cases)            │
├─────────────────────────────────────────┤
│          Repository Layer               │
│    (Data Access Abstraction)            │
├─────────────────────────────────────────┤
│           Data Sources                  │
│  (WatermelonDB, AWS Amplify, APIs)      │
└─────────────────────────────────────────┘
```

### Dependency Injection

The application implements a custom Dependency Injection container (`app/di/appComponent.ts`) that manages object creation and lifecycle:

```typescript
AppModule
  ├── Database Provider
  ├── Repository Providers
  │   ├── StoresRepository
  │   ├── ShoppingListRepository
  │   ├── ProductRepository
  │   ├── CategoryRepository
  │   ├── SettingsRepository
  │   └── AuthRepository
  └── Service Providers
      ├── StoresService
      ├── ShoppingListService
      ├── ProductService
      ├── AddStoreService
      └── GlobalSettingsService
```

This approach ensures:
- **Testability**: Easy to mock dependencies for unit testing
- **Maintainability**: Centralized dependency management
- **Flexibility**: Simple to swap implementations
- **Single Responsibility**: Each module has one clear purpose

### Repository Pattern

Data access is abstracted through repository interfaces, enabling the application to work with different data sources transparently:

- **DatabaseStoresRepository**: Manages shopping list metadata
- **DatabaseShoppingListRepository**: Handles shopping list items
- **DatabaseProductRepository**: Product catalog with autocomplete
- **DatabaseCategoryRepository**: Category management with color coding
- **AuthRepository**: User authentication state

### Offline-First Architecture

The application prioritizes local-first data access for instant responsiveness:

1. **Local Database (WatermelonDB)**
   - SQLite adapter with JSI for iOS (native performance)
   - Reactive queries for real-time UI updates
   - Optimized for mobile with lazy loading

2. **Cloud Synchronization (AWS Amplify)**
   - GraphQL API for flexible data fetching
   - Cognito User Pools for authentication
   - Automatic conflict resolution
   - Selective sync to minimize data transfer

3. **Sync Strategy**
   ```
   User Action → Local DB (Immediate) → UI Update
                        ↓
                   Background Sync → AWS Amplify
   ```

### Data Schema

**Local Schema (WatermelonDB)**:
- `shopping_lists` - List metadata (name, status, cloud sync ID)
- `shopping_list_items` - Items with product reference, quantity, category
- `products` - Product catalog for autocomplete
- `categories` - Color-coded categories for organization

**Cloud Schema (AWS Amplify)**:
- `List` - Shopping list with owner relationships
- `Item` - List items with detailed attributes
- `Person` - User profiles
- `PersonList` - Many-to-many relationship for list sharing

## Project Structure

```
kesi-goods/
├── app/
│   ├── api/              # AWS Amplify API integration
│   ├── assets/           # Images, fonts, static resources
│   ├── components/       # Reusable UI components
│   ├── database/         # WatermelonDB schema and models
│   ├── di/               # Dependency injection container
│   ├── i18n/             # Internationalization (en, es)
│   ├── model/            # Repository layer and domain models
│   ├── redux/            # Redux store configuration
│   ├── routes/           # Navigation configuration
│   ├── screens/          # Feature screens with Redux slices
│   │   ├── add-store/    # Create new shopping list
│   │   ├── stores/       # List overview
│   │   ├── shopping/     # Shopping list detail
│   │   ├── products/     # Product management
│   │   ├── login/        # Authentication
│   │   └── global-settings/ # App settings
│   ├── theme/            # Theme configuration (light/dark)
│   └── utils/            # Helper functions and utilities
├── amplify/              # AWS Amplify backend configuration
│   ├── auth/             # Cognito authentication
│   └── data/             # GraphQL schema
├── android/              # Android native code
├── ios/                  # iOS native code
└── App.tsx               # Application entry point
```

### Feature-Based Organization

Each feature screen follows a consistent structure:
- **Screen Component**: Main UI component
- **Redux Slice**: State management (actions, reducers, selectors)
- **Service**: Business logic and orchestration
- **Components**: Feature-specific sub-components
- **Types**: TypeScript interfaces and types

## Key Design Decisions

### 1. TypeScript Path Aliasing
Using `@/` prefix for absolute imports enhances code readability and maintainability:
```typescript
import { StoresRepository } from '@/model/storesRepository';
import { translate } from '@/i18n/translate';
```

### 2. Material Design 3
Implemented through React Native Paper with custom theming:
- Consistent design language across platforms
- Accessibility built-in (color contrast, touch targets)
- Dark mode support with automatic system detection

### 3. Internationalization (i18n)
- `expo-localization` for device locale detection
- `i18n-js` for translation management
- Separate language files (en.ts, es.ts)
- Context-aware translations throughout the app

### 4. Deep Linking
Configured for sharing lists via URLs:
```
kesilist://list/[listId]
```
Enables seamless list sharing between users.

### 5. Type-Safe Navigation
React Navigation with TypeScript ensures compile-time route validation:
```typescript
type RootStackParamList = {
  ShoppingList: { store: Store };
  Products: { store: Store };
  // ...
};
```

### 6. Reactive Database Queries
WatermelonDB's reactive queries automatically update UI when data changes:
```typescript
// UI automatically updates when database changes
const products = useObservable(
  database.get('products').query(Q.where('name', Q.like(`${query}%`)))
);
```

## Getting Started

### Prerequisites

- Node.js ≥18
- React Native development environment ([setup guide](https://reactnative.dev/docs/environment-setup))
- For iOS: Xcode, CocoaPods
- For Android: Android Studio, JDK

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mariscallzn/kesi-goods.git
cd kesi-goods
```

2. Install dependencies:
```bash
npm install
```

3. For iOS, install CocoaPods dependencies:
```bash
cd ios && pod install && cd ..
```

### Running the Application

Start Metro bundler:
```bash
npm start
```

Run on Android:
```bash
npm run android
```

Run on iOS:
```bash
npm run ios
```

### Development

**Linting:**
```bash
npm run lint
```

**Testing:**
```bash
npm test
```

## AWS Amplify Configuration

The application uses AWS Amplify Gen 2 for backend services:

1. **Authentication**: Cognito User Pools with email/password
2. **API**: GraphQL with selective authorization
3. **Data Models**: Lists, Items, Persons, and PersonList relationships

Configuration is managed through `amplify/backend.ts` with TypeScript definitions.

## Performance Optimizations

1. **JSI Integration**: WatermelonDB uses JSI on iOS for native performance
2. **Lazy Loading**: Product autocomplete with debounced queries
3. **Memoization**: Redux selectors with reselect for computed values
4. **Gesture Handler**: Native gesture system for smooth interactions
5. **Optimistic Updates**: Immediate UI feedback before server confirmation

## Security

- **Authentication**: AWS Cognito with secure token management
- **Authorization**: Row-level security on GraphQL API
- **Local Storage**: Encrypted database on device
- **HTTPS**: All network communication encrypted
- **Input Validation**: Server-side validation for all mutations

## Roadmap

The application architecture supports future enhancements:
- Real-time collaboration with WebSocket
- Recipe integration with ingredient extraction
- Barcode scanning for product entry
- Price tracking and budgeting
- Store location mapping

## License

Private project - All rights reserved

## Acknowledgments

Built with modern React Native best practices and industry-standard patterns for scalable mobile applications.
