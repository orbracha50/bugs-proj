import express from 'express'
const app = express() 
app.get('/', (req, res) => res.send('Hello you!!!!!')) 
app.listen(3333, () => console.log('Server ready at port 3333'))