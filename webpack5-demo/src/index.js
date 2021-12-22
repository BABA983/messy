import "./style.css";
import "./style.scss";
import moment from "moment";
console.log("Hello webpack!");
const getUserModule = () =>
  import(/* webpackChunkName: "usersAPI" */ "./common/api");

const btn = document.getElementById("btn");

btn.addEventListener("click", () => {
  getUserModule().then(({ getUsers }) => {
    getUsers().then((json) => console.log(json));
  });
});
const fancyFunc = () => {
  return [1, 2];
};

const [a, b] = fancyFunc();

import React, { useState } from "react";
import { render } from "react-dom";

function App() {
  const [state, setState] = useState("CLICK ME");

  return <button onClick={() => setState("CLICKED")}>{state}</button>;
}

render(<App />, document.getElementById("root"));
