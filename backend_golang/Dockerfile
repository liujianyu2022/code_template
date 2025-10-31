# 使用官方 Golang 镜像作为构建环境
FROM golang:1.24-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 go.mod 和 go.sum
COPY go.mod go.sum ./

# 下载依赖
RUN go mod download

# 复制源代码
COPY . .

# 编译二进制文件
RUN go build -o backend main.go

# 使用更小的镜像来运行程序
FROM alpine:latest

# 设置工作目录
WORKDIR /app

# 从 builder 镜像复制二进制文件
COPY --from=builder /app/backend .
COPY --from=builder /app/config ./config

# 暴露端口（假设你的服务跑在 8080）
EXPOSE 8080

# 启动程序
CMD ["./backend"]
