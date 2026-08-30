// ** React Imports
import { Suspense, lazy } from 'react'
// import { BrowserRouter } from "react-router-dom";

// ** Redux Imports
import { Provider } from 'react-redux'
import { store } from '@/redux/store'

// ** graphql imports
import { ApolloProvider } from '@apollo/client'

import NiceModal from '@ebay/nice-modal-react'

// ** Intl & ThemeColors Context
import ability from '@/configs/acl/ability'
import { AbilityContext, AbilityProvider } from '@/context/Can'
import { ToastContainer } from 'react-toastify'
import { ManagedUIContext } from '@/context/ui.context'

// ** i18n
import './configs/i18n'

// ** Spinner (Splash Screen)
import Spinner from '@/@core/components/spinner/Fallback-spinner'

// ** Ripple Button
import '@/@core/components/ripple-button'

// ** React Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** React Toastify
import '@/@core/scss/react/libs/toastify/toastify.scss'
// ** Flatpickr
import '@/@core/scss/react/libs/flatpickr/flatpickr.scss'

// ** Core styles
import '@/@core/assets/fonts/feather/iconfont.css'
import '@/@core/scss/core.scss'
import '@/assets/scss/style.scss'

import { useClient } from './ApiClient'

// ** Lazy load app
const App = lazy(() => import('./App'))

const NextApp = () => {
  const [client] = useClient()

  return (
    <>
      {client && (
        <ApolloProvider client={client}>
          <Provider store={store}>
            <Suspense fallback={<Spinner />}>
              {/* @ts-ignore ignore */}
              <AbilityContext.Provider value={ability}>
                <AbilityProvider value={ability}>
                  <ManagedUIContext>
                    <NiceModal.Provider>
                      <App />
                      <ToastContainer
                        newestOnTop
                        hideProgressBar
                        // progressStyle={{ backgroundColor: "primary" }}
                      />
                    </NiceModal.Provider>
                  </ManagedUIContext>
                </AbilityProvider>
              </AbilityContext.Provider>
            </Suspense>
          </Provider>
        </ApolloProvider>
      )}
    </>
  )
}

export default NextApp
