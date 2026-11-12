import type { Shipment, DriverInfo, ShipmentStatus, ProblemReport } from '../types';

export const INITIAL_DRIVERS: DriverInfo[] = [
  {
    id: 'DRV-104',
    name: 'Mukesh Yadav',
    badgeNumber: 'DL-COM-8812',
    phone: '+91 98110 99420',
    vehiclePlate: 'RJ-14-GA-8820',
    vehicleType: 'Eicher Pro 2049 (14 Ft Closed Container)',
    status: 'on_route',
    currentLocation: 'NH-48 Express Highway near Kotputli',
    currentShipmentId: 'FLX-8829-JPR',
    shiftHoursLogged: 4.5,
    rating: 4.95,
  },
  {
    id: 'DRV-208',
    name: 'Balwinder Singh',
    badgeNumber: 'PB-HEV-9014',
    phone: '+91 98140 22109',
    vehiclePlate: 'DL-01-AB-2041',
    vehicleType: 'Tata 407 Gold LCV (6-Wheeler)',
    status: 'available',
    currentLocation: 'Chandni Chowk Parcel Centre, Delhi',
    shiftHoursLogged: 2.0,
    rating: 4.92,
  },
  {
    id: 'DRV-312',
    name: 'Suresh Patil',
    badgeNumber: 'MH-DRV-7720',
    phone: '+91 98200 44119',
    vehiclePlate: 'MH-04-AZ-4109',
    vehicleType: 'Ashok Leyland Dost Plus (Pick-up van)',
    status: 'available',
    currentLocation: 'Bhiwandi Warehousing Hub, Mumbai',
    shiftHoursLogged: 3.5,
    rating: 4.98,
  },
  {
    id: 'DRV-405',
    name: 'Ranganathan Pillai',
    badgeNumber: 'TN-COM-5542',
    phone: '+91 94440 88201',
    vehiclePlate: 'TN-09-BK-7701',
    vehicleType: 'BharatBenz 1617R Medium Truck',
    status: 'on_route',
    currentLocation: 'Hosur Toll Plaza approaching Electronic City',
    currentShipmentId: 'FLX-3109-BLR',
    shiftHoursLogged: 5.2,
    rating: 4.91,
  },
  {
    id: 'DRV-519',
    name: 'Gurmeet Sandhu',
    badgeNumber: 'PB-TRK-3310',
    phone: '+91 98720 11980',
    vehiclePlate: 'PB-10-CZ-9912',
    vehicleType: 'Tata LPT 1918 Heavy Multi-Axle',
    status: 'maintenance',
    currentLocation: 'Kanpur Bypass Service Depot',
    currentShipmentId: 'FLX-7741-KOL',
    shiftHoursLogged: 7.5,
    rating: 4.88,
  }
];

