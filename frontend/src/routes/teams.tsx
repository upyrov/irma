import { HomeProjectsNav } from '#/layout/sidebar/componennts/homeProjetcsNav';
import { Logo } from '#/layout/sidebar/componennts/logo';
import { TeamList } from '#/layout/sidebar/componennts/teamList';
import { UserMenu } from '#/layout/sidebar/componennts/userMenu';
import { teams } from '#/tempData';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/teams')({
  component: RouteComponent,
})

function RouteComponent() {
 return (
   <div className='flex min-h-screen bg-white'>
       <aside className="box-border flex w-60 max-w-70 h-screen flex-col gap-5 border-r border-[#E3E6EB] bg-white px-3.5 pt-5 pb-1">
         <Logo/>
         <HomeProjectsNav />
         <UserMenu />
       </aside>
     
   <div className="box-border flex min-w-0 flex-1 flex-col gap-7 px-10 py-8">
 
     <div className="flex flex-wrap items-end justify-between gap-4">
       <div>
         <h1 className="mb-1.5 font-['Manrope',sans-serif] text-[32px] font-extrabold tracking-[-0.02em]">Команди</h1>
         <p className="text-[15px] text-[#5B6270]">Команди, у яких ви берете участь, та їхні учасники</p>
       </div>
 
       <div className="flex flex-wrap items-center gap-2.5">
         <button
           type="button"
           className="flex h-[42px] items-center gap-2 rounded-[10px] bg-[#2F5BEA] px-4 text-sm font-semibold text-white hover:bg-[#1E40B8]"
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
