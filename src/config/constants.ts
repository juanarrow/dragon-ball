export const CONFIG = {
  // Paginación
  DEFAULT_PAGE_SIZE: 20,
  INFINITE_SCROLL_THRESHOLD: 100,
  
  // Debounce
  SEARCH_DEBOUNCE_DELAY: 500,
  
  // UI
  ANIMATION_DURATION: 500,
  
  // API
  API_TIMEOUT: 10000,
  
  // Géneros disponibles
  GENDERS: [
    { value: '', text: 'Todos los géneros' },
    { value: 'Male', text: 'Masculino' },
    { value: 'Female', text: 'Femenino' },
    { value: 'Unknown', text: 'Desconocido' }
  ] as const,
  
  // Razas disponibles
  RACES: [
    { value: '', text: 'Todas las razas' },
    { value: 'Human', text: 'Humano' },
    { value: 'Saiyan', text: 'Saiyan' },
    { value: 'Namekian', text: 'Namekiano' },
    { value: 'Majin', text: 'Majin' },
    { value: 'Frieza Race', text: 'Raza de Freezer' },
    { value: 'Android', text: 'Androide' },
    { value: 'Jiren Race', text: 'Raza de Jiren' },
    { value: 'God', text: 'Dios' },
    { value: 'Angel', text: 'Ángel' },
    { value: 'Evil', text: 'Malvado' },
    { value: 'Unknown', text: 'Desconocido' }
  ] as const,
  
  // Iconos
  ICONS: {
    GENDER: {
      MALE: '♂',
      FEMALE: '♀',
      UNKNOWN: '⚧'
    },
    KI: '⚡',
    MAX_KI: '💥'
  } as const
} as const

export type GenderOption = typeof CONFIG.GENDERS[number]
export type RaceOption = typeof CONFIG.RACES[number]
