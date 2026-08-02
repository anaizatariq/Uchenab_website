const fs = require('fs');
const path = require('path');

function getHtmlFiles(dir) {
    let files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.name === 'node_modules' || entry.name === '.git') continue;
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files = files.concat(getHtmlFiles(fullPath));
        } else if (entry.isFile() && fullPath.endsWith('.html')) {
            files.push(fullPath);
        }
    }
    return files;
}

const htmlFiles = getHtmlFiles(path.join(__dirname, '..'));

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    if (content.includes('../about/careers.html')) {
        content = content.replace(/\.\.\/about\/careers\.html/g, '../career/index.html');
        changed = true;
    }
    if (content.includes('"about/careers.html"')) {
        content = content.replace(/"about\/careers\.html"/g, '"career/index.html"');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated links in ${file}`);
    }
});
