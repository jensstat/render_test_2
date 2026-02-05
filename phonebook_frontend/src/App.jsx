import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'


const Persons = ({persons, onClick}) => {
  return(
    <>
      {persons.map(person => (
        <p key={person.id}>
          {person.name} {person.number} <button onClick={() => onClick(person.id)}>Delete</button>
        </p>
      ))}
    </>
  )
}

const Filter = ({value, onChange}) => {
  return(
    <>
    Filter Results: <input value={value} onChange = {onChange} />
    </>
  )
}

const Form = (props) => {
  const {handleAddPerson, name, handleNameChange, number, handleNumberChange} = props
  
  return(
    <form onSubmit = {handleAddPerson}>
        <div>
          name: <input value = {name} onChange = {handleNameChange}/>
        </div>
        <div>
          number: <input value = {number} onChange = {handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}


const App = () => {

  /* ----- State ---- */  
  const [persons, setPersons] = useState([]) 
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [success, setSuccess] = useState(null)
  console.log(notification)
  /* ----- Effects ---- */  

  useEffect(()=>{
    personService.getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    }) 
    },
  [])

  console.log('render', persons.length, 'persons')

  /* ----- Derived Values ---- */  

  const personsToShow = 
    filter === '' 
    ? persons
    : persons.filter(person => 
      person.name.toLowerCase().includes(filter.toLowerCase())
    )

  /* ---- Event Handlers ---- */

  const handleAddPerson = (event) => {
    event.preventDefault()

    const personObject = { name,number }
    const existingPerson = persons.find(p => p.name === name)

    if (existingPerson) {
      const confirmed = window.confirm(`${name} is already added to phonebook, replace the old number with a new one?`)

      if (!confirmed) {
        return
      }

      /* ---- Update Person ---- */

      personService
        .update(existingPerson.id, personObject)
        .then(updatedPerson => {
          setPersons(persons.map(person => 
            person.id === existingPerson.id 
            ? updatedPerson
            : person
          ))
        })
        .catch(error => {
          setNotification(
            {message:`Information of  ${existingPerson.name} has already been removed from server`,
            type: "error"}
          )
          setSuccess(false)
          setTimeout(()=> {
            setNotification(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== existingPerson.id))
        })
      setNotification({ message: 'Updated contact', type: 'success' })  
      setTimeout(()=> {
        setNotification(null)
      }, 5000)

      return
    }

    /* ---- Add Person ---- */

    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setName('')
        setFilter("")
        setNumber("")
      })
    setSuccess(true)
    setNotification({ message: 'Added contact', type: 'success' })
      setTimeout(()=> {
        setNotification(null)
      }, 5000)
    
  }

  const handleDelete = (id) =>{
    personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })  
  }

  const handleNameChange = event => setName(event.target.value)
  const handleNumberChange = event => setNumber(event.target.value)
  const handleFilterSeach = event => setFilter(event.target.value)


  /* ---- Render ---- */
  
  return (      
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter value={filter} onChange={handleFilterSeach} />
      <Form 
        handleAddPerson = {handleAddPerson} 
        name={name}
        handleNameChange={handleNameChange}
        number = {number}
        handleNumberChange={handleNumberChange}
        /> 

      <h2>Numbers</h2>
      <Persons 
        persons={personsToShow} 
        onClick={handleDelete} 
      />
    </div>
  )
}

export default App


