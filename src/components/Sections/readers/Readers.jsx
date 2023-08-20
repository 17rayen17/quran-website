import React, { useEffect, useState } from "react";
import "./Readers.css";
import Nav from "../../nav/Nav";
import { Container } from "@mui/material";
import { Link } from "react-router-dom";
import Loader from "../../../Loader";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function Readers() {
  const [readerData, setReaderData] = useState([]);

  useEffect(() => {
    fetch("https://mp3quran.net/api/v3/reciters")
      .then((response) => response.json())
      .then((data) => {
        setReaderData(data.reciters);
        const favArray = JSON.parse(localStorage.getItem("fav")) || [];
        setReaderData((prevData) =>
          prevData.map((d) => ({
            ...d,
            favorited: favArray.includes(d.name),
          }))
        );
      })
      .catch((err) => console.error(err));
  }, []);

  const handleFavoriteClick = (name) => {
    const updatedData = readerData.map((d) => {
      if (d.name === name) {
        const favorited = !d.favorited;
        if (favorited) {
          // Add to favorites
          const favArray = JSON.parse(localStorage.getItem("fav")) || [];
          localStorage.setItem("fav", JSON.stringify([...favArray, name]));
        } else {
          // Remove from favorites
          const favArray = JSON.parse(localStorage.getItem("fav")) || [];
          localStorage.setItem(
            "fav",
            JSON.stringify(favArray.filter((fav) => fav !== name))
          );
        }
        return { ...d, favorited };
      }
      return d;
    });
    setReaderData(updatedData);
  };

  return (
    <>
      <Nav />
      {readerData.length !== 0 ? (
        <Container className="readersList">
          {readerData.map((d, i) => (
            <div className="readerName" key={i}>
              <Link to={`/readers/${d.moshaf[0].server.split("/")[3]}`} className={d.favorited ? "active" : ""}>
                {d.name}
              </Link>
              <button
                type="button"
                data-id={d.name}
                onClick={() => handleFavoriteClick(d.name)}
                className={d.favorited ? "active" : ""}
              >
                {d.favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </button>
            </div>
          ))}
        </Container>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default Readers;
