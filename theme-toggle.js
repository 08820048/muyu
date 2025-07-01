/**
 * 暗色模式切换功能
 * 提供丝滑的主题切换体验
 */

(function() {
    'use strict';

    // 主题管理类
    class ThemeManager {
        constructor() {
            this.init();
        }

        init() {
            this.setupTheme();
            this.bindEvents();
        }

        // 设置初始主题
        setupTheme() {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            // 确定初始主题
            let theme = 'light';
            if (savedTheme) {
                theme = savedTheme;
            } else if (prefersDark) {
                theme = 'dark';
            }

            this.setTheme(theme, false);
        }

        // 设置主题
        setTheme(theme, animate = true) {
            const html = document.documentElement;
            const toggleBtn = document.getElementById('theme-toggle-btn');

            if (animate) {
                // 添加过渡动画
                html.style.transition = 'all 0.3s ease';
                document.body.style.transition = 'all 0.3s ease';
                
                // 动画结束后移除过渡
                setTimeout(() => {
                    html.style.transition = '';
                    document.body.style.transition = '';
                }, 300);
            }

            if (theme === 'dark') {
                html.setAttribute('data-theme', 'dark');
                if (toggleBtn) {
                    toggleBtn.setAttribute('aria-label', '切换到浅色模式');
                }
            } else {
                html.removeAttribute('data-theme');
                if (toggleBtn) {
                    toggleBtn.setAttribute('aria-label', '切换到暗色模式');
                }
            }

            // 保存到本地存储
            localStorage.setItem('theme', theme);
            
            // 触发自定义事件
            window.dispatchEvent(new CustomEvent('themechange', { 
                detail: { theme } 
            }));
        }

        // 切换主题
        toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        }

        // 绑定事件
        bindEvents() {
            // 切换按钮点击事件
            const toggleBtn = document.getElementById('theme-toggle-btn');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', () => {
                    this.toggleTheme();
                });
            }

            // 键盘快捷键 (Ctrl/Cmd + Shift + D)
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });

            // 监听系统主题变化
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                // 只有在用户没有手动设置主题时才跟随系统
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }

        // 获取当前主题
        getCurrentTheme() {
            return document.documentElement.getAttribute('data-theme') || 'light';
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.themeManager = new ThemeManager();
        });
    } else {
        window.themeManager = new ThemeManager();
    }

    // 导出到全局作用域
    window.ThemeManager = ThemeManager;
})();
