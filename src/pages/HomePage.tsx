import {
  Backdrop,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Pagination,
  TextField,
} from "@mui/material";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import DownloadImage from "../assets/images/download.png";
import React, { ChangeEventHandler, useContext, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import axios from "axios";
import { Image, Root } from "../extras/types";
import SingleComponent from "../components/SingleComponent";
import ImageComponent from "../components/ImageComponent";
import ReactJson from "react-json-view";
import FeatureIntro from "../components/FeatureIntro";
import { ColorContext } from "../extras/ColorContext";

const API_BASE_URL = `http://192.168.1.88:9999/extras/v1/api/parsing/depth-scrapping?siteUrl=`;

function HomePage(props: any) {
  const colorContex = useContext(ColorContext);
  const [videoUrl, setVideoUrl] = useState("");
  const [inVideoUrl, setInVideoUrl] = useState("");
  const [audioResponse, setAudioResponse] = useState<any>();
  const [playVideo, setPlayVideo] = useState(false);
  const [isTermsAggred, setIsTermsAggred] = useState(true);
  const [isDownloadSuccess, setIsDownloadSuccess] = useState(false);
  const [open, setOpen] = React.useState(false);
  const scrollRef = useRef<any>(null);

  const [displayedItems, setDisplayedItems] = useState<Image[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  

  useEffect(() => {
    scrollToDiv();
    // setIsDownloadSuccess(true);
    // setDisplayedItems(audioResponse.links.slice(0, itemsPerPage));
    return () => {};
  }, [colorContex.color]);

  
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): any {
    setVideoUrl(event.target.value);
    if (videoUrl !== "" || videoUrl.includes("youtu")) {
      //setPlayVideo(true);
    } else {
      setPlayVideo(false);
    }
  }

  function handleCheckboxChange(checked: boolean) {
    setIsTermsAggred(checked);
    //setPlayVideo(checked);
  }

  function fetchDownloadableLink(): void {
    if (!isTermsAggred) {
      alert("Please Agree with our Terms & Condition before procedding..");
      return;
    }

    if (videoUrl === "" || !videoUrl.startsWith("https://www")) {
      alert("A Valid Website URL[https://www] is Required!!");
      return;
    }
    handleOpen();
    axios.post<Root>(API_BASE_URL + videoUrl).then(
      (result) => {
        console.log("Hitting Website Parser  API is successful");
        setPlayVideo(true);
        setInVideoUrl(videoUrl);

        setAudioResponse(result.data);
        //setDisplayedItems(result.data.images.slice(0, itemsPerPage));
        setIsDownloadSuccess(true);
        setTimeout(() => {
          handleClose();
          setVideoUrl("");
        }, 5000);
      },
      (error) => {
        console.log("Something went wrong while hitting data.." + error);
        handleClose();
        alert("Something went wrong while hitting data.. [" + error + " ]");
      }
    );
  }

  function handleVideoPlay(): any {
    if (videoUrl === "" || !videoUrl.startsWith("https://")) {
      alert("A Valid Website URL is Required!!");
      return;
    }
    window.open(videoUrl, "_blank");
  }

  function scrollToDiv() {
    scrollRef.current.scrollIntoView();
  }

  const backdrop = (
    <React.Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <div className="flex flex-col items-center">
          <CircularProgress color="inherit" />
          <h1 className="font-extrabold m-2 text-white text-xl">
            Communicating with server...
          </h1>
        </div>
      </Backdrop>
    </React.Fragment>
  );

  return (
    <div
      ref={scrollRef}
      className="md:m-10 sm:m-5 flex flex-col items-center justify-center"
    >
      {backdrop}
      <FeatureIntro
        heading="Only keyword scrapper you need"
        desc="Ditch generic keywords and discover powerful, untapped gems with our advanced scraper. Say goodbye to endless brainstorming and hello to targeted content that dominates search engines. No more tedious manual research. Automate your keyword discovery, freeing up your time for crafting content that truly shines."
      />
      <div className="flex flex-col items-center border shadow-lg p-4">
        <TextField
          fullWidth
          value={videoUrl}
          onChange={handleChange}
          id="url-input"
          label="Enter Website Link To Scrap"
          variant="outlined"
        />
        <Button
          onClick={fetchDownloadableLink}
          sx={{ marginTop: "20px", marginBottom: "10px", width: "200px" }}
          variant="contained"
        >
          Scrap Website
        </Button>
        <Button
          onClick={handleVideoPlay}
          sx={{ width: "200px", marginTop: "10px", marginBottom: "15px" }}
          variant="outlined"
        >
          Visit Website
        </Button>
        <h3 className="text-xs text-center w-80 m-2">
          A direct list of result will get triggered if video has only one
          format else a list of downloadable video will get presented.
        </h3>
        <div className="flex items-center justify-center">
          <Checkbox
            onChange={(e) => handleCheckboxChange(e.target.checked)}
            defaultChecked
          />
          <h3 className="text-xs text-center m-2">
            By scrapping 3rd party websites you agree to our terms & conditions
            for fair usages policy
          </h3>
        </div>
        <Divider color="black" />
      </div>

      <br />
      <br />
      {isDownloadSuccess && (
        <div className="border-2 text-center border-blue-500 shadow-sm p-4 mb-8">
          <div className="flex flex-col items-center md:flex-row font-mono mb-5 justify-center">
            <h3 className="font-bold text-xl">Website Scrapping Successful</h3>
            <img
              className="m-2"
              width="30px"
              height="30px"
              alt="download"
              src={DownloadImage}
            />
            <img
              className="animate-ping"
              width="30px"
              height="30px"
              alt="download"
              src={DownloadImage}
            />
          </div>
        </div>
      )}

      {isDownloadSuccess && (
        <div className="w-screen">
          <ReactJson
            style={{ overflowX: "scroll" }}
            src={audioResponse}
            enableClipboard={true}
            displayObjectSize={true}
            displayDataTypes={false}
            theme={"colors"}
          />
        </div>
      )}
    </div>
  );
}

export default HomePage;
