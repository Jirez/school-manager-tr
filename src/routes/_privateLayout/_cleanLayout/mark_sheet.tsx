import MarkSheet from '#/views/report/dataGathering/MarkSheet'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_privateLayout/_cleanLayout/mark_sheet')(
  {
    component: MarkSheet,
    staticData: {
      meta: {
        resource: 'report',
      },
    },
  },
)
