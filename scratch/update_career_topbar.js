const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
    let files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'scratch') continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files = files.concat(getHtmlFiles(fullPath));
        } else if (entry.isFile() && fullPath.endsWith('.html')) {
            files.push(fullPath);
        }
    }
    return files;
}

const rootDir = path.join(__dirname, '..');
const htmlFiles = getHtmlFiles(rootDir);

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Determine the relative path to the root directory
    const relativePath = path.relative(path.dirname(file), rootDir);
    const prefix = relativePath === '' ? './' : relativePath + '/';

    // Regex to match the career link with varying whitespace/newlines
    const regex = /<a href="https:\/\/careers\.uchenab\.edu\.pk\/UCHOJ\.aspx" target="_blank" rel="noopener"[\s\n\r]*class="uc-topbar-link">Careers<\/a>/g;
    
    if (regex.test(content)) {
        content = content.replace(regex, `<a href="${prefix}career/index.html" class="uc-topbar-link">Careers</a>`);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated topbar career link in ${file}`);
    }
});
