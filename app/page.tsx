import { Main } from "../components/Main";
import { Smiley } from "../components/Smiley";
import { Squigglies } from "../components/Squigglies";
export default function Page() {
  return (
    <div className="container">
      <header className="page-header">
        <h1>
          <span>CSS</span> <span>Magnetic</span> <span>Poetry</span>
        </h1>
        <h2>Magnetic Poetry using the words from Cascading Style Sheets</h2>
        <h3>
          <em>What&apos;s all this about?</em>
        </h3>
        <p>
          <strong>I love CSS!</strong> I wanted to build something for no other
          purpose than showing my appreciation for the language and the work of
          the{" "}
          <a href="https://www.w3.org/Style/CSS/members.en.php3#members">
            people who make it
          </a>
          .
        </p>
        <p>
          <strong>Please enjoy this app!</strong> It&apos;s built with Next 13
          and makes use of the new Open Graph Image library, so if you share
          your poem with the world it should appear exactly as you see it here
          🌎 👀
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
        {/* <Squigglies /> */}
      </header>
      <Main />
    </div>
  );
}
