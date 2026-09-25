/* =========================================================
   ARTDESIGN — SCRIPT.JS
   Interações e animações do site
   ========================================================= */


/* =========================================================
   01. ESPERA O HTML CARREGAR
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       02. ATUALIZA OS ÍCONES LUCIDE

       O HTML utiliza:
       <i data-lucide="instagram"></i>

       O Lucide transforma esses elementos em SVG.
       ===================================================== */

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }



    /* =====================================================
       03. MENU MOBILE

       No celular o menu principal fica escondido.
       Ao clicar no botão, adicionamos a classe "active"
       ao menu.

       O CSS é responsável por mostrar o menu.
       ===================================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const mobileNav = document.querySelector(".mobile-nav");


    if (menuToggle && mobileNav) {

        menuToggle.addEventListener("click", () => {

            const isOpen = mobileNav.classList.toggle("active");

            /* Atualiza acessibilidade do botão */
            menuToggle.setAttribute(
                "aria-expanded",
                isOpen
            );

        });


        /* ---------------------------------------------
           Fecha o menu quando o usuário clica em um link
           --------------------------------------------- */

        const mobileLinks =
            mobileNav.querySelectorAll("a");


        mobileLinks.forEach(link => {

            link.addEventListener("click", () => {

                mobileNav.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });

        });

    }



    /* =====================================================
       04. HEADER AO ROLAR A PÁGINA

       Quando o usuário começa a rolar:
       .scrolled

       é adicionada ao header.

       Isso permite que o CSS deixe o menu mais compacto
       e com uma sombra maior.
       ===================================================== */

    const header =
        document.querySelector(".site-header");


    function updateHeader() {

        if (!header) return;


        if (window.scrollY > 40) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

    }


    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );


    /* Executa uma vez ao carregar */
    updateHeader();



    /* =====================================================
       05. REVEAL — ELEMENTOS APARECENDO NO SCROLL

       Todos os elementos com:

       class="reveal"

       começam invisíveis no CSS.

       Quando entram na tela, recebem:

       class="visible"

       O CSS faz a animação.
       ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");


    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    entry.target.classList.add("visible");


                    /*
                     * Depois que o elemento apareceu,
                     * não precisamos continuar observando.
                     */

                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -50px 0px"
            }
        );


    revealElements.forEach(element => {

        revealObserver.observe(element);

    });



    /* =====================================================
       06. CONTADORES

       Os números da seção de experiência utilizam:

       data-target="1000"

       O JavaScript transforma:

       0 → 100 → 500 → 1000

       de maneira animada.
       ===================================================== */

    const counters =
        document.querySelectorAll(".counter");


    function animateCounter(counter) {

        const target =
            Number(
                counter.getAttribute("data-target")
            );


        if (!target) return;


        const duration = 1800;

        const startTime =
            performance.now();


        function updateCounter(currentTime) {

            const elapsed =
                currentTime - startTime;


            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            /*
             * Easing:
             * começa rápido e termina suavemente.
             */

            const eased =
                1 - Math.pow(
                    1 - progress,
                    3
                );


            const currentValue =
                Math.floor(
                    eased * target
                );


            /*
             * Formata números maiores:
             *
             * 1000 → 1.000
             */

            counter.textContent =
                currentValue.toLocaleString(
                    "pt-BR"
                );


            if (progress < 1) {

                requestAnimationFrame(
                    updateCounter
                );

            } else {

                counter.textContent =
                    target.toLocaleString(
                        "pt-BR"
                    );

            }

        }


        requestAnimationFrame(
            updateCounter
        );

    }



    /* =====================================================
       OBSERVADOR DOS CONTADORES

       O contador só começa quando o bloco entra
       na tela do usuário.
       ===================================================== */

    const counterObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) {
                        return;
                    }


                    animateCounter(
                        entry.target
                    );


                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.5
            }
        );


    counters.forEach(counter => {

        counterObserver.observe(counter);

    });



    /* =====================================================
       07. PARALLAX SUAVE NO HERO

       O movimento acompanha discretamente o mouse.

       Não exageramos no efeito para não deixar o site
       com aparência de template antigo.
       ===================================================== */

    const heroVisual =
        document.querySelector(".hero-visual");


    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (
        heroVisual &&
        !prefersReducedMotion &&
        window.innerWidth > 900
    ) {

        heroVisual.addEventListener(
            "mousemove",
            event => {

                const rect =
                    heroVisual.getBoundingClientRect();


                const x =
                    event.clientX - rect.left;


                const y =
                    event.clientY - rect.top;


                const centerX =
                    rect.width / 2;


                const centerY =
                    rect.height / 2;


                const rotateX =
                    (y - centerY) /
                    centerY *
                    -2;


                const rotateY =
                    (x - centerX) /
                    centerX *
                    2;


                heroVisual.style.transform =
                    `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(0)
                    `;

            }
        );


        heroVisual.addEventListener(
            "mouseleave",
            () => {

                heroVisual.style.transform =
                    "perspective(1000px) rotateX(0) rotateY(0)";

            }
        );

    }



    /* =====================================================
       08. EFEITO DE MOVIMENTO DOS CARDS FLUTUANTES

       Os cards recebem uma pequena variação de posição
       conforme o mouse se movimenta no hero.

       O CSS continua responsável pela animação principal.
       ===================================================== */

    const floatingCards =
        document.querySelectorAll(
            ".hero .floating-card"
        );


    if (
        floatingCards.length &&
        !prefersReducedMotion &&
        window.innerWidth > 900
    ) {

        document.addEventListener(
            "mousemove",
            event => {

                const x =
                    (event.clientX /
                        window.innerWidth) - 0.5;


                const y =
                    (event.clientY /
                        window.innerHeight) - 0.5;


                floatingCards.forEach(
                    (card, index) => {

                        const intensity =
                            index === 0
                                ? 8
                                : -6;


                        card.style.marginLeft =
                            `${x * intensity}px`;


                        card.style.marginTop =
                            `${y * intensity}px`;

                    }
                );

            },
            { passive: true }
        );

    }



    /* =====================================================
       09. HOVER DOS CARDS DE SERVIÇO

       Adiciona uma pequena interação baseada no mouse.

       O CSS já possui o efeito principal.
       Aqui criamos apenas um movimento sutil.
       ===================================================== */

    const serviceCards =
        document.querySelectorAll(
            ".service-card"
        );


    if (
        !prefersReducedMotion &&
        window.innerWidth > 900
    ) {

        serviceCards.forEach(card => {

            card.addEventListener(
                "mousemove",
                event => {

                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        event.clientX - rect.left;


                    const y =
                        event.clientY - rect.top;


                    const rotateY =
                        ((x / rect.width) - 0.5) * 2;


                    const rotateX =
                        ((y / rect.height) - 0.5) * -2;


                    card.style.transform =
                        `
                        translateY(-8px)
                        perspective(800px)
                        rotateX(${rotateX}deg)
                        rotateY(${rotateY}deg)
                        `;

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform = "";

                }
            );

        });

    }



    /* =====================================================
       10. LINKS INTERNOS COM SCROLL SUAVE

       Quando um link aponta para:

       #servicos
       #projetos
       #contato

       fazemos uma rolagem suave.

       Isso também funciona em navegadores que não
       respeitam totalmente o scroll-behavior do CSS.
       ===================================================== */

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    internalLinks.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                const headerHeight =
                    header
                        ? header.offsetHeight + 25
                        : 20;


                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight;


                window.scrollTo({

                    top: targetPosition,

                    behavior:
                        prefersReducedMotion
                            ? "auto"
                            : "smooth"

                });

            }
        );

    });



    /* =====================================================
       11. FECHAR MENU AO REDIMENSIONAR

       Se o usuário estiver no celular e aumentar a janela
       para desktop, fechamos o menu mobile.
       ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 760 &&
                mobileNav
            ) {

                mobileNav.classList.remove(
                    "active"
                );


                if (menuToggle) {

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }

        }
    );



    /* =====================================================
       12. ANO AUTOMÁTICO DO FOOTER

       Se futuramente você quiser evitar alterar
       manualmente o ano do rodapé, podemos procurar
       o texto e atualizar automaticamente.

       O HTML atual possui 2026, então esta função
       mantém o ano atualizado.
       ===================================================== */

    const footer =
        document.querySelector(".site-footer");


    if (footer) {

        const footerText =
            footer.querySelector(".footer-bottom span");


        if (footerText) {

            footerText.textContent =
                `© ${new Date().getFullYear()} ArtDesign. Todos os direitos reservados.`;

        }

    }



    /* =====================================================
       13. ANIMAÇÃO DE ENTRADA DA PÁGINA

       Pequeno efeito inicial no conteúdo principal.

       Não usamos uma animação exagerada para evitar
       sensação de site antigo/template.
       ===================================================== */

    const heroContent =
        document.querySelector(".hero-content");


    if (
        heroContent &&
        !prefersReducedMotion
    ) {

        setTimeout(() => {

            heroContent.classList.add(
                "hero-loaded"
            );

        }, 100);

    }



    /* =====================================================
       14. LOG NO CONSOLE

       Útil enquanto você está aprendendo.

       Quando abrir:
       Chrome/Safari → Inspecionar → Console

       verá que o site foi carregado.
       ===================================================== */

    console.log(
        "ArtDesign — site carregado com sucesso."
    );

});