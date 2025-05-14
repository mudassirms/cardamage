import React, { useState } from 'react';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState('New Detection');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setResults(null);
  };

  const handleDetect = async () => {
    if (images.length === 0) return;

    const formData = new FormData();
    images.forEach((img) => {
      formData.append('files', img);
    });

    setLoading(true);
    try {
      const response = await fetch('http://80.225.65.196:8600/detection-report', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to get response from backend');

      const data = await response.json();
      setResults(data);
      setActiveMenu('Detection Report'); 
    } catch (error) {
      alert('Error detecting damage');
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>Menu</h2>
        <nav>
          <ul>
            <li
              className={activeMenu === 'New Detection' ? 'active' : ''}
              onClick={() => setActiveMenu('New Detection')}
            >
              🆕 New Detection
            </li>
            <li
              className={activeMenu === 'Detection Report' ? 'active' : ''}
              onClick={() => setActiveMenu('Detection Report')}
            >
              📊 Detection Report
            </li>
            <li
              className={activeMenu === 'History' ? 'active' : ''}
              onClick={() => setActiveMenu('History')}
            >
              🕒 History
            </li>
            <li
              className={activeMenu === 'Settings' ? 'active' : ''}
              onClick={() => setActiveMenu('Settings')}
            >
              ⚙️ Settings
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        {activeMenu === 'New Detection' && (
          <>
            <h1>New Car Damage Detection</h1>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />

            <button onClick={handleDetect} disabled={loading}>
              {loading ? 'Detecting...' : 'Detect Damage'}
            </button>
          </>
        )}

        {activeMenu === 'Detection Report' && (
          <>
            <h1>Detection Report</h1>
            {results ? (
              <div className="results">
                <h3>Results:</h3>
                <pre>{JSON.stringify(results, null, 2)}</pre>
              </div>
            ) : (
              <p>No detection results to display.</p>
            )}
          </>
        )}

        {activeMenu === 'History' && (
          <h1>History </h1>
        )}

        {activeMenu === 'Settings' && (
          <h1>Settings </h1>
        )}
      </main>
    </div>
  );
}

export default App;