export const INITIAL_SHIPMENTS: Shipment[] = [
  {
    id: 'FLX-8829-JPR',
    billOfLading: 'LR-2026-99124',
    bookingRef: 'BKG-DEL-JPR-88',
    originHub: 'Delhi Central Parcel Centre (Chandni Chowk / Okhla)',
    originHubCode: 'DEL-CENTRAL',
    destinationHub: 'Jaipur Delivery Centre (MI Road / Vishwakarma)',
    destinationHubCode: 'JPR-MAIN',
    serviceMode: 'heavy_haul',
    status: 'in-transit',
    progressPercent: 72,
    eta: '2026-10-20 14:00',
    dispatchedAt: '2026-10-19 06:00',
    carrier: 'FreightLine Express Road Cargo',
    vesselOrFlight: 'Eicher Pro 2049 (RJ-14-GA-8820)',
    priorityLevel: 'standard',
    customsStatus: 'pre_approved',
    paymentMethod: 'cod',
    whatsappUpdates: true,
    deliveryTimeEstimate: 'Reaches tomorrow by 02:00 PM (20/10/2026)',
    deliveryPromise: {
      confidencePercent: 92,
      promisedDay: 'Thursday',
      promisedDate: '20/10/2026',
      description: 'Based on 45 past deliveries on Delhi-Jaipur highway'
    },
    deliveryOtp: '4829',
    photoProof: {
      pickupTimestamp: '19/10/2026, 06:30 AM',
      pickupHandedBy: 'Ramesh Sharma (Katra Neel Shop)',
      deliveryTimestamp: 'Expected: 20/10/2026, 02:00 PM',
      deliveredTo: 'Amit Gupta (Johari Bazar)',
      otpVerified: true
    },
    priceBreakdown: {
      baseCharge: 580,
      fuelCharge: 58,
      packingCharge: 40,
      pickupCharge: 50,
      codFee: 40,
      gstAmount: 138,
      total: 906
    },
    sender: {
      name: 'Ramesh Sharma',
      company: 'Sharma Textiles & Garments',
      houseNo: 'Shop No. 44',
      area: 'Katra Neel, Chandni Chowk',
      landmark: 'Near Town Hall',
      address: 'Shop No. 44, Katra Neel, Chandni Chowk',
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
      postalCode: '110006',
      contactEmail: 'ramesh.sharma@sharmatextiles.in',
      contactPhone: '+91 98110 44291',
      taxIdOrEori: '07AAACS1102K1Z5'
    },
    receiver: {
      name: 'Amit Gupta',
      company: 'Gupta Cloth Emporium',
      houseNo: 'Shop No. 12',
      area: 'Johari Bazar',
      landmark: 'Opposite Sanganeri Gate',
      address: 'Shop No. 12, Johari Bazar',
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
      postalCode: '302001',
      contactEmail: 'amit.gupta@guptacloth.com',
      contactPhone: '+91 94140 88210',
      taxIdOrEori: '08AAACG4928R1ZK'
    },
    cargo: {
      type: 'Ready-made Clothes (35 Cartons)',
      quantity: 35,
      weightKg: 1420,
      volumeCbm: 8.5,
      declaredValueInr: 485000,
      hazardous: false,
      sealNumber: 'SEAL-FLX-99214',
      temperatureControlled: false
    },
    checkpoints: [
      {
        id: 'CP-1',
        location: 'Chandni Chowk Booking Centre',
        city: 'Delhi',
        country: 'India',
        timestamp: '19/10/2026, 06:30 AM',
        status: 'in-transit',
        facilityCode: 'DEL-CC-01',
        description: 'We collected 35 cartons from shop. Weighed on electronic scale (1,420 kg). Safety sticker sealed.',
        completed: true
      },
      {
        id: 'CP-2',
        location: 'Okhla Sorting Hub Gate 2',
        city: 'New Delhi',
        country: 'India',
        timestamp: '19/10/2026, 09:15 AM',
        status: 'in-transit',
        facilityCode: 'DEL-OKH-02',
        description: 'Barcodes scanned. Loaded securely onto express route vehicle (Eicher Pro RJ-14-GA-8820).',
        completed: true
      },
      {
        id: 'CP-3',
        location: 'NH-48 Express Highway (Passing Kotputli Toll)',
        city: 'En Route',
        country: 'India',
        timestamp: '19/10/2026, 11:30 AM',
        status: 'in-transit',
        facilityCode: 'ROUT-NH48',
        description: 'Vehicle moving at steady speed (60 km/h). Live GPS signal confirmed.',
        completed: true,
        isCurrent: true
      },
      {
        id: 'CP-4',
        location: 'Jaipur Vishwakarma Delivery Centre',
        city: 'Jaipur',
        country: 'India',
        timestamp: 'Expected: 20/10/2026, 07:00 AM',
        status: 'pending',
        facilityCode: 'JPR-VKI-01',
        description: 'Unloading into local delivery vehicle for morning doorstep delivery.',
        completed: false
      },
      {
        id: 'CP-5',
        location: 'Receiver Shop (Gupta Cloth, Johari Bazar)',
        city: 'Jaipur',
        country: 'India',
        timestamp: 'Expected: 20/10/2026, 02:00 PM',
        status: 'pending',
        facilityCode: 'JPR-DLV-12',
        description: 'Handover to Amit Gupta. Payment on delivery (COD) and mobile signature verification.',
        completed: false
      }
    ],
    assignedDriver: INITIAL_DRIVERS[0],
    documents: [
      {
        id: 'DOC-1',
        title: 'Parcel Delivery Receipt (Bilty / LR)',
        type: 'Bill of Lading',
        docNumber: 'LR-2026-99124',
        issuedDate: '19/10/2026',
        fileSize: '380 KB',
        status: 'verified'
      },
      {
        id: 'DOC-2',
        title: 'Trader Tax Invoice & Item List',
        type: 'Commercial Invoice',
        docNumber: 'INV-SHR-8802',
        issuedDate: '18/10/2026',
        fileSize: '650 KB',
        status: 'verified'
      }
    ],
    activities: [
      {
        id: 'ACT-1',
        timestamp: '19/10/2026, 11:30 AM',
        actor: 'Fastag & GPS Telematics',
        role: 'Automated Highway Tracker',
        event: 'Vehicle passed Kotputli Toll. Estimated arrival at Jaipur within 4 hours.',
        terminalCode: 'NH48-TOLL'
      },
      {
        id: 'ACT-2',
        timestamp: '19/10/2026, 09:15 AM',
        actor: 'Sunil Verma',
        role: 'Dispatch Supervisor',
        event: 'Parcel cartons loaded and locked with tamper-proof security cable.',
        terminalCode: 'DEL-OKH-02'
      }
    ]
  },
  {
    id: 'FLX-4012-MUM',
    billOfLading: 'LR-2026-38100',
    bookingRef: 'BKG-SUR-MUM-40',
    originHub: 'Surat Textile Market Centre (Ring Road)',
    originHubCode: 'GJ-SURAT',
    destinationHub: 'Mumbai Crawford Market Delivery Centre',
    destinationHubCode: 'MH-MUMBAI',
    serviceMode: 'heavy_haul',
    status: 'delivered',
    progressPercent: 100,
    eta: '2026-10-18 16:30',
    dispatchedAt: '2026-10-17 08:00',
    deliveredAt: '2026-10-18 16:30',
    carrier: 'FreightLine Coastal Highway Service',
    vesselOrFlight: 'Tata 407 (MH-04-AZ-4109)',
    priorityLevel: 'standard',
    customsStatus: 'cleared',
    paymentMethod: 'upi',
    whatsappUpdates: true,
    deliveryTimeEstimate: 'Delivered in 1 day (on 18/10/2026)',
    sender: {
      name: 'Rajesh Patel',
      company: 'Patel Silk & Jacquard Mills',
      houseNo: 'Plot 104',
      area: 'Ring Road Textile Market',
      landmark: 'Near Millennium Market',
      address: 'Plot 104, Ring Road Textile Market',
      city: 'Surat',
      state: 'Gujarat',
      country: 'India',
      postalCode: '395002',
      contactEmail: 'rajesh@patelsilk.com',
      contactPhone: '+91 98250 11942',
      taxIdOrEori: '24AAACP8820L1Z9'
    },
    receiver: {
      name: 'Suresh Shah',
      company: 'Shah Brothers Saree Palace',
      houseNo: 'Shop 88',
      area: 'Mangaldas Market, Kalbadevi',
      landmark: 'Near Crawford Market',
      address: 'Shop 88, Mangaldas Market, Kalbadevi',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400002',
      contactEmail: 'suresh@shahbrothers.in',
      contactPhone: '+91 98201 33410',
      taxIdOrEori: '27AAACS4412M1Z2'
    },
    cargo: {
      type: 'Surat Sarees & Dress Material (80 Bundles)',
      quantity: 80,
      weightKg: 2850,
      volumeCbm: 14.0,
      declaredValueInr: 1240000,
      hazardous: false,
      sealNumber: 'SEAL-FLX-44018',
      temperatureControlled: false
    },
    checkpoints: [
      {
        id: 'CP-11',
        location: 'Surat Ring Road Booking Centre',
        city: 'Surat',
        country: 'India',
        timestamp: '17/10/2026, 08:30 AM',
        status: 'delivered',
        facilityCode: 'SUR-RR-01',
        description: 'Received 80 bundles of packed sarees. Bilty issued.',
        completed: true
      },
      {
        id: 'CP-12',
        location: 'Bhiwandi Central Godown',
        city: 'Thane / Mumbai',
        country: 'India',
        timestamp: '18/10/2026, 05:00 AM',
        status: 'delivered',
        facilityCode: 'MUM-BHW-03',
        description: 'Vehicle arrived safely. Shifted into city delivery tempo.',
        completed: true
      },
      {
        id: 'CP-13',
        location: 'Shah Brothers Saree Palace, Kalbadevi',
        city: 'Mumbai',
        country: 'India',
        timestamp: '18/10/2026, 04:30 PM',
        status: 'delivered',
        facilityCode: 'MUM-DLV-88',
        description: 'Delivered in full. Suresh Shah verified all 80 bundles. Mobile signature received.',
        completed: true,
        isCurrent: true
      }
    ],
    assignedDriver: INITIAL_DRIVERS[2],
    documents: [
      {
        id: 'DOC-11',
        title: 'Parcel Delivery Receipt (Bilty / LR)',
        type: 'Bill of Lading',
        docNumber: 'LR-2026-38100',
        issuedDate: '17/10/2026',
        fileSize: '410 KB',
        status: 'verified'
      },
      {
        id: 'DOC-12',
        title: 'Delivery Proof (Signed with Photo)',
        type: 'Proof of Delivery',
        docNumber: 'POD-MUM-99201',
        issuedDate: '18/10/2026',
        fileSize: '820 KB',
        status: 'verified'
      }
    ],
    activities: [
      {
        id: 'ACT-11',
        timestamp: '18/10/2026, 04:30 PM',
        actor: 'Suresh Patil',
        role: 'Delivery Driver',
        event: 'Delivered safely. Receiver signed on mobile app. Delivery proof photo saved.',
        terminalCode: 'MUM-DLV-88'
      }
    ]
  },
  {
    id: 'FLX-3109-BLR',
    billOfLading: 'LR-2026-88410',
    bookingRef: 'BKG-CHE-BLR-AIR',
    originHub: 'Chennai Ambattur Industrial Centre',
    originHubCode: 'TN-CHENNAI',
    destinationHub: 'Bengaluru Peenya Industrial Centre',
    destinationHubCode: 'KA-BENGALURU',
    serviceMode: 'heavy_haul',
    status: 'in-transit',
    progressPercent: 84,
    eta: '2026-10-19 19:30',
    dispatchedAt: '2026-10-19 05:00',
    carrier: 'FreightLine South Express Corridor',
    vesselOrFlight: 'BharatBenz 1617R (TN-09-BK-7701)',
    priorityLevel: 'expedited',
    customsStatus: 'cleared',
    paymentMethod: 'upi',
    whatsappUpdates: true,
    deliveryTimeEstimate: 'Reaching you today by 07:30 PM (19/10/2026)',
    sender: {
      name: 'Senthil Kumar',
      company: 'Madras Auto Components & Sensors',
      houseNo: 'Shed 19-B',
      area: 'Ambattur Industrial Estate',
      landmark: 'Near Telephone Exchange',
      address: 'Shed 19-B, Ambattur Industrial Estate',
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      postalCode: '600058',
      contactEmail: 'senthil@madrasauto.in',
      contactPhone: '+91 94440 19280',
      taxIdOrEori: '33AAACM9910Q1Z8'
    },
    receiver: {
      name: 'Priya Nair',
      company: 'Bengaluru Tech Assemblies Pvt Ltd',
      houseNo: 'Phase 2, Plot 42',
      area: 'Peenya Industrial Area',
      landmark: 'Near Peenya Metro Station',
      address: 'Phase 2, Plot 42, Peenya Industrial Area',
      city: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560058',
      contactEmail: 'priya.nair@bengalurutech.com',
      contactPhone: '+91 98450 77120',
      taxIdOrEori: '29AAACB8821N1ZM'
    },
    cargo: {
      type: 'Auto Sensors & Precision Brass Valves (18 Boxes)',
      quantity: 18,
      weightKg: 640,
      volumeCbm: 3.2,
      declaredValueInr: 320000,
      hazardous: false,
      sealNumber: 'SEAL-FLX-88410',
      temperatureControlled: false
    },
    checkpoints: [
      {
        id: 'CP-21',
        location: 'Ambattur Booking Centre',
        city: 'Chennai',
        country: 'India',
        timestamp: '19/10/2026, 05:30 AM',
        status: 'in-transit',
        facilityCode: 'CHE-AMB-01',
        description: 'Cartons collected and safety strapped. Fast express transit assigned.',
        completed: true
      },
      {
        id: 'CP-22',
        location: 'Hosur Border Checkpost',
        city: 'Hosur / Karnataka Border',
        country: 'India',
        timestamp: '19/10/2026, 02:00 PM',
        status: 'in-transit',
        facilityCode: 'HOS-TOLL-04',
        description: 'Passed border toll. Entering Electronic City expressway.',
        completed: true,
        isCurrent: true
      },
      {
        id: 'CP-23',
        location: 'Peenya Customer Godown',
        city: 'Bengaluru',
        country: 'India',
        timestamp: 'Expected: 19/10/2026, 07:30 PM',
        status: 'pending',
        facilityCode: 'BLR-PEE-02',
        description: 'Doorstep unloading and sign-off by receiving supervisor.',
        completed: false
      }
    ],
    assignedDriver: INITIAL_DRIVERS[3],
    documents: [
      {
        id: 'DOC-21',
        title: 'Parcel Delivery Receipt (Bilty / LR)',
        type: 'Bill of Lading',
        docNumber: 'LR-2026-88410',
        issuedDate: '19/10/2026',
        fileSize: '360 KB',
        status: 'verified'
      }
    ],
    activities: [
      {
        id: 'ACT-21',
        timestamp: '19/10/2026, 02:00 PM',
        actor: 'R. Pillai',
        role: 'Driver Partner',
        event: 'Live location updated at Electronic City flyover. On schedule for evening delivery.',
        terminalCode: 'BLR-ENTRY'
      }
    ]
  },
  {
    id: 'FLX-7741-KOL',
    billOfLading: 'LR-2026-77412',
    bookingRef: 'BKG-LUD-KOL-77',
    originHub: 'Ludhiana Woollen Centre (Industrial Area A)',
    originHubCode: 'PB-LUDHIANA',
    destinationHub: 'Kolkata Burrabazar Wholesale Hub',
    destinationHubCode: 'WB-KOLKATA',
    serviceMode: 'intermodal_rail',
    status: 'delayed',
    progressPercent: 65,
    eta: '2026-10-22 10:00 (Delayed by 1 day)',
    dispatchedAt: '2026-10-17 12:00',
    carrier: 'FreightLine Rail & Highway Combined Cargo',
    vesselOrFlight: 'Goods Train Parcel Van / Tata 1918 (PB-10-CZ-9912)',
    priorityLevel: 'standard',
    customsStatus: 'pre_approved',
    paymentMethod: 'cod',
    whatsappUpdates: true,
    deliveryTimeEstimate: 'Delayed: Reaches in 3 days (by 22/10/2026)',
    delayInfo: {
      reason: 'Heavy seasonal fog & railway track maintenance near Mughal Sarai.',
      reasonHindi: 'मुगलसराय के पास घने कोहरे और रेलवे ट्रैक मरम्मत के कारण ट्रेन धीमी हुई।',
      reasonCode: 'heavy_rain',
      durationHours: 24,
      durationText: '24 Hours',
      originalEta: '21/10/2026, 10:00 AM',
      revisedEta: '22/10/2026, 10:00 AM',
      location: 'Kanpur - Mughal Sarai Railway Corridor',
      historyText: 'Expected 21/10 → Now 22/10, because of heavy morning fog near Mughal Sarai',
      actionOption: 'change_time'
    },
    deliveryPromise: {
      confidencePercent: 78,
      promisedDay: 'Wednesday',
      promisedDate: '22/10/2026',
      description: 'Revised promise after factoring railway fog speed limits.'
    },
    deliveryOtp: '7741',
    photoProof: {
      pickupTimestamp: '17/10/2026, 01:30 PM',
      pickupHandedBy: 'Harpreet Singh (Punjab Hosiery)',
      deliveryTimestamp: 'Expected: 22/10/2026',
      deliveredTo: 'Sunita Roy (Kolkata Syndicate)',
      otpVerified: false
    },
    priceBreakdown: {
      baseCharge: 1250,
      fuelCharge: 125,
      packingCharge: 90,
      pickupCharge: 50,
      codFee: 40,
      gstAmount: 280,
      total: 1835
    },
    sender: {
      name: 'Harpreet Singh',
      company: 'Punjab Hosiery & Woollen Mills',
      houseNo: 'Plot 72',
      area: 'Industrial Area A',
      landmark: 'Near Cheema Chowk',
      address: 'Plot 72, Industrial Area A',
      city: 'Ludhiana',
      state: 'Punjab',
      country: 'India',
      postalCode: '141003',
      contactEmail: 'harpreet@punjabhosiery.in',
      contactPhone: '+91 98141 88920',
      taxIdOrEori: '03AAACH9901F1Z1'
    },
    receiver: {
      name: 'Sunita Roy',
      company: 'Bengal Handloom & Hosiery Syndicate',
      houseNo: 'Shop 24',
      area: 'Burrabazar Cotton Street',
      landmark: 'Near Howrah Bridge Approach',
      address: 'Shop 24, Burrabazar Cotton Street',
      city: 'Kolkata',
      state: 'West Bengal',
      country: 'India',
      postalCode: '700007',
      contactEmail: 'sunita.roy@bengalhandloom.co.in',
      contactPhone: '+91 98300 22109',
      taxIdOrEori: '19AAACB4410K1ZT'
    },
    cargo: {
      type: 'Winter Woollen Sweaters & Thermal Wear (120 Sacks)',
      quantity: 120,
      weightKg: 3800,
      volumeCbm: 18.0,
      declaredValueInr: 890000,
      hazardous: false,
      sealNumber: 'SEAL-FLX-77412',
      temperatureControlled: false
    },
    checkpoints: [
      {
        id: 'CP-31',
        location: 'Ludhiana Railway Goods Siding',
        city: 'Ludhiana',
        country: 'India',
        timestamp: '17/10/2026, 01:00 PM',
        status: 'delayed',
        facilityCode: 'LUD-RLY-01',
        description: '120 woollen sacks weighed and loaded into dedicated express parcel van.',
        completed: true
      },
      {
        id: 'CP-32',
        location: 'Kanpur Bypass Goods Yard',
        city: 'Kanpur',
        country: 'India',
        timestamp: '19/10/2026, 07:00 AM',
        status: 'delayed',
        facilityCode: 'KNP-YD-03',
        description: 'NOTICE: Train speed restricted due to heavy morning fog and railway track maintenance near Mughal Sarai.',
        completed: true,
        isCurrent: true
      },
      {
        id: 'CP-33',
        location: 'Kolkata Howrah Goods Terminal',
        city: 'Kolkata',
        country: 'India',
        timestamp: 'Expected: 22/10/2026, 10:00 AM',
        status: 'pending',
        facilityCode: 'KOL-HWH-02',
        description: 'Unloading into Burrabazar delivery tempos.',
        completed: false
      }
    ],
    assignedDriver: INITIAL_DRIVERS[4],
    documents: [
      {
        id: 'DOC-31',
        title: 'Parcel Delivery Receipt (Bilty / LR)',
        type: 'Bill of Lading',
        docNumber: 'LR-2026-77412',
        issuedDate: '17/10/2026',
        fileSize: '430 KB',
        status: 'verified'
      }
    ],
    activities: [
      {
        id: 'ACT-31',
        timestamp: '19/10/2026, 07:30 AM',
        actor: 'Kanpur Control Room',
        role: 'Railway Parcel Controller',
        event: 'Automatic delay alert sent to sender and receiver via SMS & WhatsApp. Revised arrival date updated.',
        terminalCode: 'KNP-CTRL',
        notes: 'Heavy seasonal fog between Kanpur and Varanasi slowed train movement.'
      }
    ]
  },
  {
    id: 'FLX-5520-HYD',
    billOfLading: 'LR-2026-55209',
    bookingRef: 'BKG-AHM-HYD-55',
    originHub: 'Ahmedabad Spice Market Centre (Kalupur)',
    originHubCode: 'GJ-AHMEDABAD',
    destinationHub: 'Hyderabad Koti Wholesale Centre',
    destinationHubCode: 'TG-HYDERABAD',
    serviceMode: 'heavy_haul',
    status: 'in-transit',
    progressPercent: 55,
    eta: '2026-10-21 15:00',
    dispatchedAt: '2026-10-18 10:00',
    carrier: 'FreightLine Inter-State Express',
    vesselOrFlight: 'Eicher 16-Wheeler (GJ-01-AX-4412)',
    priorityLevel: 'standard',
    customsStatus: 'pre_approved',
    paymentMethod: 'upi',
    whatsappUpdates: true,
    deliveryTimeEstimate: 'Reaches in 2 days (by 21/10/2026)',
    sender: {
      name: 'Bhavin Shah',
      company: 'Gujarat Agro Seeds Corporation',
      houseNo: 'B-12, APMC Market',
      area: 'Kalupur Grain Market',
      landmark: 'Near Railway Station',
      address: 'B-12, APMC Market, Kalupur',
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
      postalCode: '380001',
      contactEmail: 'bhavin@gujaratroseeds.com',
      contactPhone: '+91 98240 55120',
      taxIdOrEori: '24AAACG1120P1Z4'
    },
    receiver: {
      name: 'Venkatesh Rao',
      company: 'Telangana Kirana & Grain Merchants',
      houseNo: 'Shop 14',
      area: 'Koti Wholesale Market',
      landmark: 'Opposite State Bank',
      address: 'Shop 14, Koti Wholesale Market',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      postalCode: '500001',
      contactEmail: 'venkatesh.rao@telanganakirana.in',
      contactPhone: '+91 94400 33219',
      taxIdOrEori: '36AAACT4419K1ZV'
    },
    cargo: {
      type: 'Cumin Seeds, Coriander & Turmeric (60 Gunny Sacks)',
      quantity: 60,
      weightKg: 3000,
      volumeCbm: 12.0,
      declaredValueInr: 450000,
      hazardous: false,
      sealNumber: 'SEAL-FLX-55209',
      temperatureControlled: false
    },
    checkpoints: [
      {
        id: 'CP-41',
        location: 'Ahmedabad APMC Mandi Collection',
        city: 'Ahmedabad',
        country: 'India',
        timestamp: '18/10/2026, 11:00 AM',
        status: 'in-transit',
        facilityCode: 'AHM-APMC-01',
        description: '60 dry bags loaded with rain-proof tarpaulin sheets.',
        completed: true
      },
      {
        id: 'CP-42',
        location: 'Solapur Transit Junction',
        city: 'Solapur',
        country: 'India',
        timestamp: '19/10/2026, 08:30 AM',
        status: 'in-transit',
        facilityCode: 'MH-SOL-02',
        description: 'Vehicle inspection done. Moving on Solapur-Hyderabad highway.',
        completed: true,
        isCurrent: true
      },
      {
        id: 'CP-43',
        location: 'Hyderabad Koti Godown',
        city: 'Hyderabad',
        country: 'India',
        timestamp: 'Expected: 21/10/2026, 03:00 PM',
        status: 'pending',
        facilityCode: 'HYD-KOTI-03',
        description: 'Final unloading and handover.',
        completed: false
      }
    ],
    documents: [
      {
        id: 'DOC-41',
        title: 'Parcel Delivery Receipt (Bilty / LR)',
        type: 'Bill of Lading',
        docNumber: 'LR-2026-55209',
        issuedDate: '18/10/2026',
        fileSize: '370 KB',
        status: 'verified'
      }
    ],
    activities: [
      {
        id: 'ACT-41',
        timestamp: '19/10/2026, 08:30 AM',
        actor: 'Solapur Hub Officer',
        role: 'Highway Checkpoint Supervisor',
        event: 'Tarpaulin seals inspected. All 60 bags intact and dry.',
        terminalCode: 'MH-SOL-02'
      }
    ]
  },
  {
    id: 'FLX-1194-IND',
    billOfLading: 'LR-2026-11940',
    bookingRef: 'BKG-PUN-IND-11',
    originHub: 'Pune Chakan Auto Cluster Centre',
    originHubCode: 'MH-PUNE',
    destinationHub: 'Indore Siyaganj Wholesale Centre',
    destinationHubCode: 'MP-INDORE',
    serviceMode: 'heavy_haul',
    status: 'pending',
    progressPercent: 10,
    eta: '2026-10-22 18:00',
    dispatchedAt: '2026-10-19 10:00',
    carrier: 'FreightLine Central India Cargo',
    vesselOrFlight: 'Tata 407 (MH-12-PQ-9914)',
    priorityLevel: 'standard',
    customsStatus: 'pre_approved',
    paymentMethod: 'cod',
    whatsappUpdates: true,
    deliveryTimeEstimate: 'Pickup scheduled today; Reaches in 3 days (by 22/10/2026)',
    sender: {
      name: 'Nitin Deshmukh',
      company: 'Chakan Precision Castings',
      houseNo: 'Plot 31',
      area: 'MIDC Chakan Phase 2',
      landmark: 'Near Auto Cluster Gate',
      address: 'Plot 31, MIDC Chakan Phase 2',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '410501',
      contactEmail: 'nitin@chakanauto.in',
      contactPhone: '+91 98220 88410',
      taxIdOrEori: '27AAACN9912D1Z0'
    },
    receiver: {
      name: 'Radheshyam Agarwal',
      company: 'Agarwal Hardware & Tube Machinery',
      houseNo: 'Shop 55',
      area: 'Siyaganj Market',
      landmark: 'Near Siyaganj Square',
      address: 'Shop 55, Siyaganj Market',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      postalCode: '452001',
      contactEmail: 'radheshyam@agarwalmachinery.com',
      contactPhone: '+91 94250 11980',
      taxIdOrEori: '23AAACA8820J1ZY'
    },
    cargo: {
      type: 'Water Pump Castings & Pulleys (22 Wooden Boxes)',
      quantity: 22,
      weightKg: 1100,
      volumeCbm: 5.0,
      declaredValueInr: 260000,
      hazardous: false,
      sealNumber: 'SEAL-FLX-11940',
      temperatureControlled: false
    },
    checkpoints: [
      {
        id: 'CP-51',
        location: 'Chakan MIDC Centre',
        city: 'Pune',
        country: 'India',
        timestamp: '19/10/2026, 10:30 AM',
        status: 'pending',
        facilityCode: 'PUN-CHK-01',
        description: 'Pickup scheduled from shop. Vehicle dispatched for collection.',
        completed: true,
        isCurrent: true
      },
      {
        id: 'CP-52',
        location: 'Indore Siyaganj Centre',
        city: 'Indore',
        country: 'India',
        timestamp: 'Expected: 22/10/2026, 06:00 PM',
        status: 'pending',
        facilityCode: 'IND-SIY-01',
        description: 'Doorstep delivery and Cash on Delivery collection.',
        completed: false
      }
    ],
    documents: [
      {
        id: 'DOC-51',
        title: 'Parcel Delivery Receipt (Bilty / LR)',
        type: 'Bill of Lading',
        docNumber: 'LR-2026-11940',
        issuedDate: '19/10/2026',
        fileSize: '350 KB',
        status: 'verified'
      }
    ],
    activities: [
      {
        id: 'ACT-51',
        timestamp: '19/10/2026, 10:30 AM',
        actor: 'Pune Dispatch Desk',
        role: 'Booking Officer',
        event: 'Parcel request booked online. Pickup tempo assigned for 03:00 PM today.',
        terminalCode: 'PUN-CHK-01'
      }
    ]
  }
];

