'use strict';

// Pilvivarmuus: OneDrive (Microsoft Graph) ja Google Drive.
// Tiedostot tallennetaan käyttäjän OMAAN pilvitilliin. Sovelluksella ei ole palvelinta,
// joten kehittäjä ei näe käyttäjien tietoja.
//
// Vaatii kirjastot (ladataan index.html:ssä): msal-browser ja Google Identity Services.
// Käyttää config.js:n tunnuksia.
(function () {
  const cfg = window.CLOUD_CONFIG || {};
  const FLAGS_KEY = 'leffakaynnit.cloud';

  // Google Drive: drive.file näkee vain sovelluksen itse luomat tiedostot
  const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/drive.file';
  // OneDrive: vain sovelluksen oma kansio (Apps/<sovelluksen nimi>), ei koko OneDrivea
  const MS_SCOPES = ['Files.ReadWrite.AppFolder'];

  const flags = () => {
    try {
      return JSON.parse(localStorage.getItem(FLAGS_KEY)) || {};
    } catch {
      return {};
    }
  };
  const setFlag = (name, on) => {
    const f = flags();
    f[name] = on;
    localStorage.setItem(FLAGS_KEY, JSON.stringify(f));
  };

  // ---------- OneDrive (Microsoft Graph) ----------

  let msClient = null;

  function msApp() {
    if (!msClient) {
      msClient = new msal.PublicClientApplication({
        auth: {
          clientId: cfg.onedriveClientId,
          // "consumers" = henkilökohtaiset Microsoft-tilit
          authority: 'https://login.microsoftonline.com/consumers',
          redirectUri: location.origin + location.pathname,
        },
        cache: { cacheLocation: 'localStorage' },
      });
    }
    return msClient;
  }

  async function msInit() {
    if (!cfg.onedriveClientId || typeof msal === 'undefined') return;
    const app = msApp();
    await app.initialize();
    // Paluu Microsoftin kirjautumissivulta (redirect-kirjautuminen)
    const result = await app.handleRedirectPromise();
    if (result?.account) app.setActiveAccount(result.account);
    if (app.getAllAccounts().length) setFlag('onedrive', true);
  }

  async function msToken() {
    const app = msApp();
    const account = app.getActiveAccount() || app.getAllAccounts()[0];
    if (!account) throw new Error('Yhdistä OneDrive Asetuksissa');
    try {
      const res = await app.acquireTokenSilent({ scopes: MS_SCOPES, account });
      return res.accessToken;
    } catch (err) {
      if (err instanceof msal.InteractionRequiredAuthError) {
        throw new Error('OneDrive-yhteys vanhentui – yhdistä uudelleen Asetuksissa');
      }
      throw err;
    }
  }

  const msUrl = (name) =>
    `https://graph.microsoft.com/v1.0/me/drive/special/approot:/${encodeURIComponent(name)}:/content`;

  async function msUpload(name, content, type) {
    const token = await msToken();
    const res = await fetch(msUrl(name), {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': type },
      body: content,
    });
    if (!res.ok) throw new Error(`OneDrive ${res.status}`);
  }

  async function msDownload(name) {
    const token = await msToken();
    const res = await fetch(msUrl(name), { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`OneDrive ${res.status}`);
    return res.text();
  }

  // ---------- Google Drive (Google Identity Services) ----------

  let gClient = null;
  let gToken = null;
  let gExpires = 0;

  /** Pyytää käyttöoikeustunnuksen. prompt: 'consent' vaatii napautuksen, '' yrittää hiljaa. */
  function gRequest(prompt) {
    return new Promise((resolve, reject) => {
      if (!gClient) {
        gClient = google.accounts.oauth2.initTokenClient({ client_id: cfg.googleClientId, scope: GOOGLE_SCOPE, callback: () => {} });
      }
      gClient.callback = (r) => {
        if (r.error) return reject(new Error(r.error));
        gToken = r.access_token;
        gExpires = Date.now() + (r.expires_in - 60) * 1000;
        resolve(gToken);
      };
      gClient.error_callback = (e) => reject(new Error(e.type || 'Google-kirjautuminen peruttiin'));
      gClient.requestAccessToken({ prompt });
    });
  }

  async function gAccess() {
    if (gToken && Date.now() < gExpires) return gToken;
    try {
      return await gRequest('');
    } catch {
      throw new Error('Google Drive -yhteys vanhentui – yhdistä uudelleen Asetuksissa');
    }
  }

  async function gFindId(token, name) {
    const q = encodeURIComponent(`name = '${name.replace(/'/g, "\\'")}' and trashed = false`);
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id)`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Google Drive ${res.status}`);
    return (await res.json()).files[0]?.id ?? null;
  }

  async function gUpload(name, content, type) {
    const token = await gAccess();
    const id = await gFindId(token, name);
    const boundary = 'leffa' + Math.random().toString(36).slice(2);
    const meta = id ? { name } : { name, mimeType: type };
    const body =
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n` +
      `--${boundary}\r\nContent-Type: ${type}\r\n\r\n${content}\r\n--${boundary}--`;
    const url = id
      ? `https://www.googleapis.com/upload/drive/v3/files/${id}?uploadType=multipart`
      : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
    const res = await fetch(url, {
      method: id ? 'PATCH' : 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': `multipart/related; boundary=${boundary}` },
      body,
    });
    if (!res.ok) throw new Error(`Google Drive ${res.status}`);
  }

  async function gDownload(name) {
    const token = await gAccess();
    const id = await gFindId(token, name);
    if (!id) return null;
    const res = await fetch(`https://www.googleapis.com/drive/v3/files/${id}?alt=media`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Google Drive ${res.status}`);
    return res.text();
  }

  // ---------- Julkinen rajapinta ----------

  const providers = {
    onedrive: { label: 'OneDrive', upload: msUpload, download: msDownload },
    gdrive: { label: 'Google Drive', upload: gUpload, download: gDownload },
  };

  window.Cloud = {
    providers,
    configured: (name) => (name === 'onedrive' ? !!cfg.onedriveClientId : !!cfg.googleClientId),
    isConnected: (name) => !!flags()[name],
    connectedNames: () => Object.keys(providers).filter((n) => flags()[n]),

    /** Kirjautuu palveluun. Kutsu vain napautuksesta (popup-esto). */
    async connect(name) {
      if (name === 'onedrive') {
        // Redirect: sivu siirtyy Microsoftille ja palaa takaisin, msInit() hoitaa loput
        await msApp().loginRedirect({ scopes: MS_SCOPES, prompt: 'select_account' });
        return;
      }
      await gRequest('consent');
      setFlag('gdrive', true);
    },

    async disconnect(name) {
      setFlag(name, false);
      if (name === 'gdrive') {
        if (gToken) google.accounts.oauth2.revoke(gToken, () => {});
        gToken = null;
      } else if (msClient) {
        // Poista tunnukset selaimesta, muuten msInit() yhdistäisi uudelleen
        await msClient.clearCache();
      }
    },

    init: msInit,
    upload: (name, fileName, content, type) => providers[name].upload(fileName, content, type),
    download: (name, fileName) => providers[name].download(fileName),
  };
})();
