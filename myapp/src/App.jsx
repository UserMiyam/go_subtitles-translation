// 必要なReactの機能をインポート
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // APIから取得した動画リストを格納するstate
  const [videos, setVideos] = useState([]);

  // コンポーネントの初回表示時に一度だけAPI通信を実行
  useEffect(() => {
    // GoサーバーのAPIエンドポイントをfetchAPIで叩く
    fetch('http://localhost:8080/videos' )
      // レスポンスをJSON形式に変換
      .then(response => response.json())
      // 取得したデータをstateに保存 → これにより画面が再描画される
      .then(data => setVideos(data))
      // 通信失敗時のエラーハンドリング
      .catch(error => console.error('API fetch error:', error));
  }, []); // 第2引数の空配列[]は「初回の一度だけ実行する」の意

  // stateのデータ（videos）を元にUIを構築
  return (
    <div className="App">
      <h1>動画リスト</h1>
      <ul>
        {/* videos配列をループして、各videoのタイトルを<li>要素として表示 */}
        {videos && videos.map(video => (
          // リスト表示では、各要素にユニークな`key`を指定することがReactのルール
          <li key={video.id}>{video.title}</li>
        ))}
      </ul>
    </div>
  );
}

// Appコンポーネントをエクスポート
export default App;
