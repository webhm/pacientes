<script setup>
import {useAuthStore} from "../stores/auth";
import {computed, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {leads} from "../services/leads";
import {useNotification} from "@kyvg/vue3-notification";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import axios from 'axios';
const {notify} = useNotification();
const authStore = useAuthStore();
const now = ref(dayjs());
// Crea una fecha con la hora de las 7:00 AM
const AM7 = dayjs().set('hour', 7).set('minute', 0).set('second', 0);

// Crea una fecha con la hora de las 7:00 PM
const PM7 = dayjs().set('hour', 19).set('minute', 0).set('second', 0);
const user = computed(() => authStore.user);

const before7 = computed(() =>now.value.isBefore(AM7));
const after7 = computed(() =>now.value.isAfter(PM7));
//const myInvoicesStore = useMyInvoicesStore();
//const invoices = computed(() => myInvoicesStore.invoices);

const route = useRoute();
const router = useRouter();
const fileInput = ref(null);
const file = ref(null);
const form = ref({
  servicio: null,
  forma_de_contacto: null,
  nombre: null,
  email: null,
  phone: null,
  ciudad: null,
  origen: 'MetroVirtual Web',
  leadbox_token: '2b0aa535-a77a-4354-ae59-47e27838aa6c|67F9aCJfghm93c0LXiHBKOqf9IshCypfAmiZsijsiQN2WtE0IxKW6nX41dAjGbl1RR8Cq2bPoHK8vztli6mJovtDLbbsDzEV7Mo5',
  //leadbox_token: 'c509f524-c478-4150-a437-5365cc788a43|6CupB3oRIP1sUyhIVohjiXe9xglMMZd8382AgEdI7goG7ZCijodeJZICbYYpPWiIJl1VpnQkmQ8u1UAa8hrHQn1uJpAXRRQlV0eH',
});
const dirty = ref(false);
const success = ref(false);
const isLoading = ref(false);
const openFileInput = () => {
  fileInput.value.click();
};
const send = async () => {
  try {
    dirty.value = true;
    isLoading.value = true;
    if (!form.value.servicio || !form.value.forma_de_contacto || !form.value.nombre || !form.value.email ||
        !form.value.phone || !form.value.ciudad) {
      notify({
        title: "Datos incompletos",
        text: 'por favor completa los campos requeridos',
        type: 'error'
      });
      isLoading.value = false;
      return;
    }
    let leadsResponse;
    if (file.value) {
      const formDataObj = new FormData();
      formDataObj.append('servicio', form.value.servicio);
      formDataObj.append('forma_de_contacto', form.value.forma_de_contacto);
      formDataObj.append('nombre', form.value.nombre);
      formDataObj.append('email', form.value.email);
      formDataObj.append('phone', form.value.phone);
      formDataObj.append('ciudad', form.value.ciudad);
      formDataObj.append('origen', form.value.origen);
      formDataObj.append('leadbox_token', form.value.leadbox_token);
      formDataObj.append('file', file.value.file);
      console.log('formData', formDataObj);
      leadsResponse = await axios.post('https://leadbox.ec/api/callback/landing', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': form.value.leadbox_token,
        },
      });
    } else {
      leadsResponse = await leads(form.value, {headers: {Authorization: null}});
    }

    isLoading.value = false;
    const responseData = leadsResponse.data;
    console.log('leadsResponse', leadsResponse);
    console.log('responseData', responseData);
    if (responseData.success) {
      notify({
        title: "Información enviada",
        text: 'Un asesor se contactará lo antes posible',
        type: 'success'
      });
      success.value = true;
      dirty.value = false;
      file.value = null;
      form.value = {
        servicio: null,
        nombre: null,
        forma_de_contacto: null,
        email: null,
        phone: null,
        ciudad: null,
        origen: 'MetroVirtual Web',
        leadbox_token: '2b0aa535-a77a-4354-ae59-47e27838aa6c|67F9aCJfghm93c0LXiHBKOqf9IshCypfAmiZsijsiQN2WtE0IxKW6nX41dAjGbl1RR8Cq2bPoHK8vztli6mJovtDLbbsDzEV7Mo5',
        //leadbox_token: 'c509f524-c478-4150-a437-5365cc788a43|6CupB3oRIP1sUyhIVohjiXe9xglMMZd8382AgEdI7goG7ZCijodeJZICbYYpPWiIJl1VpnQkmQ8u1UAa8hrHQn1uJpAXRRQlV0eH',
      };
    }else{
      notify({
        title: "Hubo un error",
        text: responseData.message,
        type: 'error'
      });
    }

  } catch (e) {
    isLoading.value = false;
    console.log('error', e);
    notify({
      title: "Error",
      text: e,
      type: 'error'
    });
  }
};
const getSession = async () => {
  const url = 'https://apicvox.hospitalmetropolitano.org/crmcontactvox/service/v4_1/rest.php';

  // Datos a enviar
  const data = {
    'input_type': 'JSON',
    'response_type': 'JSON',
    'method': 'login',
    'rest_data': JSON.stringify({
      'user_auth': {
        'user_name': 'apicrm',
        'password': '3b6e22a5dc39b24cab5f55cb8cc61012',
      },
      'application_name': 'RestCrm',
      'name_value_list': []
    }),
  };

  console.log('auth form');
  console.log(data);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: Object.entries(data)
          .map(([key, value]) => `${key}=${encodeURIComponent(value.toString())}`)
          .join('&'),
    });

    const responseBody = await response.json();

    console.log('Respuesta:', responseBody.id);
    return responseBody.id;
  } catch (error) {
    console.log('Error:', error);
    return null;
  }
};
const sendDate = async () => {


  try {
    dirty.value = true;
    isLoading.value = true;
    if (!form.value.servicio || !form.value.forma_de_contacto || !form.value.nombre || !form.value.email ||
        !form.value.phone || !form.value.ciudad) {
      notify({
        title: "Datos incompletos",
        text: 'por favor completa los campos requeridos',
        type: 'error'
      });
      isLoading.value = false;
      return;
    }

    const id = await getSession();

    if (id !== null) {
      const fields = [
        { 'name': 'nombres', 'value': form.value.nombre },
        { 'name': 'celular', 'value': form.value.phone },
        { 'name': 'correo', 'value': form.value.email },
        { 'name': 'ciudad', 'value': form.value.ciudad },
        { 'name': 'servicio', 'value': form.value.servicio },
        { 'name': 'metodo_contacto', 'value': form.value.forma_de_contacto }
      ];

      if (file.value) {
        const fileName = file.value.file.name;
        const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
        const fileBytes = await file.value.file.readAsArrayBuffer();
        const base64String = btoa(String.fromCharCode(...new Uint8Array(fileBytes)));

        fields.push({
          'documento': {
            'document_name': fileNameWithoutExtension,
            'filename': fileName,
            'file': base64String
          }
        });
      }

      const form = {
        'session': id,
        'categoria': 'metrovirtual',
        'campos': JSON.stringify(fields)
      };

      console.log('form');
      console.log(form);

      const url = 'https://apicvox.hospitalmetropolitano.org/crmcontactvox/API_HM/rest.php';

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: Object.entries(form)
              .map(([key, value]) => `${key}=${encodeURIComponent(value.toString())}`)
              .join('&'),
        });

        const responseBody = await response.json();
        console.log('Respuesta ID:', responseBody.id);

        if (responseBody.status) {
          // Show success message
          notify({
            title: "Información enviada",
            text: 'Un asesor se contactará lo antes posible',
            type: 'success'
          });
          success.value = true;
          dirty.value = false;
          file.value = null;
          form.value = {
            servicio: null,
            nombre: null,
            forma_de_contacto: null,
            email: null,
            phone: null,
            ciudad: null,
            origen: 'MetroVirtual Web',
            leadbox_token: '2b0aa535-a77a-4354-ae59-47e27838aa6c|67F9aCJfghm93c0LXiHBKOqf9IshCypfAmiZsijsiQN2WtE0IxKW6nX41dAjGbl1RR8Cq2bPoHK8vztli6mJovtDLbbsDzEV7Mo5',
            //leadbox_token: 'c509f524-c478-4150-a437-5365cc788a43|6CupB3oRIP1sUyhIVohjiXe9xglMMZd8382AgEdI7goG7ZCijodeJZICbYYpPWiIJl1VpnQkmQ8u1UAa8hrHQn1uJpAXRRQlV0eH',
          };
        } else {
          // Show error message
          notify({
            title: "Hubo un error",
            text: responseBody.message,
            type: 'error'
          });
        }
      } catch (error) {

        // Show error message
        isLoading.value = false;
        console.log('error', error);
        notify({
          title: "Error",
          text: error,
          type: 'error'
        });
      }
    } else {
      // Show error message
      isLoading.value = false;
      notify({
        title: "Error",
        text: 'no se pudo enviar',
        type: 'error'
      });
    }
  } catch (error) {
    console.log(error);
    // Show error message
    isLoading.value = false;
    notify({
      title: "Error",
      text: error,
      type: 'error'
    });
  }
}
const goBack = () => {
  router.push({name: 'dashboard'});
};
const onInputChange = (e) => {
  addFiles(e.target.files[0]);
  e.target.value = null;
  // reset so that selecting the same file again will still cause it to fire this change
};
const addFiles = (newFile) => {
  console.log('newFile', newFile);
  file.value = new UploadableFile(newFile);
  console.log('file', file.value);
};

