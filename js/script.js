// js/script.js

// ---------- LOGICA JQUERY Y ANIMACIONES (FINALMENTE CORREGIDO Y OPTIMIZADO) ----------
$(function() {
    
    // =======================================================
    // 1. CARGA DE ARCHIVOS ($.load())
    // =======================================================
    
    $("#header-placeholder").load("header.html", function() {
        // Eventos delegados de mouse para el icono de inicio
        $(document).on('mouseenter', '#homeIcon', function(){
            $('#homeCloud').fadeIn(220);
        }).on('mouseleave', '#homeIcon', function(){
            $('#homeCloud').fadeOut(220);
        });
    }); 
    
    $("#footer-placeholder").load("footer.html"); 
    
    // =======================================================
    // 2. EVENTOS DELEGADOS (Para elementos que se cargan dinámicamente)
    // =======================================================

    // Sidebar toggle
    $(document).on('click', '#openSidebar, #menuToggle', function(e){
        e.preventDefault();
        $('#sidebar').toggleClass('open');
    });

    // Home icon click
    $(document).on('click', '#homeIcon', function(){
        $('.cube').toggleClass('rot');
        $('html,body').animate({scrollTop:0},450);
    });

    // Social links
    $(document).on('click', '.social-link', function(e){ 
        e.preventDefault(); 
        var url=$(this).data('href'); 
        window.open(url,'_blank'); 
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

        $nextBtn.off('click').on('click', function() {
            goToManualSlide(manualIdx + 1);
        });

        $prevBtn.off('click').on('click', function() {
            goToManualSlide(manualIdx - 1);
        });

        goToManualSlide(0);
    }
    
    
    // =======================================================
    // 4. LÓGICA DEL CONTADOR DE AÑOS
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
    // 5. LÓGICA DE CONTENIDO PRINCIPAL Y CARRUSEL AUTOMÁTICO
    // =======================================================

    // Toggle categories
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
        var title = $(this).text();
        
        $('#mainContent').html(pageTemplate(title));
        $("#footer-template-placeholder").load("footer.html"); 
        
        // Re-inicializa la lógica si los elementos están en las plantillas dinámicas
        setupManualCarousel(); 
        setupCommunityTitle(); 
        
        $('#sidebar').removeClass('open');
    });

    // Carrusel automático (Inicialización y lógica)
    const $track = $('#autoTrack');
    const $postersArea = $('#postersArea'); 
    const $dotsContainer = $('#dots');
    
    // VERIFICACIÓN CLAVE: Solo ejecutar si los elementos existen
    if ($track.length && $postersArea.length && $dotsContainer.length) {
        
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
        $postersArea.html(postersHTML);
        
        // generar dots y lógica de carrusel automático
        for(let i=0;i<slides;i++){ $dotsContainer.append('<div class="dot" data-i="'+i+'"></div>'); }
        
        const $dots = $('#dots .dot');
        function goTo(i){ 
            idx = (i+slides)%slides; 
            $track.css('transform',`translateX(${-idx*100}%)`); 
            $dots.removeClass('active').eq(idx).addClass('active'); 
        }
        
        goTo(0);
        let auto = setInterval(()=>{ goTo(idx+1); },4000);
        
        $dots.on('click',function(){ 
            clearInterval(auto); 
            goTo($(this).data('i')); 
            auto=setInterval(()=>goTo(idx+1),4000); 
        });
    }

    // Animaciones de rebote
    $(".card").hover(
        function() {
            $(this).css({"transform": "scale(1.05)", "box-shadow": "0 0 15px rgba(43, 255, 0, 1), 0 0 25px rgba(0, 255, 64, 1)"});
        },
        function() {
            $(this).css({"transform": "scale(1)", "box-shadow": "0 4px 8px rgba(0,0,0,0.2)"});
        }
    );

    // Back to top visibility & click
    $(window).on('scroll',function(){ 
        if($(window).scrollTop()>300) $('#toTop').fadeIn(180); 
        else $('#toTop').fadeOut(180); 
    });
    $('#toTop').hide();
    $('#toTop').on('click',function(){ $('html,body').animate({scrollTop:0},500); });
    
    // Accessibility & UX
    $('a,button').on('focus',function(){ $(this).css('outline','2px dashed var(--accent)'); }).on('blur',function(){ $(this).css('outline','none'); });
    $('.sublist li a').on('mouseenter',function(){ $(this).css({'text-shadow':'0 0 10px rgba(0,240,255,0.7)','color':'#bdfcff'}); }).on('mouseleave',function(){ $(this).css({'text-shadow':'none','color':'var(--muted)'}); });
    $('a, .btn-3d, .arrow, .menu-item a, .nav-link, .home-3d').css('cursor','pointer');
    $(document).on('keydown',function(e){ if(e.key==='Escape') $('#sidebar').removeClass('open'); });
    $(document).on('click',function(e){ if(!$(e.target).closest('#sidebar, #openSidebar, #menuToggle').length){ $('#sidebar').removeClass('open'); } });
    
    
    // =======================================================
    // 6. INICIALIZACIÓN FINAL: Se ejecuta al cargar el DOM
    // =======================================================

    setupManualCarousel(); 
    setupCommunityTitle();
    setupContadorObserver(); 
});