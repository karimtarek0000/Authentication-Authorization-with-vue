# Auth Flow with Vue

Authentication lives under [src/auth/](src/auth/) and is exposed as a single barrel module (`src/auth/index.ts`), so the rest of the app imports everything (`login`, `userAuth`, guards, types, …) from `@/auth` without reaching into subfolders. State is held in a plain `reactive()` object (`userAuth`) rather than a Pinia store — there is no auth store module elsewhere in the app.

### Folder structure

```
src/auth/
├── index.ts            # barrel — re-exports everything below as the public @/auth API
├── Service/
│   └── index.ts         # userAuth state + login, logout, refreshToken, restoreSession
├── Call/
│   └── index.ts         # axios instance with auth request/response interceptors, abortAllApiRequests
├── Guards/
│   └── index.ts         # route guards (aboutGuard, testGuard) used in router/index.ts
├── Idle/
│   └── index.ts         # useIdle() composable — inactivity timer that triggers auto-logout
├── Sync/
│   └── index.ts         # authChannel — BroadcastChannel used to sync logout across browser tabs
├── Permissions/
│   └── index.ts         # $checkPermissions helper for single/anyOf/allOf permission checks
├── Components/
│   └── CanView.vue      # renders slot content only if the current user has the required permission
├── Config/
│   └── index.ts         # endpoint constants: LOGIN, REFRESH_TOKEN, PROFILE
├── Types/
│   └── index.ts         # Login, IUserAuth, AuthEvent, Permission, PERMISSIONS, PermissionRequirement
└── utils/
    └── index.ts          # handleError — normalizes AxiosError into app-level errors
```

### Step-by-step flow

1. **Login** — [`useAuthService().login`](src/auth/Service/index.ts) posts credentials to the `LOGIN` endpoint, fills `userAuth` (access token, role, user info, permissions, `isAuth: true`), sets a `hasAuth` flag in `localStorage` as a cross-reload/tab hint, and redirects to `/home`.
2. **Route guards** — the router's `beforeEach` ([src/router/index.ts](src/router/index.ts)) awaits `restoreSession()` on every navigation, redirects unauthenticated users to `/login`, redirects authenticated users away from `/login`/`/signup`, and calls `abortAllApiRequests()` to cancel in-flight requests left over from the previous page.
3. **Session restore** — on page load/refresh, `restoreSession()` checks the `hasAuth` flag, calls `refreshToken()`, then fetches `PROFILE` (`/me`) to repopulate `userAuth`. Concurrent calls are de-duplicated with an in-flight promise cache.
4. **Token refresh** — `refreshToken()` posts to `REFRESH_TOKEN` with `withCredentials: true`, relying on an httpOnly refresh cookie set by the server; the new access token is kept in memory only (never persisted). A failed refresh triggers `logout()`.
5. **API interceptors** — the axios instance in [src/auth/Call/index.ts](src/auth/Call/index.ts) attaches `Authorization: Bearer <accessToken>` to every request, retries failed requests up to a max count, and on a `401` refreshes the token once before retrying the original request.
6. **Idle auto-logout** — [`useIdle()`](src/auth/Idle/index.ts) is armed while `userAuth.isAuth` is true. User activity (`keydown`, `click`, `scroll`, `touchstart`, `mousemove`) resets a 15-minute inactivity timer, throttled to at most once every 10 seconds so the reset logic doesn't run on every event. No activity within the window triggers automatic `logout()`.
7. **Logout & cross-tab sync** — `logout()` resets `userAuth`, removes the `hasAuth` flag, broadcasts a `'logout'` `AuthEvent` on `authChannel` ([src/auth/Sync/index.ts](src/auth/Sync/index.ts)), and reloads the page. Other open tabs listen on the same `BroadcastChannel` and reload too, so logging out in one tab logs the user out everywhere.
8. **Permissions** — `$checkPermissions` ([src/auth/Permissions/index.ts](src/auth/Permissions/index.ts)) evaluates `userAuth.permissions` against a `PermissionRequirement` (single / `anyOf` / `allOf`). It's used both in route guards to block whole pages and in the `CanView` component to conditionally render parts of the UI.
