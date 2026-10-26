export type CbamSector = 'steel' | 'cement' | 'aluminum' | 'fertilizers' | 'hydrogen' | 'electricity'

export interface CbamProduct {
  id: string
  name: string
  sector: CbamSector
  cnCode: string
  emissionFactor: number // tCO2 per tonne of product (or tCO2/MWh for electricity)
  unit: string
  note?: string
}

export const CBAM_PRODUCTS: CbamProduct[] = [
  // Cement
  { id: 'cement-portland', name: 'Portland cement', sector: 'cement', cnCode: '2523 29', emissionFactor: 0.83, unit: 'tonne' },
  { id: 'cement-clinker', name: 'Clinker', sector: 'cement', cnCode: '2523 10', emissionFactor: 0.89, unit: 'tonne' },
  { id: 'cement-aluminous', name: 'Aluminous cement', sector: 'cement', cnCode: '2523 90', emissionFactor: 0.65, unit: 'tonne' },

  // Iron & Steel
  { id: 'steel-pig-iron', name: 'Pig iron (blast furnace)', sector: 'steel', cnCode: '7201', emissionFactor: 1.52, unit: 'tonne' },
  { id: 'steel-crude-bof', name: 'Crude steel — BOF route', sector: 'steel', cnCode: '7206/7207', emissionFactor: 1.89, unit: 'tonne', note: 'Blast furnace + basic oxygen furnace' },
  { id: 'steel-crude-eaf', name: 'Crude steel — EAF route', sector: 'steel', cnCode: '7206/7207', emissionFactor: 0.42, unit: 'tonne', note: 'Electric arc furnace (recycled scrap)' },
  { id: 'steel-flat', name: 'Flat-rolled steel products', sector: 'steel', cnCode: '7208–7212', emissionFactor: 1.45, unit: 'tonne' },
  { id: 'steel-long', name: 'Long steel products (bars, rods)', sector: 'steel', cnCode: '7213–7215', emissionFactor: 1.55, unit: 'tonne' },
  { id: 'steel-stainless', name: 'Stainless steel', sector: 'steel', cnCode: '7219/7220', emissionFactor: 2.80, unit: 'tonne' },

  // Aluminum
  { id: 'alu-primary', name: 'Primary aluminum (avg grid)', sector: 'aluminum', cnCode: '7601 10', emissionFactor: 8.50, unit: 'tonne', note: 'Includes electricity emissions (avg. grid)' },
  { id: 'alu-primary-coal', name: 'Primary aluminum (coal-heavy grid)', sector: 'aluminum', cnCode: '7601 10', emissionFactor: 14.0, unit: 'tonne', note: 'Coal-intensive electricity (e.g. China)' },
  { id: 'alu-secondary', name: 'Secondary (recycled) aluminum', sector: 'aluminum', cnCode: '7601 20', emissionFactor: 0.60, unit: 'tonne' },
  { id: 'alu-wrought', name: 'Wrought aluminum products', sector: 'aluminum', cnCode: '7604–7616', emissionFactor: 7.00, unit: 'tonne' },

  // Fertilizers
  { id: 'fert-ammonia', name: 'Ammonia', sector: 'fertilizers', cnCode: '2814', emissionFactor: 2.10, unit: 'tonne' },
  { id: 'fert-nitric-acid', name: 'Nitric acid', sector: 'fertilizers', cnCode: '2808', emissionFactor: 1.20, unit: 'tonne' },
  { id: 'fert-urea', name: 'Urea', sector: 'fertilizers', cnCode: '3102 10', emissionFactor: 1.45, unit: 'tonne' },
  { id: 'fert-ammonium-nitrate', name: 'Ammonium nitrate (AN)', sector: 'fertilizers', cnCode: '3102 30', emissionFactor: 2.80, unit: 'tonne' },
  { id: 'fert-npk', name: 'Mixed fertilizers (NPK)', sector: 'fertilizers', cnCode: '3105', emissionFactor: 2.20, unit: 'tonne' },

  // Hydrogen
  { id: 'h2-grey', name: 'Grey hydrogen (steam methane)', sector: 'hydrogen', cnCode: '2804 10', emissionFactor: 9.00, unit: 'tonne', note: 'Standard SMR, no CCS' },
  { id: 'h2-blue', name: 'Blue hydrogen (SMR + CCS)', sector: 'hydrogen', cnCode: '2804 10', emissionFactor: 2.00, unit: 'tonne', note: 'Partial carbon capture' },
  { id: 'h2-green', name: 'Green hydrogen (electrolysis)', sector: 'hydrogen', cnCode: '2804 10', emissionFactor: 0.05, unit: 'tonne', note: 'Renewable electricity' },

  // Electricity
  { id: 'elec-avg', name: 'Electricity (grid average)', sector: 'electricity', cnCode: '2716', emissionFactor: 0.65, unit: 'MWh', note: 'tCO2 per MWh; varies by country grid' },
]

export const SECTOR_LABELS: Record<CbamSector, string> = {
  steel: 'Iron & Steel',
  cement: 'Cement',
  aluminum: 'Aluminum',
  fertilizers: 'Fertilizers',
  hydrogen: 'Hydrogen',
  electricity: 'Electricity',
}

export interface OriginCountry {
  code: string
  name: string
  carbonPrice: number // €/tCO2 equivalent — deductible from CBAM
  hasEts: boolean
}

export const ORIGIN_COUNTRIES: OriginCountry[] = [
  { code: 'CN', name: 'China', carbonPrice: 7, hasEts: true },
  { code: 'IN', name: 'India', carbonPrice: 0, hasEts: false },
  { code: 'RU', name: 'Russia', carbonPrice: 0, hasEts: false },
  { code: 'TR', name: 'Turkey', carbonPrice: 2, hasEts: false },
  { code: 'UA', name: 'Ukraine', carbonPrice: 1, hasEts: false },
  { code: 'EG', name: 'Egypt', carbonPrice: 0, hasEts: false },
  { code: 'VN', name: 'Vietnam', carbonPrice: 0, hasEts: false },
  { code: 'KR', name: 'South Korea', carbonPrice: 8, hasEts: true },
  { code: 'TW', name: 'Taiwan', carbonPrice: 3, hasEts: false },
  { code: 'US', name: 'United States', carbonPrice: 0, hasEts: false },
  { code: 'CA', name: 'Canada', carbonPrice: 33, hasEts: true },
  { code: 'GB', name: 'United Kingdom', carbonPrice: 40, hasEts: true },
  { code: 'CH', name: 'Switzerland', carbonPrice: 50, hasEts: true },
  { code: 'NO', name: 'Norway', carbonPrice: 62, hasEts: true },
  { code: 'JP', name: 'Japan', carbonPrice: 3, hasEts: false },
  { code: 'BR', name: 'Brazil', carbonPrice: 0, hasEts: false },
  { code: 'ZA', name: 'South Africa', carbonPrice: 1, hasEts: false },
  { code: 'PK', name: 'Pakistan', carbonPrice: 0, hasEts: false },
  { code: 'ID', name: 'Indonesia', carbonPrice: 2, hasEts: false },
  { code: 'MX', name: 'Mexico', carbonPrice: 1, hasEts: false },
]
