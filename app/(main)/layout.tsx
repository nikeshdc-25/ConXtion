import { NavigationSidebar } from "@/components/navigations/navigation-sidebar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className=" md:flex fixed inset-y-0 z-30 h-full w-[72px] flex-col">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
