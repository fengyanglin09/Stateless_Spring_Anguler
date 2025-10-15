export interface AppSession {
  isAuthenticated: boolean;
  accessToken?: string;
  idToken?: string;
  refreshToken?: string; // optional if silent refresh is handled differently
  tokenExpiry?: Date;

  // below are things that Track timing, activity, and auto-logout:
  sessionStartTime?: Date;
  sessionExpiryTime?: Date;
  lastActivityTime?: Date;
  idleTimeout?: number; // e.g., 15 min of inactivity

  // below are things that can be loaded after authentication via API calls to your Spring backend.
  selectedTenant?: string;
  selectedRole?: string;
  preferences?: any;

}
