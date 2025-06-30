/* ========================================
   八尺妖剑博客 - 页面过渡动画脚本
   ======================================== */

(function() {
    'use strict';

    // 页面加载完成后初始化动画
    document.addEventListener('DOMContentLoaded', function() {
        initPageTransitions();
        initScrollAnimations();
        initInteractiveAnimations();
        initLazyImageLoading();
    });

    // 页面跳转过渡动画
    function initPageTransitions() {
        // 为所有内部链接添加过渡效果（但排除某些特殊链接）
        const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]');

        internalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // 跳过锚点链接、外部链接、搜索结果链接等
                if (href.startsWith('#') ||
                    href.startsWith('http') ||
                    href.startsWith('mailto:') ||
                    this.closest('.search-results') ||
                    this.hasAttribute('target') ||
                    e.ctrlKey || e.metaKey || e.shiftKey) {
                    return;
                }

                // 只对导航链接应用过渡动画，不影响文章链接
                if (!this.closest('.navbar') && !this.closest('.pagination')) {
                    return;
                }

                e.preventDefault();

                // 添加页面退出动画
                document.body.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
                document.body.style.opacity = '0';
                document.body.style.transform = 'translateY(-20px)';

                // 延迟跳转
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            });
        });

        // 页面返回时的动画
        window.addEventListener('pageshow', function(e) {
            if (e.persisted) {
                document.body.style.opacity = '1';
                document.body.style.transform = 'translateY(0)';
            }
        });
    }

    // 滚动触发动画
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // 观察需要动画的元素
        const animateElements = document.querySelectorAll(
            'article, .post, .sidebar > div, .card, .tag, .category, blockquote, pre, table'
        );

        animateElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });

        // 添加CSS类
        const style = document.createElement('style');
        style.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .animate-in {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    // 交互动画
    function initInteractiveAnimations() {
        // 按钮点击波纹效果
        document.addEventListener('click', function(e) {
            const button = e.target.closest('.btn, .button, input[type="submit"], input[type="button"]');
            if (!button) return;

            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 1;
            `;

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });

        // 添加波纹动画CSS
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);

        // 卡片悬停3D效果
        const cards = document.querySelectorAll('article, .post, .card, .box');
        cards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            });
        });

        // 导航链接下划线动画
        const navLinks = document.querySelectorAll('.dropmenu ul li a');
        navLinks.forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.setProperty('--underline-width', '100%');
            });
            link.addEventListener('mouseleave', function() {
                this.style.setProperty('--underline-width', '0%');
            });
        });
    }

    // 图片懒加载和动画
    function initLazyImageLoading() {
        const images = document.querySelectorAll('img');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.style.transform = 'scale(0.8)';
                    img.style.transition = 'all 0.5s ease';
                    
                    img.onload = function() {
                        this.style.opacity = '1';
                        this.style.transform = 'scale(1)';
                    };
                    
                    // 如果图片已经加载
                    if (img.complete) {
                        img.style.opacity = '1';
                        img.style.transform = 'scale(1)';
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // 平滑滚动增强
    function smoothScrollTo(target, duration = 800) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // 为锚点链接添加平滑滚动
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="#"]');
        if (link && link.getAttribute('href') !== '#') {
            e.preventDefault();
            smoothScrollTo(link.getAttribute('href'));
        }
    });

    // 页面滚动时的视差效果
    let ticking = false;
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });

    // 添加页面加载进度条
    function showLoadingProgress() {
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--tg-primary), var(--tg-primary-light));
            z-index: 9999;
            transition: width 0.3s ease;
        `;
        document.body.appendChild(progressBar);

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 90) progress = 90;
            progressBar.style.width = progress + '%';
        }, 100);

        window.addEventListener('load', () => {
            clearInterval(interval);
            progressBar.style.width = '100%';
            setTimeout(() => {
                progressBar.style.opacity = '0';
                setTimeout(() => progressBar.remove(), 300);
            }, 200);
        });
    }

    // 如果页面还在加载，显示进度条
    if (document.readyState === 'loading') {
        showLoadingProgress();
    }

})();
