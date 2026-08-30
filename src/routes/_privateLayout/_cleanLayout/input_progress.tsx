import InputProgress from '#/views/report/notes/InputProgress'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_privateLayout/_cleanLayout/input_progress',
)({
  component: InputProgress,
  staticData: {
    meta: {
      resource: 'report',
    },
  },
})
