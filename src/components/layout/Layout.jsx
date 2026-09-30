import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import MiniCart from "@/components/layout/MiniCart";
import MagneticCursor from "@/components/MagneticCursor";
import ScrollProgressBar from "@/components/ScrollProgressBar";

export default function Layout({ children }) {
  const { pathname } = useLocation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const pageVariants = {
    initial: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgressBar />
      <Header />
      <main className="flex-1 pb-20 lg:pb-0 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {children || <Outlet />}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <MobileNav />
      <MiniCart />
      <MagneticCursor />
    </div>
  );
}