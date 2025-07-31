// エントリーポイント
/*
package main

import "fmt"

func main() {
	fmt.Println("Helloworld")
}
*/

/*
package main

import (
	"github.com/gin-gonic/gin"
	//"net/http"
)

func main() {
	//Ginエンジンのインスタンス作成
	r := gin.Default()

	//ルートURL（”/"）に対するGETリクエストのルート
	r.GET("/", func(c *gin.Context) {
		//JSONレスポンスを返す
		c.JSON(200, gin.H{
			"message": "hello world",
		})
	})
	r.Run(":8080")
}
*/

//http://localhost:8080/

package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
)

// 動画の情報を表す構造体
type Video struct {
	ID         string `json:"id"`
	YoutubeUrl string `json:"youtube_url"`
	AudioPath  string `json:"audio_url"`
	Stutus     string `json:"stutus"`
	CreatedAt  string `json:"created_at"`
	UpdateAt   string `json:"update_at"`
}

// 字幕（文字起こし）の情報を表す構造体
type Transcript struct {
	ID           string `json:"id"`
	VideoId      string `json:"video_id"`
	Language     string `json:"langiage"`
	TransriptSrt string `json:"transript_srt"`
	CreatedAt    string `json:"created_at"`
}

// 翻訳済み字幕情報を表す構造体
type Translation struct {
	ID            string `json:"id"`
	TranscriptId  string `json:"transcript_id"`
	SourceLang    string `json:"source_lang"`
	TargetLang    string `json:"taget_lang"`
	TranslatedSrt string `json:"translated_srt"`
	ModelUsed     string `json:"model_used"`
	CreatedAt     string `json:"created_at"`
}

// スライス（配列）（DBのテーブル代わりメモリ上に置くためサーバー停止後消える）
var (
	videos = []Video{} //動画情報テーブル
	//tramscropts  = []Transcript{}  //字幕情報テーブル
	//translations = []Translation{} //翻訳情報テーブル
	mu sync.Mutex // 複数の処理が同時にデータを書き換えるのを防ぐためのロック
)

// main()関数を書く（エントリーポイント）
func main() {
	http.HandleFunc("/videos", videosHandler)
	log.Println("Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))

}

// videosにアクセスされた時に処理
func videosHandler(w http.ResponseWriter, r *http.Request) {
	//排他制御で複数の処理が同時に書き込まれないようにする
	mu.Lock()
	defer mu.Unlock()

	switch r.Method {
	//get動画情報取得
	case http.MethodGet:
		header := w.Header()
		header.Set("Content-Type", "application/json") //返すデータがJSON形式宣言
		encoder := json.NewEncoder(w)
		err := encoder.Encode(videos) //videoスライスをJSONに変換
		if err != nil {
			// エラー発生したが無視（スルー）
		}

		//postリクエスト
	case http.MethodPost:
		var v Video
		//json形式のリクエストボディをVideo構造体に変換
		decoder := json.NewDecoder(r.Body)
		err := decoder.Decode(&v)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		//
	}
}
