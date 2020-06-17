import React from 'react';
import './App.scss';

import List from './components/List.jsx';

function App() {

  function sampleData(count) {
    let a = [];
    for (let i = 0; i < count; i++) {
      a.push(Math.random().toString(36).substring(7));
    }
    return a;
  }

  return (
    <div className="App">
      <List
        // Config
        data={sampleData(210)}
        tableWidth='80'       // %
        cols='7'              // How many columns
        pageCount='10'        // FOr lazy load
        // Header
        headers={['label1', 'label2', 'label3', 'label4', 'label5', 'label6', 'label7']}
        headerRowColor='#f2f2f2'
        headerBorderBottom='1px solid black'
        // Rows
        rowColor='#D6DBC8'
        // Cells
        cellpadding='1%'
        cellAlign='center'>
      </List>
    </div>
  );
}

export default App;
