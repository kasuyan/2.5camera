import React, { Component } from "react";

class Camera extends Component {
  constructor(props) {
    super(props);
    navigator.mediaDevices.getUserMedia({ audio: false, video: true });
    this.draw = e => this._draw(e);
  }

  _draw() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx.drawImage(this.video, 0, 0);
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext("2d");
    requestAnimationFrame(this.draw);
  }

  render() {
    return (
      <div>
        <canvas ref={can => (this.canvas = can)} />
        <video
          ref={vid => {
            this.video = vid;
          }}
          autoPlay
          playsInline
        />
      </div>
    );
  }
}

export default Camera;
