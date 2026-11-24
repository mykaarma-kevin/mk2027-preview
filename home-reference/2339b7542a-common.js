(function ($) {

    //<editor-fold desc="Variables">
    let viewport = $(window);
    const body = $('body');
    //</editor-fold>

    //<editor-fold desc="Animated Anchors">
    const doc = $('html, body');

    function animAnc(selector) {

        const windowTop = window.scrollY
        let targetTop = $(selector).offset().top;
        if (!targetTop) {
            targetTop = 0;
        }

        let dif = targetTop - windowTop;
        let speed;

        if (dif < 0) {
            speed = dif * -1
        } else {
            speed = dif
        }

        doc.animate({
            scrollTop: $(selector).offset().top - 120,
        }, speed / 3);
    }

    $(document).on('click', 'a[href*=\'#\']', function (event) {
        const rowHref = $(this).attr('href');
        const href = `#${rowHref.split('#')[1]}`;
        if ($(href).offset()) {
            event.preventDefault();

            animAnc(href);

        }
    });
    //</editor-fold>

    //<editor-fold desc="Animations">

    gsap.registerPlugin(ScrollTrigger);

    /*const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);*/

    $('.default-appearance').each(function () {
        const x = $(this);
        gsap.to(x, {
            scrollTrigger: {
                trigger: x, start: `top 75%`, end: 'bottom 75%', toggleActions: 'play none none none', markers: 0
            }, opacity: 1, ease: 'power1.out', duration: .6, delay: parseFloat(x.attr('data-animation-delay')) || .2,
        });
    });

    /**
     * Animates the specified element using GSAP and ScrollTrigger.
     *
     * @param {string|jQuery} selector - The CSS selector or jQuery object of the element to animate.
     * @param {object} params - An object containing additional animation parameters (e.g., offsets, scale).
     * @param {string} startPosition - The start position for the animation relative to the viewport (e.g., '85%').
     * @param {boolean} marker - Flag to display ScrollTrigger markers (useful for debugging).
     */
    function animateThis(selector, params, startPosition, marker) {
        gsap.from(selector, {
            scrollTrigger: {
                trigger: selector,               // The element that triggers the scroll.
                start: `top ${startPosition}`,     // Animation starts when the top of the element reaches startPosition.
                end: 'bottom top',               // End of the animation.
                toggleActions: 'play none none none', // Actions for entering/exiting the viewport.
                markers: marker                  // Enable markers for debugging.
            }, ease: 'power1.out',                  // Easing function for the animation.
            ...params                           // Spread additional animation parameters.
        });
    }

    /**
     * Finds elements with the specified animation type and applies the animation to them.
     *
     * Elements must have the following attributes:
     * - data-animation-type: The type of animation ('fade-in', 'fade-in-up', 'fade-in-scaled', 'fade-in-left', 'fade-in-right').
     * - data-animation-delay: The animation delay (number, optional).
     * - data-animation-duration: The animation duration (number, optional).
     *
     * @param {string} animationType - The animation type to apply.
     * @param {object} properties - Additional animation properties (not used in the current implementation).
     */
    const animateElements = (animationType, properties) => {
        // Find all elements with data-animation-type equal to animationType.
        const elements = $(`[data-animation-type="${animationType}"]`);

        if (elements.length > 0) {
            elements.each(function () {
                const x = $(this); // Current element.

                // Retrieve the animation delay and convert it to a number.
                let delay = parseFloat(x.attr('data-animation-delay'));

                // For screen widths greater than 992px, use the provided delay if it's positive.
                // For smaller screens, the delay is always 0.
                if (viewport.width() > 992) {
                    delay = delay > 0 ? delay : 0;
                } else {
                    delay = 0;
                }

                // Retrieve the animation duration and convert it to a number.
                let duration = parseFloat(x.attr('data-animation-duration'));
                duration = duration > 0 ? duration : 0.6; // Use 0.6 if the duration is invalid.

                // Create the animation properties object.
                let animationProps = {
                    delay: delay, duration: duration, opacity: 0 // Initial opacity.
                };

                // Add additional settings based on the animation type.
                switch (animationType) {
                    case 'fade-in':
                        // No additional properties.
                        break;
                    case 'fade-in-up':
                        animationProps.y = 75; // Offset on the Y-axis.
                        break;
                    case 'fade-in-scaled':
                        animationProps.scale = 0; // Initial scale.
                        break;
                    case 'fade-in-left':
                        animationProps.x = -75; // Offset on the X-axis to the left.
                        break;
                    case 'fade-in-right':
                        animationProps.x = 75;  // Offset on the X-axis to the right.
                        break;
                    default:
                        console.warn(`Unknown animation type: ${animationType}`);
                        return; // Exit for unknown animation types.
                }

                // Run the animation for the current element.
                animateThis(x, animationProps, '85%');
            });
        }
    };

    // Apply animations for all supported types.
    ['fade-in', 'fade-in-up', 'fade-in-scaled', 'fade-in-left', 'fade-in-right'].forEach(type => {
        animateElements(type);
    });

    //</editor-fold>

    //<editor-fold desc="Mobile Menu Buttons">
    $('#mob-menu-btns').click(function (e) {
        e.preventDefault();

        $('body').toggleClass('has-mobile-menu-open');
    })
    //</editor-fold>

    //<editor-fold desc="Header Transformation">
    gsap.to('header .main-header', {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: '150px top',
            toggleActions: 'play none none none',
            scrub: true,
            markers: false
        }, backgroundColor: 'rgba(255, 255, 255, 1)', borderBottomColor: 'rgba(243, 238, 231, 1)', ease: 'power1.out',
    })
    //</editor-fold>

    //<editor-fold desc="Social Icons Hover">

    document.addEventListener('DOMContentLoaded', () => {
        const icons = document.querySelectorAll('.social-icons-stack .social-icon .wp-block-image');

        icons.forEach(figure => {
            const img = figure.querySelector('img');
            if (!img) return;

            const src = img.currentSrc || img.src;
            if (!src) return;

            figure.style.setProperty('--social-icon-mask', `url("${src}")`);
        });
    });

    //</editor-fold>

    //<editor-fold desc="Trusted By">
    document.addEventListener('DOMContentLoaded', () => {
        function waitForImages(container) {
            const images = Array.from(container.querySelectorAll('img'));

            return Promise.all(images.map(image => {
                if (image.complete) {
                    return Promise.resolve();
                }

                return new Promise(resolve => {
                    image.addEventListener('load', resolve, {once: true});
                    image.addEventListener('error', resolve, {once: true});
                });
            }));
        }

        async function marqueeTheRow(rows, type = 'figure', speed = 40, reverse = false) {
            for (const row of rows) {

                if (row.dataset.marqueeInitialized === 'true') {
                    continue;
                }

                row.dataset.marqueeInitialized = 'true';

                await waitForImages(row);

                const originalItems = Array.from(row.children).filter(child => child.tagName.toLowerCase() === type.toLowerCase());

                if (!originalItems.length) {
                    continue;
                }

                const group = document.createElement('div');
                group.classList.add('rd-trusted-group');

                originalItems.forEach(item => {
                    group.appendChild(item);
                });

                row.appendChild(group);

                const computedRowStyle = window.getComputedStyle(row);
                const rowGap = parseFloat(computedRowStyle.columnGap) || parseFloat(computedRowStyle.gap) || 0;

                group.style.display = 'flex';
                group.style.flex = '0 0 auto';
                group.style.flexWrap = 'nowrap';
                group.style.columnGap = `${rowGap}px`;

                row.style.columnGap = `${rowGap}px`;
                row.style.gap = `${rowGap}px`;

                if (reverse) {
                    row.classList.add('is-reverse');
                }

                function buildMarquee() {

                    row.querySelectorAll('.rd-trusted-group-clone').forEach(clone => {
                        clone.remove();
                    });

                    const groupWidth = group.getBoundingClientRect().width + rowGap;
                    const viewportWidth = row.parentElement?.getBoundingClientRect().width || window.innerWidth;

                    const copies = Math.max(2, Math.ceil(viewportWidth / groupWidth) + 2);

                    for (let i = 1; i < copies; i++) {
                        const clone = group.cloneNode(true);

                        clone.classList.add('rd-trusted-group-clone');
                        clone.setAttribute('aria-hidden', 'true');

                        clone.querySelectorAll('[id]').forEach(element => {
                            element.removeAttribute('id');
                        });

                        row.appendChild(clone);
                    }

                    const duration = groupWidth / speed;

                    row.style.setProperty('--marquee-distance', `${groupWidth}px`);

                    row.style.setProperty('--marquee-duration', `${duration}s`);
                }

                buildMarquee();

                let resizeTimer;

                const resizeObserver = new ResizeObserver(() => {
                    clearTimeout(resizeTimer);

                    resizeTimer = setTimeout(() => {
                        buildMarquee();
                    }, 150);
                });

                if (row.parentElement) {
                    resizeObserver.observe(row.parentElement);
                }
            }
        }

        const trustedRows = document.querySelectorAll('.rd-trusted-row');

        if (trustedRows.length) {
            marqueeTheRow(trustedRows, 'figure', 40, false);
        }
    });
    //</editor-fold>

    //<editor-fold desc="Testimonials Section">

    document.addEventListener('DOMContentLoaded', () => {

        if (typeof Swiper === 'undefined') return;

        document.querySelectorAll('.testimonials-section').forEach(section => {

            const slider = section.querySelector('.testimonials-slider');
            const track = slider?.querySelector('.testimonials-track');

            const prev = section.querySelector('.testimonials-prev');
            const next = section.querySelector('.testimonials-next');

            if (!slider || !track) return;

            // Prevent duplicate initialization
            if (slider.swiper) return;

            slider.classList.add('swiper');
            track.classList.add('swiper-wrapper');

            const originalCards = Array.from(track.querySelectorAll(':scope > .testimonial-card'));

            if (!originalCards.length) return;

            originalCards.forEach(card => {
                card.classList.add('swiper-slide');
            });

            /* ========================================
               ENSURE ENOUGH SLIDES FOR LOOP
            ======================================== */

            const originalCount = originalCards.length;

            // Duplicate slides only when needed
            if (originalCount > 1 && originalCount < 6) {

                const copiesNeeded = Math.ceil(6 / originalCount);

                for (let i = 1; i < copiesNeeded; i++) {

                    originalCards.forEach(card => {

                        const clone = card.cloneNode(true);

                        clone.classList.add('swiper-slide');

                        // Avoid duplicate HTML IDs
                        clone.querySelectorAll('[id]').forEach(el => {
                            el.removeAttribute('id');
                        });

                        clone.removeAttribute('id');

                        track.appendChild(clone);
                    });
                }
            }

            /* ========================================
               SWIPER
            ======================================== */

            new Swiper(slider, {

                slidesPerView: 'auto',

                speed: 650,

                loop: originalCount > 1,

                loopAdditionalSlides: 2,

                grabCursor: true,

                watchOverflow: true,

                slideToClickedSlide: false,

                navigation: {
                    prevEl: prev, nextEl: next
                },

                breakpoints: {
                    0: {
                        slidesPerView: 'auto', spaceBetween: 12, centeredSlides: true, centeredSlidesBounds: false
                    },

                    768: {
                        slidesPerView: 'auto', spaceBetween: 42, centeredSlides: false
                    }
                },

                observer: false, observeParents: true,

                /* ========================================
                   SMOOTHER INTERACTION
                ======================================== */

                preventInteractionOnTransition: true,

                touchStartPreventDefault: false,

                resistanceRatio: 0.85

            });

        });

    });

    //</editor-fold>

    /*document.addEventListener('DOMContentLoaded', () => {

        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        gsap.registerPlugin(ScrollTrigger);

        if (typeof ScrollTrigger.observe !== 'function') {
            console.warn('Journey: ScrollTrigger.observe is unavailable');
            return;
        }

        /!* ========================================
           ELEMENTS
        ======================================== *!/

        const section = document.querySelector('.journey-section');
        const wrapper = section?.querySelector('.number-cards-wrapper');
        const wheel = wrapper?.querySelector('.journey-wheel-svg');
        const rotating = wheel?.querySelector('.journey-wheel-rotating');
        const labels = wheel?.querySelector('.journey-wheel-labels');

        const steps = [wrapper?.querySelector('.journey-step-01'), wrapper?.querySelector('.journey-step-02'), wrapper?.querySelector('.journey-step-03'), wrapper?.querySelector('.journey-step-04')];

        const scrollbar = section?.querySelector('.journey-scrollbar');

        const scrollbarThumb = scrollbar?.querySelector('.journey-scrollbar-thumb');

        if (!section || !wrapper || !wheel || !rotating || !labels || steps.some(step => !step)) return;

        if (section.dataset.journeyInitialized === 'true') return;

        section.dataset.journeyInitialized = 'true';

        /!* ========================================
           SETTINGS
        ======================================== *!/

        const desktopVisibleRatio = 480 / 1321;
        const mobileVisibleRatio = 0.5;

        const desktopBreakpoint = 1440;
        const mobileBreakpoint = 767;

        const scrollScreens = 3;
        const rotationDuration = 1.2;

        const wheelThreshold = 15;
        const touchThreshold = 12;

        const isTouchDevice = ScrollTrigger.isTouch === 1 || (navigator.maxTouchPoints > 0 && window.matchMedia('(pointer: coarse)').matches);

        const scrollActivityWindow = 200;

        const rotationEase = 'power2.inOut';

        const fadeOutRange = 0.65;
        const fadeInStart = 0.35;

        const totalSteps = 4;

        const scrollbarMinFill = 0;
        const scrollbarMaxFill = 100;

        const rearmDistance = 80;
        const releaseOffset = 4;

        const SVG_NS = 'http://www.w3.org/2000/svg';

        const CENTER = '661 661';

        const fadeEase = gsap.parseEase('sine.inOut');


        /!* ========================================
           INITIAL STATE
        ======================================== *!/

        const state = {
            rotation: 0
        };

        let currentStep = 0;
        let isAnimating = false;

        let lastScrollTime = -Infinity;
        let lastScrollDirection = 0;

        let animationDirection = 0;
        let pendingReverseDirection = 0;

        let isCaptured = false;
        let isCapturing = false;
        let isReleasing = false;
        let isRefreshing = false;

        let canCapture = true;

        let rotationTween = null;

        let pinTrigger = null;
        let entryTrigger = null;
        let scrollObserver = null;

        let scrollbarProgress = 0;

        let previousScrollPosition = window.scrollY;
        let lastWheelHeight = -1;

        /!* Mobile state *!/

        let normalizer = null;

        let touchDistance = 0;
        let touchPendingDirection = 0;
        let touchReleaseGesture = false;

        /!* Visual viewport state *!/

        let viewportRefreshTimer = null;

        let lastViewportBottom = getViewportBottom();

        /!* ========================================
           REAL VIEWPORT SIZE — SAFARI / CHROME IOS
        ======================================== *!/

        function getViewportBottom() {

            if (isTouchDevice && window.visualViewport && Math.abs(window.visualViewport.scale - 1) < 0.01) {

                return (window.visualViewport.height + window.visualViewport.offsetTop);

            }

            return window.innerHeight;

        }

        function getJourneyStart() {

            /!* Preserve original desktop behavior *!/

            if (!isTouchDevice) {

                return 'bottom bottom';

            }

            /!* Use the actual visible viewport on mobile *!/

            return `bottom ${getViewportBottom()}px`;

        }

        /!* ========================================
           RESPONSIVE WHEEL LAYOUT
        ======================================== *!/

        function updateLayout() {

            const wheelHeight = wheel.getBoundingClientRect().height;

            if (wheelHeight <= 0) return;

            const viewportWidth = window.innerWidth;

            const progress = gsap.utils.clamp(0, 1, (viewportWidth - mobileBreakpoint) / (desktopBreakpoint - mobileBreakpoint));

            const visibleRatio = gsap.utils.interpolate(mobileVisibleRatio, desktopVisibleRatio, progress);

            const visibleHeight = wheelHeight * visibleRatio;
            const hiddenHeight = wheelHeight - visibleHeight;

            if (Math.abs(hiddenHeight - lastWheelHeight) < 0.5) return;

            lastWheelHeight = hiddenHeight;

            gsap.set(wrapper, {
                marginBottom: -hiddenHeight
            });

        }

        updateLayout();

        /!* ========================================
           SCROLLTRIGGER REFRESH PROTECTION
        ======================================== *!/

        ScrollTrigger.addEventListener('refreshInit', () => {

            isRefreshing = true;

            updateLayout();

        });

        ScrollTrigger.addEventListener('refresh', () => {

            previousScrollPosition = window.scrollY;

            lastViewportBottom = getViewportBottom();

            isRefreshing = false;

            if (isTouchDevice && isCaptured && pinTrigger && !isCapturing && !isReleasing) {

                syncPinPosition();

            }

        });

        /!* ========================================
           PREPARE SVG LABELS
        ======================================== *!/

        if (labels.parentNode !== wheel) {

            wheel.appendChild(labels);

        }

        const numbers = [...labels.querySelectorAll('text')];

        const numberWrappers = numbers.map(number => {

            let group = number.parentNode;

            if (!group.classList.contains('journey-number-wrapper')) {

                group = document.createElementNS(SVG_NS, 'g');

                group.classList.add('journey-number-wrapper');

                number.parentNode.insertBefore(group, number);

                group.appendChild(number);

            }

            const x = Number(number.getAttribute('x'));
            const y = Number(number.getAttribute('y'));

            const transform = number.getAttribute('transform') || '';

            const rotationMatch = transform.match(/rotate\(\s*(-?[\d.]+)/);

            const originalRotation = rotationMatch ? Number(rotationMatch[1]) : 0;

            gsap.set(group, {

                rotation: 0,

                svgOrigin: `${x} ${y}`,

                smoothOrigin: false

            });

            return {

                element: group,

                x,

                y,

                originalRotation,

                lastCorrection: 0,

                setRotation: gsap.quickSetter(group, 'rotation', 'deg')

            };

        });

        /!* ========================================
           PREPARE WHEEL TRANSFORMS
        ======================================== *!/

        gsap.set(rotating, {

            rotation: 0,

            svgOrigin: CENTER

        });

        gsap.set(labels, {

            rotation: 0,

            svgOrigin: CENTER

        });

        const setWheelRotation = gsap.quickSetter(rotating, 'rotation', 'deg');

        const setLabelsRotation = gsap.quickSetter(labels, 'rotation', 'deg');

        /!* ========================================
           PREPARE CARD SETTERS
        ======================================== *!/

        const stepSetters = steps.map(step => {

            return {

                element: step,

                setOpacity: gsap.quickSetter(step, 'opacity'),

                lastOpacity: null,

                lastVisibility: null,

                lastPointerEvents: null

            };

        });

        /!* ========================================
           PREPARE SCROLLBAR
        ======================================== *!/

        const setScrollbarHeight = scrollbarThumb ? gsap.quickSetter(scrollbarThumb, 'height', '%') : null;

        if (scrollbarThumb) {

            gsap.set(scrollbarThumb, {
                y: 0
            });

        }

        /!* ========================================
           CYCLIC HELPERS
        ======================================== *!/

        function wrapStep(step) {

            return ((step % totalSteps) + totalSteps) % totalSteps;

        }

        /!* ========================================
           UPDATE WHEEL
        ======================================== *!/

        function updateWheel() {

            const rotation = state.rotation;

            setWheelRotation(rotation);

            setLabelsRotation(rotation);

            /!* Keep SVG labels readable *!/

            numberWrappers.forEach(number => {

                const absoluteRotation = number.originalRotation + rotation;

                const normalizedRotation = ((absoluteRotation + 180) % 360 + 360) % 360 - 180;

                const correction = normalizedRotation > 90 || normalizedRotation < -90 ? 180 : 0;

                if (number.lastCorrection !== correction) {

                    number.setRotation(correction);

                    number.lastCorrection = correction;

                }

            });

        }

        /!* ========================================
           UPDATE STEPS
        ======================================== *!/

        function updateSteps() {

            const progress = gsap.utils.clamp(0, totalSteps, -state.rotation / 90);

            const step = Math.floor(progress);
            const fraction = progress - step;

            const currentIndex = wrapStep(step);
            const nextIndex = wrapStep(step + 1);

            /!* Smooth fade out *!/

            const fadeOut = 1 - fadeEase(gsap.utils.clamp(0, 1, fraction / fadeOutRange));

            /!* Smooth fade in *!/

            const fadeIn = fadeEase(gsap.utils.clamp(0, 1, (fraction - fadeInStart) / (1 - fadeInStart)));

            stepSetters.forEach((card, index) => {

                let opacity = 0;

                if (index === currentIndex) {
                    opacity = fadeOut;
                }

                if (index === nextIndex) {
                    opacity = fadeIn;
                }

                /!* Update opacity *!/

                if (card.lastOpacity !== opacity) {

                    card.setOpacity(opacity);

                    card.lastOpacity = opacity;

                }

                /!* Update visibility *!/

                const visibility = opacity > 0 ? 'visible' : 'hidden';

                if (card.lastVisibility !== visibility) {

                    card.element.style.visibility = visibility;

                    card.lastVisibility = visibility;

                }

                /!* Update pointer events *!/

                const pointerEvents = opacity > 0.99 ? 'auto' : 'none';

                if (card.lastPointerEvents !== pointerEvents) {

                    card.element.style.pointerEvents = pointerEvents;

                    card.lastPointerEvents = pointerEvents;

                }

            });

        }

        /!* ========================================
           UPDATE SCROLLBAR
        ======================================== *!/

        function updateScrollbar() {

            if (!scrollbar || !setScrollbarHeight) return;

            const progress = gsap.utils.clamp(0, 1, scrollbarProgress);

            const fill = scrollbarMinFill + (scrollbarMaxFill - scrollbarMinFill) * progress;

            setScrollbarHeight(fill);

        }

        /!* ========================================
           UPDATE ANIMATION
        ======================================== *!/

        function updateAnimation() {

            updateWheel();

            updateSteps();

            updateScrollbar();

        }

        updateAnimation();

        /!* ========================================
           SET EXACT STEP
        ======================================== *!/

        function setExactStep(step) {

            currentStep = gsap.utils.clamp(0, totalSteps, step);

            state.rotation = -currentStep * 90;

            scrollbarProgress = currentStep / totalSteps;

            updateAnimation();

        }

        /!* ========================================
           ANIMATION RESET
        ======================================== *!/

        function resetAnimation() {

            if (rotationTween) {

                rotationTween.kill();

                rotationTween = null;

            }

            isAnimating = false;

            lastScrollTime = -Infinity;
            lastScrollDirection = 0;

            animationDirection = 0;
            pendingReverseDirection = 0;

            touchPendingDirection = 0;
            touchDistance = 0;

        }

        /!* ========================================
           REMOVE PIN
        ======================================== *!/

        function removePin() {

            if (!pinTrigger) return;

            const trigger = pinTrigger;

            pinTrigger = null;

            trigger.kill(true);

        }

        /!* ========================================
           GET REAL CAPTURE POSITION
        ======================================== *!/

        function getCapturePosition() {

            const rect = section.getBoundingClientRect();

            return (window.scrollY + rect.bottom - getViewportBottom());

        }

        /!* ========================================
           SYNC PIN POSITION
        ======================================== *!/

        function syncPinPosition() {

            if (!pinTrigger || !isCaptured || isReleasing || isRefreshing) return;

            const target = pinTrigger.start + 1;

            if (Math.abs(pinTrigger.scroll() - target) > 1) {

                pinTrigger.scroll(target);

            }

        }

        /!* ========================================
           VISUAL VIEWPORT CHANGE — MOBILE ONLY
        ======================================== *!/

        function handleViewportResize() {

            if (!isTouchDevice || !window.visualViewport) return;

            /!* Ignore pinch zoom *!/

            if (Math.abs(window.visualViewport.scale - 1) > 0.01) return;

            clearTimeout(viewportRefreshTimer);

            viewportRefreshTimer = setTimeout(() => {

                const viewportBottom = getViewportBottom();

                if (Math.abs(viewportBottom - lastViewportBottom) < 2) return;

                /!* Never refresh during capture or release *!/

                if (isCapturing || isReleasing || isRefreshing || ScrollTrigger.isRefreshing || normalizer?.isPressed) {

                    handleViewportResize();

                    return;

                }

                lastViewportBottom = viewportBottom;

                /!* Refresh Journey positions *!/

                ScrollTrigger.refresh();

                /!* Restore correct mobile pin position *!/

                if (isCaptured && pinTrigger) {

                    syncPinPosition();

                    ScrollTrigger.update();

                }

            }, viewportRefreshDelay);

        }

        /!* ========================================
           RELEASE SCROLL
        ======================================== *!/

        function releaseScroll(direction) {

            if (!isCaptured || isReleasing || isCapturing) return;

            /!* Block capture callbacks *!/

            isReleasing = true;
            isCaptured = false;
            canCapture = false;

            scrollObserver?.disable();

            /!* Prevent repeated release from same gesture *!/

            touchReleaseGesture = !!normalizer?.isPressed;

            resetAnimation();

            /!* Keep current completed card *!/

            setExactStep(currentStep);

            /!* Remove pin and spacing *!/

            removePin();

            /!* Refresh layout *!/

            ScrollTrigger.refresh();

            /!* Restore actual document position *!/

            const actualCapturePosition = getCapturePosition();

            const targetPosition = actualCapturePosition + (direction > 0 ? releaseOffset : -releaseOffset);

            window.scrollTo({

                top: Math.max(0, targetPosition),

                behavior: 'instant'

            });

            previousScrollPosition = window.scrollY;

            ScrollTrigger.update();

            /!* Wait for layout stabilization *!/

            requestAnimationFrame(() => {

                requestAnimationFrame(() => {

                    previousScrollPosition = window.scrollY;

                    isReleasing = false;

                });

            });

        }

        /!* ========================================
           CHECK SCROLL ACTIVITY
        ======================================== *!/

        function isScrollActive() {

            return (performance.now() - lastScrollTime) < scrollActivityWindow;

        }

        /!* ========================================
           GO TO STEP — BOTH DIRECTIONS
        ======================================== *!/

        function goToStep(direction) {

            if (!isCaptured || isReleasing || isCapturing || isAnimating || !direction) return;

            /!* Release upward from first card *!/

            if (direction < 0 && currentStep <= 0) {

                releaseScroll(-1);

                return;

            }

            /!* Release downward after full rotation *!/

            if (direction > 0 && currentStep >= totalSteps) {

                releaseScroll(1);

                return;

            }

            /!* Calculate adjacent card *!/

            const nextStep = gsap.utils.clamp(0, totalSteps, currentStep + direction);

            const startScrollbarProgress = scrollbarProgress;

            const targetScrollbarProgress = nextStep / totalSteps;

            isAnimating = true;

            animationDirection = direction;

            pendingReverseDirection = 0;

            /!* Rotate exactly 90 degrees *!/

            rotationTween = gsap.to(state, {

                rotation: -nextStep * 90,

                duration: rotationDuration,

                ease: rotationEase,

                overwrite: true,

                onUpdate: function () {

                    scrollbarProgress = gsap.utils.interpolate(startScrollbarProgress,

                        targetScrollbarProgress,

                        this.ratio);

                    updateAnimation();

                },

                onComplete: () => {

                    rotationTween = null;

                    setExactStep(nextStep);

                    isAnimating = false;

                    animationDirection = 0;

                    if (!isCaptured || isReleasing) return;

                    /!* Process pending mobile direction *!/

                    if (touchPendingDirection) {

                        const direction = touchPendingDirection;

                        touchPendingDirection = 0;

                        if (direction < 0 && currentStep <= 0) return;

                        if (direction > 0 && currentStep >= totalSteps) return;

                        goToStep(direction);

                        return;

                    }

                    /!* Respect desktop direction change *!/

                    if (pendingReverseDirection) {

                        const reverseDirection = pendingReverseDirection;

                        pendingReverseDirection = 0;

                        goToStep(reverseDirection);

                        return;

                    }

                    /!* Stop when scrolling is inactive *!/

                    if (!isScrollActive()) return;

                    const direction = lastScrollDirection;

                    /!* Keep boundary cards visible *!/

                    if (direction < 0 && currentStep <= 0) return;

                    if (direction > 0 && currentStep >= totalSteps) return;

                    /!* Continue sequential rotation *!/

                    goToStep(direction);

                }

            });

        }

        /!* ========================================
           HANDLE DESKTOP SCROLL
        ======================================== *!/

        function handleScroll(direction) {

            if (!isCaptured || isReleasing || isCapturing || !direction) return;

            lastScrollTime = performance.now();

            lastScrollDirection = direction;

            if (isAnimating) {

                pendingReverseDirection = direction !== animationDirection ? direction : 0;

                return;

            }

            goToStep(direction);

        }

        /!* ========================================
           DESKTOP SCROLL OBSERVER
        ======================================== *!/

        scrollObserver = ScrollTrigger.observe({

            target: window,

            type: 'wheel',

            preventDefault: true,

            allowClicks: true,

            tolerance: wheelThreshold,

            wheelSpeed: -1,

            lockAxis: true,

            onUp: () => {

                handleScroll(1);

            },

            onDown: () => {

                handleScroll(-1);

            }

        });

        scrollObserver.disable();

        /!* ========================================
           REQUEST MOBILE STEP
        ======================================== *!/

        function requestTouchStep(direction) {

            if (!isCaptured || isCapturing || isReleasing || touchReleaseGesture) return;

            lastScrollTime = -Infinity;

            lastScrollDirection = direction;

            pendingReverseDirection = 0;

            /!* Keep only one pending transition *!/

            if (isAnimating) {

                touchPendingDirection = direction;

                return;

            }

            goToStep(direction);

        }

        /!* ========================================
           MOBILE NORMALIZED SCROLL
        ======================================== *!/

        function initMobileNormalizer() {

            if (!isTouchDevice) return;

            if (typeof ScrollTrigger.normalizeScroll !== 'function') {

                console.warn('Journey: normalizeScroll is unavailable');

                return;

            }

            /!* Avoid two active normalizers *!/

            const existingNormalizer = ScrollTrigger.normalizeScroll();

            if (existingNormalizer) {

                console.warn('Journey: another scroll normalizer is active');

                return;

            }

            normalizer = ScrollTrigger.normalizeScroll({

                type: 'touch',

                allowNestedScroll: true,

                lockAxis: false,

                debounce: false,

                tolerance: 1,

                allowClicks: true,

                /!* Controlled momentum outside Journey *!/

                momentum: self => {

                    if (isCaptured || isCapturing || isReleasing || touchReleaseGesture) return 0;

                    return Math.min(0.8,

                        Math.abs(self.velocityY) / 2500);

                },

                /!* Process vertical touch movement *!/

                onChangeY: self => {

                    if (isReleasing || isRefreshing || isCapturing || touchReleaseGesture) return;

                    if (!self.isPressed) return;

                    const dy = -self.deltaY;

                    if (!dy) return;

                    /!*
                     * Capture even when a fast swipe
                     * crosses the entire entry range.
                     *!/

                    if (!isCaptured && canCapture && entryTrigger && dy > 0) {

                        const scrollPosition = entryTrigger.scroll();

                        if (scrollPosition >= entryTrigger.start && previousScrollPosition < entryTrigger.start) {

                            captureScroll({
                                direction: 1
                            });

                        }

                    }

                    /!* Normal scrolling outside Journey *!/

                    if (!isCaptured || !pinTrigger) return;

                    /!* Synchronize only on input *!/

                    syncPinPosition();

                    /!* Reset accumulated movement on reversal *!/

                    if (touchDistance && Math.sign(touchDistance) !== Math.sign(dy)) {

                        touchDistance = 0;

                    }

                    touchDistance += dy;

                    /!* Start adjacent card *!/

                    if (Math.abs(touchDistance) >= touchThreshold) {

                        const direction = Math.sign(touchDistance);

                        touchDistance = 0;

                        requestTouchStep(direction);

                    }

                }

            });

            /!* Passive gesture state listeners *!/

            window.addEventListener('touchstart', () => {

                touchDistance = 0;

                touchReleaseGesture = false;

            }, {
                passive: true, capture: true
            });

            window.addEventListener('touchend', () => {

                touchDistance = 0;

            }, {
                passive: true
            });

            window.addEventListener('touchcancel', () => {

                touchDistance = 0;

            }, {
                passive: true
            });

        }

        /!* ========================================
           CAPTURE SCROLL — FORWARD ENTRY ONLY
        ======================================== *!/

        function captureScroll(self) {

            if (isCaptured || isCapturing || isReleasing || isRefreshing || ScrollTrigger.isRefreshing || !canCapture || self.direction !== 1) return;

            /!* Prevent trapping mobile users *!/

            if (isTouchDevice && !normalizer) return;

            /!* Block repeated capture *!/

            isCapturing = true;

            isCaptured = true;

            canCapture = false;

            touchReleaseGesture = false;

            resetAnimation();

            scrollbarProgress = 0;

            /!* Start from first card *!/

            setExactStep(0);

            /!* Remove previous pin *!/

            removePin();

            /!* Create pin using actual viewport *!/

            pinTrigger = ScrollTrigger.create({

                id: 'journey-section-pin',

                trigger: section,

                start: getJourneyStart,

                end: () => '+=' + window.innerHeight * scrollScreens,

                pin: section,

                pinSpacing: true,

                anticipatePin: 0,

                invalidateOnRefresh: true,

                markers: false,

                onRefresh: () => {

                    updateScrollbar();

                }

            });

            /!* Set current pin position *!/

            pinTrigger.scroll(pinTrigger.start + 1);

            previousScrollPosition = window.scrollY;

            /!* Enable mouse wheel *!/

            scrollObserver.enable();

            isCapturing = false;

        }

        /!* ========================================
           SECTION ENTRY TRIGGER
        ======================================== *!/

        entryTrigger = ScrollTrigger.create({

            id: 'journey-section-entry',

            trigger: section,

            start: getJourneyStart,

            end: 'bottom top',

            invalidateOnRefresh: true,

            markers: false,

            onEnter: self => {

                if (isReleasing || isCapturing || isCaptured || isRefreshing || ScrollTrigger.isRefreshing || !canCapture) return;

                if (isTouchDevice && !normalizer) return;

                captureScroll(self);

            }

        });

        /!* ========================================
           SCROLL PROTECTION + REARM CAPTURE
        ======================================== *!/

        window.addEventListener('scroll', () => {

            const currentScrollPosition = window.scrollY;

            const oldScrollPosition = previousScrollPosition;

            const isScrollingUp = currentScrollPosition < oldScrollPosition;

            previousScrollPosition = currentScrollPosition;

            /!* Ignore internal layout changes *!/

            if (isCapturing || isReleasing || isRefreshing || ScrollTrigger.isRefreshing || !entryTrigger) return;

            /!* Protect against residual momentum *!/

            if (isCaptured) {

                if (isTouchDevice && normalizer) {

                    syncPinPosition();

                    previousScrollPosition = window.scrollY;

                }

                return;

            }

            /!* Fallback for fast mobile scrolling *!/

            if (isTouchDevice && normalizer && canCapture && !isScrollingUp && oldScrollPosition < entryTrigger.start && currentScrollPosition >= entryTrigger.start) {

                captureScroll({
                    direction: 1
                });

                return;

            }

            /!* Already armed *!/

            if (canCapture) return;

            /!* Only upward movement can rearm *!/

            if (!isScrollingUp) return;

            /!* Require sufficient distance above section *!/

            if (currentScrollPosition <= entryTrigger.start - rearmDistance) {

                canCapture = true;

            }

        }, {

            passive: true

        });

        /!* ========================================
           KEYBOARD SUPPORT
        ======================================== *!/

        window.addEventListener('keydown', event => {

            if (!isCaptured) return;

            if (

                event.target.closest?.('input, textarea, select, button, a, [contenteditable="true"]')

            ) return;

            const downKeys = ['ArrowDown', 'PageDown'];

            const upKeys = ['ArrowUp', 'PageUp'];

            let direction = 0;

            if (downKeys.includes(event.key)) {

                direction = 1;

            }

            if (upKeys.includes(event.key)) {

                direction = -1;

            }

            if (event.code === 'Space') {

                direction = event.shiftKey ? -1 : 1;

            }

            if (!direction) return;

            event.preventDefault();

            if (event.repeat) return;

            handleScroll(direction);

        });

        /!* ========================================
           INITIALIZE MOBILE NORMALIZER
        ======================================== *!/

        initMobileNormalizer();

        /!* ========================================
           VISUAL VIEWPORT LISTENERS
        ======================================== *!/

        if (isTouchDevice && window.visualViewport) {

            window.visualViewport.addEventListener('resize',

                handleViewportResize,

                {
                    passive: true
                });

            window.visualViewport.addEventListener('scroll',

                handleViewportResize,

                {
                    passive: true
                });

        }

        /!* ========================================
           SAFE INITIAL REFRESH
        ======================================== *!/

        function safeInitialRefresh() {

            if (isCaptured || isCapturing || isReleasing || isRefreshing || ScrollTrigger.isRefreshing) return;

            ScrollTrigger.refresh();

        }

        if (document.readyState === 'complete') {

            safeInitialRefresh();

        } else {

            window.addEventListener('load', safeInitialRefresh, {

                once: true

            });

        }

    });*/

    /*document.addEventListener('DOMContentLoaded', () => {

        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        if (typeof ScrollTrigger.observe !== 'function') {
            console.warn('Journey: ScrollTrigger.observe is unavailable');
            return;
        }

        /!* ======================================== 
           ELEMENTS
        ======================================== *!/

        const section = document.querySelector('.journey-section');
        const wrapper = section?.querySelector('.number-cards-wrapper');
        const wheel = wrapper?.querySelector('.journey-wheel-svg');
        const rotating = wheel?.querySelector('.journey-wheel-rotating');
        const labels = wheel?.querySelector('.journey-wheel-labels');

        const steps = [wrapper?.querySelector('.journey-step-01'), wrapper?.querySelector('.journey-step-02'), wrapper?.querySelector('.journey-step-03'), wrapper?.querySelector('.journey-step-04')];

        const scrollbar = section?.querySelector('.journey-scrollbar');

        const scrollbarThumb = scrollbar?.querySelector('.journey-scrollbar-thumb');

        if (!section || !wrapper || !wheel || !rotating || !labels || steps.some(step => !step)) return;

        if (section.dataset.journeyInitialized === 'true') return;

        section.dataset.journeyInitialized = 'true';

        /!* ========================================
           SETTINGS
        ======================================== *!/

        const desktopVisibleRatio = 480 / 1321;
        const mobileVisibleRatio = 0.5;

        const desktopBreakpoint = 1440;
        const mobileBreakpoint = 767;

        const scrollScreens = 3;
        const rotationDuration = 1.2;

        const wheelThreshold = 15;
        const touchThreshold = 12;

        const isTouchDevice = ScrollTrigger.isTouch === 1 || (navigator.maxTouchPoints > 0 && window.matchMedia('(pointer: coarse)').matches);

        const scrollActivityWindow = 200;

        const rotationEase = 'power2.inOut';

        const fadeOutRange = 0.65;
        const fadeInStart = 0.35;

        const totalSteps = 4;

        const scrollbarMinFill = 0;
        const scrollbarMaxFill = 100;

        const rearmDistance = 80;
        const releaseOffset = 4;

        const SVG_NS = 'http://www.w3.org/2000/svg';

        const CENTER = '661 661';

        const fadeEase = gsap.parseEase('sine.inOut');

        /!* ========================================
           INITIAL STATE
        ======================================== *!/

        const state = {
            rotation: 0
        };

        let currentStep = 0;
        let isAnimating = false;

        let lastScrollTime = -Infinity;
        let lastScrollDirection = 0;

        let animationDirection = 0;
        let pendingReverseDirection = 0;

        let isCaptured = false;
        let isCapturing = false;
        let isReleasing = false;
        let isRefreshing = false;

        let canCapture = true;

        let rotationTween = null;

        let pinTrigger = null;
        let entryTrigger = null;
        let scrollObserver = null;

        let scrollbarProgress = 0;

        let previousScrollPosition = window.scrollY;
        let lastWheelHeight = -1;

        /!* Mobile state *!/

        let normalizer = null;

        let touchDistance = 0;
        let touchPendingDirection = 0;
        let touchReleaseGesture = false;

        /!* One transition per touch gesture *!/

        let touchGestureConsumed = false;

        /!* Mobile input state *!/

        let multiTouchGesture = false;

        let previousRootOverflowY = null;

        const initialViewportBottom = window.innerHeight;

        let viewportSizeProbe = null;

        let settledViewportBottom = getStableViewportBottom();

        /!* ========================================
           STABLE VIEWPORT SIZE — MOBILE
        ======================================== *!/

        function getStableViewportBottom() {

            if (!isTouchDevice) return window.innerHeight;

            if (!window.CSS || !window.CSS.supports || !window.CSS.supports('height', '100svh')) {

                return initialViewportBottom;

            }

            if (!viewportSizeProbe) {

                viewportSizeProbe = document.createElement('div');

                viewportSizeProbe.setAttribute('aria-hidden', 'true');

                viewportSizeProbe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none;contain:strict;';

                document.documentElement.appendChild(viewportSizeProbe);

            }

            const viewportHeight = viewportSizeProbe.getBoundingClientRect().height;

            return viewportHeight > 0 ? viewportHeight : initialViewportBottom;

        }

        function getViewportBottom() {

            return isTouchDevice ? settledViewportBottom : window.innerHeight;

        }

        function getJourneyStart() {

            /!* Preserve original desktop behavior *!/

            if (!isTouchDevice) {

                return 'bottom bottom';

            }

            /!* Use the small viewport on mobile *!/

            return `bottom ${getViewportBottom()}px`;

        }

        /!* ========================================
           RESPONSIVE WHEEL LAYOUT
        ======================================== *!/

        function updateLayout() {

            const wheelHeight = wheel.getBoundingClientRect().height;

            if (wheelHeight <= 0) return;

            const viewportWidth = window.innerWidth;

            const progress = gsap.utils.clamp(0, 1, (viewportWidth - mobileBreakpoint) / (desktopBreakpoint - mobileBreakpoint));

            const visibleRatio = gsap.utils.interpolate(mobileVisibleRatio, desktopVisibleRatio, progress);

            const visibleHeight = wheelHeight * visibleRatio;
            const hiddenHeight = wheelHeight - visibleHeight;

            if (Math.abs(hiddenHeight - lastWheelHeight) < 0.5) return;

            lastWheelHeight = hiddenHeight;

            gsap.set(wrapper, {
                marginBottom: -hiddenHeight
            });

        }

        updateLayout();

        /!* ========================================
           SCROLLTRIGGER REFRESH PROTECTION
        ======================================== *!/

        ScrollTrigger.addEventListener('refreshInit', () => {

            isRefreshing = true;

            if (isTouchDevice) settledViewportBottom = getStableViewportBottom();

            updateLayout();

        });

        ScrollTrigger.addEventListener('refresh', () => {

            previousScrollPosition = window.scrollY;

            isRefreshing = false;

            if (isTouchDevice && isCaptured && pinTrigger && !isCapturing && !isReleasing) {

                syncPinPosition();

            }

        });

        /!* ========================================
           PREPARE SVG LABELS
        ======================================== *!/

        if (labels.parentNode !== wheel) {

            wheel.appendChild(labels);

        }

        const numbers = [...labels.querySelectorAll('text')];

        const numberWrappers = numbers.map(number => {

            let group = number.parentNode;

            if (!group.classList.contains('journey-number-wrapper')) {

                group = document.createElementNS(SVG_NS, 'g');

                group.classList.add('journey-number-wrapper');

                number.parentNode.insertBefore(group, number);

                group.appendChild(number);

            }

            const x = Number(number.getAttribute('x'));
            const y = Number(number.getAttribute('y'));

            const transform = number.getAttribute('transform') || '';

            const rotationMatch = transform.match(/rotate\(\s*(-?[\d.]+)/);

            const originalRotation = rotationMatch ? Number(rotationMatch[1]) : 0;

            gsap.set(group, {

                rotation: 0,

                svgOrigin: `${x} ${y}`,

                smoothOrigin: false

            });

            return {

                element: group,

                x,

                y,

                originalRotation,

                lastCorrection: 0,

                setRotation: gsap.quickSetter(group, 'rotation', 'deg')

            };

        });

        /!* ========================================
           PREPARE WHEEL TRANSFORMS
        ======================================== *!/

        gsap.set(rotating, {

            rotation: 0,

            svgOrigin: CENTER

        });

        gsap.set(labels, {

            rotation: 0,

            svgOrigin: CENTER

        });

        const setWheelRotation = gsap.quickSetter(rotating, 'rotation', 'deg');

        const setLabelsRotation = gsap.quickSetter(labels, 'rotation', 'deg');

        /!* ========================================
           PREPARE CARD SETTERS
        ======================================== *!/

        const stepSetters = steps.map(step => {

            return {

                element: step,

                setOpacity: gsap.quickSetter(step, 'opacity'),

                lastOpacity: null,

                lastVisibility: null,

                lastPointerEvents: null

            };

        });

        /!* ========================================
           PREPARE SCROLLBAR
        ======================================== *!/

        const setScrollbarHeight = scrollbarThumb ? gsap.quickSetter(scrollbarThumb, 'height', '%') : null;

        if (scrollbarThumb) {

            gsap.set(scrollbarThumb, {
                y: 0
            });

        }

        /!* ========================================
           CYCLIC HELPERS
        ======================================== *!/

        function wrapStep(step) {

            return ((step % totalSteps) + totalSteps) % totalSteps;

        }

        /!* ========================================
           UPDATE WHEEL
        ======================================== *!/

        function updateWheel() {

            const rotation = state.rotation;

            setWheelRotation(rotation);

            setLabelsRotation(rotation);

            /!* Keep SVG labels readable *!/

            numberWrappers.forEach(number => {

                const absoluteRotation = number.originalRotation + rotation;

                const normalizedRotation = ((absoluteRotation + 180) % 360 + 360) % 360 - 180;

                const correction = normalizedRotation > 90 || normalizedRotation < -90 ? 180 : 0;

                if (number.lastCorrection !== correction) {

                    number.setRotation(correction);

                    number.lastCorrection = correction;

                }

            });

        }

        /!* ========================================
           UPDATE STEPS
        ======================================== *!/

        function updateSteps() {

            const progress = gsap.utils.clamp(0, totalSteps, -state.rotation / 90);

            const step = Math.floor(progress);
            const fraction = progress - step;

            const currentIndex = wrapStep(step);
            const nextIndex = wrapStep(step + 1);

            /!* Smooth fade out *!/

            const fadeOut = 1 - fadeEase(gsap.utils.clamp(0, 1, fraction / fadeOutRange));

            /!* Smooth fade in *!/

            const fadeIn = fadeEase(gsap.utils.clamp(0, 1, (fraction - fadeInStart) / (1 - fadeInStart)));

            stepSetters.forEach((card, index) => {

                let opacity = 0;

                if (index === currentIndex) {
                    opacity = fadeOut;
                }

                if (index === nextIndex) {
                    opacity = fadeIn;
                }

                /!* Update opacity *!/

                if (card.lastOpacity !== opacity) {

                    card.setOpacity(opacity);

                    card.lastOpacity = opacity;

                }

                /!* Update visibility *!/

                const visibility = opacity > 0 ? 'visible' : 'hidden';

                if (card.lastVisibility !== visibility) {

                    card.element.style.visibility = visibility;

                    card.lastVisibility = visibility;

                }

                /!* Update pointer events *!/

                const pointerEvents = opacity > 0.99 ? 'auto' : 'none';

                if (card.lastPointerEvents !== pointerEvents) {

                    card.element.style.pointerEvents = pointerEvents;

                    card.lastPointerEvents = pointerEvents;

                }

            });

        }

        /!* ========================================
           UPDATE SCROLLBAR
        ======================================== *!/

        function updateScrollbar() {

            if (!scrollbar || !setScrollbarHeight) return;

            const progress = gsap.utils.clamp(0, 1, scrollbarProgress);

            const fill = scrollbarMinFill + (scrollbarMaxFill - scrollbarMinFill) * progress;

            setScrollbarHeight(fill);

        }

        /!* ========================================
           UPDATE ANIMATION
        ======================================== *!/

        function updateAnimation() {

            updateWheel();

            updateSteps();

            updateScrollbar();

        }

        updateAnimation();

        /!* ========================================
           SET EXACT STEP
        ======================================== *!/

        function setExactStep(step) {

            currentStep = gsap.utils.clamp(0, totalSteps, step);

            state.rotation = -currentStep * 90;

            scrollbarProgress = currentStep / totalSteps;

            updateAnimation();

        }

        /!* ========================================
           ANIMATION RESET
        ======================================== *!/

        function resetAnimation() {

            if (rotationTween) {

                rotationTween.kill();

                rotationTween = null;

            }

            isAnimating = false;

            lastScrollTime = -Infinity;
            lastScrollDirection = 0;

            animationDirection = 0;
            pendingReverseDirection = 0;

            touchPendingDirection = 0;
            touchDistance = 0;

        }

        /!* ========================================
           REMOVE PIN
        ======================================== *!/

        function removePin() {

            if (!pinTrigger) return;

            const trigger = pinTrigger;

            pinTrigger = null;

            trigger.kill(true);

        }

        /!* ========================================
           GET REAL CAPTURE POSITION
        ======================================== *!/

        function getCapturePosition() {

            const rect = section.getBoundingClientRect();

            return (window.scrollY + rect.bottom - getViewportBottom());

        }

        /!* ========================================
           SYNC PIN POSITION
        ======================================== *!/

        function syncPinPosition() {

            if (!pinTrigger || !isCaptured || isReleasing || isRefreshing) return;

            const target = pinTrigger.start + 1;

            if (Math.abs(pinTrigger.scroll() - target) > 1) {

                pinTrigger.scroll(target);

            }

        }

        /!* ========================================
           RELEASE SCROLL
        ======================================== *!/

        function releaseScroll(direction) {

            if (!isCaptured || isReleasing || isCapturing) return;

            /!* Block capture callbacks *!/

            isReleasing = true;
            isCaptured = false;
            canCapture = false;

            scrollObserver?.disable();

            /!* Prevent repeated release from same gesture *!/

            touchReleaseGesture = !!normalizer?.isPressed;

            removeMobileNormalizer();

            resetAnimation();

            /!* Keep current completed card *!/

            setExactStep(currentStep);

            /!* Remove pin and spacing *!/

            removePin();

            /!* Restore native page scrolling *!/

            if (previousRootOverflowY) {

                const rootStyle = document.documentElement.style;

                if (previousRootOverflowY.value) {

                    rootStyle.setProperty('overflow-y', previousRootOverflowY.value, previousRootOverflowY.priority);

                } else {

                    rootStyle.removeProperty('overflow-y');

                }

                previousRootOverflowY = null;

            }

            /!* Refresh layout *!/

            ScrollTrigger.refresh();

            /!* Restore actual document position *!/

            const actualCapturePosition = getCapturePosition();

            const targetPosition = actualCapturePosition + (direction > 0 ? releaseOffset : -releaseOffset);

            window.scrollTo({

                top: Math.max(0, targetPosition),

                behavior: 'instant'

            });

            previousScrollPosition = window.scrollY;

            ScrollTrigger.update();

            /!* Wait for layout stabilization *!/

            requestAnimationFrame(() => {

                requestAnimationFrame(() => {

                    previousScrollPosition = window.scrollY;

                    isReleasing = false;

                });

            });

        }

        /!* ========================================
           CHECK SCROLL ACTIVITY
        ======================================== *!/

        function isScrollActive() {

            return (performance.now() - lastScrollTime) < scrollActivityWindow;

        }

        /!* ========================================
           GO TO STEP — BOTH DIRECTIONS
        ======================================== *!/

        function goToStep(direction) {

            if (!isCaptured || isReleasing || isCapturing || isAnimating || !direction) return;

            /!* Release upward from first card *!/

            if (direction < 0 && currentStep <= 0) {

                releaseScroll(-1);

                return;

            }

            /!* Release downward after full rotation *!/

            if (direction > 0 && currentStep >= totalSteps) {

                releaseScroll(1);

                return;

            }

            /!* Calculate adjacent card *!/

            const nextStep = gsap.utils.clamp(0, totalSteps, currentStep + direction);

            const startScrollbarProgress = scrollbarProgress;

            const targetScrollbarProgress = nextStep / totalSteps;

            isAnimating = true;

            animationDirection = direction;

            pendingReverseDirection = 0;

            /!* Rotate exactly 90 degrees *!/

            rotationTween = gsap.to(state, {

                rotation: -nextStep * 90,

                duration: rotationDuration,

                ease: rotationEase,

                overwrite: true,

                onUpdate: function () {

                    scrollbarProgress = gsap.utils.interpolate(startScrollbarProgress,

                        targetScrollbarProgress,

                        this.ratio);

                    updateAnimation();

                },

                onComplete: () => {

                    rotationTween = null;

                    setExactStep(nextStep);

                    isAnimating = false;

                    animationDirection = 0;

                    if (!isCaptured || isReleasing) return;

                    /!* Process pending separate mobile gesture *!/

                    if (touchPendingDirection) {

                        const direction = touchPendingDirection;

                        touchPendingDirection = 0;

                        if (direction < 0 && currentStep <= 0) return;

                        if (direction > 0 && currentStep >= totalSteps) return;

                        goToStep(direction);

                        return;

                    }

                    /!* Respect desktop direction change *!/

                    if (pendingReverseDirection) {

                        const reverseDirection = pendingReverseDirection;

                        pendingReverseDirection = 0;

                        goToStep(reverseDirection);

                        return;

                    }

                    /!* Stop when scrolling is inactive *!/

                    if (!isScrollActive()) return;

                    const direction = lastScrollDirection;

                    /!* Keep boundary cards visible *!/

                    if (direction < 0 && currentStep <= 0) return;

                    if (direction > 0 && currentStep >= totalSteps) return;

                    /!* Continue sequential rotation *!/

                    goToStep(direction);

                }

            });

        }

        /!* ========================================
           HANDLE DESKTOP SCROLL
        ======================================== *!/

        function handleScroll(direction) {

            if (!isCaptured || isReleasing || isCapturing || !direction) return;

            lastScrollTime = performance.now();

            lastScrollDirection = direction;

            if (isAnimating) {

                pendingReverseDirection = direction !== animationDirection ? direction : 0;

                return;

            }

            goToStep(direction);

        }

        /!* ========================================
           DESKTOP SCROLL OBSERVER
        ======================================== *!/

        scrollObserver = ScrollTrigger.observe({

            target: window,

            type: 'wheel',

            preventDefault: true,

            allowClicks: true,

            tolerance: wheelThreshold,

            wheelSpeed: -1,

            lockAxis: true,

            onUp: () => {

                handleScroll(1);

            },

            onDown: () => {

                handleScroll(-1);

            }

        });

        scrollObserver.disable();

        /!* ========================================
           REQUEST MOBILE STEP
           ONE GESTURE — ONE STEP
        ======================================== *!/

        function requestTouchStep(direction) {

            if (!isCaptured || isCapturing || isReleasing || touchReleaseGesture || touchGestureConsumed || !direction) return;

            /!* Consume current touch gesture *!/

            touchGestureConsumed = true;

            touchDistance = 0;

            /!* Disable automatic scroll continuation *!/

            lastScrollTime = -Infinity;

            lastScrollDirection = direction;

            pendingReverseDirection = 0;

            /!*
             * Only a separate new gesture can
             * request another transition.
             *!/

            if (isAnimating) {

                touchPendingDirection = direction;

                return;

            }

            goToStep(direction);

        }

        /!* ========================================
           MOBILE NORMALIZED SCROLL
        ======================================== *!/

        function initMobileTouchState() {

            if (!isTouchDevice) return;

            ScrollTrigger.config({

                ignoreMobileResize: true

            });

            window.addEventListener('touchstart', event => {

                /!* Ignore multi-touch gestures *!/

                if (event.touches.length !== 1) {

                    multiTouchGesture = true;

                    touchGestureConsumed = true;

                    touchDistance = 0;

                    return;

                }

                /!* Start a new independent gesture *!/

                multiTouchGesture = false;

                touchDistance = 0;

                touchReleaseGesture = false;

                touchGestureConsumed = false;

            }, {

                passive: true,

                capture: true

            });

            /!* Finish current touch gesture *!/

            window.addEventListener('touchend', event => {

                if (event.touches.length === 0) multiTouchGesture = false;

                touchDistance = 0;

                touchGestureConsumed = true;

            }, {

                passive: true,

                capture: true

            });

            /!* Cancel interrupted gestures *!/

            window.addEventListener('touchcancel', event => {

                if (event.touches.length === 0) multiTouchGesture = false;

                touchDistance = 0;

                touchGestureConsumed = true;

            }, {

                passive: true,

                capture: true

            });

        }

        function initMobileNormalizer() {

            if (!isTouchDevice || normalizer) return;

            if (typeof ScrollTrigger.normalizeScroll !== 'function') {

                console.warn('Journey: normalizeScroll is unavailable');

                return;

            }

            /!* Avoid two active normalizers *!/

            const existingNormalizer = ScrollTrigger.normalizeScroll();

            if (existingNormalizer) {

                console.warn('Journey: another scroll normalizer is active');

                return;

            }

            normalizer = ScrollTrigger.normalizeScroll({

                type: 'touch',

                allowNestedScroll: true,

                lockAxis: false,

                debounce: false,

                tolerance: 1,

                allowClicks: true,

                /!* Disable simulated momentum while Journey owns touch input *!/

                momentum: () => 0,

                /!* Process vertical touch movement *!/

                onChangeY: self => {

                    if (isReleasing || isRefreshing || isCapturing || touchReleaseGesture) return;

                    if (!self.isPressed) return;

                    const dy = -self.deltaY;

                    if (!dy) return;

                    /!* Process captured Journey scrolling *!/

                    if (!isCaptured || !pinTrigger) return;

                    /!* Keep correct pin position *!/

                    syncPinPosition();

                    /!*
                     * Ignore remaining movement
                     * of an already consumed gesture.
                     *!/

                    if (touchGestureConsumed) return;

                    /!* Reset accumulated movement on reversal *!/

                    if (touchDistance && Math.sign(touchDistance) !== Math.sign(dy)) {

                        touchDistance = 0;

                    }

                    touchDistance += dy;

                    /!* Start exactly one adjacent card *!/

                    if (Math.abs(touchDistance) >= touchThreshold) {

                        const direction = Math.sign(touchDistance);

                        touchDistance = 0;

                        requestTouchStep(direction);

                    }

                }

            });

        }

        function removeMobileNormalizer() {

            if (!normalizer) return;

            ScrollTrigger.normalizeScroll(false);

            normalizer = null;

        }

        const showJourneyMarkers = new URLSearchParams(window.location.search).has('journeyMarkers');

        /!* ========================================
           CAPTURE SCROLL — FORWARD ENTRY ONLY
        ======================================== *!/

        function captureScroll(self) {

            if (isCaptured || isCapturing || isReleasing || isRefreshing || ScrollTrigger.isRefreshing || !canCapture || self.direction !== 1) return;

            if (isTouchDevice && (multiTouchGesture || (window.visualViewport && Math.abs(window.visualViewport.scale - 1) > 0.01))) return;

            /!* Enable controlled touch input only while captured *!/

            if (isTouchDevice) {

                initMobileNormalizer();

                if (!normalizer) return;

                touchDistance = 0;

                touchGestureConsumed = true;

            }

            if (isTouchDevice) {

                const rootStyle = document.documentElement.style;

                previousRootOverflowY = {

                    value: rootStyle.getPropertyValue('overflow-y'),

                    priority: rootStyle.getPropertyPriority('overflow-y')

                };

                rootStyle.setProperty('overflow-y', 'hidden', 'important');

            }

            /!* Block repeated capture *!/

            isCapturing = true;

            isCaptured = true;

            canCapture = false;

            touchReleaseGesture = false;

            resetAnimation();

            scrollbarProgress = 0;

            /!* Start from first card *!/

            setExactStep(0);

            /!* Remove previous pin *!/

            removePin();

            /!* Create pin using actual viewport *!/

            pinTrigger = ScrollTrigger.create({

                id: 'journey-section-pin',

                trigger: section,

                start: getJourneyStart,

                end: () => '+=' + getViewportBottom() * scrollScreens,

                pin: section,

                pinSpacing: true,

                anticipatePin: 0,

                invalidateOnRefresh: true,

                markers: showJourneyMarkers ? { indent: 80 } : false,

                onRefresh: () => {

                    updateScrollbar();

                }

            });

            /!* Set current pin position *!/

            pinTrigger.scroll(pinTrigger.start + 1);

            previousScrollPosition = window.scrollY;

            /!* Enable mouse wheel *!/

            scrollObserver.enable();

            isCapturing = false;

        }

        /!* ========================================
           SECTION ENTRY TRIGGER
        ======================================== *!/

        entryTrigger = ScrollTrigger.create({

            id: 'journey-section-entry',

            trigger: section,

            start: getJourneyStart,

            end: 'bottom top',

            invalidateOnRefresh: true,

            markers: showJourneyMarkers,

            onEnter: self => {

                if (isReleasing || isCapturing || isCaptured || isRefreshing || ScrollTrigger.isRefreshing || !canCapture) return;

                if (isTouchDevice && self.direction !== 1) return;

                captureScroll(self);

            }

        });

        /!* ========================================
           SCROLL PROTECTION + REARM CAPTURE
        ======================================== *!/

        window.addEventListener('scroll', () => {

            const currentScrollPosition = window.scrollY;

            const oldScrollPosition = previousScrollPosition;

            const isScrollingUp = currentScrollPosition < oldScrollPosition;

            previousScrollPosition = currentScrollPosition;

            /!* Ignore internal layout changes *!/

            if (isCapturing || isReleasing || isRefreshing || ScrollTrigger.isRefreshing || !entryTrigger) return;

            /!* Protect against residual momentum *!/

            if (isCaptured) {

                if (isTouchDevice && normalizer) {

                    syncPinPosition();

                    previousScrollPosition = window.scrollY;

                }

                return;

            }

            /!* Fallback for fast mobile scrolling *!/

            if (isTouchDevice && canCapture && !isScrollingUp && oldScrollPosition < entryTrigger.start && currentScrollPosition >= entryTrigger.start) {

                captureScroll({

                    direction: 1

                });

                return;

            }

            /!* Already armed *!/

            if (canCapture) return;

            /!* Only upward movement can rearm *!/

            if (!isScrollingUp) return;

            /!* Require sufficient distance above section *!/

            if (currentScrollPosition <= entryTrigger.start - rearmDistance) {

                canCapture = true;

            }

        }, {

            passive: true

        });

        /!* ========================================
           KEYBOARD SUPPORT
        ======================================== *!/

        window.addEventListener('keydown', event => {

            if (!isCaptured) return;

            if (

                event.target.closest?.('input, textarea, select, button, a, [contenteditable="true"]')

            ) return;

            const downKeys = ['ArrowDown', 'PageDown'];

            const upKeys = ['ArrowUp', 'PageUp'];

            let direction = 0;

            if (downKeys.includes(event.key)) {

                direction = 1;

            }

            if (upKeys.includes(event.key)) {

                direction = -1;

            }

            if (event.code === 'Space') {

                direction = event.shiftKey ? -1 : 1;

            }

            if (!direction) return;

            event.preventDefault();

            if (event.repeat) return;

            handleScroll(direction);

        });

        /!* ========================================
           INITIALIZE MOBILE TOUCH STATE
        ======================================== *!/

        initMobileTouchState();

        /!* ========================================
           SAFE INITIAL REFRESH
        ======================================== *!/

        function safeInitialRefresh() {

            if (isCaptured || isCapturing || isReleasing || isRefreshing || ScrollTrigger.isRefreshing) return;

            ScrollTrigger.refresh();

        }

        if (document.readyState === 'complete') {

            safeInitialRefresh();

        } else {

            window.addEventListener('load', safeInitialRefresh, {

                once: true

            });

        }

    });*/

    /*document.addEventListener('DOMContentLoaded', () => {

        const isTouchDevice = navigator.maxTouchPoints > 0 && window.matchMedia('(pointer: coarse)').matches;

        if (!isTouchDevice) return;

        /!* SETTINGS *!/

        const refreshThreshold = 120;
        const topThreshold = 2;

        let startX = 0;
        let startY = 0;
        let pullDistance = 0;

        let isTracking = false;
        let isRefreshing = false;

        /!* ========================================
           CREATE REFRESH INDICATOR
        ======================================== *!/

        const indicator = document.createElement('div');

        indicator.className = 'mobile-refresh-indicator';

        indicator.setAttribute('aria-hidden', 'true');

        indicator.innerHTML = `
        <svg width="24" height="24"
             viewBox="0 0 24 24"
             fill="none">

            <path
                d="M20 7V12H15"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />

            <path
                d="M20 12A8 8 0 1 0 17.5 17.8"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
            />

        </svg>
    `;

        Object.assign(indicator.style, {

            position: 'fixed', top: '0', left: '50%',

            width: '42px', height: '42px',

            display: 'flex', alignItems: 'center', justifyContent: 'center',

            background: '#FFFFFF', color: '#333333',

            borderRadius: '50%',

            boxShadow: '0 3px 12px rgba(0,0,0,0.18)',

            transform: 'translate(-50%, -60px)',

            opacity: '0',

            pointerEvents: 'none',

            zIndex: '999999'

        });

        document.body.appendChild(indicator);

        const icon = indicator.querySelector('svg');

        /!* ========================================
           RESET INDICATOR
        ======================================== *!/

        function resetPull() {

            isTracking = false;
            pullDistance = 0;

            indicator.style.transition = 'transform 0.2s ease, opacity 0.2s ease';

            indicator.style.transform = 'translate(-50%, -60px)';

            indicator.style.opacity = '0';

        }

        /!* ========================================
           TOUCH START
        ======================================== *!/

        window.addEventListener('touchstart', event => {

            if (isRefreshing) return;

            resetPull();

            if (event.touches.length !== 1) return;

            if (window.scrollY > topThreshold) return;

            if (window.visualViewport && Math.abs(window.visualViewport.scale - 1) > 0.01) return;

            if (event.target.closest?.('input, textarea, select, button, a, ' + '[contenteditable="true"]')) return;

            const touch = event.touches[0];

            startX = touch.clientX;
            startY = touch.clientY;

            isTracking = true;

            indicator.style.transition = 'none';

        }, {
            passive: true, capture: true
        });

        /!* ========================================
           TOUCH MOVE
        ======================================== *!/

        window.addEventListener('touchmove', event => {

            if (!isTracking || isRefreshing) return;

            if (event.touches.length !== 1 || window.scrollY > topThreshold) {

                resetPull();

                return;

            }

            const touch = event.touches[0];

            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;

            /!* Ignore horizontal gestures *!/

            if (Math.abs(deltaX) > 12 && Math.abs(deltaX) > Math.abs(deltaY)) {

                resetPull();

                return;

            }

            /!* Ignore normal downward page scrolling *!/

            if (deltaY < -5) {

                resetPull();

                return;

            }

            if (deltaY <= 0) {

                pullDistance = 0;

                indicator.style.opacity = '0';

                return;

            }

            pullDistance = deltaY;

            const progress = Math.min(pullDistance / refreshThreshold, 1);

            const offset = Math.min(pullDistance * 0.6, 85);

            indicator.style.transform = `translate(-50%, ${offset - 25}px)`;

            indicator.style.opacity = String(progress);

            icon.style.transform = `rotate(${progress * 360}deg)`;

            indicator.style.background = progress >= 1 ? '#F0F0F0' : '#FFFFFF';

        }, {
            passive: true, capture: true
        });

        /!* ========================================
           TOUCH END
        ======================================== *!/

        window.addEventListener('touchend', event => {

            if (!isTracking || isRefreshing) return;

            if (event.touches.length > 0) {

                resetPull();

                return;

            }

            const shouldRefresh = pullDistance >= refreshThreshold && window.scrollY <= topThreshold;

            if (!shouldRefresh) {

                resetPull();

                return;

            }

            isRefreshing = true;
            isTracking = false;

            indicator.style.transition = 'transform 0.2s ease';

            indicator.style.transform = 'translate(-50%, 35px)';

            indicator.style.opacity = '1';

            icon.animate([{transform: 'rotate(0deg)'}, {transform: 'rotate(360deg)'}], {
                duration: 650, iterations: Infinity, easing: 'linear'
            });

            setTimeout(() => {

                window.location.reload();

            }, 300);

        }, {
            passive: true, capture: true
        });

        /!* ========================================
           CANCEL GESTURE
        ======================================== *!/

        window.addEventListener('touchcancel', () => {

            resetPull();

        }, {
            passive: true, capture: true
        });

        window.addEventListener('scroll', () => {

            if (isTracking && window.scrollY > topThreshold) {

                resetPull();

            }

        }, {
            passive: true
        });

    });*/

    document.addEventListener('DOMContentLoaded', () => {

        
        
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

        // gsap.registerPlugin(ScrollTrigger);

        if (typeof ScrollTrigger.observe !== 'function') {
            console.warn('Journey: ScrollTrigger.observe is unavailable');
            return;
        }

        /* ========================================
           ELEMENTS
        ======================================== */

        const section = document.querySelector('.journey-section');

        const wrapper = section?.querySelector('.number-cards-wrapper');

        const wheel = wrapper?.querySelector('.journey-wheel-svg');

        const rotating = wheel?.querySelector('.journey-wheel-rotating');

        const labels = wheel?.querySelector('.journey-wheel-labels');

        const steps = [wrapper?.querySelector('.journey-step-01'), wrapper?.querySelector('.journey-step-02'), wrapper?.querySelector('.journey-step-03'), wrapper?.querySelector('.journey-step-04')];

        const scrollbar = section?.querySelector('.journey-scrollbar');

        const scrollbarThumb = scrollbar?.querySelector('.journey-scrollbar-thumb');

        if (!section || !wrapper || !wheel || !rotating || !labels || steps.some(step => !step)) return;

        /* Prevent duplicate initialization */

        if (section.dataset.journeyInitialized === 'true') return;

        section.dataset.journeyInitialized = 'true';

        /* ========================================
           SETTINGS
        ======================================== */

        const desktopVisibleRatio = 480 / 1321;

        const mobileVisibleRatio = 0.5;

        const desktopBreakpoint = 1440;

        const mobileBreakpoint = 767;

        const scrollScreens = 3;

        const rotationDuration = 1.2;

        const wheelThreshold = 15;

        const scrollActivityWindow = 200;

        const rotationEase = 'power2.inOut';

        const fadeOutRange = 0.65;

        const fadeInStart = 0.35;

        const totalSteps = 4;

        const scrollbarMinFill = 0;

        const scrollbarMaxFill = 100;

        const rearmDistance = 80;

        const releaseOffset = 4;

        const SVG_NS = 'http://www.w3.org/2000/svg';

        const CENTER = '661 661';

        const fadeEase = gsap.parseEase('sine.inOut');

        /* ========================================
           INITIAL STATE
        ======================================== */

        const state = {
            rotation: 0
        };

        let currentStep = 0;

        let isAnimating = false;

        let lastScrollTime = -Infinity;

        let lastScrollDirection = 0;

        let animationDirection = 0;

        let pendingReverseDirection = 0;

        let isCaptured = false;

        let isCapturing = false;

        let isReleasing = false;

        let isRefreshing = false;

        let canCapture = true;

        let rotationTween = null;

        let pinTrigger = null;

        let entryTrigger = null;

        let scrollObserver = null;

        let touchObserver = null;

        const hasTouchInput = ScrollTrigger.isTouch > 0 || navigator.maxTouchPoints > 0 || ('ontouchstart' in window);

        let viewportRefreshFrame = null;

        let lastViewportMetrics = getViewportMetrics();

        let scrollbarProgress = 0;

        let previousScrollPosition = window.scrollY;

        let lastWheelHeight = -1;

        let touchLockScrollPosition = 0;

        let touchLockSettleTimer = null;

        const touchLockSettleDelay = 180;

        let isTouchScrollLocked = false;

        function getViewportMetrics() {

            const viewport = hasTouchInput && window.visualViewport && Math.abs(window.visualViewport.scale - 1) < 0.01
                ? window.visualViewport
                : null;

            const height = viewport ? viewport.height : window.innerHeight;

            const offsetTop = viewport ? viewport.offsetTop : 0;

            return {

                height,

                bottom: height + offsetTop,

                offsetTop

            };

        }

        function getViewportHeight() {

            return getViewportMetrics().height;

        }

        function getViewportBottom() {

            return getViewportMetrics().bottom;

        }

        function getJourneyStart() {

            return hasTouchInput ? `bottom ${getViewportBottom()}px` : 'bottom bottom';

        }

        /* ========================================
           RESPONSIVE WHEEL LAYOUT
        ======================================== */

        function updateLayout() {

            const wheelHeight = wheel.getBoundingClientRect().height;

            if (wheelHeight <= 0) return;

            const viewportWidth = window.innerWidth;

            const progress = gsap.utils.clamp(0, 1, (viewportWidth - mobileBreakpoint) / (desktopBreakpoint - mobileBreakpoint));

            const visibleRatio = gsap.utils.interpolate(mobileVisibleRatio, desktopVisibleRatio, progress);

            const visibleHeight = wheelHeight * visibleRatio;

            const hiddenHeight = wheelHeight - visibleHeight;

            /* Avoid unnecessary layout changes */

            if (Math.abs(hiddenHeight - lastWheelHeight) < 0.5) return;

            lastWheelHeight = hiddenHeight;

            gsap.set(wrapper, {
                marginBottom: -hiddenHeight
            });

        }

        updateLayout();

        /* ========================================
           SCROLLTRIGGER REFRESH PROTECTION
        ======================================== */

        ScrollTrigger.addEventListener('refreshInit', () => {

            isRefreshing = true;

            updateLayout();

        });

        ScrollTrigger.addEventListener('refresh', () => {

            /*
             * Synchronize scroll position after refresh,
             * so layout shifts are not treated as user scroll.
             */

            previousScrollPosition = window.scrollY;

            lastViewportMetrics = getViewportMetrics();

            isRefreshing = false;

            if (isCaptured && hasTouchInput && !isCapturing && !isReleasing) {

                scheduleTouchScrollLockAlignment();

            } else if (isCaptured && pinTrigger && !isCapturing && !isReleasing) {

                syncPinPosition();

            }

        });

        /* ========================================
           PREPARE SVG LABELS
        ======================================== */

        if (labels.parentNode !== wheel) {

            wheel.appendChild(labels);

        }

        const numbers = [...labels.querySelectorAll('text')];

        const numberWrappers = numbers.map(number => {

            let group = number.parentNode;

            if (!group.classList.contains('journey-number-wrapper')) {

                group = document.createElementNS(SVG_NS, 'g');

                group.classList.add('journey-number-wrapper');

                number.parentNode.insertBefore(group, number);

                group.appendChild(number);

            }

            const x = Number(number.getAttribute('x'));

            const y = Number(number.getAttribute('y'));

            const transform = number.getAttribute('transform') || '';

            const rotationMatch = transform.match(/rotate\(\s*(-?[\d.]+)/);

            const originalRotation = rotationMatch ? Number(rotationMatch[1]) : 0;

            /* Set rotation origin only once */

            gsap.set(group, {

                rotation: 0,

                svgOrigin: `${x} ${y}`,

                smoothOrigin: false

            });

            return {

                element: group,

                x,

                y,

                originalRotation,

                lastCorrection: 0,

                setRotation: gsap.quickSetter(group, 'rotation', 'deg')

            };

        });

        /* ========================================
           PREPARE WHEEL TRANSFORMS
        ======================================== */

        gsap.set(rotating, {

            rotation: 0,

            svgOrigin: CENTER

        });

        gsap.set(labels, {

            rotation: 0,

            svgOrigin: CENTER

        });

        const setWheelRotation = gsap.quickSetter(rotating, 'rotation', 'deg');

        const setLabelsRotation = gsap.quickSetter(labels, 'rotation', 'deg');

        /* ========================================
           PREPARE CARD SETTERS
        ======================================== */

        const stepSetters = steps.map(step => {

            return {

                element: step,

                setOpacity: gsap.quickSetter(step, 'opacity'),

                lastOpacity: null,

                lastVisibility: null,

                lastPointerEvents: null

            };

        });

        /* ========================================
           PREPARE SCROLLBAR
        ======================================== */

        const setScrollbarHeight = scrollbarThumb ? gsap.quickSetter(scrollbarThumb, 'height', '%') : null;

        if (scrollbarThumb) {

            gsap.set(scrollbarThumb, {
                y: 0
            });

        }

        /* ========================================
           CYCLIC HELPERS
        ======================================== */

        function wrapStep(step) {

            return ((step % totalSteps) + totalSteps) % totalSteps;

        }

        /* ========================================
           UPDATE WHEEL
        ======================================== */

        function updateWheel() {

            const rotation = state.rotation;

            /* Rotate the wheel */

            setWheelRotation(rotation);

            setLabelsRotation(rotation);

            /* Keep SVG labels readable */

            numberWrappers.forEach(number => {

                const absoluteRotation = number.originalRotation + rotation;

                const normalizedRotation = ((absoluteRotation + 180) % 360 + 360) % 360 - 180;

                const correction = normalizedRotation > 90 || normalizedRotation < -90 ? 180 : 0;

                if (number.lastCorrection !== correction) {

                    number.setRotation(correction);

                    number.lastCorrection = correction;

                }

            });

        }

        /* ========================================
           UPDATE STEPS
        ======================================== */

        function updateSteps() {

            const progress = gsap.utils.clamp(0, totalSteps, -state.rotation / 90);

            const step = Math.floor(progress);

            const fraction = progress - step;

            const currentIndex = wrapStep(step);

            const nextIndex = wrapStep(step + 1);

            /* Smooth fade out */

            const fadeOut = 1 - fadeEase(gsap.utils.clamp(0, 1, fraction / fadeOutRange));

            /* Smooth fade in */

            const fadeIn = fadeEase(gsap.utils.clamp(0, 1, (fraction - fadeInStart) / (1 - fadeInStart)));

            stepSetters.forEach((card, index) => {

                let opacity = 0;

                if (index === currentIndex) {

                    opacity = fadeOut;

                }

                if (index === nextIndex) {

                    opacity = fadeIn;

                }

                /* Update opacity only when necessary */

                if (card.lastOpacity !== opacity) {

                    card.setOpacity(opacity);

                    card.lastOpacity = opacity;

                }

                /* Update visibility only when necessary */

                const visibility = opacity > 0 ? 'visible' : 'hidden';

                if (card.lastVisibility !== visibility) {

                    card.element.style.visibility = visibility;

                    card.lastVisibility = visibility;

                }

                /* Update pointer events only when necessary */

                const pointerEvents = opacity > 0.99 ? 'auto' : 'none';

                if (card.lastPointerEvents !== pointerEvents) {

                    card.element.style.pointerEvents = pointerEvents;

                    card.lastPointerEvents = pointerEvents;

                }

            });

        }

        /* ========================================
           UPDATE SCROLLBAR
        ======================================== */

        function updateScrollbar() {

            if (!scrollbar || !setScrollbarHeight) return;

            const progress = gsap.utils.clamp(0, 1, scrollbarProgress);

            const fill = scrollbarMinFill + (scrollbarMaxFill - scrollbarMinFill) * progress;

            setScrollbarHeight(fill);

        }

        /* ========================================
           UPDATE ANIMATION
        ======================================== */

        function updateAnimation() {

            updateWheel();

            updateSteps();

            updateScrollbar();

        }

        updateAnimation();

        /* ========================================
           SET EXACT STEP
        ======================================== */

        function setExactStep(step) {

            currentStep = gsap.utils.clamp(0, totalSteps, step);

            state.rotation = -currentStep * 90;

            scrollbarProgress = currentStep / totalSteps;

            updateAnimation();

        }

        /* ========================================
           ANIMATION RESET
        ======================================== */

        function resetAnimation() {

            if (rotationTween) {

                rotationTween.kill();

                rotationTween = null;

            }

            isAnimating = false;

            lastScrollTime = -Infinity;

            lastScrollDirection = 0;

            animationDirection = 0;

            pendingReverseDirection = 0;

        }

        /* ========================================
           REMOVE PIN
        ======================================== */

        function removePin() {

            section.classList.remove('journey-touch-active');

            if (!pinTrigger) return;

            const trigger = pinTrigger;

            pinTrigger = null;

            trigger.kill(true);

        }

        function syncPinPosition() {

            if (!pinTrigger || !isCaptured || isCapturing || isReleasing || isRefreshing) return;

            const targetPosition = Math.max(0, pinTrigger.start + 1);

            if (Math.abs(window.scrollY - targetPosition) > 1) {

                pinTrigger.scroll(targetPosition);

            }

            previousScrollPosition = window.scrollY;

        }

        function lockTouchScroll(viewportMetrics = getViewportMetrics()) {

            const root = document.documentElement;

            const sectionBottom = section.getBoundingClientRect().bottom;

            touchLockScrollPosition = Math.max(0, window.scrollY + sectionBottom - viewportMetrics.bottom);

            root.style.setProperty('--journey-scroll-lock-top', `${-touchLockScrollPosition}px`);

            root.style.setProperty('--journey-scroll-lock-height', `${root.scrollHeight}px`);

            root.classList.add('journey-scroll-locked');

            isTouchScrollLocked = true;

        }

        function alignTouchScrollLock(viewportMetrics = getViewportMetrics()) {

            if (!isTouchScrollLocked) return;

            const sectionBottom = section.getBoundingClientRect().bottom;

            touchLockScrollPosition = Math.max(0, touchLockScrollPosition + sectionBottom - viewportMetrics.bottom);

            document.documentElement.style.setProperty('--journey-scroll-lock-top', `${-touchLockScrollPosition}px`);

        }

        function scheduleTouchScrollLockAlignment() {

            if (!isTouchScrollLocked) return;

            clearTimeout(touchLockSettleTimer);

            touchLockSettleTimer = setTimeout(() => {

                touchLockSettleTimer = null;

                if (!isTouchScrollLocked || !isCaptured || isCapturing || isReleasing || isRefreshing || ScrollTrigger.isRefreshing) return;

                const viewportMetrics = getViewportMetrics();

                lastViewportMetrics = viewportMetrics;

                alignTouchScrollLock(viewportMetrics);

            }, touchLockSettleDelay);

        }

        function unlockTouchScroll() {

            if (!isTouchScrollLocked) return;

            clearTimeout(touchLockSettleTimer);

            touchLockSettleTimer = null;

            const root = document.documentElement;

            root.classList.remove('journey-scroll-locked');

            root.style.removeProperty('--journey-scroll-lock-top');

            root.style.removeProperty('--journey-scroll-lock-height');

            isTouchScrollLocked = false;

            window.scrollTo({

                top: touchLockScrollPosition,

                behavior: 'instant'

            });

        }

        /* ========================================
           GET REAL CAPTURE POSITION
        ======================================== */

        function getCapturePosition() {

            /*
             * Calculate actual "bottom bottom" position
             * after the section has been unpinned.
             */

            const rect = section.getBoundingClientRect();

            return (window.scrollY + rect.bottom - getViewportBottom());

        }

        /* ========================================
           RELEASE SCROLL
        ======================================== */

        function releaseScroll(direction) {

            if (!isCaptured || isReleasing || isCapturing) return;

            /* Block all capture callbacks during release */

            isReleasing = true;

            isCaptured = false;

            canCapture = false;

            scrollObserver.disable();

            touchObserver.disable();

            unlockTouchScroll();

            resetAnimation();

            /* Keep the current completed card */

            setExactStep(currentStep);

            /* Remove pin and additional spacing */

            removePin();

            /*
             * Refresh while capture is blocked.
             * Never use the old saved scroll position.
             */

            ScrollTrigger.refresh();

            /*
             * Calculate the current section position
             * after pin removal and layout refresh.
             */

            const actualCapturePosition = getCapturePosition();

            const targetPosition = actualCapturePosition + (direction > 0 ? releaseOffset : -releaseOffset);

            /* Restore actual document position */

            window.scrollTo({

                top: Math.max(0, targetPosition),

                behavior: 'instant'

            });

            /* Synchronize scroll state */

            previousScrollPosition = window.scrollY;

            ScrollTrigger.update();

            /*
             * Keep capture blocked until browser
             * finishes processing the layout change.
             */

            requestAnimationFrame(() => {

                requestAnimationFrame(() => {

                    previousScrollPosition = window.scrollY;

                    isReleasing = false;

                });

            });

        }

        /* ========================================
           CHECK SCROLL ACTIVITY
        ======================================== */

        function isScrollActive() {

            return (performance.now() - lastScrollTime) < scrollActivityWindow;

        }

        /* ========================================
           GO TO STEP — BOTH DIRECTIONS
        ======================================== */

        function goToStep(direction) {

            if (!isCaptured || isReleasing || isCapturing || isAnimating || !direction) return;

            /* Release upward only from the first card */

            if (direction < 0 && currentStep <= 0) {

                releaseScroll(-1);

                return;

            }

            /* Release downward only after full rotation */

            if (direction > 0 && currentStep >= totalSteps) {

                releaseScroll(1);

                return;

            }

            /* Calculate the adjacent card */

            const nextStep = gsap.utils.clamp(0, totalSteps, currentStep + direction);

            const startScrollbarProgress = scrollbarProgress;

            const targetScrollbarProgress = nextStep / totalSteps;

            /* Lock only the animation */

            isAnimating = true;

            animationDirection = direction;

            pendingReverseDirection = 0;

            /*
             * Forward rotation:  -90 degrees
             * Backward rotation: +90 degrees
             */

            rotationTween = gsap.to(state, {

                rotation: -nextStep * 90,

                duration: rotationDuration,

                ease: rotationEase,

                overwrite: true,

                onUpdate: function () {

                    scrollbarProgress = gsap.utils.interpolate(startScrollbarProgress,

                        targetScrollbarProgress,

                        this.ratio);

                    updateAnimation();

                },

                onComplete: () => {

                    rotationTween = null;

                    /* Finish current transition */

                    setExactStep(nextStep);

                    isAnimating = false;

                    animationDirection = 0;

                    /* Stop if section was released */

                    if (!isCaptured || isReleasing) return;

                    /* Respect direction change */

                    if (pendingReverseDirection) {

                        const reverseDirection = pendingReverseDirection;

                        pendingReverseDirection = 0;

                        goToStep(reverseDirection);

                        return;

                    }

                    /* Stop when scrolling is inactive */

                    if (!isScrollActive()) return;

                    const direction = lastScrollDirection;

                    /* Keep the boundary cards visible */

                    if (direction < 0 && currentStep <= 0) return;

                    if (direction > 0 && currentStep >= totalSteps) return;

                    /* Continue sequential rotation */

                    goToStep(direction);

                }

            });

        }

        /* ========================================
           HANDLE SCROLL — BOTH DIRECTIONS
        ======================================== */

        function handleScroll(direction) {

            if (!isCaptured || isReleasing || isCapturing || !direction) return;

            /* Track scroll activity and direction */

            lastScrollTime = performance.now();

            lastScrollDirection = direction;

            /* Never interrupt the current transition */

            if (isAnimating) {

                pendingReverseDirection = direction !== animationDirection ? direction : 0;

                return;

            }

            /* Start adjacent transition */

            goToStep(direction);

        }

        /* ========================================
           SCROLL OBSERVER
        ======================================== */

        scrollObserver = ScrollTrigger.observe({

            target: window,

            type: 'wheel',

            preventDefault: true,

            allowClicks: true,

            tolerance: wheelThreshold,

            wheelSpeed: -1,

            lockAxis: true,

            /* Scroll down / Swipe up */

            onUp: () => {

                handleScroll(1);

            },

            /* Scroll up / Swipe down */

            onDown: () => {

                handleScroll(-1);

            }

        });

        scrollObserver.disable();

        touchObserver = ScrollTrigger.observe({

            target: section,

            type: 'touch',

            preventDefault: false,

            allowClicks: true,

            tolerance: wheelThreshold,

            lockAxis: true,

            /* Swipe up */

            onUp: () => {

                handleScroll(1);

            },

            /* Swipe down */

            onDown: () => {

                handleScroll(-1);

            }

        });

        touchObserver.disable();

        /* ========================================
           CAPTURE SCROLL — FORWARD ENTRY ONLY
        ======================================== */

        function captureScroll(self) {

            if (isCaptured || isCapturing || isReleasing || isRefreshing || ScrollTrigger.isRefreshing || !canCapture || self.direction !== 1) return;

            /* Block repeated capture immediately */

            isCapturing = true;

            isCaptured = true;

            canCapture = false;

            resetAnimation();

            scrollbarProgress = 0;

            /* Start from first card */

            setExactStep(0);

            /* Remove any previous pin instance */

            removePin();

            /* Create pin only when entering from above */

            if (hasTouchInput) {

                lockTouchScroll(getViewportMetrics());

            } else {

                pinTrigger = ScrollTrigger.create({

                    id: 'journey-section-pin',

                    trigger: section,

                    start: getJourneyStart,

                    end: () => '+=' + getViewportHeight() * scrollScreens,

                    pin: section,

                    pinSpacing: true,

                    anticipatePin: 0,

                    invalidateOnRefresh: true,

                    // markers: { indent: 80 },

                    onRefresh: () => {

                        updateScrollbar();

                    }

                });

                /* Use the current pin position */

                pinTrigger.scroll(pinTrigger.start + 1);

            }

            section.classList.add('journey-touch-active');

            /* Synchronize current scroll position */

            previousScrollPosition = window.scrollY;

            /* Enable observer */

            scrollObserver.enable();

            touchObserver.enable();

            isCapturing = false;

        }

        /* ========================================
           SECTION ENTRY TRIGGER
        ======================================== */

        entryTrigger = ScrollTrigger.create({

            id: 'journey-section-entry',

            trigger: section,

            start: getJourneyStart,

            end: 'bottom top',

            invalidateOnRefresh: true,

            // markers: true,

            /* Enter from above */

            onEnter: self => {

                if (isReleasing || isCapturing || isCaptured || isRefreshing || ScrollTrigger.isRefreshing || !canCapture) return;

                captureScroll(self);

            }

        });

        function handleViewportChange() {

            if (!hasTouchInput || (window.visualViewport && Math.abs(window.visualViewport.scale - 1) > 0.01)) return;

            if (viewportRefreshFrame !== null) return;

            viewportRefreshFrame = requestAnimationFrame(() => {

                viewportRefreshFrame = null;

                const viewportMetrics = getViewportMetrics();

                if (

                    Math.abs(viewportMetrics.bottom - lastViewportMetrics.bottom) < 2 &&

                    Math.abs(viewportMetrics.height - lastViewportMetrics.height) < 2 &&

                    Math.abs(viewportMetrics.offsetTop - lastViewportMetrics.offsetTop) < 2

                ) return;

                if (isCapturing || isReleasing || isRefreshing || ScrollTrigger.isRefreshing) {

                    handleViewportChange();

                    return;

                }

                lastViewportMetrics = viewportMetrics;

                if (isCaptured && hasTouchInput) {

                    scheduleTouchScrollLockAlignment();

                    return;

                }

                if (isCaptured && pinTrigger) {

                    pinTrigger.refresh();

                    syncPinPosition();

                    ScrollTrigger.update();

                    return;

                }

                entryTrigger.refresh();

            });

        }

        window.addEventListener('resize', handleViewportChange, {

            passive: true

        });

        if (window.visualViewport) {

            window.visualViewport.addEventListener('resize', handleViewportChange, {

                passive: true

            });

            window.visualViewport.addEventListener('scroll', handleViewportChange, {

                passive: true

            });

        }

        /* ========================================
           REARM CAPTURE — REAL UPWARD SCROLL ONLY
        ======================================== */

        window.addEventListener('scroll', () => {

            const currentScrollPosition = window.scrollY;

            if (isCaptured && hasTouchInput && !isCapturing) {

                previousScrollPosition = currentScrollPosition;

                scheduleTouchScrollLockAlignment();

                return;

            }

            const isScrollingUp = currentScrollPosition < previousScrollPosition;

            previousScrollPosition = currentScrollPosition;

            /*
             * Ignore scroll events generated by
             * capture, release or refresh.
             */

            if (isCaptured || isCapturing || isReleasing || isRefreshing || ScrollTrigger.isRefreshing || !entryTrigger) return;

            /* Already armed */

            if (canCapture) return;

            /*
             * Only actual upward movement can
             * allow the section to be captured again.
             */

            if (!isScrollingUp) return;

            /*
             * Require sufficient distance above
             * the latest capture position.
             */

            if (currentScrollPosition <= entryTrigger.start - rearmDistance) {

                canCapture = true;

            }

        }, {

            passive: true

        });

        /* ========================================
           KEYBOARD SUPPORT
        ======================================== */

        window.addEventListener('keydown', event => {

            if (!isCaptured) return;

            if (

                event.target.closest?.('input, textarea, select, button, a, [contenteditable="true"]')

            ) return;

            const downKeys = ['ArrowDown', 'PageDown'];

            const upKeys = ['ArrowUp', 'PageUp'];

            let direction = 0;

            if (downKeys.includes(event.key)) {

                direction = 1;

            }

            if (upKeys.includes(event.key)) {

                direction = -1;

            }

            if (event.code === 'Space') {

                direction = event.shiftKey ? -1 : 1;

            }

            if (!direction) return;

            event.preventDefault();

            if (event.repeat) return;

            /* Same bidirectional logic for keyboard */

            handleScroll(direction);

        });

        /* ========================================
           SAFE INITIAL REFRESH
        ======================================== */

        function safeInitialRefresh() {

            /*
             * Never initiate an additional refresh
             * while the section is pinned.
             *
             * releaseScroll() will refresh the layout
             * when the section is released.
             */

            if (isCaptured || isCapturing || isReleasing || isRefreshing || ScrollTrigger.isRefreshing) return;

            ScrollTrigger.refresh();

        }

        if (document.readyState === 'complete') {

            safeInitialRefresh();

        } else {

            window.addEventListener('load', safeInitialRefresh, {

                once: true

            });

        }

    });

}(jQuery));
