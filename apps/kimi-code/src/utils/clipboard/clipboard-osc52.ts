const ESC = '\u001B';
const BEL = '\u0007';

/**
 * Build an OSC 52 sequence that asks the terminal emulator to put `text` on
 * the system clipboard. The sequence reaches the *local* clipboard through
 * stdout alone, so it keeps working over SSH and inside containers where no
 * native clipboard tool exists. Terminals without OSC 52 support silently
 * ignore it.
 */
export function buildClipboardOSC52(text: string): string {
  const payload = Buffer.from(text, 'utf8').toString('base64');
  return `${ESC}]52;c;${payload}${BEL}`;
}

/**
 * Write the OSC 52 sequence to stdout. Returns false when stdout is not a
 * terminal (the sequence would pollute piped output) or the write failed.
 */
export function writeClipboardOSC52(text: string): boolean {
  if (!process.stdout.isTTY) return false;
  try {
    process.stdout.write(buildClipboardOSC52(text));
    return true;
  } catch {
    return false;
  }
}
