document.addEventListener('DOMContentLoaded', () => {
    
    //LOGICA DEL MENÚ MÓVIL
    const initMobileMenu = () => {
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        if(!menuToggle) return;

        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        });
    };

    //  RESALTADO DE ENLACE ACTIVO 
    const initScrollSpy = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav__link');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                if (scrollY >= sectionTop) current = section.getAttribute('id');
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}` || link.getAttribute('href') === window.location.pathname.split('/').pop()) {
                    link.classList.add('active');
                }
            });
        });
    };

    initMobileMenu();
    initScrollSpy();
});