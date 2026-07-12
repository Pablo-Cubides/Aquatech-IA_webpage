"use client";
import React from "react";
import HeroTabs from "@/components/HeroTabs";



interface KnowledgeData {
  fundamentos?: Array<{ text?: string }>;
}

export default function ClientHeroTabs({ knowledge }: { knowledge: KnowledgeData }) {
  return <HeroTabs knowledge={knowledge} />;
}
