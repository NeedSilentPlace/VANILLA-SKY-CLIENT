import React, { Component } from 'react';
import { FaAngleDoubleUp, FaAngleDoubleDown, FaRedoAlt, FaUndoAlt } from "react-icons/fa";
import './Controller.css';
import io from 'socket.io-client';

class Controller extends Component {
  onCommand(command) {
    const socket = io('http://localhost:8000');
    return () => socket.emit('command', command);
  }
  render() {
    const { type } = this.props;
    const distance = 50;
    if(type === 'heightAndPan') {
      return (
        <div className='controller'>
          <div className='content' onClick={this.onCommand(`up ${distance}`)}><FaAngleDoubleUp /></div>
          <div className='middlePart'>
            <div className='content' onClick={this.onCommand(`ccw 45`)}><FaUndoAlt /></div>
            <div className='content center'></div>
            <div className='content' onClick={this.onCommand(`cw 90`)}><FaRedoAlt /></div>
          </div>
          <div className='content' onClick={this.onCommand(`down ${distance}`)}><FaAngleDoubleDown /></div>
        </div>
      );
    } else {
      return (
        <div className='controller'>
          <div className='content yellow' onClick={this.onCommand(`forward ${distance}`)}>F</div>
          <div className='middlePart'>
            <div className='content blue' onClick={this.onCommand(`left ${distance}`)}>L</div>
            <div className='content center'></div>
            <div className='content red' onClick={this.onCommand(`right ${distance}`)}>R</div>
          </div>
          <div className='content green' onClick={this.onCommand(`back ${distance}`)}>B</div>
        </div>
      );
    }
  }
}

export default Controller;
