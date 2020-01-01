const Koa = require('koa')
const Router = require('koa-router')
const session = require('koa-session')
const static = require('koa-static')
const body = require('koa-parser')

const app = new Koa()

// 使用 session 需要一个秘钥，就是一些随机字符串
app.keys = [
  '5e04d20d-33b72',
  '5e04d20d-1181c',
  '5e04d20d-1ac51'
]

// 处理post
app.use(body())

// 使用中间件设置session
app.use(session({
  maxAge: 20 * 60 * 1000,
  renew: true
}, app))

const router = new Router()

// router.get('/', async ctx => {
//   ctx.body = '主页'
// })
router.get('/favicon.ico', async ctx => {
  ctx.body = '主页'
})

router.post('/login', async ctx => {
  const { username, password } = ctx.request.body
  if (username === 'admin' && password === '123123') {
    console.log('登录成功')
    // 设置 session
    ctx.session.user = username
  } else {
    console.log('登录失败')
  }
  // 没有这个前台会报404，必须返回点什么
  ctx.body = { code: 200 }
})

// 用户中心
router.get('/profile', async ctx => {
  if (!ctx.session.user) {
    ctx.body = `<a href="/">请返回登录</a>`
  } else {
    ctx.body = '用户中心'
  }
})

// 清空 session
router.get('/logout', async ctx => {
  ctx.session.user = null
  ctx.body = '退出成功'
})

app.use(router.routes())

app.use(static('./www'))

app.listen(3001)
