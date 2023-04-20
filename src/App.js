import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MailForm from './components/MailForm';
import Campaigns from './components/campaigns/Campaigns';
import Header from './components/header/Header';


function App() {
  return (
    <div className="mycontainer">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Campaigns />} />
          <Route path='/mail/:id' element={<MailForm />} />
        </Routes>
        
      </Router>
      
    </div>
  );
}

export default App;
