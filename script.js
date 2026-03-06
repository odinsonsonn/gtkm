// --- KONFIGURASI ---
const CONFIG = {
    DISCORD_ID: "622610309278072887",
    LETTERBOXD_USER: "odinsonn",
    LASTFM_USER: "odinsonson",
    LASTFM_KEY: "16d8e800ad1bb9f650e35ea24fc20d88"
};

// --- SPOTIFY LIVE (LANYARD API) ---
async function syncSpotify() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${CONFIG.DISCORD_ID}`);
        const data = await response.json();
        const container = document.getElementById('spotify-content');
        const statusText = document.getElementById('online-status');
        
        if (data.success) {
            statusText.innerText = data.data.discord_status.toUpperCase();
            const sp = data.data.spotify;
            
            if (sp && sp.song) {
                container.innerHTML = `
                    <img src="${sp.album_art_url}" class="spotify-img">
                    <div>
                        <strong style="display:block; color:var(--accent); font-size:1.1rem">${sp.song}</strong>
                        <span class="mono">${sp.artist}</span>
                        <div style="margin-top:10px; font-size:0.6rem; opacity:0.5">ON ALBUM: ${sp.album}</div>
                    </div>
                `;
            } else {
                container.innerHTML = `<p class="mono">NOT LISTENING ANYTHING</p>`;
            }
        }
    } catch (e) { console.error("Lanyard error:", e); }
}

// --- RECENT LISTENED (LAST.FM) ---
async function fetchRecentTracks() {
    const container = document.getElementById('recent-tracks-content');
    if (!container) return;

    try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${CONFIG.LASTFM_USER}&api_key=${CONFIG.LASTFM_KEY}&format=json&limit=5`;
        const response = await fetch(url);
        const data = await response.json();
        
        const tracks = data.recenttracks.track;
        if (!tracks || tracks.length === 0) {
            container.innerHTML = `<p class="mono">NO RECENT TRACKS</p>`;
            return;
        }

        let html = '';
        tracks.forEach(track => {
            const isPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';
            html += `
                <div class="track-item">
                    <strong style="color: ${isPlaying ? 'var(--accent)' : 'white'}">
                        ${track.name} ${isPlaying ? ' (PLAYING)' : ''}
                    </strong>
                    <span class="mono">${track.artist['#text']}</span>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = `<p class="mono">FAILED TO SYNC</p>`;
    }
}

// --- INITIALIZE ---
window.onload = () => {
    syncSpotify();
    fetchRecentTracks();
    setInterval(syncSpotify, 15000);
    setInterval(fetchRecentTracks, 60000);
};

// --- CLEAN UNDERSCORES ---
document.addEventListener('DOMContentLoaded', () => {
    const allTextNodes = document.querySelectorAll('h1, h2, h3, p, span, strong, a, .card-header');
    allTextNodes.forEach(node => {
        if (node.children.length === 0 && node.innerText.includes('_')) {
            node.innerText = node.innerText.replace(/_/g, ' ');
        }
    });
});

// --- NAVBAR HIGHLIGHT ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = "";
    sections.forEach(s => { if (window.pageYOffset >= s.offsetTop - 200) current = s.getAttribute('id'); });
    navLinks.forEach(l => {
        l.classList.remove('active');
        if (l.getAttribute('href').includes(current)) l.classList.add('active');
    });
});