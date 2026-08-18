const fs = require('fs');
const files = [
  'c:/Web Zan/ai-shop-sneakers/src/app/(user)/cart/page.tsx',
  'c:/Web Zan/ai-shop-sneakers/src/app/(user)/checkout/success/[id]/page.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('import { cn }')) {
    content = 'import { cn } from "@/lib/utils";\n' + content;
    fs.writeFileSync(file, content);
  }
});
console.log('Imports added successfully');
