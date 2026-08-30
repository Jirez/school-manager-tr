import type { JwtPayload } from "jwt-decode";
import { jwtDecode } from "jwt-decode";

const key = "school-token"; // token key

export default {
  write: (token: string): void => localStorage.setItem(key, token),
  read: (): string | null => localStorage.getItem(key),
  delete: (): void => localStorage.removeItem(key),
  authUserKey: (): string => "schoolAuthUser",
  isTokenExpired: (token: string | null): boolean => {
    if (!token) {
      return true;
    }
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.exp! <= Date.now() / 1000;
    } catch (err) {
      return false;
    }
  },
};
