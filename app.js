'use strict';

// ---------- Käännökset (i18n) ----------
const I18N = {
  fi: {
    appTitle: 'Leffakäynnit',
    heroLabel: 'Leffakäynnin hinta nyt',
    heroSub: 'vuosimaksu ÷ käynnit',
    snacksAndOther: 'Herkut ja muut mukana',
    visits: 'Käynnit',
    latestMovie: 'Viimeisin leffa',
    treatGoal: 'Herkkutavoite',
    season: 'Kausi',
    dateWarningPrefix: 'Päivä on tulevaisuudessa tai kauden ulkopuolella',
    dateWarningSuffix: 'jää laskuista pois',
    dateWarningFix: 'Korjaa päivä napauttamalla käyntiä Käynnit-sivulla.',
    rolloverTitle: 'Kausi on päättynyt',
    rolloverText: 'Kausi päättyi {end}. Uudet käynnit jäävät laskuista, kunnes kauden päivämäärät on päivitetty.',
    rolloverSettings: 'Muokkaa asetuksia',
    rolloverAdvance: 'Kausi vuodella eteenpäin',
    rolloverToast: 'Kausi siirretty vuodella eteenpäin – tarkista vuosimaksu ja lipun hinta Asetuksista',
    premiumVsTicket: 'Premium vs. sarjalippu',
    treatGoalCard: 'Herkkutavoite',
    snacksTotal: 'Herkut yhteensä',
    snacksBought: 'Herkkuja ostettu',
    seasonLeft: 'Kautta jäljellä',
    forecastEnd: 'Ennuste kauden lopussa (30 pv tahti)',
    savingsVsTickets: 'Säästö vs. sarjaliput',
    accumulatedSavings: 'Kertynyt säästö vs. sarjaliput',
    monthly: 'Kuukausittain',
    monthlyFootnote: 'Kuukauden lopun tilanne: vuosimaksu jaetaan kaikilla siihen mennessä kertyneillä käynneillä. Säästö = pelkkä lippu, + herkut = herkut ja muut kulut vähennettynä.',
    movieStats: 'Elokuvatilastot',
    mostWatched: 'Eniten katsottu',
    visitCount: 'Käyntejä',
    mostExpensive: 'Eniten maksanut (kaikki käynnit + herkut)',
    total: 'Yhteensä',
    ratings: 'Arvosanat',
    searchPlaceholder: 'Hae elokuvaa…',
    emptyVisits: 'Ei vielä käyntejä. Lisää ensimmäinen +-napista tai tuo Excel Asetuksista.',
    settings: 'Asetukset',
    subscription: 'Tilaus',
    annualFee: 'Premium-vuosimaksu (€)',
    ticketPrice: 'Sarjalipun hinta vertailuun (€/lippu)',
    seasonStart: 'Kausi alkaa',
    seasonEnd: 'Kausi päättyy',
    feeDate: 'Vuosimaksun maksupäivä (valinnainen, säästökaavion nollapiste)',
    snackBudget: 'Kuukausibudjetti herkuille (€/kk, 0 = ei budjettia)',
    snackBudgetLabel: 'Herkkubudjetti tässä kuussa',
    snackBudgetExceeded: 'Budjetti ylittynyt',
    snackBudgetExceededDesc: 'lisäherkkuostokset viivästyttävät herkkutavoitetta.',
    snackBudgetLeft: 'Budjettia jäljellä {amount} loppukuulle.',
    behind: 'käynnin takana',
    defaultTheater: 'Oletusteatteri (esitäytetään uusiin käynteihin)',
    defaultTheaterPlaceholder: 'esim. Finnkino Tennispalatsi',
    save: 'Tallenna',
    settingsSaved: 'Asetukset tallennettu',
    selectFolderFirst: 'Valitse ensin kansio',
    localFolder: 'Paikallinen kansio (vain tietokone)',
    localFolderDesc: 'Chrome/Edge tietokoneella: varmuuskopiot tallentuvat valittuun kansioon, esim. OneDrive-synkronointikansioon.',
    pickFolder: 'Valitse kansio',
    autoCloudSave: 'Tallenna kansioon automaattisesti joka muutoksen jälkeen',
    importExcel: 'Tuo Excelistä',
    importExcelDesc: 'Valitse Finnkino_Premium_Seuranta.xlsx. Sovellus lukee välilehden, jossa on sarakkeet Päivä, Elokuva ja Herkut €.',
    importResultReading: 'Luetaan…',
    backup: 'Varmuuskopio',
    backupDesc: 'Tiedot tallentuvat vain tähän selaimeen. Varmuuskopio tallentuu puhelimen tiedostoihin (Lataukset-kansio tai jakovalikko), ei selaimen välimuistiin.',
    noBackupYet: 'Ei vielä varmuuskopiota',
    lastBackup: 'Viimeisin varmuuskopio: {date}',
    autoLocalBackup: 'Tallenna varmuuskopio puhelimeen automaattisesti kerran päivässä (muutoksen jälkeen)',
    downloadBackup: 'Lataa varmuuskopio (.json)',
    restoreBackup: 'Palauta varmuuskopio',
    copyClipboard: 'Kopioi leikepöydälle',
    exportCsv: 'Vie CSV (Exceliin)',
    clearAll: 'Poista kaikki käynnit',
    iosHint: 'iPhone/iPad: lisää sovellus Koti-valikkoon (Jaa → Lisää Koti-valikkoon), jotta selain ei poista tietoja 7 päivän käyttämättömyyden jälkeen. Varmuuskopioi säännöllisesti (Lataa varmuuskopio → Mail).',
    importFileInvalid: 'Tiedosto ei ole kelvollinen varmuuskopio',
    restoreConfirm: 'Palautetaanko {n} käyntiä? Nykyiset tiedot korvataan.',
    backupRestored: 'Varmuuskopio palautettu',
    backupDownloaded: 'Varmuuskopio tallennettu',
    backupCopied: 'Varmuuskopio kopioitu leikepöydälle',
    copyFailed: 'Kopiointi epäonnistui: {msg}',
    cloudFolderSelected: 'Valittu: {name}',
    cloudFolderPickFailed: 'Kansion valinta epäonnistui: {msg}',
    cloudFolderUnsupported: 'Selaimesi ei tue kansiovalintaa (tarvitaan Chrome/Edge 86+)',
    cloudAccessConfirm: 'Vahvista kansion lupa painamalla Asetuksissa "Valitse kansio"',
    cloudSaveFailed: 'Tallennus kansioon epäonnistui: {msg}',
    cloudPermissionGranted: 'Kansion lupa vahvistettu',
    cloudFolderPicked: 'Kansio valittu',
    backupReminder: 'Muista varmuuskopio: Asetukset → Lataa varmuuskopio (jakovalikko)',
    backupSavedDesktop: 'Varmuuskopio tallennettu Lataukset-kansioon',
    backupSavedPhone: 'Varmuuskopio tallennettu puhelimeen',
    backupOldReminder: 'Muista varmuuskopio: Asetukset → Lataa varmuuskopio',
    visitSaved: 'Tallennettu',
    visitSavedNumber: 'Käynti #{n} – leffan hinta nyt {price}',
    visitNotCounted: 'Tallennettu, mutta ei laskettu: päivä on tulevaisuudessa tai kauden ulkopuolella.',
    visitDeleted: 'Käynti poistettu',
    saveFailed: 'Tallennus epäonnistui – ota varmuuskopio!',
    allVisitsCleared: 'Kaikki käynnit poistettu',
    clearConfirm: 'Poistetaanko KAIKKI käynnit? Tätä ei voi perua.',
    deleteConfirm: 'Poistetaanko tämä käynti?',
    importReading: 'Luetaan…',
    importDone: 'Tuotiin {n} käyntiä välilehdeltä “{sheet}”.',
    importOutside: 'Huom: {n} käynnin päivä on kauden ulkopuolella tai tulevaisuudessa – tarkista: {list}',
    importNoVisits: 'Taulukosta ei löytynyt käyntejä (sarakkeet Päivä ja Elokuva).',
    importReplacePrompt: 'Löytyi {n} käyntiä. OK = korvaa nykyiset {m} käyntiä, Peruuta = lisää vain uudet.',
    xlsxLoadFailed: 'Excel-lukijan lataus epäonnistui (tarvitaan verkkoyhteys)',
    newVisit: 'Uusi käynti',
    editVisit: 'Muokkaa käyntiä',
    dialogDate: 'Päivä',
    dialogMovie: 'Elokuva',
    dialogTheater: 'Teatteri (valinnainen)',
    dialogSnacks: 'Herkut €',
    dialogOther: 'Muut kulut €',
    dialogRating: 'Arvosana (valinnainen)',
    dialogNote: 'Muistiinpano',
    dialogNotePlaceholder: 'esim. 4DX, seuralainen…',
    dialogPreviewHidden: 'Päivä jää laskuista pois: tulevaisuudessa tai kauden ulkopuolella.',
    dialogCancel: 'Peruuta',
    dialogSave: 'Tallenna',
    dialogDelete: 'Poista',
    ratingStar: '{n} tähti',
    ratingStars: '{n} tähteä',
    futureDate: 'tarkista päivä',
    notCounted: 'ei laskettu',
    premiumPaidBack: 'Premium on maksanut itsensä takaisin! Jokainen käynti nyt on puhdasta voittoa sarjalippuun verrattuna.',
    premiumNeed: 'Vielä {n} käyntiä, niin Premium on halvempi kuin sarjalippu ({price}/lippu).',
    treatGoalReached: 'Tavoite saavutettu! Käynnin keskihinta kaikkia kuluja laskien on {price}, eli alle sarjalipun hinnan ({ticket}).',
    treatBudget: 'Voit käyttää herkkuihin joka käynnillä jopa {budget} – niin paljon jää yli pelkän lipun hinnasta (sarjalippu {ticket}), ilman että Premium kallistuisi lippujen ostamista erikseen vastaavaksi.',
    treatGoalLeft: 'Katso vielä {n} {unit} ilman herkkuja tai muita kuluja, niin käynnin keskihinta kaikkia kuluja laskien alittaa sarjalipun hinnan ({ticket}).',
    treatGoalMovie: 'leffa',
    treatGoalMovies: 'leffaa',
    treatGoalDelay: 'Pelkkä vuosimaksu vaatisi {be} käynnin: herkut ja muut kulut ({amount}) ovat siirtäneet tavoitetta {delay} käynnillä.',
    treatGoalNoDelay: 'Herkut ja muut kulut ({amount}) eivät ole vielä siirtäneet tavoitetta.',
    treatGoalEmpty: 'Lisää käyntejä ja tarkista asetusten vuosimaksu sekä sarjalipun hinta, niin tämä kertoo montako leffaa pitää katsoa ilman herkkuja, jotta käynnin hinta alittaa lipun hinnan.',
    noVisitsForSavings: 'Lisää käyntejä nähdäksesi säästön.',
    noVisitsForChart: 'Kaavio näkyy, kun käyntejä on lisätty.',
    noVisitsForMonths: 'Ei käyntejä',
    ratingsEmpty: 'Anna käynnille 1–5 tähteä käynnin lomakkeessa, niin näet täällä keskiarvon ja parhaat elokuvat.',
    ratingsAvg: 'keskiarvo · {rated} / {total} käyntiä arvioitu',
    bestMovies: 'Parhaat',
    worstMovies: 'Heikoimmat',
    langLabel: 'Kieli / Language',
    langFi: 'Suomi',
    langEn: 'English',
    switchToEnglish: 'Vaihda englantiin',
    switchToFinnish: 'Vaihda suomeen',
    tabsSummary: 'Yhteenveto',
    addVisit: 'Lisää käynti',
    achieved: '✓ Saavutettu',
    treatBudgetPerMovie: 'herkkubudjetti {amount}/leffa',
    movieLeft: '{n} leffa',
    moviesLeft: '{n} leffaa',
    avgPurchase: 'keskiostos {amount}',
    daysLeft: '{n} pv',
    pieces: '{n} kpl',
    monthHdr: 'Kk',
    visitsHdr: 'Käyn.',
    snacksHdr: 'Herkut',
    perVisitHdr: '€/käynti',
    savingsHdr: 'Säästö',
    plusSnacksHdr: '+ herkut',
    ratingAria1: '1 tähti',
    ratingAria2: '2 tähteä',
    ratingAria3: '3 tähteä',
    ratingAria4: '4 tähteä',
    ratingAria5: '5 tähteä',
    zeroAmount: '0,00',
    ticketOnly: 'Pelkkä lippu',
    withSnacks: 'Herkut ja muut mukana',
    premiumCostTotal: 'Premium-kulut yhteensä',
    premiumPerVisit: 'Premium €/käynti',
    ticketPerVisit: 'Sarjalippu €/käynti',
    savingsTotal: 'Säästö yhteensä',
    savingsPerVisit: 'Säästö / käynti',
    premiumWorthFrom: 'Premium kannattaa alkaen',
    approx: 'n.',
    visitOrdinal: '{n}. käynti',
    compareFootnote: 'Pelkkä lippu: vuosimaksu verrattuna sarjalippuihin ({n} × {price} = {tickets}). Herkut ja muut mukana: herkut {snacks} ja muut kulut {other} lasketaan Premiumin kuluiksi, sarjalippupuolelle vain liput.',
    monthlyVisitsAria: 'Käynnit kuukausittain',
    breakEvenLine: '0 € = Premium maksanut itsensä',
    savingsAria: 'Kertynyt säästö sarjalippuihin verrattuna',
    snacksMeta: 'herkut {amount}',
    allCosts: 'kaikki kulut {amount}',
    previewCostAfter: 'Käynnin keskihinta kaikkia kuluja laskien tämän jälkeen: ',
    previewTicket: '(sarjalippu {ticket})',
    previewDelay: 'Herkut ja muut kulut (+{amount}) siirtävät herkkutavoitetta n. {n} käynnin verran.',
    previewNoDelay: 'Herkuton käynti ei siirrä herkkutavoitetta.',
    avgAbbrev: 'ka',
    csvHeaders: 'Käynti nro|Päivä|Elokuva|Teatteri|Herkut €|Muut kulut €|Premium €/käynti|Kaikki kulut €/käynti|Arvosana|Muistiinpano',
    csvNotCounted: 'ei laskettu: tarkista päivä',
  },
  en: {
    appTitle: 'Movie Visits',
    heroLabel: 'Cost per visit now',
    heroSub: 'annual fee ÷ visits',
    snacksAndOther: 'Snacks & other included',
    visits: 'Visits',
    latestMovie: 'Latest movie',
    treatGoal: 'Treat goal',
    season: 'Season',
    dateWarningPrefix: 'Date is in the future or outside the season',
    dateWarningSuffix: 'excluded from calculations',
    dateWarningFix: 'Fix the date by tapping the visit on the Visits page.',
    rolloverTitle: 'Season has ended',
    rolloverText: 'Season ended on {end}. New visits are excluded until season dates are updated.',
    rolloverSettings: 'Edit settings',
    rolloverAdvance: 'Advance season by one year',
    rolloverToast: 'Season advanced by one year – check annual fee and ticket price in Settings',
    premiumVsTicket: 'Premium vs. ticket book',
    treatGoalCard: 'Treat goal',
    snacksTotal: 'Snacks total',
    snacksBought: 'Snacks bought',
    seasonLeft: 'Season left',
    forecastEnd: 'Forecast at season end (30-day pace)',
    savingsVsTickets: 'Savings vs. tickets',
    accumulatedSavings: 'Accumulated savings vs. tickets',
    monthly: 'Monthly',
    monthlyFootnote: 'End-of-month situation: annual fee divided by all visits so far. Savings = ticket only; + snacks = snacks and other costs deducted.',
    movieStats: 'Movie stats',
    mostWatched: 'Most watched',
    visitCount: 'Visits',
    mostExpensive: 'Most expensive (all visits + snacks)',
    total: 'Total',
    ratings: 'Ratings',
    searchPlaceholder: 'Search movie…',
    emptyVisits: 'No visits yet. Add the first one with the + button or import from Excel in Settings.',
    settings: 'Settings',
    subscription: 'Subscription',
    annualFee: 'Premium annual fee (€)',
    ticketPrice: 'Ticket price for comparison (€/ticket)',
    seasonStart: 'Season starts',
    seasonEnd: 'Season ends',
    feeDate: 'Annual fee payment date (optional, savings chart zero point)',
    snackBudget: 'Monthly snack budget (€/month, 0 = none)',
    snackBudgetLabel: 'Snack budget this month',
    snackBudgetExceeded: 'Budget exceeded',
    snackBudgetExceededDesc: 'extra snack purchases delay the treat goal.',
    snackBudgetLeft: 'Budget left {amount} for the rest of the month.',
    behind: 'visits behind',
    defaultTheater: 'Default theater (prefilled for new visits)',
    defaultTheaterPlaceholder: 'e.g. Finnkino Tennispalatsi',
    save: 'Save',
    settingsSaved: 'Settings saved',
    selectFolderFirst: 'Select a folder first',
    localFolder: 'Local folder (desktop only)',
    localFolderDesc: 'Chrome/Edge on desktop: backups are saved to a chosen folder, e.g. a OneDrive sync folder.',
    pickFolder: 'Choose folder',
    autoCloudSave: 'Save to folder automatically after every change',
    importExcel: 'Import from Excel',
    importExcelDesc: 'Select Finnkino_Premium_Seuranta.xlsx. The app reads the sheet with columns Day, Movie and Snacks €.',
    importResultReading: 'Reading…',
    backup: 'Backup',
    backupDesc: 'Data is stored only in this browser. Backups are saved to the phone\'s files (Downloads folder or share sheet), not browser cache.',
    noBackupYet: 'No backup yet',
    lastBackup: 'Last backup: {date}',
    autoLocalBackup: 'Save backup to phone automatically once a day (after a change)',
    downloadBackup: 'Download backup (.json)',
    restoreBackup: 'Restore backup',
    copyClipboard: 'Copy to clipboard',
    exportCsv: 'Export CSV (to Excel)',
    clearAll: 'Delete all visits',
    iosHint: 'iPhone/iPad: add the app to the Home Screen (Share → Add to Home Screen) so the browser does not delete data after 7 days of inactivity. Back up regularly (Download backup → Mail).',
    importFileInvalid: 'File is not a valid backup',
    restoreConfirm: 'Restore {n} visits? Current data will be replaced.',
    backupRestored: 'Backup restored',
    backupDownloaded: 'Backup saved',
    backupCopied: 'Backup copied to clipboard',
    copyFailed: 'Copy failed: {msg}',
    cloudFolderSelected: 'Selected: {name}',
    cloudFolderPickFailed: 'Folder selection failed: {msg}',
    cloudFolderUnsupported: 'Your browser does not support folder selection (Chrome/Edge 86+ required)',
    cloudAccessConfirm: 'Confirm folder access by pressing "Choose folder" in Settings',
    cloudSaveFailed: 'Saving to folder failed: {msg}',
    cloudPermissionGranted: 'Folder access confirmed',
    cloudFolderPicked: 'Folder selected',
    backupReminder: 'Remember to back up: Settings → Download backup (share sheet)',
    backupSavedDesktop: 'Backup saved to Downloads folder',
    backupSavedPhone: 'Backup saved to phone',
    backupOldReminder: 'Remember to back up: Settings → Download backup',
    visitSaved: 'Saved',
    visitSavedNumber: 'Visit #{n} – cost per visit now {price}',
    visitNotCounted: 'Saved, but not counted: date is in the future or outside the season',
    visitDeleted: 'Visit deleted',
    saveFailed: 'Save failed – take a backup!',
    allVisitsCleared: 'All visits deleted',
    clearConfirm: 'Delete ALL visits? This cannot be undone.',
    deleteConfirm: 'Delete this visit?',
    importReading: 'Reading…',
    importDone: 'Imported {n} visits from sheet “{sheet}”.',
    importOutside: 'Note: {n} visit(s) have a date outside the season or in the future – check: {list}',
    importNoVisits: 'No visits found in the sheet (columns Day and Movie).',
    importReplacePrompt: 'Found {n} visits. OK = replace current {m} visits, Cancel = add only new ones.',
    xlsxLoadFailed: 'Failed to load Excel reader (network connection required)',
    newVisit: 'New visit',
    editVisit: 'Edit visit',
    dialogDate: 'Date',
    dialogMovie: 'Movie',
    dialogTheater: 'Theater (optional)',
    dialogSnacks: 'Snacks €',
    dialogOther: 'Other costs €',
    dialogRating: 'Rating (optional)',
    dialogNote: 'Note',
    dialogNotePlaceholder: 'e.g. 4DX, companion…',
    dialogPreviewHidden: 'Date excluded from calculations: in the future or outside the season.',
    dialogCancel: 'Cancel',
    dialogSave: 'Save',
    dialogDelete: 'Delete',
    ratingStar: '{n} star',
    ratingStars: '{n} stars',
    futureDate: 'check date',
    notCounted: 'not counted',
    premiumPaidBack: 'Premium has paid for itself! Every visit now is pure profit compared to a ticket book.',
    premiumNeed: 'Still {n} visits until Premium is cheaper than a ticket book ({price}/ticket).',
    treatGoalReached: 'Goal reached! Cost per visit including all costs is {price}, below the ticket price ({ticket}).',
    treatBudget: 'You can spend up to {budget} on snacks per visit – that much is left over from the ticket price (ticket {ticket}), without Premium becoming more expensive than buying tickets separately.',
    treatGoalLeft: 'Watch {n} more {unit} without snacks or other costs, so the cost per visit including all costs falls below the ticket price ({ticket}).',
    treatGoalMovie: 'movie',
    treatGoalMovies: 'movies',
    treatGoalDelay: 'The annual fee alone would require {be} visits: snacks and other costs ({amount}) have delayed the goal by {delay} visits.',
    treatGoalNoDelay: 'Snacks and other costs ({amount}) have not yet delayed the goal.',
    treatGoalEmpty: 'Add visits and check the annual fee and ticket price in settings, and this will tell you how many movies to watch without snacks so the cost per visit falls below the ticket price.',
    noVisitsForSavings: 'Add visits to see savings.',
    noVisitsForChart: 'Chart appears once visits are added.',
    noVisitsForMonths: 'No visits',
    ratingsEmpty: 'Rate a visit 1–5 stars in the visit form to see the average and best movies here.',
    ratingsAvg: 'average · {rated} / {total} visits rated',
    bestMovies: 'Best',
    worstMovies: 'Worst',
    langLabel: 'Language / Kieli',
    langFi: 'Suomi',
    langEn: 'English',
    switchToEnglish: 'Switch to English',
    switchToFinnish: 'Switch to Finnish',
    tabsSummary: 'Summary',
    addVisit: 'Add visit',
    achieved: '✓ Achieved',
    treatBudgetPerMovie: 'snack budget {amount}/movie',
    movieLeft: '{n} movie',
    moviesLeft: '{n} movies',
    avgPurchase: 'avg. purchase {amount}',
    daysLeft: '{n} days',
    pieces: '{n} pcs',
    monthHdr: 'Month',
    visitsHdr: 'Visits',
    snacksHdr: 'Snacks',
    perVisitHdr: '€/visit',
    savingsHdr: 'Savings',
    plusSnacksHdr: '+ snacks',
    ratingAria1: '1 star',
    ratingAria2: '2 stars',
    ratingAria3: '3 stars',
    ratingAria4: '4 stars',
    ratingAria5: '5 stars',
    zeroAmount: '0.00',
    ticketOnly: 'Ticket only',
    withSnacks: 'Snacks & other included',
    premiumCostTotal: 'Total Premium costs',
    premiumPerVisit: 'Premium €/visit',
    ticketPerVisit: 'Ticket €/visit',
    savingsTotal: 'Total savings',
    savingsPerVisit: 'Savings / visit',
    premiumWorthFrom: 'Premium pays off from',
    approx: '~',
    visitOrdinal: 'visit {n}',
    compareFootnote: 'Ticket only: annual fee compared with tickets ({n} × {price} = {tickets}). Snacks & other included: snacks {snacks} and other costs {other} are counted as Premium costs; only tickets on the ticket-book side.',
    monthlyVisitsAria: 'Visits per month',
    breakEvenLine: '€0 = Premium has paid for itself',
    savingsAria: 'Accumulated savings vs. tickets',
    snacksMeta: 'snacks {amount}',
    allCosts: 'all costs {amount}',
    previewCostAfter: 'Cost per visit including all costs after this visit: ',
    previewTicket: '(ticket {ticket})',
    previewDelay: 'Snacks and other costs (+{amount}) delay the treat goal by about {n} visits.',
    previewNoDelay: 'A visit without snacks does not delay the treat goal.',
    avgAbbrev: 'avg',
    csvHeaders: 'Visit no.|Date|Movie|Theater|Snacks €|Other costs €|Premium €/visit|All costs €/visit|Rating|Note',
    csvNotCounted: 'not counted: check date',
  }
};

