# 🏷️👉 Sistema de Registro de Marcas

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

**Sistema de gestión de marcas comerciales con autenticación, CRUD y perfil de usuario**

</div>

---
## ✨ Características Principales

### 🔐 **Sistema de Autenticación Completo**
- **Login/Registro** con validación de formularios
- **Gestión de sesiones** con tokens JWT
- **Protección de rutas** automática
- **Contexto de autenticación** global

### 🏷️ **CRUD de Marcas Comerciales**
- **Crear** nuevas marcas con formulario paso a paso
- **Leer** lista de marcas con tabla avanzada
- **Actualizar** información de marcas existentes
- **Eliminar** marcas con confirmación
- **Subida de logos** con validación de archivos
- **Filtros y búsqueda** en tiempo real

### 👤 **Gestión de Perfil de Usuario**
- **Edición de información** personal
- **Subida de avatar** con preview
- **Validación de datos** en tiempo real
- **Persistencia** de cambios

### 🎨 **Interfaz Moderna y Responsiva**
- **Diseño adaptativo** para móviles y desktop
- **Tema claro/oscuro** automático
- **Componentes reutilizables** con Shadcn/ui
- **Animaciones fluidas** y transiciones

---

## 🛠️ Stack Tecnológico

### **Frontend**
- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript 5.7
- **UI Components**: Shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 4.0
- **State Management**: React Context + Zustand
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table con filtros avanzados

### **Backend Integration**
- **HTTP Client**: Axios con interceptors
- **API**: RESTful con autenticación Bearer
- **Validation**: Zod schemas
- **Error Handling**: Manejo global de errores

### **Herramientas de Desarrollo**
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged
- **Package Manager**: pnpm
- **Build Tool**: Next.js con Turbopack

---

## 🚀 Instalación y Configuración

### **Prerrequisitos**
- Node.js 18+ 
- pnpm (recomendado) o npm
- Git

### **1. Clonar el Repositorio**
```bash
git clone https://github.com/tu-usuario/registro-de-marcas-frontend.git
cd registro-de-marcas-frontend
```

### **2. Instalar Dependencias**
```bash
pnpm install
```

### **3. Configurar Variables de Entorno**
```bash
cp env.example.txt .env.local
```

Editar `.env.local` con tus configuraciones:
```env
# API Backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_V1_AUTH_LOGIN=/api/v1/auth/login
NEXT_PUBLIC_API_V1_AUTH_REGISTER=/api/v1/auth/register
NEXT_PUBLIC_API_V1_AUTH_ME=/api/v1/auth/me
NEXT_PUBLIC_API_V1_TRADEMARKS=/api/v1/trademarks
```

### **4. Ejecutar en Desarrollo**
```bash
pnpm dev
```

La aplicación estará disponible en: **http://localhost:3000**

---

## 📱 Funcionalidades del Sistema

### **🏠 Página Principal**
- Redirección automática según estado de autenticación
- Loading states optimizados
- Navegación inteligente

### **🔐 Autenticación**
- **Sign In**: Login con email y contraseña
- **Sign Up**: Registro de nuevos usuarios
- **Persistencia**: Tokens almacenados en cookies/localStorage
- **Logout**: Cierre de sesión seguro

### **📊 Dashboard Principal**
- **Vista general** de marcas registradas
- **Estadísticas** y métricas
- **Navegación rápida** a funcionalidades

### **🏷️ Gestión de Marcas**
- **Listado**: Tabla con paginación, filtros y búsqueda
- **Crear**: Formulario paso a paso (4 pasos)
- **Editar**: Modificación de marcas existentes
- **Eliminar**: Confirmación antes de borrar
- **Logo**: Subida y preview de imágenes

### **👤 Perfil de Usuario**
- **Información personal**: Nombre, apellido, email
- **Avatar**: Subida y gestión de imagen de perfil
- **Edición**: Modo inline para cambios rápidos
- **Validación**: Verificación en tiempo real

---

## 🏗️ Arquitectura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   ├── dashboard/         # Panel principal
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (Shadcn/ui)
│   ├── layout/           # Componentes de layout
│   └── auth/             # Componentes de autenticación
├── features/             # Módulos por funcionalidad
│   ├── auth/            # Autenticación
│   ├── trademarks/      # Gestión de marcas
│   └── profile/         # Perfil de usuario
├── contexts/             # Contextos de React
│   └── auth-context.tsx # Contexto de autenticación
├── hooks/               # Hooks personalizados
├── lib/                 # Utilidades y configuraciones
├── types/               # Tipos TypeScript
└── config/              # Configuraciones (axios, etc.)
```

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Servidor de desarrollo con hot reload

# Producción
pnpm build            # Construir para producción
pnpm start            # Iniciar servidor de producción

# Calidad de Código
pnpm lint             # Verificar linting
pnpm lint:fix         # Corregir errores de linting automáticamente
pnpm format           # Formatear código con Prettier
```

---

## 🌟 Características Destacadas

### **🎯 Experiencia de Usuario**
- **Formularios inteligentes** con validación en tiempo real
- **Feedback visual** inmediato para todas las acciones
- **Loading states** optimizados para mejor percepción
- **Manejo de errores** amigable y descriptivo

### **⚡ Performance**
- **Lazy loading** de componentes
- **Optimización de imágenes** automática
- **Code splitting** inteligente
- **Caching** de datos optimizado

### **🔒 Seguridad**
- **Validación** de entrada en frontend y backend
- **Sanitización** de datos
- **Protección CSRF** implícita
- **Headers de seguridad** configurados

---

## 🤝 Contribuir

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---
