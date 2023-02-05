import React, {
  FormEvent,
  useCallback,
  useState,
} from "https://esm.sh/react@18.2.0";
import { Token, tokenize } from "./lua/tokenize.ts";

const LuaTree = ({ lua }: { lua: string }) => {
  let tokens: string | Token[] = [];
  try {
    tokens = tokenize(lua);
  } catch (err) {
    tokens = err.message;
  }

  if (typeof tokens === "string") {
    return <pre>{tokens}</pre>;
  }

  return <pre>{JSON.stringify(tokens, null, 2)}</pre>;
};

export const App = () => {
  const [lua, setLua] = useState("");

  const onLuaInput = useCallback((e: FormEvent<HTMLTextAreaElement>) => {
    setLua(e.currentTarget.value);
  }, []);

  return (
    <div className="container">
      <LuaTree lua={lua} />
      <textarea onInput={onLuaInput}>
        {lua}
      </textarea>
    </div>
  );
};
