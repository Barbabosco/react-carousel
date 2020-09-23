import * as React from "react";
import ReactDOM from "react-dom";
import Slideshow from "./Slideshow";

const folderName = "./slide-1200/";
const slideArray = [
  [`${folderName}00`, "lorem ipsum00"],
  [`${folderName}01`, "lorem ipsum01"],
  [`${folderName}02`, "lorem ipsum02"],
  [`${folderName}03`, "lorem ipsum03"],
  [`${folderName}04`, "lorem ipsum04"],
];

ReactDOM.render(
  <React.StrictMode>
    <Slideshow slideArray={slideArray} />
  </React.StrictMode>,
  document.getElementById("root")
);
