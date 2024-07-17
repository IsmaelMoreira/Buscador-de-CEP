// Seleciona o campo de entrada do CEP
const cepInput = document.getElementById('cep');

// Adiciona um ouvinte de evento para validar o input do CEP
cepInput.addEventListener('input', function() {
  // Remove qualquer caracter não numérico exceto o hífen
  this.value = this.value.replace(/[^\d-]/g, '');
});


document.getElementById('consultarBtn').addEventListener('click', function() {
  const cep = document.getElementById('cep').value;

  if (!cep) {
    alert('Por favor, digite um CEP válido.');
    return;
  }

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(response => response.json())
    .then(data => {
      if (data.erro) {
        document.getElementById('resultado').innerHTML = '<p class="text-danger">CEP não encontrado. Por favor, tente novamente.</p>';
      } else {
        document.getElementById('resultado').innerHTML = `
          <p><strong>CEP:</strong> ${data.cep}</p>
          <p><strong>Logradouro:</strong> ${data.logradouro}</p>
          <p><strong>Bairro:</strong> ${data.bairro}</p>
          <p><strong>Cidade:</strong> ${data.localidade}</p>
          <p><strong>Estado:</strong> ${data.uf}</p>
        `;

        // Coordenadas do local do CEP
        const endereco = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`;
        fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&limit=1`)
          .then(response => response.json())
          .then(locationData => {
            if (locationData.length > 0) {
              const { lat, lon } = locationData[0];
              const map = L.map('map').setView([lat, lon], 15);
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }).addTo(map);
              L.marker([lat, lon]).addTo(map)
                .bindPopup(`<b>${data.logradouro}</b><br>${data.bairro}, ${data.localidade}, ${data.uf}`)
                .openPopup();
            } else {
              document.getElementById('resultado').innerHTML += '<p class="text-danger">Localização não encontrada no mapa.</p>';
            }
          })
          .catch(error => {
            console.error('Erro ao buscar a localização:', error);
            document.getElementById('resultado').innerHTML += '<p class="text-danger">Erro ao buscar a localização no mapa. Por favor, tente novamente mais tarde.</p>';
          });
      }
    })
    .catch(error => {
      console.error('Erro ao buscar o CEP:', error);
      document.getElementById('resultado').innerHTML = '<p class="text-danger">Erro ao buscar o CEP. Por favor, tente novamente mais tarde.</p>';
    });
});
