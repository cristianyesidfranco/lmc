// js/script.js

// ---------- LOGICA JQUERY Y ANIMACIONES (CORREGIDA PARA CONTENIDO DINÁMICO) ----------
$(function() {
    
    // =======================================================
    // 1. CARGA DE ARCHIVOS ($.load())
    // =======================================================
    
    // Cargar el header.html y usar el callback para adjuntar eventos específicos de mouse
    // que jQuery no delega bien (mouseenter/mouseleave).
    $("#header-placeholder").load("header.html", function() {
        // Ejecutar los eventos de mouseenter/mouseleave DELEGADOS (si los originales fallaban)
        // La delegación con 'on' ya es suficiente en la mayoría de casos.
        $(document).on('mouseenter', '#homeIcon', function(){
            $('#homeCloud').fadeIn(220);
        }).on('mouseleave', '#homeIcon', function(){
            $('#homeCloud').fadeOut(220);
        });
    }); 
    
    // Cargar el footer.html en el contenedor #footer-placeholder
    $("#footer-placeholder").load("footer.html"); 
    
    // =======================================================
    // 2. EVENTOS DELEGADOS (Para elementos que se cargan dinámicamente)
    // =======================================================

    // Sidebar toggle (DELEGADO para #openSidebar y #menuToggle del header.html)
    $(document).on('click', '#openSidebar, #menuToggle', function(e){
        e.preventDefault();
        $('#sidebar').toggleClass('open');
    });

    // Home icon click (DELEGADO para #homeIcon)
    $(document).on('click', '#homeIcon', function(){
        // efecto toggle y desplazamiento arriba
        $('.cube').toggleClass('rot');
        $('html,body').animate({scrollTop:0},450);
    });

    // Social links (DELEGADO para los enlaces del footer.html)
    $(document).on('click', '.social-link', function(e){ 
        e.preventDefault(); 
        var url=$(this).data('href'); 
        window.open(url,'_blank'); 
    });


    // =======================================================
    // 3. EVENTOS DIRECTOS Y LÓGICA DE CONTENIDO PRINCIPAL
    // =======================================================

    // Toggle categories (Están en la sidebar, que está en index.html)
    $('.toggle-cat').on('click',function(e){
        e.preventDefault();
        var target = $(this).data('target');
        $(target).toggleClass('open');
    });

    // Nav links: cargan plantillas internas 
    const pageTemplate = (title)=>{
        return `\n<section class=\"section\">\n  <h2>${title}</h2>\n  <p style=\"color:var(--muted)\">Encabezado de la página con navegación y presentación.</p>\n</section>\n<section class=\"section\">\n  <h3>Sección 1</h3>\n  <p>Contenido de la primera sección.</p>\n</section>\n<section class=\"section\">\n  <h3>Sección 2</h3>\n  <p>Contenido de la segunda sección.</p>\n</section>\n<section class=\"section\">\n  <h3>Sección 3</h3>\n  <p>Contenido de la tercera sección.</p>\n</section>\n<div id="footer-template-placeholder"></div>`;
    };

    $('.nav-link').on('click',function(e){
        e.preventDefault();
        var page = $(this).data('page') || 'p';
        var title = $(this).text();
        // Cargar plantilla en mainContent (simula página individual)
        $('#mainContent').html(pageTemplate(title));
        // NOTA: Si necesitas el footer en las páginas dinámicas, debes cargarlo aquí también.
        $("#footer-template-placeholder").load("footer.html"); 
        
        // cerrar sidebar en móvil
        $('#sidebar').removeClass('open');
    });

    // Carrusel automático (Inicialización y lógica)
    const $track = $('#autoTrack');
    const slides = $track.children().length;
    let idx=0;

    // Array con diferentes imágenes para posters
    const imagenes = [
        "img/posters/folleto1.png", "img/posters/folleto2.png", "img/posters/reingenieria_pedagogica.jpeg",
        "img/posters/matriculas_abiertas.png", "img/posters/cambio_agentes_educativos.jpeg", "img/posters/proyectos.png",
        "img/posters/rectoraAdmisiones.png", "img/posters/costos2026.png", "img/posters/admisiones2026.png", 
    ];

    // Generamos los posters dinámicamente
    const postersHTML = imagenes.map((src, i) => {
        const isFull = src.includes("admisiones2026") || src.includes("folleto1") || src.includes("folleto2") || src.includes("reingenieria_pedagogica") || src.includes("matriculas_abiertas") || src.includes("cambio_agentes_educativos");
        return `<div class="poster ${isFull ? "full" : ""}"><a href="#"><img src="${src}" alt="Poster ${i + 1}"></a></div>`;
    }).join("");

    // Insertamos en el contenedor
    document.getElementById("postersArea").innerHTML = postersHTML;

    // generar dots y lógica de carrusel automático
    for(let i=0;i<slides;i++){ $('#dots').append('<div class="dot" data-i="'+i+'"></div>'); }
    const $dots = $('#dots .dot');
    function goTo(i){ idx = (i+slides)%slides; $track.css('transform',`translateX(${-idx*100}%)`); $dots.removeClass('active').eq(idx).addClass('active'); }
    goTo(0);
    let auto = setInterval(()=>{ goTo(idx+1); },4000);
    $dots.on('click',function(){ clearInterval(auto); goTo($(this).data('i')); auto=setInterval(()=>goTo(idx+1),4000); });

    // Animaciones de rebote para las cajas 2..4
    $(".card").hover(
        function() {
            $(this).css({"transform": "scale(1.05)", "box-shadow": "0 0 15px rgba(43, 255, 0, 1), 0 0 25px rgba(0, 255, 64, 1)"});
        },
        function() {
            $(this).css({"transform": "scale(1)", "box-shadow": "0 4px 8px rgba(0,0,0,0.2)"});
        }
    );

    // Back to top visibility
    $(window).on('scroll',function(){ if($(window).scrollTop()>300) $('#toTop').fadeIn(180); else $('#toTop').fadeOut(180); });
    $('#toTop').hide();

    // To top click
    $('#toTop').on('click',function(){ $('html,body').animate({scrollTop:0},500); });
    
    // Accessibility: make links focusable outline
    $('a,button').on('focus',function(){ $(this).css('outline','2px dashed var(--accent)'); }).on('blur',function(){ $(this).css('outline','none'); });

    // Neon hover for sublist items
    $('.sublist li a').on('mouseenter',function(){ $(this).css({'text-shadow':'0 0 10px rgba(0,240,255,0.7)','color':'#bdfcff'}); }).on('mouseleave',function(){ $(this).css({'text-shadow':'none','color':'var(--muted)'}); });

    // Cursor pointer everywhere clickable
    $('a, .btn-3d, .arrow, .menu-item a, .nav-link, .home-3d').css('cursor','pointer');

    // Ensure sidebar closes on ESC
    $(document).on('keydown',function(e){ if(e.key==='Escape') $('#sidebar').removeClass('open'); });

    // Small UX improvement: if user clicks outside sidebar, close it
    $(document).on('click',function(e){ if(!$(e.target).closest('#sidebar, #openSidebar, #menuToggle').length){ $('#sidebar').removeClass('open'); } });
    
    
    
// =======================================================
// LÓGICA DEL CONTADOR DE AÑOS (Movida desde index.html)
// =======================================================

    function iniciarContador() {
        let contador = 0;
        const elemento = document.getElementById("contador");
        
        // Si el elemento no existe, salimos
        if (!elemento) return; 

        const intervalo = setInterval(() => {
            contador++;
            elemento.innerHTML = contador + "<span>Años</span>";
            if (contador >= 31) {
                clearInterval(intervalo);
            }
        }, 100);
    }

    // Usamos Intersection Observer para iniciar el contador cuando está visible
    function setupContadorObserver() {
        const contadorElement = document.getElementById("contador");
        
        // Si el elemento no existe (ej. en otras páginas cargadas dinámicamente), salimos
        if (!contadorElement) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Aquí usamos JavaScript nativo, no jQuery, como estaba originalmente
                    contadorElement.classList.add("visible");
                    iniciarContador();
                    observer.disconnect(); // Detiene la observación después de activarse
                }
            });
        }, { threshold: 0.5 }); // Se activa cuando el 50% del elemento es visible

        observer.observe(contadorElement);
    }

        // Llama a la función de configuración después de que todo el DOM esté cargado
        $(document).ready(function() {
            setupContadorObserver();
        });
        function setupCommunityTitle() {
        // Esta línea asigna el texto "COMUNIDAD" al atributo data-text.
        $('.community-title').attr('data-text', $('.community-title').text());
    }

    // 2. La llamada automática
    $(document).ready(function() {
        // jQuery espera a que todo el HTML esté cargado antes de llamar a esta función.
        setupCommunityTitle();
        
        // ... cualquier otra lógica específica de esta página ...
    });
