import GlobalLoadingBar from "@/features/common/components/GlobalLoadingBar";
import { Noto_Sans_KR as NotoSansKr } from "next/font/google";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import MobileNav from "./MobileNav";

interface LayoutProps {
  children: React.ReactNode;
}

const notoSansKr = NotoSansKr({
  subsets: ["latin"],
  display: "swap",
});

const Layout = ({ children }: LayoutProps) => (
  <div
    className={`${notoSansKr.className} flex flex-col min-h-screen bg-gradient-radial from-zinc-900 to-zinc-950`}
  >
    <GlobalLoadingBar />
    <Header />
    <main className="flex-grow container mx-auto mb-16">{children}</main>
    <Footer />
    <MobileNav />
  </div>
);

export default Layout;
