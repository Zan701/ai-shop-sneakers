const fs = require('fs');
const files = [
  'c:/Web Zan/ai-shop-sneakers/src/app/(user)/cart/page.tsx',
  'c:/Web Zan/ai-shop-sneakers/src/app/(user)/checkout/success/[id]/page.tsx'
];

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    if (content.startsWith('import { cn } from "@/lib/utils";\n"use client";')) {
      content = content.replace('import { cn } from "@/lib/utils";\n"use client";', '"use client";\nimport { cn } from "@/lib/utils";');
      fs.writeFileSync(file, content);
    } else if (content.startsWith('import { cn } from "@/lib/utils";\n\r\n"use client";')) {
      content = content.replace('import { cn } from "@/lib/utils";\n\r\n"use client";', '"use client";\nimport { cn } from "@/lib/utils";\n');
      fs.writeFileSync(file, content);
    } else if (content.includes('import { cn }')) {
        // Find if use client is anywhere but the top
        const lines = content.split('\n');
        const useClientIndex = lines.findIndex(l => l.includes('"use client"'));
        if (useClientIndex > 0) {
            // Remove use client from wherever it is
            const newLines = lines.filter((l, i) => i !== useClientIndex);
            // Add to top
            newLines.unshift('"use client";');
            fs.writeFileSync(file, newLines.join('\n'));
        }
    }
  } catch (e) {
    console.error(e);
  }
});
console.log('Fixed');
