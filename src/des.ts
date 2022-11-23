import {
  IP,
  E,
  PC1,
  PC2,
  ShiftTable,
  sBox as sBoxTable,
  P,
  IpInverse,
} from "./des.const";

const prepareKey = (key: string, length: number) => {
  const keyHex = key.padEnd(length, "A").slice(0, length);
  return keyHex;
};

export const decrypt = (data: string, key: string) => {
  key = prepareKey(key, data.length);

  const subKeys = generateSubKeys(key);
  return des(data, subKeys.reverse());
};

export const encrypt = (data: string, key: string) => {
  key = prepareKey(key, data.length);
  const subKeys = generateSubKeys(key);
  return des(data, subKeys);
};

export const textToHex = (text: string) => {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += text.charCodeAt(i).toString(16);
  }
  return result.toUpperCase();
};
export const hexToText = (hexText: string) => {
  let result = "";
  for (let i = 0; i < hexText.length; i += 2) {
    result += String.fromCharCode(parseInt(hexText.substr(i, 2), 16));
  }
  return result;
};

const des = (data: string, subKeys: string[]) => {
  const dataBin = hexToBin(data);
  const IPData = permutation(dataBin, IP);

  const L0 = IPData.slice(0, IPData.length / 2);
  const R0 = IPData.slice(IPData.length / 2, IPData.length);

  let previousL = L0;
  let previousR = R0;

  for (let i = 0; i < 16; i++) {
    const L = previousR;
    const eResult = permutation(previousR, E);
    const xorResult = xor(subKeys[i], eResult);
    const sResult = sBox(xorResult);

    // console.log("SBOX", i, sResult);
    const pResult = permutation(sResult, P);
    const R = xor(pResult, previousL);

    // console.log("L" + i, L);
    // console.log("R" + i, R);

    previousL = L;
    previousR = R;
  }

  const RL = previousR + previousL;
  const result = permutation(RL, IpInverse);

  const hexResult = binToHex(result);

  return hexResult.toUpperCase();
};

const sBox = (data: string) => {
  const chunks = data.match(/.{1,6}/g);
  if (!chunks) return "";

  const result = chunks.map((group, sBox) => {
    const row = parseInt(group[0] + group[5], 2);
    const col = parseInt(group.slice(1, 5), 2);
    const value = sBoxTable[sBox][16 * row + col];
    return value.toString(2).padStart(4, "0");
  });

  return result.join("");
};

const xor = (a: string, b: string) => {
  // console.log({ a, b });

  const result: number[] = [];
  for (let i = 0; i < a.length; i++) {
    result.push(parseInt(a[i]) ^ parseInt(b[i]));
  }
  return result.join("");
};

const generateSubKeys = (key: string) => {
  let subKeys: string[] = [];

  const keyBin = hexToBin(key);
  const pc1Result = permutation(keyBin, PC1);

  const C0 = pc1Result.slice(0, pc1Result.length / 2);
  const D0 = pc1Result.slice(pc1Result.length / 2, pc1Result.length);

  let previousC = C0;
  let previousD = D0;

  ShiftTable.forEach((shift) => {
    const C = strShift(previousC, shift);
    const D = strShift(previousD, shift);
    previousC = C;
    previousD = D;
    const CD = C + D;
    const pc2Result = permutation(CD, PC2);
    subKeys.push(pc2Result);
  });

  return subKeys;
};

const strShift = (data: string, shift: number) => {
  return data.slice(shift, data.length) + data.slice(0, shift);
};

const permutation = (data: string, table: number[]) => {
  const temp = table
    .map((index) => {
      return data[index - 1];
    })
    .join("");
  return temp;
};

const hexToBin = (hexText: string) => {
  const chunks = hexText.match(/.{1,2}/g);
  if (chunks === null) return "";
  const binText = chunks
    .map((chunk) => {
      return parseInt(chunk, 16).toString(2).padStart(8, "0");
    })
    .join("");
  return binText;
};

const binToHex = (binText: string) => {
  const chunks = binText.match(/.{1,8}/g);
  if (chunks === null) return "";
  const hexText = chunks
    .map((chunk) => {
      return parseInt(chunk, 2).toString(16).padStart(2, "0");
    })
    .join("");
  return hexText;
};
