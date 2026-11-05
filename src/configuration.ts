import type { TConfiguration } from '@/utils/types'

const response = await fetch('/configuration.json')

if (!response.ok) {
  throw new Error(
    `Failed to load configuration (${response.status} ${response.statusText})`,
  )
}

const configuration: TConfiguration = await response.json()

export default configuration
