import re

with open(r'd:\VSproject\Web\firstwork\style.css', 'r', encoding='utf8') as f:
    text = f.read()

old_block = '@media (max-width: 768px) {\n    .navbar {\n        flex-direction: column;\n        padding: 1rem;\n        gap: 1rem;\n    }\n    \n    .nav-links {\n        gap: 1.5rem;\n    }\n\n    .hero-text h1 {'

new_block = '''@media (max-width: 768px) {
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

    .hero-text h1 {'''

text = text.replace(old_block, new_block)

text = text.replace('    background: rgba(5, 25, 35, 0.4);\n    backdrop-filter: blur(15px);',
                    '    background: rgba(5, 25, 35, 0.65);\n    backdrop-filter: blur(15px);')

with open(r'd:\VSproject\Web\firstwork\style.css', 'w', encoding='utf8') as f:
    f.write(text)
print('Fixed successfully!!')
