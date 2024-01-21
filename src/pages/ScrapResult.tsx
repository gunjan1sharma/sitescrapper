import {
  Avatar,
  Backdrop,
  Box,
  CircularProgress,
  Tab,
  Tabs,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { Root, sampleResponse } from "../extras/types";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";

const API_BASE_URL =
  "https://appnor-backend.onrender.com/extras/v1/api/parsing/depth-scrapping?siteUrl=";

function ScrapResult(props: any) {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const location = useLocation();
  const url = location.state?.url;
  const [open, setOpen] = React.useState(false);
  const [audioResponse, setAudioResponse] = useState<any>(sampleResponse);
  const [isDownloadSuccess, setIsDownloadSuccess] = useState(false);

  useEffect(() => {
    // const url = location.state?.url;
    console.log("URL from params : " + url);
    fetchDownloadableLink();
    return () => {};
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  function fetchDownloadableLink(): void {
    if (url === "" || !url.startsWith("https://www")) {
      alert("A Valid Website URL [https://www] is Required!!");
      return;
    }
    handleOpen();

    axios.post(API_BASE_URL + url).then(
      (result) => {
        console.log("Hitting Website Parser  API is successful");

        setAudioResponse(result.data);
        setIsDownloadSuccess(true);
        handleClose();
      },
      (error) => {
        console.log("Something went wrong while hitting data.." + error);
        handleClose();
        alert("Something went wrong while hitting data.. [" + error + " ]");
        navigate("/");
      }
    );
  }

  const filter =
    tabValue === 0
      ? audioResponse["seo"]
      : tabValue === 1
      ? audioResponse["keywords"]
      : tabValue === 2
      ? audioResponse["images"]
      : tabValue === 3
      ? audioResponse["media"]
      : tabValue === 4
      ? audioResponse["links"]
      : tabValue === 5
      ? audioResponse["semantics"]
      : tabValue === 6
      ? audioResponse["programming"]
      : audioResponse["seo"];

  function filterResponse(): Object {
    return tabValue === 0
      ? sampleResponse["seo"]
      : tabValue === 1
      ? sampleResponse["keywords"]
      : tabValue === 2
      ? sampleResponse["images"]
      : tabValue === 3
      ? sampleResponse["media"]
      : tabValue === 4
      ? sampleResponse["links"]
      : tabValue === 5
      ? sampleResponse["semantics"]
      : tabValue === 6
      ? sampleResponse["programming"]
      : sampleResponse["seo"];
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
            Wait..Scrapping given URL
          </h1>
        </div>
      </Backdrop>
    </React.Fragment>
  );

  return (
    <div className="md:flex md:flex-col md:items-center md:w-full">
      {backdrop}
      <br />
      <br />

      <div className="flex items-center md:w-1/2 lg:w-1/2 m-2 p-2 border-2 border-dashed border-gray-500 shadow-md">
        <Avatar src={audioResponse["favicon"]}>{url.substring(0, 1)}</Avatar>
        <div className="ml-2">
          <h2 className="text-xs line-clamp-3 font-bold">
            {audioResponse["title"]}
          </h2>
          <a className="text-xs text-blue-700" href={url}>
            {url}
          </a>
          <h1 className="text-xs line-clamp-3">
            Powerful website scarapping by siteparser.co®
          </h1>
        </div>
      </div>

      <Box sx={{ bgcolor: "background.paper" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons={true}
          allowScrollButtonsMobile
          aria-label="scrollable auto tabs example"
        >
          <Tab
            sx={{ color: "blue", fontWeight: "bold", fontFamily: "monospace" }}
            label="SEO"
          />
          <Tab
            sx={{ color: "blue", fontWeight: "bold", fontFamily: "monospace" }}
            label="Keywords"
          />
          <Tab
            sx={{ color: "blue", fontWeight: "bold", fontFamily: "monospace" }}
            label="Images"
          />
          <Tab
            sx={{ color: "blue", fontWeight: "bold", fontFamily: "monospace" }}
            label="Media"
          />
          <Tab
            sx={{ color: "blue", fontWeight: "bold", fontFamily: "monospace" }}
            label="Links"
          />
          <Tab
            sx={{ color: "blue", fontWeight: "bold", fontFamily: "monospace" }}
            label="Semantic"
          />
          <Tab
            sx={{ color: "blue", fontWeight: "bold", fontFamily: "monospace" }}
            label="Programming"
          />
        </Tabs>
      </Box>

      {isDownloadSuccess && (
        <div className="w-screen">
          <ReactJson
            style={{ overflowX: "scroll", paddingTop: "10px" }}
            src={filter}
            enableClipboard={true}
            displayDataTypes={false}
            collapsed={false}
            theme={"bright"}
          />
        </div>
      )}
    </div>
  );
}

export default ScrapResult;
