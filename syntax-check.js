import fs from 'fs';
import babel from '@babel/core';

const content = fs.readFileSync('src/pages/Home.jsx', 'utf-8');
try {
  babel.transformSync(content, { presets: ['@babel/preset-react'] });
  console.log("Syntax is OK");
} catch(e) {
  console.error("Syntax Error:", e);
}
