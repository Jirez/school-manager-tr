import VerticalLayout from '@/layouts/VerticalLayout'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_privateLayout/_vertical')({
  component: VerticalLayout,
})
