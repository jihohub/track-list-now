import GlobalLoadingBar from "@/features/common/GlobalLoadingBar";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import MobileNav from "./MobileNav";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="flex flex-col min-h-screen bg-gradient-radial from-zinc-900 to-zinc-950">
    <GlobalLoadingBar />
    <Header />
    <main className="flex-grow container mx-auto">{children}</main>
    <Footer />
    <MobileNav />
  </div>
);

export default Layout;
