# 📱 GigTask - Task Management App for Gig Workers

A modern, high-performance mobile application built with **React Native (Expo)**, **TypeScript**, **Clean Architecture**, and the **BLoC (Business Logic Component)** state management pattern. Designed specifically for gig economy workers (delivery, rideshare, freelance, field contractors) to manage shifts, tasks, deadlines, and daily priorities.

---

## 📸 UI Screenshots & Visual Reference

The application reproduces the design system provided in the project specification:
- **Onboarding Screen**: Curved welcome visual, feature showcase, pagination indicator, and animated transition.
- **Authentication**: Modern Firebase login & registration with email/password validation, error banners, and social sign-in buttons.
- **My Tasks Dashboard**: Signature curved purple header (`#6C63FF`), live search bar, date badge, priority tags, and sectioned groupings (*Today*, *Tomorrow*, *This week*, *Later*).
- **Task Actions**: Interactive checkbox toggling, priority badges (*High*, *Medium*, *Low*), category tags (*Delivery*, *Work*, *Personal*, *Study*), and fast-action deletion.
- **Schedule & Calendar View**: Date selector and timeline view for gig shifts.

---

## 🏛️ Clean Architecture Breakdown

The project strictly follows Uncle Bob's **Clean Architecture** principles with distinct, decoupled layers:

```
src/
├── core/                           # Cross-cutting foundational layer
│   ├── bloc/                       # Reactive BLoC pattern (RxJS BehaviorSubject & Subjects)
│   │   ├── bloc.base.ts            # Base Bloc<Event, State> class
│   │   ├── bloc.provider.tsx       # BlocProvider, useBlocState, useBloc hooks
│   │   └── index.ts
│   ├── errors/                     # Failure hierarchy (AuthFailure, ServerFailure, CacheFailure)
│   ├── network/                    # Firebase configuration & endpoints
│   ├── theme/                      # Design tokens (Colors, Typography, Spacing, Shadows)
│   └── utils/                      # Result<T> pattern, date formatting, input validators
│
├── domain/                         # Pure business logic (Zero third-party UI/data dependencies)
│   ├── entities/                   # Domain entities (Task, User, Priority, Filters)
│   ├── repositories/               # Repository contracts (AuthRepository, TaskRepository)
│   └── usecases/                   # Isolated Use Cases
│       ├── auth/                   # LoginUseCase, RegisterUseCase, LogoutUseCase, GetCurrentUserUseCase
│       └── task/                   # GetTasksUseCase, CreateTaskUseCase, UpdateTaskUseCase,
│                                   # DeleteTaskUseCase, ToggleTaskStatusUseCase
│
├── data/                           # Data manipulation, serialization, and caching
│   ├── datasources/
│   │   ├── local/                  # AsyncStorage local cache (Offline-first data store)
│   │   └── remote/                 # Firebase Auth & Realtime Database REST API client
│   ├── models/                     # Data transfer objects with JSON/Entity mappers
│   └── repositories/               # Repository implementations (AuthRepositoryImpl, TaskRepositoryImpl)
│
├── presentation/                   # UI Layer
│   ├── blocs/                      # Feature BLoCs (AuthBloc, TaskBloc)
│   │   ├── auth/                   # AuthEvent, AuthState, AuthBloc
│   │   └── task/                   # TaskEvent, TaskState, TaskBloc
│   ├── components/                 # Reusable atomic UI components
│   │   ├── common/                 # HeaderCurved, FilterBar, CustomButton, CustomInput, Badges
│   │   └── task/                   # TaskItemCard, TaskSectionHeader, TaskFormModal
│   └── screens/                    # Top-level screen views
│       ├── OnboardingScreen.tsx    # Welcome & onboarding flow
│       ├── LoginScreen.tsx         # Firebase login screen
│       ├── RegisterScreen.tsx      # Firebase sign up screen
│       ├── HomeScreen.tsx          # Main task list dashboard
│       └── CalendarViewScreen.tsx  # Shift calendar view
│
└── di/                             # Dependency Injection Container
    └── injection_container.ts      # Service locator (Wiring DataSources -> Repositories -> UseCases -> Blocs)
```

---

## ⚡ BLoC State Management

State management is powered by the **BLoC pattern** implemented with **RxJS Reactive Streams**:
1. **Events**: User interactions and intents are dispatched as strongly-typed events (`authBloc.add(...)`, `taskBloc.add(...)`).
2. **BLoC Engine**: Each BLoC processes events sequentially through corresponding domain **Use Cases**.
3. **States**: Immutable states are emitted across an observable stream (`state$`).
4. **React Integration**: UI components reactively re-render using the custom `useBlocState(bloc)` hook.

---

## 🚀 Key Features

### 1. User Authentication
- **Firebase Authentication** integration for user registration and login (email/password).
- Comprehensive error handling: maps Firebase error codes (`INVALID_LOGIN_CREDENTIALS`, `EMAIL_EXISTS`, `WEAK_PASSWORD`, `USER_DISABLED`, etc.) to clear user-friendly banner notifications.
- Session persistence via local storage so users remain logged in across restarts.
- **⚡ Evaluator Quick Login Mode**: Instant one-tap evaluation login for testing without manual configuration.

### 2. Task Management (CRUD)
- **Create**: Modal with Title, Description, Due Date presets (*Today*, *Tomorrow*, *In 3 Days*, *Next Week*), Priority, and Category tag.
- **Read / View**: Tasks grouped into chronological buckets (*Today*, *Tomorrow*, *This week*, *Later*).
- **Update**: Edit task details, title, priority, or category at any time.
- **Delete**: Quick-action red trash button matching the reference design.
- **Toggle Completion**: Tap the circular radio button to mark tasks complete or incomplete.

### 3. Task Filtering & Sorting
- **Status Filter**: Toggle between `All`, `Incomplete (Pending)`, and `Completed` with dynamic item count badges.
- **Priority Filter**: Instant filtering by `High`, `Medium`, and `Low`.
- **Live Search**: Instant keyword search matching titles, descriptions, and category tags.
- **Due Date Sorting**: All tasks are automatically sorted by due date from **earliest to latest**.

### 4. Local Storage & Offline-First
- Uses `@react-native-async-storage/async-storage` to cache tasks and user credentials locally.
- Full offline resilience: gig workers can create, update, check off, and delete tasks even with spotty connectivity.

---

## 🛠️ How to Run the Project

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
npm install
```

### Running Locally

- **Web (Instant Browser Preview)**:
  ```bash
  npm run web
  ```
- **Android**:
  ```bash
  npm run android
  ```
- **iOS**:
  ```bash
  npm run ios
  ```

---

## 🔧 Configuring Live Firebase Backend (Optional)

The application includes working out-of-the-box demo credentials so you can run and test all features immediately without any manual setup.

To connect your own Firebase project:
1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password provider).
3. Enable **Realtime Database** (or Firestore).
4. Add your keys to `.env` or in [`src/core/network/firebase.config.ts`](file:///d:/WORK/REACT%20NATIVE/src/core/network/firebase.config.ts):
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
```

---

## 🧪 TypeScript Verification

Verify type safety and architecture contracts with:
```bash
npx tsc --noEmit
```
All code is strictly typed with 0 compilation errors.
