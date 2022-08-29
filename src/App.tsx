import './App.css';
import { Route, Routes } from 'react-router';
import Main from './components/Main';
import Stats from './components/Stats';
import Help from './components/Help';
import Assets from './components/Assets';
import TopNavigation from './components/header/TopNavigation';
import SocialNetworks from './components/SocialNetworks';
import Footer from './components/Footer';
import Web3Context from './Web3DataContext';
window.Buffer = window.Buffer || require("buffer").Buffer; 
function App() {
  return (
      <div>
          <Web3Context>
        <TopNavigation />
        <SocialNetworks />
        <div className='mx-auto max-w-screen-xl'>
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/stats' element={<Stats />} />
            <Route path='/help' element={<Help />} />
            <Route path='/assets' element={<Assets />} />
          </Routes>
          <Footer />
        </div>
        </Web3Context>
      </div>
  );
}
export default App;
