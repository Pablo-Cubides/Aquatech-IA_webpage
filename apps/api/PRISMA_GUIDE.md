# API - Scripts de Prisma

## 🎯 Problema Resuelto

Prisma tenía problemas parseando el archivo `.env` debido a caracteres especiales en la contraseña. Ahora usamos `cross-env` para establecer las variables de entorno directamente en los scripts.

## 📝 Scripts Disponibles

### Prisma Database

```bash
# Sincronizar schema con la base de datos (desarrollo)
pnpm prisma:push
# o
pnpm db:push

# Crear y aplicar migraciones (producción)
pnpm prisma:migrate

# Abrir Prisma Studio (interfaz visual para DB)
pnpm prisma:studio
# o
pnpm db:studio

# Generar Prisma Client (se ejecuta automáticamente en postinstall)
pnpm prisma:generate

# Formatear schema.prisma
pnpm prisma:format
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev

# Build para producción
pnpm build

# Iniciar servidor de producción
pnpm start

# Linting
pnpm lint

# Type checking
pnpm typecheck
```

## 🔧 Configuración

Las variables de entorno están en:

- `.env` - Variables de desarrollo local
- `.env.local` - Variables sensibles (no commitear)

### Variables Críticas

```env
DATABASE_URL=postgresql://user:password@host:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://user:password@host:5432/postgres
```

- **DATABASE_URL**: Usado para conexiones de la aplicación (pooler - puerto 6543)
- **DIRECT_URL**: Usado por Prisma para migraciones (directo - puerto 5432)

## 🚨 Notas Importantes

1. Los scripts `prisma:push` y `prisma:migrate` establecen las variables de entorno automáticamente
2. No necesitas ejecutar comandos de Prisma manualmente con variables de entorno
3. El `postinstall` regenera el Prisma Client automáticamente al instalar dependencias
4. Usa `db:push` en desarrollo, `prisma:migrate` en producción

## 📚 Más Información

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
