import React, { Component } from 'react';
import Header from './components/Header';
import ControlBox from './components/ControlBox';
import picture from './master.PNG';
import { FaceMatcher, detectSingleFace, loadSsdMobilenetv1Model, loadFaceLandmarkModel, loadFaceRecognitionModel } from 'face-api.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      faceMatcher: null
    }
    this.myRef = React.createRef();
  }
  async componentDidMount() {
    await loadSsdMobilenetv1Model('/models');
    await loadFaceLandmarkModel('/models');
    await loadFaceRecognitionModel('/models');
    const result = await detectSingleFace('master')
                          .withFaceLandmarks()
                          .withFaceDescriptor();
    if(result) {
      const faceMatcher = new FaceMatcher(result);
      this.setState({
        faceMatcher
      });
    } else {
      console.log('noope', result);
    }
  }
  render() {
    if(!this.state.faceMatcher) {
      return (
        <div>
        <Header />
        <div className='indicator'>
          <img src='https://aeronux.com/templates/trip/image/loader.gif' alt='load indicator' />
        </div>
        <img id='master' src={picture} alt='owner' ref={this.myRef} /> 
      </div>  
      );
    }
    return (
      <div>
        <Header />
        <ControlBox standard={this.state.faceMatcher} />
      </div>
    );
  }
}

export default App;
