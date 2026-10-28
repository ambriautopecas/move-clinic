const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'../dist');let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const name of ['style.css','services.css','ribbon.css','visit.css','cinema.css','universe.css','universe.js','services.js','ribbon.js','visit.js','cinema.js']){const content=fs.readFileSync(path.join(root,name));const ext=path.extname(name),base=path.basename(name,ext);const hash=crypto.createHash('sha256').update(content).digest('hex').slice(0,10);const file=`${base}.${hash}${ext}`;fs.writeFileSync(path.join(root,file),content);html=html.replace(new RegExp(`(["'])${base}(?:\\.[a-f0-9]{10})?\\${ext}(["'])`,'g'),`$1${file}$2`)}
fs.writeFileSync(path.join(root,'index.html'),html);console.log('CSS and entry scripts versioned.');

