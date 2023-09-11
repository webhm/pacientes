<script setup>

import {useAuthStore} from "../stores/auth";
import {computed, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {leads} from "../services/leads";
import {useNotification} from "@kyvg/vue3-notification";

const {notify} = useNotification();
//
// import FooterPaciente from "../components/FooterPaciente";
//
const authStore = useAuthStore();
const user = computed(() => authStore.user);

const form = ref({
  nombre: null,
  email: null,
  phone: null,
  comentario: null,
  origen: 'MetroVirtual Web',
  leadbox_token: '2d10d8e5-c20f-49f0-9565-8de5de068dab|20hveiWlu3wXXdfBIcC7gofHlVgVgVKk4Nx0edFEm722ONYmxoIqpLbBNnN65efyo34Cp1cMIXm42jAfs3F5L281vA9aswd5mkRW'
});
const success = ref(false);
const dirty = ref(false);
const isLoading = ref(false);
const route = useRoute();
const router = useRouter();
//
const goBack = () => {
  router.push({name: 'dashboard'});
};
const send = async () => {
  try {
    dirty.value = true;
    isLoading.value = true;
    if (!form.value.nombre || !form.value.email || !form.value.phone || !form.value.comentario) {
      notify({
        title: "Datos incompletos",
        text: 'por favor completa los campos requeridos',
        type: 'error'
      });
      isLoading.value = false;
      return;
    }
    const leadsResponse = await leads(form.value, {headers: {Authorization: null}});
    isLoading.value = false;
    console.log('leadsResponse', leadsResponse);
    if (leadsResponse.success) {
      notify({
        title: "Información enviada",
        text: 'Gracias por tu valioso comentario',
        type: 'success'
      });
      dirty.value = false;
      success.value = true;
      form.value = {
        nombre: null,
        email: null,
        phone: null,
        comentario: null,
        origen: 'MetroVirtual Web',
        leadbox_token: '2d10d8e5-c20f-49f0-9565-8de5de068dab|20hveiWlu3wXXdfBIcC7gofHlVgVgVKk4Nx0edFEm722ONYmxoIqpLbBNnN65efyo34Cp1cMIXm42jAfs3F5L281vA9aswd5mkRW'
      };
    } else{
      notify({
        title: "Hubo un error",
        text: leadsResponse.message,
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
onMounted(async () => {
     //set user data
  console.log('user', user.value);
 });
</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>Buzón de Sugerencias - Metrovirtual - Hospital Metropolitano</title>
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
                  <img class="img-header-icon ml-3" src="@/assets/buzon.png" alt=" icon">
                </div>
                <br>
                <h4 class="d-flex text-headerv2 mt-2"
                    style="
                            color: #05305d;
                            text-align:left;
                            font-weight: 600;">
                  Buzón de Sugerencias
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
          <div class="col-md-6 col-12">
            <h5 class="text-center text-agendar my-4 mx-5">
              Déjanos tus comentarios y sugerencias, o como podemos ayudarte, y pronto un asesor se contactará contigo
            </h5>
            <div class="text-center">
              <div class="img-div">
                <img class="img-header ml-3" src="@/assets/buzonv2.gif" alt=" icon">
              </div>
            </div>
          </div>
          <div class="col-md-6 col-12">
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
                  Gracias por tu valioso comentario <br>
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
                <div class="form-group my-2 ">
                  <input type="text"
                         class="m-0 p-2 form-control"
                         required
                         name="nombre"
                         v-model="form.nombre"
                         placeholder="Ingresa tu nombre y apellido">
                  <p class="error-text" v-if="dirty && !form.nombre">Ingresa tu nombre</p>
                </div>
                <div class="form-group my-2 ">
                  <input type="email"
                         class="m-0 p-2 form-control"
                         required
                         name="email"
                         v-model="form.email"
                         placeholder="Ingresa tu dirección de correo electrónico">
                  <p class="error-text" v-if="dirty && !form.email">Ingresa tu correo electrónico</p>
                </div>
                <div class="form-group my-2">
                  <input min="9" max="10" type="tel"
                         class="m-0 p-2 form-control"
                         required
                         name="phone"
                         v-model="form.phone"
                         placeholder="Ingresa tu teléfono">
                  <p class="error-text" v-if="dirty && !form.phone">Ingresa tu teléfono</p>
                </div>
                <div class="form-group my-2 ">
                             <textarea class="m-0 p-2 form-control"
                                       required
                                       name="comentario"
                                       v-model="form.comentario"
                                       placeholder="Ingresa tu comentario"></textarea>
                  <p class="error-text" v-if="dirty && !form.comentario">Ingresa tu comentario</p>

                </div>
                <div class="row my-1">
                  <div class="col-12">
                    <button class="text-center recover-password cursor-pointer mr-4 btn-loginv3"
                            translate @click="send()">
                      Enviar sugerencia
                    </button>
                  </div>
                </div>
              </template>

            </template>
          </div>
        </div>
        <!--                <FooterPaciente/>-->
      </div>

    </div>
  </div>
</template>

<style scoped>

textarea.form-control {
  margin-bottom: 10px !important;
  box-shadow: 0px 6px 20px rgb(10 30 80 / 15%);
  background: white;
  padding: 22px 22px 22px 22px !important;
  border: 1px solid #e6eaee;
}

.text-headerv2 {
  font-size: 16px;
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
  background: #0B72D8 !important;
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


</style>
