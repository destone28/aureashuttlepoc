/* AureaShuttle — mock data condiviso
   Tutti i dati hard-coded, Roma-centrici. Caricato globalmente come window.MOCK.
   Pricing per documento: corsa 80€ + diritti fissi 11€ + 11€ = 102€ A/R.
   Solo andata = 91€.
   ============================================================ */

window.MOCK = (function () {

  // ---------- Strutture sanitarie di destinazione (riuso 1:1 da AureaCare per coerenza suite) ----------
  // Coordinate lat/lng approssimate per le 18 strutture Roma — usate da Leaflet/OSM nelle mappe.
  const structures = [
    { id: 'STR-001', name: 'Policlinico Universitario A. Gemelli', area: 'Roma Nord-Ovest', address: 'Largo A. Gemelli 8',            district: 'Trionfale',     lat: 41.9314, lng: 12.4310 },
    { id: 'STR-002', name: 'Policlinico Tor Vergata',              area: 'Roma Sud-Est',    address: 'Viale Oxford 81',               district: 'Tor Vergata',   lat: 41.8497, lng: 12.6275 },
    { id: 'STR-003', name: 'Azienda Ospedaliera San Camillo',      area: 'Roma Centro-Ovest', address: 'Circonvallazione Gianicolense 87', district: 'Monteverde', lat: 41.8786, lng: 12.4503 },
    { id: 'STR-004', name: 'IDI — Ist. Dermopatico dell\'Immacolata', area: 'Roma Ovest',   address: 'Via dei Monti di Creta 104',    district: 'Aurelio',       lat: 41.8956, lng: 12.4170 },
    { id: 'STR-005', name: 'Ospedale Pediatrico Bambino Gesù',     area: 'Roma Centro',     address: 'P.zza Sant\'Onofrio 4',         district: 'Gianicolo',     lat: 41.8978, lng: 12.4631 },
    { id: 'STR-006', name: 'Casa di Cura Quisisana',               area: 'Roma Nord',       address: 'Via G. Porro 5',                district: 'Parioli',       lat: 41.9242, lng: 12.4849 },
    { id: 'STR-007', name: 'Centro Medico Sant\'Eugenio',          area: 'Roma Sud',        address: 'P.le Umanesimo 10',             district: 'EUR',           lat: 41.8328, lng: 12.4710 },
    { id: 'STR-008', name: 'CDC Casaccia',                         area: 'Roma Nord-Est',   address: 'Via Tiburtina 432',             district: 'Pietralata',    lat: 41.9183, lng: 12.5510 },
    { id: 'STR-009', name: 'Aurelia Hospital',                     area: 'Roma Ovest',      address: 'Via Aurelia 860',               district: 'Aurelio',       lat: 41.8989, lng: 12.4011 },
    { id: 'STR-010', name: 'Centro Riabilitazione Don Gnocchi',    area: 'Roma Sud',        address: 'Via Maresciallo Caviglia 30',   district: 'Salario',       lat: 41.9265, lng: 12.5142 },
    { id: 'STR-011', name: 'INI Grottaferrata',                    area: 'Roma Sud-Est',    address: 'Via S. Anna 27',                district: 'Grottaferrata', lat: 41.7841, lng: 12.6699 },
    { id: 'STR-012', name: 'Ospedale San Giovanni Addolorata',     area: 'Roma Centro',     address: 'Via dell\'Amba Aradam 9',       district: 'San Giovanni',  lat: 41.8855, lng: 12.5046 },
    { id: 'STR-013', name: 'Salvator Mundi International Hospital',area: 'Roma Centro',     address: 'V.le delle Mura Gianicolensi 67', district: 'Trastevere', lat: 41.8851, lng: 12.4581 },
    { id: 'STR-014', name: 'CDC Villa Stuart',                     area: 'Roma Nord',       address: 'Via Trionfale 5952',            district: 'Trionfale',     lat: 41.9492, lng: 12.4136 },
    { id: 'STR-015', name: 'Centro Diagnostico Italiano Eur',      area: 'Roma Sud',        address: 'Via Pio Emanuelli 1',           district: 'EUR',           lat: 41.8298, lng: 12.4669 },
    { id: 'STR-016', name: 'Ospedale Santo Spirito',               area: 'Roma Centro',     address: 'Lungotevere in Sassia 1',       district: 'Borgo',         lat: 41.9019, lng: 12.4623 },
    { id: 'STR-017', name: 'Poliambulatorio Roma Eur',             area: 'Roma Sud',        address: 'Via dell\'Oceano Indiano 13',   district: 'EUR',           lat: 41.8254, lng: 12.4711 },
    { id: 'STR-018', name: 'Casa di Cura Mater Dei',               area: 'Roma Nord',       address: 'Via Bertoloni 34',              district: 'Parioli',       lat: 41.9215, lng: 12.4912 }
  ];

  // ---------- Riferimenti geografici Roma per il "geocoder" frontend-only ----------
  // Default city center + bounding box per la vista mappa.
  const romaGeo = {
    center: { lat: 41.9028, lng: 12.4964 },
    bounds: { south: 41.78, west: 12.35, north: 41.99, east: 12.68 },
    // Quartieri/strade noti → coordinate. Usati da geocodeAddress() come fallback senza backend.
    landmarks: [
      { match: 'tuscolana',        lat: 41.8676, lng: 12.5333 },
      { match: 'tuscolano',        lat: 41.8676, lng: 12.5333 },
      { match: 'casilina',         lat: 41.8788, lng: 12.5765 },
      { match: 'prenestina',       lat: 41.8946, lng: 12.5587 },
      { match: 'tiburtina',        lat: 41.9112, lng: 12.5388 },
      { match: 'nomentana',        lat: 41.9183, lng: 12.5163 },
      { match: 'salaria',          lat: 41.9292, lng: 12.4923 },
      { match: 'cassia',           lat: 41.9550, lng: 12.4577 },
      { match: 'flaminia',         lat: 41.9485, lng: 12.4760 },
      { match: 'pineta sacchetti', lat: 41.9305, lng: 12.4290 },
      { match: 'trionfale',        lat: 41.9395, lng: 12.4292 },
      { match: 'aurelia',          lat: 41.8997, lng: 12.4220 },
      { match: 'boccea',           lat: 41.9143, lng: 12.4011 },
      { match: 'gianicolense',     lat: 41.8800, lng: 12.4570 },
      { match: 'monteverde',       lat: 41.8819, lng: 12.4543 },
      { match: 'trastevere',       lat: 41.8893, lng: 12.4694 },
      { match: 'eur',              lat: 41.8329, lng: 12.4711 },
      { match: 'ostiense',         lat: 41.8634, lng: 12.4762 },
      { match: 'eritrea',          lat: 41.9329, lng: 12.5113 },
      { match: 'parioli',          lat: 41.9242, lng: 12.4849 },
      { match: 'san giovanni',     lat: 41.8855, lng: 12.5046 },
      { match: 'borgo',            lat: 41.9019, lng: 12.4623 },
      { match: 'roma',             lat: 41.9028, lng: 12.4964 }
    ]
  };

  // ---------- Pricing (dal documento operativo) ----------
  const pricing = {
    fare:        80,   // corsa netta
    fixed_one:   11,   // diritti fissi andata
    fixed_back:  11,   // diritti fissi ritorno
    round_trip:  102,  // 80 + 11 + 11
    one_way:     91    // 80 + 11
  };

  const packages = [
    { id: 'PKG-05',  rides: 5,  price: 510,  label: 'Pacchetto Essenziale', tag: '',              hint: '5 corse A/R a tariffa standard' },
    { id: 'PKG-10',  rides: 10, price: 1020, label: 'Pacchetto Cura',       tag: 'Più scelto',    hint: '10 corse A/R · ideale per cicli terapeutici brevi' },
    { id: 'PKG-20',  rides: 20, price: 2040, label: 'Pacchetto Continuità', tag: 'Conveniente',   hint: '20 corse A/R · per terapie prolungate' }
  ];

  // ---------- Paziente loggato (eredita anagrafica da AureaCare) ----------
  const patient = {
    id: 'PAT-00142',
    first_name: 'Lucia',
    last_name: 'Marchetti',
    cf: 'MRCLCU82M55H501T',
    birth: '15/08/1982',
    phone: '+39 333 712 8439',
    email: 'lucia.marchetti@example.it',
    address: 'Via Tuscolana 124, Roma',
    district: 'Tuscolano',
    avatar_initials: 'LM'
  };

  // ---------- Caregiver + auto ----------
  const caregiver = {
    first_name:  'Marco',
    last_name:   'Marchetti',
    relation:    'Figlio',
    profession:  'Project Manager · settore IT',
    daily_cost:  180,            // costo giornata lavorativa (facoltativo)
    phone:       '+39 348 220 4471'
  };

  const caregiverCar = {
    model:    'Fiat 500X',
    plate:    'GH 481 PA',
    year:     2019,
    fuel:     'benzina',         // benzina | diesel | ibrida | elettrica
    co2_per_km: 0.142            // kg CO2/km usato per stima ESG
  };

  // ---------- Wallet (pacchetti corse) ----------
  const wallet = {
    active_package: 'PKG-20',     // pacchetto in corso
    total_rides:    20,
    used_rides:     8,            // 12 corse residue
    remaining:      12,
    package_paid:   2040,
    package_label:  'Pacchetto Continuità',
    next_renewal:   null,
    movements: [
      { id: 'MV-031', date: '19 mag', label: 'Ricarica · Pacchetto Continuità (20 corse)', type: 'topup',   amount: +2040, method: 'Stripe',     ref: 'TX-AS-9241' },
      { id: 'MV-030', date: '17 mag', label: 'Corsa A/R · Via Tuscolana → Gemelli',         type: 'charge',  amount: -102, ref: 'RIDE-AS-1018' },
      { id: 'MV-029', date: '14 mag', label: 'Corsa A/R · Via Tuscolana → Aurelia Hospital',type: 'charge',  amount: -102, ref: 'RIDE-AS-1015' },
      { id: 'MV-028', date: '12 mag', label: 'Corsa A/R · Via Tuscolana → Don Gnocchi',     type: 'charge',  amount: -102, ref: 'RIDE-AS-1012' },
      { id: 'MV-027', date: '09 mag', label: 'Corsa solo andata · → San Camillo',           type: 'charge',  amount: -91,  ref: 'RIDE-AS-1009' },
      { id: 'MV-026', date: '07 mag', label: 'Corsa A/R · Via Tuscolana → IDI',             type: 'charge',  amount: -102, ref: 'RIDE-AS-1007' },
      { id: 'MV-025', date: '02 mag', label: 'Corsa A/R · Via Tuscolana → Don Gnocchi',     type: 'charge',  amount: -102, ref: 'RIDE-AS-1004' },
      { id: 'MV-024', date: '28 apr', label: 'Corsa A/R · Via Tuscolana → Sant\'Eugenio',   type: 'charge',  amount: -102, ref: 'RIDE-AS-1001' },
      { id: 'MV-023', date: '24 apr', label: 'Corsa A/R · Via Tuscolana → Gemelli',         type: 'charge',  amount: -102, ref: 'RIDE-AS-0998' }
    ]
  };

  // ---------- Stati corsa: lifecycle completo ----------
  // requested → pending → approved → dispatched → accepted → in_progress → completed
  // (oppure → cancelled in qualsiasi punto)
  const rideStatusLabel = {
    requested:   { cls: 'badge--neutral',   label: 'Richiesta ricevuta' },
    pending:     { cls: 'badge--pending',   label: 'In approvazione' },
    approved:    { cls: 'badge--approved',  label: 'Approvata' },
    dispatched:  { cls: 'badge--shuttle',   label: 'Inviata taxi' },
    accepted:    { cls: 'badge--confirmed', label: 'Accettata' },
    in_progress: { cls: 'badge--active',    label: 'In corso' },
    completed:   { cls: 'badge--completed', label: 'Completata' },
    cancelled:   { cls: 'badge--cancelled', label: 'Annullata' }
  };

  // ---------- Corse del paziente loggato (12 corse, mix di stati) ----------
  const rides = [
    // upcoming / pending / dispatched
    { id: 'RIDE-AS-1024', from_addr: 'Via Tuscolana 124', to_struct_id: 'STR-001', to_name: 'Policlinico Gemelli',          date: '24 mag', time: '14:30', round_trip: true,  cost: 102, status: 'approved',    submitted: '20 mag 09:14', linked_care_booking: 'BOOK-099', note: 'Visita cardiologica · usare ingresso principale', taxi_company_id: 'TXC-001', driver: null },
    { id: 'RIDE-AS-1023', from_addr: 'Via Tuscolana 124', to_struct_id: 'STR-008', to_name: 'CDC Casaccia',                  date: '27 mag', time: '17:00', round_trip: true,  cost: 102, status: 'pending',     submitted: '20 mag 18:42', linked_care_booking: 'BOOK-100', note: 'Visita endocrinologica · ritiro al portone',     taxi_company_id: null,      driver: null },
    { id: 'RIDE-AS-1022', from_addr: 'Via Tuscolana 124', to_struct_id: 'STR-010', to_name: 'Centro Don Gnocchi',            date: '24 mag', time: '09:00', round_trip: false, cost: 91,  status: 'approved',    submitted: '21 mag 11:08', linked_care_booking: 'BOOK-098', note: 'Solo andata, ritorno con caregiver',             taxi_company_id: 'TXC-003', driver: null },
    // dispatched + accepted (corso in corso giornaliero)
    { id: 'RIDE-AS-1021', from_addr: 'Via Tuscolana 124', to_struct_id: 'STR-009', to_name: 'Aurelia Hospital',              date: '22 mag', time: '11:15', round_trip: true,  cost: 102, status: 'in_progress', submitted: '17 mag 09:40', linked_care_booking: null,        note: 'Controllo ortopedico post-operatorio',           taxi_company_id: 'TXC-001', driver: { name: 'Antonio Vinci', plate: 'EJ 562 RS', car: 'Mercedes E-Class' } },
    // completed (storico)
    { id: 'RIDE-AS-1018', from_addr: 'Via Tuscolana 124', to_struct_id: 'STR-001', to_name: 'Policlinico Gemelli',          date: '17 mag', time: '14:00', round_trip: true,  cost: 102, status: 'completed',   submitted: '12 mag 16:32', linked_care_booking: 'BOOK-082', note: 'Visita cardiologica trimestrale',                taxi_company_id: 'TXC-001', driver: { name: 'Salvatore Greco', plate: 'EW 117 MK', car: 'Skoda Octavia' } },
    { id: 'RIDE-AS-1015', from_addr: 'Via Tuscolana 124', to_struct_id: 'STR-009', to_name: 'Aurelia Hospital',              date: '14 mag', time: '10:30', round_trip: true,  cost: 102, status: 'completed',   submitted: '09 mag 17:11', linked_care_booking: 'BOOK-097', note: '',                                                taxi_company_id: 'TXC-002', driver: { name: 'Roberta Pinna', plate: 'GG 240 TW', car: 'Fiat Tipo' } },
    { id: 'RIDE-AS-1012', from_addr: 'Via Tuscolana 124', to_struct_id: 'STR-010', to_name: 'Centro Don Gnocchi',            date: '12 mag', time: '17:30', round_trip: true,  cost: 102, status: 'completed',   submitted: '07 mag 14:20', linked_care_booking: 'BOOK-096', note: 'Tecarterapia',                                    taxi_company_id: 'TXC-003', driver: { name: 'Luca Pace', plate: 'FH 902 LA', car: 'Toyota Prius' } },
    { id: 'RIDE-AS-1009', from_addr: 'Via Tuscolana 124', to_struct_id: 'STR-003', to_name: 'San Camillo',                   date: '09 mag', time: '08:30', round_trip: false, cost: 91,  status: 'completed',   submitted: '05 mag 22:14', linked_care_booking: null,        note: 'Controllo post-ricovero',                         taxi_company_id: 'TXC-001', driver: { name: 'Marco Lopez', plate: 'EZ 558 PT', car: 'BMW Serie 3' } },
    { id: 'RIDE-AS-1007', from_addr: 'Via Tuscolana 124', to_struct_id: 'STR-004', to_name: 'IDI',                            date: '07 mag', time: '10:00', round_trip: true,  cost: 102, status: 'completed',   submitted: '02 mag 11:30', linked_care_booking: 'BOOK-095', note: 'Visita dermatologica',                            taxi_company_id: 'TXC-002', driver: { name: 'Federica Vitti', plate: 'GG 119 BJ', car: 'Volvo XC60' } },
    { id: 'RIDE-AS-1004', from_addr: 'Via Tuscolana 124', to_struct_id: 'STR-010', to_name: 'Centro Don Gnocchi',            date: '02 mag', time: '16:00', round_trip: true,  cost: 102, status: 'completed',   submitted: '28 apr 18:00', linked_care_booking: null,        note: 'Fisioterapia',                                    taxi_company_id: 'TXC-003', driver: { name: 'Andrea Sorrentino', plate: 'FT 660 KW', car: 'Fiat 500' } },
    { id: 'RIDE-AS-1001', from_addr: 'Via Tuscolana 124', to_struct_id: 'STR-007', to_name: 'Centro Sant\'Eugenio',           date: '28 apr', time: '16:30', round_trip: true,  cost: 102, status: 'completed',   submitted: '23 apr 09:00', linked_care_booking: 'BOOK-093', note: 'Logopedia',                                       taxi_company_id: 'TXC-001', driver: { name: 'Salvatore Greco', plate: 'EW 117 MK', car: 'Skoda Octavia' } },
    // cancelled
    { id: 'RIDE-AS-0998', from_addr: 'Via Tuscolana 124', to_struct_id: 'STR-001', to_name: 'Policlinico Gemelli',          date: '24 apr', time: '08:00', round_trip: true,  cost: 102, status: 'cancelled',   submitted: '19 apr 21:00', linked_care_booking: null,        note: 'Annullata dal paziente (visita rimandata)',       taxi_company_id: null,      driver: null }
  ];

  // ---------- Compagnie taxi convenzionate Roma (12) ----------
  const taxiCompanies = [
    { id: 'TXC-001', name: 'Cooperativa Radiotaxi 3570',     vat: '01095971000', contact: 'Andrea Petruzzi',  phone: '+39 06 3570',     email: 'convenzioni@3570.it',         drivers_active: 184, wallet_balance: 8420, rides_month: 92, status: 'active' },
    { id: 'TXC-002', name: 'Samarcanda Taxi',                vat: '04531861007', contact: 'Federica Berti',   phone: '+39 06 5551',     email: 'amministrazione@samarcanda.it', drivers_active: 142, wallet_balance: 6180, rides_month: 71, status: 'active' },
    { id: 'TXC-003', name: 'Taxi Roma 6645',                 vat: '02158730589', contact: 'Marco Lupi',       phone: '+39 06 6645',     email: 'convenzioni@taxi6645.it',       drivers_active: 96,  wallet_balance: 4290, rides_month: 48, status: 'active' },
    { id: 'TXC-004', name: 'Pronto Taxi 5570',               vat: '07842610548', contact: 'Roberta Conti',    phone: '+39 06 5570',     email: 'info@5570.it',                  drivers_active: 78,  wallet_balance: 3120, rides_month: 36, status: 'active' },
    { id: 'TXC-005', name: 'Tevere Taxi Cooperativa',        vat: '05619820587', contact: 'Luigi Sabatini',   phone: '+39 06 4994',     email: 'admin@teveretaxi.it',            drivers_active: 64,  wallet_balance: 2280, rides_month: 22, status: 'active' },
    { id: 'TXC-006', name: 'Taxi Aurelia Service',           vat: '09128340583', contact: 'Paola Bianchi',    phone: '+39 06 6633 21',  email: 'taxi.aurelia@pec.it',            drivers_active: 42,  wallet_balance: 1810, rides_month: 19, status: 'active' },
    { id: 'TXC-007', name: 'EUR Taxi Service',               vat: '11248560581', contact: 'Davide Sorrentino',phone: '+39 06 5910 88',  email: 'amm@eurtaxi.it',                 drivers_active: 38,  wallet_balance: 1620, rides_month: 17, status: 'active' },
    { id: 'TXC-008', name: 'NCC Capitolino',                 vat: '12389470588', contact: 'Sara Fanelli',     phone: '+39 06 7000 12',  email: 'segreteria@nccapitolino.it',    drivers_active: 31,  wallet_balance: 1490, rides_month: 14, status: 'active' },
    { id: 'TXC-009', name: 'Aurelio Taxi 8810',              vat: '13287560546', contact: 'Giulia Reiss',     phone: '+39 06 8810',     email: 'convenzioni@aureliotaxi.it',    drivers_active: 28,  wallet_balance: 1180, rides_month: 12, status: 'active' },
    { id: 'TXC-010', name: 'Tor Vergata Mobility',           vat: '14129540589', contact: 'Stefano Marino',   phone: '+39 06 7259 04',  email: 'info@tvmobility.it',             drivers_active: 22,  wallet_balance: 910,  rides_month: 9,  status: 'active' },
    { id: 'TXC-011', name: 'Trastevere Taxi Group',          vat: '15039470583', contact: 'Elena Pavoletti',  phone: '+39 06 5839 11',  email: 'segreteria@trasteveregroup.it',  drivers_active: 18,  wallet_balance: 540,  rides_month: 6,  status: 'paused' },
    { id: 'TXC-012', name: 'San Camillo Mobility Co.',       vat: '15920138541', contact: 'Pietro Ferrante',  phone: '+39 06 5839 90',  email: 'amm@scmobility.it',              drivers_active: 14,  wallet_balance: 380,  rides_month: 4,  status: 'active' }
  ];

  // ---------- Admin: richieste aggregate (15 visibili, mix lifecycle) ----------
  const adminRides = [
    { id: 'RIDE-AS-1023', patient: 'Lucia Marchetti',   patient_id: 'PAT-00142', from: 'Via Tuscolana 124', to: 'CDC Casaccia',            date: '27 mag · 17:00', submitted: '20 mag 18:42', round_trip: true,  cost: 102, wallet_after: 1224, status: 'pending',     taxi_company_id: null,      linked_care: 'BOOK-100' },
    { id: 'RIDE-AS-1206', patient: 'Andrea Rossi',      patient_id: 'PAT-00141', from: 'Via Boccea 410',     to: 'Aurelia Hospital',         date: '24 mag · 09:30', submitted: '20 mag 14:11', round_trip: true,  cost: 102, wallet_after: 612,  status: 'pending',     taxi_company_id: null,      linked_care: null },
    { id: 'RIDE-AS-1205', patient: 'Giulia Bianchi',    patient_id: 'PAT-00140', from: 'Via Salaria 234',    to: 'Casa di Cura Mater Dei',   date: '24 mag · 11:00', submitted: '20 mag 12:08', round_trip: true,  cost: 102, wallet_after: 510,  status: 'pending',     taxi_company_id: null,      linked_care: 'BOOK-105' },
    { id: 'RIDE-AS-1204', patient: 'Marco De Luca',     patient_id: 'PAT-00139', from: 'Via Prenestina 88',  to: 'Centro Don Gnocchi',       date: '23 mag · 18:00', submitted: '19 mag 22:17', round_trip: false, cost: 91,  wallet_after: 819,  status: 'info_requested', taxi_company_id: null,    linked_care: null },
    // approved / dispatched / accepted / in_progress
    { id: 'RIDE-AS-1024', patient: 'Lucia Marchetti',   patient_id: 'PAT-00142', from: 'Via Tuscolana 124',  to: 'Policlinico Gemelli',      date: '24 mag · 14:30', submitted: '20 mag 09:14', round_trip: true,  cost: 102, wallet_after: 1224, status: 'approved',    taxi_company_id: 'TXC-001', linked_care: 'BOOK-099' },
    { id: 'RIDE-AS-1203', patient: 'Sofia Ferri',       patient_id: 'PAT-00138', from: 'Viale Eritrea 121',  to: 'San Camillo',              date: '23 mag · 15:30', submitted: '19 mag 17:32', round_trip: true,  cost: 102, wallet_after: 408,  status: 'dispatched',  taxi_company_id: 'TXC-002', linked_care: 'BOOK-106' },
    { id: 'RIDE-AS-1202', patient: 'Paolo Esposito',    patient_id: 'PAT-00137', from: 'Via Ostiense 88',    to: 'Policlinico Gemelli',      date: '23 mag · 10:00', submitted: '19 mag 13:08', round_trip: true,  cost: 102, wallet_after: 1632, status: 'accepted',    taxi_company_id: 'TXC-001', linked_care: 'BOOK-107' },
    { id: 'RIDE-AS-1021', patient: 'Lucia Marchetti',   patient_id: 'PAT-00142', from: 'Via Tuscolana 124',  to: 'Aurelia Hospital',         date: '22 mag · 11:15', submitted: '17 mag 09:40', round_trip: true,  cost: 102, wallet_after: 1224, status: 'in_progress', taxi_company_id: 'TXC-001', linked_care: null },
    { id: 'RIDE-AS-1201', patient: 'Chiara Romano',     patient_id: 'PAT-00136', from: 'Via Cassia 290',     to: 'IDI',                       date: '22 mag · 14:00', submitted: '18 mag 10:11', round_trip: true,  cost: 102, wallet_after: 918,  status: 'completed',   taxi_company_id: 'TXC-006', linked_care: 'BOOK-108' },
    { id: 'RIDE-AS-1200', patient: 'Elena Riva',        patient_id: 'PAT-00134', from: 'Via Nomentana 480',  to: 'Policlinico Tor Vergata',  date: '21 mag · 08:00', submitted: '18 mag 12:08', round_trip: true,  cost: 102, wallet_after: 1530, status: 'completed',   taxi_company_id: 'TXC-010', linked_care: 'BOOK-109' },
    { id: 'RIDE-AS-1199', patient: 'Roberto Conti',     patient_id: 'PAT-00133', from: 'Via Pineta Sacchetti 245', to: 'Aurelia Hospital',  date: '21 mag · 11:30', submitted: '18 mag 09:32', round_trip: true,  cost: 102, wallet_after: 1020, status: 'completed',   taxi_company_id: 'TXC-002', linked_care: null },
    { id: 'RIDE-AS-1198', patient: 'Federica Santoro',  patient_id: 'PAT-00132', from: 'Via Tiburtina 770',  to: 'Centro Sant\'Eugenio',     date: '20 mag · 17:00', submitted: '17 mag 21:09', round_trip: true,  cost: 102, wallet_after: 306,  status: 'completed',   taxi_company_id: 'TXC-007', linked_care: 'BOOK-110' },
    { id: 'RIDE-AS-1197', patient: 'Stefano Marino',    patient_id: 'PAT-00131', from: 'Via Tuscolana 920',  to: 'Centro Don Gnocchi',       date: '18 mag · 09:00', submitted: '15 mag 14:00', round_trip: true,  cost: 102, wallet_after: 1326, status: 'completed',   taxi_company_id: 'TXC-003', linked_care: 'BOOK-111' },
    { id: 'RIDE-AS-1196', patient: 'Davide Greco',      patient_id: 'PAT-00135', from: 'Via Casilina 580',   to: 'San Camillo',              date: '17 mag · 09:30', submitted: '14 mag 16:43', round_trip: true,  cost: 102, wallet_after: 612,  status: 'cancelled',   taxi_company_id: null,      linked_care: null },
    { id: 'RIDE-AS-1195', patient: 'Giulia Bianchi',    patient_id: 'PAT-00140', from: 'Via Salaria 234',    to: 'IDI',                       date: '15 mag · 14:00', submitted: '11 mag 09:00', round_trip: true,  cost: 102, wallet_after: 612,  status: 'completed',   taxi_company_id: 'TXC-006', linked_care: null }
  ];

  // ---------- Admin: KPI ----------
  const admin_kpi = {
    rides_month:     { value: 247, delta: 14.2 },
    value_disbursed: { value: 23694, delta: 11.4 },
    approval_rate:   { value: 91,  delta: 3.1 },
    sroi:            { value: 3.0, delta: 0.2 }
  };

  const admin_trend = {
    labels:   ['Nov','Dic','Gen','Feb','Mar','Apr','Mag'],
    rides:    [132, 158, 175, 192, 218, 234, 247],
    sroi:     [2.2, 2.4, 2.6, 2.7, 2.8, 2.9, 3.0]
  };

  // ---------- ESG aggregato (dashboard admin) ----------
  const esgAggregate = {
    caregiver_days_saved: 287,    // giornate caregiver risparmiate
    caregiver_eur_saved:  51660,  // valore economico tempo recuperato (€)
    co2_kg_avoided:       4250,   // emissioni CO2 evitate (kg)
    private_km_avoided:   29920,  // km auto privata risparmiati
    cures_completed:      142,    // cure completate grazie al servizio
    dropout_reduction:    18,     // riduzione dropout terapeutico (%)
    social_value_eur:     71082,  // valore sociale generato (€)
    sroi_ratio:           3.0     // €1 investito → €3 impatto
  };

  // ---------- ESG personale (per profilo paziente) ----------
  const esgPersonal = {
    caregiver_days_saved: 8,      // 8 giornate non perse
    caregiver_eur_saved:  1440,   // 8 × 180€
    co2_kg_avoided:       142,    // chilogrammi CO2 evitati (auto benzina, 1.000km × 0.142)
    private_km_avoided:   1000,
    cures_completed:      6,      // cure portate a termine
    rides_done:           11,
    social_value_eur:     3300,
    sroi_ratio:           3.0
  };

  // ---------- Lista pazienti (admin) ----------
  const patients = [
    { id: 'PAT-00142', name: 'Lucia Marchetti',  cf: 'MRCLCU82M55H501T', phone: '+39 333 712 8439', wallet_rides: 12, total_rides: 11, package: '20 corse', last_login: 'Oggi 09:14',   status: 'active' },
    { id: 'PAT-00141', name: 'Andrea Rossi',     cf: 'RSSNDR79H03H501Z', phone: '+39 348 220 1198', wallet_rides: 6,  total_rides: 14, package: '10 corse', last_login: 'Ieri 19:42',   status: 'active' },
    { id: 'PAT-00140', name: 'Giulia Bianchi',   cf: 'BNCGLI91D52H501W', phone: '+39 340 561 2287', wallet_rides: 5,  total_rides: 5,  package: '10 corse', last_login: 'Ieri 15:08',   status: 'active' },
    { id: 'PAT-00139', name: 'Marco De Luca',    cf: 'DLCMRC85A12H501P', phone: '+39 347 808 4421', wallet_rides: 8,  total_rides: 9,  package: '20 corse', last_login: '2 giorni fa',  status: 'active' },
    { id: 'PAT-00138', name: 'Sofia Ferri',      cf: 'FRRSFO88P54H501M', phone: '+39 349 123 7790', wallet_rides: 4,  total_rides: 1,  package: '5 corse',  last_login: '3 giorni fa',  status: 'active' },
    { id: 'PAT-00137', name: 'Paolo Esposito',   cf: 'SPSPLA72L08F839B', phone: '+39 333 991 1024', wallet_rides: 16, total_rides: 4,  package: '20 corse', last_login: '4 giorni fa',  status: 'active' },
    { id: 'PAT-00136', name: 'Chiara Romano',    cf: 'RMNCHR93T67H501S', phone: '+39 366 222 7811', wallet_rides: 9,  total_rides: 1,  package: '10 corse', last_login: '5 giorni fa',  status: 'active' },
    { id: 'PAT-00135', name: 'Davide Greco',     cf: 'GRCDVD80E21H501Y', phone: '+39 345 612 7080', wallet_rides: 3,  total_rides: 7,  package: '10 corse', last_login: '1 settimana fa', status: 'active' },
    { id: 'PAT-00134', name: 'Elena Riva',       cf: 'RVELNE76C44H501R', phone: '+39 388 220 1144', wallet_rides: 15, total_rides: 22, package: '20 corse', last_login: 'Oggi 08:02',   status: 'active' },
    { id: 'PAT-00133', name: 'Roberto Conti',    cf: 'CNTRRT69M28H501F', phone: '+39 333 711 4488', wallet_rides: 7,  total_rides: 11, package: '10 corse', last_login: 'Ieri 22:00',   status: 'active' },
    { id: 'PAT-00132', name: 'Federica Santoro', cf: 'SNTFRC84S58H501J', phone: '+39 348 022 5610', wallet_rides: 3,  total_rides: 6,  package: '5 corse',  last_login: '2 giorni fa',  status: 'active' },
    { id: 'PAT-00131', name: 'Stefano Marino',   cf: 'MRNSFN77H15H501K', phone: '+39 347 117 2245', wallet_rides: 13, total_rides: 16, package: '20 corse', last_login: '3 giorni fa',  status: 'active' }
  ];

  return {
    pricing, packages, structures, romaGeo,
    patient, caregiver, caregiverCar, wallet,
    rides, rideStatusLabel,
    taxiCompanies, adminRides, admin_kpi, admin_trend,
    esgAggregate, esgPersonal, patients
  };
})();
