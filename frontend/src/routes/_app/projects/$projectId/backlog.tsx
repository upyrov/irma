import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/projects/$projectId/backlog')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/projects/backlog"!</div>
}
