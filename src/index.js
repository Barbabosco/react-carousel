import * as React from "react";
import ReactDOM from "react-dom";
import Slideshow from "./Slideshow";

let srcArray = [
  "./slide/slide01.jpg",
  "./slide/slide02.jpg",
  "./slide/slide03.jpg",
  "./slide/slide04.jpg",
  "./slide/slide05.jpg",
];

ReactDOM.render(
  <React.StrictMode>
    <Slideshow srcArray={srcArray} />
  </React.StrictMode>,
  document.getElementById("root")
);
