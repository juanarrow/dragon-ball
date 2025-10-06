# 🌟 Dragon Ball Characters

Una aplicación web moderna y elegante para explorar el universo de Dragon Ball, desarrollada con TypeScript y Vite. Permite navegar por personajes y planetas con una interfaz intuitiva y efectos visuales impresionantes.

## 🚀 Características

### ✨ Funcionalidades Principales
- **Exploración de Personajes**: Navega por todos los personajes de Dragon Ball con información detallada
- **Exploración de Planetas**: Descubre los planetas del universo Dragon Ball con su estado de destrucción
- **Búsqueda en Tiempo Real**: Busca personajes por nombre con debounce para una experiencia fluida
- **Filtros Avanzados**: Filtra por género y raza para encontrar personajes específicos
- **Navegación SPA**: Aplicación de una sola página con navegación del lado del cliente
- **Infinite Scroll**: Carga automática de contenido al hacer scroll
- **Páginas de Detalle**: Información completa de personajes y planetas individuales

### 🎨 Diseño y UX
- **Tema Dragon Ball**: Colores y efectos visuales inspirados en la serie
- **Animaciones Fluidas**: Efectos de hover, transiciones y animaciones temáticas
- **Diseño Responsive**: Optimizado para dispositivos móviles y desktop
- **Efectos Visuales**: Sombras, gradientes y efectos de energía Ki
- **Iconografía Temática**: Iconos específicos para género, Ki, Max Ki y estado de planetas

## 🛠️ Tecnologías Utilizadas

### Frontend
- **TypeScript**: Tipado estático para mayor robustez
- **Vite**: Herramienta de desarrollo rápida y moderna
- **CSS Puro**: Estilos personalizados sin frameworks CSS
- **Fetch API**: Peticiones HTTP nativas del navegador

### Arquitectura
- **Arquitectura Modular**: Separación clara de responsabilidades
- **Patrón Observer**: Gestión de estado reactiva
- **Componentes Reutilizables**: Sistema de componentes base
- **Router del Cliente**: Navegación SPA personalizada

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes de UI reutilizables
│   ├── Component.ts      # Clase base abstracta
│   ├── CharacterCardComponent.ts
│   ├── CharacterDetailComponent.ts
│   ├── CharactersGridComponent.ts
│   ├── PlanetCardComponent.ts
│   ├── PlanetDetailComponent.ts
│   ├── PlanetsGridComponent.ts
│   ├── NavigationMenuComponent.ts
│   ├── HeaderComponent.ts
│   ├── SearchContainerComponent.ts
│   ├── LoadingIndicatorComponent.ts
│   ├── EndMessageComponent.ts
│   ├── ErrorContainerComponent.ts
│   └── index.ts          # Exportaciones centralizadas
├── config/
│   └── constants.ts      # Configuración y constantes
├── router/
│   └── router.ts         # Router del cliente
├── services/
│   ├── dragonBallService.ts    # Servicio de API
│   ├── characterService.ts     # Lógica de personajes
│   └── planetService.ts        # Lógica de planetas
├── state/
│   └── stateManager.ts   # Gestión de estado global
├── types/
│   └── dragonball.ts     # Definiciones de tipos TypeScript
├── ui/
│   └── uiManager.ts      # Gestor de interfaz de usuario
├── main.ts              # Punto de entrada de la aplicación
└── style.css            # Estilos globales
```

## 🎯 Componentes Principales

### StateManager
- **Gestión de Estado**: Maneja el estado global de la aplicación
- **Patrón Observer**: Notifica cambios a los suscriptores
- **Estado Reactivo**: Actualizaciones automáticas de la UI

### Router
- **Navegación SPA**: Router del lado del cliente
- **Historial de Navegación**: Recuerda la página anterior para el botón "Volver"
- **Rutas Dinámicas**: Soporte para rutas con parámetros

### UIManager
- **Renderizado Dinámico**: Genera HTML basado en el estado
- **Event Delegation**: Manejo eficiente de eventos
- **Componentes Orquestados**: Coordina todos los componentes UI

### Services
- **DragonBallService**: Interfaz con la API externa
- **CharacterService**: Lógica de negocio para personajes
- **PlanetService**: Lógica de negocio para planetas

## 🎨 Sistema de Diseño

### Paleta de Colores
```css
--dragon-orange: #ff6b35    /* Color principal */
--dragon-red: #dc2626       /* Destrucción */
--dragon-blue: #2563eb      /* Elementos secundarios */
--dragon-yellow: #fbbf24    /* Acentos */
--energy-ki: #10b981        /* Energía Ki */
--energy-aura: #06b6d4      /* Aura de poder */
--dragon-dark: #0f172a      /* Fondo principal */
--dragon-light: #f8fafc     /* Texto claro */
```

### Tipografías
- **Orbitron**: Títulos y elementos destacados
- **Inter**: Texto general y contenido

### Efectos Visuales
- **Gradientes**: Fondos con gradientes temáticos
- **Sombras**: Efectos de profundidad y energía
- **Animaciones**: Transiciones suaves y efectos de hover
- **Backdrop Filter**: Efectos de desenfoque modernos

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd dragon-ball

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construcción para producción
npm run preview      # Vista previa de la construcción
```

