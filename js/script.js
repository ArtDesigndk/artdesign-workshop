/* =========================================================
   ARTDESIGN — SCRIPT.JS
   JavaScript principal do site

   Compatível com:
   - index.html
   - css/style.css

   Funcionalidades:
   01. Ícones Lucide
   02. Menu mobile
   03. Header dinâmico
   04. Animações de entrada
   05. Contadores animados
   06. Efeito 3D no hero
   07. Cards flutuantes
   08. Interações dos serviços
   09. Rolagem suave
   10. Animações do Portal do Aluno
   11. Responsividade
   12. Rodapé
   ========================================================= */

(function () {
    "use strict";

    function iniciarArtDesign() {

        /* =====================================================
           01. CONFIGURAÇÕES GERAIS
           ===================================================== */

        const reduzirMovimento = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const suportaObserver =
            "IntersectionObserver" in window;

        const header = document.querySelector(".site-header");

        const menuToggle = document.querySelector(".menu-toggle");

        const mobileNav = document.querySelector(".mobile-nav");


        /* =====================================================
           02. ÍCONES LUCIDE
           ===================================================== */

        function iniciarIcones() {

            if (
                window.lucide &&
                typeof window.lucide.createIcons === "function"
            ) {
                window.lucide.createIcons();
            }

        }

        iniciarIcones();


        /* =====================================================
           03. MENU MOBILE
           ===================================================== */

        function fecharMenu() {

            if (!menuToggle || !mobileNav) {
                return;
            }

            mobileNav.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Abrir menu"
            );

        }

        if (menuToggle && mobileNav) {

            menuToggle.addEventListener("click", function () {

                const aberto =
                    mobileNav.classList.toggle("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    String(aberto)
                );

                menuToggle.setAttribute(
                    "aria-label",
                    aberto ? "Fechar menu" : "Abrir menu"
                );

            });

            mobileNav.querySelectorAll("a").forEach(function (link) {

                link.addEventListener("click", fecharMenu);

            });

            document.addEventListener("click", function (evento) {

                if (
                    !mobileNav.contains(evento.target) &&
                    !menuToggle.contains(evento.target)
                ) {
                    fecharMenu();
                }

            });

            document.addEventListener("keydown", function (evento) {

                if (evento.key === "Escape") {
                    fecharMenu();
                }

            });

        }


        /* =====================================================
           04. HEADER DINÂMICO
           ===================================================== */

        function atualizarHeader() {

            if (!header) {
                return;
            }

            if (window.scrollY > 40) {

                header.classList.add("scrolled");

            } else {

                header.classList.remove("scrolled");

            }

        }

        atualizarHeader();

        window.addEventListener(
            "scroll",
            atualizarHeader,
            { passive: true }
        );


        /* =====================================================
           05. ANIMAÇÕES DE ENTRADA

           O CSS utiliza:
           .reveal
           .reveal.visible

           Quando o elemento entra na tela, o JS adiciona
           a classe visible para ativar a animação.
           ===================================================== */

        const elementosReveal =
            document.querySelectorAll(".reveal");

        function mostrarElemento(elemento) {

            elemento.classList.add("visible");

        }

        if (reduzirMovimento || !suportaObserver) {

            elementosReveal.forEach(mostrarElemento);

        } else {

            const observerReveal = new IntersectionObserver(

                function (entradas, observer) {

                    entradas.forEach(function (entrada) {

                        if (entrada.isIntersecting) {

                            mostrarElemento(entrada.target);

                            observer.unobserve(entrada.target);

                        }

                    });

                },

                {
                    root: null,
                    rootMargin: "0px 0px -35px 0px",
                    threshold: 0.08
                }

            );

            elementosReveal.forEach(function (elemento) {

                observerReveal.observe(elemento);

            });

            /*
             Segurança:
             Se o navegador restaurar a página em uma
             posição diferente, os elementos visíveis
             também serão revelados.
            */

            function verificarElementosVisiveis() {

                elementosReveal.forEach(function (elemento) {

                    if (elemento.classList.contains("visible")) {
                        return;
                    }

                    const rect =
                        elemento.getBoundingClientRect();

                    const visivel =
                        rect.top < window.innerHeight - 20 &&
                        rect.bottom > 0;

                    if (visivel) {

                        mostrarElemento(elemento);

                        observerReveal.unobserve(elemento);

                    }

                });

            }

            window.addEventListener(
                "load",
                verificarElementosVisiveis
            );

            window.addEventListener(
                "pageshow",
                verificarElementosVisiveis
            );

            requestAnimationFrame(function () {

                requestAnimationFrame(
                    verificarElementosVisiveis
                );

            });

        }


        /* =====================================================
           06. ANIMAÇÃO DOS CONTADORES

           HTML:
           <strong class="counter" data-target="1000">0</strong>
           ===================================================== */

        const contadores =
            document.querySelectorAll(".counter");

        function animarContador(elemento) {

            if (elemento.dataset.animado === "true") {
                return;
            }

            const destino = Number(
                elemento.getAttribute("data-target")
            );

            if (!Number.isFinite(destino)) {
                return;
            }

            elemento.dataset.animado = "true";

            if (reduzirMovimento) {

                elemento.textContent =
                    destino.toLocaleString("pt-BR");

                return;
            }

            const duracao = 1900;

            let inicio = null;

            function atualizarContador(tempoAtual) {

                if (inicio === null) {
                    inicio = tempoAtual;
                }

                const tempoDecorrido =
                    tempoAtual - inicio;

                const progresso = Math.min(
                    tempoDecorrido / duracao,
                    1
                );

                const suavizacao =
                    1 - Math.pow(1 - progresso, 4);

                const valorAtual = Math.floor(
                    destino * suavizacao
                );

                elemento.textContent =
                    valorAtual.toLocaleString("pt-BR");

                if (progresso < 1) {

                    requestAnimationFrame(
                        atualizarContador
                    );

                } else {

                    elemento.textContent =
                        destino.toLocaleString("pt-BR");

                }

            }

            requestAnimationFrame(atualizarContador);

        }

        if (suportaObserver) {

            const observerContadores =
                new IntersectionObserver(

                    function (entradas, observer) {

                        entradas.forEach(function (entrada) {

                            if (entrada.isIntersecting) {

                                animarContador(
                                    entrada.target
                                );

                                observer.unobserve(
                                    entrada.target
                                );

                            }

                        });

                    },

                    {
                        threshold: 0.3
                    }

                );

            contadores.forEach(function (contador) {

                observerContadores.observe(contador);

            });

        } else {

            contadores.forEach(animarContador);

        }


        /* =====================================================
           07. EFEITO 3D NO HERO

           Movimento suave da imagem principal
           acompanhando o mouse.

           O efeito só é ativado em telas desktop.
           ===================================================== */

        const heroVisual =
            document.querySelector(".hero-visual");

        const desktop = window.matchMedia(
            "(min-width: 901px) and (pointer: fine)"
        );

        if (
            heroVisual &&
            !reduzirMovimento &&
            desktop.matches
        ) {

            let frameHero = null;

            let rotacaoX = 0;
            let rotacaoY = 0;

            heroVisual.addEventListener(
                "mousemove",
                function (evento) {

                    const rect =
                        heroVisual.getBoundingClientRect();

                    const centroX = rect.width / 2;
                    const centroY = rect.height / 2;

                    const posicaoX =
                        evento.clientX - rect.left;

                    const posicaoY =
                        evento.clientY - rect.top;

                    rotacaoY =
                        ((posicaoX - centroX) / centroX) * 2.5;

                    rotacaoX =
                        ((posicaoY - centroY) / centroY) * -2.5;

                    if (frameHero !== null) {
                        return;
                    }

                    frameHero = requestAnimationFrame(
                        function () {

                            /*
                             Transform aplicado à imagem interna,
                             evitando conflito com a animação
                             .reveal do elemento principal.
                            */

                            const imagemCard =
                                heroVisual.querySelector(
                                    ".hero-image-card"
                                );

                            if (imagemCard) {

                                imagemCard.style.transform =

                                    "perspective(1200px) " +
                                    "rotateX(" + rotacaoX + "deg) " +
                                    "rotateY(" + rotacaoY + "deg)";

                            }

                            frameHero = null;

                        }
                    );

                }
            );

            heroVisual.addEventListener(
                "mouseleave",
                function () {

                    const imagemCard =
                        heroVisual.querySelector(
                            ".hero-image-card"
                        );

                    if (imagemCard) {

                        imagemCard.style.transform =
                            "perspective(1200px) " +
                            "rotateX(0deg) rotateY(0deg)";

                    }

                }
            );

            const imagemCard =
                heroVisual.querySelector(
                    ".hero-image-card"
                );

            if (imagemCard) {

                imagemCard.style.transition =
                    "transform 0.55s cubic-bezier(.16,1,.3,1)";

                imagemCard.style.transformStyle =
                    "preserve-3d";

            }

        }


        /* =====================================================
           08. CARDS FLUTUANTES DO HERO

           O CSS já possui a animação floatingCard.

           Este trecho adiciona movimento sutil ao mouse,
           sem substituir a animação original.
           ===================================================== */

        const floatingCards =
            document.querySelectorAll(
                ".hero .floating-card"
            );

        if (
            floatingCards.length > 0 &&
            !reduzirMovimento &&
            desktop.matches
        ) {

            const hero =
                document.querySelector(".hero");

            if (hero) {

                let frameFloating = null;

                hero.addEventListener(
                    "mousemove",
                    function (evento) {

                        const rect =
                            hero.getBoundingClientRect();

                        const x =
                            (evento.clientX - rect.left) /
                            rect.width - 0.5;

                        const y =
                            (evento.clientY - rect.top) /
                            rect.height - 0.5;

                        if (frameFloating !== null) {
                            return;
                        }

                        frameFloating = requestAnimationFrame(
                            function () {

                                floatingCards.forEach(
                                    function (card, index) {

                                        const intensidade =
                                            index % 2 === 0
                                                ? 12
                                                : -9;

                                        card.style.marginLeft =
                                            (x * intensidade) + "px";

                                        card.style.marginTop =
                                            (y * intensidade) + "px";

                                    }
                                );

                                frameFloating = null;

                            }
                        );

                    }
                );

                hero.addEventListener(
                    "mouseleave",
                    function () {

                        floatingCards.forEach(
                            function (card) {

                                card.style.marginLeft = "0px";

                                card.style.marginTop = "0px";

                            }
                        );

                    }
                );

            }

        }


        /* =====================================================
           09. INTERAÇÃO DOS CARDS DE SERVIÇO

           Os cards se movimentam levemente ao passar
           o mouse e retornam à posição original.
           ===================================================== */

        const cardsServico =
            document.querySelectorAll(".service-card");

        if (
            !reduzirMovimento &&
            desktop.matches
        ) {

            cardsServico.forEach(function (card) {

                card.addEventListener(
                    "mousemove",
                    function (evento) {

                        const rect =
                            card.getBoundingClientRect();

                        const x =
                            evento.clientX - rect.left;

                        const y =
                            evento.clientY - rect.top;

                        const rotacaoY =
                            (x / rect.width - 0.5) * 3;

                        const rotacaoX =
                            (y / rect.height - 0.5) * -3;

                        card.style.transform =

                            "translateY(-8px) " +
                            "perspective(900px) " +
                            "rotateX(" + rotacaoX + "deg) " +
                            "rotateY(" + rotacaoY + "deg)";

                    }
                );

                card.addEventListener(
                    "mouseleave",
                    function () {

                        card.style.transform = "";

                    }
                );

            });

        }


        /* =====================================================
           10. ROLAGEM SUAVE DOS LINKS INTERNOS
           ===================================================== */

        const linksInternos =
            document.querySelectorAll('a[href^="#"]');

        linksInternos.forEach(function (link) {

            link.addEventListener(
                "click",
                function (evento) {

                    const destino =
                        link.getAttribute("href");

                    if (
                        !destino ||
                        destino === "#"
                    ) {
                        return;
                    }

                    const elementoDestino =
                        document.getElementById(
                            destino.substring(1)
                        );

                    if (!elementoDestino) {
                        return;
                    }

                    evento.preventDefault();

                    const alturaHeader =
                        header
                            ? header.offsetHeight + 25
                            : 20;

                    const posicao =
                        elementoDestino
                            .getBoundingClientRect().top +
                        window.scrollY -
                        alturaHeader;

                    window.scrollTo({

                        top: Math.max(0, posicao),

                        behavior: reduzirMovimento
                            ? "auto"
                            : "smooth"

                    });

                    fecharMenu();

                }
            );

        });


        /* =====================================================
           11. ANIMAÇÃO DO PORTAL DO ALUNO NA HOME

           Funciona somente se a seção existir.

           Não interfere na página workshop.html.
           ===================================================== */

        const portalCard =
            document.querySelector(
                ".student-portal-card"
            );

        if (portalCard) {

            const elementosPortal =
                portalCard.querySelectorAll(

                    ".student-portal-label, " +
                    ".student-portal-copy h2, " +
                    ".student-portal-copy p, " +
                    ".student-portal-button"

                );

            let portalJaAnimado = false;

            function animarPortal() {

                if (portalJaAnimado) {
                    return;
                }

                portalJaAnimado = true;

                if (
                    reduzirMovimento ||
                    typeof Element.prototype.animate !==
                        "function"
                ) {
                    return;
                }

                elementosPortal.forEach(
                    function (elemento, indice) {

                        elemento.animate(

                            [
                                {
                                    opacity: 0,
                                    transform: "translateY(24px)",
                                    filter: "blur(4px)"
                                },

                                {
                                    opacity: 1,
                                    transform: "translateY(0)",
                                    filter: "blur(0)"
                                }
                            ],

                            {
                                duration: 850,
                                delay: indice * 130,
                                easing:
                                    "cubic-bezier(.16,1,.3,1)",
                                fill: "both"
                            }

                        );

                    }
                );

            }

            if (suportaObserver) {

                const observerPortal =
                    new IntersectionObserver(

                        function (entradas, observer) {

                            entradas.forEach(
                                function (entrada) {

                                    if (entrada.isIntersecting) {

                                        animarPortal();

                                        observer.unobserve(
                                            entrada.target
                                        );

                                    }

                                }
                            );

                        },

                        {
                            threshold: 0.15
                        }

                    );

                observerPortal.observe(portalCard);

            } else {

                animarPortal();

            }

        }


        /* =====================================================
           12. RESPONSIVIDADE
           ===================================================== */

        window.addEventListener(
            "resize",
            function () {

                if (window.innerWidth > 760) {

                    fecharMenu();

                }

            }
        );


        /* =====================================================
           13. RODAPÉ

           Atualiza somente o ano, preservando o
           restante do texto e a estrutura original.
           ===================================================== */

        const footerBottom =
            document.querySelector(
                ".site-footer .footer-bottom"
            );

        if (footerBottom) {

            const primeiroSpan =
                footerBottom.querySelector("span");

            if (primeiroSpan) {

                primeiroSpan.textContent =
                    "© " +
                    new Date().getFullYear() +
                    " ArtDesign. Todos os direitos reservados.";

            }

        }


        /* =====================================================
           14. ANIMAÇÃO INICIAL DO HERO
           ===================================================== */

        const heroContent =
            document.querySelector(".hero-content");

        if (heroContent) {

            requestAnimationFrame(function () {

                heroContent.classList.add(
                    "hero-loaded"
                );

            });

        }


        /* =====================================================
           15. VERIFICAÇÃO FINAL

           Garante que elementos inicialmente ocultos
           não permaneçam invisíveis caso o observer
           não consiga executar.
           ===================================================== */

        function verificarReveals() {

            document.querySelectorAll(
                ".reveal:not(.visible)"
            ).forEach(function (elemento) {

                const rect =
                    elemento.getBoundingClientRect();

                if (
                    rect.top < window.innerHeight &&
                    rect.bottom > 0
                ) {

                    elemento.classList.add("visible");

                }

            });

        }

        window.addEventListener(
            "pageshow",
            verificarReveals
        );

        window.addEventListener(
            "load",
            verificarReveals
        );

        window.addEventListener(
            "scroll",
            verificarReveals,
            { passive: true }
        );


        /* =====================================================
           16. INICIALIZAÇÃO CONCLUÍDA
           ===================================================== */

        console.log(
            "ArtDesign: JavaScript inicializado com sucesso."
        );

    }


    /* =========================================================
       INICIALIZAÇÃO SEGURA

       Funciona mesmo quando o script é carregado
       depois que o HTML já terminou de carregar.
       ========================================================= */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            iniciarArtDesign,
            { once: true }
        );

    } else {

        iniciarArtDesign();

    }

})();
