import { createRootRoute, HeadContent } from '@tanstack/react-router'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

// import '../styles.css'
import NextApp from '#/NextApp'
import NotFound from '#/views/Error'
import GlobalProgress from '#/components/GlobalProgress'

const APP_URL =
  import.meta.env.VITE_PUBLIC_APP_URL ?? 'https://school.syscabh.com'
const OG_IMAGE = `${APP_URL}/og-image.jpg`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      // ── Primary ────────────────────────────────────────────────
      { title: 'SchoolManager - NeemaDev' },
      {
        name: 'description',
        content:
          'Gérez facilement les bulletins, inscriptions, comptabilité et rapports de votre établissement scolaire.',
      },
      { name: 'author', content: 'Jirez TSAYO - NeemaDev' },
      { name: 'theme-color', content: '#4f46e5' },

      // ── Open Graph (Facebook · LinkedIn · Discord · Mastodon) ──
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: APP_URL },
      { property: 'og:site_name', content: 'SchoolManager' },
      {
        property: 'og:title',
        content: 'SchoolManager - Gestion scolaire complète',
      },
      {
        property: 'og:description',
        content:
          'Bulletins, inscriptions, comptabilité et rapports — tout ce dont votre école a besoin en un seul endroit.',
      },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:type', content: 'image/jpeg' },
      {
        property: 'og:image:alt',
        content: 'SchoolManager - Gestion scolaire complète',
      },
      { property: 'og:locale', content: 'fr_FR' },

      // ── Twitter / X Card ───────────────────────────────────────
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:url', content: APP_URL },
      {
        name: 'twitter:title',
        content: 'SchoolManager - Gestion scolaire complète',
      },
      {
        name: 'twitter:description',
        content:
          'Bulletins, inscriptions, comptabilité et rapports — tout ce dont votre école a besoin en un seul endroit.',
      },
      { name: 'twitter:image', content: OG_IMAGE },
      { name: 'twitter:image:alt', content: 'Logo SchoolManager' },
    ],
    links: [{ rel: 'canonical', href: APP_URL }],
  }),
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <>
      <HeadContent />
      <GlobalProgress />
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
