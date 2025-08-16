import { useState, useEffect } from 'react';

function App() {
  const [videos, setVideos] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [title, setTitle] = useState('');
  
  const apiUrl = 'http://localhost:8080';

  // 動画リスト取得
  const getVideos = async () => {
    const response = await fetch(`${apiUrl}/videos`);
    const data = await response.json();
    setVideos(data);
  };

  // 最初に動画リスト取得
  useEffect(() => {
    getVideos();
  }, []);

  // フォーム送信
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // YouTube URL送信
    await fetch(`${apiUrl}/videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        youtube_url: youtubeUrl,
        title: title || '未設定'
      })
    });

    // フォームリセット & リスト更新
    setYoutubeUrl('');
    setTitle('');
    getVideos();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>動画登録</h1>
      
      {/* 登録フォーム */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <input
            type="text"
            placeholder="動画タイトル (オプション)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '300px', padding: '5px', margin: '5px' }}
          />
        </div>
        <div>
          <input
            type="url"
            placeholder="YouTube URL"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            required
            style={{ width: '300px', padding: '5px', margin: '5px' }}
          />
        </div>
        <button type="submit">登録</button>
      </form>

      {/* 動画リスト */}
      <h2>動画一覧</h2>
      {videos.map(video => (
        <div key={video.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
          <p><strong>{video.title}</strong></p>
          <p><a href={video.youtube_url} target="_blank">{video.youtube_url}</a></p>
          <p>ステータス: {video.status}</p>
        </div>
      ))}
    </div>
  );
}

export default App;