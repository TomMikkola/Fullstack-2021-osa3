const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://admin:${password}@cluster0.mpakd.mongodb.net/puhelinluettelo-app?retryWrites=true`

mongoose.connect(url, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false, 
    useCreateIndex: true
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if( process.argv.length === 3 ){
    Person.find({}).then( result => {
        console.log("phonebook:")

        result.map( (item) => {
            console.log(item.name, item.number)
        })

        mongoose.connection.close()
    })
} else if ( process.argv.length === 5 ){
    
    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then( result => {
        console.log(`added ${name} ${number} to phonebook`)
        mongoose.connection.close()
    })
}