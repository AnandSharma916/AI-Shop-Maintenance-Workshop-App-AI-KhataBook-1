const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) { 
      results.push(file);
    }
  });
  return results;
}
const files = walk('d:/Shiv Shakti App/frontend/src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/'http:\/\/localhost:5000/g, '`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + \'');
  content = content.replace(/`http:\/\/localhost:5000/g, '`${import.meta.env.VITE_API_URL || "http://localhost:5000"}` + `');
  fs.writeFileSync(file, content);
});
console.log('Replaced all URLs');
