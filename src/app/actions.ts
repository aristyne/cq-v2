"use server";

import { levels } from "@/lib/levels";
import { z } from "zod";

const hintSchema = z.object({
  code: z.string(),
  challengeDescription: z.string(),
  attempts: z.number().min(1),
  levelId: z.coerce.number(),
});


type FormState = {
  hint: string | null;
  error: string | null;
};

export async function getHintAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = hintSchema.safeParse({
    code: formData.get("code"),
    challengeDescription: formData.get("challengeDescription"),
    attempts: Number(formData.get("attempts")),
    levelId: formData.get("levelId"),
  });

  if (!validatedFields.success) {
    return {
      hint: null,
      error: "Invalid input. Please try again.",
    };
  }
  
  const { attempts, levelId } = validatedFields.data;
  const level = levels.find(l => l.id === levelId);

  if (!level) {
      return { hint: null, error: "Could not find level data." };
  }

  let hint;
  if (attempts <= level.hints.length) {
    hint = level.hints[attempts - 1];
  } else {
    hint = `You've asked for a lot of hints! Here is the solution:\n\n${'```python'}
${level.solution}
${'```'}`;
  }

  return {
    hint,
    error: null,
  };
}

// WARNING: This is a VERY simplified Python interpreter for educational purposes.
// It is NOT safe, secure, or complete. It only supports a tiny subset of Python
// needed for the Code Odyssey game.
function simplePythonInterpreter(code: string): { output: string[], error: string | null } {
  const output: string[] = [];
  const globalScope: Record<string, any> = {};

  const lines = code.split('\n');
  
  const evalExpression = (expression: string, currentScope: Record<string, any>): any => {
    expression = expression.trim();
    if ((expression.startsWith("'") && expression.endsWith("'")) || (expression.startsWith('"') && expression.endsWith('"'))) {
      return expression.slice(1, -1);
    }
    if (expression in currentScope) {
      return currentScope[expression];
    }
    if (!isNaN(Number(expression))) {
      return Number(expression);
    }
    if (expression.includes('+')) {
      const parts = expression.split('+').map(p => p.trim());
      const values = parts.map(p => evalExpression(p, currentScope));
      if (values.every(v => typeof v === 'number' || (typeof v === 'string' && !isNaN(Number(v))))) {
        return values.reduce((a, b) => Number(a) + Number(b), 0);
      }
      return values.join('');
    }
    throw new Error(`NameError: name '${expression}' is not defined`);
  };

  const executeBlock = (blockLines: string[], blockScope: Record<string, any> = {}) => {
      for (let i = 0; i < blockLines.length; i++) {
        let line = blockLines[i];
        const trimmedLine = line.trim();
        const lineIndent = line.length - line.trimStart().length;

        // The current scope needs to be recalculated on each line to get the latest variable values.
        let currentScope = {...globalScope, ...blockScope};

        if (trimmedLine === '' || trimmedLine.startsWith('#')) continue;

        // print()
        const printMatch = trimmedLine.match(/^print\((.*)\)$/);
        if (printMatch) {
            output.push(String(evalExpression(printMatch[1], currentScope)));
            continue;
        }

        // variable assignment
        const assignMatch = trimmedLine.match(/^(\w+)\s*=\s*(.*)$/);
        if (assignMatch) {
            const varName = assignMatch[1];
            const varValue = evalExpression(assignMatch[2], currentScope);
            if (Object.prototype.hasOwnProperty.call(blockScope, varName)) {
              blockScope[varName] = varValue;
            } else {
              globalScope[varName] = varValue;
            }
            // Update scope for immediate use
            currentScope = {...globalScope, ...blockScope};
            continue;
        }

        // for loop
        const forMatch = trimmedLine.match(/^for\s+(\w+)\s+in\s+range\((\d+)\):$/);
        if(forMatch) {
            const loopVar = forMatch[1];
            const count = parseInt(forMatch[2], 10);
            const bodyLines = [];
            i++;
            while(i < blockLines.length && (blockLines[i].length - blockLines[i].trimStart().length > lineIndent || blockLines[i].trim() === '')) {
                bodyLines.push(blockLines[i]);
                i++;
            }
            i--;

            for(let j=0; j<count; j++) {
                executeBlock(bodyLines, {...blockScope, [loopVar]: j});
            }
            continue;
        }

        // if statement
        const ifMatch = trimmedLine.match(/^if\s+(.*):$/);
        if (ifMatch) {
            const condition = ifMatch[1];
            const condParts = condition.split(/\s*(>=|<=|==|!=|>|<)\s*/);
            if (condParts.length < 3) throw new Error("Invalid if condition");

            const varValue = evalExpression(condParts[0], currentScope);
            const operator = condParts[1];
            const value = evalExpression(condParts[2], currentScope);

            let conditionResult = false;
            if (operator === '>=') conditionResult = varValue >= value;
            else if (operator === '<=') conditionResult = varValue <= value;
            else if (operator === '>') conditionResult = varValue > value;
            else if (operator === '<') conditionResult = varValue < value;
            else if (operator === '==') conditionResult = varValue == value;
            else if (operator === '!=') conditionResult = varValue != value;
            
            const ifBody: string[] = [];
            const elseBody: string[] = [];
            let currentBody: string[] = ifBody;
            
            i++;
            while(i < blockLines.length && (blockLines[i].length - blockLines[i].trimStart().length > lineIndent || blockLines[i].trim() === '')) {
                currentBody.push(blockLines[i]);
                i++;
            }

            if (i < blockLines.length && blockLines[i].trim().startsWith('else:')) {
                currentBody = elseBody;
                i++;
                while(i < blockLines.length && (blockLines[i].length - blockLines[i].trimStart().length > lineIndent || blockLines[i].trim() === '')) {
                    currentBody.push(blockLines[i]);
                    i++;
                }
            }
            i--;

            if (conditionResult) {
                executeBlock(ifBody, blockScope);
            } else {
                executeBlock(elseBody, blockScope);
            }
            continue;
        }

        throw new Error(`SyntaxError: Unsupported syntax on line: "${trimmedLine}"`);
    }
  }


  try {
    executeBlock(lines, {});
    return { output, error: null };
  } catch(e: any) {
    return { output: [], error: e.message };
  }
}

export async function runPythonCode(
  code: string
): Promise<{ output: string[]; error: string | null }> {
  if (!code.trim()) {
    return {
      output: [],
      error: "Code is empty.",
    };
  }
  
  // Using a simple, non-AI interpreter
  return simplePythonInterpreter(code);
}
