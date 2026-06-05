// Lista que guarda as tecnologias cadastradas
let tecnologias = [];

// Campos do formulário
const nomeInput = document.getElementById("nome");
const descricaoInput = document.getElementById("descricao");

// Botão de cadastro
const btnCadastrar = document.getElementById("btnCadastrar");

// Área onde os itens serão mostrados
const lista = document.getElementById("lista");

// Texto que mostra a quantidade cadastrada
const contador = document.getElementById("contador");

// Campo de pesquisa
const pesquisaInput = document.getElementById("pesquisa");

// Função que atualiza os itens exibidos na tela
function atualizarLista() {

    // Limpa a lista antes de reconstruí-la
    lista.innerHTML = "";

    // Obtém o texto digitado na pesquisa
    const pesquisa = pesquisaInput.value.toLowerCase();

    // Filtra as tecnologias de acordo com a pesquisa
    const tecnologiasFiltradas = tecnologias.filter(
        tecnologia =>
        tecnologia.nome.toLowerCase().includes(pesquisa)
    );

    // Cria os elementos na tela
    tecnologiasFiltradas.forEach((tecnologia, indice) => {

        const div = document.createElement("div");

        div.classList.add("tecnologia");

        div.innerHTML = `
            <h3>${tecnologia.nome}</h3>
            <p>${tecnologia.descricao}</p>
            <button class="remover" onclick="removerTecnologia(${indice})">
                Remover
            </button>
        `;

        lista.appendChild(div);
    });

    // Atualiza o contador
    contador.textContent =
        `Total: ${tecnologias.length} tecnologias cadastradas`;
}

// Remove um item da lista
function removerTecnologia(indice) {

    tecnologias.splice(indice, 1);

    atualizarLista();
}

// Evento executado ao clicar em cadastrar
btnCadastrar.addEventListener("click", function () {

    const nome = nomeInput.value.trim();
    const descricao = descricaoInput.value.trim();

    // Verifica se os campos estão vazios
    if (nome === "" || descricao === "") {
        alert("Preencha todos os campos.");
        return;
    }

    // Verifica se a tecnologia já existe
    const existe = tecnologias.some(
        tecnologia =>
            tecnologia.nome.toLowerCase() === nome.toLowerCase()
    );

    if (existe) {
        alert("Essa tecnologia já foi cadastrada.");
        return;
    }

    // Adiciona a tecnologia ao vetor
    tecnologias.push({
        nome,
        descricao
    });

    atualizarLista();

    // Limpa os campos após o cadastro
    nomeInput.value = "";
    descricaoInput.value = "";
});

// Atualiza a pesquisa em tempo real
pesquisaInput.addEventListener("input", atualizarLista);
