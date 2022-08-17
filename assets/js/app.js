const vm = new Vue({
    el:"#app",

    data:{
        produtos:[],
        produto: false,
        carrinho:[],
        mensagemAlerta:"Item adicionado",
        alertaAtivo: false,
        carrinhoAtivo: false,
    },
    filters:{
        numeroPreco(valor){
            return valor.toLocaleString('pt-BR', {
                style: 'currency',
                currency: "BRL"
            });
        }
    },
    computed:{
        carrinhoTotal(){
            let total = 0;
            if(this.carrinho.length){
                this.carrinho.forEach(item=>{
                    total+= item.preco;
                });
            }
            return total;
        }
    },
    
    methods:{
        fetchProdutos(){
            fetch("../../api/produtos.json")
            .then(r => r.json())
            .then(r=> this.produtos = r);
        },
        fetchProduto(id){
            fetch(`../../api/produtos/${id}/dados.json`)
            .then(r=>r.json())
            .then(r=> this.produto = r);
        },
        abrirModal(id){
            this.fetchProduto(id);
            window.scrollTo({
                top:0,
                behavior:"smooth",
            })
        },
        adicionarItem(){
            this.produto.estoque--;
            const {id, nome, preco} = this.produto;
            this.carrinho.push({id, nome, preco});
            this.alerta(`${nome} foi adicionado ao carrinho`)
        },
        removerItem(index){
            this.carrinho.splice(index, 1);
        },
        compararEstoque(){
            const items = this.carrinho.filter(({id}) => id === this.produto.id);
            this.produto.estoque -= items.length;
            return items;
        },
        checarLocalStorage(){
            if(window.localStorage.carrinho){
                this.carrinho = JSON.parse(window.localStorage.carrinho);
            }
        },
        fecharModal({target, currentTarget}){
            if(target === currentTarget) this.produto = false;
        },
        clickForaCarrinho({target, currentTarget}){
            if(target === currentTarget) this.carrinhoAtivo = false;
        },
        alerta(mensagem){
            this.mensagemAlerta = mensagem;
            this.alertaAtivo = true;
            setTimeout(()=>{
                this.alertaAtivo = false;
            }, 1500)
        },
        router(){
            const hash = document.location.hash.replace("#","");
            if(hash){
                this.fetchProduto(hash);
            }
        }
    },
    watch:{
        produto(){
            document.title = this.produto.nome || "Techno";
            const hash = this.produto.id || "";
            history.pushState(null, null, `#${hash}`)
            if(this.produto){
                this.compararEstoque();
            }
        },
        carrinho(){
            window.localStorage.carrinho = JSON.stringify(this.carrinho);
        }
    },
    created(){
        this.router();
        this.checarLocalStorage();
        this.fetchProdutos();
    },
})