onMounted(async () => {

});

class UploadableFile {
  constructor(file) {
    this.file = file;
    this.id = `${file.name}-${file.size}-${file.lastModified}-${file.type}`;
    this.url = URL.createObjectURL(file);
    this.status = null;
  }
}
</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>Agendar Cita - Metrovirtual - Hospital Metropolitano</title>
    </teleport>
    <div class="justify-content-center py-1" style="background-color: rgb(229 237 241);">
      <!--login section-->
      <div class="container m-auto d-block">
        <div class="row mb-2  mt-2 justify-content-center">
          <!--columna de text-->
          <div class=" col-6 " @click="goBack()">
            <div class="row mt-3">
              <h5 class="cursor-pointer ml-3" style=" color: #0f4470; font-size: 16px;">
                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                Regresar
              </h5>
            </div>
          </div>
          <div class="col-6">
            <div class="d-block py-1">
              <div class="d-flex justify-content-end">
                <div class="img-div">
                  <img class="img-header-icon ml-3" src="@/assets/agendar.png" alt=" icon">
                </div>
                <br>
                <h4 class="d-flex text-headerv2 mt-2"
                    style="
                            color: #05305d;
                            text-align:left;
                            font-weight: 600;">
                  Agendar Cita
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="justify-content-center py-2" style="background-color: #f8f9fc;">
      <div class="container m-auto d-block " style="background: #f8f9fc;">
        <div class="row my-2 pb-5 pt-2 justify-content-center">
          <div class="col-md-6 col-12 px-5">
            <h5 class="text-start text-agendar my-4">Déjanos los siguientes datos
              para que un asesor pueda tomar contacto
              contigo y agendar tu cita.</h5>
            <h5 class="text-agendar text-start">
              <b>Servicios disponibles:</b> <br>
              <span>*Examen de Imagen</span> <br>
              <span>*Laboratorio a Domicilio</span>
            </h5>
            <div class="text-center">
              <div class="img-div">
                <img class="img-header ml-3" src="@/assets/citas.gif" alt=" icon">
              </div>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <template v-if="isLoading">
              <div class="my-1 p-3 text-center">
                <img class="img-fluid" src="@/assets/loading.gif"
                     alt="Loading Hm">
              </div>
            </template>
            <template v-else>
              <template v-if="success">
                <h5 class="text-start text-agendar text-center my-5">
                  Su información ha sido enviada correctamente, <br>
                  Un asesor se contactará lo antes posible <br>
                  <template v-if="before7 || after7">
                    <span>Nuestro horario de atención es de 7 AM a 7 PM</span>
                  </template>
                </h5>
                <div class="row my-1">
                  <div class="col-12">
                    <button class="text-center recover-password cursor-pointer mr-4 btn-loginv3"
                            translate @click="success = false;">
                      Volver
                    </button>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="form-group my-2">
                  <select class="form-select" aria-label="Servicio" v-model="form.servicio">
                    <option :value="null">Elige un servicio</option>
                    <option value="examen de imagen">Examen de imagen</option>
                    <option value="laboratorio a domicilio">Laboratorio a domicilio</option>
                  </select>
                  <p class="error-text" v-if="dirty && !form.servicio">Selecciona tu servicio</p>
                </div>
                <div class="form-group my-2">
                  <select class="form-select" aria-label="Método de contacto" v-model="form.forma_de_contacto">
                    <option :value="null">Elige un método de contacto</option>
                    <option value="email">Correo Electrónico</option>
                    <option value="llamada telefónica">Llamada telefónica</option>
                    <option value="whatsapp">Whatsapp</option>
                  </select>
                  <p class="error-text" v-if="dirty && !form.forma_de_contacto">Selecciona un método de contacto</p>
                </div>
                <div class="form-group my-2 ">
                  <input type="text"
                         class="m-0 p-0 pl-3 form-control"
                         required
                         v-model="form.nombre"
                         name="nombre"
                         placeholder="Ingresa tus nombres y apellidos completos">
                  <p class="error-text" v-if="dirty && !form.nombre">Ingresa tu nombre</p>
                </div>
                <div class="form-group my-2 ">
                  <input type="email"
                         class="m-0 p-1 pl-3 form-control"
                         required
                         v-model="form.email"
                         name="email"
                         placeholder="Ingresa tu dirección de correo electrónico">
                  <p class="error-text" v-if="dirty && !form.email">Ingresa tu correo electrónico</p>
                </div>
                <div class="form-group my-2">
                  <input min="9" max="10" type="tel"
                         class="m-0 p-1 pl-3 form-control"
                         required
                         v-model="form.phone"
                         name="phone"
                         placeholder="Ingresa tu teléfono">
                  <p class="error-text" v-if="dirty && !form.phone">Ingresa tu teléfono</p>
                </div>
                <div class="form-group my-2 ">
                  <input type="text"
                         class="m-0 p-1 pl-3 form-control"
                         required
                         v-model="form.ciudad"
                         name="ciudad"
                         placeholder="Ingresa tu ciudad">
                  <p class="error-text" v-if="dirty && !form.ciudad">Ingresa tu ciudad</p>
                </div>
                <div class="form-group my-3 ">
                  <template v-if="file">
                    <p class="my-1 text-agendar">Pedido médico</p>
                    <div class="row justify-content-center">
                      <img :src="file.url" style="width: 60%; margin: auto;">
                    </div>
                    <div @click="file = null;" class="delete-button p-2 my-2">Eliminar</div>
                  </template>
                  <template v-else>
                    <p class="my-1 text-agendar">Si lo tienes, sube tu pedido médico</p>
                    <div class="input-button p-1 my-2" @click="openFileInput()">
                      <p class="my-1">Examinar</p>
                    </div>
                  </template>
                  <input ref="fileInput" type="file" id="file-input"
                         class="hidden" @change="onInputChange">
                </div>
                <div class="row my-1">
                  <div class="col-12">
                    <button class="text-center recover-password cursor-pointer mr-4 btn-loginv3"
                            translate @click="sendDate()">
                      Agendar una cita
                    </button>
                  </div>
                </div>
              </template>
            </template>
          </div>
        </div>
        <!--        <FooterPaciente/>-->
      </div>

    </div>
  </div>
