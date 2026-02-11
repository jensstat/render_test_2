const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://jenstest:${password}@cluster0.km0gpwf.mongodb.net/phoneApp?appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// Person.find({}).then(result => {
//   result.forEach(note => {
//     console.log(note)
//   })
//   mongoose.connection.close()
// })

const person = new Person({
  name: 'Jens',
  number: '48060165',
})

person.save().then(result => {
  console.log('person saved!')
  console.log(result)
  mongoose.connection.close()
})