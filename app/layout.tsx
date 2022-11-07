import "../styles/style.css";

export default function RootLayout({
  children,
  ...rest
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
      </body>
    </html>
  );
}
