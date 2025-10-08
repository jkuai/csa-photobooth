import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import logo from './assets/csalogo.png';

function App() {
    const [showPage, setShowPage] = useState(false); // false = show header, true = show second page

    const handleStart = () => {
      setShowPage(true); // hide header, show new page
    };

  return (
    <div>
        {! showPage ? (
        <div className='header'>
            <img src={logo} alt="CSALogo" width={400}/>
            <h2>where memories are made.</h2>

            <button onClick={handleStart}>take photo</button>
        </div>
        ) : (
        <div className='frames'>
            <img src={logo} alt="CSALogo" width={200}/>
            <h2> choose a frame</h2>

        </div>
        )}
    </div>
  )
}

export default App
