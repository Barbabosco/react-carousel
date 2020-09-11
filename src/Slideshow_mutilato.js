import * as React from "react";
import styles from "./slideshow.module.css";

function Slideshow({ srcArray }) {
  let [execIter, setExecIter] = React.useState(0); // This is the number of times that getImg() has run
  let [position, setPosition] = React.useState(1); // This is the number of the slide that is showed in the carousel
  let [imgArray, setImgArray] = React.useState([
    <img
      id={`slide${execIter + 1}`}
      src={process.env.PUBLIC_URL + srcArray[0]}
      alt='lorem ipsum'
      key={`deskslide${execIter + 1}`}
    />,
  ]);
  let [goToSlide, setGoToSlide] = React.useState(null);

  return (
    <div>
      <h1 className={styles.myH1}>React Slideshow</h1>
      <h2 className={styles.myH2}>
        Super lightweight, optimized for speed and performance.
      </h2>

      <div id='carouselContainer' className={styles.container}>
        <Slides imgArray={imgArray} />
      </div>

      <Indicators
        imgArray={imgArray}
        goToSlide={goToSlide}
        position={position}
      />
    </div>
  );
}

export default Slideshow;

function Slides({ imgArray }) {
  return (
    <div id='carouselSlides' className={styles.slides}>
      {imgArray}
    </div>
  );
}

function Indicators({ imgArray, goToSlide, position }) {
  const prevSlide = () => {
    if (position > 1) {
      goToSlide(position - 2);
    }
  };
  const nextSlide = () => {
    if (position < imgArray.length) {
      goToSlide(position);
    }
  };

  return (
    <div className={styles.indicators}>
      <button onClick={() => prevSlide()}>back</button>
      {imgArray.map((img, index) => {
        return (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={position === index + 1 ? styles.selected : undefined}
          >
            {index + 1}
          </button>
        );
      })}
      <button onClick={() => nextSlide()}>next</button>
    </div>
  );
}
