// lib/generator/math.ts
import { MathToolConfig } from "@/types/tool";

export interface MathProblem {
  id: string;
  numbers: number[];
  correctAnswer: number;
}

export function generateMathProblems(config: MathToolConfig): MathProblem[] {
  const problems: MathProblem[] = [];

  for (let i = 0; i < config.count; i++) {
    const numbers = [];
    let answer = 0;

    if (config.type === "addition") {
      if (config.carryMode === "without-carry") {
        const cols: string[][] = Array.from({ length: config.columns }, () => []);
        for (let d = 0; d < config.digits; d++) {
          let spaceLeft = 9;
          const colDigits = [];
          for (let r = 0; r < config.columns; r++) {
            const isMSD = (d === 0);
            const min = isMSD ? (config.digits === 1 ? 0 : 1) : 0;
            const rowsLeft = config.columns - 1 - r;
            const maxPossible = spaceLeft - (isMSD ? rowsLeft : 0);
            if (maxPossible < min) { colDigits.push(min); }
            else {
              const val = Math.floor(Math.random() * (maxPossible - min + 1)) + min;
              colDigits.push(val);
              spaceLeft -= val;
            }
          }
          for (let j = colDigits.length - 1; j > 0; j--) {
              const k = Math.floor(Math.random() * (j + 1));
              [colDigits[j], colDigits[k]] = [colDigits[k], colDigits[j]];
          }
          for (let r = 0; r < config.columns; r++) {
            cols[r].push(colDigits[r].toString());
          }
        }
        for (let r = 0; r < config.columns; r++) {
          numbers.push(parseInt(cols[r].join("")));
        }
      } else {
        let attempt = 0;
        let generated = false;
        while (attempt < 100 && !generated) {
           attempt++;
           numbers.length = 0;
           for (let c = 0; c < config.columns; c++) {
              const min = config.digits === 1 ? 1 : Math.pow(10, config.digits - 1);
              const max = Math.pow(10, config.digits) - 1;
              numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
           }
           if (config.carryMode === "any") { generated = true; break; }
           let hasCarry = false;
           let carry = 0;
           for (let d = 0; d < config.digits; d++) {
             let colSum = carry;
             for (let r = 0; r < config.columns; r++) {
               const str = numbers[r].toString();
               const idx = str.length - 1 - d;
               colSum += idx >= 0 ? parseInt(str[idx]) : 0;
             }
             if (colSum >= 10) { hasCarry = true; break; }
             carry = Math.floor(colSum / 10);
           }
           if (hasCarry && config.carryMode === "with-carry") { generated = true; break; }
        }
      }
      answer = numbers.reduce((a, b) => a + b, 0);

    } else if (config.type === "subtraction") {
      let top = 0, bottom = 0;
      const bDigits = config.bottomDigits || 1;
      const tMin = config.digits === 1 ? 0 : Math.pow(10, config.digits - 1);
      const tMax = Math.pow(10, config.digits) - 1;
      const bMin = bDigits === 1 ? 0 : Math.pow(10, bDigits - 1);
      const bMax = Math.pow(10, bDigits) - 1;

      if (config.carryMode === "without-carry") {
        let attempt = 0;
        while (attempt < 200) {
           attempt++;
           top = Math.floor(Math.random() * (tMax - tMin + 1)) + tMin;
           bottom = Math.floor(Math.random() * (bMax - bMin + 1)) + bMin;
           
           let hasBorrow = false;
           const maxLen = Math.max(top.toString().length, bottom.toString().length);
           const tArr = top.toString().padStart(maxLen, '0').split('').map(Number);
           const bArr = bottom.toString().padStart(maxLen, '0').split('').map(Number);
           
           for (let k = maxLen - 1; k >= 0; k--) {
             if (tArr[k] < bArr[k]) { hasBorrow = true; break; }
           }
           if (!hasBorrow) break;
        }
      } else {
        let attempt = 0;
        let found = false;
        while (attempt < 100) {
          attempt++;
          top = Math.floor(Math.random() * (tMax - tMin + 1)) + tMin;
          bottom = Math.floor(Math.random() * (bMax - bMin + 1)) + bMin;
          
          if (config.carryMode === "any") { found = true; break; }

          let hasBorrow = false;
          const maxLen = Math.max(top.toString().length, bottom.toString().length);
          const tArr = top.toString().padStart(maxLen, '0').split('').map(Number);
          const bArr = bottom.toString().padStart(maxLen, '0').split('').map(Number);
          for (let k = maxLen - 1; k >= 0; k--) {
            if (tArr[k] < bArr[k]) { hasBorrow = true; break; }
          }
          if (hasBorrow && config.carryMode === "with-carry") { found = true; break; }
        }
        if (!found) {
           top = Math.floor(Math.random() * (tMax - tMin + 1)) + tMin;
           bottom = Math.floor(Math.random() * (bMax - bMin + 1)) + bMin;
        }
      }
      numbers.push(top, bottom);
      answer = top - bottom;

    } else if (config.type === "multiplication") {
      let top = 0, bottom = 0;
      
      const checkMultiplicationCarry = (t: number, b: number) => {
        const tStr = t.toString(), bStr = b.toString();
        const partials = [];
        for (let j = bStr.length - 1; j >= 0; j--) {
          const bd = parseInt(bStr[j]);
          let carry = 0, partialStr = "";
          for (let k = tStr.length - 1; k >= 0; k--) {
            const td = parseInt(tStr[k]);
            const prod = (td * bd) + carry;
            if (prod >= 10) return true;
            carry = Math.floor(prod / 10);
            partialStr = (prod % 10).toString() + partialStr;
          }
          if (carry > 0) return true;
          for(let z=0; z < (bStr.length - 1 - j); z++) partialStr += "0";
          partials.push(partialStr);
        }
        if (partials.length > 1) {
          const maxLen = Math.max(...partials.map(p => p.length));
          const padded = partials.map(p => p.padStart(maxLen, '0'));
          let addCarry = 0;
          for (let c = maxLen - 1; c >= 0; c--) {
             let colSum = addCarry;
             for (let r = 0; r < padded.length; r++) { colSum += parseInt(padded[r][c]); }
             if (colSum >= 10) return true;
             addCarry = Math.floor(colSum / 10);
          }
        }
        return false;
      };

      if (config.carryMode === "without-carry") {
        let attempt = 0, success = false;
        while(attempt < 200) {
          attempt++;
          const botMin = config.columns === 1 ? 1 : Math.pow(10, config.columns - 1);
          const botMax = Math.pow(10, config.columns) - 1;
          bottom = Math.floor(Math.random() * (botMax - botMin + 1)) + botMin;
          let tStr = "";
          for (let d = 0; d < config.digits; d++) {
             const minT = (d === 0 && config.digits > 1) ? 1 : 0;
             tStr += Math.floor(Math.random() * (9 - minT + 1)) + minT;
          }
          top = parseInt(tStr);
          if (checkMultiplicationCarry(top, bottom) === false) { success=true; break; }
        }
        if (!success) {
           let tStr = "";
           for (let d = 0; d < config.digits; d++) { tStr += (d===0 ? "1" : Math.floor(Math.random()*2).toString()); }
           top = parseInt(tStr);
           let bStr = "";
           for (let d = 0; d < config.columns; d++) { bStr += (d===0 ? "1" : Math.floor(Math.random()*2).toString()); }
           bottom = parseInt(bStr);
        }
      } else {
        let attempt = 0;
        while(attempt < 100) {
          attempt++;
          const topMin = config.digits === 1 ? 1 : Math.pow(10, config.digits - 1);
          const topMax = Math.pow(10, config.digits) - 1;
          top = Math.floor(Math.random() * (topMax - topMin + 1)) + topMin;
          const botMin = config.columns === 1 ? 1 : Math.pow(10, config.columns - 1);
          const botMax = Math.pow(10, config.columns) - 1;
          bottom = Math.floor(Math.random() * (botMax - botMin + 1)) + botMin;
          if (config.carryMode === "any") break;
          if (checkMultiplicationCarry(top, bottom) === true) break;
        }
      }
      numbers.push(top, bottom);
      answer = top * bottom;

    } else if (config.type === "division") {
      const divMin = config.columns === 1 ? 1 : Math.pow(10, config.columns - 1);
      const divMax = Math.pow(10, config.columns) - 1;
      const divisor = Math.floor(Math.random() * (divMax - divMin + 1)) + divMin;
      const qMin = 1;
      const qMax = Math.pow(10, config.digits) - 1;
      const quotient = Math.floor(Math.random() * (qMax - qMin + 1)) + qMin;
      let dividend = divisor * quotient;
      if (dividend.toString().length > config.digits && config.digits > 1) {
        let shrunk = parseInt(dividend.toString().slice(0, Math.max(config.digits, 2)));
        shrunk -= shrunk % divisor;
        if (shrunk <= 0) shrunk = divisor;
        dividend = shrunk;
      }
      numbers.push(dividend, divisor);
      answer = dividend / divisor;
    }

    problems.push({
      id: `prob-${Date.now()}-${i}`,
      numbers,
      correctAnswer: answer,
    });
  }

  return problems;
}