const STORAGE_KEY = 'freightline_shipments_data_v3';

export const getStoredShipments = (): Shipment[] => {
  if (typeof window === 'undefined') return INITIAL_SHIPMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SHIPMENTS));
      return INITIAL_SHIPMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read from localStorage', e);
    return INITIAL_SHIPMENTS;
  }
};

export const getShipmentById = (id: string): Shipment | undefined => {
  const shipments = getStoredShipments();
  const cleanId = id.trim().toUpperCase();
  return shipments.find(s => 
    s.id.toUpperCase() === cleanId || 
    s.billOfLading.toUpperCase() === cleanId || 
    s.bookingRef.toUpperCase() === cleanId
  );
};

export const searchShipments = (query: string): Shipment[] => {
  const shipments = getStoredShipments();
  const q = query.trim().toLowerCase();
  if (!q) return shipments;
  return shipments.filter(s => 
    s.id.toLowerCase().includes(q) ||
    s.billOfLading.toLowerCase().includes(q) ||
    s.originHub.toLowerCase().includes(q) ||
    s.destinationHub.toLowerCase().includes(q) ||
    s.sender.company.toLowerCase().includes(q) ||
    s.sender.name.toLowerCase().includes(q) ||
    s.receiver.company.toLowerCase().includes(q) ||
    s.receiver.name.toLowerCase().includes(q) ||
    s.cargo.type.toLowerCase().includes(q)
  );
};

