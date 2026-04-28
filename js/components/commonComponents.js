const Components = {
    version: '1.0.0',
    config: {
        basePath: '',
        onComponentInit: null,
        onComponentReady: null
    },
    initialized: false,
    components: {}
};

Components.setConfig = function(options) {
    Object.assign(this.config, options);
};

Components.init = function(options = {}) {
    if (this.initialized) {
        console.warn('[Components] Already initialized');
        return;
    }
    this.setConfig(options);
    this.initialized = true;
    console.log('[Components] Initialized v' + this.version);
    if (typeof this.config.onComponentInit === 'function') {
        this.config.onComponentInit();
    }
};

Components.render = function(componentName, targetId, options = {}) {
    const renderFn = this.components[componentName];
    if (!renderFn) {
        console.error(`[Components] Component "${componentName}" not found`);
        return null;
    }
    const target = document.getElementById(targetId);
    if (!target) {
        console.error(`[Components] Target element "#${targetId}" not found`);
        return null;
    }
    const html = renderFn(options);
    target.innerHTML = html;
    this.bindComponentEvents(componentName, target, options);
    if (typeof this.config.onComponentReady === 'function') {
        this.config.onComponentReady(componentName, target);
    }
    return target;
};

Components.renderAfter = function(componentName, afterElement, options = {}) {
    const renderFn = this.components[componentName];
    if (!renderFn) {
        console.error(`[Components] Component "${componentName}" not found`);
        return null;
    }
    const container = document.createElement('div');
    container.innerHTML = renderFn(options);
    const element = container.firstElementChild;
    if (!element) {
        console.error(`[Components] No element to insert after`);
        return null;
    }
    afterElement.parentNode.insertBefore(element, afterElement.nextSibling);
    this.bindComponentEvents(componentName, element, options);
    return element;
};

Components.register = function(name, definition) {
    if (this.components[name]) {
        console.warn(`[Components] Component "${name}" already registered, overwriting`);
    }
    this.components[name] = definition.render || (() => '');
    if (definition.events) {
        this._componentEvents = this._componentEvents || {};
        this._componentEvents[name] = definition.events;
    }
};

Components.bindComponentEvents = function(componentName, element, options) {
    if (!this._componentEvents || !this._componentEvents[componentName]) return;
    const events = this._componentEvents[componentName];
    Object.keys(events).forEach(selector => {
        const eventType = selector.split('@')[0];
        const targetSelector = selector.split('@')[1];
        const handler = events[selector];
        if (eventType === 'delegate') {
            document.addEventListener('click', (e) => {
                if (e.target.matches(targetSelector)) {
                    handler.call(this, e, options);
                }
            });
        } else {
            const targets = element.querySelectorAll(targetSelector);
            targets.forEach(target => {
                target.addEventListener(eventType, (e) => {
                    handler.call(this, e, options);
                });
            });
        }
    });
};

Components.GlobalNav = {
    render: function(options = {}) {
        const currentPage = options.currentPage || 'index';
        const navItems = [
            { id: 'index', label: '首页', href: 'index.html' },
            { id: 'book', label: '文学', href: 'book.html' },
            { id: 'anime', label: '动漫', href: 'anime.html' },
            { id: 'game', label: '游戏', href: 'game.html' },
            { id: 'music', label: '音乐', href: 'music.html' },
            { id: 'data', label: '数据', href: 'data.html' }
        ];
        const navLinks = navItems.map(item =>
            `<a href="${item.href}" class="${item.id === currentPage ? 'active' : ''}">${item.label}</a>`
        ).join('');

        return `<nav class="global-nav" id="globalNav">
        <a href="index.html" class="global-nav-logo">我的收藏夹</a>
        <div class="global-nav-links">${navLinks}</div>
        <button class="nav-toggle" id="navToggle" onclick="toggleMobileMenu()">☰</button>
        <div class="user-menu-wrapper" id="userMenuWrapper">
            <button class="user-menu-btn" onclick="toggleUserMenu()">
                <div class="user-menu-avatar">U</div>
                <span class="user-menu-name">游客用户</span>
                <span class="user-menu-caret">▼</span>
            </button>
            <div class="user-menu-dropdown" id="userMenuDropdown">
                <button class="login-btn" onclick="openLoginModal()">登录 / 注册</button>
                <div class="user-menu-divider"></div>
                <a href="#profile">个人资料</a>
                <a href="#favorites">我的收藏</a>
                <a href="#settings">设置</a>
                <button onclick="handleLogout()">退出登录</button>
            </div>
        </div>
    </nav>`;
    }
};

