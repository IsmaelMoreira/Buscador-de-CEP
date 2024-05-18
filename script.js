function consultaEndereco() {
  let cep = document.querySelector('#cep').value;
  if (cep.length !== 8) {
    alert('Digite um CEP válido');
    return;
  }

  let url = `https://viacep.com.br/ws/${cep}/json/`;

  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      mostrarEndereco(data);
    })
    .catch(function(error) {
      console.error('Erro ao buscar endereço:', error);
    });
}

function mostrarEndereco(data) {
  let resultado = document.querySelector('#resultado');
  if (data.erro) {
    resultado.innerHTML = 'CEP não encontrado';
  } else {
    resultado.innerHTML = `<p>Endereço: ${data.logradouro}</p>
                            <p>Complemento: ${data.complemento}</p>
                            <p>Bairro: ${data.bairro}</p>
                            <p>Cidade: ${data.localidade} - ${data.uf}</p>`;
  }
}

document.getElementById('consultarBtn').addEventListener('click', consultaEndereco);
