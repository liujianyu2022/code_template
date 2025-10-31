package router

import (
	"backend/config"
	"backend/docs"
	"backend/handler"
	"backend/middleware"

	"github.com/gin-gonic/gin"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func SetupRouter(
	config *config.Config,
	userHandler *handler.UserHandler,
	
) *gin.Engine {
	ginServer := gin.Default()

	ginServer.Use(middleware.Cors())

	// 程序化设置 Swagger 信息
	docs.SwaggerInfo.Title = "Dapp System"
	docs.SwaggerInfo.Description = "Dapp System API"
	docs.SwaggerInfo.Version = "1.0"
	docs.SwaggerInfo.Host = "localhost:8080"
	docs.SwaggerInfo.BasePath = "/api/"
	docs.SwaggerInfo.Schemes = []string{"http", "https"}

	// 添加 Swagger 路由
	ginServer.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	api := ginServer.Group("/api")
	{
		user := api.Group("/user")
		{
			user.GET("/all", userHandler.GetAllUsers)
		}
	}

	return ginServer
}