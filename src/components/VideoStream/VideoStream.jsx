import React from "react";

export class VideoStream extends React.Component {
    constructor(props) {
      super(props);
      this.videoRef = React.createRef();
    }
  
    render() {
      return <video {...this.props} autoPlay ref={this.videoRef} />;
    }
  
    componentDidMount() {
      this.updateVideoStream();
    }
  
    componentDidUpdate() {
      this.updateVideoStream();
    }
  
    updateVideoStream() {
      if (this.props.stream && this.videoRef.current.srcObject !== this.props.stream) {
        this.videoRef.current.srcObject = this.props.stream;
      }
    }
  }