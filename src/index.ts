import express from 'express'
import db from './utils/database'
import routes from './routes/api'
import bodyParser from 'body-parser'
import docs from './docs/route'

const PORT = 3000

async function init () {
  try {
    await db()

    const app = express()
    app.get("/", (req, res) => {
      res.redirect("/docs");
    });

    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))

    app.use('/api', routes)
    docs(app)

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

init()
