import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './App.scss';

let questions: string[] = [ // "Do ${subject} ${question}?"
    'release on Friday',
    'pull all-nighters',
    'work the night shift',
    'get up at the crack of dawn',
    'code on weekends',
    'code at high noon',
    'have a life beside coding',
    'code at all'
]

function App(): JSX.Element {
  return (
    <div className="App">
      <Header/>
      <main className="bounded">
        <h1>Do</h1>
        <h1>…release on Fridays?</h1>
      </main>
      <Footer/>
    </div>
  );
}

export default App;
