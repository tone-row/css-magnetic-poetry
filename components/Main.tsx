"use client";

import * as ScrollArea from "@radix-ui/react-scroll-area";

import { Dialog, DialogDismiss, useDialogState } from "ariakit/dialog";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDndContext,
} from "@dnd-kit/core";
import { useRef, useState } from "react";

import { Canvas } from "./Canvas";
import { DownArrow } from "./DownArrow";
import { Twitter } from "./Twitter";
import { Word } from "./Word";
import create from "zustand";
import msgpack from "msgpack-lite";
// shuffle words
import { words } from "./words";

// Place to store words in use
const useCanvas = create<{
  unused: typeof words;
  active: { word: string; used: boolean } | null;
}>((set) => ({
  unused: words,
  active: null,
}));

const TIMEOUT_BEFORE_MODAL = 1000;

function Inner() {
  const { active } = useDndContext();
  const isDragging = active !== null;
  // const used = useCanvas((state) => state.used);
  const { used, bg } = getInfoFromHash();
  const usedWords = used.map((word) => word.word);
  const [_, rerender] = useState(0);
  const unused = useCanvas((state) =>
    state.unused.filter((w) => !usedWords.includes(w.word))
  );

  return (
    <main className="page-main">
      <section className="words">
        <p className="suggestion">Press and hold to see a word&apos;s origin</p>
        <ScrollArea.Root asChild>
          <div
            className="word-list__outer"
            style={{
              overflow: isDragging ? "hidden" : "auto",
            }}
          >
            <ScrollArea.Viewport>
              <div className="word-list__inner">
                {unused.map((word) => (
                  <Word word={word.word} used={false} key={word.word} />
                ))}
              </div>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              orientation="horizontal"
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: 10,
              }}
            >
              <ScrollArea.Thumb
                style={{ background: "darkgrey", height: 10 }}
              />
            </ScrollArea.Scrollbar>
          </div>
        </ScrollArea.Root>
        {/* <p className="suggestion scroll">Scroll &rarr;</p> */}
      </section>
      <section className="canvas">
        <p className="suggestion drag-words">
          <DownArrow />
          <span>drag words onto the canvas to compose poem</span>
        </p>
        <Canvas style={{ background: bg }}>
          {used.map(({ word, top, left }) => (
            <Word word={word} used={true} key={word} style={{ top, left }} />
          ))}
        </Canvas>
        <input
          type="text"
          defaultValue={bg}
          onBlur={(e) => {
            updateBgInHash(e.target.value);
            rerender((x) => x + 1);
          }}
        />
        <div className="share-btns">
          <button className="share-btn">Copy Share URL</button>
          <button className="share-btn twitter" aria-label="Tweet">
            <Twitter />
          </button>
        </div>
      </section>
    </main>
  );
}

export function Main() {
  const active = useCanvas((state) => state.active);
  const modalTimeout = useRef<number | null>(null);
  const dialog = useDialogState();
  const [word, setWord] = useState<typeof words[number] | null>(null);
  return (
    <>
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragMove={handleDragMove}
      >
        <Inner />
        <DragOverlay className="drag-overlay">
          {active ? <Word word={active.word} used={active.used} /> : null}
        </DragOverlay>
      </DndContext>
      <Dialog state={dialog} aria-label="Word Info" className="word-info">
        <h2>
          Why{" "}
          <span style={{ fontWeight: 800 }}>&ldquo;{word?.word}&rdquo;</span>?
        </h2>
        <p className="suggestion">
          {word?.word} can be found in {word?.sources.length} properties.
        </p>
        <div className="sources-list">
          {word?.sources.map((source, i) => (
            <p key={i}>
              <a href={source.url}>
                <span className="source-title">{source.title}</span>
                <span className="source-url">{source.url}</span>
              </a>
            </p>
          ))}
        </div>
        <DialogDismiss>Close</DialogDismiss>
      </Dialog>
    </>
  );

  function handleDragStart(event: DragStartEvent) {
    const wordInfo = words.find((w) => w.word === event.active.id);

    if (wordInfo) {
      // set modal timeout
      modalTimeout.current = window.setTimeout(() => {
        // release word
        useCanvas.setState((state) => ({
          active: null,
        }));
        setWord(wordInfo);
        dialog.show();
      }, TIMEOUT_BEFORE_MODAL);
    }

    useCanvas.setState({
      active: {
        word: event.active.data.current?.word,
        used: event.active.data.current?.used,
      },
    });
  }

  function handleDragMove() {
    // cancel the timeout that would open the modal
    if (modalTimeout.current) {
      window.clearTimeout(modalTimeout.current);
      modalTimeout.current = null;
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    if (modalTimeout.current) {
      window.clearTimeout(modalTimeout.current);
      modalTimeout.current = null;
    }

    const word = event.active.data.current?.word as string;
    const used = event.active.data.current?.used as boolean;

    // word not dropped on canvas
    if (event.over === null) {
      if (used) {
        // remove word from url bar
        removeWordFromHash(word);
      }
      return;
    }
    const canvas = event.over?.rect;
    const wordRect = event.active.rect.current.translated;

    // problem getting word
    if (!wordRect) return;

    // get top and left as percentage of canvas position
    const top =
      ((100 * (wordRect.top - canvas.top)) / canvas.height).toFixed(2) + "%";
    const left =
      ((100 * (wordRect.left - canvas.left)) / canvas.width).toFixed(2) + "%";

    // word was already on canvas so we're just moving it
    if (used) {
      updateWordInHash(word, top, left);
      // you might need to set active null
    } else {
      // word was not on canvas so we're adding it
      addWordToHash(word, top, left);
      // you might need to set active null
    }
  }
}

type Info = {
  used: { word: string; top: string; left: string }[];
  bg: string;
};

function setInfoToHash(info: Info) {
  // encode info with hex
  const hash = Buffer.from(msgpack.encode(info)).toString("base64");
  window.location.hash = hash;
}

function getInfoFromHash(): Info {
  if (typeof window === "undefined") return { used: [], bg: "" };
  const hash = window.location.hash.slice(1);
  if (!hash)
    return {
      used: [],
      bg: "",
    };

  try {
    const info = msgpack.decode(Buffer.from(hash, "base64"));
    if (!Array.isArray(info.used)) {
      throw new Error("Invalid hash");
    }
    return info;
  } catch (err) {
    console.error(err);
  }
  return {
    used: [],
    bg: "",
  };
}

function addWordToHash(word: string, top: string, left: string) {
  const info = getInfoFromHash();
  info.used.push({ word, top, left });
  setInfoToHash(info);
}

function removeWordFromHash(word: string) {
  const info = getInfoFromHash();
  info.used = info.used.filter((w) => w.word !== word);
  setInfoToHash(info);
}

function updateWordInHash(word: string, top: string, left: string) {
  const info = getInfoFromHash();
  info.used = info.used.map((w) => {
    if (w.word === word) {
      return {
        word,
        top,
        left,
      };
    }
    return w;
  });
  setInfoToHash(info);
}

function updateBgInHash(bg: string) {
  const info = getInfoFromHash();
  info.bg = bg;
  setInfoToHash(info);
}
