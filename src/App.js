import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MailForm from './components/MailForm';
import Campaigns from './components/campaigns/Campaigns';


function App() {
  return (
    <div className="mycontainer">
      <Router>
        <Routes>
          <Route path="/" element={<Campaigns />} />
          <Route path='/mail/:id' element={<MailForm />} />
        </Routes>
        
      </Router>
      
    </div>
  );
}

export default App;
