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
    new Chater("my planner <3", "DAYOL", "4page", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300"),
    new Chater("my diary <3", "DAYOL", "1page", "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300"),
    new Chater("scrapbook", "DAYOL", "0page", "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=300")
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
            <span class="bow top-right">🎀</span>
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
    const nome = prompt("Nome do caderno/card:", "meu novo diário");
    if (!nome || nome.trim() === "") return;

    const obra = prompt("Nome da obra / categoria:", "New Diary") || "New Diary";
    const resumo = prompt("Resumo / número de páginas:", "0page") || "0page";
    const imagem = prompt("URL da imagem (opcional):") || "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300";

    // Criando a nova instância da classe Chater
    const novoChater = new Chater(nome.trim(), obra.trim(), resumo.trim(), imagem.trim());

    const journals = loadJournals();
    journals.push(novoChater);
    
    saveJournals(journals);
    renderJournals();
  });

  // 6. Função para apagar caderno
  window.deleteJournal = function (id) {
    if (confirm("Deseja apagar este registro?")) {
      let journals = loadJournals();
      journals = journals.filter((item) => item.id !== id);
      saveJournals(journals);
      renderJournals();
    }
  };

  // Inicializa o site
  renderJournals();
});
