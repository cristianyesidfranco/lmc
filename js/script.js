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
     * It allows each poster to have a unique link (href).
     *
     * @param {string} containerSelector The jQuery selector (e.g., '#postersArea', '#postersArea1') for the container.
     * @param {Array<{src: string, href: string}>} posterDataList An array of objects containing the image path (src) and the destination URL (href).
     */
    function generatePostersArea(containerSelector, posterDataList) {
        const $postersArea = $(containerSelector);

        // Only proceed if the container element exists and the list is valid
        if ($postersArea.length && Array.isArray(posterDataList) && posterDataList.length > 0) {
            
            // Define which images should get the 'full' class. 
            const fullImageIdentifiers = [
                "folleto1", "folleto2",
                "reingenieria_pedagogica", "matriculas_abiertas", "cambio_agentes_educativos"
            ];

            // Generate the poster HTML dynamically
            // 🔑 CAMBIO CLAVE: Usamos 'posterDataList' y extraemos 'src' y 'href' del objeto 'item'.
            const postersHTML = posterDataList.map((item, i) => {
                
                const src = item.src;
                const href = item.href; 
                
                // Check if the current src contains any of the 'full' identifiers
                const isFull = fullImageIdentifiers.some(identifier => src.includes(identifier));

                // Each poster is a DIV with classes .poster and .poster-slide, ahora usando el 'href' dinámico
                return `<div class="poster poster-slide ${isFull ? "full" : ""}"><a href="${href}"><img src="${src}" alt="Poster ${i + 1}"></a></div>`;
            }).join("");

            // Insert the generated HTML into the container
            $postersArea.html(postersHTML);
            
        } else if ($postersArea.length && posterDataList && posterDataList.length === 0) {
            console.warn(`Poster generation skipped for ${containerSelector}: No poster data provided.`);
        }
    }

    // ------------------------------------------------------------------
    // FUNCIÓN DE INICIALIZACIÓN DE LA GALERÍA DE PÓSTERES
    // ------------------------------------------------------------------
    function initializePosterGallery() {
        
        // Lista de objetos que contiene la información esencial de cada póster.
        // CADA OBJETO DEBE INCLUIR LA RUTA (src) Y EL ENLACE DE DESTINO (href).
        const posterDataList = [
            // 🔑 PÓSTERES PRINCIPALES (#postersArea)
           
            { src: "img/posters/folleto1.png", href: "nuestroColegio.html" },
            { src: "img/posters/folleto2.png", href: "nuestroColegio.html" },
            { src: "img/posters/reingenieria_pedagogica.jpeg", href: "propuestaPedagogica.html" },
            { src: "img/posters/matriculas_abiertas.png", href: "admisiones.html" },
            { src: "img/posters/cambio_agentes_educativos.jpeg", href: "comunidad.html" },
            { src: "img/posters/welcomeStudents.png", href: "index.html" },
            { src: "img/posters/proyectos.png", href: "proyectos.html" },
            { src: "img/posters/rectoraAdmisiones.png", href: "nuestroColegio.html" },
            { src: "img/posters/costos2026.png", href: "costos.html" },
            
            // 🔑 PÓSTERES ADICIONALES (Para reutilizar en #postersArea1 si aplica)
            
            // { src: "img/virgen_de_fatima.png", href: "simbolos.html" },
            //  { src: "img/posters/admisiones2026.png", href: "admisiones.html" },
        ];
        
        // Genera el área principal de pósteres
        generatePostersArea('#postersArea', posterDataList);

        // Si necesitas un área de pósteres secundaria (#postersArea1), 
        // puedes filtrar la lista o definir una nueva lista de objetos aquí.
        const postersArea1Data = [
             { src: "img/virgen_de_fatima.png", href: "simbolos.html" }, // Primer póster del ejemplo 2
             { src: "img/posters/folleto2.png", href: "nuestroColegio.html" } // Primer póster del ejemplo 3
        ];
        
        // Genera el área secundaria de pósteres (si existe en el HTML)
        generatePostersArea('#postersArea1', postersArea1Data);
    }

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
    
    // 3. Inicialización de la Galería de Pósteres
    initializePosterGallery();

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
    
    // Lógica para inicializar el mapa conceptual (se mantiene sin cambios)
    function inicializarMapaConceptual() {
        // 1. Mapeo de Descripciones (Usado como fallback si no hay data-attributes)
        // NOTA: Es buena práctica mantener la fuente de datos fuera de la lógica principal.
        const descripciones = {
            'central': 'Este es el NÚCLEO del proyecto, la idea principal que une a todos los elementos del mapa conceptual. Representa la misión y visión del sistema.',
            'superior-izq': 'Componente de **Análisis del Entorno**: Explora las tendencias, amenazas y oportunidades externas que afectan al proyecto. Es la primera fase de planificación.',
            'superior-centro1': 'Componente de **Definición de Objetivos**: Establece las metas SMART (Específicas, Medibles, Alcanzables, Relevantes, Temporales) del proyecto.',
            'superior-centro2': 'Componente de **Planificación de Recursos**: Determina los activos humanos, financieros y tecnológicos necesarios para la ejecución del proyecto.',
            'superior-der': 'Componente de **Diseño y Estructura**: Define la arquitectura y el diseño del sistema o producto, asegurando una base sólida y escalable.',
            'medio-izq': 'Componente de **Ejecución y Despliegue**: Pone en marcha las acciones planificadas. Es la fase donde la teoría se convierte en práctica.',
            'medio-der': 'Componente de **Monitoreo y Control**: Sigue el progreso, mide el desempeño contra los objetivos y aplica correcciones cuando es necesario.',
            'inferior-izq': 'Componente de **Evaluación de Resultados**: Mide el impacto final del proyecto y compara los logros con los objetivos iniciales definidos.',
            'inferior-centro1': 'Componente de **Retroalimentación y Aprendizaje**: Recopila lecciones aprendidas para mejorar futuros proyectos e iteraciones del mapa.',
            'inferior-centro2': 'Componente de **Ajuste Estratégico**: Modifica la estrategia central con base en la retroalimentación y los nuevos aprendizajes adquiridos.',
            'inferior-der': 'Componente de **Cierre y Documentación**: Finaliza formalmente el proyecto, archiva documentación clave y celebra los éxitos obtenidos.'
        };

        // 2. FUNCIÓN DE ABRIR DESCRIPCIÓN al hacer clic en cualquier nodo
        $('.nodo').on('click', function() {
            // Obtenemos la segunda clase (la de posicionamiento, ej: 'central', 'superior-izq')
            // Usamos una expresión regular para una extracción más limpia de la clase de posición
            const claseNodo = ($(this).attr('class').match(/(central|superior-\w+|medio-\w+|inferior-\w+)/) || [])[0];
            
            // Obtener el contenido, priorizando los 'data-attributes' del HTML (más flexible)
            let titulo = $(this).data('titulo') || `Título de ${claseNodo}`;
            let contenido = $(this).data('contenido') || descripciones[claseNodo] || 'Descripción no disponible.';

            // Llenar la caja modal
            $('#descripcion-titulo').html(titulo); // Usar .html() para permitir negritas del fallback
            $('#descripcion-contenido').html(contenido); // Usar .html() para permitir negritas del fallback

            // Mostrar la caja modal
            $('.descripcion-overlay').fadeIn(300);
        });

        // 3. FUNCIÓN DE CERRAR DESCRIPCIÓN (al hacer clic en el botón o en el fondo)
        $('.cerrar-btn, .descripcion-overlay').on('click', function(e) {
            // Solo cerrar si el clic es en el botón o directamente en el fondo oscuro
            if ($(e.target).is('.cerrar-btn') || $(e.target).is('.descripcion-overlay')) {
                $('.descripcion-overlay').fadeOut(300);
            }
        });

        // 4. PREVENIR EL CIERRE AL HACER CLIC DENTRO DEL CONTENIDO DE LA CAJA
        $('.descripcion-box').on('click', function(e) {
            e.stopPropagation(); // Detiene el evento para que no llegue al overlay (al fondo)
        });
    }

    // Llama a la función de inicialización cuando el documento esté completamente cargado.
    $(document).ready(function() {
        inicializarMapaConceptual();
    });
});