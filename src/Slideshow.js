import * as React from "react";
import { useDrag } from "react-use-gesture"; // libreria per gestire touch events
import "./slideshow.css";

function useInterval(callback, delay) {
  // setInterval con gli hooks funziona in maniera imprevedibile
  // quindi serviva una soluzione diversa, e qui sotto quella di Dan Abramov
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
  const [execIter, setExecIter] = React.useState(0); // This is the number of times that getImg() has run
  const [position, setPosition] = React.useState(0); // This is the number of the slide that is showed in the carousel
  const [size, setSize] = React.useState(null);

  // Qui sotto si vede che, on mounting, viene caricata solo la prima slide

  const myPictureZero = (
    <picture key={`deskslidePicture0`}>
      {/* <source
        srcSet={`${process.env.PUBLIC_URL}${slideArray[0][0]}.webp`}
        key="deskslideWeb0""
        type="image/webp"
      /> */}
      <img
        id='deskSlide0'
        srcSet={`${process.env.PUBLIC_URL}${slideArray[0][0]}.jpg`}
        type='image/jpg'
        alt={`${slideArray[0][1]}`}
        key='deskSlideJpg0'
        style={{ width: "100%" }}
        onLoad={() => {
          setSize(document.getElementById("deskSlide0").width);
        }}
      />
    </picture>
  );

  let [imgArray, setImgArray] = React.useState([myPictureZero]);
  let [goToSlide, setGoToSlide] = React.useState(null);

  const myPictureZeroModified = (
    <picture key='deskslidePicture0'>
      <img
        id='deskSlide0Modified'
        srcSet={`${process.env.PUBLIC_URL}${slideArray[0][0]}.jpg`}
        type='image/jpg'
        alt={`${slideArray[0][1]}`}
        key='deskSlide0'
        style={{ width: size }}
      />
    </picture>
  );

  // Qui sotto, uso la libreria React Use Gesture per gestire lo swipe sulle immagini del carousel
  const bind = useDrag(({ swipe: [swipeX] }) => {
    if (swipeX < 0) {
      nextSlide();
    }
    if (swipeX > 0) {
      prevSlide();
      return;
    }
  });

  // Questo che segue è l'avanzamento automatico delle slide
  // useInterval(() => {
  //   // v. nota sopra su useInterval()
  //   setCount(count + 1);

  //   if (imgArray.length > 1 && count > 0 && count % 3 === 0) {
  //     if (position < imgArray.length) {
  //       goToSlide(position);
  //     } else {
  //       goToSlide(0);
  //     }
  //   }
  // }, 1000);

  let getImg = () => {
    // questa funzione serve a caricare le immagini dello slideshow
    // dopo il suo mounting.
    // Ogni chiamata di getImg() viene caricata un'immagine

    // INIZIO provvisorio, da migliorare con la condizione di uscita del timer e accorpare con condizione successiva
    if (execIter >= 7) {
      console.log("uscita definitiva");
      getImg = null;
      return;
    }
    // FINE provvisorio, da migliorare con la condizione di uscita del timer e accorpare con condizione successiva

    // console.log("getImg is running");
    // console.log(`execIter: ${execIter}`);
    if (execIter === slideArray.length) {
      // condizione di uscita
      console.log("uscita");
      setExecIter(execIter + 1);
      return;
    }

    if (execIter === 0) {
      console.log("INIZIO sostituzione con myPictureZeroModified");
      // setImgArray([]);
      setImgArray([myPictureZeroModified]);
      console.log(
        `document.getElementById("deskSlide0Modified").width: ${
          document.getElementById("deskSlide0Modified").width
        }`
      );
      console.log("FINE sostituzione con myPictureZeroModified");
      setExecIter(execIter + 1);
      return;
    }

    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(slideArray[execIter][0]);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    setImgArray([
      ...imgArray,
      <picture key={`deskslidePicture${execIter}`}>
        {/* <source
          srcSet={`${process.env.PUBLIC_URL}${
            slideArray[execIter + 1][0]
          }.webp`}
          key={`deskslideWebP${execIter + 1}`}
          type='image/webp'
        /> */}
        <img
          id={`slide${execIter}`}
          srcSet={`${process.env.PUBLIC_URL}${slideArray[execIter][0]}.jpg`}
          /* alt={`${slideArray[execIter][1]}`} */
          alt='provvisorio'
          key={`deskslide${execIter}`}
          style={{ width: size }}
        />
      </picture>,
    ]);

    setExecIter(execIter + 1);
  };

  useInterval(
    function () {
      getImg && getImg();
    },
    // qui sotto l'impostazione del delay di useInterval:
    // la prima chiamata è differita (2000ms) per lasciare tempo al caricamento di tutta l'applicazione
    // dopo la prima, le altre possono essere immediatamente successive
    imgArray.length < slideArray.length
      ? imgArray.length < 2
        ? 1000
        : 10
      : null
  );

  React.useLayoutEffect(() => {
    if (execIter) {
      // se c'è già la prima img nell'array

      // let size = document.getElementById(`deskSlide0`).clientWidth;
      // setSize(document.getElementById(`deskSlide0`).clientWidth);
      const carouselSlides = document.getElementById("carouselSlides");

      const myTransition = (xPosition) => {
        carouselSlides.style.transition = `transform 0.2s ease-in-out`;
        carouselSlides.style.transform = `translateX(-${xPosition}px)`;
      };
      const toSpecificSlide = (index) => {
        setCount(0);
        myTransition(index * size);
        setPosition(index + 1);
      };
      setGoToSlide(() => {
        if (imgArray.length > 1) {
          return toSpecificSlide;
        }
      });
    }
  }, [execIter, setGoToSlide, imgArray.length, size]);

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

  // Per la seguente funzionalità, ho seguito questo tutorial: https://www.pluralsight.com/guides/re-render-react-component-on-window-resize
  React.useEffect(() => {
    function handleResize() {
      console.log("Qui sotto");
      // setSize(document.getElementById(`carouselSlides`).clientWidth); // ok!!!!
      setSize(document.getElementById(`carouselContainer`).clientWidth);

      console.log(`size: ${size}`);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <div>
      <h1 className='myH1'>React Slideshow</h1>
      <h2 className='myH2'>
        Super lightweight, optimized for speed and performance.
      </h2>

      <div id='carouselContainer' className='myContainer' {...bind()}>
        <Slides imgArray={imgArray} />
      </div>

      <Indicators
        imgArray={imgArray}
        slideArray={slideArray}
        goToSlide={goToSlide}
        position={position}
        prevSlide={prevSlide}
        nextSlide={nextSlide}
      />
      <p>
        count: {count} | size: {size} | imgArray.length: {imgArray.length} |
        position: {position} | execIter: {execIter} |
        {imgArray[imgArray.length - 1][0]}
      </p>
    </div>
  );
}

export default Slideshow;

function Slides({ imgArray }) {
  return (
    <div id='carouselSlides' className='mySlides'>
      {imgArray ? imgArray : null}
    </div>
  );
}

function Indicators({
  slideArray,
  imgArray,
  goToSlide,
  position,
  setCount,
  prevSlide,
  nextSlide,
}) {
  if (imgArray.length === 5) {
    return (
      <div className='myIndicators'>
        <button
          onClick={() => {
            prevSlide();
          }}
        >
          back
        </button>
        {slideArray.map((img, index) => {
          return (
            <button
              key={index}
              onClick={() => {
                goToSlide(index);
              }}
              className={position === index + 1 ? "mySelected" : undefined}
            >
              {index + 1}
            </button>
          );
        })}
        <button
          onClick={() => {
            nextSlide();
          }}
        >
          next
        </button>
      </div>
    );
  } else {
    return (
      <div className='myIndicatorsNotActive'>
        <button>back</button>
        {slideArray.map((img, index) => {
          return (
            <button
              key={index}
              className={position === index + 1 ? "mySelected" : undefined}
            >
              {index + 1}
            </button>
          );
        })}
        <button>next</button>
      </div>
    );
  }
}

// const myH1 = {
//   textAlign: "center",
//   lineHeight: "1rem",
// };
// const myH2 = {
//   textAlign: "center",
//   lineHeight: "1rem",
// };

// const myContainer = {
//   backgroundColor: "red",
//   margin: "auto",
//   overflow: "hidden",
//   width: "600px",
//   height: "300px",
//   position: "relative",
// };

// const mySlides = {
//   display: "flex",
//   width: "100%",
//   height: "400px",
// };

// const myIndicators = {
//   margin: "auto",
//   width: "800px",
//   textAlign: "center",
//   marginTop: "1rem",
// };

// const myIndicatorsNotActive = {
//   margin: "auto",
//   width: "800px",
//   textAlign: "center",
//   marginTop: "1rem",
//   opacity: "0.3",
// };

// const "mySelected" = {
//   backgroundColor: "aqua",
// };
