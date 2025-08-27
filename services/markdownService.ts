import { ContentBlock, BlockType, Variable, TableData } from '../types';

// 式を安全に評価するヘルパー関数
function evaluateExpression(expression: string): string {
    try {
        // 式が計算可能な文字のみで構成されているかチェック
        // 数字、四則演算子、括弧、小数点、スペースを許可
        const safeCharsRegex = /^[0-9+\-*/.() \t]+$/;
        if (safeCharsRegex.test(expression)) {
            // 空文字列や演算子だけの文字列が評価されるのを防ぐ
            if (expression.trim() === '' || /^[+\-*/. \t]+$/.test(expression.trim())) {
                return expression;
            }
            // new Function は eval より安全
            return String(new Function(`return ${expression}`)());
        }
    } catch (e) {
        // 構文エラーなどで評価に失敗した場合
        console.error(`Could not evaluate expression: "${expression}"`, e);
        // ユーザーにフィードバックするためにエラーメッセージを返す
        return `[Invalid Expression]`;
    }
    // 計算できない文字列（安全でない文字を含む）はそのまま返す
    return expression;
}


function applyVariables(markdown: string, variables: Variable[]): string {
  const resolved = new Map<string, string>();
  const unresolved = new Map<string, string>(
    variables
      .filter(v => v.key && v.key.trim() !== '')
      .map(v => [v.key.trim(), v.value])
  );
  
  let maxIterations = variables.length + 1; // 循環参照を避けるためのカウンター
  
  while (unresolved.size > 0 && maxIterations > 0) {
    let changedInIteration = false;

    for (const [key, value] of unresolved.entries()) {
      let substitutedValue = value;
      const dependencies = [...value.matchAll(/{{(.*?)}}/g)];
      let allDependenciesResolved = true;

      if (dependencies.length === 0) {
        // 依存関係がない場合はすぐに解決できる
        resolved.set(key, evaluateExpression(value));
        unresolved.delete(key);
        changedInIteration = true;
        continue;
      }

      for (const match of dependencies) {
        const depKey = match[1].trim();
        if (unresolved.has(depKey)) {
          // 依存先がまだ解決されていない
          allDependenciesResolved = false;
          break;
        } else if (resolved.has(depKey)) {
          // 依存先が解決済みなので置換
          substitutedValue = substitutedValue.replace(match[0], resolved.get(depKey)!);
        } else {
          // 依存先が存在しない
           substitutedValue = substitutedValue.replace(match[0], `[Unknown: ${depKey}]`);
        }
      }

      if (allDependenciesResolved) {
        const finalValue = evaluateExpression(substitutedValue);
        resolved.set(key, finalValue);
        unresolved.delete(key);
        changedInIteration = true;
      }
    }
    
    if (!changedInIteration) {
        // このイテレーションで何も解決されなかった場合、循環参照か解決不能な変数が残っている
        break;
    }

    maxIterations--;
  }

  // ループを抜けた後、まだ未解決の変数が残っている場合はエラーとしてマーク
  unresolved.forEach((value, key) => {
    resolved.set(key, `[Circular Ref or Error]`);
  });

  let result = markdown;
  for (const [key, value] of resolved.entries()) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

function tableToMarkdown(tableData: TableData): string {
    if (!tableData.headers || !tableData.rows) return '';
    const header = `| ${tableData.headers.join(' | ')} |`;
    const separator = `| ${tableData.headers.map(() => '---').join(' | ')} |`;
    const body = tableData.rows.map(row => `| ${row.join(' | ')} |`).join('\n');
    return `${header}\n${separator}\n${body}`;
}


export function convertBlocksToMarkdown(blocks: ContentBlock[], variables: Variable[]): string {
  const markdown = blocks.map(block => {
    switch (block.type) {
      case BlockType.Heading1:
        return `# ${block.content}`;
      case BlockType.Heading2:
        return `## ${block.content}`;
      case BlockType.Heading3:
        return `### ${block.content}`;
      case BlockType.Paragraph:
        return block.content;
      case BlockType.UnorderedList:
        return block.content
          .split('\n')
          .map(item => item.trim())
          .filter(item => item)
          .map(item => `- ${item}`)
          .join('\n');
      case BlockType.Code:
        return `\`\`\`\n${block.content}\n\`\`\``;
      case BlockType.Table:
        try {
            const tableData: TableData = JSON.parse(block.content);
            return tableToMarkdown(tableData);
        } catch (e) {
            return '| Error: Invalid Table Data |';
        }
      default:
        return '';
    }
  }).join('\n\n');

  return applyVariables(markdown, variables);
}
