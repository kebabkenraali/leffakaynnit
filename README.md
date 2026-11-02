# Leffakäynnit – Finnkino Premium Käyntiseuranta

Yksityiskohtainen PWA-sovellus Finnkino Premium -tilauksen hyötyarvon seuraamiseen. Seuraa käyntejä, herkkukustannuksia ja vertaa sarjalippua yhden sivun, offline-toimivan sovelluksen kautta.

![Leffakäynnit](icon.svg)

## 🎬 Ominaisuudet

### Käyntien hallinta
- **Manuaalisyöttö**: Lisää käynnit yksitellen (päivä, elokuva, teatteri, herkut, muut kulut, muistiinpano)
- **Excel-tuonti**: Tuo Finnkino Premium -seurantataulukosta (`.xlsx`) suoraan sovellukseen
- **Muokkaus & poisto**: Klikkaa käyntiä muuttaaksesi tai poistaaksesi sen
- **Hakutoiminto**: Suodata käyntilistaa elokuvan nimen perusteella

### Laskelmat & analyysi
- **Leffakäynnin hinta nyt**: Vuosimaksu jaettuna käyntien määrällä
- **Leffa + herkut**: (Vuosimaksu + herkut) / käynnit
- **Break-even -mittari**: Kuinka monta käyntiä tarvitaan, jotta Premium on halvempi kuin sarjalippu
- **Säästö vs. sarjalippu**: Positiivinen = voittaa, negatiivinen = sarjalippu on halvempi
- **Ennuste**: Projisoitu kokonaiskäyntimäärä kauden lopussa
- **Kuukausittainen taulukko**: Käynnit, herkut ja keskimääräinen hinta per kuukausi

### 🆕 Elokuvatilastot
- **Eniten katsottu elokuva**: Elokuva, jota olet katsonut eniten kertoja
- **Kallein elokuva (leffa + herkut)**: Elokuva, jonka kokonaishinta (leffaosuus + herkut) on suurin

### Asetukset (Masterdata)
- **Tilausasetukset**: Vuosimaksu, sarjalipun vertailuhinta, kauden alkupäivä ja loppupäivä
- **🆕 Paikka (Masterdata)**: Oletusteatteri, jolla uusien käyntien Teatteri-kenttä esitäytetään
- **Pilvivarmuus**: OneDrive (Microsoft Graph) ja Google Drive, käyttäjän oma tili. Automaattinen tallennus ja palautus
- **🆕 Automaattinen pilvitallennus**: Valintaruutu varmuuskopioiden (JSON + CSV) automaattiseen tallentamiseen pilvikansioon joka muutoksen jälkeen

### Varmuuskopiot & tietojen hallinta
- **Lataa varmuuskopio (.json)**: Kokonaistilan tallennus (asetukset + käynnit)
- **Palauta varmuuskopio**: Tuo aiemmin ladattu `.json`-tiedosto
- **Vie CSV (Exceliin)**: Kaikki käynnit taulukkomuodossa Exceliä varten
- **Poista kaikki käynnit**: Tyhjennä käyntitietokanta (asetukset säilyvät)

### Tekniset ominaisuudet
- **PWA (Progressive Web App)**: Asennettava puhelimeen/työpöydälle, toimii offline
- **Service Worker**: Välimuistittaa resurssit, sovellus aukeaa ilman verkkoa
- **localStorage**: Tiedot tallentuvat selaimeen, ei palvelimelle
- **Microsoft Graph (MSAL.js)** ja **Google Identity Services**: pilvivarmuus
- **File System Access API**: paikallinen kansio (Chrome/Edge 86+)
- **Web Share API**: Mobiililaitteilla jakovalikko (Tallenna OneDriveen, Google Driveen jne.)
- **IndexedDB**: Pilvikansion kahvan (lupaviittauksen) säilyttäminen sovelluksen uudelleenavauksen yli

## 🚀 Käyttöönotto

### GitHub Pages (suositus)
1. Forkkaa tai kloonaa tämä repositorio
2. Mene repositorion **Settings → Pages**
3. Valitse **Source: Deploy from a branch**, branch `gh-pages` (kansio `/ (root)`)
4. Sovellus on käytettävissä osoitteessa `https://<käyttäjänimesi>.github.io/leffakaynnit/`

### Paikallinen kehitys
```bash
# Kloonaa
git clone https://github.com/kebabkenraali/leffakaynnit.git
cd leffakaynnit

# Avaa index.html selaimessa (esim. Live Server -laajennuksella VS Codessa)
# TAI
npx serve .
```

