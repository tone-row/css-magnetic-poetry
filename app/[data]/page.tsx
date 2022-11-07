"use client";

import { useEffect } from "react";

export default function App({ params }: any) {
  useEffect(() => {
    window.location.href = `/#${params.data}`;
  }, [params.data]);
  return <div />;
}
