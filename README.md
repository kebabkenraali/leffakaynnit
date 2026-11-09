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

## 💡 Kehitysideat (Roadmap)

Priorisoitu lista jatkokehityksestä. Ensimmäiset palvelevat suoraan sovelluksen pääideaa eli herkkukulujen hillitsemistä.

### Korkea prioriteetti
- **Herkkujen vaikutus jo lisäysdialogissa** – kulut näkyvät nyt vasta tallennuksen jälkeen. Dialogi voisi näyttää reaaliajassa esim. "36,90 € herkut siirtävät tavoitetta 2,5 käynnillä". Palautteen siirtäminen juuri ostopäätökseen on tehokkain tapa hillitä herkkukuluja.
- **Kuukausibudjetti herkuille** – asetettava kuukausiraja (esim. 30 €/kk) ja sen täyttöä seuraava mittari kuukausitilastoissa. Herkkubudjetti (v17) on keskiarvopohjainen luku; kuukausibudjetti olisi konkreettinen ennakollinen raja.
- **Kauden vaihto -apuri** – kun kausi on päättynyt, sovellus voisi ehdottaa uuden kauden päivämääriä ja muistuttaa vuosimaksun päivitystä. Nyt uusi kausi täytyy muistaa syöttää itse, muuten käynnit jäävät hiljalleen laskuista pois.
- **Ennusteviiva säästökaavioon** – kertynyt säästö jatkuu katkoviivalla viimeisen 30 päivän tahtiin kauden loppuun asti, jolloin tavoitteen saavuttamishetken näkee jo etukäteen.

### Keskitaso
- **Automatisoidut testit laskennalle** – `computeVisits`, `computeSummary`, `monthStats` ja herkkutavoitekaavat ovat helposti testattavissa, mikä estäisi regressiot refaktoroinneissa. Testejä ei vielä ole.
- **Excel-lukija toimimaan myös offlineen** – SheetJS ladataan CDN:stä, joten tuonti ei toimi ilman verkkoa. Lukijan vieminen service workerin `ASSETS`-listaan tai kevyt oma parseri täydentäisi offline-käytön.
- **Vuosimaksun suorituspäivä** – maksupäivä kauden alkupäivän sijaan säästökaavion nollapisteeksi, jolloin ensimmäinen miinuspiste vastaa todellista maksuhetkeä.
- **Tilausvaihtoehtojen vertailu** – Premium vs. peruskortti vs. pelkät liput samalla datalla.

### Matala prioriteetti
- **Kirjaamismuistutukset** – selaimen notifikaatio "Kirjasitko leffakäynnin?" illalla, jos kauden sisäiselle käynnille ei ole merkintää.
- **Monivuotinen historia** – usean kauden vertailu (esim. herkkukulut per käynti eri vuosina) kannustaa pitkäjänteiseen seurantaan.
- **Useampi käyttäjäprofiili** – perheen tai parin tilaus voi olla yhteinen; jokaisen omien herkkukulujen erittely toisi tarkemman kuvan.

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