import { Can, AbilityProvider, useAbility as useAbilityCore } from '@casl/react'
import { createMongoAbility } from '@casl/ability'
import { createContext } from 'react'
import type { AppAbility } from '#/configs/acl/ability'

export const AbilityContext =
  createContext<AppAbility>(createMongoAbility<AppAbility>())

const useAbility = useAbilityCore<AppAbility>

export { Can, AbilityProvider, useAbility }
