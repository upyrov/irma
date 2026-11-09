import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/projects/$projectId/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/projects/$projectId/settings"!</div>
}

