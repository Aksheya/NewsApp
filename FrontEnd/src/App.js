import React from "react";
import NavigationBar from './components/NavigationBar'
import { BrowserRouter } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <NavigationBar />
    </BrowserRouter>
  );
}
export default App;


