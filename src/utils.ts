import iconv from "iconv-lite";

export const toUtf8 = (text: string) => {
  return iconv.encode(text, "utf8");
};
