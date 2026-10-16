
 // CATÁLOGO DE PRODUTOS
const produtos = [
    {
        nome: "Hambúrguer",
        descricao: "Hambúrguer artesanal com queijo e salada.",
        preco: 25,
        categoria: "Lanches",
        imagem: "comidas/hamburger1.webp"
    },
    {
        nome: "Batata Frita",
        descricao: "Porção de batata frita crocante.",
        preco: 15,
        categoria: "Porções",
        imagem: "comidas/batata.webp"
    },
    {
        nome: "Refrigerante",
        descricao: "Refrigerante lata 350ml.",
        preco: 7,
        categoria: "Bebidas",
        imagem: "comidas/refri.avif"
    },
    {
        nome: "X-Salada",
        descricao: "Lanche com salada.",
        preco: 30,
        categoria: "Lanches",
        imagem: "comidas/xsalada.png"
    },
    {
        nome: "Tábua de Maminha",
        descricao: "300 gramas de maminha.",
        preco: 50,
        categoria: "Porções",
        imagem: "comidas/tabuacarne.jpg"
    },
    {
        nome: "Açaí Puro",
        descricao: "500 ml de açaí puro.",
        preco: 33,
        categoria: "Açaí",
        imagem: "comidas/acai.webp"
    }
];

// MOSTRAR PRODUTOS NA TELA
function renderizarProdutos(lista) {
    const container = document.getElementById("lista-produtos");
    const mensagem = document.getElementById("nenhum-resultado");

    if (!container || !mensagem) {
        console.error("Confira os elementos do catálogo no HTML.");
        return;
    }

    container.innerHTML = "";
    mensagem.hidden = lista.length > 0;

    lista.forEach(produto => {
        const card = document.createElement("div");
        card.className = "produto";

        const imagem = document.createElement("img");
        imagem.src = produto.imagem;
        imagem.alt = produto.nome;
        imagem.loading = "lazy";

        const titulo = document.createElement("h3");
        titulo.textContent = produto.nome;

        const descricao = document.createElement("p");
        descricao.textContent = produto.descricao;

        const preco = document.createElement("strong");
        preco.textContent = produto.preco.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        const botao = document.createElement("button");
        botao.textContent = "Adicionar";

        botao.addEventListener("click", () => {
            adicionarProduto(produto.nome, produto.preco);
        });

        card.append(imagem, titulo, descricao, preco, botao);
        container.appendChild(card);
    });
}

// PESQUISAR PRODUTOS
document.getElementById("pesquisa-produtos")
    .addEventListener("input", function () {
        const termo = normalizarTexto(this.value);

        const encontrados = produtos.filter(produto => {
            const texto = normalizarTexto(
                produto.nome + " " +
                produto.descricao + " " +
                produto.categoria
            );

            return texto.includes(termo);
        });

        renderizarProdutos(encontrados);
    });

// IGNORAR DIFERENÇAS DE ACENTUAÇÃO
function normalizarTexto(texto) {
    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

// CARREGAR CATÁLOGO INICIAL
renderizarProdutos(produtos);
 
 
 
 
 // Carrinho onde vamos guardar os produtos
let carrinho = [];

// FUNÇÃO PARA ADICIONAR PRODUTO
function adicionarProduto(nome, preco) {
    const produtoExistente = carrinho.find(
        produto => produto.nome === nome
    );

    if (produtoExistente) {
        produtoExistente.quantidade++;
    } else {
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });
    }

    atualizarCarrinho();
}

// FUNÇÃO PARA ATUALIZAR O CARRINHO
function atualizarCarrinho() {
    const listaCarrinho = document.getElementById("lista-carrinho");
    const totalElemento = document.getElementById("total");

    listaCarrinho.innerHTML = "";

    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = `
            <p>Nenhum produto adicionado.</p>
        `;

        totalElemento.textContent = "0.00";
        return;
    }

    let total = 0;

    carrinho.forEach((produto, index) => {
        const subtotal = produto.preco * produto.quantidade;
        total += subtotal;

        const item = document.createElement("div");
        item.classList.add("item-carrinho");

        item.innerHTML = `
            <div>
                <strong>${produto.nome}</strong>
                <p>
                    ${produto.quantidade}x
                    R$ ${produto.preco.toFixed(2)}
                </p>
            </div>

            <div>
                <strong>R$ ${subtotal.toFixed(2)}</strong>
                <button
                    class="remover"
                    onclick="removerProduto(${index})">
                    X
                </button>
            </div>
        `;

        listaCarrinho.appendChild(item);
    });

    totalElemento.textContent = total.toFixed(2);
}

// FUNÇÃO PARA REMOVER PRODUTO
function removerProduto(index) {
    if (carrinho[index].quantidade > 1) {
        carrinho[index].quantidade--;
    } else {
        carrinho.splice(index, 1);
    }

    atualizarCarrinho();
}

// FUNÇÃO PARA FINALIZAR PEDIDO
function finalizarPedido() {
    const mensagem = document.getElementById("mensagem-pedido");
    const titulo = document.getElementById("titulo-pedido");
    const texto = document.getElementById("texto-pedido");
    const botao = document.querySelector(".finalizar");

    // Verifica se os elementos da mensagem existem
    if (!mensagem || !titulo || !texto || !botao) {
        console.error(
            "Não encontrei a mensagem do pedido no HTML. Confira os IDs."
        );
        return;
    }

    // Verifica se o carrinho está vazio
    if (carrinho.length === 0) {
        titulo.textContent = "Seu carrinho está vazio";
        texto.textContent = "Adicione algum produto antes de finalizar.";

        mensagem.classList.add("visivel");

        clearTimeout(window.temporizadorPedido);

        window.temporizadorPedido = setTimeout(() => {
            mensagem.classList.remove("visivel");
        }, 4000);

        return;
    }

    // Calcula o total do pedido
    let total = 0;

    carrinho.forEach(produto => {
        total += produto.preco * produto.quantidade;
    });

    // Mostra a confirmação dentro do site
    titulo.textContent = "Pedido em preparação!";
    texto.textContent =
        "Seu pedido foi confirmado. Total: R$ " +
        total.toFixed(2).replace(".", ",");

    mensagem.classList.add("visivel");

    // Desativa o botão temporariamente
    botao.disabled = true;
    botao.textContent = "Pedido confirmado";

    // Limpa o carrinho
    carrinho = [];
    atualizarCarrinho();

    // Esconde a mensagem e libera um novo pedido
    clearTimeout(window.temporizadorPedido);

    window.temporizadorPedido = setTimeout(() => {
        mensagem.classList.remove("visivel");
        botao.disabled = false;
        botao.textContent = "Finalizar pedido";
    }, 4500);
}
