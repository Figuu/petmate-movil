# PetMate - Adopción de Mascotas al Estilo Tinder

## Descripción

**PetMate** es una aplicación desarrollada en Expo y Firebase que facilita la adopción de mascotas mediante un sistema similar a Tinder. Los usuarios pueden registrarse como **Adopters** (adoptantes) o **Owners** (dueños de mascotas) y utilizar el sistema de swipes para dar "Like" o "Pass" a las mascotas publicadas. Cuando un **Owner** le da "Like" a un perfil de **Adopter** que previamente dio "Like" a una de sus mascotas, se produce un **match** y se abre un chat para coordinar la adopción.

## Características

- **Registro de Usuarios**: Los usuarios pueden registrarse como **Adopter** o **Owner**.
- **Perfil de Mascota**: Los **Owners** pueden publicar perfiles de sus mascotas.
- **Sistema de Swipes**: Los **Adopters** pueden dar "Like" o "Pass" a las mascotas.
- **Match**: Si un **Owner** da "Like" a un perfil de **Adopter** que previamente dio "Like" a una de sus mascotas, se produce un match.
- **Chat**: Cuando se produce un match, se abre un chat entre el **Owner** y el **Adopter** para coordinar la adopción.

## Tecnologías Utilizadas

- **Expo**: Para el desarrollo de la aplicación móvil.
- **Firebase**: Para la autenticación, almacenamiento de datos y servicio de chat en tiempo real.

## Instalación

1. **Clonar el repositorio**
    ```bash
    git clone https://github.com/Figuu/petmate-movil.git
    cd petmate-movil
    ```

2. **Instalar dependencias**
    ```bash
    npm install
    ```

3. **Configurar Firebase**
    - Crear un proyecto en Firebase.
    - Configurar la autenticación en Firebase.
    - Configurar Firestore para el almacenamiento de datos.
    - Configurar Firebase Storage si se necesitan almacenar imágenes.
    - Agregar el archivo `google-services.json` (para Android) y/o `GoogleService-Info.plist` (para iOS) en los directorios correspondientes.

4. **Iniciar la aplicación**
    ```bash
    expo start
    ```

## Uso

1. **Registro e Inicio de Sesión**
    - Los usuarios pueden registrarse como **Adopter** o **Owner**.
    - Iniciar sesión con las credenciales registradas.

2. **Publicación de Mascotas (para Owners)**
    - Los **Owners** pueden crear perfiles de mascotas, subiendo fotos y completando información relevante.

3. **Explorar Mascotas (para Adopters)**
    - Los **Adopters** pueden explorar mascotas y realizar swipes.
    - Dar "Like" a las mascotas que le interesen o "Pass" a las que no.

4. **Match y Chat**
    - Cuando un **Owner** da "Like" a un perfil de **Adopter** que previamente dio "Like" a una de sus mascotas, se produce un match.
    - Se abre un chat para que el **Owner** y el **Adopter** puedan coordinar la adopción.

## Estructura del Proyecto

```plaintext
/
├── assets                  # Imágenes y recursos estáticos
├── components              # Componentes reutilizables
├── config                  # Configuraciones de Firebase y otros servicios
├── navigation              # Configuración de navegación
├── screens                 # Pantallas principales de la aplicación
├── services                # Servicios (API, Firebase, etc.)
├── App.js                  # Entrada principal de la aplicación
├── app.json                # Configuración de Expo
├── package.json            # Dependencias y scripts
└── README.md               # Documentación

##Contribuciones
¡Las contribuciones son bienvenidas! Por favor, abre un issue o un pull request para discutir los cambios que te gustaría realizar.

##Licencia
Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

##Contacto
Para cualquier consulta o sugerencia, puedes contactarme a través de [email](david.calvi.18@gmail.com)

