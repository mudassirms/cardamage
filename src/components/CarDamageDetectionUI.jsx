import React, { useState } from 'react';

const CarDamageDetectionUI = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  // Image selection handler
  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  // Submit handler for processing images
  const handleSubmit = async () => {
    if (images.length === 0) return;
    setLoading(true);
    setError('');

    const formData = new FormData();
    images.forEach((image) => formData.append('images', image));

    try {
      const response = await fetch('http://80.225.65.196:8600/detection-report', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data from the server');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] flex flex-col items-center justify-start pt-24 p-6 sm:p-10 text-white">
      {/* Main content container */}
      <div className="w-full max-w-3xl p-8 bg-white bg-opacity-10 backdrop-blur-md border border-cyan-400 rounded-2xl shadow-2xl transition-all duration-300 animate-fadeIn z-10">
        <h2 className="text-center text-4xl sm:text-6xl font-extrabold mb-10 text-cyan-400 drop-shadow-lg tracking-tight">
          🚗 AI Car Damage Detection
        </h2>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Input field for file selection */}
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          className="block w-full mb-6 p-4 border border-cyan-400 rounded-lg bg-white bg-opacity-5 backdrop-blur-md text-cyan-200 transition duration-200 file:cursor-pointer hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />

        {/* Detect damage button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-lg hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 hover:shadow-xl shadow-cyan-500/50 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></div>
              <span>Analyzing...</span>
            </div>
          ) : (
            '🔍 Detect Damage'
          )}
        </button>
      </div>

      {/* Results grid */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 z-10 w-full max-w-6xl px-4 sm:px-0">
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-10 backdrop-blur-md border border-cyan-500 p-4 shadow-lg rounded-xl transform hover:scale-105 transition duration-300"
            >
              {images[index] && (
                <img
                  src={URL.createObjectURL(images[index])}
                  alt={`Result ${index + 1}`}
                  className="w-full h-48 object-cover rounded-md mb-4 border border-cyan-300"
                />
              )}
              <div className="text-cyan-100 text-sm space-y-1">
                <p>
                  <strong>Damage Detected:</strong>{' '}
                  <span className={result.damage ? 'text-green-400' : 'text-red-400'}>
                    {result.damage ? '✅ Yes' : '❌ No'}
                  </span>
                </p>
                <p><strong>Details:</strong> {result.details || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarDamageDetectionUI;