## 📊 Excel-tuonti – ohjeet

1. Mene **Asetukset**-välilehdelle
2. Valitse tiedosto **Finnkino_Premium_Seuranta.xlsx** tuontikentästä
3. Sovellus etsii automaattisesti välilehden, jossa on sarakkeet:
   - **Päivä** (pvm/date)
   - **Elokuva** (elokuva)
   - **Herkut €** (herku/karkki)
   - Valinnaiset: **Teatteri/Sali**, **Muut kulut €** (muu), **Muistio/Huomio**
4. Varmista, että otsikkorivi on oikeilla nimillä (ääkköset eivät väliä)
5. Jos käyntejä on jo, sovellus kysyy: **OK** korvaa nykyiset käynnit, **Peruuta** lisää vain uudet (duplikaatit tunnistetaan päivän + elokuvan perusteella)

## ☁️ Pilvivarmuus (OneDrive ja Google Drive)

Sovellus tallentaa varmuuskopion **sinun omaan** pilvitiliisi. Sovelluksella ei ole palvelinta, joten kehittäjä ei näe tietojasi. Tiedostot ovat `leffakaynnit.json` (koko tila) ja `leffakaynnit.csv` (taulukko). Ne ylikirjoitetaan joka tallennuksessa, joten pilvessä on aina uusin versio.

Yhdistäminen vaatii kerran sovellustunnukset `config.js`-tiedostoon. Tunnukset eivät ole salaisuuksia, ja jokainen käyttäjä kirjautuu omalla tilillään.

