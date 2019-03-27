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
    this.state = {
      isOnAir: false
    };
    this.onFlight = this.onFlight.bind(this);
  }
  onFlight(command) {
    const socket = io('http://localhost:8000');
    if(command === 'takeoff') {

    } else {

    }
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
    this.setState({
      isOnAir: !this.state.isOnAir
    });
  }
  render() {
    return (
      <div className='container'>
        <div className={this.state.isOnAir ? 'streamOn' : 'streamOff'} onClick={this.onAir.bind(this)}>ON AIR</div>
        <div className='flightContainer'>
          <div className='flightControl left'>
            <div className='flightBox'>
              <div className='flight' onClick={this.onFlight('takeoff')}>
                TAKE-OFF
              </div>
            </div>
            <Controller type='heightAndPan' />
            <div className='flightBox'>
              <div className='flight' onClick={this.onFlight('land')}>
                LAND
              </div>
            </div>
          </div>
          <VideoPlayer person={this.props.standard} />
          <div className='flightControl right'>
            <Controller />
          </div>
        </div>
      </div>
    );
  }
}

export default ControlBox;
