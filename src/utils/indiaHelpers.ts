export const formatCurrency = (amount: number): string => {
  if (isNaN(amount)) return '₹0';
  return '₹' + amount.toLocaleString('en-IN');
};

export const formatDate = (dateInput: string | Date): string => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) {
    // If it's already a formatted string like '2026-10-21 16:30 UTC'
    const parts = String(dateInput).split(' ')[0].split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return String(dateInput);
  }
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatTime12h = (dateInput: string | Date): string => {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) {
    const timeMatch = String(dateInput).match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = timeMatch[2];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    }
    return '';
  }
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
};

export const formatDateTime = (dateInput: string | Date): string => {
  const dateStr = formatDate(dateInput);
  const timeStr = formatTime12h(dateInput);
  return timeStr ? `${dateStr}, ${timeStr}` : dateStr;
};

export interface PinLocation {
  city: string;
  state: string;
  area: string;
}

export const PINCODE_DIRECTORY: Record<string, PinLocation> = {
  '110006': { city: 'Delhi', state: 'Delhi', area: 'Chandni Chowk / Old Delhi' },
  '110020': { city: 'New Delhi', state: 'Delhi', area: 'Okhla Industrial Area' },
  '302001': { city: 'Jaipur', state: 'Rajasthan', area: 'MI Road / Johari Bazar' },
  '395002': { city: 'Surat', state: 'Gujarat', area: 'Ring Road Textile Market' },
  '400001': { city: 'Mumbai', state: 'Maharashtra', area: 'Fort / South Mumbai' },
  '400707': { city: 'Navi Mumbai', state: 'Maharashtra', area: 'Nhava Sheva' },
  '141001': { city: 'Ludhiana', state: 'Punjab', area: 'Industrial Area A' },
  '700001': { city: 'Kolkata', state: 'West Bengal', area: 'BBD Bagh / Burrabazar' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', area: 'George Town / Parrys' },
  '560001': { city: 'Bengaluru', state: 'Karnataka', area: 'MG Road / City Market' },
  '500001': { city: 'Hyderabad', state: 'Telangana', area: 'Koti / Abids' },
  '411001': { city: 'Pune', state: 'Maharashtra', area: 'Swargate / Camp' },
  '380001': { city: 'Ahmedabad', state: 'Gujarat', area: 'Kalupur / Lal Darwaja' },
  '452001': { city: 'Indore', state: 'Madhya Pradesh', area: 'Siyaganj / Rajwada' },
  '226001': { city: 'Lucknow', state: 'Uttar Pradesh', area: 'Hazratganj / Aminabad' },
  '800001': { city: 'Patna', state: 'Bihar', area: 'Station Road / Fraser Road' },
  '160017': { city: 'Chandigarh', state: 'Punjab', area: 'Sector 17 Market' },
};

export const lookupPinCode = (pin: string): PinLocation | null => {
  const clean = pin.trim();
  if (PINCODE_DIRECTORY[clean]) {
    return PINCODE_DIRECTORY[clean];
  }
  // Fallback prefix heuristic
  if (clean.startsWith('11')) return { city: 'Delhi', state: 'Delhi', area: 'Delhi Central' };
  if (clean.startsWith('30')) return { city: 'Jaipur', state: 'Rajasthan', area: 'Jaipur Central' };
  if (clean.startsWith('39')) return { city: 'Surat', state: 'Gujarat', area: 'Surat City' };
  if (clean.startsWith('40')) return { city: 'Mumbai', state: 'Maharashtra', area: 'Greater Mumbai' };
  if (clean.startsWith('14')) return { city: 'Ludhiana', state: 'Punjab', area: 'Ludhiana City' };
  if (clean.startsWith('70')) return { city: 'Kolkata', state: 'West Bengal', area: 'Kolkata City' };
  if (clean.startsWith('60')) return { city: 'Chennai', state: 'Tamil Nadu', area: 'Chennai City' };
  if (clean.startsWith('56')) return { city: 'Bengaluru', state: 'Karnataka', area: 'Bengaluru Urban' };
  if (clean.startsWith('50')) return { city: 'Hyderabad', state: 'Telangana', area: 'Hyderabad City' };
  if (clean.startsWith('41')) return { city: 'Pune', state: 'Maharashtra', area: 'Pune City' };
  if (clean.startsWith('38')) return { city: 'Ahmedabad', state: 'Gujarat', area: 'Ahmedabad City' };
  if (clean.startsWith('45')) return { city: 'Indore', state: 'Madhya Pradesh', area: 'Indore City' };
  return null;
};

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

export interface RegionalHubMetadata {
  code: string;
  name: string;
  city: string;
  state: string;
}

export const ALL_REGIONAL_HUBS: RegionalHubMetadata[] = [
  { code: 'DEL-CENTRAL', name: 'Delhi Central Sorting & National Gateway', city: 'Delhi', state: 'Delhi' },
  { code: 'MH-MUMBAI', name: 'Mumbai Bhiwandi Logistics Gateway', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'JPR-MAIN', name: 'Jaipur Industrial Distribution Hub', city: 'Jaipur', state: 'Rajasthan' },
  { code: 'GJ-SURAT', name: 'Surat Textile & Western Cargo Center', city: 'Surat', state: 'Gujarat' },
  { code: 'KA-BLR', name: 'Bengaluru Tech & Electronics Park', city: 'Bengaluru', state: 'Karnataka' },
  { code: 'WB-KOL', name: 'Kolkata Eastern Logistics Gateway', city: 'Kolkata', state: 'West Bengal' },
  { code: 'HYD', name: 'Hyderabad Regional Cargo Hub', city: 'Hyderabad', state: 'Telangana' },
  { code: 'MAA', name: 'Chennai Coromandel Coastal Gateway', city: 'Chennai', state: 'Tamil Nadu' },
  { code: 'AMD', name: 'Ahmedabad Sabarmati Intermodal Terminal', city: 'Ahmedabad', state: 'Gujarat' },
];

export const CITY_TO_HUB_CODE: Record<string, string> = {
  delhi: 'DEL-CENTRAL',
  'new delhi': 'DEL-CENTRAL',
  mumbai: 'MH-MUMBAI',
  jaipur: 'JPR-MAIN',
  surat: 'GJ-SURAT',
  bengaluru: 'KA-BLR',
  bangalore: 'KA-BLR',
  kolkata: 'WB-KOL',
  hyderabad: 'HYD',
  chennai: 'MAA',
  ahmedabad: 'AMD',
};

export const getHubCodeForCity = (city: string): string => {
  if (!city) return 'ORG-HUB';
  const clean = city.trim().toLowerCase();
  return CITY_TO_HUB_CODE[clean] || `${city.slice(0, 3).toUpperCase()}-HUB`;
};
