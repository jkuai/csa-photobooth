import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import logo from './assets/csalogo.png';

function App() {
    const [page, setPage] = useState('home'); // page conrols - switching between pages with page code
    const videoRef = useRef(null);           // ⭐ provides access to the video element
    const canvasRef = useRef(null);          // ⭐ provides access to the canvas element
    const [photoCount, setPhotoCount] = useState(0);  // ⭐ tracks number of photos taken
    const [selectedFrameNumber, setSelectedFrameNumber] = useState(null); // ⭐ tracks picture type -> simple of friend

    // ⭐ startCamera function
    async function startCamera(current, frameName) {
        setSelectedFrameNumber(frameName);
        setPage('camera'); // switch to camera page instead of using display:none

        try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        } catch (err) {
        console.error("Error accessing the camera:", err);
        alert("Camera access was denied or not supported.");
        }
    }

    // ⭐ ADDED: countdown and capture logic
    function startCountdown(seconds = 3) {
        const countdown1 = document.getElementById('countDown');
        countdown1.textContent = seconds;
        countdown1.style.display = 'block';

        const interval = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
            clearInterval(interval);
            countdown1.textContent = '';
            capturePhoto();
        } else {
            countdown1.textContent = seconds;
        }
        }, 1000);
    }

    function capturePhoto() {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.save();
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        context.restore();

        const photoDataUrl = canvas.toDataURL('image/png');
        localStorage.setItem('photo' + photoCount, photoDataUrl);

        const img = document.createElement('img');
        img.src = photoDataUrl;
        img.style.height = '100px';
        img.style.border = '2px solid #84A59D';
        img.style.borderRadius = '8px';

        document.getElementById('photoGallery').appendChild(img);
        setPhotoCount(photoCount + 1);

        if (photoCount + 1 === 3) {
            localStorage.setItem('selectedFrame', selectedFrameNumber);
            setTimeout(() => {
                setPage('simple_frames'); // switch page after delay
            }, 2000);
        }
    }

    // pacebar event listener for taking pictures
    useEffect(() => {
        const handleKeyDown = (event) => {
        if (event.code === "Space") startCountdown(3);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [photoCount]);

  return (
    <div>
        {page === 'home' && (
            <div className='header'>
                <img src={logo} alt="CSALogo" width={400}/>
                <h2>where memories are made ⋆˙⟡♡</h2>

                <button onClick={() => setPage('frames')}>take photo</button>
            </div>
        )}

        {page === 'frames' && (
            <div className='page'>
                <img src={logo} alt="CSALogo" width={200}/>
                <h2> select option</h2>
                <button onClick={() => setPage('select_friend')}>take a photo with a friend</button>
                <button style={{ marginTop: '20px' }} onClick={() => startCamera('frames', 'simple')}>simple frames</button>
                <button style={{marginTop:'20px'}} onClick={() => setPage('home')}>home</button>
            </div>
        )}

        {page === 'select_friend' && (
            <div className='page'>
                <img src={logo} alt='CSALogo' width={200}/>
                <h2>select your friend ᯓ★</h2>

                <button style={{marginTop:'20px'}} onClick={() => setPage('frames')}>go back</button>
            </div>
        )}

        {page === 'camera' && (
            <div className="page">
                <img src={logo} alt='CSALogo' width={200}/>

                <video id="camera" ref={videoRef} autoPlay playsInline></video>
                <div id="countDown"></div>

                <canvas id="photoCanvas" ref={canvasRef} width={640} height={480} style={{ display: 'none' }}></canvas>
                <div id="photoGallery"></div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button onClick={() => setPage('frames')}>back</button>
                </div>
            </div>
        )}

        {page === 'simple_frames' && (
            <div className='page'>
                <img src={logo} alt='CSALogo' width={200}/>
                <h2>simple frames ᯓ★</h2>

                <button style={{marginTop:'20px'}} onClick={() => setPage('camera')}>go back</button>
            </div>
        )}
    </div>
  )
}

export default App
