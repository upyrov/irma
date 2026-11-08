import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello Register!
    <h1>Register</h1>
  </div>
}
