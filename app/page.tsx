import { Main } from "../components/Main";
import { Squigglies } from "../components/Squigglies";
export default function Page() {
  return (
    <div className="container">
      <header className="page-header">
        <h1>CSS Magnetic Poetry</h1>
        <h2>
          Magnetic poetry using
          <br />
          the words found in
          <br />
          Cascading Style Sheets
        </h2>
        <details>
          <summary>Read More</summary>
          <h3>What&apos;s all this about?</h3>
        </details>
        <Squigglies />
      </header>
      <Main />
    </div>
  );
}
