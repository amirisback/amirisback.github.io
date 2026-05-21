/**
 * Inline script that runs **before** React hydrates to set the correct
 * `dark` / `light` class on `<html>`, preventing a flash of wrong theme.
 *
 * This is rendered as a blocking `<script>` in the root layout <head>.
 */
export function getThemeInitScript(): string {
  return `
(function(){
  try {
    var t = localStorage.getItem('theme-preference');
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (t === 'light') {
      document.documentElement.classList.add('light');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
    }
  } catch(e) {}
})();
`.trim();
}
