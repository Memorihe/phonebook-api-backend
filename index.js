const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('combined'))

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0

  console.log(maxId)
  return maxId + 1
}

app.get('/', (request, response) => {
  response.send('<h1>Phonebook app</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.filter((person) => person.id === id)
  response.json(person)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or number is missing'
    })
  }

  const exist = persons.find((person) => person.name !== body.name)
  if (exist) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  console.log(person)

  persons = persons.concat(person)
  response.json(person)
})

app.get('/info', (request, response) => {
  const entries = persons.length
  const date = new Date()
  response.send(`Phonebook has info for ${entries}<br/>${date.toUTCString()}`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.find((person) => person.id !== id)

  response.status(204).end()
})

app.use((request, response) => {
  response.status(404).send('<h1>Page not found</h1>')
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Phonebook app running on port ${PORT}`)
})
