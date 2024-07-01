import express from 'express'
const port =3330
const app = express() 
app.get('/', (req, res) => res.send('Hello you!!!!!')) 
app.listen(port, () => console.log(`Server listening on port http://127.0.0.1:${port}/`))