</template>

<style scoped>
.img-agendarcita {
  width: 320px;
  height: 225px;
  text-align: center;
  margin: 0 auto;
  display: block;
}

.text-headerv2 {
  font-size: 16px;
}

.error-text {
  color: red;
}

.img-border {
  background: #E9EDF8;
  padding: 20px 5px;
  width: 145px;
  height: 145px;
  margin: 0px auto;
  border-radius: 100%;
  text-align: center;
  border: 2px solid white;
  box-shadow: -6px 4px 13px 3px #e4e5e7;
}

img.img-metrovirtual {
  width: 160px;
  height: 20px;
}

.btn-loginv3 {
  background: linear-gradient(90deg, rgba(11, 114, 216, 1) 0%, rgba(42, 157, 255, 1) 0%, rgba(11, 114, 216, 1) 100%) !important;
  width: 100%;
  color: #fff;
  padding: 9px 20px;
  min-width: 100%;
  text-align: center;
  border-radius: 20px;
  border: none;
}

.btn-loginv3:hover {
  background: linear-gradient(90deg, rgba(42, 157, 255, 1) 0%, rgba(11, 114, 216, 1) 0%, rgba(42, 157, 255, 1) 100%) !important;
  transition: all .30s linear;
}

.img-header-icon {
  margin: 0 auto;
  display: flex;
  width: 74px;
  height: auto;
  padding: 0px 10px;
  margin-top: 1px;
  margin-left: 21px;
}


