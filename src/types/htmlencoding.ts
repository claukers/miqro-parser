import {ParseValueArgs} from "../common";
import {parseString} from "./string";

function decodeHTML(str: string) {
  return str.replace(/&#(\d+);/g, function (match, dec) {
    return String.fromCharCode(dec);
  });
}

function encodeHTML(str: string): string {
  const buf = [];

  for (let i = str.length - 1; i >= 0; i--) {
    buf.unshift(['&#', str[i].charCodeAt(0), ';'].join(''));
  }

  return buf.join('');
}

export function parseEncodeHTML(value: any, args: ParseValueArgs) {
  const str = parseString(value, args);
  if (str === undefined) {
    return undefined;
  } else {
    return encodeHTML(str);
  }
}

export function parseDecodeHTML(value: any, args: ParseValueArgs) {
  const str = parseString(value, args);
  if (str === undefined) {
    return undefined;
  } else {
    return decodeHTML(str);
  }
}
