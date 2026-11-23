import { SidebarShell } from '#/layout/sidebar/sidebar'
import { HomeProjectsNav } from '#/layout/sidebar/componennts/homeProjetcsNav';
import { Logo } from '#/layout/sidebar/componennts/logo';
import { TeamList } from '#/layout/sidebar/componennts/teamList';
import { UserMenu } from '#/layout/sidebar/componennts/userMenu';
import { requireAuth } from '#/api/guards';
import { createFileRoute } from '@tanstack/react-router'
import { type FormEvent, useState } from 'react'
import { errorMessage } from '#/api/hooks/useAuth'
import { useCreateTeam } from '#/api/hooks/useTeams'

export const Route = createFileRoute('/teams')({
  ssr: false,
  beforeLoad: requireAuth,
  component: RouteComponent,
})

function RouteComponent() {
 const [creating, setCreating] = useState(false)
 const [name, setName] = useState('')
 const createTeam = useCreateTeam()

 const submit = (e: FormEvent) => {
   e.preventDefault()
   if (!name.trim()) return
   createTeam.mutate(
     { name: name.trim() },
     { onSuccess: () => { setName(''); setCreating(false) } },
   )
 }

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
 
       <div className="flex flex-wrap items-center gap-2.5">
         {creating && (
           <form onSubmit={submit} className="flex items-center gap-2">
             <input
               // biome-ignore lint/a11y/noAutofocus: поле відкривається кнопкою
               autoFocus
               value={name}
               onChange={(e) => setName(e.target.value)}
               onKeyDown={(e) => e.key === 'Escape' && setCreating(false)}
               placeholder="Назва команди"
               aria-label="Назва команди"
               className="h-[42px] w-[240px] rounded-[10px] border border-border-input px-3.5 text-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
             />
             <button
               type="submit"
               disabled={createTeam.isPending || !name.trim()}
               className="h-[42px] rounded-[10px] bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
             >
               Створити
             </button>
           </form>
         )}
         {createTeam.error && (
           <span className="text-sm text-danger-text">{errorMessage(createTeam.error)}</span>
         )}
         <button
           type="button"
           onClick={() => setCreating(true)}
           className={`${creating ? 'hidden' : 'flex'} h-[42px] items-center gap-2 rounded-[10px] bg-primary px-4 text-sm font-semibold text-white hover:bg-primary-hover`}
         >
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
             <path d="M12 5v14M5 12h14" />
           </svg>
           Створити команду
         </button>
       </div>
     </div>

    <TeamList />
   </div>
 </div>
 );
}
