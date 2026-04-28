// 模块化 JavaScript 代码
const App = {
    // 数据存储
    data: {
        games: [
            {
                id: 1, name: "局外人", type: "文学", author: "加缪",
                desc: "此人文学水平恐不在我之下。",
                cover: "./img/juwairen.jpg"
            },
            {
                id: 2, name: "孤独摇滚", type: "动漫",
                desc: "废萌,,,是吧",
                cover: "./img/BochiRock.png"
            },
            {
                id: 3, name: "塞尔达传说", type: "游戏", company: "任天堂",
                desc: "开放世界游戏天花板。",
                cover: "./img/ZelDA.jpg"
            },
            {
                id: 4, name: "rewrite", type: "游戏",
                desc: "视觉小说",
                cover: "./img/rewriteBCG.png"
            },
              {
                id: 5, name: "蓬莱伝説", type: "音乐", company: "Zun",
                desc: "开除二籍",
                cover: "https://upload.thbwiki.cc/e/e3/%E4%B8%9C%E6%96%B9%E6%B8%B8%E6%88%8FLOGO.png"
            },
            
        ],
        fav: [],
        pendingDeleteId: null
    },
    

    // 初始化
    init() {
        this.loadData();
        this.renderAll();
        this.bindEvents();
        Carousel.init();
    },

    // 加载数据
    loadData() {
        const savedGames = localStorage.getItem('customGames');
        const savedFav = localStorage.getItem('fav');

        if (savedGames) {
            this.data.games = JSON.parse(savedGames);
        }

        if (savedFav) {
            this.data.fav = JSON.parse(savedFav);
        }
    },

    // 保存数据
    saveData() {
        localStorage.setItem('customGames', JSON.stringify(this.data.games));
        localStorage.setItem('fav', JSON.stringify(this.data.fav));
    },

    // 绑定事件
    bindEvents() {
        // 点击外部关闭菜单
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.card')) {
                this.closeAllMenus();
            }
        });

        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeDeleteModal();
                this.closeAllMenus();
                this.closeDetailModal();
            }
        });

        // 图片预览
        const inputCover = document.getElementById('inputCover');
        if (inputCover) {
            inputCover.addEventListener('input', (e) => {
                this.previewImage(e.target.value.trim());
            });
        }

        // 点击模态框外部关闭
        const cardModal = document.getElementById('cardModal');
        if (cardModal) {
            cardModal.addEventListener('click', (e) => {
                if (e.target === cardModal) this.closeModal();
            });
        }

        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) {
            deleteModal.addEventListener('click', (e) => {
                if (e.target === deleteModal) this.closeDeleteModal();
            });
        }
    },

    // 图片预览
    previewImage(url) {
        const preview = document.getElementById('imagePreview');
        if (!preview) return;

        if (url) {
            preview.innerHTML = `<img src="${url}" onerror="this.parentElement.innerHTML='<div style=padding:10px;font-size:12px;color:#999;>图片加载失败</div>'">`;
        } else {
            preview.innerHTML = '';
        }
    },

    // 卡片渲染
    renderCard(game) {
        const isFav = this.data.fav.includes(game.id);
        return `
        <div class="card" data-id="${game.id}" onclick="App.openDetail(${game.id})"><!--
            --><div class="card-cover"><!--
                --><img src="${game.cover}" onerror="this.src='./img/aaa.jpg'">
                <button class="fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation();App.toggleFav(${game.id})"><!--
                    -->${isFav ? '❤️' : '🤍'}
                </button>
                <button class="menu-btn" onclick="event.stopPropagation();App.toggleMenu(${game.id})"></button>
                <div class="card-menu" id="menu-${game.id}" style="display: none;"><!--
                    --><div class="card-menu-item edit" onclick="event.stopPropagation();App.openEditModal(${game.id});App.closeAllMenus()">编辑</div>
                    <div class="card-menu-item delete" onclick="event.stopPropagation();App.openDeleteModal(${game.id});App.closeAllMenus()">删除</div>
                </div>
            </div>
            <div class="card-body"><!--
                --><div class="card-title">${game.name}</div>
                <div class="card-meta">${game.type} ${game.author ? '| ' + game.author : ''} ${game.company ? '| ' + game.company : ''}</div>
                <div class="card-desc">${game.desc}</div>
            </div>
        </div>`;
    },

    // 排行榜渲染
    renderRankList(list) {
        return list.slice(0, 5).map((game, index) => `
        <div class="rank-item" onclick="App.openDetail(${game.id})"><!--
            --><div class="rank-num">${index + 1}</div>
            <div>
                <div>${game.name}</div>
                <div style="font-size:12px;color:#999">${game.type}</div>
            </div>
        </div>`).join('');
    },

    // 获取当前页面类型
    getCurrentPageType() {
        const path = window.location.pathname;
        const pageName = path.split('/').pop();
        
        const typeMap = {
            'book.html': '文学',
            'anime.html': '动漫',
            'game.html': '游戏',
            'music.html': '音乐'
        };
        
        return typeMap[pageName] || null;
    },

    // 渲染首页或分类页面
    renderHome() {
        const hotContainer = document.getElementById('hot');
        if (hotContainer) {
            // 获取当前页面类型，如果是分类页面则过滤
            const pageType = this.getCurrentPageType();
            let gamesToRender = this.data.games;
            
            // 如果是分类页面，只显示该类型的卡片
            if (pageType) {
                gamesToRender = this.data.games.filter(game => game.type === pageType);
            }
            
            if (gamesToRender.length === 0) {
                hotContainer.innerHTML = '<div class="empty-state"><p>暂无作品，点击添加按钮添加新作品</p></div>';
            } else {
                hotContainer.innerHTML = gamesToRender.map(game => this.renderCard(game)).join('');
            }

            // 渲染排行榜（只在首页显示）
            const scoreRank = document.getElementById('score-rank');
            const favRank = document.getElementById('fav-rank');

            if (scoreRank && !pageType) {
                scoreRank.innerHTML = this.renderRankList(this.data.games);
            }

            if (favRank && !pageType) {
                const favGames = this.data.games.filter(game => this.data.fav.includes(game.id));
                favRank.innerHTML = this.renderRankList(favGames.length > 0 ? favGames : this.data.games);
            }
        }
    },

    // 更新收藏数
    updateFavCount() {
        const favCount = document.getElementById('fav-count');
        if (favCount) {
            favCount.textContent = this.data.fav.length;
        }
    },

    // 全部渲染
    renderAll() {
        this.renderHome();
        this.updateFavCount();
    },

    // Toast 提示
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        toast.textContent = message;
        toast.className = `toast ${type} show`;

        setTimeout(() => {
            toast.className = 'toast';
        }, 2500);
    },

    // 收藏切换
    toggleFav(id) {
        const index = this.data.fav.indexOf(id);
        if (index > -1) {
            this.data.fav.splice(index, 1);
        } else {
            this.data.fav.push(id);
        }

        this.saveData();
        this.renderAll();
        this.showToast('收藏状态已更新', 'success');
    },

    // 搜索
    search() {
        const searchInput = document.getElementById('search');
        if (!searchInput) return;

        const keyword = searchInput.value.toLowerCase();
        const filteredGames = this.data.games.filter(game =>
            game.name.toLowerCase().includes(keyword) ||
            game.type.toLowerCase().includes(keyword) ||
            (game.author && game.author.toLowerCase().includes(keyword)) ||
            (game.desc && game.desc.toLowerCase().includes(keyword))
        );

        const hotContainer = document.getElementById('hot');
        if (hotContainer) {
            if (filteredGames.length === 0) {
                hotContainer.innerHTML = '<div class="empty-state"><p>未找到匹配的作品</p></div>';
            } else {
                hotContainer.innerHTML = filteredGames.map(game => this.renderCard(game)).join('');
            }
        }
    },

    // 打开添加模态框
    openAddModal() {
        const modalTitle = document.getElementById('modalTitle');
        const editId = document.getElementById('editId');
        const inputName = document.getElementById('inputName');
        const inputType = document.getElementById('inputType');
        const inputAuthor = document.getElementById('inputAuthor');
        const inputDesc = document.getElementById('inputDesc');
        const inputCover = document.getElementById('inputCover');
        const imagePreview = document.getElementById('imagePreview');
        const cardModal = document.getElementById('cardModal');

        if (!modalTitle || !editId || !inputName || !inputType || !inputAuthor || !inputDesc || !inputCover || !imagePreview || !cardModal) {
            return;
        }

        modalTitle.textContent = '添加新作品';
        editId.value = '';
        inputName.value = '';
        inputType.value = '文学';
        inputAuthor.value = '';
        inputDesc.value = '';
        inputCover.value = '';
        imagePreview.innerHTML = '';

        cardModal.classList.add('active');
    },

    // 打开编辑模态框
    openEditModal(id) {
        const game = this.data.games.find(g => g.id === id);
        if (!game) {
            this.showToast('未找到该作品', 'error');
            return;
        }

        const modalTitle = document.getElementById('modalTitle');
        const editId = document.getElementById('editId');
        const inputName = document.getElementById('inputName');
        const inputType = document.getElementById('inputType');
        const inputAuthor = document.getElementById('inputAuthor');
        const inputDesc = document.getElementById('inputDesc');
        const inputCover = document.getElementById('inputCover');
        const imagePreview = document.getElementById('imagePreview');
        const cardModal = document.getElementById('cardModal');

        if (!modalTitle || !editId || !inputName || !inputType || !inputAuthor || !inputDesc || !inputCover || !imagePreview || !cardModal) {
            return;
        }

        modalTitle.textContent = '编辑作品';
        editId.value = id;
        inputName.value = game.name;
        inputType.value = game.type;
        inputAuthor.value = game.author || game.company || '';
        inputDesc.value = game.desc;
        inputCover.value = game.cover;

        if (game.cover) {
            imagePreview.innerHTML = `<img src="${game.cover}" onerror="this.parentElement.innerHTML=''">`;
        } else {
            imagePreview.innerHTML = '';
        }

        cardModal.classList.add('active');
    },

    // 关闭模态框
    closeModal() {
        const cardModal = document.getElementById('cardModal');
        if (cardModal) {
            cardModal.classList.remove('active');
        }
    },

    // 保存卡片
    saveCard() {
        const editId = document.getElementById('editId');
        const inputName = document.getElementById('inputName');
        const inputType = document.getElementById('inputType');
        const inputAuthor = document.getElementById('inputAuthor');
        const inputDesc = document.getElementById('inputDesc');
        const inputCover = document.getElementById('inputCover');

        if (!editId || !inputName || !inputType || !inputAuthor || !inputDesc || !inputCover) {
            return;
        }

        const id = editId.value;
        const name = inputName.value.trim();
        const type = inputType.value;
        const author = inputAuthor.value.trim();
        const desc = inputDesc.value.trim();
        const cover = inputCover.value.trim();

        if (!name) {
            this.showToast('请输入作品名称', 'error');
            return;
        }

        if (id) {
            // 编辑现有作品
            const gameIndex = this.data.games.findIndex(g => g.id === parseInt(id));
            if (gameIndex !== -1) {
                this.data.games[gameIndex] = {
                    ...this.data.games[gameIndex],
                    name,
                    type,
                    author,
                    desc,
                    cover: cover || this.data.games[gameIndex].cover
                };
                this.showToast('作品已更新', 'success');
            }
        } else {
            // 添加新作品
            const newId = Math.max(...this.data.games.map(g => g.id), 0) + 1;
            this.data.games.push({
                id: newId,
                name,
                type,
                author,
                desc,
                cover: cover || './img/aaa.jpg'
            });
            this.showToast('作品添加成功', 'success');
        }

        this.saveData();
        this.closeModal();
        this.renderAll();
    },

    // 打开删除确认模态框
    openDeleteModal(id) {
        const game = this.data.games.find(g => g.id === id);
        if (!game) {
            this.showToast('未找到该作品', 'error');
            return;
        }

        this.data.pendingDeleteId = id;

        const deleteMessage = document.getElementById('deleteMessage');
        const deleteModal = document.getElementById('deleteModal');

        if (deleteMessage && deleteModal) {
            deleteMessage.textContent = `确定要删除「${game.name}」吗？此操作不可撤销。`;
            deleteModal.classList.add('active');
        }
    },

    // 关闭删除模态框
    closeDeleteModal() {
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) {
            deleteModal.classList.remove('active');
        }
        this.data.pendingDeleteId = null;
    },

    // 确认删除
    confirmDelete() {
        if (this.data.pendingDeleteId === null) return;

        const index = this.data.games.findIndex(g => g.id === this.data.pendingDeleteId);
        if (index !== -1) {
            this.data.games.splice(index, 1);
            this.data.fav = this.data.fav.filter(id => id !== this.data.pendingDeleteId);
            this.saveData();
            this.showToast('作品已删除', 'success');
            this.renderAll();
        }

        this.closeDeleteModal();
    },

    // 切换操作菜单
    toggleMenu(id) {
        this.closeAllMenus();
        const menu = document.getElementById(`menu-${id}`);
        if (menu) {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        }
    },

    // 关闭所有菜单
    closeAllMenus() {
        document.querySelectorAll('.card-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    },

    // 点击卡片打开详情页
    openDetail(id) {
        window.location.href = 'detail.html?id=' + id;
    },

    // 关闭详情模态框
    closeDetailModal() {
        const modal = document.getElementById('detailModal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }
};

// Hero Section Scroll Animation with First Visit Detection
/**
 * Hero全屏滚动组件
 * 负责首次访问时全屏图片展示及滚动动画效果
 */
const HeroScroll = {
    // 配置参数
    config: {
        scrollThreshold: 100,
        preloadTimeout: 5000,
        animationDuration: 600,
        autoCloseDelay: 8000, // 预设自动关闭时间（毫秒）
        interactionDelay: 1000 // 页面加载后延迟启用交互检测（毫秒）
    },
    
    init() {
        const isHomePage = window.location.pathname.endsWith('index.html') || 
                          window.location.pathname.endsWith('/') ||
                          window.location.pathname === '';
        
        if (!isHomePage) {
            return;
        }
        
        // 获取DOM元素
        this.heroSection = document.getElementById('heroSection');
        this.pageContent = document.getElementById('pageContent');
        this.globalNav = document.getElementById('globalNav');
        this.lastScrollY = window.scrollY;
        this.hasScrolledPast = false;
        this.isFirstVisit = this.checkFirstVisit();
        this.animationComplete = false;
        this.isImageLoaded = false;
        this.hasUserInteracted = false; // 用户是否已交互
        this.autoCloseTimer = null; // 自动关闭定时器
        this.scrollListenerEnabled = false; // 滚动监听是否已启用
        
        if (this.heroSection && this.pageContent) {
            // 初始化页面状态
            this.initPageState();
            
            // 启动图片预加载
            this.preloadHeroImage();
            
            // 设置用户交互监听（点击、触摸、按键）
            this.setupInteractionListeners();
            
            // 延迟启用滚动监听，避免页面加载时的误触发
            setTimeout(() => {
                this.enableScrollListener();
            }, this.config.interactionDelay);
        }
    },
    
    /**
     * 检查是否为首次访问
     * 使用localStorage记录访问状态
     */
    checkFirstVisit() {
        const hasVisited = localStorage.getItem('hasVisitedHome');
        if (!hasVisited) {
            localStorage.setItem('hasVisitedHome', 'true');
            return true;
        }
        return false;
    },
    
    /**
     * 初始化页面状态
     */
    initPageState() {
        if (!this.isFirstVisit) {
            this.heroSection.classList.add('scrolled');
            this.pageContent.classList.add('shifted');
            if (this.globalNav) {
                this.globalNav.style.opacity = '1';
                this.globalNav.style.pointerEvents = 'auto';
            }
        } else {
            // 首次访问时隐藏导航栏，显示加载状态
            if (this.globalNav) {
                this.globalNav.style.opacity = '0';
                this.globalNav.style.pointerEvents = 'none';
            }
            this.heroSection.classList.add('loading');
        }
    },
    
    /**
     * 预加载Hero图片
     * 使用渐进式加载策略，先加载低质量占位图，再加载原图
     */
    preloadHeroImage() {
        const heroBgImg = this.heroSection.querySelector('.hero-bg img');
        if (!heroBgImg) return;
        
        const originalSrc = heroBgImg.getAttribute('data-src') || heroBgImg.src;
        
        // 创建图片预加载器
        const img = new Image();
        
        // 加载完成处理
        const onLoad = () => {
            this.onImageLoaded();
            img.removeEventListener('load', onLoad);
            img.removeEventListener('error', onError);
        };
        
        // 加载失败处理
        const onError = () => {
            console.warn('Hero image failed to load, using fallback');
            this.onImageLoaded();
            img.removeEventListener('load', onLoad);
            img.removeEventListener('error', onError);
        };
        
        img.addEventListener('load', onLoad);
        img.addEventListener('error', onError);
        
        // 开始加载
        img.src = originalSrc;
        
        // 设置超时机制，防止无限等待
        setTimeout(() => {
            if (!this.isImageLoaded) {
                console.log('Hero image load timeout, proceeding with fallback');
                this.onImageLoaded();
            }
        }, this.config.preloadTimeout);
    },
    
    /**
     * 图片加载完成回调
     */
    onImageLoaded() {
        if (this.isImageLoaded) return;
        
        this.isImageLoaded = true;
        
        // 移除加载状态，添加加载完成状态
        if (this.heroSection) {
            requestAnimationFrame(() => {
                this.heroSection.classList.remove('loading');
                this.heroSection.classList.add('image-loaded');
            });
        }
        
        // 图片加载完成后启动自动关闭定时器
        this.startAutoCloseTimer();
    },
    
    /**
     * 设置用户交互监听（点击、触摸、按键）
     */
    setupInteractionListeners() {
        const self = this;
        
        // 点击事件
        document.addEventListener('click', () => {
            self.handleUserInteraction();
        }, { once: true });
        
        // 触摸事件
        document.addEventListener('touchstart', () => {
            self.handleUserInteraction();
        }, { once: true });
        
        // 键盘事件（排除ESC键）
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') {
                self.handleUserInteraction();
            }
        }, { once: true });
        
        // 鼠标滚轮事件
        document.addEventListener('wheel', () => {
            self.handleUserInteraction();
        }, { once: true, passive: true });
        
        // 触摸滚动事件
        document.addEventListener('touchmove', () => {
            self.handleUserInteraction();
        }, { once: true, passive: true });
    },
    
    /**
     * 处理用户交互
     */
    handleUserInteraction() {
        if (this.hasUserInteracted) return;
        
        this.hasUserInteracted = true;
        console.log('用户已交互');
    },
    
    /**
     * 启动自动关闭定时器
     */
    startAutoCloseTimer() {
        if (this.autoCloseTimer) return;
        
        this.autoCloseTimer = setTimeout(() => {
            // 自动关闭开屏大图
            this.closeHeroSection();
        }, this.config.autoCloseDelay);
    },
    
    /**
     * 关闭开屏大图（执行跳转动画）
     */
    closeHeroSection() {
        if (this.hasScrolledPast) return;
        
        this.hasScrolledPast = true;
        this.animationComplete = true;
        
        if (this.heroSection) {
            this.heroSection.classList.add('scrolled');
        }
        if (this.pageContent) {
            this.pageContent.classList.add('shifted');
        }
        if (this.globalNav) {
            this.globalNav.style.opacity = '1';
            this.globalNav.style.pointerEvents = 'auto';
        }
        
        // 清除定时器
        if (this.autoCloseTimer) {
            clearTimeout(this.autoCloseTimer);
            this.autoCloseTimer = null;
        }
    },
    
    /**
     * 启用滚动监听
     */
    enableScrollListener() {
        if (this.scrollListenerEnabled) return;
        
        this.scrollListenerEnabled = true;
        this.setupScrollListener();
        console.log('滚动监听已启用');
    },
    
    setupScrollListener() {
        const self = this;
        let ticking = false;
        
        const updateScroll = () => {
            const currentScrollY = window.scrollY;
            
            // 只有在图片加载完成后才响应滚动事件
            if (!self.isImageLoaded) {
                self.lastScrollY = currentScrollY;
                ticking = false;
                return;
            }
            
            if (currentScrollY > self.scrollThreshold) {
                self.hasScrolledPast = true;
                self.animationComplete = true;
                
                if (!self.heroSection.classList.contains('scrolled')) {
                    self.heroSection.classList.add('scrolled');
                }
                if (!self.pageContent.classList.contains('shifted')) {
                    self.pageContent.classList.add('shifted');
                }
                if (self.globalNav) {
                    self.globalNav.style.opacity = '1';
                    self.globalNav.style.pointerEvents = 'auto';
                }
                
                // 清除自动关闭定时器
                if (self.autoCloseTimer) {
                    clearTimeout(self.autoCloseTimer);
                    self.autoCloseTimer = null;
                }
            }
            
            self.lastScrollY = currentScrollY;
            ticking = false;
        };
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateScroll);
                ticking = true;
            }
        }, { passive: true });
    },
    
    resetToFullscreen() {
        this.hasScrolledPast = false;
        this.animationComplete = false;
        this.heroSection.classList.remove('scrolled');
        this.pageContent.classList.remove('shifted');
        if (this.globalNav && this.isFirstVisit) {
            this.globalNav.style.opacity = '0';
            this.globalNav.style.pointerEvents = 'none';
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // 重新启动自动关闭定时器
        if (this.isImageLoaded) {
            this.startAutoCloseTimer();
        }
    },
    
    resetVisitStatus() {
        localStorage.removeItem('hasVisitedHome');
        this.isFirstVisit = true;
        this.animationComplete = false;
        this.hasScrolledPast = false;
        this.hasUserInteracted = false;
        this.heroSection.classList.remove('scrolled');
        this.heroSection.classList.remove('image-loaded');
        this.pageContent.classList.remove('shifted');
        if (this.globalNav) {
            this.globalNav.style.opacity = '0';
            this.globalNav.style.pointerEvents = 'none';
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

// 滚动到内容区域
function scrollToContent() {
    const pageContent = document.getElementById('pageContent');
    if (pageContent) {
        const offset = 60; // 导航栏高度
        const contentTop = pageContent.getBoundingClientRect().top + window.scrollY - offset;
        
        window.scrollTo({
            top: contentTop,
            behavior: 'smooth'
        });
    }
}

// Global Navigation Functions
function toggleUserMenu() {
    const wrapper = document.getElementById('userMenuWrapper');
    if (wrapper) {
        wrapper.classList.toggle('active');
    }
}

function toggleMobileMenu() {
    const overlay = document.getElementById('mobileMenuOverlay');
    if (overlay) {
        overlay.classList.toggle('active');
    }
}

function openLoginModal() {
    // 关闭用户菜单
    const wrapper = document.getElementById('userMenuWrapper');
    if (wrapper) {
        wrapper.classList.remove('active');
    }
    
    // 创建登录模态框
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'loginModal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h3>用户登录</h3>
                <button class="modal-close" onclick="closeLoginModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="loginEmail">邮箱</label>
                    <input type="email" id="loginEmail" placeholder="请输入邮箱">
                </div>
                <div class="form-group">
                    <label for="loginPassword">密码</label>
                    <input type="password" id="loginPassword" placeholder="请输入密码">
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <label style="display: flex; align-items: center; gap: 5px;">
                        <input type="checkbox" id="rememberMe">
                        <span style="font-size: 13px;">记住我</span>
                    </label>
                    <a href="#" style="font-size: 13px; color: var(--primary);">忘记密码?</a>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel" onclick="closeLoginModal()">取消</button>
                <button class="btn-submit" onclick="handleLogin()">登录</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // 点击外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeLoginModal();
    });
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.remove();
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // 模拟登录
    if (email && password) {
        // 保存登录状态
        localStorage.setItem('user', JSON.stringify({
            name: email.split('@')[0] || '用户',
            email: email,
            loggedIn: true
        }));
        
        // 更新导航栏用户信息
        updateUserMenu(email.split('@')[0] || '用户');
        
        closeLoginModal();
        showToast('登录成功！', 'success');
    } else {
        showToast('请输入邮箱和密码', 'error');
    }
}

function handleLogout() {
    // 清除登录状态
    localStorage.removeItem('user');
    
    // 更新导航栏用户信息
    updateUserMenu('游客用户');
    
    // 关闭用户菜单
    const wrapper = document.getElementById('userMenuWrapper');
    if (wrapper) {
        wrapper.classList.remove('active');
    }
    
    showToast('已退出登录', 'success');
}

function updateUserMenu(userName) {
    const nameElement = document.querySelector('.user-menu-name');
    if (nameElement) {
        nameElement.textContent = userName;
    }
}

// 统一的轮播图组件
const Carousel = {
    defaultSlides: [
        {
            image: './img/aaa.jpg',
            title: '资源分享交流',
            description: '和网U们一起交流捏',
            alt: '资源分享交流'
        },
        {
            image: './img/BochiRock.png',
            title: '关注我们',
            description: '灌注池上藻喵,灌注池上藻谢谢喵',
            alt: '灌注池上藻喵',
            objectPosition: 'center 20%'
        },
        {
            image: './img/rewriteBCG.png',
            title: 'Gal高手',
            description: '加入我们校旮旯群,成为旮旯高手',
            alt: 'Gal高手',
            objectPosition: 'center 70%'  
        }
    ],
    
    container: null,
    slides: [],
    indicators: [],
    prevBtn: null,
    nextBtn: null,
    carouselEl: null,
    currentIndex: 0,
    interval: null,
    autoPlayDelay: 3000,
    
    init(slideData = null) {
        const slidesData = slideData || this.defaultSlides;
        
        this.carouselEl = document.querySelector('.carousel');
        const carouselContainer = document.querySelector('.carousel-container');
        const indicatorsContainer = document.querySelector('.carousel-indicators');
        
        if (!carouselContainer || !indicatorsContainer || !this.carouselEl) {
            console.warn('轮播图容器未找到');
            return;
        }
        
        carouselContainer.innerHTML = '';
        indicatorsContainer.innerHTML = '';
        
        slidesData.forEach((slide, index) => {
            const slideEl = document.createElement('div');
            slideEl.className = `carousel-slide${index === 0 ? ' active' : ''}`;
            // 设置图片的 objectPosition，如果没有指定则默认为 center center
            const objPos = slide.objectPosition || 'center center';
            slideEl.innerHTML = `
                <img src="${slide.image}" alt="${slide.alt || slide.title}" style="object-position: ${objPos};">
                <div class="carousel-content">
                    <h3>${slide.title}</h3>
                    <p>${slide.description}</p>
                </div>
            `;
            carouselContainer.appendChild(slideEl);
            
            const indicator = document.createElement('button');
            indicator.className = index === 0 ? 'active' : '';
            indicator.setAttribute('data-index', index);
            indicatorsContainer.appendChild(indicator);
        });
        
        this.slides = document.querySelectorAll('.carousel-slide');
        this.indicators = document.querySelectorAll('.carousel-indicators button');
        this.prevBtn = document.querySelector('.carousel-prev');
        this.nextBtn = document.querySelector('.carousel-next');
        
        this.bindEvents();
        this.startAutoPlay();
    },
    
    bindEvents() {
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        if (this.carouselEl) {
            this.carouselEl.addEventListener('mouseenter', () => this.stopAutoPlay());
            this.carouselEl.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    },
    
    goToSlide(index) {
        if (index < 0 || index >= this.slides.length) return;
        
        this.slides.forEach((slide, i) => {
            slide.classList.remove('active');
            this.indicators[i].classList.remove('active');
        });
        
        this.slides[index].classList.add('active');
        this.indicators[index].classList.add('active');
        this.currentIndex = index;
    },
    
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.goToSlide(this.currentIndex);
    },
    
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(this.currentIndex);
    },
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.interval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    },
    
    stopAutoPlay() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },
    
    updateSlides(newSlides) {
        this.stopAutoPlay();
        this.init(newSlides);
    },
    
    getCurrentIndex() {
        return this.currentIndex;
    }
};

