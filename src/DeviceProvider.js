import React, { Component } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:8004');
socket.connect()

export const DeviceContext = React.createContext();

class DeviceProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {};
      }

      getAllDevices = () => {
        axios.post('http://localhost:8000/getAllDevices')
          .then((response) => {
            let data = Object.values(response.data)
          this.setState({data})
          })
          .catch((error) => {
            console.log(error);
          });

      }

      updateOne = (data) => {
          console.log(data)
          let newState = this.state
          console.log(newState)
          let index = newState.data.findIndex((element) => element.deviceID == data.deviceID)
          newState.data[index] = data
          console.log(data.deviceID + ' ' + index)

          this.setState(newState)
      }

     

   componentDidMount(){
       socket.connect()
    socket.on('updateDevice', (response) => {
        console.log(response)
      this.updateOne(response)
    })
 
    this.getAllDevices()
   }
   
  render() {
     return <DeviceContext.Provider value={this.state}>
       {this.props.children} 
     </DeviceContext.Provider>
   }
 }

 export default DeviceProvider;