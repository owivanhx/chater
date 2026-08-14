// 1. Classe conforme solicitada (com o método constructor corrigido)
class Chater {
  constructor(nome, obra, resumo, imagem) {
    this.id = Date.now() + Math.random(); // ID único para salvar/deletar
    this.nome = nome;     // Corresponde ao Título do diário
    this.obra = obra;     // Corresponde ao Nome da obra/categoria
    this.resumo = resumo; // Descrição ou número de páginas
    this.imagem = imagem; // URL da imagem do Polaroid
    this.estilo = ["white", "blue-tint", "cream"][Math.floor(Math.random() * 3)]; // Cor da capa
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addBtn");
  const journalsGrid = document.getElementById("journalsGrid");

  // Dados iniciais baseados na classe Chater
  const defaultJournals = [
    new Chater("Hyuna", "Alien Stage", "uma garota descolada, com uma protese na perna", "https://i.pinimg.com/736x/d0/fc/61/d0fc61c011af066710aa3dfa8ede3cb6.jpg"),
    new Chater("Phainon", "Honkai: Star Rail", "???", "https://i.pinimg.com/736x/cf/72/23/cf7223a90c2f0fffd45be13dce39f3bd.jpg"),
    new Chater("Aki Maeno", "ZENO remake", "um jovem adulto de 23 anos, que tinha uma doença, mas agora é medico", "https://i.pinimg.com/736x/fb/d3/9d/fbd39dcc39d8f6ed9f8ffd536eb5797e.jpg")
  ];

  // 2. Carregar dados da "nuvem" do navegador (localStorage)
  function loadJournals() {
    const saved = localStorage.getItem("dayol_journals");
    return saved ? JSON.parse(saved) : defaultJournals;
  }

  // 3. Salvar alterações
  function saveJournals(journals) {
    localStorage.setItem("dayol_journals", JSON.stringify(journals));
  }

  // 4. Renderizar a lista de cadernos na tela
  function renderJournals() {
    const journals = loadJournals();
    journalsGrid.innerHTML = "";

    journals.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("journal-card");

      card.innerHTML = `
        <button class="delete-btn" onclick="deleteJournal(${item.id})">✕</button>
        <div class="book ${item.estilo || 'white'}">
          <span class="strap"></span>
          <h2 class="book-title">${item.nome}</h2>
          <div class="polaroid">
            <img src="${item.imagem}" alt="${item.obra}">
            <img src="bowblack.png" class="bow top-right" alt="Laço">
          </div>
        </div>
        <div class="journal-info">
          <h3>${item.obra} <span class="dots">•••</span></h3>
          <p>${item.resumo}</p>
        </div>
      `;
      
      journalsGrid.appendChild(card);
    });
  }

  // 5. Criar novo item usando a classe Chater
  addBtn.addEventListener("click", () => {
    const nome = prompt("nome do personagem :", "ensira o nome");
    if (!nome || nome.trim() === "") return;

    const obra = prompt("nome da obra :", "ensira a obra") || "obra não definida";
    const resumo = prompt("escreva um resumo sobre o perso :", "ensira o resumo") || "resumo não definido";
    const imagem = prompt("URL da imagem :") || "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300";

    // Criando a nova instância da classe Chater
    const novoChater = new Chater(nome.trim(), obra.trim(), resumo.trim(), imagem.trim());

    const journals = loadJournals();
    journals.push(novoChater);
    
    saveJournals(journals);
    renderJournals();
  });

  // 6. Função para apagar caderno
  window.deleteJournal = function (id) {
    if (confirm("deseja apagar este registro?")) {
      let journals = loadJournals();
      journals = journals.filter((item) => item.id !== id);
      saveJournals(journals);
      renderJournals();
    }
  };

  // Inicializa o site
  renderJournals();
});
