import React from 'react';
import './App.css';
import ActivityHistory from './Components/ActivityHistory';
import HRZoneHistory from './Components/HRZoneHistory';
import Header from './Components/Header';
function App() {

  return (
    <div className="App">
      <Header/>
      <ActivityHistory />
      {/* <HRZoneHistory /> */}
    </div>
  )}

export default App;
