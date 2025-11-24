# Instrucciones de Instalación

Si encuentras problemas con `npm install`, prueba estos métodos en orden:

## Método 1: Instalación Normal (Recomendado)
```bash
npm install
```

## Método 2: Con Legacy Peer Deps
Si el método 1 falla, usa:
```bash
npm install --legacy-peer-deps
```

## Método 3: Limpiar e Instalar
Si persisten problemas:
```bash
# Eliminar node_modules y package-lock.json si existen
rm -rf node_modules package-lock.json

# En Windows PowerShell:
Remove-Item -Recurse -Force node_modules, package-lock.json -ErrorAction SilentlyContinue

# Limpiar caché
npm cache clean --force

# Instalar de nuevo
npm install --legacy-peer-deps
```

## Notas
- Las versiones actualizadas deberían ser compatibles con React 19
- `--legacy-peer-deps` ignora conflictos menores de peer dependencies
- Si usas `--legacy-peer-deps`, el proyecto debería funcionar correctamente

