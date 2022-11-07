"use client";

import { CSSProperties, useEffect, useState } from "react";

import { useDroppable } from "@dnd-kit/core";

export function Canvas({
  children,
  style,
}: {
  children?: React.ReactNode;
  style: CSSProperties;
}) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={"canvas__canvas " + (isOver ? "over" : "")}
    >
      {children}
    </div>
  );
}
