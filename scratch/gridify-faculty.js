const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../academics');
const files = fs.readdirSync(dir).filter(f => f.startsWith('faculty-of-') && f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // We want to wrap each professor's block.
    // Pattern: 
    // <a href="...">
    // <img class="uc-faculty-avatar" ...> </a>
    // <a href="...">Name</a>
    // <a href="...">Role</a>
    // <p class="uc-editorial-text"><a ...>View Profile ...</a></p>
    
    // Let's match the avatar and the stuff following it until the next avatar or the end of the section.
    // Actually, a simpler regex:
    // Match the opening <a> tag for the image, up to the end of the View Profile <p> tag.
    
    // Some don't have View Profile. 
    // Let's replace the whole sequence.
    
    const regex1 = /<a[^>]*>\s*<img class="uc-faculty-avatar"[^>]*src="([^"]+)"[^>]*>\s*<\/a>\s*<a[^>]*>([^<]+)<\/a>\s*<a[^>]*>([^<]+)<\/a>\s*(?:<p class="uc-editorial-text"><a[^>]*href="([^"]+)"[^>]*>.*?<\/a><\/p>)?/gi;

    let modifiedContent = content.replace(regex1, (match, imgSrc, name, role, profileLink) => {
        profileLink = profileLink || '#';
        return `
<div class="col-md-6 col-lg-4 mb-5 text-center uc-faculty-member-card">
    <a href="${profileLink}" class="d-block mb-3">
        <img class="uc-faculty-avatar-img" src="${imgSrc}" alt="${name.trim()}">
    </a>
    <h4 class="uc-faculty-name"><a href="${profileLink}" class="text-decoration-none text-dark">${name.trim()}</a></h4>
    <p class="uc-faculty-role text-muted small mb-2">${role.trim()}</p>
    <a href="${profileLink}" class="uc-faculty-link small fw-bold">View Profile &rarr;</a>
</div>`;
    });

    // Also match the ones without <a> around the name/role, e.g.:
    // <img class="uc-faculty-avatar" src="..."> Name \n Role <p>...
    const regex2 = /<img class="uc-faculty-avatar"[^>]*src="([^"]+)"[^>]*>\s*([A-Za-z\s\.-]+)\s*\n\s*([A-Za-z\s\.-]+)<p class="uc-editorial-text"><a[^>]*href="([^"]+)"[^>]*>.*?<\/a><\/p>/gi;
    
    modifiedContent = modifiedContent.replace(regex2, (match, imgSrc, name, role, profileLink) => {
        profileLink = profileLink || '#';
        return `
<div class="col-md-6 col-lg-4 mb-5 text-center uc-faculty-member-card">
    <a href="${profileLink}" class="d-block mb-3">
        <img class="uc-faculty-avatar-img" src="${imgSrc}" alt="${name.trim()}">
    </a>
    <h4 class="uc-faculty-name"><a href="${profileLink}" class="text-decoration-none text-dark">${name.trim()}</a></h4>
    <p class="uc-faculty-role text-muted small mb-2">${role.trim()}</p>
    <a href="${profileLink}" class="uc-faculty-link small fw-bold">View Profile &rarr;</a>
</div>`;
    });
    
    // Also match the ones with <h3>
    // <img class="uc-faculty-avatar" src="..."> </a> <h3> <a>Name</a> </h3> <h3> <a>Role</a> </h3>
    const regex3 = /<img class="uc-faculty-avatar"[^>]*src="([^"]+)"[^>]*>(?:\s*<\/a>)?\s*<h3[^>]*>(?:\s*<a[^>]*>)?([^<]+)(?:<\/a>\s*)?<\/h3>\s*<h3[^>]*>(?:\s*<a[^>]*>)?([^<]+)(?:<\/a>\s*)?<\/h3>\s*(?:<h3[^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>.*?<\/a>\s*<\/h3>)?/gi;

    modifiedContent = modifiedContent.replace(regex3, (match, imgSrc, name, role, profileLink) => {
        profileLink = profileLink || '#';
        return `
<div class="col-md-6 col-lg-4 mb-5 text-center uc-faculty-member-card">
    <a href="${profileLink}" class="d-block mb-3">
        <img class="uc-faculty-avatar-img" src="${imgSrc}" alt="${name.trim()}">
    </a>
    <h4 class="uc-faculty-name"><a href="${profileLink}" class="text-decoration-none text-dark">${name.trim()}</a></h4>
    <p class="uc-faculty-role text-muted small mb-2">${role.trim()}</p>
    <a href="${profileLink}" class="uc-faculty-link small fw-bold">View Profile &rarr;</a>
</div>`;
    });

    // Now wrap all contiguous `.uc-faculty-member-card` divs in a `<div class="row">`
    // We can do this by finding the first one and the last one, or just replacing a sequence.
    // Let's use a simpler approach: wrap the whole sequence.
    let inGrid = false;
    let lines = modifiedContent.split('\n');
    let finalContent = [];
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('class="col-md-6 col-lg-4')) {
            if (!inGrid) {
                finalContent.push('<div class="row uc-faculty-grid mt-4">');
                inGrid = true;
            }
            finalContent.push(lines[i]);
        } else {
            // If it's a blank line between cards, ignore it
            if (inGrid && lines[i].trim() === '') {
                finalContent.push(lines[i]);
                continue;
            }
            
            // If it's the end of a card (</div>)
            if (inGrid && lines[i].trim() === '</div>') {
                finalContent.push(lines[i]);
                // Check if next line is another card or blank
                let nextIsCard = false;
                for (let j = i + 1; j < lines.length && j < i + 5; j++) {
                    if (lines[j].includes('class="col-md-6 col-lg-4')) {
                        nextIsCard = true;
                        break;
                    }
                    if (lines[j].trim() !== '') {
                        break; // Found non-empty, non-card line
                    }
                }
                if (!nextIsCard) {
                    finalContent.push('</div> <!-- end row -->');
                    inGrid = false;
                }
            } else {
                if (inGrid && !lines[i].includes('uc-faculty-avatar-img') && !lines[i].includes('uc-faculty-name') && !lines[i].includes('uc-faculty-role') && !lines[i].includes('uc-faculty-link') && !lines[i].includes('<a href=')) {
                    // We exited the grid abruptly
                    finalContent.push('</div> <!-- end row -->');
                    inGrid = false;
                }
                finalContent.push(lines[i]);
            }
        }
    }
    
    modifiedContent = finalContent.join('\n');
    
    // One more pass to fix nested rows if they occurred
    modifiedContent = modifiedContent.replace(/(<\/div>\s*<!-- end row -->\s*)+/g, '</div> <!-- end row -->\n');
    
    if (modifiedContent !== content) {
        fs.writeFileSync(filePath, modifiedContent, 'utf-8');
        console.log('Gridified:', file);
    }
});
