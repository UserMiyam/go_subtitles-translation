import { useState, useEffect } from 'react';

function App() {
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const fetchVideos = async () => {
      setStatus('fetching...');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/videos`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStatus(`データ取得成功: ${data.length}件`);
        setVideos(data);
      } catch (error) {
        setStatus(`エラー: ${error.message}`);
        console.error('API fetchエラー:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="App">
      <h1>動画リスト</h1>
      <p>状態: {status}</p>
      <ul>
        {videos.length > 0 ? (
          videos.map(video => (
            <li key={video.id}>{video.title}</li>
          ))
        ) : (
          <li>データがありません</li>
        )}
      </ul>
    </div>
  );
}

export default App;