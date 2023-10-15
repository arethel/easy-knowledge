import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MyNavbar from './components/MyNavbar';
import {NextUIProvider} from "@nextui-org/react";
import "./dist/output.css"


function App() {
  return (
    <NextUIProvider>
      <Router>
        <MyNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </NextUIProvider>
  );
}

export default App;
