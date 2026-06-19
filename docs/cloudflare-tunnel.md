# Compartir el sitio local con Cloudflare Tunnel

Esta guía explica cómo exponer el proyecto **Complejo Educativo Dr. Cristóbal Mendoza** en internet de forma temporal, usando [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) (`cloudflared`).

Es útil para mostrar el sitio a otra persona mientras desarrollas en tu máquina, sin necesidad de desplegar en Vercel.

---

## Requisitos

- Node.js y **pnpm** instalados
- Dependencias del proyecto instaladas (`pnpm install`)
- Conexión a internet

No necesitas cuenta de Cloudflare para el modo rápido (`trycloudflare.com`).

---

## Opción recomendada: un solo comando

Desde la raíz del proyecto:

```bash
pnpm share
```

Esto hace dos cosas automáticamente:

1. Levanta el servidor de desarrollo (`pnpm dev`) en `http://localhost:3000`
2. Abre un túnel público con Cloudflare

En la terminal aparecerá una URL similar a:

```text
https://nombre-aleatorio.trycloudflare.com
```

Comparte esa URL. Cualquiera con el enlace podrá ver tu sitio local.

Para detener todo, presiona `Ctrl + C` en la terminal.

---

## Opción manual: dos terminales

Si prefieres más control, usa dos terminales separadas.

### Terminal 1 — servidor local

```bash
pnpm dev
```

Espera a que Next.js indique que está listo en `http://localhost:3000`.

### Terminal 2 — túnel Cloudflare

```bash
pnpm tunnel
```

Copia la URL `https://....trycloudflare.com` que muestre la terminal.

---

## Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm share` | Levanta el dev server y el túnel juntos |
| `pnpm tunnel` | Solo abre el túnel (requiere que `pnpm dev` ya esté corriendo) |
| `pnpm tunnel:setup` | Descarga `cloudflared` manualmente (normalmente no hace falta) |

---

## Primera ejecución

La primera vez que ejecutes `pnpm tunnel` o `pnpm share`, el proyecto descargará automáticamente el binario de `cloudflared` en la carpeta `.tools/` (no requiere `sudo`).

Si ya tienes `cloudflared` instalado en el sistema (por ejemplo con `snap install cloudflared`), el script lo detectará y usará esa versión.

---

## Usar otro puerto

Por defecto el túnel apunta a `http://localhost:3000`. Si tu servidor corre en otro puerto:

```bash
TUNNEL_PORT=3001 pnpm tunnel
```

---

## Instalación global opcional (Linux)

Si prefieres instalar `cloudflared` en todo el sistema:

```bash
sudo snap install cloudflared
```

Después puedes seguir usando `pnpm tunnel` con normalidad.

---

## Limitaciones importantes

- **La URL cambia** cada vez que reinicias el túnel (modo gratuito).
- **Tu PC debe estar encendida** y los comandos corriendo; si cierras la terminal, el enlace deja de funcionar.
- Es para **demos y pruebas**, no para producción.
- Para un sitio permanente, usa el deploy en **Vercel**.

---

## Solución de problemas

### No aparece la URL pública

- Verifica que `pnpm dev` esté corriendo y responda en `http://localhost:3000`.
- Espera unos segundos tras iniciar el túnel.
- Revisa que no haya otro proceso usando el puerto 3000.

### Error al descargar cloudflared

Ejecuta la instalación manual:

```bash
pnpm tunnel:setup
```

Si falla, instala con snap:

```bash
sudo snap install cloudflared
```

### El sitio carga incompleto o errores `Unauthorized` / `webpack-hmr`

Si en la consola de `cloudflared` ves algo como:

```text
ERR Unable to reach the origin service ... malformed HTTP response "Unauthorized"
dest=https://....trycloudflare.com/_next/webpack-hmr
```

**Qué pasa:** Next.js en modo desarrollo bloquea por seguridad las peticiones que no vienen de `localhost`. Al entrar por el túnel (`trycloudflare.com`), rechaza recursos internos (HMR, fuentes, assets) y el sitio se ve roto o sin estilos.

**Solución:** el proyecto ya incluye en `next.config.ts`:

```ts
allowedDevOrigins: ["*.trycloudflare.com"],
```

Después de cualquier cambio en esa config:

1. Detén el servidor (`Ctrl + C`)
2. Vuelve a levantar: `pnpm share` (o `pnpm dev` + `pnpm tunnel`)

**Alternativa para demos estables** (sin HMR, más parecido a producción):

```bash
pnpm build
pnpm start        # terminal 1 — corre en :3000
pnpm tunnel       # terminal 2
```

### Aviso `ping_group_range` en cloudflared

Mensaje amarillo sobre `GID` y `ping_group_range`. Es un aviso del sistema Linux y **no impide** que el túnel funcione; puedes ignorarlo.

### El sitio carga pero sin estilos o con errores (general)

- Asegúrate de estar usando la URL del túnel (`trycloudflare.com`), no `localhost`.
- Reinicia con `Ctrl + C` y vuelve a ejecutar `pnpm share`.

### Variables de entorno

El túnel sirve tu entorno local. Si login o Supabase no funcionan, revisa que `.env.local` tenga las variables correctas (ver `.env.example`).

---

## Referencia rápida

```bash
# Todo en uno (recomendado)
pnpm share

# O por separado
pnpm dev      # terminal 1
pnpm tunnel   # terminal 2
```
