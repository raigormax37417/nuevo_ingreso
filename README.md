# NuevoIngreso

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.2.

# Librerias utilizadas
Bootstrap 5
Firebase
SweetAlert2 

# Instalacion
npm install 
 
# Datos adicionales
Para la conexión de firebase no es necesario permisos adicionales.

# Descripción
Para el registro de alumnos de nuevo ingreso se implementa este pequeño formulario donde se colocan los datos necesarios para completarlo, esta información es envíada a Cloud Firestore, en donde se compara el correo electrónico para evitar que se registre con el mismo.

# email de confirmación
Al completar el registro se le enviará un email en su bandeja de spam donde se le indicará que verifique que le pertenece ese correo electrónico que ingreso.
