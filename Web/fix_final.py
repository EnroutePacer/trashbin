import re

with open(r'd:\VSproject\Web\firstwork\style.css', 'r', encoding='utf8') as f:
    text = f.read()

index = text.find('/* 响应式设计 - 移动端适配 */')
if index != -1:
    old_block = text[index:]
    
    new_block = '''/* 响应式设计 - 移动端适配 */
@media (max-width: 768px) {
    .navbar {
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        padding: 0.6rem 1rem;
        gap: 0.3rem;
    }

    .logo {
        font-size: 1.1rem;
        letter-spacing: 1px;
    }

    .nav-links {
        width: auto;
        justify-content: center;
        gap: 0.8rem;
        order: 0;
        margin-top: 0;
    }

    .nav-links a {
        font-size: 0.85rem;
        padding: 0.2rem 0;
    }

    .settings-btn {
        font-size: 1.1rem;
        padding: 0.2rem;
    }

    .settings-btn .arrow {
        display: none;
    }

    .hero-text h1 {
        font-size: 3.5rem;
        letter-spacing: 3px;
    }

    .hero-text p {
        font-size: 1rem;
        padding: 0 1rem;
    }

    .section-dark, .section-light {
        padding: 4rem 1.5rem;
    }

    .section-title {
        font-size: 1.8rem;
        margin-bottom: 3rem;
    }

    .module, .module:nth-child(even) {
        flex-direction: column;
        gap: 2rem;
    }

    .module img {
        max-width: 100%;
        width: 100%;
    }

    .tide-slide {
        transform: translateY(30px);
        animation: none !important;
    }

    .tide-slide.visible {
        transform: translateY(0);
    }

    .academic-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .upload-area {
        padding: 1.5rem;
    }

    #ocean-form input[type="text"] {
        width: 100%;
    }

    .map-container {
        height: 300px;
    }
}
'''
    
    new_text = text[:index] + new_block
    with open(r'd:\VSproject\Web\firstwork\style.css', 'w', encoding='utf8') as f:
        f.write(new_text)
    print('Restored mobile CSS section successfully!')
else:
    print('Could not find the mobile CSS section.')