// =======================================================
    // 3. LÓGICA DEL CARRUSEL MANUAL (REUTILIZABLE)
    // =======================================================

    function setupManualCarousel() {
        // 1. Obtener elementos
        const $slidesTrack = $('#slidesTrack');
        const $prevBtn = $('#prev');
        const $nextBtn = $('#next');

        // Si los elementos no existen (ej: estamos en otra página), salimos
        if (!$slidesTrack.length) return;

        // 2. Calcular el número total de imágenes
        const manualSlides = $slidesTrack.children('img').length;
        let manualIdx = 0;

        // 3. Función para mover el carrusel
        function goToManualSlide(index) {
            // Asegura que el índice dé la vuelta (loop)
            manualIdx = (index + manualSlides) % manualSlides; 
            
            // Calcula el desplazamiento: cada slide es el 100% del ancho
            const offset = -manualIdx * 100;
            
            // Aplica la transformación CSS
            $slidesTrack.css('transform', `translateX(${offset}%)`);
        }

        // 4. Asignar eventos a las flechas (Usamos .off() antes de .on() para evitar duplicados en carga dinámica)
        $nextBtn.off('click').on('click', function() {
            goToManualSlide(manualIdx + 1);
        });

        $prevBtn.off('click').on('click', function() {
            goToManualSlide(manualIdx - 1);
        });

        // 5. Inicializar la posición
        goToManualSlide(0);
    }
    
  });