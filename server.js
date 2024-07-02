import express from 'express'
import cookieParser from 'cookie-parser'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
const app = express()


app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// LIST - get cars
app.get('/api/bug', (req, res) => {
    const filterBy = {
        title: req.query.title,
        minSev: +req.query.minSev,
        pageIdx: req.query.pageIdx,
        sortBy: req.query.sortBy,
        dir: req.query.dir
    }
    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error('Cannot get cars', err)
            res.status(500).send('Cannot get cars')
        })
})

// ADD car
app.post('/api/bug', (req, res) => {
    console.log(req.body)
    const bugToSave = {
        title: req.body.title,
        description: req.body.description,
        severity: +req.body.severity,
        createdAt: Date.now()
    }
    console.log(bugToSave)
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save car', err)
            res.status(500).send('Cannot save car', err)
        })
})

// UPDATE car
app.put('/api/bug', (req, res) => {
    const bugToSave = {
        _id: req.body._id,
        title: req.body.title,
        description: req.body.description,
        severity: +req.body.severity,
        createdAt: Date.now()
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save car', err)
            res.status(500).send('Cannot save car', err)
        })
})

// READ - get car
app.get('/api/bug/:bugId', (req, res) => {
    console.log('req.params:', req.params)
     let visitedCount = req.cookies.visitedCount || 0
    visitedCount++
    res.cookie('visitedCount', visitedCount, { maxAge: 5 * 1000 })
    if(visitedCount>3){
        return res.status(401).send('Wait for a bit')
    }
    const { bugId } = req.params
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot get bug')
        })
})

// DELETE - remove car
app.delete('/api/bug/:bugId', (req, res) => {
    // console.log('req.params:', req.params)
    const { bugId } = req.params
    bugService.remove(bugId)
        /* .then(() => res.redirect('/api/bug')) */
        .then(() => res.send(`bug (${bugId}) removed!`))
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(500).send('Cannot remove bug', err)
        })

})


const port = 3333
app.listen(port, () => loggerService.info((`Server listening on port http://127.0.0.1:${port}/`)))
