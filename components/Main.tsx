"use client";

import * as ScrollArea from "@radix-ui/react-scroll-area";

import { Dialog, DialogDismiss, useDialogState } from "ariakit/dialog";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { useRef, useState } from "react";

import { Canvas } from "./Canvas";
import { DownArrow } from "./DownArrow";
import Head from "next/head";
import { Info } from "./types";
import Link from "next/link";
import { Twitter } from "./Twitter";
import { Word } from "./Word";
import create from "zustand";
import { examples } from "./examples";
import msgpack from "msgpack-lite";
// shuffle words
import { words } from "./words";

// Place to store words in use
const useCanvas = create<{
  unused: typeof words;
  active: { word: string; used: boolean } | null;
  trigger: number;
}>(() => ({
  unused: words,
  active: null,
  trigger: 0,
}));

const TIMEOUT_BEFORE_MODAL = 1000;

function Inner() {
  const { used, bg } = getInfoFromHash();
  const usedWords = used.map((word) => word.word);
  const unused = useCanvas((state) =>
    state.unused.filter((w) => !usedWords.includes(w.word))
  );
  const _trigger = useCanvas((state) => state.trigger);
  const { urlWithoutHash, searchParams } = getUrlAndSearchParams(used, bg);

  let warnings = [];
  if (bg.includes("radial-gradient")) {
    warnings.push(
      `Radial gradients only work with the shape and location, e.g. "circle at 40% 50"`
    );
  }

  return (
    <>
      <Head>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      <main className="page-main">
        <section id="Instructions">
          <p className="suggestion">
            Instructions:
            <br />
            – Drag words onto the canvas to compose a poem
            <br />– Check out some examples:{" "}
            {examples.reduce((arr, url, i) => {
              arr.push(
                <Link href={url} key={i}>
                  {i + 1}
                </Link>
              );
              if (i < examples.length - 1) {
                arr.push(<>{", "}</>);
              }
              return arr;
            }, [] as JSX.Element[])}
            <br />
            – View preview before sharing
            <br />
            – Share a link to your poem
            <br />
            – Enjoy!
          </p>
        </section>
        <section className="words">
          <p className="suggestion">
            Press and hold to see a word&apos;s origin
          </p>
          <ScrollArea.Root asChild type="always">
            <div className="word-list__outer">
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
                  height: 20,
                  background: `repeating-linear-gradient(
                  291deg,
                  #d1d9ff,
                  #d1d9ff 1px,
                  #fff 1px 6px
                )
                0 0/100% 100%`,
                }}
              >
                <ScrollArea.Thumb
                  style={{ background: "var(--color-blue-dark)", height: 20 }}
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
              <Word key={word} word={word} used={true} style={{ top, left }} />
            ))}
          </Canvas>
          <div className="canvas-controls">
            <label htmlFor="background">Background</label>
            <input
              type="text"
              id="background"
              autoCapitalize="off"
              defaultValue={bg}
              onChange={(e) => {
                updateBgInHash(e.target.value);
                useCanvas.setState((state) => ({
                  ...state,
                  trigger: state.trigger + 1,
                }));
              }}
            />
            <a className="clear-btn" href="/">
              Clear Canvas
            </a>
          </div>
        </section>
        {warnings.length > 0 && (
          <section>
            {warnings.map((warning) => (
              <p className="suggestion warning" key={warning}>
                {warning}
              </p>
            ))}
          </section>
        )}
        <section className="share-btns">
          <a
            className="share-btn"
            href={`${urlWithoutHash}/api/og?${searchParams.toString()}`}
            target="_blank"
            rel="noreferrer"
          >
            Preview
          </a>
          <button
            className="share-btn"
            onClick={() => {
              // get hash
              const hash = window.location.hash.slice(1);
              // create new url
              const newUrl = `${urlWithoutHash}${hash}`;
              // copy to clipboard
              navigator.clipboard.writeText(newUrl);
            }}
          >
            Copy Share URL
          </button>
        </section>
      </main>
    </>
  );
}

function getUrlAndSearchParams(
  used: { word: string; top: string; left: string }[],
  bg: string
) {
  if (typeof window === "undefined") {
    return { urlWithoutHash: "", searchParams: new URLSearchParams() };
  }
  const hash = window.location.hash;
  // get url
  const url = window.location.href;
  // remove hash
  const urlWithoutHash = url.replace(hash, "");
  const data = encodeURIComponent(JSON.stringify({ used, bg }));
  // create search params from info
  const searchParams = new URLSearchParams();
  searchParams.set("data", data);
  return { urlWithoutHash, searchParams };
}

export function Main() {
  const active = useCanvas((state) => state.active);
  const modalTimeout = useRef<number | null>(null);
  const dialog = useDialogState();
  const [word, setWord] = useState<typeof words[number] | null>(null);
  const sources = word?.sources ?? [];
  let uniqueSources: {
    title: string;
    url: string;
  }[] = [];
  for (const source of sources) {
    if (!uniqueSources.find((s) => s.url === source.url)) {
      uniqueSources.push(source);
    }
  }
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
        <div className="dialog-heading">
          <h2>
            <span style={{ fontWeight: 800, color: "var(--color-blue-dark)" }}>
              {word?.word}
            </span>
          </h2>
          <p className="suggestion">
            {word?.word} can be found in {uniqueSources.length} properties.
          </p>
        </div>
        <div className="sources-list">
          {uniqueSources.map((source, i) => (
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

    // temporarily lock scroll on body with class
    document.body.classList.add("scroll-lock");
    // disable touchmove events on body
    document.body.addEventListener("touchmove", preventDefault, {
      passive: false,
    });

    if (!wordInfo) return;

    // set modal timeout
    modalTimeout.current = window.setTimeout(() => {
      // release word
      useCanvas.setState((state) => ({
        active: null,
      }));
      setWord(wordInfo);
      dialog.show();
    }, TIMEOUT_BEFORE_MODAL);

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
    // remove scroll lock
    document.body.classList.remove("scroll-lock");
    // re-enable touchmove events on body
    document.body.removeEventListener("touchmove", preventDefault);

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
        useCanvas.setState((state) => ({
          trigger: Math.random(),
        }));
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

    useCanvas.setState((state) => ({
      trigger: Math.random(),
    }));
  }
}

function preventDefault(e: Event) {
  e.preventDefault();
}

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
  // trigger render
  useCanvas.setState((state) => ({
    active: null,
  }));
}

function updateBgInHash(bg: string) {
  const info = getInfoFromHash();
  info.bg = bg;
  setInfoToHash(info);
}
