# go_subtitles-translation/v1
go_subtitles-translation

/videos
1.サーバー起動の実行後
go run main.go 
2.POSTリクエストを送信
Invoke-RestMethod -Uri "http://localhost:8080/videos" -Method Post -ContentType "application/json" -Body '{"youtube_url":"任意のURL"}'結果確認
3.出力結果がJSONで抽出
