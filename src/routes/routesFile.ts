// api-routes.ts
import { environment } from "../environment/environment.development";

export const BACKEND_DOMAIN = environment.BACKEND_DOMAIN;

// Mentor API Routes
export const MENTOR_API = {
  BASE: `${BACKEND_DOMAIN}/api/mentor`,
  AUTH: `${BACKEND_DOMAIN}/api/mentor/auth`,
  PROFILE: `${BACKEND_DOMAIN}/api/mentor/profile`,
  WALLET: `${BACKEND_DOMAIN}/api/mentor/wallet`,
  ROOM: `${BACKEND_DOMAIN}/api/mentor/room`,
};

// User API Routes
export const USER_API = {
  ROOM: `${BACKEND_DOMAIN}/api/user/room`,
  AUTH: `${BACKEND_DOMAIN}/api/user/auth`,
  PROFILE: `${BACKEND_DOMAIN}/api/user/profile`,
  BOOKINGS: `${BACKEND_DOMAIN}/api/user/bookings`,
  WALLET: `${BACKEND_DOMAIN}/api/user/wallet`,
  CHAT: `${BACKEND_DOMAIN}/api/user/chat`,
};


export const ADMIN_API = {
  BASE: `${BACKEND_DOMAIN}/api/admin`,
  AUTH: `${BACKEND_DOMAIN}/api/admin/auth`,
  PROFILE: `${BACKEND_DOMAIN}/api/admin/profile`,
  USER: `${BACKEND_DOMAIN}/api/admin/user`,
  LANGUAGETEST: `${BACKEND_DOMAIN}/api/admin/languageTest`,
  REPORTS: `${BACKEND_DOMAIN}/api/admin/reports`,
  APPLICATION: `${BACKEND_DOMAIN}/api/admin/mentorForm`,  
}
