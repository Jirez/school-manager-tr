// import { useQuery } from "@apollo/client";

// import { authenticationQuery } from "@queries/users";
import { authenticationVar } from '../ApiClient'

export function useAuthentication() {
  /* const { loading, data } = useQuery<AuthenticationData, {}>(authenticationQuery,
        { fetchPolicy: 'cache-first' }); */
  const data = authenticationVar()

  /*  return {
         username: data?.authentication.username,
         isAuthenticated: data?.authentication.isAuthenticated,
         displayName: data?.authentication.displayName,
         enterprise: data?.authentication.enterprise,
         enterpriseId: data?.authentication.enterpriseId,
         mfa: data?.authentication.mfa,
         loading,
         returnUrl: data?.authentication.returnUrl,
     }; */
  return {
    username: data?.username as string,
    isAuthenticated: data?.isAuthenticated,
    displayName: data?.displayName,
    enterprise: data?.enterprise,
    enterpriseId: data?.enterpriseId as number,
    mfa: data?.mfa,
    loading: false,
    returnUrl: data?.returnUrl,
    schoolCategory: data?.schoolCategory,
  }
}
