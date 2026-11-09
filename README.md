# Leffakäynnit – Finnkino Premium Käyntiseuranta

Yksityiskohtainen PWA-sovellus Finnkino Premium -tilauksen hyötyarvon seuraamiseen. Seuraa käyntejä, herkkukustannuksia ja vertaa sarjalippua yhden sivun, offline-toimivan sovelluksen kautta.

![Leffakäynnit](icon.svg)

## 🎬 Ominaisuudet

### Käyntien hallinta
- **Manuaalisyöttö**: Lisää käynnit yksitellen (päivä, elokuva, teatteri, herkut, muut kulut, arvosana 1–5 tähteä, muistiinpano)
- **Excel-tuonti**: Tuo Finnkino Premium -seurantataulukosta (`.xlsx`) suoraan sovellukseen
- **Muokkaus & poisto**: Klikkaa käyntiä muuttaaksesi tai poistaaksesi sen
- **Hakutoiminto**: Suodata käyntilistaa elokuvan nimen perusteella

### Laskelmat & analyysi
- **Leffakäynnin hinta nyt**: Vuosimaksu jaettuna käyntien määrällä
- **Herkut ja muut mukana**: (Vuosimaksu + herkut + muut kulut) / käynnit
- **Break-even -mittari**: Kuinka monta käyntiä tarvitaan, jotta Premium on halvempi kuin sarjalippu
- **Herkkutavoite**: Montako leffaa pitää katsoa ilman herkkuja tai muita kuluja, jotta käynnin keskihinta (kaikki kulut mukaan lukien) alittaa sarjalipun hinnan – ja montako käyntiä herkut ovat kertyneisinä siirtäneet tavoitetta. Kun tavoite on saavutettu, sovellus näyttää paljonko sarjalipun hinnasta jää herkkubudjettiin joka käynnillä
- **Säästö vs. sarjaliput**: Vertailutaulukko kahdella tavalla, pelkkä lippu sekä herkut ja muut kulut Premiumin kuluiksi laskettuna: kulut, €/käynti, säästö yhteensä ja per käynti sekä mistä käynnistä alkaen Premium kannattaa
- **Ennuste**: Käyntimäärä ja €/käynti kauden lopussa viimeisen 30 päivän tahdilla
- **Kertynyt säästö vs. sarjaliput**: Kaksi viivaa kuukausittain (pelkkä lippu / herkut ja muut mukana), alkaa kauden alussa miinukselta (vuosimaksu) ja nousee nollan yli break-evenissä
- **Kuukausittain**: Käynnit/kk-pylväät ja taulukko (käynnit, herkut, €/käynti ja säästö kuukauden lopussa), myös kuukaudet ilman käyntejä
- **Herkut**: Yhteensä, monellako käynnillä ostettu ja keskiostos
- **Päivämäärätarkistus**: Tulevaisuuteen tai kauden ulkopuolelle merkityt käynnit jäävät laskuista pois ja näkyvät varoituksena

### Elokuvatilastot
- **Eniten katsottu elokuva**: Elokuva, jota olet katsonut eniten kertoja
- **Eniten maksanut elokuva**: Samannimisten käyntien leffaosuudet + herkut yhteensä
- **Arvosanat**: Keskiarvo, jakauma (1–5 tähteä), parhaat ja heikoimmat elokuvat (saman elokuvan käynnit keskiarvona). Saman tähden napautus uudelleen poistaa arvosanan

