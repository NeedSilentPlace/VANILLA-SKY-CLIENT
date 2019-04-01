import React, { Component } from 'react';
import Controller from './Controller';
import './ControlBox.css';
import './Controller.css';
import JMuxer from 'jmuxer';
import VideoPlayer from './VideoPlayer';
import io from 'socket.io-client';
import { FaBatteryFull, FaBatteryHalf, FaBatteryThreeQuarters, FaBatteryQuarter } from "react-icons/fa";
import { IconContext } from 'react-icons';

class ControlBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOnAir: false,
      battery: 100
    };
    this.onAir = this.onAir.bind(this);
    this.onFlight = this.onFlight.bind(this);
    this.turnOn = this.turnOn.bind(this);
    this.updateBatteryState = this.updateBatteryState.bind(this);
    this.displayBatteryState = this.displayBatteryState.bind(this);
    this.socket = io('http://localhost:8000');
  }
  componentDidMount() {
    this.socket.on('battery', battery => this.updateBatteryState(battery));
  }
  updateBatteryState(battery) {
    this.setState({
      battery
    });
  }
  displayBatteryState() {
    if(this.state.battery <= 25) {
      return (
        <IconContext.Provider value={{ color: '#f20505', size: '35px' }}>
          <FaBatteryQuarter />
          <span style={{color: '#f20505', marginLeft: '10px'}}>{this.state.battery}%</span>
        </IconContext.Provider>
      );
    }
    if(this.state.battery <= 50) {
      return (
        <IconContext.Provider value={{ color: '#eeba30', size: '35px' }}>
          <FaBatteryHalf />
          <span style={{color: '#eeba30', marginLeft: '10px'}}>{this.state.battery}%</span>
        </IconContext.Provider>
      );
    }
    if(this.state.battery <= 75) {
      return (
        <IconContext.Provider value={{ color: '#8ec127', size: '35px' }}>
          <FaBatteryThreeQuarters />
          <span style={{color: '#8ec127', marginLeft: '10px'}}>{this.state.battery}%</span>
        </IconContext.Provider>
      );
    }
    if(this.state.battery <= 100) {
      return (
        <IconContext.Provider value={{ color: '#35ee8b', size: '35px' }}>
          <FaBatteryFull />
          <span style={{color: '#35ee8b', marginLeft: '10px'}}>{this.state.battery}%</span>
        </IconContext.Provider>
      );
    }
  }
  onFlight(command) {
    return () => this.socket.emit('command', command);
  }
  onAir() {
    const socketURL = 'ws://localhost:8080';
    const jmuxer = new JMuxer({
        node: 'player',
        mode: 'video',
        flushingTime: 10,
        fps: 30,
        debug: false
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
    this.turnOn();
  }
  turnOn() {
    this.setState({
      isOnAir: !this.state.isOnAir
    });
  }
  render() {
    return (
      <div className='container'>
        <div className={this.state.isOnAir ? 'streamOn' : 'streamOff'} onClick={this.onAir}>ON AIR</div>
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
          <div className='battery'>{this.displayBatteryState()}</div>
          <div className='flightControl right'>
            <div style={{ display: 'flex' }}>
              <div className='content distance' onClick={this.onFlight('flip r')}>A</div>
              <div className='content distance' onClick={this.onFlight('flip l')}>B</div>
              <div className='content distance' onClick={this.onFlight('rc 30 30 0 90')}>C</div>
            </div>
            <Controller distance={this.state.distance} />
          </div>
        </div>
      </div>
    );
  }
}

export default ControlBox;
