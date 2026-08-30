import { useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'
import { UserByUsernameDocument } from '@/gql/graphql'

export const useUser = function (username?: string) {
  const [user, setUser] = useState<{ [key: string]: any } | null>(null)
  const client = useApolloClient()

  const findUser = async (username: string) => {
    const { data } = await client.query({
      query: UserByUsernameDocument,
      variables: { username: username },
      fetchPolicy: 'network-only',
    })

    if (data && data.user) {
      setUser(data.user)
    }
  }

  useEffect(() => {
    if (username) {
      findUser(username)
    }
  }, [username])

  return { user }
}
