import * as React from "react";
// import styles from "./slideshow.module.css";

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

    if (imgArray.length > 1 && count > 0 && count % 3 === 0) {
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

    console.log(`getImg run`);

    if (execIter === slideArray.length - 1) {
      // condizione di uscita
      console.log("exit");
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
        />
      </picture>,
    ]);

    console.log(`execIter: ${execIter}`);
    console.log();
    setExecIter(execIter + 1);
  };

  useInterval(
    function () {
      console.log("useInterval run");
      getImg();
    },
    imgArray.length < slideArray.length
      ? imgArray.length < 2
        ? 2000
        : 100
      : null
  );

  React.useLayoutEffect(() => {
    if (execIter) {
      // se c'è già la prima img nell'array

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
      setGoToSlide(() => {
        if (imgArray.length > 1) {
          return toSpecificSlide;
        }
      });
    }
  }, [execIter, setGoToSlide, imgArray.length]);

  return (
    <div>
      <h1 style={myH1}>React Slideshow</h1>
      <h2 style={myH2}>
        Super lightweight, optimized for speed and performance.
      </h2>

      <div id='carouselContainer' style={myContainer}>
        <Slides imgArray={imgArray} />
      </div>

      <Indicators
        imgArray={imgArray}
        slideArray={slideArray}
        goToSlide={goToSlide}
        position={position}
        setCount={setCount}
      />
      <p>{count}</p>
    </div>
  );
}

export default Slideshow;

function Slides({ imgArray }) {
  return (
    <div id='carouselSlides' style={mySlides}>
      {imgArray ? imgArray : null}
    </div>
  );
}

function Indicators({ slideArray, imgArray, goToSlide, position, setCount }) {
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

  if (imgArray.length === 5) {
    return (
      <div style={myIndicators}>
        <button
          onClick={() => {
            prevSlide();
            setCount(0);
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
                setCount(0);
              }}
              style={position === index + 1 ? mySelected : undefined}
            >
              {index + 1}
            </button>
          );
        })}
        <button
          onClick={() => {
            nextSlide();
            setCount(0);
          }}
        >
          next
        </button>
      </div>
    );
  } else {
    return (
      <div style={myIndicatorsNotActive}>
        <button>back</button>
        {slideArray.map((img, index) => {
          return (
            <button
              key={index}
              style={position === index + 1 ? mySelected : undefined}
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

const myH1 = {
  textAlign: "center",
  lineHeight: "1rem",
};
const myH2 = {
  textAlign: "center",
  lineHeight: "1rem",
};

const myContainer = {
  margin: "auto",
  overflow: "hidden",
  width: "800px",
  height: "400px",
  position: "relative",
};

const mySlides = {
  display: "flex",
  width: "100%",
  height: "400px",
};

const myIndicators = {
  margin: "auto",
  width: "800px",
  textAlign: "center",
  marginTop: "1rem",
};

const myIndicatorsNotActive = {
  margin: "auto",
  width: "800px",
  textAlign: "center",
  marginTop: "1rem",
  opacity: "0.3",
};

const mySelected = {
  backgroundColor: "aqua", // da verificare se serve XXXXXXXXXXXXXXXXXXXXXXXXXX
};
