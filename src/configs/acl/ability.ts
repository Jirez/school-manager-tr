import {
  // Ability,
  // AbilityClass,
  AbilityBuilder,
  createMongoAbility,
} from '@casl/ability'
import type { MongoAbility } from '@casl/ability'
import TokenStorage from '@/utils/TokenStorage'

// import { initialAbility } from "./initialAbility";

export type Actions = 'write' | 'update' | 'delete' | 'read'

export type Subjects =
  | 'student'
  | 'user'
  | 'config'
  | 'dashboard'
  | 'payroll'
  | 'planning'
  | 'note'
  | 'report'
  | 'teacher'
  | 'payment'
  | 'invoice'
  | 'discipline'
  | 'public'
  | 'product'
  | 'customer'
  | 'vendor'
  | 'role'
  | 'sale'
  | 'purchase'
  | 'expense'

export type AppAbility = MongoAbility<[Actions, Subjects]>
// export const appAbility = Ability as AbilityClass<AppAbility>

export const abilitiesFromAuthorities = () => {
  const rawAuthUser = localStorage.getItem(TokenStorage.authUserKey())
  const authUser: AuthResponse | null = rawAuthUser
    ? JSON.parse(rawAuthUser)
    : null

  /* return authUser ? authUser
    .user
    .authorities
    .filter((val) => val.includes(":"))
    .map(val => {
        const tab = val.split(':');
        return {action: tab[1], subject: tab[0]}
    }) :
    initialAbility; */
  // const { can, rules } = new AbilityBuilder(appAbility)
  const { can, rules } = new AbilityBuilder<AppAbility>(createMongoAbility)

  if (authUser) {
    authUser.user.authorities
      .filter((val) => val.includes(':'))
      .forEach((val) => {
        const tab = val.split(':')
        can(tab[1] as Actions, tab[0] as Subjects)
      })

    can('read', 'dashboard')
    can('read', 'report')
    can('read', 'public')
  } else {
    can('read', 'dashboard')
    can('read', 'report')
    can('read', 'public')
  }

  // console.log(rules)

  return rules
}

// export default new Ability(abilitiesFromAuthorities())
export default createMongoAbility<AppAbility>(abilitiesFromAuthorities())
