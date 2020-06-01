import * as React from "react";
import styles from "./slideshow.module.css";

function Slideshow({ srcArray }) {
  let [execIter, setExecIter] = React.useState(0); // This is the number of times that getImg() has run
  let [position, setPosition] = React.useState(1); // This is the number of the slide that is showed in the carousel
  let [imgArray, setImgArray] = React.useState([
    // The component mounts with a lightweight placeholder image
    <img
      id={`slide${execIter + 1}`}
      src={process.env.PUBLIC_URL + srcArray[0]}
      alt='lorem ipsum'
      key={`deskslide${execIter + 1}`}
    />,
  ]);
  let [goToSlide, setGoToSlide] = React.useState(null);

  React.useLayoutEffect(() => {
    function getImg() {
      // questa funzione serve a caricare le immagini dello slideshow
      // dopo il suo iniziale caricamento (durante il quale viene caricata
      // solo un'immagine segnaposto, molto leggera, v. sopra).
      // Utilizzo questa funzione in modo 🚀 ricorsivo 🚀
      // (attraverso onLoad: ogni nuova immagine chiama nuovamente
      // questa funzione per aggiungere un'altra immagine all'array).
      // La nuova chiamata avviene onLoad, in modo da essere sicuri
      //  di mostrare un'immagine alla volta nella giusta sequenza.
      // La condizione di uscita si raggiunge al termine dell'array

      if (execIter === srcArray.length - 1) {
        // condizione di uscita dalla ricorsione
        return;
      }

      // if (execIter === 0) {
      //   // = se è la prima esecuzione
      //   setTimeout(() => {
      //     setImgArray([
      //       <img
      //         id={`slide${execIter + 1}`}
      //         src={process.env.PUBLIC_URL + srcArray[0]}
      //         alt='lorem ipsum'
      //         key={`deskslide${execIter + 1}`}
      //       />,
      //     ]);
      //     setExecIter(execIter + 1);
      //   }, 500);

      // se è un'esecuzione successiva alla prima
      setImgArray([
        ...imgArray,
        <img
          id={`slide${execIter + 2}`}
          src={process.env.PUBLIC_URL + srcArray[execIter + 1]}
          alt='lorem ipsum'
          key={`deskslide${execIter + 2}`}
          onLoad={() => {
            // questa è la chiamata ricorsiva
            getImg();
          }}
        />,
      ]);
      setExecIter(execIter + 1);
    }

    getImg();
  }, [execIter, imgArray, srcArray]);

  React.useLayoutEffect(() => {
    if (execIter) {
      // se getImg() è già stato eseguito una volta, c'è la prima img nell'array

      let size = document.getElementById(`slide1`).clientWidth;
      const carouselSlides = document.getElementById("carouselSlides");

      const myTransition = (xPosition) => {
        carouselSlides.style.transition = `transform 0.2s ease-in-out`;
        carouselSlides.style.transform = `translateX(-${xPosition}px)`;
      };
      const toSpecificSlide = (index) => {
        myTransition(index * size);
        setPosition(index + 1);
      };
      setGoToSlide(() => toSpecificSlide);
    }
  }, [execIter, setGoToSlide]);

  return (
    <div>
      <h1 className={styles.myH1}>React Slideshow</h1>
      <h2 className={styles.myH2}>
        Super lightweight, optimized for speed and performance.
      </h2>

      <div id='carouselContainer' className={styles.container}>
        <Slides srcArray={srcArray} imgArray={imgArray} />
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

function Slides({ srcArray, imgArray }) {
  return (
    <div id='carouselSlides' className={styles.slides}>
      {!imgArray ? (
        <img
          id={`XXXX`}
          src={process.env.PUBLIC_URL + srcArray[0]}
          alt='lorem ipsum'
          key={`XXXX`}
        />
      ) : (
        imgArray
      )}
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
