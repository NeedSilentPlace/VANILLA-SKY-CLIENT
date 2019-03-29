import React from 'react';
import ControlBox from '../components/ControlBox';
import Controller from '../components/Controller';
import { FaBatteryFull, FaBatteryHalf, FaBatteryThreeQuarters, FaBatteryQuarter } from "react-icons/fa";
import { shallow } from 'enzyme';

describe('<ControlBox>', () => {
  describe('Render without error', () => {
    it('should include two controller', () => {
      const wrapper = shallow(<ControlBox />);
      
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find(Controller).length).toBe(2);
    });
  });
  
  describe('Change isOnAir value in state', () => {
    it('isOnAir is boolean type', () => {
      const wrapper = shallow(<ControlBox />);
      const wrapperProperty = wrapper.instance();
      expect(wrapperProperty.state.isOnAir).toBe(false);
    });

    it('isOnAir value is changed when button click', () => {
      const wrapper = shallow(<ControlBox />);
      const wrapperProperty = wrapper.instance();

      expect(wrapperProperty.state.isOnAir).toBe(false);
      wrapperProperty.turnOn();
      expect(wrapperProperty.state.isOnAir).toBe(true);
      wrapperProperty.turnOn();
      expect(wrapperProperty.state.isOnAir).toBe(false);
    });
  }); 

  describe('Change battery value in state', () => {
    it('Icon is changed properly', () => {
      const wrapper = shallow(<ControlBox />);
      const wrapperProperty = wrapper.instance();

      expect(wrapper.find(FaBatteryFull).exists()).toBe(true);
      expect(wrapper.find(FaBatteryThreeQuarters).exists()).toBe(false);
      expect(wrapper.find(FaBatteryHalf).exists()).toBe(false);
      expect(wrapper.find(FaBatteryQuarter).exists()).toBe(false);

      wrapperProperty.updateBatteryState(50);

      expect(wrapper.find(FaBatteryFull).exists()).toBe(false);
      expect(wrapper.find(FaBatteryThreeQuarters).exists()).toBe(false);
      expect(wrapper.find(FaBatteryHalf).exists()).toBe(true);
      expect(wrapper.find(FaBatteryQuarter).exists()).toBe(false);
    });
  });
});