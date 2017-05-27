/**
 * Created by Linfe on 2017/5/25.
 */
const Koa = require('koa')
const send = require('koa-send')
const Router = require('koa-router')

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.dev.config')

const DEVPORT = 3001

const app = new Koa()
const router = new Router()

router.get('/', async function (ctx) {
    await send(ctx, 'demo/index.html')
})

/*router.get('/app.js', async function (ctx) {
    await send(ctx, 'build/app.js')
})*/
// 线上会使用压缩版本的React，而在开发的时候，我们需要使用react-with-addons的版本来查看错误信息
// 所以这里我通常会把React和ReactDOM代理到本地未压缩的文件
router.get('**/react.min.js', async function (ctx) {
    await send(ctx, 'demo/react-with-addons.js')
})
router.get('**/react-dom.min.js', async function (ctx) {
    await send(ctx, 'demo/react-dom.js')
})

// 如果请求出现跨域问题的话，参考master分支下的代码，把这里改成http-proxy转发
router.get('**/*.js(on)?', async function (ctx) {
    ctx.redirect(`http://localhost:${DEVPORT}/${ctx.path}`)
})

app.use(router.routes())

app.listen(3000, function () {
    console.log('server running on http://localhost:3000')
})

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    quiet: false,
    noInfo: true,
    stats: {
        colors: true
    }
}).listen(DEVPORT, 'localhost', function (err, result) {
    if (err) {
        return console.log(err)
    }
})

const qenya = require('qenya')

// qenya 会启动两个服务，一个是数据管理平台，可以设置数据表和api
// 另一个是api服务，通过在数据管理平台配置的api访问
qenya({
    appPort: 3002,
    apiPort: 3003,
    render: function (res) {
        if (res.data) {
            return res.data
        } else {
            return {
                error: res.errors[0].message
            }
        }
    }
})

// api请求转发
const proxy = new httpProxy.createProxyServer({
    target: 'http://localhost:3003/',
    changeOrigin: true
})

const methods = ['get', 'post', 'put', 'delete']
methods.forEach(m =>
    router[m]('/api/*', function (ctx) {
        proxy.web(ctx.req, ctx.res)
        ctx.body = ctx.res
    })
)