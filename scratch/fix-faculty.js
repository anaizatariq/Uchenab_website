const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../academics');
const files = fs.readdirSync(dir).filter(f => f.startsWith('faculty-of-') && f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    // We will do a generic replacement of ANY image with `img-fluid rounded my-3` to be wrapped nicely, 
    // but doing so without breaking standard HTML is tricky.
    
    // Instead, what if we just rely on CSS? 
    // We can inject a <style> block into the `faculties` pages? No, styles.css is better.
    // If the HTML is valid (even if flat), we can use CSS Flexbox to flow the elements if we give `.uc-rich` a specific context, 
    // or we can wrap the whole "People" section.
    
    // Actually, let's just do a clean replacement of the `<img class="img-fluid rounded my-3" ...>` to have a class `uc-faculty-avatar`.
    const newContent = content.replace(/class="img-fluid rounded my-3"/g, 'class="uc-faculty-avatar"');
    
    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log('Modified:', file);
    }
});
