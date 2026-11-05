
<template>
  <div class="contenedor">
    <header>
      <div class="franja-tricolor">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="encabezado-contenido">
        <span class="etiqueta">CULTURA • IDENTIDAD • TRADICIÓN</span>
        <h1>Agenda Cultural</h1>
        <p>Sistema de gestión de recintos y eventos culturales</p>
      </div>
      <div class="decoracion">✦</div>
    </header>

    <nav>
      <button @click="seccion = 'recintos'" :class="{ activo: seccion === 'recintos' }">
        <span>▦</span> Recintos
      </button>
      <button @click="seccion = 'eventos'" :class="{ activo: seccion === 'eventos' }">
        <span>♫</span> Eventos culturales
      </button>
    </nav>

    <main>
      <section v-if="seccion === 'recintos'">
        <div class="titulo-seccion">
          <div>
            <span class="subtitulo">ADMINISTRACIÓN</span>
            <h2>Gestión de recintos</h2>
            <p>Registra y administra los espacios culturales.</p>
          </div>
          <span class="icono-seccion">▦</span>
        </div>

        <form @submit.prevent="guardarRecinto">
          <input v-model="recinto.nombre" placeholder="Nombre del recinto" required />
          <input v-model="recinto.ciudad" placeholder="Ciudad" required />
          <input v-model.number="recinto.aforo_maximo" type="number" placeholder="Aforo máximo" />
          <button class="btn-principal" type="submit">
            {{ recinto.id ? 'Actualizar recinto' : '+ Registrar recinto' }}
          </button>
          <button v-if="recinto.id" class="btn-cancelar" type="button" @click="limpiarRecinto">
            Cancelar
          </button>
        </form>

        <p v-if="mensajeRecinto" class="mensaje">{{ mensajeRecinto }}</p>

        <div class="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Ciudad</th>
                <th>Aforo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in recintos" :key="r.id">
                <td><span class="identificador">#{{ r.id }}</span></td>
                <td class="dato-principal">{{ r.nombre }}</td>
                <td>{{ r.ciudad }}</td>
                <td>{{ r.aforo_maximo ?? '-' }}</td>
                <td class="acciones">
                  <button class="editar" @click="editarRecinto(r)">Editar</button>
                  <button class="eliminar" @click="eliminarRecinto(r.id)">Eliminar</button>
                </td>
              </tr>
              <tr v-if="recintos.length === 0">
                <td colspan="5" class="sin-datos">No hay recintos registrados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-if="seccion === 'eventos'">
        <div class="titulo-seccion">
          <div>
            <span class="subtitulo">PROGRAMACIÓN CULTURAL</span>
            <h2>Gestión de eventos culturales</h2>
            <p>Organiza y administra las actividades culturales.</p>
          </div>
          <span class="icono-seccion">♫</span>
        </div>

        <form @submit.prevent="guardarEvento">
          <input v-model="evento.titulo" placeholder="Título del evento" required />
          <input v-model="evento.artista_principal" placeholder="Artista principal" required />

          <select v-model.number="evento.id_recinto" required>
            <option value="" disabled>Seleccione un recinto</option>
            <option v-for="r in recintos" :key="r.id" :value="r.id">
              {{ r.nombre }}
            </option>
          </select>

          <input v-model.number="evento.duracion_minutos" type="number" placeholder="Duración en minutos" required />
          <input v-model.number="evento.precio_entrada" type="number" step="0.01" placeholder="Precio de entrada" required />
          <input v-model="evento.fecha_evento" type="date" required />

          <select v-model="evento.estado">
            <option>Programado</option>
            <option>Agotado</option>
            <option>Cancelado</option>
          </select>

          <button class="btn-principal" type="submit">
            {{ evento.id ? 'Actualizar evento' : '+ Registrar evento' }}
          </button>
          <button v-if="evento.id" class="btn-cancelar" type="button" @click="limpiarEvento">
            Cancelar
          </button>
        </form>

        <p v-if="mensajeEvento" class="mensaje">{{ mensajeEvento }}</p>

        <div class="tabla-contenedor">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Evento</th>
                <th>Artista</th>
                <th>Recinto</th>
                <th>Fecha</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in eventos" :key="e.id">
                <td><span class="identificador">#{{ e.id }}</span></td>
                <td class="dato-principal">{{ e.titulo }}</td>
                <td>{{ e.artista_principal }}</td>
                <td>{{ e.recinto?.nombre || '-' }}</td>
                <td>{{ e.fecha_evento?.substring(0, 10) }}</td>
                <td>{{ e.precio_entrada }}</td>
                <td>
                  <span class="estado" :class="e.estado.toLowerCase()">
                    {{ e.estado }}
                  </span>
                </td>
                <td class="acciones">
                  <button class="editar" @click="editarEvento(e)">Editar</button>
                  <button class="eliminar" @click="eliminarEvento(e.id)">Eliminar</button>
                </td>
              </tr>
              <tr v-if="eventos.length === 0">
                <td colspan="8" class="sin-datos">No hay eventos registrados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <footer>
      <div class="footer-tricolor">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p>Agenda Cultural | Promoviendo la cultura y las tradiciones de Bolivia</p>
      <small>Sistema de gestión de recintos y eventos culturales</small>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API = 'http://localhost:3000'

