import { useState, useEffect } from 'react';

function App() {
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus('fetching...');
    // VITE_API_URL 環境変数を使用するように変更
    // 環境変数が設定されていない場合のデフォルト値として 'http://localhost:8080' を設定
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    fetch(`${apiUrl}/videos`)
      .then(response => {
        setStatus(`Response: ${response.status}`);
        return response.json();
      })
      .then(data => {
        setStatus(`Data received: ${data.length} items`);
        setVideos(data);
      })
      .catch(error => {
        setStatus(`Error: ${error.message}`);
        console.error('API fetch error:', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>動画リスト</h1>
      <p>状態: {status}</p>
      <ul>
        {videos && videos.map(video => (
          // video.title の代わりに video.youtube_url を表示するように修正
          <li key={video.id}>{video.youtube_url}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;