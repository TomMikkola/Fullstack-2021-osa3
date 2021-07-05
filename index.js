const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use( express.json() )
morgan.token('body', (req, res) => JSON.stringify(req.body) )
app.use( morgan(':method :url :status :res[content-length] - :response-time ms :body') )
app.use( cors() )
app.use( express.static('build') )

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    const numberOfPersons = persons.length
    const timeOfRequest = new Date()

    response.send(
        `<div>Phonebook has info for ${numberOfPersons} people</div>
        <br />
        <div>${timeOfRequest}</diV>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find( person => person.id === id)

    person
        ? response.json(person)
        : response.status(404).end()
})

app.post('/api/persons/', (request, response) => {
    const body = request.body

    if( ( !body.name || !body.number ) ) {
        response.status(400).json({
            error: 'Name or number cannot be empty'
        })

    } else if( persons.find( person => person.name === body.name) ){
        response.status(400).json({
            error: 'Name must be unique'
        })
        
    } else{
        const person = {
            name: request.body.name,
            number: request.body.number,
            id: Math.floor(Math.random() * 100)
        }
    
        persons = persons.concat(person)
        response.json(persons)
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number( request.params.id )
    persons = persons.filter( person => person.id !== id )

    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpooint' })
}

app.use( unknownEndpoint )