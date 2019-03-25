import React, { Component } from 'react';
import Header from './components/Header';
import ControlBox from './components/ControlBox';
import picture from './master.PNG';
import { FaceMatcher, detectSingleFace, loadSsdMobilenetv1Model, loadFaceLandmarkModel, loadFaceRecognitionModel } from 'face-api.js';

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
                          .withFaceDescriptor()
    if(result) {
      const faceMatcher = new FaceMatcher(result);
      console.log(faceMatcher);
      this.setState({
        faceMatcher
      });
      // const singleResult = await detectSingleFace('person')
      //                             .withFaceLandmarks()
      //                             .withFaceDescriptor()
      // if(singleResult) {
      //   const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor);
      //   console.log(bestMatch);
      // }
    } else {
      console.log('noope', result);
    }
    
  }
  render() {
    console.log(this.state);
    return (
      <div>
        <Header />
        <ControlBox standard={this.state.faceMatcher} />
        <img id='master' src={picture} alt='stupid' ref={this.myRef} /> 
      </div>
    );
  }
}

export default App;
