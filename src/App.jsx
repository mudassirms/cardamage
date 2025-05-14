import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState('New Detection');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('detectionHistory')) || [];
    setHistory(savedHistory);
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPdfBlobUrl(null);
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

      const blob = await response.blob();
      const fileURL = URL.createObjectURL(blob);
      setPdfBlobUrl(fileURL);
      setActiveMenu('Detection Report'); 

      // Save to local storage for history
      const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        reportUrl: fileURL,
      };
      const updatedHistory = [newEntry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('detectionHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      alert('Error detecting damage');
      console.error(error);
    }
    setLoading(false);
  };

  const handleViewReport = (url) => {
    window.open(url, '_blank');
  };

  const handleClearHistory = () => {
    localStorage.removeItem('detectionHistory');
    setHistory([]);
  };

  return (
    <div className="app" style={{ width: '90%', margin: '0 auto', maxWidth: '1400px' }}>
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
              📄 Detection Report
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
            {pdfBlobUrl ? (
              <div>
                <iframe
                  src={pdfBlobUrl}
                  title="Detection Report"
                  width="100%"
                  height="600px"
                />
                <div className="button-group">
                  <button 
                    className="download-button" 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = pdfBlobUrl;
                      link.download = 'Detection_Report.pdf';
                      link.click();
                    }}
                  >
                    📥 Download Report
                  </button>

                  <button 
                    className="view-fullscreen-button"
                    onClick={() => window.open(pdfBlobUrl, '_blank')}
                  >
                    🔍 View Fullscreen
                  </button>

                </div>
              </div>
            ) : (
              <p>No detection results to display.</p>
            )}
          </>
        )}

        {activeMenu === 'History' && (
          <>
            <h1>History</h1>
            <button className="clear-history-button" onClick={handleClearHistory}>
              🗑️ Clear History
            </button>
            <ul className="history-list">
              {history.length > 0 ? (
                history.map((entry) => (
                  <li key={entry.id}>
                    {entry.date}
                    <button onClick={() => handleViewReport(entry.reportUrl)}>
                      🔍 View Report
                    </button>
                  </li>
                ))
              ) : (
                <p>No history available.</p>
              )}
            </ul>
          </>
        )}

        {activeMenu === 'Settings' && (
          <h1>Settings </h1>
        )}
      </main>
    </div>
  );
}

export default App;