const seccion = ref('recintos')
const recintos = ref([])
const eventos = ref([])
const mensajeRecinto = ref('')
const mensajeEvento = ref('')

const recintoVacio = () => ({
  id: null,
  nombre: '',
  ciudad: 'Sucre',
  aforo_maximo: null
})

const eventoVacio = () => ({
  id: null,
  id_recinto: '',
  titulo: '',
  artista_principal: '',
  duracion_minutos: null,
  precio_entrada: null,
  fecha_evento: '',
  estado: 'Programado'
})

const recinto = ref(recintoVacio())
const evento = ref(eventoVacio())

async function obtenerError(respuesta) {
  const detalle = await respuesta.text()
  return `Error ${respuesta.status}: ${detalle || respuesta.statusText}`
}

async function cargarRecintos() {
  try {
    const respuesta = await fetch(`${API}/recintos`)

    if (!respuesta.ok) {
      throw new Error(await obtenerError(respuesta))
    }

    recintos.value = await respuesta.json()
  } catch (error) {
    mensajeRecinto.value = error.message
  }
}

async function cargarEventos() {
  try {
    const respuesta = await fetch(`${API}/eventos-culturales`)

    if (!respuesta.ok) {
      throw new Error(await obtenerError(respuesta))
    }

    eventos.value = await respuesta.json()
  } catch (error) {
    mensajeEvento.value = error.message
  }
}

// REGISTRAR Y ACTUALIZAR RECINTOS
async function guardarRecinto() {
  try {
    const editar = Boolean(recinto.value.id)

    const url = editar
      ? `${API}/recintos/${recinto.value.id}`
      : `${API}/recintos`

    const datos = {
      nombre: recinto.value.nombre,
      ciudad: recinto.value.ciudad,
      aforo_maximo: recinto.value.aforo_maximo
    }

    const respuesta = await fetch(url, {
      method: editar ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    })

    if (!respuesta.ok) {
      throw new Error(await obtenerError(respuesta))
    }

    mensajeRecinto.value = editar
      ? 'Recinto actualizado correctamente'
      : 'Recinto registrado correctamente'

    limpiarRecinto()
    await cargarRecintos()

  } catch (error) {
    mensajeRecinto.value = error.message
  }
}

function editarRecinto(r) {
  recinto.value = {
    id: r.id,
    nombre: r.nombre,
    ciudad: r.ciudad,
    aforo_maximo: r.aforo_maximo
  }
}

// ELIMINAR RECINTOS
async function eliminarRecinto(id) {
  if (!confirm('¿Está seguro de eliminar este recinto?')) return

  try {
    const respuesta = await fetch(`${API}/recintos/${id}`, {
      method: 'DELETE'
    })

    if (!respuesta.ok) {
      throw new Error(await obtenerError(respuesta))
    }

    mensajeRecinto.value = 'Recinto eliminado correctamente'
    await cargarRecintos()

  } catch (error) {
    mensajeRecinto.value = error.message
  }
}

function limpiarRecinto() {
  recinto.value = recintoVacio()
}

