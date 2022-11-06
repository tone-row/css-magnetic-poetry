import { Main } from "../components/Main";
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
          <strong>I love CSS!</strong> Sometimes it gets a bad rap. I wanted to
          build something which serves no purpose other than showing my
          appreciation for the language and the work of the people who make it
          what it is today.
        </p>
        <p>
          <strong>Please enjoy this app!</strong> It&apos;s built with Next 13
          with special attention for the new Open Graph Image library, so if you
          share your poem with the world it should appear exactly as you see it
          here.
        </p>
        <p>
          <a href="https://twitter.com/tone_row_">Made by Tone Row</a>
        </p>
        <p>
          <a href="https://github.com/tone-row/css-magnetic-poetry">
            View on Github
          </a>
        </p>
        {/* <Squigglies /> */}
      </header>
      <Main />
    </div>
  );
}
