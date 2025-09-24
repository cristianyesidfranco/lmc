$(document).ready(function() {
    // Escucha el clic en el ícono de hamburguesa
    $('.hamburger-menu').on('click', function() {
        // Alterna la clase 'active' en el menú principal
        $('.main-nav').toggleClass('active');
    });

    // Escucha el clic en cualquier enlace del menú para cerrarlo
    $('.main-nav a').on('click', function() {
        if ($(window).width() <= 768) {
            $('.main-nav').removeClass('active');
        }
    });

    // Anima las tarjetas al pasar el mouse
    $(".card").hover(
        function() {
            // Animación y efectos de neón verde al entrar el mouse
            $(this).css({
                "transform": "translateY(-10px)",
                "box-shadow": "0 0 10px #00ff0d, 0 0 20px #00ff0d, 0 8px 15px rgba(0, 0, 0, 0.15)"
            });
        },
        function() {
            // Restaura los estilos al salir el mouse
            $(this).css({
                "transform": "translateY(0)",
                "box-shadow": "0 4px 10px rgba(0, 0, 0, 0.1)"
            });
        }
    );
});