## 📡 API Externa

La aplicación utiliza la API pública de Dragon Ball:
- **URL Base**: `https://dragonball-api.com/api`
- **Documentación**: [Dragon Ball API](https://web.dragonball-api.com/documentation)

### Endpoints Utilizados
- `GET /characters` - Lista de personajes con paginación
- `GET /characters/{id}` - Detalle de personaje específico
- `GET /characters?name={query}` - Búsqueda de personajes
- `GET /characters?race={race}&gender={gender}` - Filtros
- `GET /planets` - Lista de planetas con paginación
- `GET /planets/{id}` - Detalle de planeta específico

## 🎮 Funcionalidades Detalladas

### Búsqueda y Filtros
- **Búsqueda en Tiempo Real**: Debounce de 300ms para optimizar rendimiento
- **Filtros Combinados**: Género y raza se pueden combinar
- **Limpieza de Filtros**: Botón para resetear búsqueda y filtros
- **Indicadores Visuales**: Spinner durante búsquedas

### Infinite Scroll
- **Carga Automática**: Detecta cuando el usuario llega al final
- **Umbral Configurable**: 200px antes del final para carga suave
- **Prevención de Duplicados**: Evita cargas múltiples simultáneas
- **Indicadores de Estado**: Loading y mensaje de fin de contenido

### Navegación
- **Menú Superior**: Navegación entre secciones principales
- **Breadcrumbs Visuales**: Indicador de página actual
- **Botón Volver**: Navegación contextual a la página anterior
- **URLs Limpias**: Rutas semánticas y navegables

## 🔧 Configuración

### Constantes Configurables
```typescript
const CONFIG = {
  API_BASE_URL: 'https://dragonball-api.com/api',
  DEFAULT_PAGE_SIZE: 20,
  SEARCH_DEBOUNCE_DELAY: 300,
  INFINITE_SCROLL_THRESHOLD: 200,
  REQUEST_TIMEOUT: 10000
}
```

### Personalización de Estilos
Los estilos están organizados en secciones lógicas:
- Variables CSS para colores y tipografías
- Estilos base y reset
- Componentes específicos
- Responsive design
- Animaciones y efectos

## 🐛 Solución de Problemas

### Problemas Comunes
1. **Error de CORS**: La API externa puede tener restricciones CORS
2. **Imágenes rotas**: Algunas URLs de imágenes pueden no estar disponibles
3. **Límites de API**: La API puede tener límites de rate limiting

### Debug
- Usar las herramientas de desarrollador del navegador
- Verificar la consola para errores de JavaScript
- Comprobar la pestaña Network para errores de API

## 🤝 Contribución

### Cómo Contribuir
1. Fork del repositorio
2. Crear una rama para la nueva funcionalidad
3. Realizar los cambios con commits descriptivos
4. Crear un Pull Request con descripción detallada

### Estándares de Código
- **TypeScript**: Tipado estricto habilitado
- **ESLint**: Linting automático configurado
- **Nomenclatura**: camelCase para variables, PascalCase para clases
- **Comentarios**: Documentación en español

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Dragon Ball API**: Por proporcionar acceso gratuito a los datos
- **Akira Toriyama**: Por crear el increíble universo de Dragon Ball
- **Comunidad Open Source**: Por las herramientas y librerías utilizadas

## 📞 Contacto

Para preguntas, sugerencias o reportar bugs, por favor:
- Crear un issue en el repositorio
- Contactar al desarrollador principal

---

**¡Disfruta explorando el universo de Dragon Ball! 🌟**
