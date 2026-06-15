// --- COMPORTAMENTOS INTERATIVOS DO SITE ---

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializa o Menu Responsivo Mobile
    initMobileMenu();

    // 2. Inicializa o Efeito de Surgimento de Elementos (Scroll Reveal)
    initScrollReveal();

    // 3. Inicializa Carrossel de Produtos se houver na página
    initProductsCarousel();

    // 4. Inicializa Carrossel de Logotipos (Empresas) se houver
    initLogosCarousel();

    // 5. Verifica se há âncoras na URL para rolar e destacar produto
    checkAnchorScrollAndHighlight();
});

// --- MENU RESPONSIVO MOBILE ---
function initMobileMenu() {
    const mobileBtn = document.querySelector("[id*='menu-btn'], button[class*='menu'], [data-toggle='menu']") || document.getElementById("mobile-menu-btn");    const mobileDropdown = document.getElementById("mobile-menu");
    const mobileDropdown = document.querySelector("[id*='menu'], nav[class*='mobile'], .menu, .mobile-menu") || document.getElementById("mobile-menu");
    
    if (mobileBtn && mobileDropdown) {
        mobileBtn.addEventListener("click", () => {
            mobileDropdown.classList.toggle("hidden");
        });
    }
}

// --- EFEITO SCROLL REVEAL ---
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px"
    });

    revealElements.forEach(el => observer.observe(el));
}

// --- CARROSSEL DE PRODUTOS (HOME) ---
function initProductsCarousel() {
    const track = document.getElementById('carouselTrackProd');
    const prevBtn = document.getElementById('prevBtnProd');
    const nextBtn = document.getElementById('nextBtnProd');

    if (!track) return;

    let currentIdx = 0;
    const totalItems = 5; // Quantidade de itens em destaque

    function getVisibleItems() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }

    function updateCarousel() {
        const visible = getVisibleItems();
        const width = 100 / visible;
        track.style.transform = `translateX(-${currentIdx * width}%)`;
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            const visible = getVisibleItems();
            if (currentIdx < totalItems - visible) {
                currentIdx++;
            } else {
                currentIdx = 0;
            }
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            const visible = getVisibleItems();
            if (currentIdx > 0) {
                currentIdx--;
            } else {
                currentIdx = totalItems - visible;
            }
            updateCarousel();
        });
    }

    window.addEventListener('resize', () => {
        currentIdx = 0;
        updateCarousel();
    });
}

// --- CARROSSEL DE LOGOTIPOS (EMPRESAS PARCEIRAS) ---
function initLogosCarousel() {
    const track = document.getElementById('carouselTrackLogos');
    if (!track) return;

    let currentIdx = 0;
    const totalItems = 11; // 11 logotipos atendidos
    let autoPlayInterval;

    function getVisibleItems() {
        if (window.innerWidth >= 1024) return 4;
        if (window.innerWidth >= 768) return 3;
        return 2;
    }

    function updateCarousel() {
        const visible = getVisibleItems();
        const width = 100 / visible;
        track.style.transform = `translateX(-${currentIdx * width}%)`;
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            const visible = getVisibleItems();
            if (currentIdx < totalItems - visible) {
                currentIdx++;
            } else {
                currentIdx = 0;
            }
            updateCarousel();
        }, 2500);
    }

    track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    track.addEventListener('mouseleave', startAutoPlay);

    startAutoPlay();

    window.addEventListener('resize', () => {
        currentIdx = 0;
        updateCarousel();
    });
}

// --- DETECTA ÂNCORAS EXTERNAS E DESTACA O PRODUTO ---
function checkAnchorScrollAndHighlight() {
    const hash = window.location.hash;
    if (hash && hash.startsWith("#prod-")) {
        setTimeout(() => {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetElement.classList.add('ring-4', 'ring-ns-accent', 'scale-105', 'z-10');
                
                setTimeout(() => {
                    targetElement.classList.remove('ring-4', 'ring-ns-accent', 'scale-105', 'z-10');
                }, 2500);
            }
        }, 600);
    }
}

// --- FUNÇÃO PARA ACIONAR DIRETAMENTE DO SEGMENTO DE ORIGEM PARA O PRODUTO ---
function irParaProduto(produtoId) {
    window.location.href = `produtos.html#${produtoId}`;
}

// --- CONTROLE DE EXIBIÇÃO DE ARTIGOS DE BLOG (BLOG.HTML) ---
function lerArtigo(idArtigo) {
    const artigoOrigem = document.getElementById(idArtigo);
    const displayLeitor = document.getElementById('ler-artigo-container');
    const secaoBlogLista = document.getElementById('secao-lista-blog');
    
    if (!displayLeitor || !secaoBlogLista || !artigoOrigem) return;

    const categoria = artigoOrigem.querySelector('.cat-label').innerText;
    const titulo = artigoOrigem.querySelector('.art-title').innerText;
    const conteudoCompleto = artigoOrigem.querySelector('.artigo-completo').innerHTML;
    const produtoId = artigoOrigem.getAttribute('data-produto-id');

    // Injeta as informações do artigo no leitor
    document.getElementById('ler-categoria').innerText = categoria;
    document.getElementById('ler-titulo').innerText = titulo;
    document.getElementById('ler-conteudo').innerHTML = conteudoCompleto;

    // Trata o CTA do produto relacionado
    const ctaContainer = document.getElementById('ler-cta-produto-container');
    if (produtoId) {
        ctaContainer.classList.remove('hidden');
        const prodNomes = {
            'prod-retentores': 'Retentores Industriais',
            'prod-oring': 'Anéis O-Ring',
            'prod-gaxetas': 'Gaxetas Hidráulicas',
            'prod-raspadores': 'Raspadores de Cilindro',
            'prod-pecas': 'Peças Técnicas em Borracha',
            'prod-perfis': 'Perfis de Vedação',
            'prod-cordoes': 'Cordões de Vedação',
            'prod-tc': 'Anéis TC'
        };
        document.getElementById('ler-cta-produto-nome').innerText = prodNomes[produtoId] || 'Nossas Soluções';
        document.getElementById('ler-cta-produto-btn').onclick = function() {
            window.location.href = `produtos.html#${produtoId}`;
        };
    } else {
        ctaContainer.classList.add('hidden');
    }

    // Alterna visualizações
    secaoBlogLista.classList.add('hidden');
    displayLeitor.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function fecharLeitorArtigo() {
    const displayLeitor = document.getElementById('ler-artigo-container');
    const secaoBlogLista = document.getElementById('secao-lista-blog');
    
    if (displayLeitor && secaoBlogLista) {
        displayLeitor.classList.add('hidden');
        secaoBlogLista.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
