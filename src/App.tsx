import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './styles/main.css';
import Main from './pages/Main';


function App() {


  return (
    <Router>
      <Routes>
        <Route path="/wallet/:address?" element={<Main />} />
        <Route path='*' element={<Navigate to='/wallet/' />} />
      </Routes>
    </Router>
  );
}

export default App;