let currentLang = 'fi';
function t(key, vars) {
  const dict = I18N[currentLang] || I18N.fi;
  let s = (dict[key] != null) ? dict[key] : ((I18N.fi[key] != null) ? I18N.fi[key] : key);
  if (vars) {
    for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  }
  return s;
}
// Välilehtien tekstit päivitetään myös suoraan koodista, jotta ne kääntyvät
// myös silloin, jos selain näyttää vanhaa HTML:ää ilman data-i18n-attribuutteja.
const TAB_I18N = { summary: 'tabsSummary', list: 'visits', settings: 'settings' };

function setLang(lang) {
  if (!I18N[lang]) return;
  currentLang = lang;
  if (typeof state !== 'undefined' && state && state.settings) {
    state.settings.lang = lang;
    save(); // kielivalinta säilyy seuraavassa avauksessa
  }
  applyTranslations();
  if (typeof render === 'function') render();
}
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  document.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  document.querySelectorAll('.tabs button').forEach((b) => {
    const key = TAB_I18N[b.dataset.view];
    if (key) b.textContent = t(key);
  });
  // Yläpalkin lipunappi näyttää sen kielen lipun, johon napsautuksella vaihdetaan:
  // suomenkielisessä näkymässä USA:n lippu (-> English), englanninkielisessä Suomen lippu (-> Suomi).
  const nextLang = currentLang === 'en' ? 'fi' : 'en';
  const flag = $('#lang-flag');
  if (flag) {
    flag.src = nextLang === 'en' ? 'flag-us.svg' : 'flag-fi.svg';
    flag.alt = nextLang === 'en' ? 'English' : 'Suomi';
  }
  const toggleLabel = $('#lang-toggle-label');
  if (toggleLabel) toggleLabel.textContent = nextLang.toUpperCase();
  const langToggle = $('#lang-toggle');
  if (langToggle) {
    const action = t(nextLang === 'en' ? 'switchToEnglish' : 'switchToFinnish');
    langToggle.title = action;
    langToggle.setAttribute('aria-label', action);
  }
  document.documentElement.lang = currentLang;
  document.title = t('appTitle');
}