### OneDrive (Microsoft Graph, henkilökohtainen tili)
1. Avaa [entra.microsoft.com](https://entra.microsoft.com) → **App registrations → New registration**
2. Nimi: `Leffakäynnit`. Supported account types: **Personal Microsoft accounts only**
3. Redirect URI: tyyppi **Single-page application (SPA)**, arvo `https://kebabkenraali.github.io/leffakaynnit/`
4. **API permissions → Add a permission → Microsoft Graph → Delegated → `Files.ReadWrite.AppFolder`**
5. Kopioi **Application (client) ID** → `config.js` kenttään `onedriveClientId`

Tiedostot menevät OneDriven kansioon `Apps/Leffakäynnit/`. Sovellus ei näe muuta OneDrivea.

### Google Drive
1. Avaa [console.cloud.google.com](https://console.cloud.google.com), luo projekti ja ota käyttöön **Google Drive API** (APIs & Services → Library)
2. **OAuth consent screen**: sovelluksen nimi, tukisähköposti, User type **External**, scope `.../auth/drive.file`
3. **Credentials → Create credentials → OAuth client ID → Web application**
4. **Authorized JavaScript origins**: `https://kebabkenraali.github.io` (vain origin, ei polkua)
5. Kopioi Client ID → `config.js` kenttään `googleClientId`

Kun sovellus on Testing-tilassa, Google sallii yhteyden vain Test users -listalla oleville tileille (enintään 100). Julkaisua varten Google vaatii sovelluksen verifioinnin ja tietosuojaselosteen.

### Käyttö
- **Yhdistä OneDrive / Yhdistä Google Drive** Asetuksissa. Yhteys muistetaan, ja tokenit uusitaan automaattisesti.
- **Tallenna automaattisesti joka muutoksen jälkeen**: tallennus tapahtuu noin 1,5 s muutoksen jälkeen. Tyhjää tilaa ei lähetetä pilveen, joten uusi laite ei ylikirjoita varmuuskopiota ennen palautusta.
- **Palauta pilvestä**: lataa `leffakaynnit.json` ja korvaa nykyinen tila (vahvistus kysytään).
- Jos yhteys vanhenee, sovellus ilmoittaa siitä. Yhdistä palvelu uudelleen Asetuksissa.

### Paikallinen kansio (vain tietokone)
Chrome/Edge: **Valitse paikallinen kansio** tallentaa varmuuskopiot kansioon, esim. `D:OneDrive...`, jolloin OneDrive-synkronointi hoitaa loput. Puhelimella tätä ei ole.

### Mobiili
Android-Chrome ei salli kansioon kirjoittamista, joten puhelimella käytä pilvipalvelua tai jakovalikkoa (**Vie CSV** / **Lataa varmuuskopio**).

## 📁 Tiedostorakenne

```
leffakaynnit/
├── index.html        # Pääkäyttöliittymä
├── app.js            # Kaikki logiikka (laskenta, tallennus, renderöinti, pilvitallennus)
├── style.css         # Teema, responsiivisuus, tummavaalea-tila
├── sw.js             # Service Worker (offline-tuki)
├── manifest.webmanifest  # PWA-manifesti
├── config.js         # Pilvipalvelujen sovellustunnukset
├── cloud.js          # OneDrive- ja Google Drive -yhteys
├── icon.svg          # Sovelluskuvake
└── README.md         # Tämä tiedosto
```

## 🔧 Kehittäjäohjeet

### Paikallinen testaus
```bash
# Python HTTP-palvelin (välttää CORS-ongelmat)
python -m http.server 8000
# Avaa http://localhost:8000
```

### Service Worker -päivitys
`sw.js`-tiedostossa oleva `CACHE`-vakio (esim. `leffakaynnit-v3`) pitää nostaa versionumeroa, jotta päivitykset tulevat käyttäjille heti.

### Käyttöönottotilin tiedot
- **GitHub Pages -haara**: `gh-pages` (automaattinen deploy pushin yhteydessä)
- **Kotisivu**: `https://kebabkenraali.github.io/leffakaynnit/`

## 📝 Lisenssi

MIT License – vapaa käyttö, muokkaus ja jakelu.

## 🤝 Avustukset

Pull requestit ovat tervetulleita! Ehdota parannuksia tai raportoi bugeja Issues-välilehdellä.

---

## 🛠️ Työkalut ja tekniikat

Tämä sovellus on kehitetty hyödyntämään modernia verkkoteknologioita ja AI-avustettua kehitystyönkulkuja:

### Kehitysympäristö ja työkalut
- **Cline (AI Coding Agent)** – Koodin generointi, refaktorointi, debuggaus ja arkkitehtuurisuunnittelu
- **Visual Studio Code** – Pääkehitysympäristö
- **Git & GitHub** – Versiohallinta ja GitHub Pages -hostaus
- **Chrome/Edge DevTools** – Debuggaus, PWA-testaus, performance-profilointi

### Frontend-tekniikat
- **Vanilla JavaScript (ES6+)** – Ei frameworkseja, kevyttä ja nopeaa
- **HTML5 + CSS3** – Semanttinen HTML, CSS Custom Properties (teemat), Grid/Flexbox
- **Progressive Web App (PWA)** – `manifest.webmanifest`, Service Worker (`sw.js`)
- **File System Access API** – Paikallinen kansio (vain tietokone)
- **Web Share API** – Mobiililaitteiden jakovalikko
- **IndexedDB** – Pilvikansion kahvan tallennus
- **localStorage** – Paikallinen tietovarasto
- **SheetJS (xlsx)** – Excel-tiedostojen lukeminen CDN:stä

### Arkkitehtuuri
- **Single Page Application (SPA)** – Ilman build-työkaluja tai bundlereita
- **Offline-first** – Service Worker välimuistaa kaikki staattiset resurssit
- **Modulaarinen rakenne** – Yksi `app.js` modulaarilla funktioilla (laskenta, tallennus, renderöinti, I/O)
- **Tilaan perustuva renderöinti** – `state` objekti → `compute` → `render`

### Laskentamalli
- **Kumulatiivinen keskihinta** – `movieAt = vuosimaksu / käynnit`, `totalAt = (vuosimaksu + herkut) / käynnit`
- **Break-even analyysi** – `ceil(vuosimaksu / sarjalippu_hinta)`
- **Projektiot** – Lineaarinen extrapolaatio nykyisestä nopeudesta kauden loppuun
- **Aika-akselinen visualisointi** – SVG-kaavio kauden aikajanalla (ei käyntinumero)

### Laadunvarmistus
- **Virheenkäsittely** – `try/catch` kaikissa I/O-operaatioissa, käyttäjäystävälliset toast-viestit
- **Graceful degradation** – File System Access API ei tue kaikki selainta → fallback Web Share API:hin

---

## 👤 Tekijä ja AI-avustus

**Kehittäjä**: [kebabkenraali](https://github.com/kebabkenraali)  
**AI-avustus**: [Cline](https://cline.bot) – autonominen koodausagentti, joka on kirjoittanut ja refaktoroinut suuren osan koodista, suunnitellut arkkitehtuuria, korjannut bugeja ja dokumentoinut ominaisuuksia.

> *Tämä projekti demonstroi miten moderni AI-avustettu kehitysnopeus yhdistettynä vanillan web-tekniikoihin voi tuottaa tuotantovalmiin, offline-toimivan PWA-sovelluksen ilman monimutkaisia build-ketjuja.*

---

**Versio**: 2026.09 (sisältää pilvitallennuksen, paikka-masterdatan ja aikakaavio)