// REGISTRAR Y ACTUALIZAR EVENTOS
async function guardarEvento() {
  try {
    const editar = Boolean(evento.value.id)

    const url = editar
      ? `${API}/eventos-culturales/${evento.value.id}`
      : `${API}/eventos-culturales`

    const datos = {
      id_recinto: evento.value.id_recinto,
      titulo: evento.value.titulo,
      artista_principal: evento.value.artista_principal,
      duracion_minutos: evento.value.duracion_minutos,
      precio_entrada: evento.value.precio_entrada,
      fecha_evento: evento.value.fecha_evento,
      estado: evento.value.estado
    }

    const respuesta = await fetch(url, {
      method: editar ? 'PATCH' : 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    })

    if (!respuesta.ok) {
      throw new Error(await obtenerError(respuesta))
    }

    mensajeEvento.value = editar
      ? 'Evento actualizado correctamente'
      : 'Evento registrado correctamente'

    limpiarEvento()
    await cargarEventos()

  } catch (error) {
    mensajeEvento.value = error.message
  }
}

function editarEvento(e) {
  evento.value = {
    id: e.id,
    id_recinto: e.recinto?.id || '',
    titulo: e.titulo,
    artista_principal: e.artista_principal,
    duracion_minutos: e.duracion_minutos,
    precio_entrada: Number(e.precio_entrada),
    fecha_evento: e.fecha_evento?.substring(0, 10),
    estado: e.estado
  }
}

// ELIMINAR EVENTOS
async function eliminarEvento(id) {
  if (!confirm('¿Está seguro de eliminar este evento?')) return

  try {
    const respuesta = await fetch(`${API}/eventos-culturales/${id}`, {
      method: 'DELETE'
    })

    if (!respuesta.ok) {
      throw new Error(await obtenerError(respuesta))
    }

    mensajeEvento.value = 'Evento eliminado correctamente'
    await cargarEventos()

  } catch (error) {
    mensajeEvento.value = error.message
  }
}

function limpiarEvento() {
  evento.value = eventoVacio()
}

onMounted(() => {
  cargarRecintos()
  cargarEventos()
})
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #f8f5ec;
  color: #34352f;
}

.contenedor {
  max-width: 1350px;
  margin: auto;
  padding: 30px 25px;
}

