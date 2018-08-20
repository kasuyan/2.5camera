import React, { Component } from "react";
import charaImage from "./snap.png";

class Camera extends Component {
  constructor(props) {
    super(props);
    this.chara = new Image();
    this.chara.src = "./static/media/snap.9759fa76.png";

    this.state = {
      isSnap: false,
      targetCamera: 0,
      Camera: [],
      iPhoneCamera: "user",
      localStream: null
    };

    this.draw = e => this._draw(e);
    this.gotLocalMediaStream = e => this._gotLocalMediaStream(e);
    this.onSnapShot = e => this._onSnapShot(e);
    this.onSwichCamera = e => this._onSwichCamera(e);
    this.initCamera = e => this._initCamera(e);
    this.onCancel = e => this._onCancel(e);
  }

  _draw() {
    this.canvas.width = document.documentElement.clientWidth;
    this.canvas.height = document.documentElement.clientHeight;
    this.ctx.drawImage(this.video, 0, 0);

    // drawImage
    const charaX = this.canvas.width / 2 - 114 / 2;
    const charaY = this.canvas.height / 2 - 186 / 2;
    this.ctx.drawImage(this.chara, charaX, charaY, 114, 186);
    requestAnimationFrame(this.draw);
  }

  _gotLocalMediaStream(mediaStream) {
    this.setState({
      localStream: mediaStream
    });

    this.video.srcObject = this.state.localStream;
  }

  _initCamera() {
    this.ctx = this.canvas.getContext("2d");
    navigator.mediaDevices
      .enumerateDevices()
      .then(mediaInfo => {
        return mediaInfo.filter(data => {
          return data.kind === "videoinput";
        });
      })
      .then(CameraInfo => {
        this.setState({
          Camera: CameraInfo
        });
        // FIXME this is iPhone Only.

        // for PC
        // optional: [{sourceId: this.state.Camera[this.state.targetCamera].deviceId }]
        return navigator.mediaDevices.getUserMedia({
          video: { facingMode: this.state.iPhoneCamera }
        });
      })
      .then(this.gotLocalMediaStream);

    requestAnimationFrame(this.draw);
  }

  componentDidMount() {
    this.initCamera();
  }

  _onSnapShot() {
    this.img.src = this.canvas.toDataURL("image/webp");
    this.setState({
      isSnap: true
    });
  }

  _onCancel() {
    this.setState({
      isSnap: false
    });
  }

  _onSwichCamera() {
    if (this.state.localStream) {
      this.state.localStream.getVideoTracks().forEach(function(devise) {
        devise.stop();
      });
      this.setState({
        localStream: null
      });
    }
    if (this.state.targetCamera < this.state.Camera.length - 1) {
      this.setState(
        {
          targetCamera: this.state.targetCamera + 1,
          iPhoneCamera: { exact: "environment" }
        },
        () => {
          this.initCamera();
        }
      );
    } else {
      this.setState(
        {
          targetCamera: 0,
          iPhoneCamera: "user"
        },
        () => {
          this.initCamera();
        }
      );
    }
  }

  render() {
    return (
      <div>
        <div
          className="snap_image"
          style={{
            position: "absolute",
            top: 0,
            zIndex: 5,
            display: this.state.isSnap ? "block" : "none"
          }}
        >
          <img src="" ref={img => (this.img = img)} />
          <button className="btn-03" onClick={this.onCancel}>
            やり直し
          </button>
        </div>
        <button className="btn-01" onClick={this.onSnapShot}>
          撮影
        </button>
        <button className="btn-02" onClick={this.onSwichCamera}>
          カメラ切り替え
        </button>
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
