function App() {
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus('fetching...');
    fetch('http://localhost:8080/videos')
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
      <p>状態: {status}</p>  {/* デバッグ情報 */}
      <ul>
        {videos && videos.map(video => (
          <li key={video.id}>{video.title}</li>
        ))}
      </ul>
    </div>
  );
}