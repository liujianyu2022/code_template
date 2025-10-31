### backend
1. go项目初始化
```shell
cd ./backend
go mod init backend         # 初始化 Go module。此处 backend 为项目名称，可以替换为其他的，比如 myapp
```

2. go项目结构
```
project-root/  
├── config/                 配置项
│   ├── config.go  
│   └── config.yaml  
├── model/                  数据表结构
│   └── user.go  
├── router/                 路由
│   └── router.go  
├── handle/                 handler层
│   └── user.go  
├── service/                处理具体的业务逻辑
│   └── user.go 
├── repository/             数据库操作逻辑 
│   └── user.go  
├── db/                     数据库配置
│   ├── mysql.go  
│   └── redis.go  
├── middleware/  
│   ├── jwt.go  
│   └── cors.go 
├── wire/                   依赖注入工具
│   ├── wire.go  
│   └── wire_gen.go  
├── main.go                 入口文件
├── go.mod  
└── go.sum  
```

3. wire
wire 是一个在编译前帮你生成依赖初始化代码的工具。
```shell
go install github.com/google/wire/cmd/wire@latest           # wire

cd backend/wire
wire gen ./wire.go                                          # generate the wire_gen.go file
```

wire.go 模板文件
```go
//go:build wireinject
// +build wireinject

package wire

import (
	"backend/config"
	"backend/db"
	"backend/handler"
	"backend/repository"
	"backend/router"
	"backend/service"

	"github.com/gin-gonic/gin"
	"github.com/google/wire"
)

var handlerSet = wire.NewSet(
	handler.NewUserHandler,
    // ...
)

var serviceSet = wire.NewSet(
	service.NewUserService,
	// ...
)

var repositorySet =wire.NewSet(
	repository.NewUserRepository,
    // ...
)

var dbSet = wire.NewSet(
	db.NewMySQLDB,
	// db.NewRedisClient,
)

var routerSet = wire.NewSet(
	router.SetupRouter,
)

var configSet = wire.NewSet(
	config.LoadConfig,
)

var SuperSet = wire.NewSet(
	handlerSet,
	serviceSet,
	repositorySet,
	dbSet,
	routerSet,
	configSet,
)

func InitializeApp(configPath string) (*gin.Engine, error) {
	wire.Build(SuperSet)
	return &gin.Engine{}, nil
}
```

3. swagger
首先安装 swagger
```shell
go install github.com/swaggo/swag/cmd/swag@latest           # 安装 swagger

cd ./backend
swag init -g main.go                                        # 生成swagger的文档
```

然后在 router.go 中添加swagger的配置。

router.go 模板文件
```go
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
```

然后在 handler 中的函数中添加注释即可。比如说：
```go
// GetAllUsers
// @Summary 获取所有的用户信息
// @Tags User
// @Produce json
// @Success 200 {object} api.Response{data=[]api.UserDTO}
// @Failure 200 {object} api.Response
// @Router /user/all [get]
func (handler *UserHandler) GetAllUsers(ctx *gin.Context) () {
	result, err := handler.service.GetAllUsers()
	if err != nil {
		api.HandleError(ctx, err)
		return
	}
	api.HandleSuccess(ctx, result)
}
```

访问链接：http://localhost:8080/swagger/index.html