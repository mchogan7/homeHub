import React, { Component } from 'react';
import './App.css';
import DeviceProvider from './DeviceProvider.js'
import {DeviceContext} from './DeviceProvider.js'


 class App extends Component {
  render() {
    return (
      <DeviceProvider>
        <Company />           
      </DeviceProvider>
    );
  }
}

const Company = () => {
  return (
    <DeviceContext.Consumer>
      {(DeviceContext) => (
      DeviceContext.data &&
      DeviceContext.data.map((devices) =>
      <p key={devices.deviceID}>{devices.deviceName}</p>
      )
      )}
  
    </DeviceContext.Consumer>
  );
}

export default App;
