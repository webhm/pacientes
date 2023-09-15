<script setup>
import FooterMedico from "../components/FooterMedico.vue";
import {useAuthStore} from "../stores/auth";
import {usePatientPathStore} from "../stores/patientPath";
import {computed, ref, onMounted} from "vue";
import {useRouter} from "vue-router";
import {useNotification} from "@kyvg/vue3-notification";

const {notify} = useNotification();
const authStore = useAuthStore();
const user = computed(() => authStore.user);
const patientPathStore = usePatientPathStore();
const paths = computed(() => patientPathStore.paths);
const search = ref(null);
let isLoading = ref(false);
let limit = ref(25);
let offset = ref(1);
let start = ref(null);
let end = ref(null);
let type = ref(null);
let receptor = ref(null);
const router = useRouter();

const getPaths = async () => {
  isLoading.value = true;
  const form = {
    //'endDate':'13-07-2023',
    'limit': limit.value,
    'offset': offset.value,
    //'searchField': '',
    'sortField': 'FACT',
    'sortType': 'asc',
    'NHC': user.value.NHC,
    //'startDate': '13-04-2023'
  };
  if (search.value != null) {
    form['searchField'] = search.value;
  }
  if (start.value != null) {
    form['startDate'] = start.value;
  }
  if (end.value != null) {
    form['endDate'] = end.value;
  }
  console.log('fomr', form);
  await patientPathStore.searchPatientPath(form);
  isLoading.value = false;
  console.log('paths', paths.value);
  paths.value.forEach((path, key) => {
    patientPathStore.getSubscribed(key, user.value.NHC);
  });
  console.log('paths', paths.value);
};

const goBack = async () => {
  if (window.history.state.back === null) {
    await router.replace({name: "dashboard"});
  } else {
    router.back();
  }
}
const subscribe = async (index, NHC) => {
  if (paths.value[index].subscribed.length < 2) {
    await patientPathStore.updateSubscribed(index,
        {
          type: type.value,
          receptor: receptor.value,
        }, NHC);
    type.value = null;
    receptor.value = null;
    // paths.value.forEach((path, key) => {
    //   patientPathStore.getSubscribed(key, user.value.NHC);
    // });
  } else {
    notify({
      title: 'Atención',
      text: 'No puedes agregar más de 2 receptores',
      type: 'error'
    });
  }

};

const deleteSubscribe = async (path, index, NHC) => {
  console.log('path', path);
  console.log('index', index);
  console.log('NHC', NHC);
  await patientPathStore.deleteSubscribed(path, index, NHC);
};

onMounted(async () => {
  await getPaths();
});

