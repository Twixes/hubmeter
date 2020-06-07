import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './App.scss';

function App(): JSX.Element {
  return (
    <div className="App">
      <Header/>
      <h1>Do</h1>
      <h1>…release on Fridays?</h1>
      <Footer/>
    </div>
  );
}

export default App;
