const CHANNEL_URL = "https://www.youtube.com/@lonewolf_223_YT";
const grid = document.querySelector("#video-grid");
const message = document.querySelector("#feed-message");
const statusText = document.querySelector("#status-text");
document.querySelector("#year").textContent = new Date().getFullYear();

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "RECENT UPLOAD";
  return new Intl.DateTimeFormat(undefined,{year:"numeric",month:"short",day:"numeric"}).format(date).toUpperCase();
}
function getText(node, selector) { return node.querySelector(selector)?.textContent?.trim() || ""; }

async function loadFeed() {
  message.textContent = "Loading the latest public uploads…";
  statusText.textContent = "Checking channel feed";
  try {
    const response = await fetch("/api/feed", {headers:{"Accept":"application/atom+xml, application/xml, text/xml"}});
    if (!response.ok) throw new Error(`Feed request failed (${response.status})`);
    const xml = new DOMParser().parseFromString(await response.text(), "application/xml");
    if (xml.querySelector("parsererror")) throw new Error("YouTube returned an unreadable feed.");
    const entries = [...xml.querySelectorAll("entry")].slice(0, 12);
    if (!entries.length) {
      grid.innerHTML = "";
      message.textContent = "No public uploads were found in the channel feed yet.";
      statusText.textContent = "Feed connected";
      return;
    }
    grid.innerHTML = entries.map(entry => {
      const id = getText(entry,"videoId") || getText(entry,"yt\\:videoId");
      const title = getText(entry,"title") || "Untitled upload";
      const published = getText(entry,"published") || getText(entry,"updated");
      const link = entry.querySelector('link[rel="alternate"]')?.getAttribute("href") || (id ? `https://www.youtube.com/watch?v=${encodeURIComponent(id)}` : CHANNEL_URL);
      const thumbnail = entry.querySelector("thumbnail")?.getAttribute("url") ||
        entry.querySelector("media\\:thumbnail")?.getAttribute("url") ||
        (id ? `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg` : "");
      return `<a class="video-card" href="${escapeHTML(link)}" target="_blank" rel="noopener">
        <div class="thumb-wrap">${thumbnail ? `<img loading="lazy" src="${escapeHTML(thumbnail)}" alt="${escapeHTML(title)} thumbnail">` : ""}<span class="play">▶</span></div>
        <div class="video-info"><div class="video-title">${escapeHTML(title)}</div><div class="video-date">${escapeHTML(formatDate(published))}</div></div>
      </a>`;
    }).join("");
    message.textContent = "";
    statusText.textContent = `Live feed · ${entries.length} recent uploads`;
  } catch (error) {
    grid.innerHTML = "";
    message.innerHTML = `The live feed could not be loaded right now. Please try again, or visit the <a class="text-link" href="${CHANNEL_URL}" target="_blank" rel="noopener">YouTube channel ↗</a>.`;
    statusText.textContent = "Feed temporarily unavailable";
    console.error(error);
  }
}
document.querySelector("#refresh-button").addEventListener("click", loadFeed);
loadFeed();
// Refresh the displayed feed periodically while the page remains open.
setInterval(loadFeed, 5 * 60 * 1000);
