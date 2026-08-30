import { useState, useEffect } from 'react'
import {
  ApolloClient,
  split,
  createHttpLink,
  InMemoryCache,
  makeVar,
} from '@apollo/client'
import type {
  ServerError,
  NormalizedCacheObject,
  ReactiveVar,
} from '@apollo/client'
// import { WebSocketLink } from "@apollo/client/link/ws";
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { setContext } from '@apollo/client/link/context'

import possibleTypes from './possibleTypes.json'
import TokenStorage from '@/utils/TokenStorage'
import { getMainDefinition } from '@apollo/client/utilities'
import { onError } from '@apollo/client/link/error'
import { concat } from '@/utils/helpers'
// import useConfiguration from '@hooks/useConfiguration';
import type { TConfiguration } from '@/utils/types'
// import {messageService} from "./util";

const json = await fetch('/configuration.json').then((res) => res.json())

// ** Browser-close logout detection **
// If a previous session flagged a pending logout and sessionStorage is empty
// (i.e. the browser was closed, not just a refresh), clear the auth data.
const pendingLogout = localStorage.getItem('school-pending-logout')
if (pendingLogout) {
  const sessionStillActive = sessionStorage.getItem('school-session-active')
  if (!sessionStillActive) {
    // Browser was fully closed → clear auth
    TokenStorage.delete()
    localStorage.removeItem(TokenStorage.authUserKey())
  }
  // Either way, clear the pending flag
  localStorage.removeItem('school-pending-logout')
}

const token = TokenStorage.read()
const schoolAuthUser = localStorage.getItem(TokenStorage.authUserKey())
const authUser: AuthResponse | null = TokenStorage.isTokenExpired(token)
  ? null
  : schoolAuthUser
    ? JSON.parse(schoolAuthUser)
    : null

type AuthenticationType = {
  isAuthenticated: boolean
  token: string | null
  mfa: boolean
  username: string | null
  displayName: string | null | undefined
  personId: number | null
  enterpriseId?: number | null
  enterprise: string | null
  authorities: string[]
  returnUrl?: string
  schoolCategory?: string
}

const authenticationInitialValue: AuthenticationType = {
  isAuthenticated: token ? !TokenStorage.isTokenExpired(token) : false,
  token,
  mfa: authUser ? authUser.mfa : false,
  schoolCategory: authUser ? authUser.user.schoolCategory : '',
  username: authUser ? authUser.user.username : null,
  displayName: authUser
    ? authUser.user.person.displayName
      ? authUser.user.person.displayName
      : concat(
          authUser.user.person.lastName || '',
          authUser.user.person.firstName || '',
        )
    : null,
  personId: null,
  enterpriseId: authUser ? authUser.user.enterprise.id : null,
  enterprise: authUser ? authUser.user.enterprise.name : null,
  authorities: [],
  returnUrl: '/',
}

export const authenticationVar: ReactiveVar<AuthenticationType> = makeVar(
  authenticationInitialValue,
)

const cache = new InMemoryCache({
  possibleTypes,
  typePolicies: {
    Query: {
      fields: {
        authentication: {
          read() {
            return authenticationVar()
          },
        },
        findFrequent: {
          merge: false,
        },
        unregisteredStudent: {
          merge: false,
        },
      },
    },
    Frequent: {
      keyFields: ['frequentPK', ['studentId', 'classId', 'schoolYearId']],
    },
  },
})

function configureApolloClient(config?: TConfiguration) {
  // const config = useConfiguration()

  // const languages = import.meta.glob('/configuration.json')

  const httpLink = createHttpLink({
    uri: `${config?.httpProtocol}://${config?.serverAddress}:${config?.serverPort}/graphql`,
    // credentials: 'same-origin'
  })

  /*  const wsLink = new WebSocketLink({
         uri: `${config?.wsProtocol}://${config?.serverAddress}:${config?.serverPort}/school-manager/subscriptions`,
         options: {
             reconnect: true,
             connectionParams: {
                 authToken: TokenStorage.read(),
             }
         }
     }); */

  const wsLink = new GraphQLWsLink(
    createClient({
      url: `${config?.wsProtocol}://${config?.serverAddress}:${config?.serverPort}/graphql`,
      connectionParams: {
        authToken: TokenStorage.read(),
      },
    }),
  )

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink,
  )

  /* const authLink0 = new ApolloLink((operation, forward) => {
        operation.setContext((cache, {headers = {} }) => {
            //const token = TokenStorage.read();
            const authentication = cache.data.get(`Authentication:${authenticationId}`);
            const token = authentication != null ? authentication.token : null;

            if (token && !TokenStorage.isTokenExpired(token)) {
                headers = { ...headers, Authorization: `Bearer ${token}` };
            } else {
                cache.reset();
                //todo logout
            }

            return { headers };
        });

        return forward(operation);
    });*/

  const authLink = setContext((_, { cache, headers }) => {
    const authentication = authenticationVar()
    const token = authentication ? authentication.token : null
    // const token = TokenStorage.read();

    if (token && !TokenStorage.isTokenExpired(token)) {
      // const customHeaders = {'Authorization': `Bearer ${token}`};
      return { headers: { ...headers, Authorization: `Bearer ${token}` } }
    } else {
      // cache.reset();
      return { headers }
    }
  })

  const errorLink = onError(({ response, graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        if (message === 'Accès refusé') {
          const authentication = authenticationVar()
          const token = authentication ? authentication.token : null
          if (!token || TokenStorage.isTokenExpired(token)) {
            // logout here
            /* TokenStorage.delete();
                        localStorage.removeItem('storeAuthUser');
                        localStorage.clear();
                        authenticationVar({...authentication, isAuthenticated: false});*/
            // notify logout
            // messageService.sendMessage("logout", true); //todo restore this line
            // console.log("sending logout message")
          }
        }
      })
    }

    if (networkError) {
      // console.log('Network error', networkError);

      if ((networkError as ServerError).statusCode === 401) {
        // signOut(client);
      }
    }
  })

  const resetToken = onError(({ networkError }) => {
    if (
      networkError &&
      networkError.name === 'ServerError' &&
      (networkError as ServerError).statusCode === 401
    ) {
      // remove cached token on 401 from the server
      // token = null;
    }
  })

  return { authLink, errorLink, splitLink }
}

// const link = ApolloLink.from([authLink, errorLink, terminatingLink]);
// const authLink = configureApolloClient()

export function useClient() {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>()
  // const { data, error, loading } = useRequestConfiguration()
  const config = json // useConfiguration('/configuration.json')
  // console.log(import.meta.env.)

  useEffect(() => {
    function getClient() {
      /* if (loading) {
                return;
            } */
      // @ts-ignore test
      const { authLink, errorLink, splitLink } = configureApolloClient(config)
      setClient(
        new ApolloClient({
          defaultOptions: {
            // query: {fetchPolicy: 'network-only'},
            // watchQuery: {fetchPolicy: 'network-only'},
            // mutate: {errorPolicy: 'all'}
          },
          link: authLink.concat(errorLink.concat(splitLink)),
          cache,
        }),
      )
    }

    getClient()
  }, [setClient])

  return [client]
}
