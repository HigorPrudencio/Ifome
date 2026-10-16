// Carrinho onde vamos guardar os produtos
let carrinho = [];


// FUNÇÃO PARA ADICIONAR PRODUTO
function adicionarProduto(nome, preco) {

    // Verifica se o produto já existe no carrinho
    const produtoExistente = carrinho.find(
        produto => produto.nome === nome
    );


    // Se já existe, aumenta a quantidade
    if (produtoExistente) {

        produtoExistente.quantidade++;

    } else {

        // Se não existe, adiciona um novo produto
        carrinho.push({
            nome: nome,
            preco: preco,
            quantidade: 1
        });

    }


  


    // Atualiza o carrinho na tela
    atualizarCarrinho();
}



// FUNÇÃO PARA ATUALIZAR O CARRINHO
function atualizarCarrinho() {

    const listaCarrinho = document.getElementById("lista-carrinho");

    const totalElemento = document.getElementById("total");


    // Limpa o conteúdo atual
    listaCarrinho.innerHTML = "";


    // Se não tiver produtos
    if (carrinho.length === 0) {

        listaCarrinho.innerHTML = `
            <p>Nenhum produto adicionado.</p>
        `;

        totalElemento.textContent = "0.00";

        return;
    }


    // Total da compra
    let total = 0;


    // Percorre todos os produtos
    carrinho.forEach((produto, index) => {

        // Calcula o preço
        const subtotal = produto.preco * produto.quantidade;

        total += subtotal;


        // Cria o produto na tela
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
                <strong>
                    R$ ${subtotal.toFixed(2)}
                </strong>

                <button
                    class="remover"
                    onclick="removerProduto(${index})">
                    X
                </button>
            </div>
        `;


        listaCarrinho.appendChild(item);

    });


    // Mostra o total
    totalElemento.textContent = total.toFixed(2);
}



// FUNÇÃO PARA REMOVER PRODUTO
function removerProduto(index) {

    // Diminui a quantidade
    if (carrinho[index].quantidade > 1) {

        carrinho[index].quantidade--;

    } else {

        // Remove o produto
        carrinho.splice(index, 1);

    }


    // Atualiza a tela
    atualizarCarrinho();
}



// FUNÇÃO PARA FINALIZAR PEDIDO
function finalizarPedido() {

    // Verifica se o carrinho está vazio
    if (carrinho.length === 0) {

        alert("Adicione algum produto ao pedido.");

        return;
    }


    // Calcula o total
    let total = 0;

    carrinho.forEach(produto => {

        total += produto.preco * produto.quantidade;

    });

    


    // Mostra mensagem
    alert(
        "Pedido realizado com sucesso!\n\n" +
        "Total: R$ " + total.toFixed(2)
    );


    // Limpa o carrinho
    carrinho = [];


    // Atualiza a tela
    atualizarCarrinho();


    
}
