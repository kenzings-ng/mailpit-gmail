// Theme: 'system' (default) | 'light' | 'dark'. index.html applies it before first paint.
const KEY = 'theme';
const media = window.matchMedia('(prefers-color-scheme: dark)');

export const getTheme = () => {
    try { return localStorage.getItem(KEY) || 'system'; } catch { return 'system'; }
};

const apply = () => {
    const t = getTheme();
    document.documentElement.classList.toggle('dark', t === 'dark' || (t === 'system' && media.matches));
};

export const setTheme = (t) => {
    try { localStorage.setItem(KEY, t); } catch { /* private mode: session-only */ }
    apply();
};

// Follow OS changes while in 'system' mode.
media.addEventListener('change', apply);
