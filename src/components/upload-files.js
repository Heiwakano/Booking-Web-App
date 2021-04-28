import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import UploadService from "../services/file-upload.service";
import {
  SET_PROFILEPICTURE,
} from "../actions/types";

class UploadImages extends Component {
  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);

    this.state = {
      currentFile: undefined,
      // previewImage: undefined,
      progress: 0,
      message: "",
      isUploaded: false,
    };
  }
  
  selectFile(event) {
    this.setState({
      currentFile: event.target.files[0],
      // previewImage: URL.createObjectURL(event.target.files[0]),
      progress: 0,
      message: ""
    });
  }

  refresh() {
    this.props.history.push("/profile");
    window.location.reload();
  }

  upload() {
    this.setState({
      progress: 0,
    });


    UploadService.upload(this.state.currentFile, this.props.email, (event) => {
      this.setState({
        progress: Math.round((100 * event.loaded) / event.total),
      });
    })
      .then((response) => {
        this.setState({
          message: response.data.message,
          isUploaded: true,
        });
        UploadService.getProfilePic(this.props.email)
        .then((response)=> {
          const profilePicture = response.data[0].profilePicture;
          const user = {...this.props.user, profilePicture: profilePicture};
          this.props.dispatch({
            type: SET_PROFILEPICTURE,
            payload: { user: user },
          })
        
         
        })
        .catch((e)=> {
          console.log(e);
        });

      
      })
      .catch((e)=> {
        console.log();
      })
     
  }
  

  render() {
    const {
      currentFile,
      // previewImage,
      progress,
      message,
      isUploaded,
    } = this.state;

    return (
      <div>
        <div className="row">
          <div className="col-6">
            <label className="btn btn-default p-0">
              <input type="file" accept="image/*" onChange={this.selectFile} />
            </label>
          </div>

          <div className="col-2">
            <button
              className="btn btn-success btn-sm"
              disabled={!currentFile}
              onClick={this.upload}
            >
              Upload
            </button>
          </div>

          {isUploaded?( <div className="col-2">
            <button
              className="btn btn-success btn-sm"
              disabled={!currentFile}
              onClick={()=>this.refresh()}
            >
              OK
            </button>
          </div>)
          :(<div></div>)}
        </div>

        {currentFile && (
          <div className="progress my-3">
            <div
              className="progress-bar progress-bar-info progress-bar-striped"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: progress + "%" }}
            >
              {progress}%
            </div>
          </div>
        )}

        {/* {previewImage && (
          <div>
            <img className="preview" src={previewImage} alt="" />
          </div>
        )} */}

        {message && (
          <div className="alert alert-secondary mt-3" role="alert">
            {message}
          </div>
        )}

    
      </div>
    );
  }
}
export default connect()(withRouter(UploadImages));