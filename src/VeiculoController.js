async function connect() {

  if ( global.connection && global.connection.state !== 'disconnected' )
      return global.connection;

  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection({host:'remotemysql.com', user: 'pWQdIHEhPN', password:'ohuBMcHJ4e', database: 'pWQdIHEhPN'});

  console.log("Conectou no MySQL!");
  
  global.connection = connection;

  return connection;

}

exports.post = async (req, res) => {

  const conn = await connect();
  const sql = 'INSERT INTO veiculos (placa, modelo, marca, ano, valor) VALUES (?,?,?,?,?);';
  const values = [req.body.placa, req.body.modelo, req.body.marca, req.body.ano, req.body.valor];
  await conn.query(sql, values);
  
  res.status(201).send('Veiculo cadastrado com sucesso!');

};

exports.put = async (req, res, next) => {

  let id = req.params.id;

  const conn = await connect();
  const sql = 'UPDATE veiculos SET placa=?, modelo=?, marca=?, ano=?, valor=? WHERE idveiculo = ?;';
  const values = [req.body.placa, req.body.modelo, req.body.marca, req.body.ano, req.body.valor, id];

  await conn.query(sql, values);

  res.status(201).send('Veiculo alterado com sucesso!');

};

exports.delete = async (req, res, next) => {

  let id = req.params.id;

  const conn = await connect();
  const sql = 'DELETE FROM veiculos WHERE idveiculo = ?;';
  const values = [id];

  await conn.query(sql, values);

  res.status(200).send('Veiculo deletado com sucesso!');

};

exports.get = async (req, res, next) => {

  const conn = await connect();
  const [rows] = await conn.query('SELECT * FROM veiculos;');

  res.status(200).send(rows);

};

exports.getById = async (req, res, next) => {

  const conn = await connect();
  const [rows] = await conn.query('SELECT * FROM veiculos WHERE idveiculo = ' + req.params.id);

  if (rows.length > 0) {
    res.status(200).send(rows[0]);
  } 
  else {
    res.status(404).send("Veiculo não existe");
  }

};