</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>Ruta del Paciente - Metrovirtual - Hospital Metropolitano</title>
    </teleport>
    <div class="justify-content-center py-1" style="background-color: rgb(229 237 241);">
      <!--login section-->
      <div class="container m-auto d-block">
        <div class="row my-1 justify-content-center">
          <!--columna de text-->
          <div class=" col-6 " @click="goBack()">
            <div class="row mt-2">
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
                  <img class="img-header-icon ml-3 mx-1" src="@/assets/ruta-del-paciente.png" alt=" icon">
                </div>
                <br>
                <h4 class="d-flex text-headerv2 mt-2"
                    style="
                            color: #05305d;
                            text-align:left;
                            font-weight: 600;">
                  Ruta del Paciente
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="justify-content-center py-2" style="background-color: #f8f9fc;">
      <div class="container m-auto d-block" style="background: #f8f9fc;">
        <div class="row my-2 pb-5 pt-2">
          <div class="col-sm-12 mt-3">
            <template v-if="isLoading">
              <div class="my-1 p-3 text-center">
                <img class="img-fluid" src="@/assets/loading.gif"
                     alt="Loading Hm">
              </div>
            </template>
            <template v-else>
              <template v-if="paths.length > 0">
                <div class=" m-1 p-3 row text-left border-result hover-list-element"
                     v-for="(path, pathKey) in paths"
                     :key="pathKey">
                  <div class="col-12 my-3">
                    <p class="title-results ">
                      <b>Cirugía programada para {{ path?.FECHA }} a las {{ path?.HORA }} Dr/a {{ path?.CIRUJANO }}</b>
                    </p>
                    <div class="d-flex cursor-pointer">
                      <font-awesome-icon class="p-1 px-2"
                                         :icon="['fas', 'bell' ]"/>
                      <p class="text-results ">
                        Activar Notificaciones para recibir detalles de la cirugía programada
                      </p>
                    </div>
                    <hr class="my-1">
                    <div class="row px-3 py-1">
                      <div class="col-12 col-md-4 my-1 ">
                        <label class="text-label my-1"><b>Tipo de notificación:</b></label>
                        <select class="form-control bg-white select-result form-select" style="border-radius: 50px"
                                v-model="type">
                          <option :value="'email'">Por Correo Electrónico</option>
                          <option :value="'whatsapp'">Por Whatsapp</option>
                          <option :value="null">Selecciona tipo</option>
                        </select>
                      </div>
                      <div class="col-12 col-md-4 my-1">
                        <template v-if="type === 'email'">
                          <label class="text-label my-1"><b>Correo Electrónico</b></label>
                          <input type="email" v-model="receptor"
                                 class="form-control"
                                 required
                                 placeholder="Ingresa el correo electrónico">
                        </template>
                        <template v-if="type === 'whatsapp'">
                          <label class="text-label my-1"><b>Whatsapp:</b></label>
                          <input type="tel" v-model="receptor"
                                 class="form-control"
                                 required
                                 placeholder="Ingresa el número whatsapp">
                        </template>

                      </div>
                      <div class="col-12 col-md-4 my-1 mt-4 ">
                        <button class="text-center cursor-pointer p-3"
                                :class="[type && receptor ? 'btn-loginv3' : 'left-button']"
                                @click="subscribe(pathKey, user.NHC)">
                          Suscribir
                        </button>
                      </div>
                    </div>
                    <hr>
                    <div class="row my-2">
                      <template v-if="path.isLoading">
                        <div class="my-1 p-3 text-center">
                          <img class="img-fluid" src="@/assets/loading.gif"
                               alt="Loading Hm">
                        </div>
                      </template>
                      <template v-else>
                        <template v-if="path.subscribed?.length > 0">
                          <div class="row" v-for="(sub, subKey) in path.subscribed" v-bind:key="subKey">
                            <div class="col-12 col-md-4 my-1 ">
                              <label class="text-label my-1"><b>Tipo de notificación:</b></label>
                              <p>{{ sub.type }}</p>
                            </div>
                            <div class="col-12 col-md-4 my-1">
                              <template v-if="sub.type === 'email'">
                                <label class="text-label my-1"><b>Correo Electrónico</b></label>
                              </template>
                              <template v-if="sub.type === 'whatsapp'">
                                <label class="text-label my-1"><b>Whatsapp:</b></label>
                              </template>
                              <p>{{ sub.receptor }}</p>

                            </div>
                            <div class="col-12 col-md-4 my-1 mt-4 ">
                              <button class="text-center cursor-pointer p-3 left-button"
                                      style="background-color: red; color:white;"
                                      @click="deleteSubscribe(pathKey, subKey, user.NHC)">
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </template>
                        <template v-else>
                          <div class="col-12 my-2">
                            <p class="text-center text-results">No hay contactos</p>
                          </div>
                        </template>
                      </template>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class=" my-1 p-3  text-center">
                  <h4 class="center text-search">
                    No tienes cirugías programadas
                  </h4>
                </div>
              </template>
              <div class=" my-3  p-3 text-left">
                <p class="center text-search">
                  A través de esta funcionalidad llamada <b>Ruta del Paciente</b>, usted podrá inscribir hasta 2
                  familiares, amigos, etc. para que reciban notificaciones del avance de su cirugía, ya sea por correo
                  electrónico o mensaje de Whatsapp.
                </p>
                <p class="center text-search">
                  <b>Nota Importante:</b> Esta opción sólo se activará si usted tiene cirugías activas programadas, si
                  desea conocer más de esta opción o necesita ayuda con la misma, comuníquese con nuestro call center al
                  <a href="tel:1800463876">1800 HMETRO</a>, a nuestro
                  <a href="https://api.whatsapp.com/send?text=Necesito%20ayuda&phone=593984789952" target="_blank">Whatsapp</a> o a través de
                  nuestros canales digitales. </p>
              </div>
            </template>

          </div>
        </div>
        <FooterMedico/>
      </div>

    </div>
  </div>
</template>
<style scoped>
.left-button {
  background-color: #989899;
  border-radius: 50px;
  min-width: 100%;
  height: 50px;
  padding: 0px 20px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  transition: all .30s linear;
}

@media screen and (max-width: 600px) {
  .nav-tabs {
    overflow-x: auto;
    overflow-y: hidden;
    flex-wrap: nowrap !important;
  }

  .nav-tabs li {
    white-space: nowrap;
  }

  li.nav-item.tab-hm button {
    font-size: 16px;
  }

  .nav-tabs .nav-link.active {
    font-size: 16px;
  }
}
</style>
