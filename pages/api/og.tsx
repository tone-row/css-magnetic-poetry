// @ts-ignore
import * as expand from "css-shorthand-expand";

import { ImageResponse } from "@vercel/og";
import { Info } from "../../components/types";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

// Make sure the font exists in the specified path:
const font = fetch(
  new URL("../../public/fonts/georgia.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function OG(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const data = searchParams.get("data") ?? "%7B%7D";
  const info = JSON.parse(decodeURIComponent(data)) as Info;
  const words = info.used ?? [];
  const fontData = await font;

  const expandedBgProperties = info.bg.includes("gradient")
    ? { backgroundImage: info.bg }
    : expand("background", info.bg ?? "whitesmoke") ?? {};
  // convert kebab case to camel case
  let bgProps: Record<string, string> = {};
  for (const [key, value] of Object.entries(expandedBgProperties)) {
    let newKey = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
    bgProps[newKey] = value as string;
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          fontSize: 128,
          width: "100%",
          height: "100%",
          ...expandedBgProperties,
        }}
      >
        {words.map((word) => (
          <div
            key={word.word}
            style={{
              position: "absolute",
              top: word.top,
              left: word.left,
              boxShadow: "0px 2px 0px 0px rgb(0 0 0 / 30%)",
              color: "#000000",
              fontFamily: "Georgia",
              fontSize: 18 * 2,
              lineHeight: 20 / 18,
              // fontSmooth: "always",
              backgroundColor: "white",
              paddingTop: 5 * 2,
              paddingBottom: 6 * 2,
              paddingRight: 9 * 2,
              paddingLeft: 7 * 2,
              height: 66,
              border: "2px solid #000000",
              borderRadius: 4,
            }}
          >
            {word.word}
          </div>
        ))}
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Georgia",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
}
