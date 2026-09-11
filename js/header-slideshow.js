(function () {
    var IMAGE_DURATION_MS = 6000;
    var slideshow = document.querySelector('.header-slideshow');
    if (!slideshow) return;

    var slides = Array.prototype.slice.call(slideshow.querySelectorAll('.header-slide'));
    if (!slides.length) return;

    if (slides.length === 1) {
        var onlyVideo = slideshow.querySelector('.header-slide[data-slide-type="video"] video');
        if (onlyVideo) {
            onlyVideo.muted = true;
            onlyVideo.loop = true;
            onlyVideo.play().catch(function () {});
        }
        return;
    }

    var currentIndex = 0;
    var advanceTimer = null;
    var advancing = false;

    function clearAdvanceTimer() {
        if (advanceTimer) {
            clearTimeout(advanceTimer);
            advanceTimer = null;
        }
    }

    function pauseVideosExcept(activeSlide) {
        slides.forEach(function (slide) {
            var video = slide.querySelector('video');
            if (!video || slide === activeSlide) return;
            video.onended = null;
            video.pause();
            try {
                video.currentTime = 0;
            } catch (e) {}
        });
    }

    function scheduleNext(delayMs) {
        clearAdvanceTimer();
        advanceTimer = setTimeout(showNext, delayMs);
    }

    function showNext() {
        if (advancing) return;
        advancing = true;
        clearAdvanceTimer();
        currentIndex = (currentIndex + 1) % slides.length;
        activateSlide(currentIndex);
        advancing = false;
    }

    function activateSlide(index) {
        var slide = slides[index];
        slides.forEach(function (s, i) {
            s.classList.toggle('is-active', i === index);
        });
        pauseVideosExcept(slide);

        if (slide.getAttribute('data-slide-type') === 'video') {
            var video = slide.querySelector('video');
            if (!video) {
                scheduleNext(IMAGE_DURATION_MS);
                return;
            }

            video.muted = true;
            video.loop = false;
            video.onended = function () {
                showNext();
            };

            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    scheduleNext(IMAGE_DURATION_MS);
                });
            }

            function armVideoFallback() {
                if (isFinite(video.duration) && video.duration > 0) {
                    scheduleNext((video.duration * 1000) + 800);
                } else {
                    scheduleNext(IMAGE_DURATION_MS);
                }
            }

            if (isFinite(video.duration) && video.duration > 0) {
                armVideoFallback();
            } else {
                video.addEventListener('loadedmetadata', function onMeta() {
                    video.removeEventListener('loadedmetadata', onMeta);
                    armVideoFallback();
                });
            }
            return;
        }

        scheduleNext(IMAGE_DURATION_MS);
    }

    activateSlide(currentIndex);
})();