export const saveShipment = (newShipment: Shipment): void => {
  const current = getStoredShipments();
  const existsIndex = current.findIndex(s => s.id === newShipment.id);
  let updated: Shipment[];
  if (existsIndex >= 0) {
    updated = [...current];
    updated[existsIndex] = newShipment;
  } else {
    updated = [newShipment, ...current];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getDrivers = (): DriverInfo[] => {
  return INITIAL_DRIVERS;
};

export const updateShipmentStatus = (
  id: string,
  newStatus: ShipmentStatus,
  extra: Partial<Shipment> = {}
): Shipment | undefined => {
  const current = getStoredShipments();
  const index = current.findIndex(s => s.id.toUpperCase() === id.trim().toUpperCase());
  if (index === -1) return undefined;

  const target = current[index];
  const nowStr = new Date().toLocaleString('en-IN');
  
  const updatedCheckpoints = [...target.checkpoints];
  if (newStatus === 'delivered') {
    updatedCheckpoints.forEach(cp => {
      cp.completed = true;
      cp.isCurrent = false;
    });
    if (updatedCheckpoints.length > 0) {
      updatedCheckpoints[updatedCheckpoints.length - 1].isCurrent = true;
    }
  }

  const updatedShipment: Shipment = {
    ...target,
    ...extra,
    status: newStatus,
    progressPercent: newStatus === 'delivered' ? 100 : (extra.progressPercent ?? target.progressPercent),
    checkpoints: updatedCheckpoints,
    activities: [
      {
        id: `ACT-${Date.now()}`,
        timestamp: nowStr,
        actor: 'FreightLine Security System',
        role: 'Automated Status Engine',
        event: newStatus === 'delivered'
          ? 'Consignment delivered successfully with secure customer OTP verification.'
          : `Shipment status updated to ${newStatus.toUpperCase()}`,
        terminalCode: target.destinationHubCode || 'MAIN-HUB'
      },
      ...target.activities
    ]
  };

  current[index] = updatedShipment;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event('freightline_storage_update'));
  }
  return updatedShipment;
};

