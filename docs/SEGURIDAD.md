# 🔒 Guía de Seguridad y Actualización de Dependencias

Esta guía explica cómo mantener el proyecto seguro y actualizado.

## 🚨 Verificación de Seguridad

### Comandos Disponibles

```bash
# Verificar vulnerabilidades (nivel moderado o superior)
npm run security:check

# Intentar resolver vulnerabilidades automáticamente
npm run security:fix

# Forzar resolución (puede romper compatibilidad)
npm run security:fix-force

# Ver dependencias desactualizadas
npm run deps:check

# Actualizar dependencias a versiones permitidas
npm run deps:update

# Auditoría completa (vulnerabilidades + desactualizaciones)
npm run deps:audit
```

## 📅 Proceso Recomendado

### Semanal
1. Ejecutar `npm run security:check`
2. Si hay vulnerabilidades, ejecutar `npm run security:fix`
3. Revisar cambios y probar la aplicación
4. Hacer commit y push

### Mensual
1. Ejecutar `npm run deps:check` para ver actualizaciones disponibles
2. Revisar changelogs de dependencias importantes (React, Next.js, etc.)
3. Actualizar manualmente si es necesario
4. Ejecutar tests completos después de actualizar

### Cuando Vercel/Herramientas Alertan
1. **Inmediatamente** ejecutar `npm run security:check`
2. Si hay vulnerabilidades críticas, resolverlas de inmediato
3. Hacer deploy urgente si es necesario

## 🤖 Automatización

### Dependabot (GitHub)

Si el proyecto está en GitHub, Dependabot está configurado para:
- ✅ Crear PRs automáticamente cada semana
- ✅ Agrupar actualizaciones relacionadas
- ✅ Actualizar solo parches y menores automáticamente
- ✅ Requerir revisión manual para actualizaciones mayores

**Configuración**: `.github/dependabot.yml`

### GitHub Actions

Un workflow de seguridad se ejecuta:
- ✅ Diariamente a las 6 AM UTC
- ✅ En cada push a ramas principales
- ✅ En cada pull request

**Configuración**: `.github/workflows/security-audit.yml`

## 🔍 Niveles de Severidad

- **Crítica**: Resolver inmediatamente (ej: React2Shell)
- **Alta**: Resolver en 24-48 horas
- **Moderada**: Resolver en la próxima semana
- **Baja**: Resolver cuando sea conveniente

## ⚠️ Actualizaciones Mayores

Las actualizaciones mayores (ej: React 19 → 20) requieren:
1. Revisar changelog completo
2. Verificar breaking changes
3. Actualizar código si es necesario
4. Ejecutar todos los tests
5. Probar manualmente la aplicación

## 📝 Checklist de Actualización

Antes de hacer commit de actualizaciones:

- [ ] Ejecutar `npm run security:check` - sin vulnerabilidades críticas
- [ ] Ejecutar `npm run test:unit` - todos los tests pasan
- [ ] Ejecutar `npm run test:e2e` - tests E2E pasan
- [ ] Probar la aplicación manualmente
- [ ] Verificar que el build funciona: `npm run build`
- [ ] Revisar cambios en `package-lock.json`

## 🆘 Resolución de Problemas

### Error: "npm audit fix no resuelve la vulnerabilidad"
1. Verificar si hay una versión parcheada disponible
2. Actualizar manualmente la dependencia afectada
3. Si no hay parche, considerar alternativas

### Error: "Actualización rompe la aplicación"
1. Revisar el changelog de la dependencia
2. Verificar breaking changes
3. Revertir el cambio: `git checkout package.json package-lock.json`
4. Reportar el issue a los mantenedores

### Vercel bloquea el deploy
1. Resolver todas las vulnerabilidades críticas
2. Hacer commit y push
3. Vercel detectará automáticamente los cambios

## 📚 Recursos

- [npm audit documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Dependabot documentation](https://docs.github.com/en/code-security/dependabot)
- [React Security Advisories](https://github.com/facebook/react/security)
- [Next.js Releases](https://github.com/vercel/next.js/releases)

## 🔔 Alertas

Configura alertas para:
- ⚠️ Vulnerabilidades críticas en GitHub
- 📧 Notificaciones de Dependabot
- 🔴 Fallos en el workflow de seguridad

---

**Última actualización**: Enero 2025
**Mantenido por**: Equipo de desarrollo

