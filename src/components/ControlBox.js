import React, { Component } from 'react';
import Controller from './Controller';
import './ControlBox.css';
import JMuxer from 'jmuxer';
import VideoPlayer from './VideoPlayer';
import io from 'socket.io-client';
import {} from'face-api.js';

class ControlBox extends Component {
  constructor(props) {
    super(props);
  }
  onFlight(command) {
    const socket = io('http://localhost:8000');
    return () => socket.emit('command', command);
  }
  onAir() {
    const socketURL = 'ws://localhost:8080';
    const jmuxer = new JMuxer({
        node: 'player',
        mode: 'video',
        flushingTime: 10,
        fps: 30,
        debug: false,
        onReady: function() {
          console.log('im ready')
        }
    });
    const ws = new WebSocket(socketURL);
    ws.binaryType = 'arraybuffer';
    ws.addEventListener('message', (event) => {
        jmuxer.feed({
        video: new Uint8Array(event.data)
        });
    });
    ws.addEventListener('error', (err) => {
        console.log(err);
    });
  }
  render() {
    return (
      <div className='container'>
      <button onClick={this.onAir}>click me</button>
        <div className='flightControl'>
          <div className='flightBox'>
            <div className='flight' onClick={this.onFlight('takeoff')}>
              TAKE-OFF
            </div>
          </div>
          <Controller type='heightAndPan' />
        </div>
        <VideoPlayer person={this.props.standard} />
        <div className='flightControl'>
          <Controller />
          <div className='flightBox'>
            <div className='flight' onClick={this.onFlight('land')}>
              LAND
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ControlBox;