input.form-control {
  height: 50px;
  margin-bottom: 10px !important;
  box-shadow: 0px 6px 20px rgb(10 30 80 / 15%);
  background: white;
  padding: 22px 22px 22px 22px !important;
  border: 1px solid #e6eaee;
}

.img-icon-color {
  width: 105px;
  height: 105px;
  margin: 0 auto;
  display: block;
  padding: 20px;
  margin-top: 1px;
}

.row.d-block:hover {
  background: linear-gradient(90deg, rgba(11, 114, 216, 1) 0%, rgba(42, 157, 255, 1) 0%, rgba(11, 114, 216, 1) 100%) !important;
  transition: all .30s linear;
}

.text-icon-color {
  text-align: center;
  color: #05305d;
  font-weight: 600;
  line-height: 18px;
}

a:hover {
  text-decoration: none;
}

.img-border > img {
  position: relative;

}

.img-border > img:last-of-type {
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  -moz-transition: opacity 0.3s ease-in-out;
  -webkit-transition: opacity 0.3s ease-in-out;
}

/*
 * Hide the last image on hover
*/
.img-border:hover > img:last-of-type {
  opacity: 0;
}

.text-agendar {
  color: #05305d;
  font-weight: 400;
}

.input-button {
  border: 1px solid #cec4c4;
  text-align: center;
  border-radius: 10px;
  background: #e5edf1;
  cursor: pointer;
  box-shadow: 0px 6px 20px rgb(10 30 80 / 15%);
  /* color: white; */
}

.delete-button {
  border: 1px solid #cec4c4;
  text-align: center;
  border-radius: 10px;
  background: red;
  cursor: pointer;
  color: white;
  box-shadow: 0px 6px 20px rgb(10 30 80 / 15%);
  /* color: white; */
}

.hidden {
  display: none;
}

</style>
