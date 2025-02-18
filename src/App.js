import React, { useState } from 'react';
import './App.css';

function App() {
  // Definindo os estados
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Função para tratar a mudança no campo de entrada do CEP
  const handleChange = (e) => {
    let value = e.target.value;

    // Remover tudo que não for número
    value = value.replace(/\D/g, '');

    // Adicionar a máscara "00000-000"
    if (value.length <= 5) {
      value = value.replace(/(\d{5})(\d{0,3})/, '$1-$2');
    } else {
      value = value.replace(/(\d{5})(\d{0,3})/, '$1-$2');
    }

    setCep(value);
  };

  // Função chamada ao submeter o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Aqui, a ideia é começar o "carregando" antes de qualquer outra coisa
    setLoading(true);
    setError('');        
    setEndereco(null);   

    // Remover o traço ao enviar para a API
    const cepSemMascara = cep.replace("-", "");

    try {
      // Faz a requisição à API ViaCEP
      debugger
      const response = await fetch(`https://viacep.com.br/ws/${cepSemMascara}/json/`);

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
      setEndereco(null); // Limpa o endereço anterior
    } finally {
      // Limpa o timeout para garantir que o "carregando" só desapareça após um tempo
      setLoading(false); // Desliga o carregando
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
          placeholder="Ex: 01001-000"
          maxLength="9" // Limita o tamanho máximo do campo
          required
        />
        <button type="submit" disabled={loading}>Consultar</button>
      </form>

      {loading && <p className="loading">Carregando...</p>}

      {error && <p className="error">{error}</p>}

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
