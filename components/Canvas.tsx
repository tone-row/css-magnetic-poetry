"use client";

import { useDroppable } from "@dnd-kit/core";

export function Canvas({ children }: { children?: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });

  return (
    <div
      ref={setNodeRef}
      className={"canvas__canvas " + (isOver ? "over" : "")}
    >
      {children}
    </div>
  );
}
