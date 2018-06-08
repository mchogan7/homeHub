import React, { Component } from 'react';
export const AppContext = React.createContext();
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

class DeviceProvider extends Component {
  state = {
     number : 10,
     updateState: () => {
       this.setState({number: this.state.number + 1})
     }
   }
  render() {
     return <AppContext.Provider value={this.state}>
       {this.props.children} 
     </AppContext.Provider>
   }
 }

 export default DeviceProvider;