Components.MobileMenu = {
    render: function(options = {}) {
        const currentPage = options.currentPage || 'index';
        const navItems = [
            { id: 'index', label: '首页', href: 'index.html' },
            { id: 'book', label: '文学', href: 'book.html' },
            { id: 'anime', label: '动漫', href: 'anime.html' },
            { id: 'game', label: '游戏', href: 'game.html' },
            { id: 'music', label: '音乐', href: 'music.html' },
            { id: 'data', label: '数据', href: 'data.html' }
        ];
        const navLinks = navItems.map(item =>
            `<a href="${item.href}" class="${item.id === currentPage ? 'active' : ''}">${item.label}</a>`
        ).join('');

        return `<div class="mobile-menu-overlay" id="mobileMenuOverlay">
        <div class="mobile-menu-links">${navLinks}</div>
    </div>`;
    }
};

Components.MusicPlayer = {
    render: function(options = {}) {
        return `<aside class="music-sidebar" id="musicSidebar">
        <div class="music-sidebar-toggle" id="musicSidebarToggle" onclick="toggleMusicSidebar()">
            <span>🎵</span>
        </div>
        <div class="music-sidebar-content">
            <div class="music-player-header">
                <span class="music-player-icon">🎵</span>
                <span class="music-player-title">背景音乐</span>
                <button class="music-sidebar-close" onclick="toggleMusicSidebar()">×</button>
            </div>
            <div class="music-player-content">
                <div class="music-info">
                    <div class="music-title" id="musicTitle">选择音乐</div>
                    <div class="music-artist" id="musicArtist">点击播放</div>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" id="progressBar">
                        <div class="progress-fill" id="progressFill"></div>
                        <div class="progress-thumb" id="progressThumb"></div>
                    </div>
                    <div class="time-display">
                        <span id="currentTime">0:00</span>
                        <span id="duration">0:00</span>
                    </div>
                </div>
                <div class="player-controls-wrapper">
                    <div class="player-controls">
                        <button class="control-btn" id="prevBtn" title="上一首">⏮</button>
                        <button class="control-btn play-btn" id="playBtn" title="播放/暂停">▶</button>
                        <button class="control-btn" id="nextBtn" title="下一首">⏭</button>
                    </div>
                    <div class="volume-control">
                        <button class="control-btn volume-btn" id="volumeBtn" title="静音/取消静音">🔊</button>
                        <input type="range" class="volume-slider" id="volumeSlider" min="0" max="100" value="50">
                    </div>
                </div>
                <div class="music-list" id="musicList"></div>
            </div>
        </div>
    </aside>`;
    }
};

Components.Sidebar = {
    render: function(options = {}) {
        const currentPage = options.currentPage || 'index';
        const sectionTitle = options.sectionTitle || '全部收藏作品';
        const showAddButton = options.showAddButton !== false;
        const showCarousel = options.showCarousel !== false;
        const showRanks = options.showRanks || false;
        const emptyState = options.emptyState || '';

        const navItems = [
            { id: 'index', label: '首页', href: 'index.html' },
            { id: 'book', label: '文学', href: 'book.html' },
            { id: 'anime', label: '动漫', href: 'anime.html' },
            { id: 'game', label: '游戏', href: 'game.html' },
            { id: 'music', label: '音乐', href: 'music.html' },
            { id: 'data', label: '数据', href: 'data.html' }
        ];
        const navLinks = navItems.map(item =>
            `<a href="${item.href}" class="nav-item ${item.id === currentPage ? 'active' : ''}">${item.label}</a>`
        ).join('');

        const carouselHtml = showCarousel ? `<div class="carousel">
                <div class="carousel-container"></div>
                <div class="carousel-indicators"></div>
                <button class="carousel-prev">&lt;</button>
                <button class="carousel-next">&gt;</button>
            </div>` : '';

        const addButtonHtml = showAddButton ? `<button class="add-btn" onclick="App.openAddModal()" aria-label="添加作品">+ 添加作品</button>` : '';

        const rankHtml = showRanks ? `<div class="rank-container">
                <div class="rank-box">
                    <div class="rank-title">🏆 评分排行</div>
                    <div id="score-rank"></div>
                </div>
                <div class="rank-box">
                    <div class="rank-title">❤️ 收藏排行</div>
                    <div id="fav-rank"></div>
                </div>
            </div>` : '';

        const emptyStateHtml = emptyState ? `<div class="empty-state"><p>${emptyState}</p></div>` : '';

        return `<div class="container">
        <aside class="sidebar">
            <div class="logo">我的收藏夹</div>
            <form class="search-box" onsubmit="event.preventDefault();App.search();">
                <input id="search" type="search" placeholder="搜索作品..." aria-label="搜索作品">
            </form>
            <nav class="nav-group">
                <div class="nav-title">主导航</div>
                ${navLinks}
            </nav>
            <section class="nav-group">
                <div class="nav-title">用户信息</div>
                <div class="user-info">
                    <div class="user-avatar">
                        <div class="avatar">U</div>
                        <div class="user-name">游客用户</div>
                        <div class="user-level">普通会员</div>
                    </div>
                    <div class="user-stats">
                        <div>收藏数: <span id="fav-count">0</span></div>
                        <div>浏览历史: 5</div>
                    </div>
                </div>
            </section>
        </aside>
        <main class="main">
            ${carouselHtml}
            <div class="main-header">
                <h2 class="section-title">${sectionTitle}</h2>
                ${addButtonHtml}
            </div>
            <div class="grid" id="hot">${emptyStateHtml}</div>
            ${rankHtml}
        </main>
    </div>`;
    }
};

