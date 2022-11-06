import _words from "../data/words.json";
import commonWords from "../data/common-words.json";
const words = _words
  .concat(commonWords)
  .sort((a, b) => a.word.localeCompare(b.word));

export { words };
