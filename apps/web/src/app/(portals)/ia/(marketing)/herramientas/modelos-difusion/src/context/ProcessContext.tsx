"use client";

import React, { createContext, useContext, ReactNode, useRef, useEffect } from "react";

// Generic Process Context for tool user tracking and analytics
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
