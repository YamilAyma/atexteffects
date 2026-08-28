import { Effect } from '../types';

export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback
    }
  }

  // Fallback via temporary textarea
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}

export async function copyEffectPrompt(effect: Effect): Promise<boolean> {
  return copyToClipboard(effect.prompt);
}

export async function copyEffectWithDetails(effect: Effect): Promise<boolean> {
  const text = `[${effect.name}] (${effect.categoryId})
Description: ${effect.description}
Duration: ${effect.durationMs}ms | Loop: ${effect.loop ? 'yes' : 'no'}
Prompt:
${effect.prompt}`;
  return copyToClipboard(text);
}

export async function copyAllFavoritesPrompts(effects: Effect[]): Promise<boolean> {
  if (effects.length === 0) return false;
  const content = effects
    .map(
      (eff, i) =>
        `# ${i + 1}. [${eff.name}] (${eff.categoryId})\nDescription: ${eff.description}\nPrompt:\n${eff.prompt}\n`
    )
    .join('\n---\n\n');

  const success = await copyToClipboard(content);
  if (!success) {
    downloadFavoritesTxt(effects);
  }
  return true;
}

export function downloadFavoritesTxt(effects: Effect[]) {
  const content = `atexteffects — saved prompts export (${effects.length} effects)
Generated: ${new Date().toISOString()}

` + effects
    .map(
      (eff, i) =>
        `# ${i + 1}. [${eff.name}] (${eff.categoryId})\nDescription: ${eff.description}\nPrompt:\n${eff.prompt}\n`
    )
    .join('\n---\n\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'atexteffects-prompts.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
