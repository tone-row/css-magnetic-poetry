import { Main } from "../components/Main";
import { Smiley } from "../components/Smiley";
export default function Page() {
  return (
    <div className="container">
      <header className="page-header">
        <h1>
          <span>CSS</span> <span>Magnetic</span> <span>Poetry</span>
        </h1>
        <h2>Magnetic Poetry using words from Cascading Style Sheets</h2>
        <h3>
          <em>What&apos;s all this about?</em>
        </h3>
        <p>
          <strong>I love CSS!</strong> I wanted to build something fun to
          celebrate the language and the work of the{" "}
          <a href="https://twitter.com/csswg">people who make it</a>.
        </p>
        <p>
          <strong>Please enjoy this app!</strong> It&apos;s built with Next 13
          and uses{" "}
          <a
            href="https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation"
            target="_blank"
            rel="noreferrer"
          >
            OG Image Generation
          </a>
          , so when you share your poem with the world the preview will appear
          the same as you see it here 🌎 👀
        </p>
        <p>
          <a
            href="https://twitter.com/tone_row_"
            className="sidebar-icon-link tone-row"
            target="_blank"
            rel="noreferrer"
          >
            <Smiley />
            Made by Tone Row
          </a>
        </p>
        <p>
          <a href="https://github.com/tone-row/css-magnetic-poetry">
            View Source
          </a>
        </p>
      </header>
      <Main />
    </div>
  );
}
