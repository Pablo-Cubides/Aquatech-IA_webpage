"use client";

import React, { createContext, useContext, ReactNode, useRef, useEffect } from "react";

export function ProcessProvider({
  children,
  user,
}: {
  children: ReactNode;
  user?: any;
}) {
  const userRef = useRef(user);
  
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  return <>{children}</>;
}
