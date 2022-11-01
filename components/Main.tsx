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
import _words from "../data/words.json";
import commonWords from "../data/common-words.json";
import create from "zustand";

// shuffle words
const words = _words.concat(commonWords).sort(() => Math.random() - 0.5);

// Place to store words in use
const useCanvas = create<{
  used: { word: string; top: string; left: string }[];
  unused: typeof words;
  active: { word: string; used: boolean } | null;
}>((set) => ({
  used: [],
  unused: words,
  active: null,
}));

const TIMEOUT_BEFORE_MODAL = 1000;

function Inner() {
  const { active } = useDndContext();
  const isDragging = active !== null;
  const used = useCanvas((state) => state.used);
  const unused = useCanvas((state) => state.unused);

  return (
    <main className="page-main">
      <section className="words">
        <p className="suggestion">Press and hold to see a word’s origin</p>
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
        <Canvas>
          {used.map(({ word, top, left }) => (
            <Word word={word} used={true} key={word} style={{ top, left }} />
          ))}
        </Canvas>
        <div className="share-btns">
          <button className="share-btn">Copy URL</button>
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

    const word = event.active.data.current?.word;
    const used = event.active.data.current?.used;

    if (event.over === null) {
      if (used) {
        let baseWord = words.find((w) => w.word === word);

        // remove from canvas
        useCanvas.setState((state) => {
          if (!baseWord) return state;
          return {
            used: state.used.filter((w) => w.word !== word),
            unused: [...state.unused, baseWord],
          };
        });
      }
      return;
    }
    const canvas = event.over?.rect;
    const wordRect = event.active.rect.current.translated;

    if (!wordRect) return;

    const top =
      ((100 * (wordRect.top - canvas.top)) / canvas.height).toFixed(2) + "%";
    const left =
      ((100 * (wordRect.left - canvas.left)) / canvas.width).toFixed(2) + "%";

    if (used) {
      useCanvas.setState((state) => {
        return {
          used: state.used.map((w) => {
            if (w.word === word) {
              return {
                ...w,
                top,
                left,
              };
            }
            return w;
          }),
          active: null,
        };
      });
    } else {
      useCanvas.setState((state) => ({
        used: [
          ...state.used,
          {
            word: event.active.data.current?.word,
            top,
            left,
          },
        ],
        unused: state.unused.filter((w) => w.word !== word),
        active: null,
      }));
    }
  }
}