/* ENCABEZADO */
header {
  position: relative;
  overflow: hidden;
  background: linear-gradient(120deg, #8f1d2c, #c83236);
  color: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px #6b241c25;
}

.franja-tricolor,
.footer-tricolor {
  display: flex;
  height: 7px;
}

.franja-tricolor span,
.footer-tricolor span {
  flex: 1;
}

.franja-tricolor span:nth-child(1),
.footer-tricolor span:nth-child(1) {
  background: #d52b35;
}

.franja-tricolor span:nth-child(2),
.footer-tricolor span:nth-child(2) {
  background: #e7b82e;
}

.franja-tricolor span:nth-child(3),
.footer-tricolor span:nth-child(3) {
  background: #25834b;
}

.encabezado-contenido {
  padding: 35px 40px 38px;
}

.etiqueta {
  display: inline-block;
  color: #ffe5a0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 12px;
}

header h1 {
  margin: 0 0 10px;
  font-size: 36px;
  font-weight: 800;
}

header p {
  margin: 0;
  color: #ffe9d9;
  font-size: 15px;
}

.decoracion {
  position: absolute;
  right: 45px;
  top: 30px;
  font-size: 85px;
  color: #ffffff22;
}

/* NAVEGACIÓN */
nav {
  display: flex;
  gap: 12px;
  margin: 25px 0 20px;
  padding: 8px;
  background: #eee8d9;
  border-radius: 12px;
  width: fit-content;
}

button {
  border: none;
  padding: 11px 17px;
  border-radius: 8px;
  cursor: pointer;
  background: #25834b;
  color: white;
  font-weight: 600;
  font-size: 13px;
  transition: 0.2s ease;
}

button:hover {
  filter: brightness(0.92);
  transform: translateY(-1px);
}

nav button {
  background: transparent;
  color: #55564e;
  padding: 12px 22px;
}

nav button span {
  margin-right: 5px;
}

nav button.activo {
  background: #25834b;
  color: white;
  box-shadow: 0 3px 8px #25834b35;
}

/* CONTENIDO */
main {
  background: #fffefa;
  padding: 30px;
  border-radius: 16px;
  border: 1px solid #e9e1d0;
  box-shadow: 0 5px 18px #4a38200d;
}

.titulo-seccion {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 3px solid #e7b82e;
}

.subtitulo {
  color: #25834b;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

h2 {
  margin: 6px 0;
  color: #9f202c;
  font-size: 23px;
}

.titulo-seccion p {
  margin: 5px 0 0;
  color: #77776e;
  font-size: 13px;
}

.icono-seccion {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 55px;
  border-radius: 14px;
  background: #f9edce;
  color: #a52b35;
  font-size: 27px;
}

/* FORMULARIOS */
form {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 22px;
  padding: 20px;
  background: #f7f3e8;
  border-radius: 12px;
  border-left: 5px solid #25834b;
}

input,
select {
  padding: 12px 13px;
  border: 1px solid #d9d3c5;
  border-radius: 8px;
  flex: 1 1 190px;
  min-width: 0;
  background: white;
  color: #34352f;
  font-size: 13px;
  outline: none;
  transition: 0.2s;
}

input:focus,
select:focus {
  border-color: #25834b;
  box-shadow: 0 0 0 3px #25834b18;
}

.btn-principal {
  background: #25834b;
  color: white;
}

.btn-cancelar {
  background: #77776e;
  color: white;
}

/* MENSAJES */
.mensaje {
  color: #207444;
  font-weight: 700;
  background: #eaf5eb;
  padding: 12px 15px;
  border-radius: 8px;
  border-left: 4px solid #25834b;
  overflow-wrap: anywhere;
}

/* TABLAS */
.tabla-contenedor {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid #e5dfd1;
}

th,
td {
  border-bottom: 1px solid #eee9dd;
  padding: 14px 12px;
  text-align: left;
  font-size: 13px;
}

th {
  background: #25834b;
  color: white;
  font-weight: 700;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

tbody tr:nth-child(even) {
  background: #f8f5ec;
}

tbody tr:hover {
  background: #fff3cf;
}

tbody tr:last-child td {
  border-bottom: none;
}

.identificador {
  display: inline-block;
  background: #f9edce;
  color: #8f1d2c;
  font-weight: 800;
  padding: 5px 8px;
  border-radius: 6px;
}

.dato-principal {
  font-weight: 700;
  color: #34352f;
}

.acciones {
  white-space: nowrap;
}

.editar {
  background: #d69d19;
  color: #34280c;
  margin-right: 5px;
}

.eliminar {
  background: #b72d35;
  color: white;
}

.sin-datos {
  text-align: center;
  color: #77776e;
  padding: 25px;
}

/* ESTADOS DE LOS EVENTOS */
.estado {
  display: inline-block;
  padding: 6px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.estado.programado {
  background: #e5f3e9;
  color: #207444;
}

.estado.agotado {
  background: #fff0cd;
  color: #8c6100;
}

.estado.cancelado {
  background: #f9e2e2;
  color: #a3212b;
}

/* PIE DE PÁGINA */
footer {
  margin-top: 28px;
  text-align: center;
  color: #77776e;
  font-size: 12px;
  background: #eee8d9;
  border-radius: 12px;
  overflow: hidden;
  padding-bottom: 15px;
}

footer p {
  margin: 14px 10px 5px;
  font-weight: 700;
  color: #8f1d2c;
}

footer small {
  color: #77776e;
}

/* RESPONSIVE */
@media (max-width: 700px) {
  .contenedor {
    padding: 12px;
  }

  .encabezado-contenido {
    padding: 27px 22px;
  }

  header h1 {
    font-size: 26px;
  }

  .decoracion {
    right: 15px;
    top: 25px;
    font-size: 55px;
  }

  nav {
    width: 100%;
  }

  nav button {
    flex: 1;
    padding: 11px 8px;
  }

  main {
    padding: 15px;
  }

  .titulo-seccion {
    gap: 10px;
  }

  .titulo-seccion h2 {
    font-size: 19px;
  }

  form {
    padding: 13px;
  }

  input,
  select {
    flex-basis: 100%;
  }

  .tabla-contenedor {
    overflow-x: auto;
  }

  table {
    min-width: 750px;
  }
}
</style>
