package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func Cors() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		method := ctx.Request.Method
		origin := ctx.Request.Header.Get("Origin")

		// 允许访问的前端域名列表
		allowedOrigins := []string{
			"http://localhost:3000", // 开发环境
			"http://localhost:3001", // 开发环境
			"http://localhost:3002", // 开发环境

			"http://45.78.192.121:3001", // 注意：不能加 /
			"http://45.78.192.121:3003",
			"http://45.78.192.121:54321",

			"http://cfl.network",     // 注意：不能加 /
			"http://www.cfl.network", // 注意：不能加 /

			"https://cfl.network",     // 注意：不能加 /
			"https://www.cfl.network", // 注意：不能加 /
		}

		// 检查请求的 Origin 是否在允许列表里
		isAllowed := false
		for _, o := range allowedOrigins {
			if o == origin {
				isAllowed = true
				break
			}
		}

		if isAllowed {
			ctx.Header("Access-Control-Allow-Origin", origin)
			ctx.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
			ctx.Header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
			ctx.Header("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Cache-Control, Content-Language, Content-Type")
			ctx.Header("Access-Control-Allow-Credentials", "true")
		}

		// 处理 OPTIONS 预检请求
		if method == "OPTIONS" {
			ctx.AbortWithStatus(http.StatusNoContent)
			return
		}

		ctx.Next()
	}
}
