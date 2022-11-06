"use client";

import { CSSProperties } from "react";
import { useDroppable } from "@dnd-kit/core";

export function Canvas({
  children,
  style,
}: {
  children?: React.ReactNode;
  style: CSSProperties;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });

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
