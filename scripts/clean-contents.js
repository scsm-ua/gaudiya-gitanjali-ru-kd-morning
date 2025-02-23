const fs = require('fs');
const path = require('path');

// Read both files
function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error(`Error reading ${filePath}:`, err);
        return null;
    }
}

// Check if file exists in project
function fileExists(filePath) {
    return fs.existsSync(filePath);
}

// Process file content and remove lines with broken links
function processContent(content, basePath) {
    const lines = content.split('\n');
    const validLines = lines.filter(line => {
        // Check for markdown links [text](path)
        const linkMatch = line.match(/\[.*?\]\((.*?)\)/);
        if (!linkMatch) return true; // Keep lines without links
        
        const linkPath = linkMatch[1];
        const absolutePath = path.join(basePath, linkPath);
        
        return fileExists(absolutePath);
    });

    return validLines.join('\n');
}

// Main function
function cleanContents() {
    const basePath = path.dirname(__dirname);
    const contentsPath = path.join(basePath, 'contents.md');
    const indexPath = path.join(basePath, 'index.md');

    // Process contents.md
    const contentsData = readFile(contentsPath);
    if (contentsData) {
        const cleanContents = processContent(contentsData, basePath);
        fs.writeFileSync(contentsPath, cleanContents);
        console.log('contents.md cleaned');
    }

    // Process index.md
    const indexData = readFile(indexPath);
    if (indexData) {
        const cleanIndex = processContent(indexData, basePath);
        fs.writeFileSync(indexPath, cleanIndex);
        console.log('index.md cleaned');
    }
}

cleanContents();
