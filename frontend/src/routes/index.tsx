import { requireAuth } from '#/api/guards'
import { SidebarShell } from '#/layout/sidebar/sidebar'
import { Logo } from '#/layout/sidebar/componennts/logo';
import { HomeProjectsNav } from '#/layout/sidebar/componennts/homeProjetcsNav';
import { createFileRoute } from '@tanstack/react-router'
import { UserMenu } from '#/layout/sidebar/componennts/userMenu';
import { ProjectList } from '#/layout/sidebar/componennts/projectList';
import { HomeProjectsTeamList } from '#/layout/sidebar/componennts/homeProjectsTeamList';
import { useState } from 'react';
import { NewProject } from '#/components/newProject';

export const Route = createFileRoute('/')({
  // Сесія — у HttpOnly cookie браузера, тож перевіряємо її в браузері, а не під час SSR
  ssr: false,
  beforeLoad: requireAuth,
  component: Home,
})


function Home() {

  const [isOpenNewProject, setIsOpenNewProject] = useState(false)

  return (

    <>
    {!isOpenNewProject ? (
<div className='flex min-h-screen bg-white'>
      <SidebarShell>
        <Logo/>
        <HomeProjectsNav />
        <HomeProjectsTeamList />
        <UserMenu />
      </SidebarShell>
    
  <div className="box-border flex min-w-0 flex-1 flex-col gap-7 px-10 py-8">

    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="mb-1.5 font-['Manrope',sans-serif] text-[32px] font-extrabold tracking-[-0.02em]">Проєкти</h1>
        <p className="text-[15px] text-muted">Усі проєкти команд, у яких ви берете участь</p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 " onClick={() => setIsOpenNewProject(true)}>
        <button
          type="button"
          className="flex h-[42px] items-center gap-2 rounded-[10px] bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Створити проєкт
        </button>
      </div>
    </div>
      <ProjectList />
  </div>
</div>
    ) : (
      <NewProject setIsOpenNewProject={setIsOpenNewProject}/>
    )}
    </>
  
);
}