const STORAGE_KEY = 'leffakaynnit.v1';
const XLSX_URL = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
const DAY = 86400000;

const DEFAULT_STATE = {
  settings: {
    lang: 'fi',
    annualFee: 372.90,
    ticketPrice: 14.45,
    seasonStart: '2026-09-01',
    seasonEnd: '2027-08-31',
    feeDate: '', // Vuosimaksun maksupäivä (valinnainen): säästökaavion nollapiste
    snackBudget: 0, // Kuukausibudjetti herkuille (€/kk), 0 = ei budjettia
    location: '', // Paikka / oletusteatteri (masterdata)
    cloudFolderHandle: null, // File System Access API handle for cloud folder
    autoCloudSave: false, // Automaattinen pilvitallennus
    autoLocalBackup: false, // Päivittäinen varmuuskopio puhelimen tiedostoihin
    lastLocalBackup: null, // Viimeisin päivä (YYYY-MM-DD) jolloin varmuuskopio tehtiin
  },
  visits: [],
};

// Muotoilut seuraavat valittua kieltä: suomeksi 372,90 € / 5.10.2026,
// englanniksi €372.90 / 10/5/2026.
const EUR_FI = new Intl.NumberFormat('fi-FI', { style: 'currency', currency: 'EUR' });
const EUR_EN = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });
const eur = { format: (v) => (currentLang === 'en' ? EUR_EN : EUR_FI).format(v) };
const pad = (n) => String(n).padStart(2, '0');
const fmtDate = (iso) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return currentLang === 'en' ? `${m}/${d}/${y}` : `${d}.${m}.${y}`;
};
const dec1 = (v) => currentLang === 'en' ? v.toFixed(1) : v.toFixed(1).replace('.', ',');
const $ = (sel) => document.querySelector(sel);

// ---------- Tallennus ----------

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const data = JSON.parse(raw);
    return {
      settings: { ...DEFAULT_STATE.settings, ...data.settings },
      visits: Array.isArray(data.visits) ? data.visits : [],
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

/** Tila ilman FileSystemDirectoryHandle-oliota, jotka eivät serialisoidu JSON:ksi. */
function snapshot() {
  const { cloudFolderHandle, ...settings } = state.settings;
  return { ...state, settings };
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot()));
  } catch {
    toast(t('saveFailed'));
  }
}

