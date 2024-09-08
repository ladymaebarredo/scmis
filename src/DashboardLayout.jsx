import React from "react";
import { SideBar } from "./components/SideBar";
import { Outlet } from "react-router-dom";
import { UserProvider } from "./providers/UserProvider";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <UserProvider>
        <main className="h-screen flex overflow-hidden">
          <SideBar />
          <section className="flex-auto p-2 max-h-screen overflow-y-auto bg-gray-100">
            <Outlet />
          </section>
        </main>
      </UserProvider>
    </>
  );
}
