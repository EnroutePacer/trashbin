import os, re
folder = r'd:\VSproject\Web\firstwork'

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return
        
    def repl_src(m):
        attr = m.group(1)
        name = m.group(2)
        ext = m.group(3)
        if name.startswith('http') or name.startswith('photos/'):
            return m.group(0)
        filename = (name + '.' + ext).split('/')[-1]
        return f'{attr}=\"photos/{filename}\"'

    def repl_url(m):
        name = m.group(1)
        ext = m.group(2)
        if name.startswith('http') or name.startswith('photos/'):
            return m.group(0)
        filename = (name + '.' + ext).split('/')[-1]
        return f'url(\"photos/{filename}\")'
        
    new_content = re.sub(r'(src|href)=[\'\"]([^\'\"\>\)]+)\.(jpg|jpeg|png|gif|webp|svg)[\'\"]', repl_src, content, flags=re.I)
    new_content = re.sub(r'url\([\'\"]?([^\'\"\>\)]+)\.(jpg|jpeg|png|gif|webp|svg)[\'\"]?\)', repl_url, new_content, flags=re.I)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {filepath}')

for root, _, files in os.walk(folder):
    if 'photos' in root:
        continue
    for f in files:
        if f.endswith(('.html', '.css', '.js')):
            process_file(os.path.join(root, f))
