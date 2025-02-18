import React, { useState } from 'react';
import './App.css';

function App() {
  // Definindo os estados'
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Função para tratar a mudança no campo de entrada do CEP
  const handleChange = (e) => {
    setCep(e.target.value);
  };

  // Função chamada ao submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setLoading(true);    
    setError('');        

    try {
      // Faz a requisição à API ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

      if (!response.ok) {
        throw new Error('Erro ao consultar o CEP');
      }

      const data = await response.json();

      // Verifica se a API retornou erro (quando o CEP não é encontrado)
      if (data.erro) {
        throw new Error('CEP não encontrado');
      }

      // Atualiza o estado com as informações do endereço
      setEndereco(data);
    } catch (err) {
      // Se ocorrer um erro (seja na requisição ou no retorno da API)
      setError(err.message);
      setEndereco(null); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="App">
      <h1>Consulta de Endereço por CEP</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="cep">Digite o CEP:</label>
        <input
          id="cep"
          type="text"
          value={cep}
          onChange={handleChange}
          placeholder="Ex: 01001000"
          maxLength="8"
          required
        />
        <button type="submit" disabled={loading}>Consultar</button>
      </form>

      {loading && <p>Carregando...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {endereco && (
        <div>
          <h2>Endereço Encontrado:</h2>
          <p><strong>Logradouro:</strong> {endereco.logradouro}</p>
          <p><strong>Bairro:</strong> {endereco.bairro}</p>
          <p><strong>Cidade:</strong> {endereco.localidade}</p>
          <p><strong>Estado:</strong> {endereco.uf}</p>
        </div>
      )}
    </div>
  );
}

export default App;
