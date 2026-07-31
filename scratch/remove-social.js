const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../academics');
const files = fs.readdirSync(dir).filter(f => f.startsWith('faculty-of-') && f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Regex to match the empty social links which are just plain text without proper styling
    // Example: <a target="_blank" rel="noopener">\nFacebook\n<em></em>\t\t\t\t\t</a>
    const regex = /<a[^>]*>\s*(?:Facebook|Twitter|Instagram|LinkedIn)\s*<em><\/em>\s*<\/a>/gi;
    
    const newContent = content.replace(regex, '');
    
    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log('Removed text social links from:', file);
    }
});
