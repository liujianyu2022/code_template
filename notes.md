## cerbot安装
在 CentOS 9 上安装 Certbot（用于 Let’s Encrypt 免费证书）有一个官方推荐方式：使用 dnf + EPEL 仓库。
```shell
# 1. 安装 EPEL（如果还没装）
sudo dnf install epel-release -y
sudo dnf update -y

# 2. 安装 Certbot 和 Nginx 插件
# certbot：核心工具
# python3-certbot-nginx：让 Certbot 能自动修改 Nginx 配置、申请证书
sudo dnf install certbot python3-certbot-nginx -y

# 3. 测试
certbot --version

# 4.1 申请证书（自动添加到nginx）
sudo certbot --nginx -d xxx.network -d www.xxx.network

# 4.2 申请证书（如果自动安装失败，可以直接告诉 Certbot 只生成证书，不修改 Nginx，然后手动把路径写进 server block）
# ertonly 表示只申请证书，不改配置
# 生成的证书路径就是：
# /etc/letsencrypt/live/xxx.network/fullchain.pem
# /etc/letsencrypt/live/xxx.network/privkey.pem
sudo certbot certonly --nginx -d xxx.network -d www.xxx.network
```

证书到期之后更新
```shell
sudo certbot renew
sudo systemctl reload nginx

```

## 宿主机Nginx配置

适用于 CentOS 9
```shell
# 1. 安装 EPEL（可选，但推荐）
sudo dnf install epel-release -y

# 2. 安装 Nginx
sudo dnf install nginx -y

# 3. 启动 Nginx 并开机自启
sudo systemctl enable --now nginx

# 4. 开放防火墙 80 和 443 端口
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# 5. 检查 Nginx 状态
sudo systemctl status nginx
```

```shell
server {
    listen 443 ssl;
    server_name xxx.network www.xxx.network;

    ssl_certificate /etc/letsencrypt/live/xxx.network/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/xxx.network/privkey.pem;

    # Dapp 前端
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Platform 前端
    location /platform/ {
        # proxy_pass http://127.0.0.1:54321;      需不需要加这个尾部/，不确定了，gpt说需要加
        proxy_pass http://127.0.0.1:54321/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # API 反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

```shell
sudo nginx -t
sudo systemctl reload nginx
```


## 前端设置修改
如果是采用 http://xxx.network/platform 的形式，那么前端也需要进行修改。

1. 如果采用的是 vite，那么修改点如下：
```js
// vite.config.ts   添加   base: '/platform/'
export default defineConfig({
    base: '/platform/',                 // 解决 xxx.network/platform 无法访问的问题
    // ...
})

// 添加 basename
<BrowserRouter basename="/platform">
    <App />
</BrowserRouter>

// package.json  添加   "homepage": "/platform/",
{
    "homepage": "/platform/",
    // ...
}
```

2. 如果采用的是 webpack
```js
// 修改 output.publicPath
output: {
    filename: 'js/[name].[contenthash].js',
    chunkFilename: 'js/[name].[contenthash].chunk.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,

    // 关键点，这样打包出来的资源路径会变成：
    // /platform/js/main.abc123.js
    // /platform/assets/logo.png
    publicPath: '/platform/',              
},

// 添加 basename
<BrowserRouter basename="/platform">
    <App />
</BrowserRouter>

// 可选
new HtmlWebpackPlugin({
  template: './public/index.html',
  favicon: './public/favicon.ico',
  publicPath: '/platform/',
})

// 在开发阶段如果你想在本地调试 /platform/ 路径，可以在 devServer 里加上
devServer: {
    static: './dist',
    hot: true,
    port: 3000,
    historyApiFallback: {
        index: '/platform/index.html'
    },
    open: true,
    proxy: getProxy(),
},
```

