import InitSchool from '#/views/school/setup/init-school'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/init-school')({
  component: InitSchool,
})
