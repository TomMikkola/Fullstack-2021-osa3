require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.use( express.static('build') )
app.use( express.json() )
app.use( cors() )
morgan.token('body', (req, res) => JSON.stringify(req.body) )
app.use( morgan(':method :url :status :res[content-length] - :response-time ms :body') )

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then( persons => {
            response.json(persons)
        })
        .catch( error => next(error) )
})

app.get('/api/info', (request, response) => {
    Person.count({}).then( count => {
        const numberOfPersons = count
        const timeOfRequest = new Date() 

    response.send(
        `<div>Phonebook has info for ${numberOfPersons} people</div>
        <br />
        <div>${timeOfRequest}</diV>`)
    } )
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findById(id)
        .then( result => {
            if(result){
                response.json(result)
            } else {
                response.status(404).end()
            }
        })
        .catch( error => next(error)) 
})

app.post('/api/persons/', (request, response, next) => {
    const body = request.body

    if( ( !body.name || !body.number ) ) {
        response.status(400).send({ error: 'Name or number cannot be empty' })

    } /* else if( persons.find( person => person.name === body.name) ){
        response.status(400).json({
            error: 'Name must be unique'
        })
        
    }  */else{
        const person = new Person({
            name: body.name,
            number: body.number,
        })

        person.save().then( savedPerson => {
            console.log("person saved")
            Person.find({}).then( persons => {
                response.json(persons)
            }) 
        })
    }
})

app.put( '/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }
    
    Person.findByIdAndUpdate( request.params.id, person, { new: true } )
        .then( updatedPerson => {
            response.json(updatedPerson)
        })
        .catch( error => next(error) )
} )

app.delete('/api/persons/:id', (request, response, next) => {

    Person.findByIdAndRemove( request.params.id )
        .then( result => {
            console.log("Removed person with id: ", request.params.id)
            response.status(204).end()
        })
        .catch( error => next(error) )
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use( unknownEndpoint )

const errorHandler = (error, request, response, next) => {
    console.log( error.message )

    if( error.name === 'CastError'){
        return response.status(400).send({ error: 'malformatted id' })
    }
    
    next(error)
}
app.use( errorHandler )