"use client";

import React, { ReactNode, useRef, useEffect } from "react";

interface User {
  id?: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

export function ProcessProvider({
  children,
  user,
}: {
  children: ReactNode;
  user?: User;
}) {
  const userRef = useRef(user);
  
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  return <>{children}</>;
}
