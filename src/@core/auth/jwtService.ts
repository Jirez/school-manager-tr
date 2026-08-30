import { jwtDecode } from 'jwt-decode'
import type { JwtPayload } from 'jwt-decode'
import jwtDefaultConfig from './jwtDefaultConfig'

export default class JwtService {
  jwtConfig = { ...jwtDefaultConfig }

  constructor(jwtOverrideConfig: any) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }
  }

  getToken(): string | null {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  getAuthUserKey(): string {
    return this.jwtConfig.authUserKey
  }

  setToken(token: string) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, token)
  }

  removeToken() {
    localStorage.removeItem(this.jwtConfig.storageTokenKeyName)
  }

  isTokenExpired(token: string | null): boolean {
    if (!token) {
      return true
    }
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      return decoded.exp! <= Date.now() / 1000
    } catch (err) {
      return false
    }
  }
}
