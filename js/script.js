// js/script.js

// ---------- LOGICA JQUERY Y ANIMACIONES (FINALMENTE CORREGIDO Y OPTIMIZADO) ----------
$(function () {

    // =======================================================
    // 1. CARGA DE ARCHIVOS ($.load())
    // =======================================================

    $("#header-placeholder").load("header.html", function () {
        // Eventos delegados de mouse para el icono de inicio
        $(document).on('mouseenter', '#homeIcon', function () {
            $('#homeCloud').fadeIn(220);
        }).on('mouseleave', '#homeIcon', function () {
            $('#homeCloud').fadeOut(220);
        });
    });

    $("#footer-placeholder").load("footer.html");

    // =======================================================
    // 2. EVENTOS DELEGADOS (Para elementos que se cargan dinámicamente)
    // =======================================================

    // Sidebar toggle
    $(document).on('click', '#openSidebar, #menuToggle', function (e) {
        e.preventDefault();
        $('#sidebar').toggleClass('open');
    });

    // Home icon click
    $(document).on('click', '#homeIcon', function () {
        $('.cube').toggleClass('rot');
        $('html,body').animate({ scrollTop: 0 }, 450);
    });

    // Social links
    $(document).on('click', '.social-link', function (e) {
        e.preventDefault();
        var url = $(this).data('href');
        window.open(url, '_blank');
    });


    // =======================================================
    // 3. LÓGICA DEL CARRUSEL MANUAL (REUTILIZABLE)
    // =======================================================
    function setupManualCarousel() {
        const $slidesTrack = $('#slidesTrack');
        const $prevBtn = $('#prev');
        const $nextBtn = $('#next');

        if (!$slidesTrack.length) return;

        const manualSlides = $slidesTrack.children('img').length;
        let manualIdx = 0;

        function goToManualSlide(index) {
            manualIdx = (index + manualSlides) % manualSlides;
            const offset = -manualIdx * 100;
            $slidesTrack.css('transform', `translateX(${offset}%)`);
        }

        $nextBtn.off('click').on('click', function () {
            goToManualSlide(manualIdx + 1);
        });

        $prevBtn.off('click').on('click', function () {
            goToManualSlide(manualIdx - 1);
        });

        goToManualSlide(0);
    }


    // =======================================================
    // 4. LÓGICA DEL CONTADOR DE AÑOS Y TÍTULO
    // =======================================================

    function iniciarContador() {
        let contador = 0;
        const elemento = document.getElementById("contador");

        if (!elemento) return;

        const intervalo = setInterval(() => {
            contador++;
            elemento.innerHTML = contador + "<span>Años</span>";
            if (contador >= 31) {
                clearInterval(intervalo);
            }
        }, 100);
    }

    function setupContadorObserver() {
        const contadorElement = document.getElementById("contador");

        if (!contadorElement) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    contadorElement.classList.add("visible");
                    iniciarContador();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(contadorElement);
    }

    // LÓGICA DEL TÍTULO NEÓN
    function setupCommunityTitle() {
        const $communityTitle = $('.community-title');
        if ($communityTitle.length) {
            $communityTitle.attr('data-text', $communityTitle.text());
        }
    }


    // =======================================================
    // 5. LÓGICA DE CONTENIDO PRINCIPAL Y CARRUSEL AUTOMÁTICO (CORREGIDO)
    // =======================================================

    /**
     * Función reutilizable para inicializar cualquier carrusel automático.
     * @param {string} trackSelector Selector del contenedor de slides (ej: '#autoTrack').
     * @param {string} dotsSelector Selector del contenedor de puntos (ej: '#dots').
     * @param {string} childSelector Selector de los elementos a deslizar dentro del track (ej: 'img' o '.poster').
     */
    function setupAutomaticCarousel(trackSelector, dotsSelector, childSelector) {
        const $track = $(trackSelector);
        const $dotsContainer = $(dotsSelector);

        // 🔑 VERIFICACIÓN CLAVE: Ahora usa el selector de hijos provisto
        if (!$track.length || !$dotsContainer.length || $track.children(childSelector).length === 0) {
            return;
        }

        const slides = $track.children(childSelector).length;
        let idx = 0;
        let auto;

        // 1. Generar/borrar puntos
        $dotsContainer.empty();
        for (let i = 0; i < slides; i++) {
            $dotsContainer.append('<div class="dot" data-i="' + i + '"></div>');
        }

        const $dots = $dotsContainer.children('.dot');

        function goTo(i) {
            idx = (i + slides) % slides;
            // Calcular el desplazamiento (cada slide ocupa 100% del track)
            const offset = -idx * 100;
            $track.css('transform', `translateX(${offset}%)`);
            $dots.removeClass('active').eq(idx).addClass('active');
        }

        goTo(0);
        auto = setInterval(() => { goTo(idx + 1); }, 4000);

        $dots.off('click').on('click', function () {
            clearInterval(auto);
            goTo($(this).data('i'));
            // Reinicia el intervalo después del clic manual
            auto = setInterval(() => goTo(idx + 1), 4000);
        });
    }

    // Toggle categories
    $('.toggle-cat').on('click', function (e) {
        e.preventDefault();
        var target = $(this).data('target');
        $(target).toggleClass('open');
    });

    // Nav links: cargan plantillas internas 
    const pageTemplate = (title) => {
        return `\n<section class=\"section\">\n  <h2>${title}</h2>\n  <p style=\"color:var(--muted)\">Encabezado de la página con navegación y presentación.</p>\n</section>\n<section class=\"section\">\n  <h3>Sección 1</h3>\n  <p>Contenido de la primera sección.</p>\n</section>\n<section class=\"section\">\n  <h3>Sección 2</h3>\n  <p>Contenido de la segunda sección.</p>\n</section>\n<section class=\"section\">\n  <h3>Sección 3</h3>\n  <p>Contenido de la tercera sección.</p>\n</section>\n<div id="footer-template-placeholder"></div>`;
    };

    $('.nav-link').on('click', function (e) {
        e.preventDefault();
        var title = $(this).text();

        $('#mainContent').html(pageTemplate(title));
        $("#footer-template-placeholder").load("footer.html");

        // Re-inicializa la lógica si los elementos están en las plantillas dinámicas
        setupManualCarousel();
        setupCommunityTitle();

        $('#sidebar').removeClass('open');
    });

    // Grid de posters (Lógica de generación dinámica)
    /**
 * Generates and inserts poster HTML into a specified container.
 * It also applies the 'full' class based on the images included in the initial set,
 * which you might want to adjust or pass as an argument for true reusability.
 *
 * @param {string} containerSelector The jQuery selector (e.g., '#postersArea', '#postersArea1') for the container.
 * @param {string[]} imagePaths An array of image source paths (e.g., ["img/path1.png", "img/path2.jpeg"]).
 */
    function generatePostersArea(containerSelector, imagePaths) {
        const $postersArea = $(containerSelector);

        // Only proceed if the container element exists on the page
        if ($postersArea.length && Array.isArray(imagePaths) && imagePaths.length > 0) {
            // Define which images should get the 'full' class. 
            // NOTE: For maximum reusability, you might want to pass this list 
            // or a condition as an argument instead of hardcoding it.
            const fullImageIdentifiers = [
                "admisiones2026", "folleto1", "folleto2",
                "reingenieria_pedagogica", "matriculas_abiertas", "cambio_agentes_educativos","virgen_de_fatima.png"
            ];

            // Generate the poster HTML dynamically
            const postersHTML = imagePaths.map((src, i) => {
                // Check if the current src contains any of the 'full' identifiers
                const isFull = fullImageIdentifiers.some(identifier => src.includes(identifier));

                // Each poster is a DIV with classes .poster and .poster-slide
                return `<div class="poster poster-slide ${isFull ? "full" : ""}"><a href="#"><img src="${src}" alt="Poster ${i + 1}"></a></div>`;
            }).join("");

            // Insert the generated HTML into the container
            $postersArea.html(postersHTML);
        } else if ($postersArea.length && imagePaths.length === 0) {
            console.warn(`Poster generation skipped for ${containerSelector}: No image paths provided.`);
        }
    }

    // --- Usage Examples ---

    // 1. Posters Area with the original, larger set of images
    const posters1 = [
        "img/posters/folleto1.png", "img/posters/folleto2.png", "img/posters/reingenieria_pedagogica.jpeg",
        "img/posters/matriculas_abiertas.png", "img/posters/cambio_agentes_educativos.jpeg", "img/posters/proyectos.png",
        "img/posters/rectoraAdmisiones.png", "img/posters/costos2026.png", "img/posters/admisiones2026.png",
    ];
    generatePostersArea('#postersArea', posters1);

    // 2. Posters Area 1 with the smaller, different set of images
    const posters2 = [
        
        "img/virgen_de_fatima.png",
    ]
    generatePostersArea('#postersArea1', posters2);

    // 3. Reusable Hover Animation Logic (can stay outside or be its own function)
    function setupCardHoverAnimation() {
        $(".card").hover(
            function () {
                $(this).css({
                    "transform": "scale(1.05)",
                    "box-shadow": "0 0 15px rgba(43, 255, 0, 1), 0 0 25px rgba(0, 255, 64, 1)"
                });
            },
            function () {
                $(this).css({
                    "transform": "scale(1)",
                    "box-shadow": "0 4px 8px rgba(0,0,0,0.2)"
                });
            }
        );
    }

    // Call the animation setup function when the DOM is ready
    $(document).ready(function () {
        setupCardHoverAnimation();

        // You would call your poster generation functions here as well
        // generatePostersArea('#postersArea', posters1); 
        // generatePostersArea('#postersArea1', posters2); 
        // ... or any other area on a different page
    });

    // Back to top visibility & click
    $(window).on('scroll', function () {
        if ($(window).scrollTop() > 300) $('#toTop').fadeIn(180);
        else $('#toTop').fadeOut(180);
    });
    $('#toTop').hide();
    $('#toTop').on('click', function () { $('html,body').animate({ scrollTop: 0 }, 500); });

    // Accessibility & UX
    $('a,button').on('focus', function () { $(this).css('outline', '2px dashed var(--accent)'); }).on('blur', function () { $(this).css('outline', 'none'); });
    $('.sublist li a').on('mouseenter', function () { $(this).css({ 'text-shadow': '0 0 10px rgba(0,240,255,0.7)', 'color': '#bdfcff' }); }).on('mouseleave', function () { $(this).css({ 'text-shadow': 'none', 'color': 'var(--muted)' }); });
    $('a, .btn-3d, .arrow, .menu-item a, .nav-link, .home-3d').css('cursor', 'pointer');
    $(document).on('keydown', function (e) { if (e.key === 'Escape') $('#sidebar').removeClass('open'); });
    $(document).on('click', function (e) { if (!$(e.target).closest('#sidebar, #openSidebar, #menuToggle').length) { $('#sidebar').removeClass('open'); } });


    // =======================================================
    // 6. INICIALIZACIÓN FINAL: Se ejecuta al cargar el DOM
    // =======================================================

    setupManualCarousel();
    setupCommunityTitle();
    setupContadorObserver();

    // 1. Inicialización del Carrusel PRINCIPAL (asumiendo que usa #dots y <img>)
    // Si esta es tu página de inicio, usa los selectores originales.
    setupAutomaticCarousel('#autoTrack', '#dots', 'img');

    // 2. Inicialización del Carrusel de COMUNIDAD.HTML (usa #dots-blog y .poster)
    // Esto asegura que la página de comunidad siga funcionando.
    setupAutomaticCarousel('#autoTrack', '#dots-blog', '.poster');

    // 📢 Nota: El carrusel que no exista en la página actual será ignorado por el script.

    // Asegúrate de que este script esté después de la inclusión de jQuery
    // o dentro del bloque $(document).ready()

    /**
     * @function iniciarEfectoVideo3D
     * Aplica los efectos de transformación 3D y sombra a un elemento de video
     * al pasar el ratón sobre él, utilizando clases CSS predefinidas.
     * * @param {string} selector El selector jQuery del elemento de video (ej: '#video3D').
     */
    function iniciarEfectoVideo3D(selector) {

        // Almacenamos la referencia al elemento jQuery
        const $video = $(selector);

        // Verificamos que el elemento exista antes de intentar aplicar los eventos
        if (!$video.length) {
            console.warn(`Elemento no encontrado con el selector: ${selector}.`);
            return;
        }

        // --- Definición de clases CSS para el efecto (Mejor Práctica) ---
        // En lugar de usar .css() en jQuery, es más limpio usar clases CSS
        // Nota: Necesitarás añadir estas clases a tu archivo 'styles.css' (ver sección 3).

        // Evento al entrar el ratón (mouseenter)
        $video.on('mouseenter', function () {
            $(this).addClass('is-rotated-3d');
        });

        // Evento al salir el ratón (mouseleave)
        $video.on('mouseleave', function () {
            $(this).removeClass('is-rotated-3d');
        });

        // Opcional: Agregar lógica para dispositivos táctiles (clic para activar/desactivar)
        $video.on('click', function () {
            $(this).toggleClass('is-rotated-3d');
        });
    }


    // ===========================================
    // INICIALIZACIÓN: Llama a la función
    // ===========================================

    $(function () {
        // Llama a la función para inicializar el efecto en el video con ID="video3D"
        iniciarEfectoVideo3D('#video3D');

        // Si tuvieras otro video, podrías llamar a la función de nuevo:
        // iniciarEfectoVideo3D('#otroVideo'); 
    });

});