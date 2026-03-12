// 滚动监听：模块淡入淡出与潮汐进入效果
document.addEventListener("DOMContentLoaded", () => {
    // 导航栏平滑滚动
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetDom = document.querySelector(targetId);
            if (targetDom) {
                // 获取导航栏高度以作偏移
                const navHeight = document.querySelector(".navbar").offsetHeight;
                const targetPosition = targetDom.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    const modules = document.querySelectorAll(".module");

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, observerOptions);

    modules.forEach(mod => observer.observe(mod));

    // 照片上传前端逻辑处理
    const fileInput = document.getElementById("photo-upload");
    const fileNameDisplay = document.getElementById("file-name");
    
    fileInput.addEventListener("change", function() {
        if (this.files && this.files.length > 0) {
            fileNameDisplay.textContent = "已选择: " + this.files[0].name;
            fileNameDisplay.style.color = "var(--text-primary)";
        }
    });

    const form = document.getElementById("ocean-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const loc = document.getElementById("location").value;
        if(fileInput.files.length === 0) {
            alert("请选择照片，让海洋见证您的印记。");
            return;
        }
        alert(`您的坐标【${loc}】及影像已投入渊海。在正式版本中，这些数据将汇入云端地图。`);
        form.reset();
        fileNameDisplay.textContent = "未选择文件";
    });

    // 气象与水汽溯源地图 (前端交互模拟)
    // 因无实体气象 API 连接，采用 Leaflet 配合前端模拟积雨云
    initWeatherMap();
});

function initWeatherMap() {
    const map = L.map('weather-map', {
        center: [30.0, 140.0],
        zoom: 2,
        zoomControl: false,
        attributionControl: false
    });

    // 暗色底图，符合典雅深邃的氛围
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    const tooltip = document.getElementById("origin-tooltip");
    
    // 模拟的全球积雨云位置
    const clouds = [
        { lat: 15.0, lng: 130.0, origin: "此股水汽或生于西太平洋的台风眼..." },
        { lat: 40.0, lng: -40.0, origin: "这丝湿润来自北大西洋季风的叹息..." },
        { lat: -10.0, lng: 60.0, origin: "这是印度洋的热流蒸腾而上的水珠..." },
        { lat: -30.0, lng: -120.0, origin: "来自南太平洋的寒流与暖锋交汇之水..." }
    ];

    clouds.forEach(cloudData => {
        // 创建云朵div
        const myIcon = L.divIcon({
            className: 'simulated-cloud',
            iconSize: [80, 80]
        });

        const cloudMarker = L.marker([cloudData.lat, cloudData.lng], {icon: myIcon}).addTo(map);

        cloudMarker.on('mouseover', (e) => {
            tooltip.innerText = cloudData.origin;
            tooltip.style.display = "block";
            tooltip.style.opacity = "1";
        });

        cloudMarker.on('mousemove', (e) => {
            // 将tooltip跟随鼠标，这里简单获取鼠标相对窗口位置
            const x = e.originalEvent.pageX;
            const y = e.originalEvent.pageY;
            tooltip.style.left = (x + 15) + "px";
            tooltip.style.top = (y + 15) + "px";
        });

        cloudMarker.on('mouseout', () => {
            tooltip.style.display = "none";
            tooltip.style.opacity = "0";
        });
    });
}
