import DisciplineDistributionForm from '#/views/discipline/distribution/discipline-distribution-form'
import { createFileRoute } from '@tanstack/react-router'
import { useTitle } from 'ahooks'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute(
  '/_privateLayout/_vertical/(discipline)/discipline-distribution',
)({
  head: () => ({
    meta: [{ title: m.discipline_distribution() }],
  }),
  component: RouteComponent,
  staticData: {
    meta: {
      resource: 'discipline',
    },
  },
})

function RouteComponent() {
  useTitle(m.discipline_distribution())

  return (
    <div>
      <DisciplineDistributionForm />
    </div>
  )
}
