const fs = require('fs');
const path = require('path');
const dir = 'd:/Thực_tập_ETS/Project_ETS/Manegement_Tro_Project/rm-console/src/views';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.vue'));

let updatedFiles = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace width="XXXpx" with width="90%" style="max-width: XXXpx" in <el-dialog ...>
  // Only match inside el-dialog tags
  const regex = /(<el-dialog\b[^>]*?)width="(\d+)px"([^>]*?>)/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, (match, p1, widthVal, p3) => {
      // If it already has style="...", inject max-width.
      if (p1.includes('style="') || p3.includes('style="')) {
        if (!match.includes('style=')) {
          return `${p1}width="90%" style="max-width: ${widthVal}px"${p3}`;
        } else {
          return match.replace(/style="/, `style="max-width: ${widthVal}px; `).replace(/width="\d+px"/, 'width="90%"');
        }
      } else {
        return `${p1}width="90%" style="max-width: ${widthVal}px"${p3}`;
      }
    });
    fs.writeFileSync(filePath, content, 'utf8');
    updatedFiles++;
    console.log('Updated', file);
  }
}
console.log('Total files updated:', updatedFiles);
