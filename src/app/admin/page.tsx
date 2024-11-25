// app/admin/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import MintingControl from "../admin/components_admin/MintingControl";
import UserList from "../admin/components_admin/UserList";
import { Navbaradmin } from "./components_admin/Navbaradmin";

const ADMIN_USER_ID = "user_2pKg9sDw4aGoiVfvwWfquJDWK5C"; // Admin's User ID

const AdminPage: React.FC = () => {
  const { isSignedIn, user } = useUser();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    if (isSignedIn && user && user.id === ADMIN_USER_ID) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, [isSignedIn, user]);

  if (!isSignedIn) {
    return (
      <>
        <Navbaradmin />
        <div className="flex flex-col items-center justify-center pt-24 bg-white text-black px-4 min-h-screen">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p>Please sign in as the admin to access this page.</p>
        </div>
      </>
    );
  }

  if (!isAuthorized) {
    return (
      <>
        <Navbaradmin />
        <div className="flex flex-col items-center justify-center pt-24 bg-white text-black px-4 min-h-screen">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p>You do not have permission to view this page.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbaradmin />
      <div className="flex flex-col items-center justify-start pt-24 bg-white text-black px-4 min-h-screen">
        <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
        <MintingControl />
        <UserList />
      </div>
    </>
  );
};

export default AdminPage;
