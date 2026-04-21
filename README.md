# Fitness Tools 💪 — Proyecto Cordova Android & iOS

Aplicación web de cálculo y seguimiento físico empaquetada como app nativa para **Android** e **iOS** usando **Apache Cordova**.

| Campo | Valor |
|---|---|
| **Nombre** | HelloWorld (Fitness Tools) |
| **Package ID** | `com.example.hello` |
| **Versión** | 1.0.0 |
| **Plataformas** | Android, iOS |
| **Framework** | Cordova (`cordova-android` 14.0.1 · `cordova-ios` 7.1.1) |
| **Página de inicio** | `www/index.html` |
| **Licencia** | MIT |

---

## Descripción de la aplicación

**Fitness Tools** es una calculadora de composición corporal multilingüe (ES, EN, IT, FR, DE, PT, NL, PL, RU, ZH, JA) que ofrece:

- Cálculo de TMB (Harris-Benedict, Mifflin-St Jeor, Katch-McArdle)
- Cálculo de TDEE según nivel de actividad
- % de grasa corporal (US Navy, YMCA, BMI)
- IMC e interpretación por categoría
- Macronutrientes según objetivo (volumen, definición, mantenimiento)
- Gráficas interactivas (Chart.js)
- Generación de informes en PDF imprimibles

---

## Requisitos previos

### Android

| Herramienta | Versión requerida |
|---|---|
| **Node.js** | 18+ (recomendado LTS) |
| **npm** | Incluido con Node.js |
| **Java JDK** | 11 |
| **Android SDK** | API Level 35 (compileSdk), mínimo API 24 |
| **Android Build Tools** | 35.0.0 |
| **Gradle** | 8.13 (se descarga automáticamente vía wrapper) |
| **Cordova CLI** | 12+ (compatible con cordova-android 14) |

### iOS *(requiere macOS)*

| Herramienta | Versión requerida |
|---|---|
| **macOS** | 13 Ventura o superior |
| **Xcode** | 15+ |
| **CocoaPods** | 1.12+ |
| **Node.js** | 18+ (recomendado LTS) |
| **Cordova CLI** | 12+ (compatible con cordova-ios 7) |

---

## Configuración del entorno

### Android

```bash
# 1. Instalar Cordova CLI globalmente
npm install -g cordova

# 2. Configurar variables de entorno
export ANDROID_HOME=/ruta/al/Android/sdk
export JAVA_HOME=/ruta/al/jdk-11
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### iOS

```bash
# 1. Instalar Cordova CLI globalmente
npm install -g cordova

# 2. Instalar CocoaPods (si no está disponible)
sudo gem install cocoapods
```

---

## Instalar dependencias

```bash
npm install
```

---

## Añadir plataformas

```bash
# Android (ya incluida en el repositorio)
cordova platform add android

# iOS (requiere macOS)
cordova platform add ios
```

---

## Compilar para Android

### Opción A — Usando Cordova CLI (recomendado)

```bash
# APK de debug
cordova build android

# APK de debug (explícito)
cordova build android --debug

# APK de release (requiere firma, ver más abajo)
cordova build android --release
```

### Opción B — Usando Gradle directamente

```bash
cd platforms/android

# APK de debug
./gradlew assembleDebug

# APK de release
./gradlew assembleRelease
```

### Ubicación de la APK generada

| Tipo | Ruta |
|---|---|
| **Debug** | `platforms/android/app/build/outputs/apk/debug/app-debug.apk` |
| **Release** | `platforms/android/app/build/outputs/apk/release/app-release.apk` |

### Firma de la APK de Release

```bash
# 1. Generar un keystore (solo una vez)
keytool -genkey -v -keystore mi-clave.keystore -alias mi-alias \
  -keyalg RSA -keysize 2048 -validity 10000

# 2. Crear el archivo de propiedades de firma
cat > platforms/android/release-signing.properties << EOF
storeFile=../../mi-clave.keystore
storePassword=tu_contraseña_store
key.alias=mi-alias
key.alias.password=tu_contraseña_key
EOF

# 3. Compilar la release firmada
cordova build android --release
```

> **⚠️ Importante:** No subas el keystore ni las contraseñas al repositorio. Añádelos al `.gitignore`.

---

## Compilar para iOS *(requiere macOS)*

### Opción A — Usando Cordova CLI (recomendado)

```bash
# Build de debug
cordova build ios

