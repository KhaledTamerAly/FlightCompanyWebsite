import logo from './logo.svg';
import './App.css';
import React, { Component ,  useState, useEffect } from 'react';
import Search from './components/Search';

class App extends Component 
{
  render() {
    return ( <Search/>
    );
  }
}

export default App;
