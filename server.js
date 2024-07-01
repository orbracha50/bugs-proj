import express from 'express'
import { bugService } from './services/bug.service.js'

const app = express()

app.get('/api/bug', (req, res) => {
    bugService.query().then(bugs => res.send(bugs))
})
app.get('/api/bug/save', (req, res) => {
    const bugToSave = {
        _id: req.query._id,
        title: req.query.title,
        description: req.query.description,
        severity: +req.query.severity,
        createdAt : Date.now()
    }
    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save car', err)
            res.status(500).send('Cannot save car', err)
        })
})
app.get('/api/bug/:bugId', (req, res) => {
    // console.log('req.params:', req.params)
    const { bugId } = req.params
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch((err) => {
            /* loggerService.error('Cannot get bug', err) */
            res.status(500).send('Cannot get bug')
        })
})

app.get('/api/bug/:bugId/remove', (req, res) => {
    // console.log('req.params:', req.params)
    const { bugId } = req.params
    bugService.remove(bugId)
        .then(() => res.redirect('/api/bug'))
        /* .then(() => res.send(`bug (${bugId}) removed!`)) */
        .catch((err) => {
            /* loggerService.error('Cannot remove bug', err) */
            res.status(500).send('Cannot remove bug', err)
        })

})









const port = 3330
app.get('/', (req, res) => res.send('Hello you!!!!!'))
app.listen(port, () => console.log(`Server listening on port http://127.0.0.1:${port}/`))
