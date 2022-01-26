import React, { useCallback, useEffect, useMemo } from "react";
import "./App.css";

const MAX = 20;

function App() {
  const [words, setWords] = React.useState<string[]>([]);
  const [regexp, setRegexp] = React.useState<string>("");

  useEffect(() => {
    (async () => {
      const res = await fetch("./5-letter-word.txt");
      const words = await res.text();
      setWords(words.split("\n"));
    })();
  }, []);

  const onRegexpChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >((e) => setRegexp(e.target.value), [setRegexp]);

  const filteredWords = useMemo(
    () =>
      words.filter((word) => {
        if (regexp === "") return true;
        try {
          return new RegExp(regexp, "i").test(word);
        } catch (e) {
          return false;
        }
      }),
    [words, regexp]
  );

  return (
    <div className="app">
      <div className="header">
        <div className="title">5 letter word</div>
      </div>
      <div className="body">
        <p>This is a tool for those who are curious about 5-letter words.</p>
        <p>
          Data source:{" "}
          <a href="https://github.com/dwyl/english-words">
            https://github.com/dwyl/english-words
          </a>
        </p>
        <p>
          regexp:{" "}
          <input
            type="text"
            style={{ width: "60%" }}
            onChange={onRegexpChange}
          />
        </p>

        <ul>
          {filteredWords.slice(0, MAX).map((word, index) => {
            const encoded = encodeURIComponent(word);
            const alc = `https://eow.alc.co.jp/search?q=${encoded}`;
            const phrase = `https://www.playphrase.me/#/search?q=${encoded}`;
            const merriam = `https://www.merriam-webster.com/dictionary/${encoded}`;
            return (
              <li key={index}>
                {word}{" "}
                <small>
                  <a target="_blank" rel="noreferrer" href={merriam}>
                    merriam
                  </a>{" "}
                  <a target="_blank" rel="noreferrer" href={alc}>
                    alc
                  </a>{" "}
                  <a target="_blank" rel="noreferrer" href={phrase}>
                    phrase
                  </a>
                </small>
              </li>
            );
          })}
          {filteredWords.length > MAX ? (
            <li>and more... {filteredWords.length - MAX} words.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}

export default App;
