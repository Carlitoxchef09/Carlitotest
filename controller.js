const express = require("express")
const cors = require("cors")
const app = express()
const mysql2 = require('mysql2');
const pool = require('./bd');
app.use(express.json());
app.use(cors())



app.post('/enviar/comida', async (req, res) => {
  const { entrada, pratoprincipal, acompanhamento, sobremesa } = req.body;
  console.log(entrada, pratoprincipal, acompanhamento, sobremesa)
  try {
    await pool.query('INSERT INTO comida (entrada, pratoprincipal, acompanhamento, sobremesa) VALUES (?, ?, ?, ?)', [entrada, pratoprincipal, acompanhamento, sobremesa]);
    return res.status(201).json({ message: 'Comida registrado com sucesso.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao registrar comida.' });
  }
});


app.get("/pegar/comida", async (req, res) => {
  try {
    const [rows, fields] = await pool.query("SELECT * FROM comida");
    return res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    return res.status(404).json({ message: "erro ao obter dados" });
  }
});


app.delete("/deletar/comida/:id", async (req, res) => {
  const { id } = req.params


  if (!id) {
      return res.status(400).json({ message: 'Envie o ID !.' });
  }


  try {
      // Verifica se o registro existe
      const [rows] = await pool.query('SELECT * FROM comida WHERE id = ?', [id]);
      if (rows.length <= 0) {
          console.log(rows)
          return res.status(404).json({ message: 'Este registro não existe' });
      }

      // console.log(rows)

      //Delete o usuário no banco de dados
      await pool.query('DELETE FROM comida WHERE id = ?', [id]);

      res.status(200).json({ message: "Comida deletado com sucesso" });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao deletar comida.' });
  }
})


app.put("/atualizar/comida/:id", async (req, res) => {
  const { id } = req.params
  var { entrada, pratoprincipal, acompanhamento, sobremesa } = req.body;


  if (!entrada || !pratoprincipal || !acompanhamento || !sobremesa) {
      return res.status(400).json({ message: 'Preencha todos os campos.' });
  }


  try {
      // Verifica se o registro existe
      const [rows] = await pool.query('SELECT * FROM comida WHERE id = ?', [id]);
      if (rows.length <= 0) {
          console.log(rows)
          return res.status(404).json({ message: 'Este registro não existe' });
      }

      // console.log(rows)

      //Atualizar o usuário no banco de dados
      await pool.query('UPDATE comida set entrada = ?, pratoprincipal = ?, acompanhamento = ?, sobremesa = ? WHERE id = ?', [entrada, pratoprincipal, acompanhamento, sobremesa, id]);

      res.status(200).json({ message: "Comida atualizado com sucesso" });

      // return res.status(201).json({ message: 'Usuário registrado com sucesso.' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao atualizar comida.' });
  }
})


app.post('/logar/comida', async (req, res) => {
  const { entrada, pratoprincipal, acompanhamento, sobremesa } = req.body;
  // console.log(req.body)
  if (!entrada || !pratoprincipal || !acompanhamento || !sobremesa) {
      return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  try {
      // Verifica se o nome já está em uso
      const [rows, fields] = await pool.query('SELECT * FROM comida WHERE entrada = ? AND pratoprincipal = ? AND acompanhamento = ? AND sobremesa = ?', [entrada, pratoprincipal, acompanhamento, sobremesa]);
      if (rows.length > 0) {
          // console.log(rows[0].adm);
          if (rows[0].adm === 1) {
              return res.status(200).json({ adm: true });
          } else {
              return res.status(200).json({ adm: "logado" });
          }

      }


      return res.status(400).json({ message: 'dados invalidos' });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao logar comida.' });
  }



});


app.listen(3000, () => {
  console.log("rodando")
})