export const updateReceiverPreferences = (
  id: string,
  preferences: { landmark?: string; preferredSlot?: string; instructions?: string }
): Shipment | undefined => {
  const current = getStoredShipments();
  const index = current.findIndex(s => s.id.toUpperCase() === id.trim().toUpperCase());
  if (index === -1) return undefined;

  const target = current[index];
  const nowStr = new Date().toLocaleString('en-IN');

  const updatedShipment: Shipment = {
    ...target,
    receiver: {
      ...target.receiver,
      landmark: preferences.landmark || target.receiver.landmark
    },
    receiverPreferences: {
      landmark: preferences.landmark,
      preferredSlot: preferences.preferredSlot,
      instructions: preferences.instructions,
      updatedAt: nowStr
    },
    activities: [
      {
        id: `ACT-PREF-${Date.now()}`,
        timestamp: nowStr,
        actor: target.receiver.name,
        role: 'Consignee (Receiver Self-Service)',
        event: `Receiver confirmed preferred delivery slot: ${preferences.preferredSlot || 'Standard Delivery'}${preferences.landmark ? ` (Landmark: ${preferences.landmark})` : ''}`,
        terminalCode: target.destinationHubCode || 'LAST-MILE'
      },
      ...target.activities
    ]
  };

  current[index] = updatedShipment;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event('freightline_storage_update'));
  }
  return updatedShipment;
};

