import { ApiService } from "./api.service"
import { AuthService } from "./auth.service"

export const authService = new AuthService("/api/auth")
export const apiService = new ApiService("/api")
