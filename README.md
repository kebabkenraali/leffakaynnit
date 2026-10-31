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
- **🆕 Paikka (Masterdata)**: Oletuspaikka/teatteri, jota käytetään uusien käyntien esitäyttössä
- **🆕 Pilvitallennus**: Valitse OneDrive-, Google Drive- tai Dropbox-kansio (paikallinen synkrointikansio) varmuuskopioiden automaattiseen tallentamiseen
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
- **File System Access API**: Pilvikansio-valinta (Chrome/Edge 86+)
- **Web Share API**: Mobiililaitteilla jakovalikko (Tallenna OneDriveen, Google Driveen jne.)
- **OPFS (Origin Private File System)**: Pilvikansion käden säilyttäminen istuntojen välillä

## 🚀 Käyttöönotto

### GitHub Pages (suositus)
1. Forkkaa tai kloonaa tämä repositorio
2. Mene repositorion **Settings → Pages**
3. Valitse **Source: Deploy from a branch**, branch `gh-pages` (tai `main` jos käytät workflow)
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
2. Klikkaa **Valitse Finnkino_Premium_Seuranta.xlsx** (tai raahaa tiedosto)
3. Sovellus etsii automaattisesti välilehden, jossa on sarakkeet:
   - **Päivä** (pvm/date)
   - **Elokuva** (elokuva)
   - **Herkut €** (herku/karkki)
   - Valinnaiset: **Teatteri/Sali**, **Muut kulut €** (muu), **Muistio/Huomio**
4. Varmista, että otsikkorivi on oikeilla nimillä (ääkköset eivät väliä)
5. Valitse: **Korvaa nykyiset** tai **Lisää vain uudet** (duplikaatit tunnistetaan päivän + elokuvan perusteella)

## 💾 Pilvitallennus – asetukset

### Työpöytä (Chrome/Edge 86+, Firefox ei tue)
1. Mene **Asetukset → Paikka (Masterdata)**
2. Paina **Valitse pilvikansio (OneDrive/Google Drive/Dropbox)**
3. Valitse sen palvelun **paikallinen synkrointikansio** (esim. `C:\Users\<nimi>\OneDrive\Leffakäynnit`)
4. Ota **Tallenna varmuuskopiot automaattisesti pilvikansioon** päälle
5. Joka muutoksen jälkeen (uusi käynti, asetusten muutos, tuonti, palautus) tallennetaan:
   - `leffakaynnit-YYYY-MM-DD.json` (kokotila)
   - `leffakaynnit-YYYY-MM-DD.csv` (käynnit taulukkona)

### Mobiili (iOS Safari, Android Chrome)
1. Paina **Lataa varmuuskopio (.json)** tai **Vie CSV**
2. Avaa jakovalikosta **Tallenna tiedostoihin / Tallenna OneDriveen / Google Driveen / Dropboxiin**
3. Automaattinen pilvitallennus ei toimi mobiililla (File System Access API puuttuu)

## 📁 Tiedostorakenne

```
leffakaynnit/
├── index.html        # Pääkäyttöliittymä
├── app.js            # Kaikki logiikka (laskenta, tallennus, renderöinti, pilvitallennus)
├── style.css         # Teema, responsiivisuus, tummavaalea-tila
├── sw.js             # Service Worker (offline-tuki)
├── manifest.webmanifest  # PWA-manifesti
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

**Versio**: 2026.09 (sisältää pilvitallennuksen ja paikka-masterdatan)