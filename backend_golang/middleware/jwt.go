package middleware

import (
	"backend/api"
	"backend/config"
	"backend/tools"

	"strings"

	"github.com/gin-gonic/gin"
)

func JWTAuth(config *config.Config) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// 从请求头中获取token
		authHeader := ctx.GetHeader("Authorization")

		if authHeader == "" {
			api.HandleError(ctx, api.NewBizError("AUTH401", "Authorization header missing"))
			ctx.Abort()
			return
		}

		// 检查Bearer token格式
		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			api.HandleError(ctx, api.NewBizError("AUTH401", "身份信息已过期，请重新连接钱包"))
			ctx.Abort()
			return
		}

		// 解析token
		claims, err := tools.ParseToken(parts[1], config)
		if err != nil {
			api.HandleError(ctx, api.NewBizError("AUTH401", "Invalid or expired token"))
			ctx.Abort()
			return
		}

		// 将用户ID存入上下文
		ctx.Set("userAddress", claims.UserAddress)

		// ctx.Set("userAddress", parts[1])

		ctx.Next()
	}
}
