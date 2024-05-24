import React, { useState, useEffect } from 'react';

const ApiDataPage = () => {
  const [dadosDaApi, setDadosDaApi] = useState(null);

  useEffect(() => {
    fetch('/api/dados')
      .then(response => response.json())
      .then(data => {
        setDadosDaApi(data);
      })
      .catch(error => {
        console.error('Erro ao buscar dados da API:', error);
      });
  }, []);

  return (
    <div>
      <h1>Dados da API</h1>
      {dadosDaApi ? (
        <div>
          {/* Renderizar os dados da API aqui */}
          <pre>{JSON.stringify(dadosDaApi, null, 2)}</pre>
        </div>
      ) : (
        <div>A carregar...</div>
      )}
    </div>
  );
};

export default ApiDataPage;
