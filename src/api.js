// Thin wrapper over the Mailpit REST API (proxied by Vite / nginx).
const json = async (res) => {
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
};

export const PAGE_SIZE = 50;

export const listMessages = (start, search) => {
    search = search.trim();
    const qs = new URLSearchParams({ start, limit: PAGE_SIZE });
    if (search) qs.set('query', search);
    return fetch(`/api/v1/${search ? 'search' : 'messages'}?${qs}`).then(json);
};

export const getMessage = (id) => fetch(`/api/v1/message/${id}`).then(json);

// Omitting IDs deletes every message.
export const deleteMessages = (ids) => fetch('/api/v1/messages', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ids ? { IDs: ids } : {}),
}).then(json);

export const setRead = (ids, read) => fetch('/api/v1/messages', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ IDs: ids, Read: read }),
}).then(json);

export const subscribe = (onEvent) => {
    let ws, closed = false;
    const connect = () => {
        ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/api/events`);
        ws.onmessage = (e) => onEvent(JSON.parse(e.data));
        ws.onclose = () => { if (!closed) setTimeout(connect, 2000); };
    };
    connect();
    return () => { closed = true; ws.close(); };
};

// List column: "1:18 PM" today, "Oct 5" this year, "10/5/25" older.
export const formatDate = (iso) => {
    const d = new Date(iso), now = new Date();
    if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (d.getFullYear() === now.getFullYear()) return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return d.toLocaleDateString('en-US', { year: '2-digit', month: 'numeric', day: 'numeric' });
};

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

// Mail header: "Oct 5, 2026, 6:12 PM (22 hours ago)".
export const fullDate = (iso) => {
    const d = new Date(iso);
    const mins = Math.round((d - Date.now()) / 60000);
    const rel = Math.abs(mins) < 60 ? rtf.format(mins, 'minute')
        : Math.abs(mins) < 1440 ? rtf.format(Math.round(mins / 60), 'hour')
        : rtf.format(Math.round(mins / 1440), 'day');
    return `${d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })} (${rel})`;
};

export const addressLine = (list) => (list || []).map(a => a.Name || a.Address).join(', ');

// Stable color per name, for avatars and labels.
const palette = ['#1a73e8', '#d93025', '#188038', '#e37400', '#9334e6', '#007b83', '#c5221f', '#b06000'];
export const colorFor = (s = '') => palette[[...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0) % palette.length];

// Needs Mailpit with the send API (added after v1.18); older versions return 404.
export const sendMessage = ({ to, subject, text }) => fetch('/api/v1/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        From: { Email: 'me@mailpit.local', Name: 'Me' },
        To: to.split(',').map(e => e.trim()).filter(Boolean).map(Email => ({ Email })),
        Subject: subject,
        Text: text,
    }),
}).then(async (res) => {
    if (res.status === 404) throw new Error('This Mailpit version has no send API — upgrade Mailpit to enable Compose.');
    if (!res.ok) throw new Error(await res.text() || res.statusText);
    return res.json();
});
