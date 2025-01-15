"use client";

import { AppInfoContext } from "@/components/app-wrapper";
import PageWrapper from "@/components/page-wrapper";
import React, { useContext, useEffect } from "react";

const NewUserPage = () => {
  const { userId, token } = useContext(AppInfoContext);
  console.log("New User Page...", userId, token);

  useEffect(() => {
    fetch("/api/user/new", { credentials: "same-origin" }).then((res) =>
      console.log(res)
    );
  }, []);

  return (
    <PageWrapper>
  <div className="space-y-6">
  <h1 className="text-3xl font-bold">Add Users</h1>

  </div>
  </PageWrapper>
  );
};

export default NewUserPage;
