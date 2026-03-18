import re
with open(r'd:\VSproject\Web\firstwork\style.css', 'r', encoding='utf8') as f:
    text = f.read()

# I will replace the broken section starting with @media up to letter-spacing: 3px
old_pattern = r'''@media \(max-width: 768px\) \{
    \.navbar \{.*?font-size: 0\.95rem;
        font-size: 3\.5rem;
        letter-spacing: 3px;
    \}'''

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

    .hero-text h1 {
        font-size: 3.5rem;
        letter-spacing: 3px;
    }'''

text = re.sub(old_pattern, new_block, text, flags=re.DOTALL)
with open(r'd:\VSproject\Web\firstwork\style.css', 'w', encoding='utf8') as f:
    f.write(text)
print("Fixed CSS!")
