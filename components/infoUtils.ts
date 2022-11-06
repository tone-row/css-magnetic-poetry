import { Info } from "./types";
import msgpack from "msgpack-lite";

export function getInfoFromString(str: string): Info {
  const info = msgpack.decode(Buffer.from(str, "base64"));
  if (!Array.isArray(info.used)) {
    throw new Error("Invalid hash");
  }
  return info;
}