const PROBLEM_REPORTS_KEY = 'freightline_problem_reports';

export const addProblemReport = (report: ProblemReport): void => {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(PROBLEM_REPORTS_KEY);
    const reports: ProblemReport[] = raw ? JSON.parse(raw) : [];
    reports.unshift(report);
    localStorage.setItem(PROBLEM_REPORTS_KEY, JSON.stringify(reports));

    // Also link into shipment activities if shipment exists
    const current = getStoredShipments();
    const index = current.findIndex(s => s.id.toUpperCase() === report.shipmentId.toUpperCase());
    if (index !== -1) {
      current[index].activities.unshift({
        id: `ACT-TKT-${Date.now()}`,
        timestamp: report.submittedAt,
        actor: 'Customer Support Portal',
        role: 'Helpdesk Dispatcher',
        event: `Customer problem ticket created: ${report.id} (${report.issueType.toUpperCase()}) - ${report.description.slice(0, 40)}...`,
        terminalCode: 'SUPPORT-DESK'
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      window.dispatchEvent(new Event('freightline_storage_update'));
    }
  } catch (e) {
    console.error('Failed to save problem report', e);
  }
};

export const getProblemReports = (): ProblemReport[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PROBLEM_REPORTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to get problem reports', e);
    return [];
  }
};
