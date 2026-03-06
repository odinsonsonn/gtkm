// --- KONFIGURASI ---
const CONFIG = {
    DISCORD_ID: "622610309278072887",
    LETTERBOXD_USER: "odinsonn"
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
            
            if (sp) {
                container.innerHTML = `
                    <img src="${sp.album_art_url}" class="spotify-img">
                    <div>
                        <strong style="display:block; color:var(--accent); font-size:1.1rem">${sp.track}</strong>
                        <span class="mono">${sp.artist}</span>
                        <div style="margin-top:10px; font-size:0.6rem; opacity:0.5">ON_ALBUM: ${sp.album}</div>
                    </div>
                `;
            } else {
                container.innerHTML = `<p class="mono">NOT_LISTENING_ANYTHING</p>`;
            }
        }
    } catch (e) { 
        console.error("Lanyard error: Pastikan Discord kamu sedang online dan Spotify terhubung."); 
    }
}

async function syncLetterboxd() {
    const feedContainer = document.getElementById('letterboxd-feed');
    const USER = "odinsonn";
    const RSS_URL = `https://letterboxd.com/${USER}/rss/`;
    const PROXY_URL = "https://corsproxy.io/?";
    
    try {
        const response = await fetch(PROXY_URL + encodeURIComponent(RSS_URL));
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const items = xmlDoc.querySelectorAll("item");
        
        if (items.length > 0) {
            feedContainer.innerHTML = ''; 
            for (let i = 0; i < Math.min(items.length, 3); i++) {
                const title = items[i].querySelector("title").textContent.split(' - ')[0];
                const link = items[i].querySelector("link").textContent;
                feedContainer.innerHTML += `
                    <div style="margin-bottom: 10px;">
                        <a href="${link}" target="_blank" style="text-decoration:none; color:white;">
                            <strong style="font-size:0.8rem">${title}</strong>
                        </a>
                    </div>
                `;
            }
        }
    } catch (e) {
        feedContainer.innerHTML = `<a href="https://letterboxd.com/${USER}/" target="_blank" style="color:var(--accent)">LIHAT_PROFIL</a>`;
    }
}
syncLetterboxd();

// --- INITIALIZE ---
window.onload = () => {
    syncSpotify();
    syncLetterboxd();
    setInterval(syncSpotify, 15000); // Re-sync Spotify setiap 15 detik
};

// Navbar Highlight
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let current = "";
    sections.forEach(s => { if (pageYOffset >= s.offsetTop - 200) current = s.getAttribute('id'); });
    navLinks.forEach(l => {
        l.classList.remove('active');
        if (l.getAttribute('href').includes(current)) l.classList.add('active');
    });
});