import React from 'react';
import './assets/styles/app.css';
import WallpaperDisplay from './components/wallpaper/wallpaperdisplay';
import Taskbar from './components/taskbar/taskbar';

function App() {
  return (
    <div className="App">
      <WallpaperDisplay />
      <Taskbar />
    </div>
  );
}

export default App;