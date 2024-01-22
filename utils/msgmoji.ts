/**
 * pick more emoji from https://github-emoji-picker.vercel.app/
 */

enum EMOJI_LISTS {
  '➖heavy_minus_sign' = '➖',
  '🔸small_orange_diamond' = '🔸',
  '🔶large_orange_diamond' = '🔶',
  '🟡yellow_circle' = '🟡',
  '🧪test_tube' = '🧪',
  '🔗link' = '🔗'
}

export function msgMoji(emoji: keyof typeof EMOJI_LISTS = '🧪test_tube', _spaceBetweenEmojiAndMsg = false) {
  return (msg: string, spaceBetweenEmojiAndMsg: boolean = _spaceBetweenEmojiAndMsg): string =>
    `${EMOJI_LISTS[emoji]}${spaceBetweenEmojiAndMsg ? ' ' : ''}${msg}`;
}
