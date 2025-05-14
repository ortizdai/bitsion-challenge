# Proyecto - Sistema de Registro de Personas para Ficticia S.A.

## Enunciado del problema a resolver:

La empresa Ficticia S.A. está incursionando en la venta de seguros de vida, pero tiene una problemática en conocer a sus clientes actuales. Para esto requieren el desarrollo de un sistema donde se puedan registrar personas, incluyendo datos como:  
- Nombre completo  
- Identificación  
- Edad  
- Género  
- Estado (Activo o no)  
- Atributos adicionales  
  - ¿Maneja?  
  - ¿Usa lentes?  
  - ¿Diabético?  
  - ¿Padece alguna otra enfermedad? ¿Cuál?  
  - Pueden aparecer adicionales.  

Se espera que el diseño del sistema permita realizar alta, baja y modificación de los datos mencionados.

## Para correr el proyecto: 
```
npm run start:mysql
```

## Para correr los test:
```
npm run test
```

---

## 🔹 1. Users

Creamos endpoints para:
- Crear usuario (POST /users)  
- Actualizar usuario (PATCH /users/:id)  
- Eliminar usuario (DELETE /users/:id)  
- Listar usuarios (GET /users)  
- Obtener usuario por ID (GET /users/:id)  

Valide los datos de usuarios usando Zod.  
Use UUID binarios en MySQL para mayor eficiencia en las IDs.  
Los usuarios pueden tener múltiples atributos relacionados (relación uno a muchos).

---

## 🔹 2. Attributes

Cree endpoints para:
- Crear atributo (POST /attributes)  
- Actualizar atributo (PATCH /attributes/:id)  
- Eliminar atributo (DELETE /attributes/:id)  
- Listar atributos (GET /attributes)  

Cada atributo está vinculado a un user_id, usando la relación por UUID.  
Valide que `attribute_name` y `attribute_value` sean correctos antes de insertarlos.  

Al consultar usuarios, devolvemos sus atributos en forma de array relacionado. Ejemplo:

```json
{
  "id": "uuid",
  "full_name": "Juan Pérez",
  "attributes": [
    { "attribute_name": "fuma", "attribute_value": "no" }
  ]
}
```

---

## 🔹 3. Admins

Cree endpoints para gestionar admins:
- Crear admin (POST /admin)  
- Login admin (POST /admin/login)  
- Logout admin (POST /admin/logout)  
- Actualizar admin (PATCH /admin/:id)  
- Eliminar admin (DELETE /admin/:id)  
- Listar admins (GET /admin)  

Use bcrypt para hashear las contraseñas al crear y actualizar admins.  
Implemente autenticación usando JWT:  
- Al hacer login, se devuelve un token JWT.  
- Ese token se guarda en una cookie (`access_token`) para manejar la sesión.

---

## 🔹 4. Seguridad

Creamos un middleware `authenticateAdmin` para proteger las rutas.  
- Verifica la cookie `access_token`.  
- Si el token es válido, se guarda la sesión en `req.session.admin`.  
- Las rutas sensibles (como obtener admins o usuarios) ahora requieren que el admin esté autenticado.

---

## 🔹 5. Validación

Use Zod en todos los controllers para validar:
- Admins (`username`, `email`, `full_name`, `password`)  
- Users (`full_name`, `identification`, `age`, `gender`, `state`)  
- Attributes (`user_id`, `attribute_name`, `attribute_value`)

---

## 🔹 6. Sesiones y Cookies

Implemente JWT + Cookies para la sesión:
- Token con expiración (ejemplo: 7 días `expiresIn: '7d'`).  
- Usamos `cookie-parser` para leer las cookies en los requests.  
- Hicimos logout limpiando la cookie con `res.clearCookie('access_token')`.

---

## 🔹 7. Configuración

Use `dotenv` para manejar la clave secreta del JWT y otras configuraciones en el archivo `.env`.  
La clave se accede con `process.env.JWT_SECRET`.

---

Para el desafío, la información necesaria para conectarse a database se encuentra en el archivo `.env`, por lo que no es necesario realizar ninguna acción. En un entorno real, este archivo no solo no se cargaría, sino que tendríamos que satisfacer esta necesidad con un servicio de secretos como Google o AWS Secrets Manager.
