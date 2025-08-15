package main

import (
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/joho/godotenv"
)

// 動画の情報を表す構造体
type Video struct {
	ID         string `json:"id"`
	Title      string `json:"title"` // 追加: フロントエンドで使用
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

// メモリ上の疑似DB
var (
	videos       = []Video{}
	transcripts  = []Transcript{} // 修正: tramscropts -> transcripts
	translations = []Translation{}
	mu           sync.Mutex
)

func main() {
	// .env 読み込み
	_ = godotenv.Load()

	// 環境変数から CORS の許可オリジン取得
	corsOrigin := os.Getenv("BFF_CORS_ORIGIN")
	if corsOrigin == "" {
		log.Println("環境変数 BFF_CORS_ORIGIN が設定されていないため、デフォルト値を使用します")
	}

	// 追加: テスト用のサンプルデータを作成
	videos = []Video{
		{
			ID:         "1",
			Title:      "サンプル動画1",
			YoutubeURL: "https://www.youtube.com/watch?v=example1",
			Status:     "completed",
			CreatedAt:  time.Now().Format(time.RFC3339),
			UpdatedAt:  time.Now().Format(time.RFC3339),
		},
		{
			ID:         "2",
			Title:      "サンプル動画2",
			YoutubeURL: "https://www.youtube.com/watch?v=example2",
			Status:     "processing",
			CreatedAt:  time.Now().Format(time.RFC3339),
			UpdatedAt:  time.Now().Format(time.RFC3339),
		},
	}

	router := gin.Default()

	// CORS 設定
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, //スト用に一時的にAllowOriginsを*に変更
		AllowMethods:     []string{"POST", "GET", "OPTIONS"},
		AllowHeaders:     []string{"Access-Control-Allow-Credentials", "Access-Control-Allow-Headers", "Content-Type", "Content-Length", "Accept-Encoding", "Authorization"},
		AllowCredentials: true,
		MaxAge:           24 * time.Hour,
	}))

	// 動作確認
	router.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"Message": "エンドポイント"})
	})

	// 動画登録
	router.POST("/videos", func(c *gin.Context) {
		v := Video{}
		if err := c.BindJSON(&v); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
			return
		}

		v.ID = uuid.New().String()
		v.Status = "processing"
		v.CreatedAt = time.Now().Format(time.RFC3339)
		v.UpdatedAt = time.Now().Format(time.RFC3339)

		mu.Lock()
		videos = append(videos, v)
		mu.Unlock()

		c.JSON(http.StatusOK, v)
	})

	// 全動画取得
	router.GET("/videos", func(c *gin.Context) {
		mu.Lock()
		defer mu.Unlock()
		c.JSON(http.StatusOK, videos)
	})

	router.Run(":8080")
}
