let model;
const video = document.getElementById('webcam');
const resultado = document.getElementById('resultado');

// Iniciar webcam e carregar modelo
async function iniciar() {
  model = await mobilenet.load();

  navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    video.srcObject = stream;
  });
}
iniciar();

// Analisar objeto e classificar material
async function analisar() {
  const predictions = await model.classify(video);
  const objeto = predictions[0].className.toLowerCase(); // deixa tudo minúsculo para evitar erros de leitura do JSON

  fetch('descarte.json')
    .then(res => res.json())
    .then(dados => {
      const info = dados[objeto] || {
        nome: objeto,
        material: "Desconhecido",
        tipo: "Não identificado",
        risco: "Não foi possível determinar o risco.",
        descarte: "Consulte autoridades locais ou descarte especializado."
      };

      resultado.innerHTML = `
        <strong>Objeto:</strong> ${info.nome}<br>
        <strong>Material:</strong> ${info.material}<br>
        <strong>Classificação:</strong> ${info.tipo}<br>
        <strong>Risco:</strong> ${info.risco}<br>
        <strong>Descarte:</strong> ${info.descarte}
      `;

      const mensagem = `Você está segurando um(a) ${info.nome}. 
        Material: ${info.material}. 
        Tipo: ${info.tipo}. 
        Risco: ${info.risco}. 
        Descarte recomendado: ${info.descarte}.`;

      const fala = new SpeechSynthesisUtterance(mensagem);
      speechSynthesis.speak(fala);
    });
}