// 点击外部关闭用户菜单
document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('userMenuWrapper');
    const mobileMenu = document.getElementById('mobileMenuOverlay');
    
    if (wrapper && !e.target.closest('.user-menu-wrapper')) {
        wrapper.classList.remove('active');
    }
    
    if (mobileMenu && !e.target.closest('.nav-toggle') && !e.target.closest('.mobile-menu-overlay')) {
        mobileMenu.classList.remove('active');
    }
});

// 初始化用户状态
function initUserStatus() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            if (user.loggedIn && user.name) {
                updateUserMenu(user.name);
            }
        } catch (e) {
            console.error('解析用户数据失败:', e);
        }
    }
}

// 音乐播放器模块
const MusicPlayer = {
    audio: null,
    currentIndex: 0,
    isPlaying: false,
    isMuted: false,
    volume: 0.5,
    currentTime: 0,
    progressTimer: null,
    
    // 默认音乐列表
    musicList: [
        {
            id: 1,
            title: "猛独が襲う",
            artist: "STUDY WITH MIKU",
            url: "./bgm/猛独が襲う - STUDY WITH MIKU ver. - - STUDY WITH MIKU.mp3"
        },
        {
            id: 2,
            title: "海底、月明かり - ヨルシカ",
            artist: "轻音乐",
            url: "./bgm/海底、月明かり - ヨルシカ.mp3"
        },
        {
            id: 3,
            title: "蓬莱伝説",
            artist: "环境音乐",
            url: "./bgm/蓬莱伝説.mp3"
        },
        {
            id: 4,
            title: "最澄澈的空与海",
            artist: "New Age",
            url: "./bgm/最澄澈的空与海·2022 - 肥兔.mp3"
        },
        {
            id: 5,
            title: "WHITE ALBUM PIANO",
            artist: "治愈系",
            url: "./bgm/WHITE ALBUM PIANO - 石川真也.mp3"
        }
    ],
    
    bindElements() {
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.volumeBtn = document.getElementById('volumeBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.progressThumb = document.getElementById('progressThumb');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
        this.musicTitle = document.getElementById('musicTitle');
        this.musicArtist = document.getElementById('musicArtist');
        this.musicListEl = document.getElementById('musicList');
    },
    
    bindEvents() {
        if (this.playBtn) {
            this.playBtn.addEventListener('click', () => this.togglePlay());
        }
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.playPrev());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.playNext());
        }
        
        if (this.volumeBtn) {
            this.volumeBtn.addEventListener('click', () => this.toggleMute());
        }
        
        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value / 100);
            });
        }
        
        if (this.progressBar) {
            this.progressBar.addEventListener('click', (e) => {
                const rect = this.progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                this.setProgress(percent);
            });
        }
        
        // 音频事件
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.onTrackEnd());
        this.audio.addEventListener('error', (e) => {
            console.error('音频播放错误:', e);
            showToast('音频加载失败', 'error');
            this.playNext();
        });
        
        // 关键修复：监听播放和暂停事件，同步按钮状态
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayButton();
            this.savePlayState();
        });
        
        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayButton();
            this.savePlayState();
        });
    },
    
    renderMusicList() {
        if (!this.musicListEl) return;
        
        this.musicListEl.innerHTML = this.musicList.map((music, index) => `
            <div class="music-item ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <span class="music-item-icon">🎵</span>
                <div class="music-item-info">
                    <div class="music-item-title">${music.title}</div>
                    <div class="music-item-artist">${music.artist}</div>
                </div>
            </div>
        `).join('');
        
        // 绑定音乐列表点击事件
        this.musicListEl.querySelectorAll('.music-item').forEach((item, index) => {
            item.addEventListener('click', () => this.playMusic(index));
        });
    },
    
    playMusic(index) {
        if (index < 0 || index >= this.musicList.length) return;
        
        this.currentIndex = index;
        const music = this.musicList[index];
        
        this.audio.src = music.url;
        this.audio.load();
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayButton();
            this.updateMusicInfo();
            this.updateMusicListHighlight();
            this.savePlayState();
        }).catch((e) => {
            console.error('播放失败:', e);
            showToast('播放失败', 'error');
        });
    },
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            if (!this.audio.src) {
                // 如果没有加载音频，播放第一首
                this.playMusic(0);
            } else {
                // 确保从保存的进度开始播放
                if (this.currentTime > 0 && this.currentTime < this.audio.duration) {
                    this.audio.currentTime = this.currentTime;
                }
                
                this.audio.play().catch((e) => {
                    console.error('播放失败:', e);
                    showToast('播放失败', 'error');
                });
            }
        }
    },
    
    pause() {
        this.audio.pause();
        // 音频事件监听器会自动更新isPlaying和按钮状态
    },
    
    playPrev() {
        const newIndex = (this.currentIndex - 1 + this.musicList.length) % this.musicList.length;
        this.playMusic(newIndex);
    },
    
    playNext() {
        const newIndex = (this.currentIndex + 1) % this.musicList.length;
        this.playMusic(newIndex);
    },
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.audio.muted = this.isMuted;
        this.updateVolumeButton();
    },
    
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        this.audio.volume = this.volume;
        this.isMuted = this.volume === 0;
        this.updateVolumeButton();
        if (this.volumeSlider) {
            this.volumeSlider.value = this.volume * 100;
        }
    },
    
    setProgress(percent) {
        const time = percent * this.audio.duration;
        this.audio.currentTime = time;
        this.updateProgress();
    },
    
    updateProgress() {
        if (!this.audio.duration || isNaN(this.audio.duration)) return;
        
        const percent = this.audio.currentTime / this.audio.duration;
        const progressWidth = percent * 100;
        
        if (this.progressFill) {
            this.progressFill.style.width = `${progressWidth}%`;
        }
        if (this.progressThumb) {
            this.progressThumb.style.left = `${progressWidth}%`;
        }
        
        if (this.currentTimeEl) {
            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        }
        
        // 更新保存的播放进度
        this.currentTime = this.audio.currentTime;
    },
    
    updateDuration() {
        if (this.durationEl && this.audio.duration) {
            this.durationEl.textContent = this.formatTime(this.audio.duration);
        }
    },
    
    updatePlayButton() {
        if (this.playBtn) {
            this.playBtn.textContent = this.isPlaying ? '⏸' : '▶';
        }
    },
    
    updateVolumeButton() {
        if (this.volumeBtn) {
            if (this.isMuted || this.volume === 0) {
                this.volumeBtn.textContent = '🔇';
            } else if (this.volume < 0.5) {
                this.volumeBtn.textContent = '🔉';
            } else {
                this.volumeBtn.textContent = '🔊';
            }
        }
    },
    
    updateMusicInfo() {
        const music = this.musicList[this.currentIndex];
        if (this.musicTitle) {
            this.musicTitle.textContent = music.title;
        }
        if (this.musicArtist) {
            this.musicArtist.textContent = music.artist;
        }
    },
    
    updateMusicListHighlight() {
        if (!this.musicListEl) return;
        
        this.musicListEl.querySelectorAll('.music-item').forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });
    },
    
    onTrackEnd() {
        this.playNext();
    },
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    
    savePlayState() {
        const state = {
            currentIndex: this.currentIndex,
            isPlaying: this.isPlaying,
            volume: this.volume,
            isMuted: this.isMuted,
            currentTime: this.audio ? this.audio.currentTime : 0,
            lastSaved: Date.now()
        };
        localStorage.setItem('musicPlayerState', JSON.stringify(state));

        // 同时保存到sessionStorage，用于跨页面保持播放状态
        sessionStorage.setItem('musicPlayerPlaying', this.isPlaying ? 'true' : 'false');
        sessionStorage.setItem('musicPlayerCurrentIndex', this.currentIndex.toString());
        sessionStorage.setItem('musicPlayerCurrentTime', (this.audio ? this.audio.currentTime : 0).toString());
        if (this.audio && this.audio.src) {
            sessionStorage.setItem('musicPlayerLastSrc', this.audio.src);
        }
    },
    
    // 优化的初始化方法 - 修复跨页面播放状态保持和按钮状态同步问题
    init() {
        // 如果Audio对象已存在，复用它
        if (!this.audio) {
            this.audio = new Audio();
        }

        this.audio.volume = this.volume;

        // 先加载保存的播放状态，确定正确的currentIndex
        this.loadPlayStatePreserve();

        this.bindElements();
        this.bindEvents();
        this.renderMusicList();
        this.updateMusicListHighlight();

        // 关键修复：初始化完成后，同步按钮状态与音频实际状态
        this.syncButtonStateWithAudio();

        // 尝试恢复播放（需要用户交互，浏览器安全限制）
        const wasPlaying = sessionStorage.getItem('musicPlayerPlaying') === 'true';
        if (wasPlaying && this.audio.src) {
            this.audio.addEventListener('canplay', () => {
                // 由于浏览器限制，不能自动播放，但保持按钮状态正确
                this.isPlaying = false;
                this.updatePlayButton();
                if (this.musicArtist && this.currentTime > 0) {
                    this.musicArtist.textContent = '点击播放继续';
                }
            }, { once: true });
        }

        // 启动定期保存进度
        this.startProgressTimer();
    },
    
    // 同步按钮状态与音频实际状态
    syncButtonStateWithAudio() {
        if (this.audio && this.playBtn) {
            // 音频的paused属性反映实际播放状态
            this.isPlaying = !this.audio.paused;
            this.updatePlayButton();
        }
    },

    // 仅加载状态不渲染列表（用于恢复状态）
    loadPlayStateOnly() {
        const savedState = localStorage.getItem('musicPlayerState');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                const now = Date.now();
                const timeSinceSave = now - state.lastSaved;

                if (timeSinceSave > 1800000) {
                    return;
                }

                this.currentIndex = state.currentIndex || 0;
                this.volume = state.volume || 0.5;
                this.isMuted = state.isMuted || false;
                this.currentTime = state.currentTime || 0;
            } catch (e) {
                console.error('加载播放状态失败:', e);
            }
        }
    },

    // 保持播放连续性的状态加载
    loadPlayStatePreserve() {
        const savedState = localStorage.getItem('musicPlayerState');
        const currentSrc = this.audio ? this.audio.src : '';

        if (savedState) {
            try {
                const state = JSON.parse(savedState);
                const now = Date.now();
                const timeSinceSave = now - state.lastSaved;

                // 如果保存时间超过30分钟，重置播放状态
                if (timeSinceSave > 1800000) {
                    console.log('播放状态已过期，重新开始');
                    // 重置为默认状态
                    this.currentIndex = 0;
                    this.volume = 0.5;
                    this.isMuted = false;
                    this.currentTime = 0;
                    return;
                }

                this.currentIndex = state.currentIndex || 0;
                this.volume = state.volume || 0.5;
                this.isMuted = state.isMuted || false;
                this.currentTime = state.currentTime || 0;

                this.audio.volume = this.volume;
                this.audio.muted = this.isMuted;

                if (this.volumeSlider) {
                    this.volumeSlider.value = this.volume * 100;
                }

                this.updateVolumeButton();
                this.updateMusicInfo();
                this.updateMusicListHighlight();

                // 加载当前歌曲（仅当音频源不同时才加载）
                const music = this.musicList[this.currentIndex];
                if (music) {
                    const newSrc = music.url;

                    // 只有当音频源改变或不同时，才重新加载
                    if (!currentSrc || currentSrc !== newSrc) {
                        this.audio.src = newSrc;
                        this.audio.load();

                        this.audio.addEventListener('loadedmetadata', () => {
                            if (this.currentTime > 0 && this.currentTime < this.audio.duration) {
                                this.audio.currentTime = this.currentTime;
                            }

                            // 如果之前正在播放，设置按钮状态但不自动播放（浏览器限制）
                            if (state.isPlaying) {
                                this.isPlaying = false;
                                this.updatePlayButton();
                                if (this.musicArtist) {
                                    this.musicArtist.textContent = '点击播放继续';
                                }
                            }
                        }, { once: true });
                    } else {
                        // 音频源相同，恢复播放状态（按钮显示）
                        if (state.isPlaying) {
                            this.isPlaying = false; // 由于浏览器限制，不能自动播放
                            this.updatePlayButton();
                            if (this.musicArtist) {
                                this.musicArtist.textContent = '点击播放继续';
                            }
                        } else {
                            this.isPlaying = false;
                            this.updatePlayButton();
                        }
                    }
                }
            } catch (e) {
                console.error('加载播放状态失败:', e);
            }
        }
    },
    
    // 定期保存播放进度
    startProgressTimer() {
        if (this.progressTimer) {
            clearInterval(this.progressTimer);
        }
        this.progressTimer = setInterval(() => {
            if (this.isPlaying && this.audio.currentTime > 0) {
                this.savePlayState();
            }
        }, 3000); // 每3秒保存一次
    },
    
    // 清理定时器（页面卸载时调用）
    destroy() {
        if (this.progressTimer) {
            clearInterval(this.progressTimer);
            this.progressTimer = null;
        }
    }
};


// 音乐侧边栏切换功能
function toggleMusicSidebar() {
    const sidebar = document.getElementById('musicSidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// 页面加载完成后初始化
window.onload = function() {
    App.init();
    HeroScroll.init();
    initUserStatus();
    MusicPlayer.init();
    
    // 自动打开音乐侧边栏（如果之前正在播放）
    const savedState = localStorage.getItem('musicPlayerState');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            if (state.isPlaying) {
                const sidebar = document.getElementById('musicSidebar');
                if (sidebar) {
                    sidebar.classList.add('active');
                }
            }
        } catch (e) {
            console.error('解析播放状态失败:', e);
        }
    }
};

// 页面关闭前保存播放状态
window.addEventListener('beforeunload', () => {
    MusicPlayer.savePlayState();
});