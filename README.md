# HelloWorld — Proyecto Cordova Android

Aplicación web empaquetada como APK nativa de Android usando **Apache Cordova**.

| Campo | Valor |
|---|---|
| **Nombre** | HelloWorld |
| **Package ID** | `com.example.hello` |
| **Versión** | 1.0.0 |
| **Plataforma** | Android |
| **Framework** | Cordova (`cordova-android` 14.0.1) |
| **Página de inicio** | `www/survey.html` |
| **Licencia** | MIT |

---

## Requisitos previos

| Herramienta | Versión requerida |
|---|---|
| **Node.js** | 18+ (recomendado LTS) |
| **npm** | Incluido con Node.js |
| **Java JDK** | 11 |
| **Android SDK** | API Level 35 (compileSdk), mínimo API 24 |
| **Android Build Tools** | 35.0.0 |
| **Gradle** | 8.13 (se descarga automáticamente vía wrapper) |
| **Cordova CLI** | 12+ (compatible con cordova-android 14) |

---

## Configuración del entorno

```bash
# 1. Instalar Cordova CLI globalmente
npm install -g cordova

# 2. Configurar variables de entorno
export ANDROID_HOME=/ruta/al/Android/sdk
export JAVA_HOME=/ruta/al/jdk-11
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

---

## Instalar dependencias

```bash
npm install
```

---

## Compilar la APK

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

---

## Ubicación de la APK generada

| Tipo | Ruta |
|---|---|
| **Debug** | `platforms/android/app/build/outputs/apk/debug/app-debug.apk` |
| **Release** | `platforms/android/app/build/outputs/apk/release/app-release.apk` |

---

## Firma de la APK de Release

Para generar una APK de release firmada necesitas un keystore:

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

## Estructura del proyecto

```
android-test/
├── config.xml                  # Configuración principal de Cordova
├── package.json                # Dependencias npm/Cordova
├── www/                        # Código fuente web (HTML/CSS/JS)
│   ├── survey.html             # Página de inicio (definida en config.xml)
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── gym.html
│   ├── spotify.html
│   ├── grammar/                # Módulos de gramática
│   ├── *.js                    # Scripts
│   └── *.css                   # Estilos
├── res/                        # Recursos nativos (network_security_config)
├── plugins/                    # Plugins de Cordova
│   └── cordova-plugin-whitelist
└── platforms/android/          # Plataforma Android generada
    ├── build.gradle            # Configuración Gradle raíz
    ├── gradle.properties       # Propiedades JVM/AndroidX
    ├── cdv-gradle-config.json  # Configuración de versiones SDK/Gradle
    ├── app/build.gradle        # Configuración de la app Android
    └── CordovaLib/             # Librería Cordova nativa
```

---

## Configuración técnica (cdv-gradle-config.json)

| Parámetro | Valor |
|---|---|
| **minSdkVersion** | 24 (Android 7.0 Nougat) |
| **targetSdkVersion** | 35 (Android 15) |
| **AGP** | 8.7.3 |
| **Gradle** | 8.13 |
| **Java compatibility** | 11 |
| **Kotlin** | Deshabilitado |
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

# Limpiar builds anteriores
cordova clean android

# Limpiar con Gradle
cd platforms/android && ./gradlew clean

# Ejecutar en dispositivo/emulador conectado
cordova run android

# Ejecutar en emulador
cordova emulate android
```

---

## Notas

- El proyecto tiene configurado acceso abierto a recursos externos (`<access origin="*" />`). Para producción, se recomienda restringir estos permisos en `config.xml`.
- La configuración de seguridad de red se aplica mediante `res/android/network_security_config.xml`.
