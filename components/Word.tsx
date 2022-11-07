import { useDraggable } from "@dnd-kit/core";

export function Word({
  word,
  style,
  used,
}: {
  word: string;
  /** Whether or not this word is on the canvas */
  used: boolean;
  style?: React.CSSProperties;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: word,
    data: { word, used },
  });

  return (
    <button ref={setNodeRef} {...listeners} {...attributes} style={style}>
      <div className="word">{word}</div>
    </button>
  );
}
