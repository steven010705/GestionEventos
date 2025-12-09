# Plataforma de Gestión de Eventos

## Descripción

GestionEventos es una aplicación web completa para la gestión de eventos y entradas que conecta organizadores de eventos con asistentes. La aplicación incluye:

- **Autenticación segura** con Supabase Auth (organizadores y asistentes)
- **Persistencia de datos** usando Supabase KV Store
- **Búsqueda y filtros avanzados** de eventos
- **Gestión completa de eventos** para organizadores
- **Carrito de compras y checkout** para asistentes
- **Panel de estadísticas** para organizadores
- **Gestión de preferencias** y notificaciones para usuarios

## Primeros Pasos

### 1. Inicializar la Base de Datos

Cuando abras la aplicación por primera vez, verás un botón azul que dice **"Inicializar Datos"**. Haz clic en él para:
- Cargar los lugares (venues) iniciales en la base de datos
- Preparar la aplicación para su uso

**IMPORTANTE**: Solo necesitas hacer esto UNA VEZ.

### 2. Crear una Cuenta

Puedes registrarte como:

#### **Asistente** (Usuario Regular)
- Explora eventos
- Compra entradas
- Gestiona tus compras
- Configura preferencias de notificaciones

#### **Organizador** (Creador de Eventos)
- Crea y gestiona eventos
- Establece precios y tipos de entradas
- Ve estadísticas de ventas
- Monitorea la ocupación de eventos

## Funcionalidades Principales

### Para Asistentes

1. **Explorar Eventos**
   - Usa filtros por categoría, precio y fecha
   - Busca por palabras clave
   - Ordena por popularidad, precio o fecha

2. **Comprar Entradas**
   - Selecciona cantidad y tipo de entrada
   - Aplica códigos promocionales
   - Procesa pagos seguros (simulado)

3. **Gestionar Perfil**
   - Ve tu historial de compras
   - Configura notificaciones
   - Selecciona categorías favoritas

### Para Organizadores

1. **Crear Eventos**
   - Llena el formulario con información del evento
   - Selecciona el lugar del evento
   - Define tipos de entradas y precios
   - Establece promociones (opcional)

2. **Panel de Control**
   - Visualiza estadísticas en tiempo real
   - Gráficos de ventas por evento
   - Distribución por categoría
   - Ocupación promedio

3. **Gestionar Eventos**
   - Edita información de eventos existentes
   - Elimina eventos
   - Monitorea ventas en tiempo real

## Autenticación

La aplicación usa **Supabase Auth** para autenticación segura:

- Los usuarios se confirman automáticamente al registrarse
- Las sesiones se mantienen en localStorage
- Los tokens de acceso se validan en cada petición al servidor

## Backend y API

### Arquitectura

```
Frontend (React) → Backend (Hono/Deno) → Database (Supabase KV)
```

### Endpoints Disponibles

#### Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión
- `GET /auth/me` - Obtener usuario actual

#### Eventos
- `GET /events` - Listar todos los eventos
- `GET /events/:id` - Obtener un evento
- `POST /events` - Crear evento (organizadores)
- `PUT /events/:id` - Actualizar evento (organizadores)
- `DELETE /events/:id` - Eliminar evento (organizadores)

#### Compras
- `POST /purchases` - Crear compra (asistentes)
- `GET /purchases/my` - Obtener mis compras

#### Organizador
- `GET /organizer/dashboard` - Dashboard con estadísticas

#### Preferencias
- `GET /users/preferences` - Obtener preferencias
- `PUT /users/preferences` - Actualizar preferencias

## Estructura de Datos

### Usuario
```typescript
{
  id: string
  email: string
  name: string
  role: 'attendee' | 'organizer'
  organizerId?: string (solo organizadores)
}
```

### Evento
```typescript
{
  id: string
  name: string
  description: string
  category: 'concert' | 'conference' | 'sports' | 'theater'
  date: string
  time: string
  venueId: string
  capacity: number
  organizerId: string
  imageUrl: string
  ticketTypes: TicketType[]
  soldTickets: number
}
```

### Compra
```typescript
{
  id: string
  userId: string
  eventId: string
  ticketType: string
  quantity: number
  totalAmount: number
  purchaseDate: string
  status: 'confirmed' | 'cancelled' | 'refunded'
  paymentMethod: string
}
```

## Flujos de Usuario

### Flujo de Asistente
1. Registrarse como asistente
2. Explorar eventos disponibles
3. Ver detalles del evento
4. Agregar entradas al carrito
5. Proceder al checkout
6. Completar la compra
7. Ver entradas en perfil

### Flujo de Organizador
1. Registrarse como organizador
2. Acceder al panel de organizador
3. Crear nuevo evento
4. Configurar tipos de entradas
5. Ver estadísticas de ventas
6. Editar/eliminar eventos según necesidad

## Seguridad

-  Autenticación basada en tokens JWT
-  Validación de roles en el backend
-  Protección de rutas sensibles
-  Encriptación de contraseñas (Supabase)
-  CORS configurado correctamente

## Nota Importante sobre Pagos

El procesamiento de pagos en esta aplicación es **simulado** con fines de demostración. Para un entorno de producción, deberías integrar:

## Notificaciones (Simuladas)

La aplicación simula el envío de notificaciones. Para implementar notificaciones reales:

1. Configura un servicio de email (SendGrid, Resend, etc.)
2. Usa Supabase Edge Functions para enviar emails
3. Implementa webhooks para eventos en tiempo real

## Tecnologías Utilizadas

### Frontend
- React + TypeScript
- Tailwind CSS
- Recharts (gráficos)
- Lucide React (iconos)

### Backend
- Deno
- Hono (framework web)
- Supabase (Auth + KV Store)


## Responsive Design

La aplicación está completamente optimizada para:
- Móviles
- Tablets
- Desktop

## Debugging

Si encuentras errores:
1. Abre la consola del navegador (F12)
2. Revisa los logs del servidor en el dashboard de Supabase
3. Verifica que los datos se inicializaron correctamente

## Soporte

Para preguntas o problemas, revisa:
- Los logs de la consola del navegador
- Los logs del Edge Function en Supabase
- La documentación de Supabase: https://supabase.com/docs
