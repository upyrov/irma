import { ProjectSwitcher } from "./componennts/dropdown";
import { Logo } from "./componennts/logo";
import { Navigation } from "./componennts/navigation";
import { UserMenu } from "./componennts/userMenu";

export function Sidebar() {
    return (
  <aside className="box-border flex h-screen w-60 max-w-70 flex-col gap-5 border-r border-border bg-white px-3.5 pt-5 pb-1">
    <Logo/>
    <ProjectSwitcher />
    <Navigation />
    <UserMenu />
  </aside>
);
}