Components.Footer = {
    render: function(options = {}) {
        const email = options.email || 'zhuxianzhe@outlook.com';
        return `<footer>
        <div class="footer-content">
            <div class="footer-column">
                <h3>关于本站</h3>
                <p>记录我喜欢的作品分享站</p>
                <p>文学、动漫、游戏、音乐</p>
            </div>
            <div class="footer-column">
                <h3>联系我</h3>
                <p>邮箱: ${email}</p>
                <p>个人分享，非商业用途</p>
            </div>
        </div>
        <div class="footer-copyright">© 我的收藏夹</div>
    </footer>`;
    }
};

Components.Modal = {
    render: function(options = {}) {
        const modalId = options.id || 'cardModal';
        const title = options.title || '添加新作品';
        const mode = options.mode || 'add';

        return `<div class="modal" id="${modalId}" aria-hidden="true">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle">${title}</h3>
                <button type="button" class="modal-close" onclick="App.closeModal()" aria-label="关闭模态框">&times;</button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="editId">
                <div class="form-group">
                    <label for="inputName">作品名称</label>
                    <input type="text" id="inputName" placeholder="请输入作品名称" required>
                </div>
                <div class="form-group">
                    <label for="inputType">分类</label>
                    <select id="inputType">
                        <option value="文学">文学</option>
                        <option value="动漫">动漫</option>
                        <option value="游戏">游戏</option>
                        <option value="音乐">音乐</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="inputAuthor">作者/公司</label>
                    <input type="text" id="inputAuthor" placeholder="请输入作者/公司（可选）">
                </div>
                <div class="form-group">
                    <label for="inputDesc">描述</label>
                    <textarea id="inputDesc" placeholder="请输入作品描述" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="inputCover">图片URL</label>
                    <input type="url" id="inputCover" placeholder="请输入图片地址">
                    <div class="image-preview" id="imagePreview"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="App.closeModal()">取消</button>
                <button class="btn-submit" onclick="App.saveCard()">保存</button>
            </div>
        </div>
    </div>`;
    }
};

Components.DeleteModal = {
    render: function(options = {}) {
        return `<div class="modal" id="deleteModal" aria-hidden="true">
        <div class="modal-content modal-small">
            <div class="modal-header">
                <h3>确认删除</h3>
                <button class="modal-close" onclick="closeDeleteModal()" aria-label="关闭">&times;</button>
            </div>
            <div class="modal-body">
                <p id="deleteMessage">确定要删除这个作品吗？</p>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="App.closeDeleteModal()">取消</button>
                <button class="btn-delete" onclick="App.confirmDelete()">删除</button>
            </div>
        </div>
    </div>`;
    }
};

Components.Toast = {
    render: function(options = {}) {
        return `<div class="toast" id="toast" role="alert"></div>`;
    }
};

Components.PageLayout = {
    render: function(options = {}) {
        const pageName = options.pageName || 'index';
        const sectionTitle = options.sectionTitle || '全部收藏作品';
        const showAddButton = options.showAddButton !== false;
        const showCarousel = options.showCarousel !== false;
        const showRanks = options.showRanks || false;
        const emptyState = options.emptyState || '';
        const footerEmail = options.footerEmail || 'zhuxianzhe@outlook.com';

        return Components.GlobalNav.render({ currentPage: pageName })
            + Components.MobileMenu.render({ currentPage: pageName })
            + Components.MusicPlayer.render()
            + `<div class="page-content" id="pageContent">`
            + Components.Sidebar.render({
                currentPage: pageName,
                sectionTitle: sectionTitle,
                showAddButton: showAddButton,
                showCarousel: showCarousel,
                showRanks: showRanks,
                emptyState: emptyState
            })
            + Components.Modal.render()
            + Components.DeleteModal.render()
            + Components.Toast.render()
            + `</div>`
            + Components.Footer.render({ email: footerEmail });
    }
};

Components.register('global-nav', Components.GlobalNav);
Components.register('mobile-menu', Components.MobileMenu);
Components.register('music-player', Components.MusicPlayer);
Components.register('sidebar', Components.Sidebar);
Components.register('footer', Components.Footer);
Components.register('modal', Components.Modal);
Components.register('delete-modal', Components.DeleteModal);
Components.register('toast', Components.Toast);
Components.register('page-layout', Components.PageLayout);

window.Components = Components;