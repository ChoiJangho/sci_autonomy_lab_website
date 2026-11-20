(function () {
    var lightbox = document.getElementById('publication-lightbox');
    if (!lightbox) return;

    var lightboxImg = lightbox.querySelector('img');

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightbox.hidden = false;
        document.body.classList.add('publication-lightbox-open');
    }

    function closeLightbox() {
        lightbox.hidden = true;
        lightboxImg.removeAttribute('src');
        lightboxImg.alt = '';
        document.body.classList.remove('publication-lightbox-open');
    }

    document.addEventListener('click', function (event) {
        var trigger = event.target.closest('.publication-image-thumb[data-lightbox-src]');
        if (trigger) {
            event.preventDefault();
            openLightbox(trigger.getAttribute('data-lightbox-src'), trigger.getAttribute('data-lightbox-alt'));
            return;
        }

        if (!lightbox.hidden) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !lightbox.hidden) {
            closeLightbox();
        }
    });
})();
