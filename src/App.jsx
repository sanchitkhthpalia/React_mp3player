import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [audio] = useState(new Audio());
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Load the last playing audio file and position from storage
    const lastTrackIndex = localStorage.getItem('lastTrackIndex');
    const lastPosition = localStorage.getItem('lastPosition');
    if (lastTrackIndex && lastPosition) {
      setCurrentTrackIndex(parseInt(lastTrackIndex, 10));
      audio.currentTime = parseFloat(lastPosition);
    }

    // Load the playlist from storage
    const storedPlaylist = localStorage.getItem('playlist');
    if (storedPlaylist) {
      setPlaylist(JSON.parse(storedPlaylist));
    }
  }, []);

  useEffect(() => {
    // Save the current track index and position to storage
    localStorage.setItem('lastTrackIndex', currentTrackIndex);
    localStorage.setItem('lastPosition', audio.currentTime);
  }, [currentTrackIndex, audio.currentTime]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPlaylist = [...playlist, { name: file.name, src: e.target.result }];
        setPlaylist(newPlaylist);
        localStorage.setItem('playlist', JSON.stringify(newPlaylist));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePlay = (index) => {
    setCurrentTrackIndex(index);
    audio.src = playlist[index].src;
    audio.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    audio.pause();
    setIsPlaying(false);
  };

  const handleEnded = () => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
      audio.src = playlist[currentTrackIndex + 1].src;
      audio.play();
    } else {
      setCurrentTrackIndex(0);
      setIsPlaying(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <input type="file" accept="audio/*" onChange={handleFileChange} multiple />
        <div className="playlist">
          <h2>Playlist</h2>
          <ul>
            {playlist.map((track, index) => (
              <li key={index}>
                <button onClick={() => handlePlay(index)}>{track.name}</button>
              </li>
            ))}
          </ul>
        </div>
        {playlist.length > 0 && (
          <div className="now-playing">
            <h2>Now Playing</h2>
            <p>{playlist[currentTrackIndex].name}</p>
            {isPlaying ? (
              <button onClick={handlePause}>Pause</button>
            ) : (
              <button onClick={() => handlePlay(currentTrackIndex)}>Play</button>
            )}
          </div>
        )}
      </header>
      <audio src={playlist[currentTrackIndex]?.src} onEnded={handleEnded} />
    </div>
  );
}

export default App;
