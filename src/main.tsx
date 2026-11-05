import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
// import { StrictMode } from 'react'

function createAppRouter(
  routeTree: typeof import('./routeTree.gen').routeTree,
) {
  return createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}

const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  const renderStartupError = (message: string) => {
    root.render(
      <main
        role="alert"
        style={{
          maxWidth: 640,
          margin: '10vh auto',
          padding: 24,
          fontFamily: 'sans-serif',
        }}
      >
        <h1>Application startup failed</h1>
        <p>{message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </main>,
    )
  }

  const start = async () => {
    try {
      await import('./configuration')
    } catch (error) {
      console.error('Failed to load application configuration:', error)
      renderStartupError(
        'The application configuration could not be loaded. Check your connection and try again.',
      )
      return
    }

    try {
      const { routeTree } = await import('./routeTree.gen')
      const router = createAppRouter(routeTree)
      root.render(<RouterProvider router={router} />)
    } catch (error) {
      console.error('Failed to start the application:', error)
      renderStartupError(
        'The application could not be started. Refresh the page to try again.',
      )
    }
  }

  void start()
}
