import * as React from "react";
import styles from "./slideshow.module.css";

function useInterval(callback, delay) {
  // v. https://overreacted.io/making-setinterval-declarative-with-react-hooks/
  const savedCallback = React.useRef();

  // Remember the latest function.
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function Slideshow({ slideArray, lifter }) {
  const [count, setCount] = React.useState(0);
  let [execIter, setExecIter] = React.useState(0); // This is the number of times that getImg() has run
  let [position, setPosition] = React.useState(1); // This is the number of the slide that is showed in the carousel
  let [imgArray, setImgArray] = React.useState([
    <picture key={`deskslidePicture${execIter + 1}`}>
      <source
        srcSet={`${process.env.PUBLIC_URL}${slideArray[0][0]}.webp`}
        key={`deskslideWebP${execIter + 1}`}
        type='image/webp'
      />
      <img
        id={`slide${execIter + 1}`}
        srcSet={`${process.env.PUBLIC_URL}${slideArray[0][0]}.jpg`}
        alt={`${slideArray[0][1]}`}
        key={`deskslide${execIter + 1}`}
      />
    </picture>,
  ]);
  let [goToSlide, setGoToSlide] = React.useState(null);

  useInterval(() => {
    // v. https://overreacted.io/making-setinterval-declarative-with-react-hooks/
    setCount(count + 1);

    if (count > 0 && count % 3 === 0) {
      if (position < imgArray.length) {
        goToSlide(position);
      } else {
        goToSlide(0);
      }
    }
  }, 1000);

  const getImg = () => {
    // questa funzione serve a caricare le immagini dello slideshow
    // dopo il suo iniziale caricamento.
    // Utilizzo questa funzione in modo 🚀 ricorsivo 🚀
    // (attraverso onLoad: ogni nuova immagine chiama nuovamente
    // questa funzione per aggiungere un'altra immagine all'array).
    // La nuova chiamata avviene onLoad, in modo da essere sicuri
    //  di mostrare un'immagine alla volta nella giusta sequenza.
    // La condizione di uscita si raggiunge al termine dell'array

    console.log(`getImg run`);

    if (execIter === slideArray.length - 1) {
      // condizione di uscita dalla ricorsione
      console.log("exit recursion");
      return;
    }

    setImgArray([
      ...imgArray,
      <picture key={`deskslidePicture${execIter + 2}`}>
        <source
          srcSet={`${process.env.PUBLIC_URL}${
            slideArray[execIter + 1][0]
          }.webp`}
          key={`deskslideWebP${execIter + 1}`}
          type='image/webp'
        />
        <img
          id={`slide${execIter + 2}`}
          srcSet={`${process.env.PUBLIC_URL}${slideArray[execIter + 1][0]}.jpg`}
          alt={`${slideArray[execIter + 1][1]}`}
          key={`deskslide${execIter + 2}`}
          onLoad={() => {
            // questa è la chiamata ricorsiva

            console.log("onLoad");

            getImg();
          }}
        />
      </picture>,
    ]);

    console.log(`execIter: ${execIter}`);
    setExecIter(execIter + 1);
  };

  // React.useEffect(() => {
  //   getImg();
  //   // console.log(`count: ${count}`);
  // }, [execIter, imgArray]);

  // React.useEffect(() => {
  //   getImg();
  //   // console.log(`count: ${count}`);
  // });

  // document.onreadystatechange = function () {
  //   if (document.readyState === "complete") {
  //     console.log("complete");
  //     getImg();
  //   }
  // };

  // React.useEffect(function () {
  // lifter(getImg);
  // });

  useInterval(getImg, 1000);

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
        <Slides imgArray={imgArray} />
      </div>

      <Indicators
        imgArray={imgArray}
        goToSlide={goToSlide}
        position={position}
      />
      <p>{count}</p>
    </div>
  );
}

export default Slideshow;

function Slides({ imgArray }) {
  console.log(`imgArray.length: ${imgArray.length}`);
  // React.useEffect(function () {
  //   console.log("Slides: getImg run");
  //   getImg();
  // });
  return (
    <div id='carouselSlides' className={styles.slides}>
      {imgArray ? imgArray : null}
      {/* imgArray */}
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
      // console.log("nextSlide fired");
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
