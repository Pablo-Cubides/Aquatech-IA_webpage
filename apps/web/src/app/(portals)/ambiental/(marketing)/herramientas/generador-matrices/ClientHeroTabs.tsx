"use client";
import dynamic from "next/dynamic";
import React from "react";

// Client-side wrapper: dynamic import must run in a client component when using ssr:false
const HeroTabs = dynamic(
  // Import local component from the correct location
  () => import("@/components/HeroTabs"),
  { ssr: false },
);

export default function ClientHeroTabs({ knowledge }: { knowledge: any }) {
  return <HeroTabs knowledge={knowledge} />;
}
