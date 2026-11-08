import { Sidebar } from '#/layout/sidebar/sidebar';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/projects/$projectId')({
  component: ProjectLayout,
});

function ProjectLayout() {
  return (
    <div className="flex min-h-screen bg-[#F4F5F7]">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}