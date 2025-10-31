package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// 统一返回结构
type Response struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
}

// 成功固定返回 "0"
func HandleSuccess(ctx *gin.Context, data any) {
	if data == nil {
		data = struct{}{}
	}
	
	ctx.JSON(http.StatusOK, Response{
		Code:    "0",
		Message: "success",
		Data:    data,
	})
}

// 失败返回 BizError 或兜底系统错误
func HandleError(ctx *gin.Context, err error) {
	bizErr, ok := err.(*BizError)

	if ok {
		ctx.JSON(http.StatusOK, Response{
			Code:    bizErr.Code,
			Message: bizErr.Message,
		})
		return
	}

	// 未知错误 -> 系统错误
	ctx.JSON(http.StatusOK, Response{
		Code:    "SYS001",
		Message: "internal server error",
	})
}

// 接口返回统一：成功 "0"，失败 "HOME001", "DB001", "SYS001" 等。

// 责任清晰：
// 	Repository：只关心数据库和领域逻辑，返回 *BizError。
// 	Service：组合逻辑，继续返回 *BizError。
// 	Handler：永远用 HandleSuccess / HandleError 输出。

// 可扩展：以后你要换错误码风格（比如 "U001", "P002"），只要在 NewBizError 里定义即可
