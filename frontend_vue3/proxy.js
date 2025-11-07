
const TARGET_URL = 'http://localhost:8080'

const getProxy = () => {
    return [
        {
            context: ['/data-qa'], // 匹配的路径
            target: TARGET_URL, // 目标服务器地址
            changeOrigin: true,
            secure: false,
            logLevel: 'debug',

            // pathRewrite: {
            //   '^/data-qa': '', // 移除路径前缀
            // },

            onProxyReq: (proxyReq, req, res) => {
                console.log('代理请求:', req.method, req.url, '->', TARGET_URL);
            },
        }
    ]
}

module.exports = getProxy