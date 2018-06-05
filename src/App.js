import React, { Component } from 'react';
import './App.css';
import Provider from './Provider.js'
import {AppContext} from './Provider.js'


 class App extends Component {
  render() {
    return (
      <Provider>
        <Company />           
      </Provider>
    );
  }
}

const Company = (props) => {
  return (
    <AppContext.Consumer>
      {(context) => (
        <p>{context.number}</p>
      )}
    </AppContext.Consumer>
  );
}

export default App;
