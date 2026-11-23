import { SidebarShell } from '#/layout/sidebar/sidebar'
import { HomeProjectsNav } from '#/layout/sidebar/componennts/homeProjetcsNav';
import { Logo } from '#/layout/sidebar/componennts/logo';
import { TeamList } from '#/layout/sidebar/componennts/teamList';
import { UserMenu } from '#/layout/sidebar/componennts/userMenu';
import { requireAuth } from '#/api/guards';
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { NewTeam } from '#/components/newTeam'

export const Route = createFileRoute('/teams')({
  ssr: false,
  beforeLoad: requireAuth,
  component: RouteComponent,
})

function RouteComponent() {
 const [creating, setCreating] = useState(false)
 const [createdId, setCreatedId] = useState<string | null>(null)

 return (
   <div className='flex min-h-screen bg-white'>
       <SidebarShell>
         <Logo/>
         <HomeProjectsNav />
         <UserMenu />
       </SidebarShell>
     
   <div className="box-border flex min-w-0 flex-1 flex-col gap-7 px-10 py-8">
 
     <div className="flex flex-wrap items-end justify-between gap-4">
       <div>
         <h1 className="mb-1.5 font-['Manrope',sans-serif] text-[32px] font-extrabold tracking-[-0.02em]">Команди</h1>
         <p className="text-[15px] text-muted">Команди, у яких ви берете участь, та їхні учасники</p>
       </div>
 
       <button
         type="button"
         onClick={() => setCreating(true)}
         className="flex h-[42px] items-center gap-2 rounded-[10px] bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover"
       >
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
           <path d="M12 5v14M5 12h14" />
         </svg>
         Створити команду
       </button>
     </div>

    <TeamList highlightId={createdId} />
   </div>

   {creating && (
     <NewTeam onClose={() => setCreating(false)} onCreated={(team) => setCreatedId(team.id)} />
   )}
 </div>
 );
}
