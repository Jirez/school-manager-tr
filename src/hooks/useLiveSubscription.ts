import { useEffect, useRef } from 'react'
import type { DocumentNode } from 'graphql'
import type { SubscribeToMoreOptions } from '@apollo/client'
import sortBy from 'lodash/sortBy'

interface UseLiveSubscriptionOptions {
  subscribeToMore: (options: SubscribeToMoreOptions<any, any>) => () => void
  document: DocumentNode
  listVar: string
  singleVar: string
  sortField?: string
  uniqueField?: string
  /** When false, ignore events whose enterprise differs from `enterpriseId`. */
  triggerUpdate?: boolean
  enterpriseId?: number
  skip?: boolean
}

/**
 * Keeps a query's list in sync with a "created/updated" subscription.
 * Unsubscribes on unmount (or when `document`/`skip` change).
 */
export function useLiveSubscription(options: UseLiveSubscriptionOptions) {
  const { subscribeToMore, document, skip } = options
  const optionsRef = useRef(options)
  optionsRef.current = options

  useEffect(() => {
    if (skip) return

    return subscribeToMore({
      document,
      updateQuery: (previousResult: any, { subscriptionData }: any) => {
        const { listVar, singleVar, sortField, uniqueField, triggerUpdate } =
          optionsRef.current
        const newData = subscriptionData?.data?.[singleVar]
        if (!newData) return previousResult

        if (!triggerUpdate) {
          const eid = newData.enterpriseId || newData.enterprise?.id
          if (!eid || eid !== optionsRef.current.enterpriseId) {
            return previousResult
          }
        }

        let previous: any[] = (previousResult?.[listVar] ?? []).filter(
          ({ id }: { id: string }) => id !== newData.id,
        )
        if (uniqueField) {
          previous = previous.filter(
            (item) => item[uniqueField] !== newData[uniqueField],
          )
        }

        const next = previous.concat(newData)
        return {
          [listVar]: sortField ? sortBy(next, (o) => o[sortField]) : next,
        }
      },
    })
  }, [subscribeToMore, document, skip])
}
