const express = require('express');
const app = express();
const port = 3000;
const config = {
    host: 'database',
    user: 'root',
    password: 'root',
    database: 'nodedb'
};
const mysql = require('mysql');
const connection = mysql.createConnection(config);

connection.connect();

const sql = `
    CREATE TABLE IF NOT EXISTS people (
      id int not null auto_increment,
      name varchar(255),
      primary key(id)
    )
  `;

connection.query(sql);

app.use(express.json());

app.get('/', (req, res) => {
    const sql = 'SELECT * FROM people';
    
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao consultar os registros:', err);
            return res.status(500).send('Erro ao consultar os registros.');
        }

        let html = '<h1>Full Cycle Rocks!</h1>\n';
        
        results.forEach(user => {  
            html += '<hr>';      
            html += `<h2>Nome: ${user.name}</h2>`;
            html += '<hr>';
        });

        res.send(html);
    });
});

app.post('/pessoas', (req, res) => {
    const { name } = req.body;
    const sql = `INSERT INTO people(name) values( ? );`;
  
    connection.query(sql, [name], (err, results) => {
        if (err) {
            console.error('Erro ao inserir o registro:', err);
            return res.status(500).send('Erro ao inserir o registro.');
        }
        res.status(201).send('Registro inserido com sucesso.');
    });
});

app.listen(port, () => {
    console.log(`Rodando na porta ${port}`);
});
