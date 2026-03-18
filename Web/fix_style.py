import re

with open(r'd:\VSproject\Web\firstwork\style.css', 'r', encoding='utf8') as f:
    text = f.read()

old_mobile = '''    .navbar {
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
    }

    .nav-links {
        gap: 1.5rem;
    }'''

new_mobile = '''    .navbar {
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
    }'''

text = text.replace(old_mobile, new_mobile)

# Fix navbar background
text = text.replace('    background: rgba(5, 25, 35, 0.4);\n    backdrop-filter: blur(15px);',
                    '    background: rgba(5, 25, 35, 0.65);\n    backdrop-filter: blur(15px);')

with open(r'd:\VSproject\Web\firstwork\style.css', 'w', encoding='utf8') as f:
    f.write(text)

print("success")
