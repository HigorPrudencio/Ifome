
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
