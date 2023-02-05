export type Token = {
  kind:
    | "whitespace"
    | "newline"
    | "comment"
    | "string"
    | "keyword"
    | "id"
    | "operator"
    | "lparen"
    | "rparen"
    | "lbracket"
    | "rbracket"
    | "comma"
    | "number";
  content: string;
  line: number;
  column: number;
};

class LuaTokneizeError extends Error {}

export const tokenize = (lua: string): Token[] => {
  let index = 0;
  let line = 1;
  let column = 1;
  const tokens: Token[] = [];

  const testAddAndAdvance = (kind: Token["kind"], regexp: RegExp) => {
    regexp.lastIndex = index;
    const results = regexp.exec(lua);
    const result = results?.[0];

    if (!result) return false;

    if (kind !== "whitespace") {
      tokens.push({ kind, content: result, line, column });
    }

    index += result.length;
    if (kind === "newline") {
      line += Array.from(result.matchAll(/\n/g)).length;
      column = 1;
    } else if (kind === "comment") {
      line += Array.from(result.matchAll(/\n/g)).length;
      column = result.split("\n").pop()!.length - 1;
    } else column += result.length;

    return true;
  };

  while (index < lua.length) {
    if (testAddAndAdvance("newline", /(?:\r?\n)/y)) continue;
    if (
      testAddAndAdvance("string", /(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/y)
    ) continue;
    if (testAddAndAdvance("comment", /(?:--\[\[[\s\S]*--\]\]|--.*)/y)) continue;
    if (testAddAndAdvance("operator", /(?:=|\^|\+|\.|\*)/y)) continue;
    if (
      testAddAndAdvance(
        "keyword",
        /(?:and|break|do|else|elseif|end|false|for|function|if|in|local|nil|not|or|repeat|return|then|true|until|while)/y,
      )
    ) continue;
    if (testAddAndAdvance("id", /[A-Za-z][A-Za-z0-9_]*/y)) continue;
    if (testAddAndAdvance("whitespace", /[ \t]+/y)) continue;
    if (testAddAndAdvance("lparen", /\(/y)) continue;
    if (testAddAndAdvance("rparen", /\)/y)) continue;
    if (testAddAndAdvance("lbracket", /\[/y)) continue;
    if (testAddAndAdvance("rbracket", /\]/y)) continue;
    if (testAddAndAdvance("comma", /,/y)) continue;
    if (
      testAddAndAdvance(
        "number",
        /-?(?:\d+(?:\.\d*)?|\.\d+)(?:e(?:\+|-)?\d+)?/y,
      )
    ) continue;

    let lineStart = lua.lastIndexOf("\n", index);
    if (lineStart === -1) lineStart = 0;
    else lineStart++;

    let lineEnd = lua.indexOf("\n", index);
    if (lineEnd === -1) lineEnd = lineStart + lua.length - lineStart;

    console.log(lineStart, lineEnd);

    throw new LuaTokneizeError(
      `Unexpected content at index ${index}:\n${
        lua.slice(lineStart, lineEnd)
      }\n${" ".repeat(index - lineStart)}^`,
    );
  }

  return tokens;
};
