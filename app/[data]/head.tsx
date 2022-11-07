import { getSiteUrl } from "../../components/getSiteUrl";
import msgpack from "msgpack-lite";

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
      <meta property="og:image" content={content} />
    </>
  );
}
