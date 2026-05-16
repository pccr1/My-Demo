// common.js - 所有子页面共用的功能

// ========== 1. 选项点击事件绑定 ==========
function attachOptionEvents() {
    document.querySelectorAll('.opt-label').forEach(label => {
        label.removeEventListener('click', optionClickHandler);
        label.addEventListener('click', optionClickHandler);
    });
}

function optionClickHandler(e) {
    const target = e.currentTarget;
    const group = target.closest('.options-group');
    if (!group) return;

    const qidx = group.dataset.qidx;
    const oidx = target.dataset.oidx;

    if (typeof window.answers !== 'undefined' && qidx !== undefined) {
        window.answers[qidx] = parseInt(oidx);
    }

    group.querySelectorAll('.opt-label').forEach(l => l.classList.remove('selected'));
    target.classList.add('selected');

    const radio = target.querySelector('input');
    if (radio) radio.checked = true;
}

// ========== 2. 撒花特效 ==========
function startConfetti() {
    const colors = ['#ff77c6', '#ffb347', '#6eff70', '#47a3ff', '#c56eff', '#ff4d4d'];
    for (let i = 0; i < 180; i++) {
        const conf = document.createElement('div');
        conf.className = 'confetti';
        const size = Math.random() * 12 + 6;
        conf.style.width = size + 'px';
        conf.style.height = size + 'px';
        conf.style.left = Math.random() * window.innerWidth + 'px';
        conf.style.top = '-30px';
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        document.body.appendChild(conf);
        setTimeout(() => conf.remove(), 1200);
    }
}

// ========== 3. 显示分享区和赞赏区 ==========
function showShareAndReward() {
    const shareSection = document.getElementById('shareSection');
    const rewardSection = document.getElementById('rewardSection');
    if (shareSection) shareSection.style.display = 'block';
    if (rewardSection) rewardSection.style.display = 'block';
}

// ========== 4. 生成分享图片 ==========
async function generateShareImage(moduleTitle, resultKey, resultDetail) {
    startConfetti();

    const container = document.getElementById('shareImageContainer');
    const today = new Date().toLocaleDateString('zh-CN');
    const homeUrl = window.location.origin + '/index.html';

    container.innerHTML = `
        <div class="module-title">${escapeHtml(moduleTitle)}</div>
        <div class="result-text"><strong>✨ 结果：${escapeHtml(resultKey)} ✨</strong><br><br>${escapeHtml(resultDetail)}</div>
        <div class="date">📅 占卜日期：${today}</div>
        <div class="footer-invite">🎉 快邀请你的好友一起来测试吧！ 🎉</div>
        <div class="qrcode-wrapper" id="qrcodeWrapper"></div>
    `;

    const qrWrapper = document.getElementById('qrcodeWrapper');
    qrWrapper.innerHTML = '';
    const qrDiv = document.createElement('div');
    qrWrapper.appendChild(qrDiv);
    new QRCode(qrDiv, {
        text: homeUrl,
        width: 100,
        height: 100,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });

    await new Promise(r => setTimeout(r, 300));
    const canvas = await html2canvas(container, {
        scale: 2.5,
        backgroundColor: null,
        logging: false,
        useCORS: true,
        allowTaint: false
    });
    const imgData = canvas.toDataURL('image/png');

    const modal = document.getElementById('modalOverlay');
    const modalImg = document.getElementById('modalImage');
    modalImg.src = imgData;
    modal.classList.add('active');

    modal.onclick = (e) => {
        if (e.target === modal) modal.classList.remove('active');
    };
}

// ========== 5. 辅助函数 ==========
function getTodayString() {
    return new Date().toLocaleDateString('zh-CN');
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ========== 6. 自动滚动到结果区域 ==========
function scrollToResult() {
    const resultDiv = document.getElementById('resultArea');
    if (resultDiv && resultDiv.style.display !== 'none') {
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        // 如果结果还没显示，稍等再试
        setTimeout(() => {
            const res = document.getElementById('resultArea');
            if (res && res.style.display !== 'none') res.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

// ========== 7. 返回顶部按钮逻辑 ==========
function initBackToTop() {
    // 创建按钮
    const btn = document.createElement('div');
    btn.id = 'backToTop';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== 8. 页面初始化（自动执行） ==========
document.addEventListener('DOMContentLoaded', () => {
    initBackToTop();
    const modal = document.getElementById('modalOverlay');
    if (modal) {
        modal.onclick = (e) => {
            if (e.target === modal) modal.classList.remove('active');
        };
    }
});