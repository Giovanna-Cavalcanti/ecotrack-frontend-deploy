import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const filePath = path.resolve('public/descarte.json');

// Adicionar novo material ao descarte.json
router.post('/adicionar', (req, res) => {
  const { nome } = req.body;

  if (!nome || typeof nome !== 'string') {
    return res.status(400).json({ message: 'Nome inválido' });
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Erro ao ler o arquivo JSON' });

    let json;
    try {
      json = JSON.parse(data);
    } catch (e) {
      return res.status(500).json({ error: 'Erro ao interpretar o JSON' });
    }

    if (!json[nome]) {
      json[nome] = {
        nome,
        material: "Desconhecido",
        tipo: "Não identificado",
        risco: "Sem informação.",
        descarte: "Consulte autoridade local."
      };

      fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf8', err => {
        if (err) return res.status(500).json({ error: 'Erro ao salvar o arquivo' });
        return res.status(201).json({ message: 'Material adicionado ao banco de descarte' });
      });
    } else {
      return res.status(200).json({ message: 'Material já existe no banco de descarte' });
    }
  });
});

export default router;
