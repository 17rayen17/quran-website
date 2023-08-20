import React, { useEffect, useState } from 'react'
import "./Reader.css"
import { useParams } from 'react-router-dom'
import Nav from "../../../nav/Nav"
import Loader from "../../../../Loader"
import { Container } from '@mui/material';
import AudioPlayer from "react-audio-player";

function Reader() {
  const {reader} = useParams()
  const [namesData, setNamesData] = useState([])
  const [readerData, setReaderData] = useState({})

  useEffect(() => {
    fetch("https://mp3quran.net/api/v3/reciters")
      .then((response) => response.json())
      .then((data) => {
        data.reciters.map(d => d.moshaf[0].server.split("/")[3] === reader ? setReaderData(d) : undefined)
      })
      .catch((err) => console.error(err));
  }, [reader]);

  useEffect(() => {
    fetch("https://api.alquran.cloud/v1/meta")
      .then(res => res.json())
      .then(data => setNamesData(data.data.surahs.references))
      .catch(err => console.error(err))
  }, [])

  return (
    <>
      <Nav/>
      {
        namesData.length !== 0 && readerData.length !== 0 ? (
          <Container className='playList'>
            {readerData.moshaf && Array.isArray(readerData.moshaf) ? readerData.moshaf[0].surah_list.split(",").map((d, i) => (
              <div key={i}>
                <AudioPlayer src={`${readerData.moshaf[0].server}${d.padStart(3, '0')}.mp3`} controls/>
                <span>{namesData.map(n => n.number === parseInt(d) ? n.name : "")}</span>
              </div>
            )) : <h4 style={{textAlign: "center"}}>loading...</h4>}
          </Container>
        ) : <Loader/>
      }
    </>
  )
}

export default Reader