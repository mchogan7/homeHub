const express = require('express')
const app = express()
const port = 8000

const { Pool, Client } = require('pg')

const client = new Client({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'postgres',
    password: 'mchez1206',
    port: 5432,
})
client.connect()



app.get('/', (req, res) => {



    client.query('SELECT NOW()', (err, response) => {
        console.log(err, response)
        res.send(response.rows[0])
        client.end()
      })
        

})

app.listen(8000, () => console.log('Listening on port ' + port))