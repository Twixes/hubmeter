import React from 'react';
import Header from './Header';
import Footer from './Footer';
import './App.scss';

function App(): JSX.Element {
  return (
    <div className="App">
      <Header/>
      <Footer/>
    </div>
  );
}

export default App;