# Build de release
cordova build ios --release
```

### Opción B — Desde Xcode

```bash
# Abrir el proyecto en Xcode
open platforms/ios/HelloWorld.xcworkspace
```

Desde Xcode: **Product → Archive** para generar el `.ipa` de distribución.

### Ubicación del artefacto generado

| Tipo | Ruta |
|---|---|
| **Debug (.app)** | `platforms/ios/build/emulator/HelloWorld.app` |
| **Release (.ipa)** | generado vía Xcode Organizer o `cordova build ios --release` |

### Firma y certificados iOS

Para distribuir en App Store o TestFlight necesitas:

1. Una cuenta de **Apple Developer** activa
2. Un **Provisioning Profile** (desarrollo o distribución)
3. Un **certificado de distribución** instalado en el Llavero de macOS
4. Configurar `build.json` en la raíz del proyecto:

```json
{
  "ios": {
    "release": {
      "codeSignIdentity": "iPhone Distribution",
      "developmentTeam": "TU_TEAM_ID",
      "packageType": "app-store",
      "provisioningProfile": "UUID_DEL_PERFIL"
    }
  }
}
```

> **⚠️ Importante:** No subas `build.json` con credenciales reales al repositorio.

---

## Estructura del proyecto

```
android-test/
├── config.xml                  # Configuración principal de Cordova
├── package.json                # Dependencias npm/Cordova
├── www/                        # Código fuente web (HTML/CSS/JS)
│   └── index.html              # Página única — Fitness Tools (SPA)
├── res/                        # Recursos nativos
│   └── android/
│       └── network_security_config.xml
├── plugins/                    # Plugins de Cordova
│   └── cordova-plugin-whitelist
└── platforms/
    ├── android/                # Plataforma Android generada
    │   ├── build.gradle        # Configuración Gradle raíz
    │   ├── gradle.properties   # Propiedades JVM/AndroidX
    │   ├── cdv-gradle-config.json
    │   ├── app/build.gradle    # Configuración de la app Android
    │   └── CordovaLib/         # Librería Cordova nativa
    └── ios/                    # Plataforma iOS (generada al añadir)
        ├── HelloWorld.xcworkspace
        ├── HelloWorld/
        └── Podfile
```

---

## Configuración técnica Android (cdv-gradle-config.json)

| Parámetro | Valor |
|---|---|
| **minSdkVersion** | 24 (Android 7.0 Nougat) |
| **targetSdkVersion** | 35 (Android 15) |
| **compileSdkVersion** | 35 |
| **AGP** | 8.7.3 |
| **Gradle** | 8.13 |
| **Java compatibility** | 11 |
| **Kotlin** | 1.9.24 (soporte disponible, deshabilitado por defecto) |
| **AndroidX AppCompat** | 1.7.0 |
| **AndroidX WebKit** | 1.12.1 |
| **Google Services** | Deshabilitado |

---

## Plugins instalados

| Plugin | Versión | Descripción |
|---|---|---|
| `cordova-plugin-whitelist` | 1.3.5 | Control de acceso a URLs, intents y navegación |

---

## Comandos útiles

```bash
# Verificar que el entorno está correctamente configurado
cordova requirements android
cordova requirements ios          # solo en macOS

# Limpiar builds anteriores
cordova clean android
cordova clean ios

# Limpiar con Gradle (Android)
cd platforms/android && ./gradlew clean

# Ejecutar en dispositivo/emulador Android conectado
cordova run android

# Ejecutar en simulador iOS (solo macOS)
cordova emulate ios

# Ejecutar en dispositivo iOS (solo macOS)
cordova run ios
```

---

## Notas

- El proyecto tiene configurado acceso abierto a recursos externos (`<access origin="*" />`). Para producción, se recomienda restringir estos permisos en `config.xml`.
- La configuración de seguridad de red de Android se aplica mediante `res/android/network_security_config.xml`.
- La compilación para iOS **solo es posible en macOS** con Xcode instalado. En entornos Linux/Windows se puede desarrollar y probar en navegador, pero el artefacto nativo debe generarse en un Mac.
- Para publicar en Google Play o App Store es obligatorio firmar los artefactos con las claves/certificados correspondientes.
