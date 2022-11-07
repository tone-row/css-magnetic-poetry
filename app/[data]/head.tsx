import { getSiteUrl } from "../../components/getSiteUrl";
import msgpack from "msgpack-lite";
import seo from "../../seo.json";
export default function Head({ params }: { params: { data: string } }) {
  let content = "";
  try {
    // create search params
    if (params.data) {
      // decode
      const decoded = msgpack.decode(Buffer.from(params.data, "base64"));

      // create data
      const data = encodeURIComponent(JSON.stringify(decoded));

      // create search params from info
      const searchParams = new URLSearchParams();

      searchParams.set("data", data);

      // create og url
      content = `${getSiteUrl()}/api/og?${searchParams.toString()}`;
    }
  } catch (e) {
    // console.error(e);
  }
  if (!content) return null;
  return (
    <>
      {/* <!-- Facebook Meta Tags --> */}
      <meta
        property="og:url"
        content="https://css-magnetic-poetry.tone-row.com/"
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={content} />

      {/* <!-- Twitter Meta Tags --> */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        property="twitter:domain"
        content="css-magnetic-poetry.tone-row.com"
      />
      <meta
        property="twitter:url"
        content="https://css-magnetic-poetry.tone-row.com/"
      />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={content} />
    </>
  );
}
