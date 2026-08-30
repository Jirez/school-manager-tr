import CleanVerticalLayout from '#/layouts/CleanVerticalLayout'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_privateLayout/_cleanLayout')({
  component: CleanVerticalLayout,
})
