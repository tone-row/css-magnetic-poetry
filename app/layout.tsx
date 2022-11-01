import "../styles/style.css";

import { Smiley } from "../components/Smiley";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>CSS Magnetic Poetry</title>
      </head>
      <body>
        <div className="page">{children}</div>
        <footer>
          <Smiley />
          <span>Made by Tone Row</span>
          <span className="suggestion follow-us">Follow Us!</span>
        </footer>
      </body>
    </html>
  );
}
