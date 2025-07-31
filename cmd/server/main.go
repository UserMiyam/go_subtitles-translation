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
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
	"sync"
)

// 動画の情報を表す構造体
type Video struct {
	ID         string `json:"id"`
	YoutubeURL string `json:"youtube_url"`
	AudioPath  string `json:"audio_path"`
	Status     string `json:"status"`
	CreatedAt  string `json:"created_at"`
	UpdatedAt  string `json:"updated_at"`
}

// 字幕（文字起こし）の情報を表す構造体
type Transcript struct {
	ID            string `json:"id"`
	VideoId       string `json:"video_id"`
	Language      string `json:"language"`
	TranscriptSrt string `json:"transcript_srt"`
	CreatedAt     string `json:"created_at"`
}

// 翻訳済み字幕情報を表す構造体
type Translation struct {
	ID            string `json:"id"`
	TranscriptId  string `json:"transcript_id"`
	SourceLang    string `json:"source_lang"`
	TargetLang    string `json:"target_lang"`
	TranslatedSrt string `json:"translated_srt"`
	ModelUsed     string `json:"model_used"`
	CreatedAt     string `json:"created_at"`
}

// スライス（配列）（DBのテーブル代わりメモリ上に置くためサーバー停止後消える）
var (
	videos       = []Video{}       //動画情報テーブル
	tramscropts  = []Transcript{}  //字幕情報テーブル
	translations = []Translation{} //翻訳情報テーブル
	mu           sync.Mutex        // 複数の処理が同時にデータを書き換えるのを防ぐためのロック
)

// データを取得させる（GETメソッド）
func main() {
	router := gin.Default()
	// 動作確認
	router.GET("/ping", func(c *gin.Context) { //cはGinのコンテキストの無名関数
		c.JSON(200, gin.H{ //gin.Hは、map[string]interface{}のエイリアス
			"massage": "エンドポイント",
		})
	})

	//動画を取得
	router.POST("/videos", func(c *gin.Context) {
		v := Video{}
		//インド(bind) ＝ データを「形のある箱（構造体）」に入れる
		if err := c.BindJSON(&v); err != nil {
			c.JSON(400, gin.H{"error": "Invalid JSON"})
			return
		}
		v.ID = uuid.New().String() //一意な識別子（ID）と、ユニークなIDを作る関数
		v.Status = "processing"
		videos = append(videos, v) //一時メモリ保存（DB代わり）

		c.JSON(http.StatusOK, v)
	})
	router.Run(":8080")

}
