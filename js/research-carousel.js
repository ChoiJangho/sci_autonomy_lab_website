(function () {
    var root = document.querySelector('[data-research-carousel]');
    if (!root) return;

    var track = root.querySelector('.research-carousel-track');
    var cards = Array.prototype.slice.call(root.querySelectorAll('.research-card'));
    var prevBtn = root.querySelector('[data-carousel-prev]');
    var nextBtn = root.querySelector('[data-carousel-next]');
    if (!track || cards.length === 0) return;

    var index = 0;
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].classList.contains('is-active')) {
            index = i;
            break;
        }
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function update() {
        cards.forEach(function (card, i) {
            card.classList.toggle('is-active', i === index);
            card.classList.toggle('is-adjacent', Math.abs(i - index) === 1);
            card.setAttribute('aria-hidden', i === index ? 'false' : 'true');
        });

        var active = cards[index];
        var viewport = root.querySelector('.research-carousel-viewport');
        if (!active || !viewport) return;

        var viewportCenter = viewport.clientWidth / 2;
        var cardCenter = active.offsetLeft + active.offsetWidth / 2;
        var offset = viewportCenter - cardCenter;
        track.style.transform = 'translateX(' + offset + 'px)';

        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) nextBtn.disabled = index === cards.length - 1;
    }

    function goTo(nextIndex) {
        index = clamp(nextIndex, 0, cards.length - 1);
        update();
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            goTo(index - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            goTo(index + 1);
        });
    }

    cards.forEach(function (card, i) {
        card.addEventListener('click', function (event) {
            if (event.target.closest('a')) return;
            goTo(i);
        });
    });

    window.addEventListener('resize', update);
    update();
})();
