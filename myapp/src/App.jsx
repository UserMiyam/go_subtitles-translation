import { useState, useEffect } from 'react';

function App() {
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState('loading');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API Base URL
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  // 動画リストを取得する関数
  const fetchVideos = async () => {
    try {
      setStatus('fetching...');
      const response = await fetch(`${apiUrl}/videos`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStatus(`Data received: ${data.length} items`);
      setVideos(data);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      console.error('API fetch error:', error);
    }
  };

  // 初回レンダリング時に動画リストを取得
  useEffect(() => {
    fetchVideos();
  }, []);

  // YouTube URL登録処理
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!youtubeUrl.trim()) {
      alert('YouTube URLを入力してください');
      return;
    }

    // 簡単なYouTube URL検証
    if (!youtubeUrl.includes('youtube.com/watch') && !youtubeUrl.includes('youtu.be/')) {
      alert('有効なYouTube URLを入力してください');
      return;
    }

    setIsSubmitting(true);
    // JSON送信
    try {
      const response = await fetch(`${apiUrl}/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          youtube_url: youtubeUrl,
          title: title || '未設定', // titleが空の場合はデフォルト値
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newVideo = await response.json();
      console.log('Video registered:', newVideo);

      // フォームをリセット
      setYoutubeUrl('');
      setTitle('');
      
      // 動画リストを再取得
      await fetchVideos();
      
      alert('動画が正常に登録されました！');
    } catch (error) {
      console.error('Registration error:', error);
      alert(`登録に失敗しました: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>字幕翻訳システム</h1>
      
      {/* YouTube URL登録フォーム */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>新しい動画を登録</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>
              動画タイトル (オプション):
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 学習用動画"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="youtube_url" style={{ display: 'block', marginBottom: '5px' }}>
              YouTube URL <span style={{ color: 'red' }}>*</span>:
            </label>
            <input
              id="youtube_url"
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{
              backgroundColor: isSubmitting ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            {isSubmitting ? '登録中...' : '動画を登録'}
          </button>
        </form>
      </div>

      {/* 動画リスト表示 */}
      <div>
        <h2>登録済み動画リスト</h2>
        <p>状態: {status}</p>
        
        {videos && videos.length > 0 ? (
          <div style={{ display: 'grid', gap: '10px' }}>
            {videos.map(video => (
              <div 
                key={video.id} 
                style={{
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  padding: '15px',
                  backgroundColor: '#f9f9f9'
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <strong>タイトル:</strong> {video.title || '未設定'}
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>YouTube URL:</strong> 
                  <a 
                    href={video.youtube_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#007bff', marginLeft: '5px' }}
                  >
                    {video.youtube_url}
                  </a>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <strong>ステータス:</strong> 
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: video.status === 'completed' ? '#d4edda' : '#fff3cd',
                    color: video.status === 'completed' ? '#155724' : '#856404',
                    marginLeft: '5px'
                  }}>
                    {video.status}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  登録日時: {new Date(video.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>登録されている動画がありません。</p>
        )}
      </div>
    </div>
  );
}

export default App;