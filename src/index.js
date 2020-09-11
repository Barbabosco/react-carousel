import * as React from "react";
import ReactDOM from "react-dom";
import Slideshow from "./Slideshow";

const folderName = "./slide-aabb/";
const slideArray = [
  [`${folderName}01`, "lorem ipsum01"],
  [`${folderName}02`, "lorem ipsum02"],
  [`${folderName}03`, "lorem ipsum03"],
  [`${folderName}04`, "lorem ipsum04"],
  [`${folderName}05`, "lorem ipsum05"],
];

ReactDOM.render(
  <React.StrictMode>
    <Slideshow slideArray={slideArray} />
  </React.StrictMode>,
  document.getElementById("root")
);
