/* =========================================================
   ARTDESIGN — SCRIPT.JS
   Animações e interações do site
   Atualizado para o novo index.html e Portal do Aluno
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       01. ÍCONES LUCIDE
       ===================================================== */

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }


    /* =====================================================
       02. PREFERÊNCIAS DE MOVIMENTO
       ===================================================== */

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =====================================================
       03. MENU MOBILE
       ===================================================== */

    const menuToggle = document.querySelector(".menu-toggle");
    const mobileNav = document.querySelector(".mobile-nav");

    function closeMobileMenu() {
        if (!menuToggle || !mobileNav) return;

        mobileNav.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    }

    if (menuToggle && mobileNav) {

        menuToggle.addEventListener("click", () => {

            const isOpen = mobileNav.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });

        mobileNav.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", closeMobileMenu);

        });

    }


    /* =====================================================
       04. HEADER AO ROLAR A PÁGINA
       ===================================================== */

    const header = document.querySelector(".site-header");

    function updateHeader() {

        if (!header) return;

        header.classList.toggle(
            "scrolled",
            window.scrollY > 40
        );

    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();


    /* =====================================================
       05. ANIMAÇÕES DE ENTRADA AO ROLAR
       ===================================================== */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /* =====================================================
       06. CONTADORES ANIMADOS
       ===================================================== */

    const counters = document.querySelectorAll(".counter");

    function animateCounter(counter) {

        const target = Number(
            counter.getAttribute("data-target")
        );

        if (!Number.isFinite(target) || target < 0) return;

        if (prefersReducedMotion) {

            counter.textContent = target.toLocaleString("pt-BR");

            return;
        }

        const duration = 1800;
        const startTime = performance.now();

        function updateCounter(currentTime) {

            const elapsed = currentTime - startTime;

            const progress = Math.min(
                elapsed / duration,
                1
            );

            const eased = 1 - Math.pow(1 - progress, 3);

            const currentValue = Math.floor(eased * target);

            counter.textContent = currentValue.toLocaleString(
                "pt-BR"
            );

            if (progress < 1) {

                requestAnimationFrame(updateCounter);

            } else {

                counter.textContent = target.toLocaleString(
                    "pt-BR"
                );

            }

        }

        requestAnimationFrame(updateCounter);

    }

    if ("IntersectionObserver" in window) {

        const counterObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    animateCounter(entry.target);

                    observer.unobserve(entry.target);

                });

            },
            {
                threshold: 0.5
            }
        );

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });

    } else {

        counters.forEach(animateCounter);

    }


    /* =====================================================
       07. PARALLAX SUAVE NO HERO
       ===================================================== */

    const heroVisual = document.querySelector(".hero-visual");

    if (
        heroVisual &&
        !prefersReducedMotion &&
        window.innerWidth > 900
    ) {

        heroVisual.addEventListener("mousemove", event => {

            const rect = heroVisual.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX =
                ((y - centerY) / centerY) * -2;

            const rotateY =
                ((x - centerX) / centerX) * 2;

            heroVisual.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(0)
            `;

        });

        heroVisual.addEventListener("mouseleave", () => {

            heroVisual.style.transform =
                "perspective(1000px) rotateX(0) rotateY(0)";

        });

    }


    /* =====================================================
       08. MOVIMENTO DOS CARDS FLUTUANTES
       ===================================================== */

    const floatingCards = document.querySelectorAll(
        ".hero .floating-card"
    );

    if (
        floatingCards.length &&
        !prefersReducedMotion &&
        window.innerWidth > 900
    ) {

        document.addEventListener("mousemove", event => {

            const x =
                (event.clientX / window.innerWidth) - 0.5;

            const y =
                (event.clientY / window.innerHeight) - 0.5;

            floatingCards.forEach((card, index) => {

                const intensity = index === 0 ? 8 : -6;

                card.style.marginLeft =
                    `${x * intensity}px`;

                card.style.marginTop =
                    `${y * intensity}px`;

            });

        }, {
            passive: true
        });

    }


    /* =====================================================
       09. INTERAÇÃO DOS CARDS DE SERVIÇO
       ===================================================== */

    const serviceCards = document.querySelectorAll(
        ".service-card"
    );

    if (
        !prefersReducedMotion &&
        window.innerWidth > 900
    ) {

        serviceCards.forEach(card => {

            card.addEventListener("mousemove", event => {

                const rect = card.getBoundingClientRect();

                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;

                const rotateY =
                    ((x / rect.width) - 0.5) * 2;

                const rotateX =
                    ((y / rect.height) - 0.5) * -2;

                card.style.transform = `
                    translateY(-8px)
                    perspective(800px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                `;

            });

            card.addEventListener("mouseleave", () => {

                card.style.transform = "";

            });

        });

    }


    /* =====================================================
       10. LINKS INTERNOS COM ROLAGEM SUAVE
       ===================================================== */

    const internalLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    internalLinks.forEach(link => {

        link.addEventListener("click", event => {

            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.getElementById(
                targetId.substring(1)
            );

            if (!target) return;

            event.preventDefault();

            const headerHeight = header
                ? header.offsetHeight + 25
                : 20;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight;

            window.scrollTo({

                top: targetPosition,

                behavior: prefersReducedMotion
                    ? "auto"
                    : "smooth"

            });

        });

    });


    /* =====================================================
       11. PORTAL DO ALUNO
       Animação da nova seção do index.html
       ===================================================== */

    const studentPortalCard = document.querySelector(
        ".student-portal-card"
    );

    if (studentPortalCard) {

        const portalItems = studentPortalCard.querySelectorAll(
            ".student-portal-label, " +
            ".student-portal-copy h2, " +
            ".student-portal-copy p, " +
            ".student-portal-button"
        );

        let portalAnimated = false;

        function animatePortal() {

            if (portalAnimated) return;

            portalAnimated = true;

            if (
                prefersReducedMotion ||
                typeof Element.prototype.animate !== "function"
            ) {
                return;
            }

            portalItems.forEach((item, index) => {

                item.animate(
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
                        delay: index * 130,
                        easing: "cubic-bezier(.16, 1, .3, 1)",
                        fill: "both"
                    }
                );

            });

        }

        if ("IntersectionObserver" in window) {

            const portalObserver = new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) return;

                        animatePortal();

                        observer.unobserve(entry.target);

                    });

                },
                {
                    threshold: 0.15
                }
            );

            portalObserver.observe(studentPortalCard);

        } else {

            animatePortal();

        }

    }


    /* =====================================================
       12. FECHAR MENU AO REDIMENSIONAR
       ===================================================== */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 760) {
            closeMobileMenu();
        }

    });


    /* =====================================================
       13. ANO AUTOMÁTICO DO RODAPÉ
       ===================================================== */

    const footer = document.querySelector(".site-footer");

    if (footer) {

        const footerText = footer.querySelector(
            ".footer-bottom span"
        );

        if (footerText) {

            footerText.textContent =
                `© ${new Date().getFullYear()} ArtDesign. Todos os direitos reservados.`;

        }

    }


    /* =====================================================
       14. ANIMAÇÃO INICIAL DO HERO
       ===================================================== */

    const heroContent = document.querySelector(
        ".hero-content"
    );

    if (
        heroContent &&
        !prefersReducedMotion
    ) {

        setTimeout(() => {

            heroContent.classList.add("hero-loaded");

        }, 100);

    }


    /* =====================================================
       15. FINALIZAÇÃO
       ===================================================== */

    console.log(
        "ArtDesign — site carregado com sucesso."
    );

});
