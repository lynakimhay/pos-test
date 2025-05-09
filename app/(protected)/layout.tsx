import React from "react";
import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { decrypt } from "../auth/stateless-session";
import AppWrapper from "@/components/app-wrapper";

const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cookiesInstance = await cookies(); // Await the cookies() call
  const defaultOpen = cookiesInstance.get("sidebar:state")?.value === "true";
  const cookie = cookiesInstance.get("session")?.value;
  const session = await decrypt(cookie);
  console.log("cookie:", cookie);
  const { userId } = session as { userId: number };

  return (
    <AppWrapper appInfo={{ userId: userId, token: cookie }}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <section className="h-screen flex flex-col w-full">
          <nav className="w-full flex items-center border-b ">
            <SidebarTrigger className="ml-4 bg-red-100" />
            <Header />
          </nav>
          {children}
          <Footer />
        </section>
      </SidebarProvider>
    </AppWrapper>
  );
};

export default Layout;
