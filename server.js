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