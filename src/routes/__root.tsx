import { createRootRoute } from '@tanstack/react-router'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

// import '../styles.css'
import NextApp from '#/NextApp'
import NotFound from '#/views/Error'
// import { shouldRedirect } from '#/paraglide/runtime'

export const Route = createRootRoute({
  /* beforeLoad: async () => {
    const decision = await shouldRedirect({ url: window.location.href })
    if (decision.redirectUrl) {
      throw redirect({ href: decision.redirectUrl.href })
    }
  }, */
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <>
      <NextApp />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}