### Asetukset
- **Tilausasetukset**: Vuosimaksu, sarjalipun vertailuhinta, kauden alkupäivä ja loppupäivä
- **Oletusteatteri**: Tilaus-asetuksissa; uusien käyntien Teatteri-kenttä esitäytetään tällä
- **Varmuuskopiot**: Päivittäinen automaattinen tallennus puhelimen tiedostoihin, tietokoneella valittuun kansioon (ks. [Varmuuskopiot](#-varmuuskopiot))

### Varmuuskopiot & tietojen hallinta
- **Lataa varmuuskopio (.json)**: Kokonaistilan tallennus (asetukset + käynnit)
- **Palauta varmuuskopio**: Tuo aiemmin ladattu `.json`-tiedosto
- **Vie CSV (Exceliin)**: Kaikki käynnit taulukkomuodossa Exceliä varten
- **Poista kaikki käynnit**: Tyhjennä käyntitietokanta (asetukset säilyvät)

### Tekniset ominaisuudet
- **PWA (Progressive Web App)**: Asennettava puhelimeen/työpöydälle, toimii offline
- **Service Worker**: Välimuistittaa resurssit, sovellus aukeaa ilman verkkoa
- **localStorage**: Tiedot tallentuvat selaimeen, ei palvelimelle
- **File System Access API**: paikallinen kansio (Chrome/Edge 86+)
- **Web Share API**: Mobiililaitteilla jakovalikko (Tallenna OneDriveen, Google Driveen jne.)
- **IndexedDB**: Valitun kansion kahvan säilyttäminen sovelluksen uudelleenavauksen yli

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

# Käynnistä paikallinen palvelin (index.html suoraan tiedostona ei aja service workeria)
python -m http.server 8000
# TAI
npx serve .
```

## 📊 Excel-tuonti – ohjeet

1. Mene **Asetukset**-välilehdelle
2. Valitse tiedosto **Finnkino_Premium_Seuranta.xlsx** tuontikentästä
3. Sovellus etsii automaattisesti välilehden, jossa on sarakkeet:
   - **Päivä** (myös Paiva/pvm/date)
   - **Elokuva** (elokuva)
   - **Herkut €** (herku/karkki)
   - Valinnaiset: **Teatteri/Sali**, **Muut kulut €** (muu), **Arvosana** (1–5), **Muistio/Huomio**
4. Varmista, että otsikkorivi on oikeilla nimillä (ääkköset eivät väliä)
5. Jos käyntejä on jo, sovellus kysyy: **OK** korvaa nykyiset käynnit, **Peruuta** lisää vain uudet (duplikaatit tunnistetaan päivän + elokuvan perusteella)

## 💾 Varmuuskopiot

Tiedot tallentuvat selaimeen. Varmuuskopiot ovat tavallisia tiedostoja laitteen muistissa, eivät selaimen välimuistia.

### Puhelin
- **Tallenna varmuuskopio puhelimeen automaattisesti kerran päivässä**: muutoksen jälkeen sovellus lataa `leffakaynnit-YYYY-MM-DD.json` ja `.csv` Lataukset-kansioon, enintään kerran päivässä.
- **Lataa varmuuskopio** / **Vie CSV**: avaa jakovalikon, josta tiedoston voi tallentaa haluamaansa paikkaan.
- Jos varmuuskopio on yli viikon vanha, sovellus muistuttaa avattaessa.

### Tietokone (Chrome/Edge)
**Valitse kansio** tallentaa varmuuskopiot valittuun kansioon, esim. `D:\OneDrive\...`, jolloin OneDrive-synkronointi hoitaa loput. Kansio muistetaan, ja selain voi kysyä luvan uudelleen.

### Palautus
**Palauta varmuuskopio** lukee `.json`-tiedoston ja korvaa nykyiset tiedot (vahvistus kysytään).

## 📁 Tiedostorakenne

```
leffakaynnit/
├── index.html        # Pääkäyttöliittymä
├── app.js            # Kaikki logiikka (laskenta, tallennus, renderöinti, varmuuskopiot)
├── style.css         # Teema, responsiivisuus, tummavaalea-tila
├── sw.js             # Service Worker (offline-tuki)
├── manifest.webmanifest  # PWA-manifesti
├── icon.svg          # Sovelluskuvake
├── LICENSE           # MIT-lisenssi
└── README.md         # Tämä tiedosto
```

## 🔧 Kehittäjäohjeet

### Service Worker -päivitys
Julkaistessa nosta sama numero kolmeen kohtaan: `sw.js`:n `CACHE` (esim. `leffakaynnit-v17`) sekä `index.html`:n `app.js?v=17` ja `style.css?v=17` (myös `sw.js`:n `ASSETS`-listassa). Versionumero tiedostonimessä estää GitHub Pagesin 10 minuutin välimuistia yhdistämästä uutta HTML:ää vanhaan `app.js`:ään.

### Julkaisu
GitHub Pages julkaisee `gh-pages`-haaran. Kehitys tehdään `main`-haarassa, ja julkaisu on sama commit molempiin:

```bash
git pull --ff-only origin main
git push origin main
git push origin main:gh-pages
```

- **Kotisivu**: `https://kebabkenraali.github.io/leffakaynnit/`
- Hae aina ensin uusin versio (`git pull`), jos repoa muokataan useammalla työkalulla tai koneella (esim. Cline ja Claude Code). Muuten vanhan version päälle pushattu muutos voi kumota aiemmat korjaukset.
- Älä käytä `git push --force` -komentoa `main`- tai `gh-pages`-haaraan.

## 📝 Lisenssi

MIT License – vapaa käyttö, muokkaus ja jakelu. Ks. [LICENSE](LICENSE).

## 💡 Development Ideas (Roadmap)

A prioritized list of future development. The first items directly support the app's core idea: keeping snack spending under control.

### High priority
- **Snack impact already in the add-visit dialog** – costs are currently only visible after saving. The dialog could show it in real time, e.g. "€36.90 of snacks pushes the goal back by 2.5 visits". Moving the feedback to the actual purchase decision is the most effective way to curb snack spending.
- **Monthly snack budget** – a configurable monthly limit (e.g. €30/month) with a meter tracking it in the monthly stats. The treat budget (v17) is an average-based figure; a monthly budget would be a concrete, forward-looking limit.
- **Season rollover helper** – when the season has ended, the app could suggest new season dates and remind you to update the annual fee. Currently, the new season has to be entered manually, otherwise visits will silently drop out of the calculations.
- **Forecast line in the savings chart** – the accumulated savings continues as a dashed line at the pace of the last 30 days until the end of the season, so you can see ahead of time when the goal will be reached.

### Medium priority
- **Automated tests for the calculations** – `computeVisits`, `computeSummary`, `monthStats` and the treat-goal formulas are easy to test, which would prevent regressions during refactoring. No tests exist yet.
- **Excel reader working offline too** – SheetJS is loaded from a CDN, so importing doesn't work without a network connection. bundling the reader into the service worker's `ASSETS` list or a lightweight custom parser would complete the offline experience.
- **Annual fee payment date** – use the payment date instead of the season start as the zero point of the savings chart, so that the first negative point matches the actual payment date.
- **Comparison of subscription options** – Premium vs. basic card vs. regular tickets, all based on the same data.

### Low priority
- **Logging reminders** – a browser notification ("Did you log your cinema visit?") in the evening, when an in-season visit hasn't been recorded yet.
- **Multi-year history** – comparing multiple seasons (e.g. snack spending per visit across years) encourages long-term tracking.
- **Multiple user profiles** – the subscription may be shared by a family or couple; breaking down each person's own snack costs would give a more detailed picture.

## 🤝 Avustukset

Pull requestit ovat tervetulleita! Ehdota parannuksia tai raportoi bugeja Issues-välilehdellä.

---

## 🛠️ Työkalut ja tekniikat

Tämä sovellus on kehitetty hyödyntämään modernia verkkoteknologioita ja AI-avustettua kehitystyönkulkuja:

### Kehitysympäristö ja työkalut
- **Cline (AI Coding Agent)** – Koodin generointi, refaktorointi, debuggaus ja arkkitehtuurisuunnittelu
- **Claude Code** – Sovelluksen ensimmäinen versio, laskennan ja kaavioiden uudistus, virheenkorjaukset ja testaus
- **Visual Studio Code** – Pääkehitysympäristö
- **Git & GitHub** – Versiohallinta ja GitHub Pages -hostaus
- **Chrome/Edge DevTools** – Debuggaus, PWA-testaus, performance-profilointi

### Frontend-tekniikat
- **Vanilla JavaScript (ES6+)** – Ei frameworkseja, kevyttä ja nopeaa
- **HTML5 + CSS3** – Semanttinen HTML, CSS Custom Properties (teemat), Grid/Flexbox
- **Progressive Web App (PWA)** – `manifest.webmanifest`, Service Worker (`sw.js`)
- **File System Access API** – Paikallinen kansio (vain tietokone)
- **Web Share API** – Mobiililaitteiden jakovalikko
- **IndexedDB** – Valitun kansion kahvan tallennus
- **localStorage** – Paikallinen tietovarasto
- **SheetJS (xlsx)** – Excel-tiedostojen lukeminen CDN:stä

### Arkkitehtuuri
- **Single Page Application (SPA)** – Ilman build-työkaluja tai bundlereita
- **Offline-first** – Service Worker välimuistaa kaikki staattiset resurssit
- **Modulaarinen rakenne** – Yksi `app.js` modulaarilla funktioilla (laskenta, tallennus, renderöinti, I/O)
- **Tilaan perustuva renderöinti** – `state` objekti → `compute` → `render`

### Laskentamalli
- **Kumulatiivinen keskihinta** – `movieAt = vuosimaksu / käynnit`, `totalAt = (vuosimaksu + herkut + muut kulut) / käynnit`
- **Säästö** – pelkkä lippu: `käynnit × sarjalippu − vuosimaksu`; herkut ja muut mukana: `käynnit × sarjalippu − (vuosimaksu + herkut + muut kulut)`
- **Laskettavat käynnit** – vain kauden sisällä ja tähän päivään mennessä; muut näytetään varoituksena
- **Break-even analyysi** – pelkkä lippu `ceil(vuosimaksu / sarjalippu_hinta)`; herkut mukana ensimmäinen käynti, jolla säästö menee plussalle (arvio, jos ei vielä saavutettu)
- **Herkkutavoite** – ilman uusia herkkuja tai muita kuluja tavoite on `floor((vuosimaksu + kertyneet herkut + muut kulut) / sarjalippu) + 1` käynnin kohdalla; pelkkä vuosimaksu vaatisi `ceil(vuosimaksu / sarjalippu)` käynnin. Tavoitteen täytyttyä herkkubudjetti joka käynnille = `sarjalippu − vuosimaksu / käynnit`
- **Ennuste** – Viimeisen 30 päivän käyntitahti jatkettuna kauden loppuun
- **SVG-kaaviot** – Kertyneen säästön viiva ja käynnit/kk-pylväät; €/käynti ja säästö kuukauden lopun tilanteesta

### Laadunvarmistus
- **Virheenkäsittely** – `try/catch` kaikissa I/O-operaatioissa, käyttäjäystävälliset toast-viestit
- **Graceful degradation** – File System Access API ei tue kaikki selainta → fallback Web Share API:hin

---

## 👤 Tekijä ja AI-avustus

**Kehittäjä**: [kebabkenraali](https://github.com/kebabkenraali)  
**AI-avustus**: [Cline](https://cline.bot) ja [Claude Code](https://claude.com/claude-code) – AI-koodausagentit, jotka ovat kirjoittaneet ja refaktoroineet koodia, suunnitelleet arkkitehtuuria, korjanneet bugeja ja dokumentoineet ominaisuuksia.

> *Tämä projekti demonstroi miten moderni AI-avustettu kehitysnopeus yhdistettynä vanillan web-tekniikoihin voi tuottaa tuotantovalmiin, offline-toimivan PWA-sovelluksen ilman monimutkaisia build-ketjuja.*

---

**Versio**: 2026.11 (säästövertailu herkuilla ja ilman, herkkutavoite ja herkkubudjetti, kuukausikaaviot, arvosanat, päivämäärätarkistus, päivittäinen varmuuskopio)