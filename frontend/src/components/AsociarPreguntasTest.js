import React, { useState } from 'react';
import axios from 'axios';

const AsociarPreguntasTest = () => {
  const [idTest, setIdTest] = useState('');
  const [preguntas, setPreguntas] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const idsPreguntas = preguntas.split(',').map(id => parseInt(id.trim()));

    try {
      const response = await axios.post('http://localhost:3000/api/test-pregunta/asociar', {
        id_test: parseInt(idTest),
        preguntas: idsPreguntas
      });

      setMensaje(response.data.mensaje || 'Preguntas asociadas correctamente');
      setIdTest('');
      setPreguntas('');
    } catch (error) {
      console.error('Error al asociar:', error);
      setMensaje('Error al asociar preguntas');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Asociar preguntas a un test</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID del Test:</label><br />
          <input
            type="number"
            value={idTest}
            onChange={(e) => setIdTest(e.target.value)}
            required
          />
        </div>
        <div>
          <label>IDs de preguntas (separados por coma):</label><br />
          <input
            type="text"
            value={preguntas}
            onChange={(e) => setPreguntas(e.target.value)}
            required
          />
        </div>
        <button type="submit">Asociar</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default AsociarPreguntasTest;
