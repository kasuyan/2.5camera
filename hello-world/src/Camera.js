import React, { Component } from "react";

class Camera extends Component {
  constructor(props) {
    super(props);
    this.chara = new Image();
    this.chara.src = "./static/media/snap.9759fa76.png";

    this.draw = e => this._draw(e);
    this.gotLocalMediaStream = e => this._gotLocalMediaStream(e);
    this.onSnapShot = e => this._onSnapShot(e);
  }

  _draw() {
    this.canvas.width = 640;
    this.canvas.height = 480;
    this.ctx.drawImage(this.video, 0, 0);

    //draw image
    const charaX = this.canvas.width / 2 - 114 / 2;
    const charaY = this.canvas.height / 2 - 186 / 2;
    this.ctx.drawImage(this.chara, charaX, charaY, 114, 186);
    requestAnimationFrame(this.draw);
  }

  _gotLocalMediaStream(mediaStream) {
    this.video.srcObject = mediaStream;
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext("2d");
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: true })
      .then(this.gotLocalMediaStream);
    requestAnimationFrame(this.draw);
  }

  _onSnapShot() {
    this.img.src = this.canvas.toDataURL("image/webp");
  }

  render() {
    return (
      <div>
        <img src="" ref={img => (this.img = img)} />
        <button onClick={this.onSnapShot}>撮影</button>
        <p>キャンバスにレンダリング</p>
        <canvas ref={can => (this.canvas = can)} />
        <p>ビデオにレンダー</p>
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
