 
    // ---------- LOGICA JQUERY Y ANIMACIONES ----------
    $(function(){
      // Sidebar toggle
      $('#openSidebar, #menuToggle').on('click',function(e){
        e.preventDefault();
        $('#sidebar').toggleClass('open');
      });

      // Home icon tooltip toggle
      $('#homeIcon').on('mouseenter',function(){
        $('#homeCloud').fadeIn(220);
      }).on('mouseleave',function(){
        $('#homeCloud').fadeOut(220);
      }).on('click',function(){
        // efecto toggle y desplazamiento arriba
        $('.cube').toggleClass('rot');
        $('html,body').animate({scrollTop:0},450);
      });

      // Toggle categories
      $('.toggle-cat').on('click',function(e){
        e.preventDefault();
        var target = $(this).data('target');
        $(target).toggleClass('open');
      });

      // Nav links: cargan plantillas internas (simulan paginas con header, 4 secciones y footer)
      const pageTemplate = (title)=>{
        return `\n<section class=\"section\">\n  <h2>${title}</h2>\n  <p style=\"color:var(--muted)\">Encabezado de la página con navegación y presentación.</p>\n</section>\n<section class=\"section\">\n  <h3>Sección 1</h3>\n  <p>Contenido de la primera sección.</p>\n</section>\n<section class=\"section\">\n  <h3>Sección 2</h3>\n  <p>Contenido de la segunda sección.</p>\n</section>\n<section class=\"section\">\n  <h3>Sección 3</h3>\n  <p>Contenido de la tercera sección.</p>\n</section>\n<footer>\n  <div style=\"padding:1rem;color:var(--muted)\">Footer de la página - información de contacto</div>\n</footer>`;
      };

      $('.nav-link').on('click',function(e){
        e.preventDefault();
        var page = $(this).data('page') || 'p';
        var title = $(this).text();
        // Cargar plantilla en mainContent (simula página individual)
        $('#mainContent').html(pageTemplate(title));
        // cerrar sidebar en móvil
        $('#sidebar').removeClass('open');
      });

      // Carrusel automático
      const $track = $('#autoTrack');
      const slides = $track.children().length;
      let idx=0;

   
   // Array con diferentes imágenes
      const imagenes = [
        "img/posters/folleto1.png",
        "img/posters/folleto2.png",
        "img/posters/reingenieria_pedagogica.jpeg",
        "img/posters/matriculas_abiertas.png",
        "img/posters/cambio_agentes_educativos.jpeg",
        "img/posters/proyectos.png",
        "img/posters/rectoraAdmisiones.png",
        "img/posters/costos2026.png",
        // "img/posters/cultura_ciencia.png",
        "img/posters/admisiones2026.png", // Este es el especial
      ];

      // Generamos los posters dinámicamente
      const postersHTML = imagenes.map((src, i) => {
        // Si es el poster de admisiones2026, le agregamos la clase "full"
        const isFull = src.includes("admisiones2026") || src.includes("folleto1") || src.includes("folleto2")|| src.includes("reingenieria_pedagogica")|| src.includes("matriculas_abiertas") || src.includes("cambio_agentes_educativos");

        return `
          <div class="poster ${isFull ? "full" : ""}">
            <a><img src="${src}" alt="Poster ${i + 1}"></a>
          </div>
        `;
      }).join("");

      // Insertamos en el contenedor
      document.getElementById("postersArea").innerHTML = postersHTML;

      // generar dots
      for(let i=0;i<slides;i++){ $('#dots').append('<div class="dot" data-i="'+i+'"></div>'); }
      const $dots = $('#dots .dot');
      function goTo(i){ idx = (i+slides)%slides; $track.css('transform',`translateX(${-idx*100}%)`); $dots.removeClass('active').eq(idx).addClass('active'); }
      goTo(0);
      let auto = setInterval(()=>{ goTo(idx+1); },4000);
      // dot click
      $dots.on('click',function(){ clearInterval(auto); goTo($(this).data('i')); auto=setInterval(()=>goTo(idx+1),4000); });

      // Animaciones de rebote para las cajas 2..4
      $(".card").hover(
        function() {
          $(this).css({
            "transform": "scale(1.05)",
            "box-shadow": "0 0 15px rgba(43, 255, 0, 1), 0 0 25px rgba(0, 255, 64, 1)"
          });
        },
        function() {
          $(this).css({
            "transform": "scale(1)",
            "box-shadow": "0 4px 8px rgba(0,0,0,0.2)"
          });
        }
      );

      // Manual carousel controls
      let mIdx=0; const $slides = $('#slidesTrack'); const mCount = $slides.children().length;
      function mGo(i){ mIdx=(i+mCount)%mCount; $slides.css('transform',`translateX(${-mIdx*100}%)`); }
      $('#next').on('click',function(){ mGo(mIdx+1); });
      $('#prev').on('click',function(){ mGo(mIdx-1); });

      // Horarios - hover transparencia
      $('.schedule-card').hover(function(){ $(this).css('opacity',.7); },function(){ $(this).css('opacity',1); });

      // Social links: lógica para abrir
      $('.social-link').on('click',function(e){ e.preventDefault(); var url=$(this).data('href'); window.open(url,'_blank'); });

      // Boton PSE abre enlace (ya tiene href target blank)

      // To top
      $('#toTop').on('click',function(){ $('html,body').animate({scrollTop:0},500); });

      // Back to top visibility
      $(window).on('scroll',function(){ if($(window).scrollTop()>300) $('#toTop').fadeIn(180); else $('#toTop').fadeOut(180); });
      $('#toTop').hide();

      // 3D arrow hover for manual carousel has CSS transform

      // Accessibility: make links focusable outline
      $('a,button').on('focus',function(){ $(this).css('outline','2px dashed var(--accent)'); }).on('blur',function(){ $(this).css('outline','none'); });

      // Neon hover for sublist items (add subtle glow on hover)
      $('.sublist li a').on('mouseenter',function(){ $(this).css({'text-shadow':'0 0 10px rgba(0,240,255,0.7)','color':'#bdfcff'}); }).on('mouseleave',function(){ $(this).css({'text-shadow':'none','color':'var(--muted)'}); });

      // Cursor pointer everywhere clickable
      $('a, .btn-3d, .arrow, .menu-item a, .nav-link, .home-3d').css('cursor','pointer');

      // Ensure sidebar closes on ESC
      $(document).on('keydown',function(e){ if(e.key==='Escape') $('#sidebar').removeClass('open'); });

      // Small UX improvement: if user clicks outside sidebar, close it
      $(document).on('click',function(e){ if(!$(e.target).closest('#sidebar, #openSidebar, #menuToggle').length){ $('#sidebar').removeClass('open'); } });

    });
document.querySelectorAll('.social-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    window.open(link.dataset.href, "_blank");
  });
});