import React, { useState } from "react";
import { useDispatch } from "react-redux";
import LinearProgress from '@material-ui/core/LinearProgress';
import { Box, Typography, Button, ListItem, withStyles } from '@material-ui/core';
import UploadService from "../services/file-upload.service";
import {
  SET_PROFILEPICTURE,
} from "../actions/types";

const UploadImages = (props) => {

  const [currentFile, setCurrentFile] = useState(undefined);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();

  const selectFile = (event) => {
    setCurrentFile(event.target.files[0]);
    setProgress(0);
    setMessage("");
  }

  const refresh = () => {
      setCurrentFile(undefined);
    setProgress(0);
    setMessage("");
    setIsError(false);
  }

  const upload = () => {
    setProgress(0);

    UploadService.upload(currentFile, (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        setMessage(response.data.message);
        setIsError(false);
        UploadService.getProfilePic(props.email)
          .then((response) => {
            const profilePicture = response.data[0].profilePicture;
            console.log(profilePicture);
            const user = { ...props.user, profilePicture: profilePicture };
            dispatch({
              type: SET_PROFILEPICTURE,
              payload: { user: user },
            })
            refresh();
          })
          .catch((e) => {
            console.log(e);
          });


      })
      .catch((e) => {
        setProgress(0);
        setMessage("Could not upload the image!");
        setCurrentFile(undefined);
        setIsError(true);
      })

  }

  const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 15,
      borderRadius: 5,
    },
    colorPrimary: {
      backgroundColor: "#EEEEEE",
    },
    bar: {
      borderRadius: 5,
      backgroundColor: '#1a90ff',
    },
  }))(LinearProgress);

  return (
    <div className="mg20">
      <label htmlFor="btn-upload">
        <input
          id="btn-upload"
          name="btn-upload"
          style={{ display: 'none' }}
          type="file"
          accept="image/*"
          onChange={selectFile} />
        <Button
          className="btn-choose"
          variant="outlined"
          component="span" 
          style={{marginTop: "7%"}}>
          Choose Image
          </Button>
      </label>
      <div className="file-name">
        {currentFile ? currentFile.name : null}
      </div>
      <Button
        className="btn-upload"
        color="primary"
        variant="contained"
        component="span"
        disabled={!currentFile}
        onClick={upload}>
        Upload
        </Button>

      {currentFile && (
        <Box className="my20" display="flex" alignItems="center">
          <Box width="100%" mr={1}>
            <BorderLinearProgress variant="determinate" value={progress} />
          </Box>
          <Box minWidth={35}>
            <Typography variant="body2" color="textSecondary">{`${progress}%`}</Typography>
          </Box>
        </Box>)
      }

      {message && (
        <Typography variant="subtitle2" className={`upload-message ${isError ? "error" : ""}`}>
          {message}
        </Typography>
      )}

    </div>
  );
}
export default UploadImages;