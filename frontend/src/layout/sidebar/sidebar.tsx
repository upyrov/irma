import { ProjectSwitcher } from "./componennts/dropdown";
import { Logo } from "./componennts/logo";
import { Navigation } from "./componennts/navigation";
import { User } from "./componennts/user";
import { UserMenu } from "./componennts/userMenu";

export function Sidebar() {

    return (
  <aside className="box-border flex h-screen w-60 max-w-70 flex-col gap-5 border-r border-[#E3E6EB] bg-white px-3.5 pt-5 pb-1">
    <Logo/>
    <ProjectSwitcher />
    <Navigation />
    <UserMenu />
  </aside>
);
}