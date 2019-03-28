import React, { Component } from 'react';
import './VideoPlayer.css';
import { detectSingleFace } from 'face-api.js';
import io from 'socket.io-client';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.socket = io('http://localhost:8000');
  }
  async onPlay() {
    const video = document.getElementById('player')
    if(video.paused || video.ended) {
      return setTimeout(() => {
        this.onPlay()
      }, 2000);
    }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')
          .drawImage(video, 0, 0, canvas.width, canvas.height);
    const snapshot = document.createElement('img');
    snapshot.src = canvas.toDataURL();
    const singleResult = await detectSingleFace(snapshot)
                                .withFaceLandmarks()
                                .withFaceDescriptor();
    if(singleResult) {
      const faceMatcher = this.props.person;
      const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor);
      const similarity = bestMatch._distance;
      if(similarity < 0.4) {
        this.socket.emit('command', 'flip b');
      }
      console.log(bestMatch);
    } else {
      console.log('nooooop!');
    }
    setTimeout(() => this.onPlay(), 2000);
  }
  render() {
    return (
      <div className='playerBox'>
        <video id='player' ref={this.myVideo} onPlay={this.onPlay.bind(this)} autoPlay />
      </div>
    );
  }
}

export default VideoPlayer;
