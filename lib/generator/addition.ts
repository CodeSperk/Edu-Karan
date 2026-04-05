import { MathToolConfig } from "@/types/tool";

export interface AdditionProblem {
  id: string;
  numbers: number[];
  correctAnswer: number;
}

export function generateAdditionData(config: MathToolConfig): AdditionProblem[] {
  const problems: AdditionProblem[] = [];
  
  for (let i = 0; i < config.count; i++) {
    const numbers = [];
    let sum = 0;
    
    if (config.mode === "custom" && config.numbers && config.numbers.length >= config.columns) {
      for(let c = 0; c < config.columns; c++) {
        numbers.push(config.numbers[c]);
        sum += config.numbers[c];
      }
    } else {
      if (config.carryMode === "without-carry") {
        const cols: string[][] = Array.from({ length: config.columns }, () => []);
        for (let d = 0; d < config.digits; d++) {
          let spaceLeft = 9;
          const colDigits = [];
          for (let r = 0; r < config.columns; r++) {
            const isMSD = (d === 0);
            const min = isMSD ? (config.digits === 1 ? 0 : 1) : 0;
            const rowsLeft = config.columns - 1 - r;
            const spaceRequired = isMSD ? rowsLeft : 0;
            const maxPossible = spaceLeft - spaceRequired;
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
          const val = parseInt(cols[r].join(""));
          numbers.push(val);
          sum += val;
        }
      } else {
        let attempt = 0;
        let generated = false;
        while(attempt < 100 && !generated) {
           attempt++;
           numbers.length = 0;
           sum = 0;
           for (let c = 0; c < config.columns; c++) {
              const min = config.digits === 1 ? 1 : Math.pow(10, config.digits - 1);
              const max = Math.pow(10, config.digits) - 1;
              const num = Math.floor(Math.random() * (max - min + 1)) + min;
              numbers.push(num);
              sum += num;
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
    }
    
    problems.push({
      id: `problem-${Date.now()}-${i}-${Math.random().toString(36).substring(7)}`,
      numbers,
      correctAnswer: sum,
    });
  }
  
  return problems;
}
