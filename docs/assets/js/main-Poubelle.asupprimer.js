document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.querySelector('.quarto-color-scheme-toggle');
    toggle.addEventListener('click', function () {
        const body = document.body;
        // Basculer entre quarto-dark et quarto-light
        if (body.classList.contains('quarto-dark')) {
            body.classList.replace('quarto-dark', 'quarto-light');
        } else {
            body.classList.replace('quarto-light', 'quarto-dark');
        }
    });
});