// Valitun kansion kahva tallennetaan IndexedDB:hen, jotta se säilyy sovelluksen uudelleenavauksen yli
const DB_NAME = 'leffakaynnit';
const DB_STORE = 'kv';

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(DB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(DB_STORE).objectStore(DB_STORE).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbSet(key, value) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    tx.objectStore(DB_STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function hasCloudWriteAccess(handle) {
  return (await handle.queryPermission({ mode: 'readwrite' })) === 'granted';
}

async function restoreCloudHandle() {
  try {
    const handle = await idbGet('cloudFolder');
    if (handle) state.settings.cloudFolderHandle = handle;
  } catch {
    // Tallennettua kansiota ei ole tai IndexedDB ei ole käytettävissä
  }
}

let state = load();
currentLang = (state.settings && state.settings.lang) || 'fi';
if (!I18N[currentLang]) currentLang = 'fi';

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const num = (v) => {
  const n = parseFloat(String(v ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
};

// ---------- Laskenta ----------

/** Lasketaanko käynti mukaan: kauden sisällä eikä tulevaisuudessa. */
function isCounted(v) {
  const s = state.settings;
  return v.date >= s.seasonStart && v.date <= s.seasonEnd && v.date <= todayIso();
}

/** Käynnit, joita ei lasketa mukaan (päivä tulevaisuudessa tai kauden ulkopuolella). */
function suspectVisits() {
  return state.visits.filter((v) => !isCounted(v)).sort((a, b) => a.date.localeCompare(b.date));
}

/** Lasketut käynnit aikajärjestyksessä, jokaiselle järjestysnumero ja kertymät. */
function computeVisits() {
  const fee = state.settings.annualFee;
  const sorted = state.visits.filter(isCounted).sort(
    (a, b) => a.date.localeCompare(b.date) || (a.created ?? 0) - (b.created ?? 0)
  );
  let cumSnacks = 0;
  let cumOther = 0;
  return sorted.map((v, i) => {
    const nro = i + 1;
    cumSnacks += v.snacks || 0;
    cumOther += v.other || 0;
    return {
      ...v,
      nro,
      movieAt: fee / nro, // pelkkä leffa: vuosimaksu jaettuna käyntien määrällä tämän leffan kohdalla
      totalAt: (fee + cumSnacks + cumOther) / nro, // kaikki kulut (herkut ja muut) keskimäärin tähän mennessä
      cumSnacks,
      cumOther,
    };
  });
}

function computeSummary(rows) {
  const s = state.settings;
  const n = rows.length;
  const snacks = rows.reduce((a, v) => a + (v.snacks || 0), 0);
  const other = rows.reduce((a, v) => a + (v.other || 0), 0);
  const start = Date.parse(s.seasonStart);
  const end = Date.parse(s.seasonEnd) + DAY;
  const now = Date.now();
  const totalDays = Math.max(1, Math.round((end - start) / DAY));
  const elapsed = Math.min(totalDays, Math.max(1, Math.ceil((now - start) / DAY)));
  const daysLeft = Math.max(0, Math.ceil((end - now) / DAY));
  // Ennuste viimeisen 30 päivän tahdista: kauden alun innostus ei vääristä koko vuotta
  const pacePeriod = Math.min(30, elapsed);
  const since = new Date(now - pacePeriod * DAY).toISOString().slice(0, 10);
  const recent = rows.filter((r) => r.date > since).length;
  const projected = n ? Math.round(n + (recent / pacePeriod) * daysLeft) : 0;
  const snackVisits = rows.filter((r) => (r.snacks || 0) > 0).length;

  // Eniten katsottu elokuva
  const byTitle = new Map();
  for (const v of rows) {
    const key = v.title.toLowerCase();
    const m = byTitle.get(key) || { title: v.title, count: 0, snacks: 0 };
    m.count++;
    m.snacks += v.snacks || 0;
    byTitle.set(key, m);
  }
  let mostWatched = null;
  let mostExpensiveWithSnacks = null;
  let maxCount = 0;
  let maxTotalWithSnacks = 0;
  for (const m of byTitle.values()) {
    if (m.count > maxCount) {
      maxCount = m.count;
      mostWatched = { title: m.title, count: m.count };
    }
    const totalWithSnacks = (s.annualFee / n) * m.count + m.snacks; // movie cost + snacks for this title
    if (totalWithSnacks > maxTotalWithSnacks) {
      maxTotalWithSnacks = totalWithSnacks;
      mostExpensiveWithSnacks = { title: m.title, total: totalWithSnacks, count: m.count, snacks: m.snacks };
    }
  }

  // Säästö kahdella tavalla: pelkkä vuosimaksu vs. liput, ja kaikki kulut (herkut + muut) Premiumin kuluiksi
  const total = s.annualFee + snacks + other;
  const ticketsTotal = n * s.ticketPrice;
  const breakEven = s.ticketPrice > 0 ? Math.ceil(s.annualFee / s.ticketPrice) : 0;
  // Kaikki kulut huomioiden: ensimmäinen käynti, jolla säästö menee plussalle.
  // Jos ei vielä saavutettu, arvio nykyisellä herkkujen ja muiden kulujen keskiarvolla.
  const reached = rows.find((r) => r.nro * s.ticketPrice - s.annualFee - r.cumSnacks - r.cumOther >= 0);
  const extraPerVisit = n ? (snacks + other) / n : 0;
  const breakEvenAll = reached
    ? reached.nro
    : s.ticketPrice > extraPerVisit ? Math.max(n + 1, Math.ceil(s.annualFee / (s.ticketPrice - extraPerVisit))) : null;

  // Herkkutavoite: montako käyntiä yhteensä tarvitaan, jos uusia herkkuja tai muita kuluja
  // ei enää tehdä, jotta käynnin keskihinta (vuosimaksu + kertyneet herkut + muut kulut)
  // alittaa sarjalipun hinnan. Jokainen osto siirtää tavoitetta, mikä kannustaa hillitsemään
  // herkkukulutusta.
  const extras = snacks + other;
  const snackGoalTotal = s.ticketPrice > 0 ? Math.floor((s.annualFee + extras) / s.ticketPrice) + 1 : null;
  // Kun tavoite on saavutettu: näin paljon jää sarjalipun hinnasta jaettavaksi herkkuihin joka käynnillä
  // (pelkkä leffa maksaa fee/n, lopun lipun hinnasta voi kuluttaa herkkuihin ilman, että Premium
  // kallistuisi sarjalipun ostamista vastaavaksi).
  const treatBudget = s.ticketPrice > 0 && n ? s.ticketPrice - s.annualFee / n : null;

  return {
    n,
    snacks,
    other,
    movie: n ? s.annualFee / n : null,
    withExtras: n ? total / n : null,
    total,
    ticketsTotal,
    saving: ticketsTotal - s.annualFee,
    savingAll: ticketsTotal - total,
    breakEven,
    breakEvenAll,
    breakEvenAllEstimated: !reached,
    snackGoalTotal,
    snackGoalLeft: snackGoalTotal != null ? snackGoalTotal - n : null,
    snackDelay: snackGoalTotal != null && breakEven ? snackGoalTotal - breakEven : null,
    treatBudget,
    // Kuukausitahdista: käynnit per päivä viimeisen 30 päivän ajalta + herkkujen ja muiden
    // kulujen keskiarvo. Käytetään säästökaavion ennusteviivaan (× 30 = käynnit/kk).
    monthPace: pacePeriod ? recent / pacePeriod : 0, // käynnit per päivä (viimeiset 30 pv)
    extraAvg: n ? (snacks + other) / n : 0,
    daysLeft,
    projected,
    snackVisits,
    snackAvg: snackVisits ? snacks / snackVisits : null,
    projectedPrice: projected ? s.annualFee / projected : null,
    mostWatched,
    mostExpensiveWithSnacks,
  };
}

// ---------- Näkymät ----------

function render() {
  const rows = computeVisits();
  const sum = computeSummary(rows);
  renderSummary(rows, sum);
  renderList(rows);
  renderDatalists();
  $('#season-label').textContent =
    `${fmtDate(state.settings.seasonStart)} – ${fmtDate(state.settings.seasonEnd)}`;
}

function renderSummary(rows, sum) {
  const s = state.settings;
  $('#h-movie').textContent = sum.movie != null ? eur.format(sum.movie) : '–';
  $('#h-total').textContent = sum.withExtras != null ? eur.format(sum.withExtras) : '–';
  $('#h-count').textContent = sum.n;

  // Ylälaatikon lisätila: viimeisin katsottu elokuva ja herkkutavoitteen tila
  const latest = rows[rows.length - 1];
  $('#h-latest').textContent = latest ? latest.title : '–';
  $('#h-latest-sub').textContent = latest ? `${fmtDate(latest.date)} · #${latest.nro}` : '';
  const goal = $('#h-goal');
  if (sum.snackGoalLeft == null) {
    goal.textContent = '–';
    $('#h-goal-sub').textContent = '';
  } else if (sum.snackGoalLeft <= 0) {
    goal.textContent = t('achieved');
    $('#h-goal-sub').textContent = sum.treatBudget != null
      ? t('treatBudgetPerMovie', {amount: eur.format(sum.treatBudget)})
      : '';
  } else {
    goal.textContent = t(sum.snackGoalLeft === 1 ? 'movieLeft' : 'moviesLeft', {n: sum.snackGoalLeft});
    $('#h-goal-sub').textContent =
      `${sum.n} / ${sum.snackGoalTotal}` +
      (sum.withExtras != null ? ` · ${eur.format(sum.withExtras)} vs ${eur.format(state.settings.ticketPrice)}` : '');
  }

  const pct = sum.breakEven ? Math.min(100, (sum.n / sum.breakEven) * 100) : 0;
  $('#be-bar').style.width = pct + '%';
  $('#be-label').textContent = `${sum.n} / ${sum.breakEven} ${t('visits').toLowerCase()}`;
  $('#be-text').textContent =
    sum.n >= sum.breakEven
      ? t('premiumPaidBack')
      : t('premiumNeed', {n: sum.breakEven - sum.n, price: eur.format(s.ticketPrice)});

  renderSnackGoal(sum);

  const suspects = suspectVisits();
  const warn = $('#date-warning');
  warn.hidden = !suspects.length;
  warn.innerHTML = suspects.length
    ? `<strong>${suspects.length} ${t('dateWarningSuffix')}</strong><br><span class="small">${t('dateWarningPrefix')}: ` +
      suspects.map((v) => `${esc(v.title)} (${fmtDate(v.date)})`).join(', ') +
      '. ' + t('dateWarningFix') + '</span>'
    : '';

  renderRollover();

  $('#s-snacks').textContent = eur.format(sum.snacks);
  $('#s-snacks-avg').textContent = sum.n ? `${sum.snackVisits} / ${sum.n}` : '–';
  $('#s-snacks-avg-sub').textContent = sum.snackAvg != null ? t('avgPurchase', {amount: eur.format(sum.snackAvg)}) : '';
  renderSavingsCompare(sum);
  $('#s-left').textContent = t('daysLeft', {n: sum.daysLeft});
  $('#s-proj').textContent = sum.projected
    ? `${t('pieces', {n: sum.projected})} · ${eur.format(sum.projectedPrice)}`
    : '–';

  // Elokuvatilastot
  if (sum.mostWatched) {
    $('#s-most-watched').textContent = sum.mostWatched.title;
    $('#s-most-watched-count').textContent = sum.mostWatched.count;
  } else {
    $('#s-most-watched').textContent = '–';
    $('#s-most-watched-count').textContent = '–';
  }
  if (sum.mostExpensiveWithSnacks) {
    $('#s-most-expensive').textContent = sum.mostExpensiveWithSnacks.title;
    $('#s-most-expensive-total').textContent = eur.format(sum.mostExpensiveWithSnacks.total);
  } else {
    $('#s-most-expensive').textContent = '–';
    $('#s-most-expensive-total').textContent = '–';
  }

  const months = monthStats(rows);
  renderSnackBudget(months);
  renderSavingsChart(months, rows.length, sum);
  renderRatings(rows);
  renderMonths(months, rows.length);
}

/** Kauden vaihto -apuri: kun kausi on ohi, muistuta päivittämään päivämäärät, jotta uudet
 *  käynnit eivät jää hiljalleen laskuista pois. */
function renderRollover() {
  const s = state.settings;
  const expired = todayIso() > s.seasonEnd;
  $('#rollover').hidden = !expired;
  if (expired) {
    $('#rollover-text').textContent =
      t('rolloverText', {end: fmtDate(s.seasonEnd)});
  }
}

/** Kuukausibudjetti herkuille: tämän kuun herkkukulut suhteessa Asetuksissa asetettuun rajaan. */
function renderSnackBudget(months) {
  const s = state.settings;
  const el = $('#snack-budget');
  const budget = num(s.snackBudget);
  if (!budget) {
    el.hidden = true;
    el.innerHTML = '';
    return;
  }
  const cur = months.find((m) => m.key === todayIso().slice(0, 7));
  const spent = cur ? cur.snacks : 0;
  const pct = Math.min(100, (spent / budget) * 100);
  el.hidden = false;
  el.innerHTML = `
    <div class="row-between"><strong>${t('snackBudgetLabel')}</strong><span>${eur.format(spent)} / ${eur.format(budget)}</span></div>
    <div class="bar"><div style="width:${pct}%;${spent > budget ? 'background:var(--bad)' : ''}"></div></div>
    <div class="small">${spent > budget
      ? '<span class="bad">' + t('snackBudgetExceeded') + '</span> – ' + t('snackBudgetExceededDesc')
      : t('snackBudgetLeft', {amount: eur.format(budget - spent)})}</div>`;
}

/** Herkkutavoite: montako leffaa pitää katsoa ilman herkkuja ja muita kuluja, jotta
 *  käynnin keskihinta (vuosimaksu + tässä mennessä ostetut herkut ja muut kulut)
 *  alittaa sarjalipun hinnan. Kun tavoite on saavutettu, näytetään paljonko
 *  sarjalipun hinnasta jää herkkubudjettiin joka käynnillä. */
function renderSnackGoal(sum) {
  const s = state.settings;
  const bar = $('#sg-bar');
  const label = $('#sg-label');
  const text = $('#sg-text');
  const budget = $('#sg-budget');
  if (!sum.n || sum.snackGoalTotal == null) {
    bar.style.width = '0';
    label.textContent = '';
    text.innerHTML = t('treatGoalEmpty');
    budget.textContent = '';
    return;
  }
  if (sum.snackGoalLeft <= 0) {
    bar.style.width = '100%';
    label.textContent = `${sum.n} ${t('behind')}`;
    text.innerHTML = t('treatGoalReached', {price: eur.format(sum.withExtras), ticket: eur.format(s.ticketPrice)});
    budget.innerHTML = t('treatBudget', {budget: eur.format(sum.treatBudget), ticket: eur.format(s.ticketPrice)});
    return;
  }
  bar.style.width = Math.min(100, (sum.n / sum.snackGoalTotal) * 100) + '%';
  label.textContent = `${sum.n} / ${sum.snackGoalTotal} ${t('visits').toLowerCase()}`;
  text.innerHTML =
    t('treatGoalLeft', {n: sum.snackGoalLeft, unit: (sum.snackGoalLeft === 1 ? t('treatGoalMovie') : t('treatGoalMovies')), ticket: eur.format(s.ticketPrice)});
  budget.innerHTML =
    sum.snackDelay > 0
      ? t('treatGoalDelay', {be: sum.breakEven, amount: eur.format(sum.snacks + sum.other), delay: sum.snackDelay})
      : t('treatGoalNoDelay', {amount: eur.format(sum.snacks + sum.other)});
}

/** Arvosanat: keskiarvo, jakauma sekä parhaat ja heikoimmat elokuvat (saman elokuvan käynnit keskiarvona). */
function renderRatings(rows) {
  const el = $('#ratings');
  const rated = rows.filter((r) => r.rating > 0);
  if (!rated.length) {
    el.innerHTML = '<p class="muted small">' + t('ratingsEmpty') + '</p>';
    return;
  }
  const fmt1 = dec1;
  const avg = rated.reduce((a, r) => a + r.rating, 0) / rated.length;
  const dist = [5, 4, 3, 2, 1].map((v) => ({ v, count: rated.filter((r) => r.rating === v).length }));
  const maxCount = Math.max(...dist.map((d) => d.count));

  const byTitle = new Map();
  for (const r of rated) {
    const key = r.title.toLowerCase();
    const m = byTitle.get(key) || { title: r.title, sum: 0, count: 0 };
    m.sum += r.rating;
    m.count++;
    byTitle.set(key, m);
  }
  const films = [...byTitle.values()].map((m) => ({ ...m, avg: m.sum / m.count }));
  const byBest = (a, b) => b.avg - a.avg || a.title.localeCompare(b.title, currentLang === 'en' ? 'en' : 'fi');
  const best = [...films].sort(byBest).slice(0, 3);
  // Heikoimmat vasta kun arvioituja elokuvia on tarpeeksi, ettei sama elokuva näy molemmissa listoissa
  const worst = films.length >= 6 ? [...films].sort((a, b) => -byBest(a, b)).slice(0, 3) : [];
  const list = (items) =>
    items
      .map((f) => `<li><span class="stars-small">${stars(Math.round(f.avg))}</span> ${esc(f.title)}${f.count > 1 ? ` <span class="muted">(${f.count}×, ${t('avgAbbrev')} ${fmt1(f.avg)})</span>` : ''}</li>`)
      .join('');

  el.innerHTML = `
    <div class="rating-summary">
      <div class="rating-avg">★ ${fmt1(avg)}</div>
      <div class="small muted">${t('ratingsAvg', {rated: rated.length, total: rows.length})}</div>
    </div>
    <div class="dist">
      ${dist
        .map((d) => `<div class="dist-row"><span>${d.v} ★</span>
          <div class="dist-bar"><div style="width:${maxCount ? (d.count / maxCount) * 100 : 0}%"></div></div>
          <span>${d.count}</span></div>`)
        .join('')}
    </div>
    <div class="small"><strong>${t('bestMovies')}</strong></div>
    <ul class="rating-list">${list(best)}</ul>
    ${worst.length ? `<div class="small"><strong>${t('worstMovies')}</strong></div><ul class="rating-list">${list(worst)}</ul>` : ''}`;
}

/** Vertailu: säästö ja €/käynti ilman herkkuja ja muita kuluja sekä niiden kanssa. */
function renderSavingsCompare(sum) {
  const s = state.settings;
  const el = $('#savings-compare');
  if (!sum.n) {
    el.innerHTML = '<p class="muted small">' + t('noVisitsForSavings') + '</p>';
    return;
  }
  const money = (v) => eur.format(v);
  const signed = (v) => `<span class="${v >= 0 ? 'good' : 'bad'}">${v >= 0 ? '+' : ''}${eur.format(v)}</span>`;
  const be = (count, estimated) => (count == null ? '–'
    : (estimated ? t('approx') + ' ' : '') + t('visitOrdinal', {n: count}));
  const rowsHtml = [
    [t('premiumCostTotal'), money(s.annualFee), money(sum.total)],
    [t('premiumPerVisit'), money(sum.movie), money(sum.withExtras)],
    [t('ticketPerVisit'), money(s.ticketPrice), money(s.ticketPrice)],
    [t('savingsTotal'), signed(sum.saving), signed(sum.savingAll)],
    [t('savingsPerVisit'), signed(sum.saving / sum.n), signed(sum.savingAll / sum.n)],
    [t('premiumWorthFrom'), be(sum.breakEven, false), be(sum.breakEvenAll, sum.breakEvenAllEstimated)],
  ]
    .map(([label, a, b]) => `<tr><td>${label}</td><td>${a}</td><td>${b}</td></tr>`)
    .join('');
  el.innerHTML = `
    <table class="months compare">
      <thead><tr><th></th><th>${t('ticketOnly')}</th><th>${t('withSnacks')}</th></tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>
    <p class="small muted">${t('compareFootnote', {
      n: sum.n, price: money(s.ticketPrice), tickets: money(sum.ticketsTotal),
      snacks: money(sum.snacks), other: money(sum.other),
    })}</p>`;
}

const MONTH_NAMES =['tammi', 'helmi', 'maalis', 'huhti', 'touko', 'kesä', 'heinä', 'elo', 'syys', 'loka', 'marras', 'joulu'];
const MONTH_NAMES_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function monthNames() { return (typeof currentLang !== 'undefined' && currentLang === 'en') ? MONTH_NAMES_EN : MONTH_NAMES; }

/**
 * Kuukausikohtaiset luvut kauden alusta kuluvaan kuukauteen, myös kuukaudet ilman käyntejä.
 * €/käynti ja säästö ovat kuukauden lopun tilanne: vuosimaksu maksetaan kerran, joten
 * se jaetaan kaikilla siihen mennessä kertyneillä käynneillä.
 */
function monthStats(rows) {
  const s = state.settings;
  const today = todayIso().slice(0, 7);
  const end = s.seasonEnd.slice(0, 7) < today ? s.seasonEnd.slice(0, 7) : today;
  // Vuosimaksun maksupäivä: kuukausi, josta säästölaskenta alkaa – maksua edeltävillä
  // kuukausilla säästö on 0, koska vuosimaksua ei vielä ole maksettu.
  const feeMonth = /^\d{4}-\d{2}/.test(s.feeDate || '') ? s.feeDate.slice(0, 7) : null;
  let startKey = s.seasonStart.slice(0, 7);
  if (feeMonth && feeMonth < startKey) startKey = feeMonth;
  const months = [];
  for (let [y, m] = startKey.split('-').map(Number); `${y}-${pad(m)}` <= end; m === 12 ? (y++, (m = 1)) : m++) {
    const key = `${y}-${pad(m)}`;
    const feePaid = !feeMonth || key >= feeMonth;
    const inMonth = rows.filter((r) => r.date.startsWith(key));
    const upTo = rows.filter((r) => r.date.slice(0, 7) <= key);
    const cumCount = upTo.length;
    const cumExtras = upTo.reduce((a, r) => a + (r.snacks || 0) + (r.other || 0), 0);
    months.push({
      key,
      label: `${monthNames()[m - 1]} ${String(y).slice(2)}`,
      short: monthNames()[m - 1].slice(0, 3),
      count: inMonth.length,
      snacks: inMonth.reduce((a, r) => a + (r.snacks || 0), 0),
      movie: cumCount ? s.annualFee / cumCount : null,
      saving: feePaid ? cumCount * s.ticketPrice - s.annualFee : 0,
      savingAll: feePaid ? cumCount * s.ticketPrice - s.annualFee - cumExtras : 0,
    });
  }
  return months;
}

function renderMonths(months, visitCount) {
  const fmt = (v) => (v == null ? '–' : eur.format(v));
  const signed = (v) => `<span class="${v >= 0 ? 'good' : 'bad'}">${v >= 0 ? '+' : ''}${eur.format(v)}</span>`;
  $('#months').innerHTML = visitCount
    ? months
        .map((m) => `<tr><td>${m.label}</td><td>${m.count}</td><td>${eur.format(m.snacks)}</td>
          <td>${fmt(m.movie)}</td><td>${signed(m.saving)}</td><td>${signed(m.savingAll)}</td></tr>`)
        .join('')
    : '<tr><td colspan="6" class="muted">' + t('noVisitsForMonths') + '</td></tr>';
  renderVisitsChart(months, visitCount);
}

/** Pylväät: käyntien määrä kuukausittain. */
function renderVisitsChart(months, visitCount) {
  const el = $('#visits-chart');
  if (!visitCount) {
    el.innerHTML = '';
    return;
  }
  const W = 320, H = 130, L = 8, R = 8, T = 16, B = 20;
  const yMax = Math.max(1, ...months.map((m) => m.count));
  const y = (v) => T + (1 - v / yMax) * (H - T - B);
  const groupW = (W - L - R) / months.length;
  const barW = Math.min(36, groupW * 0.7);
  const labelEvery = months.length > 8 ? 2 : 1;

  const bars = months
    .map((m, i) => {
      const cx = L + (i + 0.5) * groupW;
      const bar = m.count
        ? `<rect x="${(cx - barW / 2).toFixed(1)}" y="${y(m.count).toFixed(1)}" width="${barW.toFixed(1)}"
            height="${(y(0) - y(m.count)).toFixed(1)}" fill="var(--accent)" rx="2"/>
           <text x="${cx.toFixed(1)}" y="${(y(m.count) - 4).toFixed(1)}" text-anchor="middle" class="bar-value">${m.count}</text>`
        : '';
      const label = i % labelEvery === 0 ? `<text x="${cx.toFixed(1)}" y="${H - 5}" text-anchor="middle">${m.short}</text>` : '';
      return bar + label;
    })
    .join('');

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${t('monthlyVisitsAria')}">
      <line x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}" stroke="var(--border)"/>
      ${bars}
    </svg>`;
}

/**
 * Viivat: kertynyt säästö sarjalippuihin verrattuna kuukauden lopussa, pelkällä lipulla
 * sekä herkut ja muut kulut mukaan laskettuna. Molemmat alkavat miinukselta (vuosimaksu).
 */
function renderSavingsChart(months, visitCount, sum) {
  const el = $('#savings-chart');
  if (!visitCount) {
    el.innerHTML = '<p class="muted small">' + t('noVisitsForChart') + '</p>';
    return;
  }
  const s = state.settings;
  const W = 320, H = 170, L = 44, R = 12, T = 12, B = 22;
  // Vuosimaksun maksupäivä: kun se on kauden alun edellä, months alkaa jo maksukuukaudesta
  // (säästö 0) ja siirtyy -vuosimaksu arvoon maksukuukautena, jolloin synteettistä
  // aloituspistettä ei enää tarvita.
  const feeMonth = /^\d{4}-\d{2}/.test(s.feeDate || '') ? s.feeDate.slice(0, 7) : null;
  const syntheticStart = !feeMonth || feeMonth >= s.seasonStart.slice(0, 7);
  const labels = syntheticStart ? ['', ...months.map((m) => m.short)] : months.map((m) => m.short);
  const series = [
    { key: 'saving', color: 'var(--accent)', label: t('ticketOnly'), now: sum.saving },
    { key: 'savingAll', color: 'var(--accent-2)', label: t('withSnacks'), now: sum.savingAll },
  ].map((sr) => ({ ...sr, values: [...(syntheticStart ? [-s.annualFee] : []), ...months.map((m) => m[sr.key])] }));
  const vals = series.flatMap((sr) => sr.values);
  // Tasaiset akselin arvot (esim. 100 €:n välein), ja tilaa nollaviivan yläpuolelle
  const span = Math.max(...vals, 0) - Math.min(...vals);
  const step = [50, 100, 200, 250, 500, 1000].find((st) => span / st <= 5) || 1000;
  const yMin = Math.floor(Math.min(...vals) / step) * step;
  const yMax = Math.ceil((Math.max(0, ...vals) + step * 0.5) / step) * step;
  const x = (i) => L + (i / (labels.length - 1)) * (W - L - R);
  const y = (v) => T + (1 - (v - yMin) / (yMax - yMin)) * (H - T - B);

  const ticks = [];
  for (let v = yMin; v <= yMax; v += step) if (v !== 0) ticks.push(v);
  const grid = ticks
    .map((v) => `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="var(--border)" stroke-width="0.6"/>
      <text x="${L - 4}" y="${y(v) + 3}" text-anchor="end">${v} €</text>`)
    .join('');
  const zero = `<line x1="${L}" x2="${W - R}" y1="${y(0)}" y2="${y(0)}" stroke="var(--muted)" stroke-dasharray="4 3"/>
    <text x="${L + 3}" y="${y(0) - 4}" class="small">${t('breakEvenLine')}</text>`;
  const labelEvery = labels.length > 9 ? 2 : 1;
  const xLabels = labels
    .map((l, i) => (l && i % labelEvery === 1 % labelEvery ? `<text x="${x(i)}" y="${H - 6}" text-anchor="middle">${l}</text>` : ''))
    .join('');
  const lines = series
    .map((sr) => {
      const path = sr.values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('');
      const dots = sr.values.map((v, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="2.5" fill="${sr.color}"/>`).join('');
      return `<path d="${path}" fill="none" stroke="${sr.color}" stroke-width="2.5"/>${dots}`;
    })
    .join('');
  const signed = (v) => `<strong class="${v >= 0 ? 'good' : 'bad'}">${v >= 0 ? '+' : ''}${eur.format(v)}</strong>`;

  el.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${t('savingsAria')}">
      ${grid}${zero}${xLabels}${lines}
    </svg>
    <div class="legend small">
      ${series.map((sr) => `<span><i class="dot" style="background:${sr.color}"></i>${sr.label}: ${signed(sr.now)}</span>`).join('')}
    </div>`;
}

function renderList(rows) {
  const q = $('#search').value.trim().toLowerCase();
  const match = (r) => !q || r.title.toLowerCase().includes(q);
  const suspects = suspectVisits().filter(match);
  const shown = rows.filter(match).reverse();
  $('#empty').hidden = state.visits.length > 0;

  // Lasketaan mukaan vain kauden käynnit tähän päivään asti; muut näytetään ylimpänä varoituksella
  const suspectItems = suspects
    .map((r) => {
      const meta = [fmtDate(r.date), r.theater, r.note].filter(Boolean).map(esc).join(' · ');
      return `<li class="visit suspect" data-id="${r.id}">
        <div class="nro">!</div>
        <div class="title">${esc(r.title)}</div>
        <div class="price"><span>${t('notCounted')}</span></div>
        <div class="meta">${meta} · ${t('futureDate')}</div>
      </li>`;
    })
    .join('');

  const items = shown
    .map((r) => {
      const meta = [fmtDate(r.date), r.theater, r.note].filter(Boolean).map(esc).join(' · ');
      const rating = r.rating ? `<span class="stars-small">${stars(r.rating)}</span> ` : '';
      const snack = r.snacks ? ` · <span class="snack">${t('snacksMeta', {amount: eur.format(r.snacks)})}</span>` : '';
      const withSnacks = r.snacks || r.other ? `<span>${t('allCosts', {amount: eur.format(r.totalAt)})}</span>` : '';
      return `<li class="visit" data-id="${r.id}">
        <div class="nro">${r.nro}</div>
        <div class="title">${esc(r.title)}</div>
        <div class="price"><b>${eur.format(r.movieAt)}</b>${withSnacks}</div>
        <div class="meta">${rating}${meta}${snack}</div>
      </li>`;
    })
    .join('');

  $('#visits').innerHTML = suspectItems + items;
}

function renderDatalists() {
  const uniq = (key) => [...new Set(state.visits.map((v) => v[key]).filter(Boolean))].sort();
  $('#titles').innerHTML = uniq('title').map((t) => `<option value="${esc(t)}">`).join('');
  $('#theaters').innerHTML = uniq('theater').map((t) => `<option value="${esc(t)}">`).join('');
  // Lisää paikat (teatterit) paikka-datalistiin
  $('#locations').innerHTML = uniq('theater').map((t) => `<option value="${esc(t)}">`).join('');
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2600);
}

// ---------- Navigointi ----------

function showView(name) {
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === 'view-' + name));
  document.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('active', b.dataset.view === name));
  window.scrollTo(0, 0);
}
document.querySelectorAll('.tabs button').forEach((b) => b.addEventListener('click', () => showView(b.dataset.view)));

// ---------- Käynnin lisäys / muokkaus ----------

const dialog = $('#visit-dialog');
const form = $('#visit-form');

function todayIso() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function openVisit(visit) {
  form.reset();
  $('#dialog-title').textContent = t(visit ? 'editVisit' : 'newVisit');
  $('#delete-visit').hidden = !visit;
  form.id.value = visit?.id ?? '';
  form.date.value = visit?.date ?? todayIso();
  form.title.value = visit?.title ?? '';
  // Uusi käynti: esitäytä teatteri asetuksista (paikka/masterdata) tai viimeisimmän käynnin teatterista
  form.theater.value = visit ? visit.theater || '' : state.settings.location || state.visits.at(-1)?.theater || '';
  form.snacks.value = visit?.snacks ? String(visit.snacks).replace('.', ',') : '';
  form.other.value = visit?.other ? String(visit.other).replace('.', ',') : '';
  form.note.value = visit?.note ?? '';
  setRating(visit?.rating || 0);
  dialog.showModal();
  updateVisitPreview();
  if (!visit) form.title.focus();
}

function setRating(v) {
  form.rating.value = v || '';
  for (const b of document.querySelectorAll('#rating-stars button')) {
    const n = Number(b.dataset.v);
    b.classList.toggle('on', n <= v);
    b.setAttribute('aria-checked', String(n === v));
  }
}

// Saman tähden napautus uudelleen poistaa arvosanan
$('#rating-stars').addEventListener('click', (e) => {
  const b = e.target.closest('button');
  if (!b) return;
  const v = Number(b.dataset.v);
  setRating(Number(form.rating.value) === v ? 0 : v);
});

const stars = (v) => '★'.repeat(v) + '☆'.repeat(5 - v);

/** Ennakoiva palaute lisäys-/muokkausdialogissa: mitä tämä käynti tekee herkkutavoitteelle.
 *  Palautte näkyy hinta hetkessä, ennen tallennusta. */
function updateVisitPreview() {
  const s = state.settings;
  const preview = $('#visit-preview');
  if (!s.annualFee || !s.ticketPrice || !form.date.value) {
    preview.hidden = true;
    return;
  }
  const counted = form.date.value >= s.seasonStart && form.date.value <= s.seasonEnd && form.date.value <= todayIso();
  if (!counted) {
    preview.hidden = false;
    preview.innerHTML = t('dialogPreviewHidden');
    return;
  }
  // Perusta: nykyinen tila ilman tätä käynniä (muokatessa vanha versio pudotetaan pois)
  const base = state.visits.filter((v) => v.id !== form.id.value).filter(isCounted);
  const n1 = base.length + 1;
  const extras = num(form.snacks.value) + num(form.other.value);
  const cumExtras = base.reduce((a, v) => a + (v.snacks || 0) + (v.other || 0), 0);
  const avgAfter = (s.annualFee + cumExtras + extras) / n1;
  preview.hidden = false;
  preview.innerHTML =
    t('previewCostAfter') +
    `<strong class="${avgAfter < s.ticketPrice ? 'good' : ''}">${eur.format(avgAfter)}</strong> ` +
    t('previewTicket', {ticket: eur.format(s.ticketPrice)}) +
    (extras > 0
      ? '<br>' + t('previewDelay', {amount: eur.format(extras), n: dec1(extras / s.ticketPrice)})
      : '<br>' + t('previewNoDelay'));
}

form.addEventListener('input', updateVisitPreview);
form.addEventListener('change', updateVisitPreview);

$('#fab').addEventListener('click', () => openVisit(null));
$('#cancel-visit').addEventListener('click', () => dialog.close());
$('#visits').addEventListener('click', (e) => {
  const li = e.target.closest('.visit');
  if (li) openVisit(state.visits.find((v) => v.id === li.dataset.id));
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    date: form.date.value,
    title: form.title.value.trim(),
    theater: form.theater.value.trim(),
    snacks: num(form.snacks.value),
    other: num(form.other.value),
    rating: Number(form.rating.value) || 0,
    note: form.note.value.trim(),
  };
  if (!data.date || !data.title) return;
  const id = form.id.value;
  if (id) {
    const v = state.visits.find((x) => x.id === id);
    Object.assign(v, data);
  } else {
    state.visits.push({ id: uid(), created: Date.now(), ...data });
  }
  save();
  autoSaveToCloud();
  render();
  dialog.close();
  const rows = computeVisits();
  const me = rows.find((r) => r.title === data.title && r.date === data.date);
  if (!me) toast(t('visitNotCounted'));
  else toast(id ? t('visitSaved') : t('visitSavedNumber', {n: me.nro, price: eur.format(computeSummary(rows).movie)}));
});

$('#delete-visit').addEventListener('click', () => {
  const id = form.id.value;
  if (!id || !confirm(t('deleteConfirm'))) return;
  state.visits = state.visits.filter((v) => v.id !== id);
  save();
  autoSaveToCloud();
  render();
  dialog.close();
  toast(t('visitDeleted'));
});

$('#search').addEventListener('input', () => renderList(computeVisits()));

// ---------- Kauden vaihto ----------

$('#rollover-settings').addEventListener('click', () => showView('settings'));
$('#rollover-advance').addEventListener('click', () => {
  const addYear = (iso) => {
    const [y, m, d] = iso.split('-').map(Number);
    return `${y + 1}-${pad(m)}-${pad(d)}`;
  };
  const subYearOneDay = (iso) => {
    // Uusi kauden alku viimeistään: kauden loppu − 1 vuosi + 1 päivä (käyttö, jos alkua ja loppua
    // ei edelleenkään saada oikeaan järjestykseen)
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(Date.UTC(y - 1, m - 1, d + 1));
    return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
  };
  state.settings.seasonStart = addYear(state.settings.seasonStart);
  state.settings.seasonEnd = addYear(state.settings.seasonEnd);
  if (state.settings.seasonStart >= state.settings.seasonEnd) {
    state.settings.seasonStart = subYearOneDay(state.settings.seasonEnd);
  }
  save();
  autoSaveToCloud();
  fillSettings();
  render();
  toast(t('rolloverToast'));
});

// ---------- Asetukset ----------

const sForm = $('#settings-form');
function fillSettings() {
  for (const [k, v] of Object.entries(state.settings)) if (sForm[k]) sForm[k].value = v;
  // Varmuuskopion tila asetuksissa
  const bs = $('#backup-status');
  if (bs) {
    const last = state.settings.lastLocalBackup;
    bs.textContent = last ? t('lastBackup', {date: fmtDate(last)}) : t('noBackupYet');
  }
  // Kielivalitsin synkronointi
  const ls = $('#lang-select');
  if (ls) ls.value = currentLang;
  // iOS: muistutus Koti-valikkoon lisäämisestä
  const iosHint = $('#ios-hint');
  if (iosHint) {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    iosHint.hidden = standalone || !isIOS;
  }
}
sForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Säilytä muut asetukset (pilvi, varmuuskopio), vain lomakkeen kentät päivittyvät
  state.settings = {
    ...state.settings,
    annualFee: num(sForm.annualFee.value),
    ticketPrice: num(sForm.ticketPrice.value),
    seasonStart: sForm.seasonStart.value,
    seasonEnd: sForm.seasonEnd.value,
    feeDate: sForm.feeDate.value,
    snackBudget: num(sForm.snackBudget.value),
    location: sForm.location.value.trim(),
  };
  save();
  autoSaveToCloud();
  render();
  toast(t('settingsSaved'));
});

// Kansion valinta
$('#pick-cloud-folder').addEventListener('click', async () => {
  // Tallennettu kansio: riittää vahvistaa lupa, ei tarvitse valita uudelleen
  const saved = state.settings.cloudFolderHandle;
  if (saved && (await saved.requestPermission({ mode: 'readwrite' })) === 'granted') {
    showCloudStatus();
    toast(t('cloudPermissionGranted'));
    return;
  }
  const handle = await pickCloudFolder();
  if (handle) {
    state.settings.cloudFolderHandle = handle;
    showCloudStatus();
    toast(t('cloudFolderPicked'));
  }
});

function showCloudStatus() {
  const h = state.settings.cloudFolderHandle;
  $('#cloud-folder-status').textContent = h ? t('cloudFolderSelected', {name: h.name}) : '';
  $('#auto-cloud-save').disabled = !h;
}

// Automaattinen tallennus paikalliseen kansioon
$('#auto-cloud-save').addEventListener('change', (e) => {
  if (e.target.checked && !state.settings.cloudFolderHandle) {
    e.target.checked = false;
    toast(t('selectFolderFirst'));
  }
  state.settings.autoCloudSave = e.target.checked;
  save();
});

// ---------- Varmuuskopio ----------

async function download(name, content, type) {
  // Puhelimessa jakovalikko, josta voi valita "Tallenna OneDriveen"
  const file = new File([content], name, { type });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: name });
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
    }
  }
  saveFile(name, content, type);
}

// ---------- Pilvitallennus (File System Access API) ----------

/** Avaa kansiovalikon (esim. OneDrive-synkronointikansio tietokoneella) */
async function pickCloudFolder() {
  if (!('showDirectoryPicker' in window)) {
    toast(t('cloudFolderUnsupported'));
    return null;
  }
  try {
    const handle = await window.showDirectoryPicker({ mode: 'readwrite', startIn: 'documents' });
    await idbSet('cloudFolder', handle);
    return handle;
  } catch (err) {
    if (err.name !== 'AbortError') {
      toast(t('cloudFolderPickFailed', {msg: err.message}));
    }
    return null;
  }
}

/** Tallenna tiedosto valittuun kansioon */
async function saveToCloudFolder(handle, fileName, content, type) {
  if (!handle) return false;
  if (!(await hasCloudWriteAccess(handle))) {
    toast(t('cloudAccessConfirm'));
    return false;
  }
  try {
    const fileHandle = await handle.getFileHandle(fileName, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
    return true;
  } catch (err) {
    toast(t('cloudSaveFailed', {msg: err.message}));
    return false;
  }
}

let cloudTimer = null;

/** Tallennus viivästetään hieman, jotta peräkkäiset muutokset lähtevät yhtenä kertana. */
function autoSaveToCloud() {
  clearTimeout(cloudTimer);
  cloudTimer = setTimeout(async () => {
    if (state.settings.autoCloudSave) await saveToFolderNow();
    runLocalBackup();
  }, 1500);
}

/** Lataa varmuuskopion tiedostoksi (puhelimen Lataukset-kansio, ei välimuisti). */
function saveFile(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Kerran päivässä muutoksen jälkeen, jos asetus on päällä.
 *  Desktopilla tallennetaan Lataukset-kansioon hiljaa (yksi JSON-tiedosto).
 *  Mobiilissa ei avata jakovalikkoa automaattisesti (häiritsevää) — sen sijaan
 *  muistutetaan kerran päivässä, jolloin käyttäjä voi itse valita jakovalikosta
 *  Mail/Drive/Tiedostot. */
function runLocalBackup() {
  const today = todayIso();
  if (!state.settings.autoLocalBackup || !state.visits.length || state.settings.lastLocalBackup === today) return;
  const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isMobile) {
    state.settings.lastLocalBackup = today;
    save();
    const bs = $('#backup-status');
    if (bs) bs.textContent = t('lastBackup', {date: fmtDate(today)});
    toast(t('backupReminder'));
    return;
  }
  saveFile(`leffakaynnit-${today}.json`, JSON.stringify(snapshot(), null, 2), 'application/json');
  state.settings.lastLocalBackup = today;
  save();
  const bs = $('#backup-status');
  if (bs) bs.textContent = t('lastBackup', {date: fmtDate(today)});
  toast(t('backupSavedDesktop'));
}

$('#auto-local-backup').addEventListener('change', (e) => {
  state.settings.autoLocalBackup = e.target.checked;
  save();
  if (e.target.checked) runLocalBackup();
});

/** Muistutus, jos varmuuskopio on yli viikon vanha. */
function remindBackup() {
  const last = state.settings.lastLocalBackup;
  if (!state.visits.length || (last && daysBetween(last, todayIso()) < 7)) return;
  toast(t('backupOldReminder'));
}

function daysBetween(a, b) {
  return Math.round((Date.parse(b) - Date.parse(a)) / DAY);
}

async function saveToFolderNow() {
  const h = state.settings.cloudFolderHandle;
  // Tyhjää tilaa ei tallenneta, ettei se korvaa aiempaa varmuuskopiota
  if (!h || !state.visits.length) return;
  const stamp = todayIso();
  await Promise.all([
    saveToCloudFolder(h, `leffakaynnit-${stamp}.json`, JSON.stringify(snapshot(), null, 2), 'application/json'),
    saveToCloudFolder(h, `leffakaynnit-${stamp}.csv`, generateCSV(), 'text/csv'),
  ]);
}

function generateCSV() {
  const dec = (v) => currentLang === 'en' ? v.toFixed(2) : v.toFixed(2).replace('.', ',');
  const lines = [t('csvHeaders').split('|')];
  for (const r of computeVisits()) {
    lines.push([r.nro, fmtDate(r.date), r.title, r.theater || '', dec(r.snacks || 0), dec(r.other || 0), dec(r.movieAt), dec(r.totalAt), r.rating || '', r.note || '']);
  }
  // Laskemattomat käynnit mukaan ilman järjestysnumeroa ja hintoja, jotta mitään ei katoa
  for (const r of suspectVisits()) {
    lines.push(['', fmtDate(r.date), r.title, r.theater || '', dec(r.snacks || 0), dec(r.other || 0), '', '', r.rating || '', [r.note, t('csvNotCounted')].filter(Boolean).join(' · ')]);
  }
  // Englanninkielisessä CSV:ssä erotin on pilkku ja desimaalipiste; suomeksi puolipiste ja pilkku.
  // parseCSV tunnistaa molemmat, joten vienti ja tuonti toimivat kummalla kielellä tahansa.
  const sep = currentLang === 'en' ? ',' : ';';
  return '\uFEFF' + lines.map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(sep)).join('\r\n');
}

$('#export-json').addEventListener('click', () => {
  download(`leffakaynnit-${todayIso()}.json`, JSON.stringify(snapshot(), null, 2), 'application/json');
});

$('#copy-backup').addEventListener('click', async () => {
  const text = JSON.stringify(snapshot(), null, 2);
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      toast(t('backupCopied'));
    } else {
      // Fallback: näytä teksti valittavana
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.append(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      toast(t('backupCopied'));
    }
  } catch (err) {
    toast(t('copyFailed', {msg: err.message}));
  }
});

$('#import-json').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  await restoreBackup(await file.text());
});

/** Palauttaa varmuuskopion JSON-tekstistä. Korvaa nykyisen tilan käyttäjän vahvistuksella. */
async function restoreBackup(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = null;
  }
  if (!data || !Array.isArray(data.visits)) return toast(t('importFileInvalid'));
  if (!confirm(t('restoreConfirm', {n: data.visits.length}))) return;
  state = {
    settings: { ...DEFAULT_STATE.settings, ...data.settings, cloudFolderHandle: state.settings.cloudFolderHandle },
    visits: data.visits,
  };
  save();
  fillSettings();
  render();
  showCloudStatus();
  toast(t('backupRestored'));
}

$('#export-csv').addEventListener('click', () => {
  download(`leffakaynnit-${todayIso()}.csv`, generateCSV(), 'text/csv');
});

$('#clear-all').addEventListener('click', () => {
  if (!state.visits.length || !confirm(t('clearConfirm'))) return;
  state.visits = [];
  save();
  autoSaveToCloud();
  render();
  toast(t('allVisitsCleared'));
});

// ---------- Excel-tuonti ----------

function loadXlsx() {
  if (window.XLSX) return Promise.resolve(window.XLSX);
  return new Promise((resolve, reject) => {
    const s = Object.assign(document.createElement('script'), { src: XLSX_URL });
    s.onload = () => resolve(window.XLSX);
    s.onerror = () => reject(new Error(t('xlsxLoadFailed')));
    document.head.append(s);
  });
}

/** Muuntaa Excelin päivämäärän (sarjanumero tai teksti) muotoon YYYY-MM-DD. */
function parseDate(v) {
  if (v == null || v === '') return null;
  if (typeof v === 'number') {
    const d = new Date(Date.UTC(1899, 11, 30) + Math.round(v) * DAY);
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
  }
  const s = String(v).trim();
  let m;
  if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  if ((m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})/))) return `${m[3]}-${pad(m[2])}-${pad(m[1])}`;
  if ((m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/))) return `${m[3]}-${pad(m[1])}-${pad(m[2])}`; // US m/d/y
  return null;
}

/** Muuntaa soluruudukon (2D-taulukko) käyntiriveiksi. Käytetään sekä Excel- että CSV-tuonnissa. */
function rowsFromGrid(grid, sheetName) {
  // Otsikot tunnistetaan sekä suomeksi että englanniksi, jotta sovelluksen oma CSV-vienti
  // voidaan tuoda takaisin kummalla kielellä tahansa.
  const hi = grid.findIndex((row) => row.some((c) => /elokuva|movie|film/i.test(String(c))));
  if (hi < 0) return null;
  // Ääkköset pois, jotta "Paiva" ja "Päivä" tunnistetaan samoin
  const head = grid[hi].map((c) => String(c).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
  const col = (re) => head.findIndex((h) => re.test(h));
  const c = {
    date: col(/paiva|pvm|date/),
    title: col(/elokuva|movie|film/),
    snacks: col(/herku|karkk|snack/),
    other: col(/muut|other/),
    theater: col(/teatteri|sali|theater|cinema/),
    note: col(/muist|huom|note/),
    rating: col(/arvosana|arvio|tahdet|rating/),
  };
  if (c.date < 0) return null;
  const out = [];
  for (const row of grid.slice(hi + 1)) {
    const title = String(row[c.title] ?? '').trim();
    const date = parseDate(row[c.date]);
    if (!title || !date) continue;
    out.push({
      date,
      title,
      snacks: c.snacks >= 0 ? num(row[c.snacks]) : 0,
      other: c.other >= 0 ? num(row[c.other]) : 0,
      theater: c.theater >= 0 ? String(row[c.theater] ?? '').trim() : '',
      note: c.note >= 0 ? String(row[c.note] ?? '').trim() : '',
      rating: c.rating >= 0 ? Math.min(5, Math.max(0, Math.round(num(row[c.rating])))) : 0,
    });
  }
  return { sheet: sheetName, rows: out };
}

function rowsFromWorkbook(XLSX, wb) {
  for (const name of wb.SheetNames) {
    const grid = XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, raw: true, defval: '' });
    const found = rowsFromGrid(grid, name);
    if (found) return found;
  }
  return null;
}

/** Parsii CSV-tekstin 2D-taulukoksi (käsittelee lainausmerkit ja ;- tai ,-erottimen). */
function parseCSV(text) {
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
  const lines = text.split(/\r?\n/);
  // Erotin: päättely ensimmäisestä ei-tyhjästä rivistä
  let sep = ';';
  for (const ln of lines) {
    if (ln.trim() === '') continue;
    const sc = (ln.match(/;/g) || []).length;
    const cc = (ln.match(/,/g) || []).length;
    if (cc > sc) sep = ',';
    break;
  }
  const grid = [];
  for (const line of lines) {
    if (line.trim() === '') continue;
    const cells = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQ) {
        if (ch === '"') {
          if (line[i + 1] === '"') { cur += '"'; i++; }
          else inQ = false;
        } else cur += ch;
      } else {
        if (ch === '"') inQ = true;
        else if (ch === sep) { cells.push(cur); cur = ''; }
        else cur += ch;
      }
    }
    cells.push(cur);
    grid.push(cells);
  }
  return grid;
}

$('#xlsx-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  const result = $('#import-result');
  result.textContent = t('importReading');
  try {
    let found;
    if (file.name.toLowerCase().endsWith('.csv')) {
      const text = await file.text();
      found = rowsFromGrid(parseCSV(text), file.name);
    } else {
      const XLSX = await loadXlsx();
      const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
      found = rowsFromWorkbook(XLSX, wb);
    }
    if (!found || !found.rows.length) throw new Error(t('importNoVisits'));

    let replace = false;
    if (state.visits.length) {
      replace = confirm(
        t('importReplacePrompt', {n: found.rows.length, m: state.visits.length})
      );
    }
    const key = (v) => v.date + '|' + v.title.toLowerCase();
    const existing = new Set(replace ? [] : state.visits.map(key));
    const base = replace ? [] : state.visits;
    const now = Date.now();
    const added = found.rows
      .filter((v) => !existing.has(key(v)))
      .map((v, i) => ({ id: uid(), created: now + i, ...v }));
    state.visits = [...base, ...added];
    save();
    autoSaveToCloud();
    render();

    const { seasonStart, seasonEnd } = state.settings;
    const today = todayIso();
    const outside = added.filter((v) => v.date < seasonStart || v.date > seasonEnd || v.date > today);
    result.innerHTML =
      t('importDone', {n: added.length, sheet: esc(found.sheet)}) +
      (outside.length
        ? '<br><span class="bad">' + t('importOutside', {
            n: outside.length,
            list: outside.map((v) => `${esc(v.title)} (${fmtDate(v.date)})`).join(', '),
          }) + '</span>'
        : '');
  } catch (err) {
    result.innerHTML = `<span class="bad">${esc(err.message)}</span>`;
  }
});

// ---------- Käynnistys ----------

// Kielivalitsin
const langSelect = $('#lang-select');
if (langSelect) {
  langSelect.value = currentLang;
  langSelect.addEventListener('change', (e) => setLang(e.target.value));
}
// Etusivun yläpalkin lippukuva: napsautus vaihtaa suomen ja englannin välillä.
const langToggle = $('#lang-toggle');
if (langToggle) {
  langToggle.addEventListener('click', () => setLang(currentLang === 'fi' ? 'en' : 'fi'));
}

applyTranslations();
fillSettings();
$('#auto-cloud-save').checked = state.settings.autoCloudSave;
$('#auto-local-backup').checked = state.settings.autoLocalBackup;
render();
remindBackup();

// Palauta tallennettu kansio IndexedDB:stä
restoreCloudHandle().then(() => {
  showCloudStatus();
  if (!state.settings.cloudFolderHandle && state.settings.autoCloudSave) {
    state.settings.autoCloudSave = false;
    $('#auto-cloud-save').checked = false;
    save();
  }
});

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
navigator.storage?.persist?.().catch(() => {});
