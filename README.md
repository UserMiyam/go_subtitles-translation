# go_subtitles-translation/v1
go_subtitles-translation

/videos
1.サーバー起動の実行後
go run main.go 
2.POSTリクエストを送信
Invoke-RestMethod -Uri "http://localhost:8080/videos" -Method Post -ContentType "application/json" -Body '{"youtube_url":"任意のURL"}'結果確認
3.出力結果がJSONで抽出

ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
//動画を取得
1️ POST で動画を追加
powershell
コピーする
編集する
Invoke-RestMethod `
    -Uri "http://localhost:8080/videos" `
    -Method Post `
    -ContentType "application/json" `
    -Body '{"youtube_url":"https://youtu.be/-qODuVlWDx0"}'
ポイント：

-Uri：API の URL

-Method Post：HTTP メソッド

-ContentType "application/json"：JSON を送る

-Body：送信する JSON（文字列で渡す）

成功すると、サーバーから追加された動画の JSON が返ります。

2️ GET で動画一覧を取得
powershell
コピーする
編集する
Invoke-RestMethod `
    -Uri "http://localhost:8080/videos" `
    -Method Get
これで videos 配列に入っている全動画情報が JSON で返ります。

PowerShell 上で一覧として確認できます。

//npm start
//go run main.go