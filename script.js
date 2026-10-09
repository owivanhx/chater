// Classe Chater
class Chater {
  constructor(nome, obra, resumo, imagem) {
    this.id = Date.now() + Math.random(); 
    this.nome = nome;     
    this.obra = obra;     
    this.resumo = resumo; 
    this.imagem = imagem; 
    this.estilo = ["white", "blue-tint", "cream"][Math.floor(Math.random() * 3)]; 
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("addBtn");
  const journalsGrid = document.getElementById("journalsGrid");

  // Dados padrão para carregar caso o servidor não responda
  const defaultJournals = [
    new Chater("Hyuna", "Alien Stage", "uma garota descolada, com uma prótese na perna", "https://i.pinimg.com/736x/d0/fc/61/d0fc61c011af066710aa3dfa8ede3cb6.jpg"),
    new Chater("Phainon", "Honkai: Star Rail", "???", "https://i.pinimg.com/736x/cf/72/23/cf7223a90c2f0fffd45be13dce39f3bd.jpg"),
    new Chater("Aki Maeno", "ZENO remake", "um jovem adulto de 23 anos, que tinha uma doença, mas agora é médico", "https://i.pinimg.com/736x/fb/d3/9d/fbd39dcc39d8f6ed9f8ffd536eb5797e.jpg")
  ];

  let currentJournals = [];

  // 1, 2 e 3) Tenta buscar do servidor. Se falhar, usa a lista padrão!
  function loadJournalsFromServer() {
    fetch('/api/lista')
      .then(response => {
        if (!response.ok) throw new Error("Erro na resposta do servidor");
        return response.json();
      })
      .then(data => {
        console.log("Resultado do fetch():", data); 
        currentJournals = data;
        renderJournals(currentJournals);            
      })
      .catch(error => {
        console.warn("Servidor offline ou rota indisponível. Carregando lista padrão de segurança:", error);
        currentJournals = defaultJournals;
        renderJournals(currentJournals);
      });
  }

  // 4) Renderizar os personagens na tela
  function renderJournals(journals) {
    journalsGrid.innerHTML = "";

    if (!journals || journals.length === 0) {
      journalsGrid.innerHTML = "<p style='text-align:center; width:100%; color:#888;'>Nenhum personagem cadastrado.</p>";
      return;
    }

    journals.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("journal-card");

      card.innerHTML = `
        <button class="delete-btn" onclick="deleteJournal(${item.id})">✕</button>
        <div class="book ${item.estilo || 'white'}">
          <span class="strap"></span>
          <h2 class="book-title">${item.nome}</h2>
          <div class="polaroid">
            <img src="${item.imagem}" alt="${item.obra}" onerror="this.src='https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300'">
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

  // 5) Criar novo item e enviar para o servidor
  addBtn.addEventListener("click", () => {
    const nome = prompt("Nome do personagem:", "insira o nome");
    if (!nome || nome.trim() === "") return;

    const obra = prompt("Nome da obra:", "insira a obra") || "obra não definida";
    const resumo = prompt("Escreva um resumo sobre o personagem:", "insira o resumo") || "resumo não definido";
    const imagem = prompt("URL da imagem:") || "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300";

    const novoChater = new Chater(nome.trim(), obra.trim(), resumo.trim(), imagem.trim());

    // Tenta enviar pro servidor; se falhar, insere na tela localmente
    fetch('/api/lista', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoChater)
    })
    .then(response => response.json())
    .then(itemSalvo => {
      currentJournals.push(itemSalvo);
      renderJournals(currentJournals);
    })
    .catch(() => {
      currentJournals.push(novoChater);
      renderJournals(currentJournals);
    });
  });

  // 6) Apagar personagem
  window.deleteJournal = function (id) {
    if (confirm("Deseja apagar este registro?")) {
      fetch(`/api/lista/${id}`, { method: 'DELETE' })
      .catch(err => console.log("Removido apenas localmente:", err));

      currentJournals = currentJournals.filter((item) => item.id !== id);
      renderJournals(currentJournals);
    }
  };

  // Inicializa a busca dos dados
  loadJournalsFromServer();
});
