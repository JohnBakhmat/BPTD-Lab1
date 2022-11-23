import { encrypt, decrypt, textToHex, hexToText } from "./des";
import chalk from "chalk";

const dataText = "BakhmatY";

const data = textToHex(dataText);
const key = "AABB09182736CCDD";

const encrypted = encrypt(data, key);
const decrypted = decrypt(encrypted, key);

console.log(
  "DES\n",
  "------------------------\n",
  `Data:               \t${chalk.hex("#ffa500")(dataText)}\n`,
  `PlainText:          \t${chalk.green(data)}\n`,
  `Key:                \t${chalk.magenta(key)}\n`,
  `Encrypted:          \t${chalk.cyan(encrypted)}\n`,
  `Decrypted:          \t${chalk.green(decrypted)}\n`,
  `Decrypted Readable: \t${chalk.hex("#ffa500")(hexToText(decrypted))}\n`,
  `Result:   \t${
    decrypted === data ? chalk.green("Success") : chalk.red("Failed")
  }\n`,
  "------------------------\n"
);
