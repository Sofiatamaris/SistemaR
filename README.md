Descripción general

Este sistema es una aplicación web diseñada para gestionar de manera eficiente y automatizada sistemas de riego. 
Su interfaz intuitiva permite a los usuarios registrarse, iniciar sesión y gestionar sus estaciones de riego de forma remota.
La plataforma aprovecha la potencia de Supabase como backend para el almacenamiento de datos, autenticación de usuarios y funciones en tiempo real, 
mientras que React se utiliza para crear una interfaz de usuario dinámica y responsiva.

Guía de Configuración y Ejecución del Sistema de Riego Inteligente
Requisitos previos:
Node.js y npm (o yarn) instalados: Asegúrate de tener las últimas versiones instaladas en tu sistema.
Cuenta en Supabase: Crea una cuenta gratuita en Supabase y activa el módulo de User Management.

Pasos:
1-Clonar el repositorio

2-Instala las dependencias del proyecto:npm install

3-Configurar Supabase:

Crear una nueva proyecto en Supabase: Si aún no lo has hecho, crea un nuevo proyecto en tu cuenta de Supabase.
Obtener las credenciales: En la configuración de tu proyecto, encontrarás tu URL de Supabase y la clave anónima (anon key).
Crear un archivo .env: En la raíz de tu proyecto, crea un archivo llamado .env.local
Agregar las credenciales: En el archivo .env, agrega las siguientes líneas, reemplazando los placeholders con tus credenciales:
REACT_APP_SUPABASE_URL=https://tu-proyecto.supabase.co
REACT_APP_SUPABASE_ANON_KEY=tu-clave-anonima

4-Iniciar el desarrollo:

Ejecuta la siguiente línea de comando para iniciar el servidor de desarrollo: npm start
Abre tu navegador y ve a la dirección indicada en la terminal (por ejemplo, http://localhost:3000).

Consideraciones adicionales:
Base de datos: Asegúrate de que la estructura de la base de datos en Supabase coincida con la definida en el proyecto.
Personalización: Adapta la aplicación a tus necesidades específicas, modificando el código y las configuraciones según sea necesario.
Funciones: Explora las funciones de Supabase para realizar tareas más complejas, como enviar notificaciones o integrar con otros servicios.
Seguridad: Protege tus credenciales de Supabase y sigue las mejores prácticas de seguridad para evitar accesos no autorizados.
