<script setup>
import FooterMedico from "../components/FooterMedico.vue";
import {useAuthStore} from "../stores/auth";
import {ref, onMounted, computed} from "vue";
import {useRoute, useRouter} from "vue-router";
import {urlDocumento} from "../services/patient";
//import { useNotification } from "@kyvg/vue3-notification";
import dayjs from "dayjs";
import {usePatientsListStore} from "../stores/patientsList";
import {useMyLabResultsStore} from "../stores/myLabResults";
import {useMyImageResultsStore} from "../stores/myImageResults";
import {notify} from "@kyvg/vue3-notification";

const patientsListStore = usePatientsListStore();
const authStore = useAuthStore();
const user = computed(() => authStore.user);
//lab stuff
let isLoadingLab = ref(false);
let isLoadingMoreLab = ref(false);
const myLabResultsStore = useMyLabResultsStore();
const lab_results = computed(() => myLabResultsStore.results);
const total_lab = computed(() => myLabResultsStore.total);
const limit_lab = computed(() => myLabResultsStore.limit);
const offset_lab = computed(() => myLabResultsStore.offset);
const start_lab = ref(null);
const end_lab = ref(null);
//image stuff
let isLoadingImage = ref(false);
let isLoadingMoreImage = ref(false);
const myImageResultsStore = useMyImageResultsStore();
const image_results = computed(() => myImageResultsStore.results);
const total_image = computed(() => myImageResultsStore.total);
const limit_image = computed(() => myImageResultsStore.limit);
const offset_image = computed(() => myImageResultsStore.offset);
const start_image = ref(null);
const end_image = ref(null);
const seeImages = ref(false);


const router = useRouter();
const route = useRoute();
//const props = defineProps(["nhc"]);
const title = ref("Resultados de Imagen y Laboratorio - Metrovirtual - Hospital Metropolitano");

const goBack = () => {
  patientsListStore.activeTab = 0;
  myLabResultsStore.clearResults();
  myImageResultsStore.clearResults();
  if (window.history.state.back === null) {
    router.replace({name: "dashboard"});
  } else {
    router.back();
  }
};
const isWithin24Hours = (date) => {
  const dateForm = dayjs(date);
  const now = dayjs(); // Obtiene la fecha y hora actual
  const yesterday = now.subtract(24, "hour"); // Resta 24 horas a la fecha y hora actual
  return dateForm.isAfter(yesterday) && dateForm.isBefore(now); // Compara la fecha deseada con la fecha y hora actual y la fecha y hora de hace 24 horas
};
const goToLabResult = async (result) => {
  let split = result.LINK_VER.split("/");
  // let url = router.resolve({
  //   name: "medic-lab-result-view",
  //   params: { url: split[3], nhc: nhc.value },
  //   query: { prev: "resultados" }
  // });
  // window.open(url.href, "_blank");
  await router.push({
    name: "lab-result-view",
    params: {url: split[5], nhc: user.value.NHC},
  });
};
const goToLabResultCtrl = async (result) => {
  let split = result.LINK_VER.split("/");
  let url = router.resolve({
    name: "lab-result-view",
    params: {url: split[5], nhc: user.value.NHC},
  });
  window.open(url.href, "_blank");
  // await router.push({name: 'medic-lab-result-view', params: {url: split[3], nhc: user.value.NHC}});
};

const goToZero = async () => {
  // let url = router.resolve({
  //   name: "medic-patient-zerofootprint-view",
  //   params: { nhc: user.value.NHC },
  //   query: { prev: "resultados" }
  // });
  // window.open(url.href, "_blank");
  await router.push({
    name: "zerofootprint-view",
    params: {nhc: user.value.NHC},
  });
};
const goToZeroCtrl = async () => {
  let url = router.resolve({
    name: "zerofootprint-view",
    params: {nhc: user.value.NHC},
  });
  window.open(url.href, "_blank");
  //await router.push({name: 'medic-patient-curva-view', params: {type, na, nhc: user.value.NHC}});
};
const goToZeroCtrlItem = async (item) => {
  let url = router.resolve({
    name: "zerofootprint-item-view",
    params: {id: item.PROCEDURE_KEY},
  });
  window.open(url.href, "_blank");
  //await router.push({name: 'medic-patient-curva-view', params: {type, na, nhc: user.value.NHC}});
};

const goToImageResult = async (result) => {
  let split = result.LINK_DESCARGA.split("/");
  console.log('split', split);
  // let url = router.resolve({
  //   name: "medic-image-result-view",
  //   params: { url: split[3], nhc: user.value.NHC },
  //   query: { prev: "resultados" }
  // });
  // window.open(url.href, "_blank");
  await router.push({
    name: "image-result-view",
    params: {url: split[5], nhc: user.value.NHC}
  });
};
const goToImageResultCtrl = async (result) => {
  let split = result.LINK_DESCARGA.split("/");
  let url = router.resolve({
    name: "image-result-view",
    params: {url: split[5], nhc: user.value.NHC}
  });
  window.open(url.href, "_blank");
  // await router.push({
  //   name: "medic-image-result-view",
  //   params: { url: split[3], nhc: user.value.NHC },
  //   query: { prev: "resultados" }
  // });
};

const getLabResults = async () => {
  // get patient lab results
  try {
    isLoadingLab.value = true;
    myLabResultsStore.limit = 25;
    myLabResultsStore.offset = 1;
    const form = {
      //'endDate':'13-07-2023',
      'limit': limit_lab.value,
      'offset': offset_lab.value,
      //'searchField': '',
      'sortField': 'FECHA',
      'sortType': 'desc',
      //'startDate': '13-04-2023'
    };
    if (start_lab.value != null && start_lab.value !== '') {
      form['startDate'] = start_lab.value;
    }
    if (end_lab.value != null && end_lab.value !== '') {
      form['endDate'] = end_lab.value;
    }
    await myLabResultsStore.getResults(form);
    isLoadingLab.value = false;
  } catch (e) {
    isLoadingLab.value = false;
    // console.log('error', e.Error);
    // console.log('error statusCode', e.Error?.statusCode);
    // console.log('error message', e.Error?.message);
    // console.log('error errorCode', e.Error?.errorCode);
    // if(e.message === 'Unauthorized' || e.message === 'Expired token'){
    //   await authStore.logout();
    //   await router.replace({ name: "ingreso" });
    //   return;
    // }
    // if (e.errorCode === 4031) {
    //   await authStore.logout();
    //   await router.replace({name: "ingreso"});
    // }
    await authStore.logout();
    await router.replace({name: "ingreso"});
  }
};
const getMoreLabResults = async () => {
  // get patient lab results
  try {
    isLoadingMoreLab.value = true;
    const form = {
      //'endDate':'13-07-2023',
      'limit': limit_lab.value,
      'offset': offset_lab.value,
      //'searchField': '',
      'sortField': 'FECHA',
      'sortType': 'desc',
      //'startDate': '13-04-2023'
    };
    if (start_lab.value != null && start_lab.value !== '') {
      form['startDate'] = start_lab.value;
    }
    if (end_lab.value != null && end_lab.value !== '') {
      form['endDate'] = end_lab.value;
    }
    await myLabResultsStore.getMoreResults(form);
    isLoadingMoreLab.value = false;
  } catch (e) {
    isLoadingMoreLab.value = false;
    // console.log('error', e);
    // console.log('error statusCode', e.statusCode);
    // console.log('error message', e.message);
    // console.log('error errorCode', e.errorCode);
    // if(e.message === 'Unauthorized' || e.message === 'Expired token'){
    //   await authStore.logout();
    //   await router.replace({ name: "ingreso" });
    //   return;
    // }
    // if (e.errorCode === 4031) {
    //   await authStore.logout();
    //   await router.replace({name: "ingreso"});
    // }
    await authStore.logout();
    await router.replace({ name: "ingreso" });
  }
};
const clearLabDates = () => {
  start_lab.value = null;
  end_lab.value = null;
};
const clearImageDates = () => {
  start_image.value = null;
  end_image.value = null;
}
const getImageResults = async () => {
  try {
    // get patient lab results
    isLoadingImage.value = true;
    myImageResultsStore.limit = 25;
    myImageResultsStore.offset = 1;
    const form = {
      //'endDate':'13-07-2023',
      'limit': limit_image.value,
      'offset': offset_image.value,
      //'searchField': '',
      'sortField': 'FECHA',
      'sortType': 'desc',
      //'startDate': '13-04-2023'
    };
    if (start_image.value != null && start_image.value !== '') {
      form['startDate'] = start_image.value;
    }
    if (end_image.value != null && end_image.value !== '') {
      form['endDate'] = end_image.value;
    }
    await myImageResultsStore.getResults(form);
    isLoadingImage.value = false;
  } catch (e) {
    isLoadingImage.value = false;
    // console.log('error', e);
    // console.log('error statusCode', e.statusCode);
    // console.log('error message', e.message);
    // console.log('error errorCode', e.errorCode);
    // if(e.message === 'Unauthorized' || e.message === 'Expired token'){
    //   await authStore.logout();
    //   await router.replace({ name: "ingreso" });
    //   return;
    // }
    // if (e.errorCode === 4031) {
    //   await authStore.logout();
    //   await router.replace({name: "ingreso"});
    // }
    await authStore.logout();
    await router.replace({name: "ingreso"});
  }
};
const getMoreImageResults = async () => {
  try {
    // get patient lab results
    isLoadingMoreImage.value = true;
    const form = {
      //'endDate':'13-07-2023',
      'limit': limit_image.value,
      'offset': offset_image.value,
      //'searchField': '',
      'sortField': 'FECHA',
      'sortType': 'desc',
      //'startDate': '13-04-2023'
    };
    if (start_image.value != null && start_image.value !== '') {
      form['startDate'] = start_image.value;
    }
    if (end_image.value != null && end_image.value !== '') {
      form['endDate'] = end_image.value;
    }
    await myImageResultsStore.getMoreResults(form);
    isLoadingMoreImage.value = false;
  } catch (e) {
    isLoadingMoreImage.value = false;
    // console.log('error', e);
    // console.log('error message', e.statusCode);
    // console.log('error message', e.message);
    // console.log('error errorCode', e.errorCode);
    // if(e.message === 'Unauthorized' || e.message === 'Expired token'){
    //   await authStore.logout();
    //   await router.replace({ name: "ingreso" });
    //   return;
    // }
    // if(e.errorCode === 4031){
    //   await authStore.logout();
    //   await router.replace({ name: "ingreso" });
    // }
    await authStore.logout();
    await router.replace({ name: "ingreso" });
  }
};


const downloadImageFile = (imageResult) => {
  console.log('imageResult', imageResult);
  if (imageResult.LINK_DESCARGA) {
    let split = imageResult.LINK_DESCARGA.split("/");
    notify({
      title: "Listo",
      text: "Se procederá con la descarga en unos segundos",
      type: "info"
    });
    urlDocumento(`https://api.hospitalmetropolitano.org/v2/pacientes/resultado/i/?id=${split[5]}`).then(async (response) => {
      if (response.status) {
        const link = document.createElement("a");
        link.setAttribute("href", response.url);
        link.setAttribute("target", "_blank");
        const d = new Date();
        link.setAttribute("download", `${user.value.NHC}_${d.getTime()}.pdf`);
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        notify({
          title: "Listo",
          text: "Resultado de imagen descargado",
          type: "success"
        });
      } else {
        notify({
          title: "El archivo no esta disponible",
          text: response.message,
          type: "error"
        });
      }
    });
  }
};

const downloadLabFile = (labResult) => {
  console.log('labResult', labResult);
  if (labResult.LINK_VER) {
    let split = labResult.LINK_VER.split("/");
    notify({
      title: "Listo",
      text: "Se procederá con la descarga en unos segundos",
      type: "info"
    });
    urlDocumento(`https://api.hospitalmetropolitano.org/v2/pacientes/resultado/l/?id=${split[5]}`).then(async (response) => {
      if (response.status) {
        const link = document.createElement("a");
        link.setAttribute("href", response.url);
        link.setAttribute("target", "_blank");
        link.setAttribute("download", `${labResult.ID_STUDIO}.pdf`);
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        notify({
          title: "Listo",
          text: "Resultado de imagen descargado",
          type: "success"
        });
      } else {
        notify({
          title: "El archivo no esta disponible",
          text: response.message,
          type: "error"
        });
      }
    });
  }
};
const getNextItems = () => {
  window.onscroll = () => {
    // console.log('document.documentElement.scrollTop', document.documentElement.scrollTop);
    // console.log('window.innerHeight', window.innerHeight);
    // console.log('document.documentElement.offsetHeight', document.documentElement.offsetHeight);
    // console.log('document.documentElement.scrollTop + window.innerHeight', document.documentElement.scrollTop + window.innerHeight);
    let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight;
    console.log('bottomOfWindow', bottomOfWindow);
    if (bottomOfWindow) {
      console.log('is bottom');
      if (patientsListStore.activeTab === 0) {
        console.log('limit_lab.value', limit_lab.value);
        console.log('offset_lab.value', offset_lab.value);
        if (total_lab.value > limit_lab.value) {
          console.log('hay mas datos lab traerlos, sumarle al offset el limit');
          myLabResultsStore.offset += limit_lab.value;
          getMoreLabResults();
        } else {
          console.log('no hay mas datos lab no hacer nada');
        }
      } else {
        console.log('limit_image.value', limit_image.value);
        console.log('offset_image.value', offset_image.value);
        if (total_image.value > limit_image.value) {
          console.log('hay mas datos image traerlos, sumarle al offset el limit');
          myImageResultsStore.offset += limit_image.value;
          getMoreImageResults();
        } else {
          console.log('no hay mas datos omage no hacer nada');
        }
      }

    }
  }
}

onMounted(async () => {
  const now = dayjs();
  end_lab.value = now.format('YYYY-MM-DD');
  start_lab.value = now.subtract(6, 'month').format('YYYY-MM-DD');
  end_image.value = now.format('YYYY-MM-DD');
  start_image.value = now.subtract(6, 'month').format('YYYY-MM-DD');
  getLabResults();
  getImageResults();
  getNextItems();
});

</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>{{title}}</title>
    </teleport>
    <div class="justify-content-center py-1" style="background-color: rgb(229 237 241);">
      <!--header section-->
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
                  <img class="img-header-icon ml-3" src="@/assets/resultados.png" alt=" icon">
                </div>
                <br>
                <h4 class="d-flex text-headerv2 mt-1"
                    style="text-align:left; color: #05305d; font-weight: 600;">
                  Resultados de Imagen y Laboratorio
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
          <div class="col-sm-12 ">
            <ul class="nav nav-tabs" id="ResultsTab" role="tablist">
              <li class="nav-item tab-hm" role="presentation">
                <button class="nav-link nav-hm" id="lab-tab" data-toggle="tab"
                        :class="{'active': patientsListStore.activeTab === 0}" @click="patientsListStore.activeTab = 0"
                        data-target="#lab" type="button" role="tab" aria-controls="lab"
                        aria-selected="true">Laboratorio <span class="bg-number">{{ total_lab }}</span>
                </button>
              </li>
              <li class="nav-item tab-hm" role="presentation">
                <button class="nav-link nav-hm" id="image-tab" data-toggle="tab"
                        :class="{'active': patientsListStore.activeTab === 1}" @click="patientsListStore.activeTab = 1"
                        data-target="#image" type="button" role="tab" aria-controls="image"
                        aria-selected="false">Imagen <span class="bg-number">{{ total_image }}</span>
                </button>
              </li>
            </ul>
            <div class="tab-content" id="ResultsTabContent">
              <div class="tab-pane fade" id="lab" role="tabpanel"
                   :class="{'active': patientsListStore.activeTab === 0, 'show': patientsListStore.activeTab === 0}"
                   aria-labelledby="lab-tab">
                <div class="container">
                  <div class="row justify-content-center">
                    <div class="col-12 p-4">
                      <div class="row justify-content-end mt-3">
                        <div class="col-12 col-md-2">
                          <p class="title-results"><b>Filtro por fechas:</b></p>
                        </div>
                        <div class="col-12 col-md-3">
                          <label class="text-label " style="margin-top: -30px; display: block;">Desde:</label>
                          <input type="date" v-model="start_lab"
                                 class="mt-1 form-control"
                                 @keyup.enter="getLabResults()"
                                 required>
                        </div>
                        <div class="col-12 col-md-3">
                          <label class="text-label " style="margin-top: -30px; display: block;">Hasta:</label>
                          <input type="date" v-model="end_lab"
                                 class="mt-1 form-control"
                                 @keyup.enter="getLabResults()"
                                 required>
                        </div>
                        <div class="col-12 col-md-2" >
                          <button class="text-center cursor-pointer pt-2 btn-search" style="margin-top: -150px;"
                                  @click="getLabResults()">
                            Filtrar
                          </button>
<!--                          <button class="text-center cursor-pointer my-1 pt-2 btn-red"-->
<!--                                  v-if="start_lab !== null || end_lab !== null"-->
<!--                                  @click="clearLabDates()">-->
<!--                            <font-awesome-icon :icon="['fas', 'times']"/>-->
<!--                          </button>-->
                        </div>
                      </div>
                      <template v-if="isLoadingLab">
                        <div class="d-flex justify-content-center">
                          <img class="img-fluid" src="@/assets/loading.gif"
                               alt="Loading Hm">
                        </div>
                      </template>
                      <template v-else>
                        <template v-if="lab_results.length > 0">
                          <div
                              class=" my-1 py-2 row text-left border-result hover-list-element"
                              v-for="(labResult, labResultKey) in lab_results"
                              :key="labResultKey">
                            <div class="col-9">
                              <p class="title-results"><b>{{ labResult?.ORIGEN }}</b>
                                <span class="p-2 mx-2 pill" v-if="isWithin24Hours(labResult?.fecha_)">Nuevo</span>
                              </p>
                              <p class="text-results">{{ labResult?.FECHA }}</p>
                              <p class="text-results">
                                <b>Médico:</b> {{ labResult?.MEDICO }}
                              </p>
                              <p style="color: #ff8201;">Laboratorio</p>
                            </div>
                            <div class="col-3 d-flex flex-column flex-md-row justify-content-end">
                              <!--                              <a class="cursor-pointer" title="Ver resultado"-->
                              <!--                                   style="display: inline-block;" target="_blank"-->
                              <!--                                   :href="labResult.LINK_VER">-->
                              <!--                                <div class="p-2 p-md-4">-->
                              <!--                                  <font-awesome-icon :icon="['fas', 'eye']" size="2x"-->
                              <!--                                                     class="icon-device" />-->
                              <!--                                </div>-->

                              <!--                              </a>-->
                              <div class="cursor-pointer" title="Ver resultado"
                                   style="display: inline-block;"
                                   @click.exact="goToLabResult(labResult)"
                                   @click.ctrl="goToLabResultCtrl(labResult)">
                                <div class="p-2 p-md-4">
                                  <font-awesome-icon :icon="['fas', 'eye']" size="2x"
                                                     class="icon-device"/>
                                </div>
                              </div>
                              <div @click="downloadLabFile(labResult)"
                                   class="cursor-pointer"
                                   title="Descargar resultado">
                                <div class="p-2 p-md-4">
                                  <font-awesome-icon :icon="['fas', 'download']" size="2x"
                                                     class="icon-device"/>
                                </div>

                              </div>
                            </div>
                          </div>
                          <div class="text-center py-3" v-if="isLoadingMoreLab">
                            <p class="title-results " style="font-size: medium;"><b>Cargando más resultados de
                              laboratorio...</b></p>
                          </div>
                        </template>
                        <template v-else>
                          <div class=" my-3 py-3  text-center">
                            <h4 class="center text-search">
                              No tienes resultados de laboratorio.
                            </h4>
                          </div>
                        </template>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane fade" id="image" role="tabpanel"
                   :class="{'active': patientsListStore.activeTab === 1, 'show': patientsListStore.activeTab === 1}"
                   aria-labelledby="image-tab">
                <div class="container">

                  <div class="row justify-content-center">
                    <div class="col-12 p-4">
                      <div class="row justify-content-end mt-3">
                        <div class="col-12 col-md-2">
                          <p class="title-results"><b>Filtro por fechas:</b></p>
                        </div>
                        <div class="col-12 col-md-3">
                          <label class="text-label " style="margin-top: -30px; display: block;">Desde:</label>
                          <input type="date" v-model="start_image"
                                 class="mt-1 form-control"
                                 @keyup.enter="getImageResults()"
                                 required>
                        </div>
                        <div class="col-12 col-md-3">
                          <label class="text-label " style="margin-top: -30px; display: block;">Hasta:</label>
                          <input type="date" v-model="end_image"
                                 class="mt-1 form-control"
                                 @keyup.enter="getImageResults()"
                                 required>
                        </div>
                        <div class="col-12 col-md-2 ">
                          <button class="text-center cursor-pointer pt-2 btn-search"
                                  @click="getImageResults()">
                            Filtrar
                          </button>
<!--                          <button class="text-center cursor-pointer my-1 pt-2 btn-red"-->
<!--                                  v-if="start_image !== null || end_image !== null"-->
<!--                                  @click="clearImageDates()">-->
<!--                            <font-awesome-icon :icon="['fas', 'times']"/>-->
<!--                          </button>-->
                        </div>
                      </div>
                      <template v-if="isLoadingImage">
                        <div class="d-flex justify-content-center">
                          <img class="img-fluid" src="@/assets/loading.gif"
                               alt="Loading Hm">

                        </div>
                      </template>
                      <template v-else>
                        <template v-if="seeImages">
                          <div class="flex" @click="seeImages = false;">
                            <div class="row mt-3">
                              <h5 class="cursor-pointer ml-3"
                                  style=" color: #0f4470; font-size: 16px;">
                                <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                                Regresar
                              </h5>
                            </div>
                          </div>
                          <template v-if="image_results.length > 0">
                            <div
                                class=" my-1 py-2 row text-left border-result hover-list-element"
                                v-for="(imageResult, imageResultKey) in image_results"
                                :key="imageResultKey">
                              <div class="col-9">
                                <p class="title-results"><b>{{ imageResult?.ESTUDIO }}</b>
                                  <span class="p-2 mx-2 pill" v-if="isWithin24Hours(imageResult?.fecha_)">Nuevo</span>
                                </p>
                                <p class="text-results">{{ imageResult?.FECHA }}</p>
                                <p class="text-results">
                                  <b>Médico:</b> {{ imageResult?.MEDICO }}
                                </p>
                                <p class="text-results" style="color: #ff8201;">Imagen</p>
                              </div>
                              <div class="col-3 d-flex flex-column flex-md-row justify-content-end">
                                <div class="cursor-pointer" title="Ver imagen" style="display: inline-block;"
                                     @click.exact="goToZeroCtrlItem(imageResult)"
                                     @click.ctrl="goToZeroCtrlItem(imageResult)">
                                  <div class="p-2 p-md-4">
                                    <font-awesome-icon :icon="['fas', 'desktop']" size="2x"
                                                       class="icon-device"/>
                                  </div>
                                </div>
                                <div class="cursor-pointer" title="Ver informe"
                                     style="display: inline-block;"
                                     @click.exact="goToImageResult(imageResult)"
                                     @click.ctrl="goToImageResultCtrl(imageResult)">
                                  <div class="p-2 p-md-4">
                                    <font-awesome-icon :icon="['fas', 'eye']" size="2x"
                                                       class="icon-device"/>
                                  </div>
                                </div>
                                <div class="cursor-pointer" title="Descargar informe"
                                     style="display: inline-block;"
                                     @click="downloadImageFile(imageResult)">
                                  <div class="p-2 p-md-4">
                                    <font-awesome-icon :icon="['fas', 'download']" size="2x"
                                                       class="icon-device"/>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="text-center py-3" v-if="isLoadingMoreImage">
                              <p class="title-results " style="font-size: medium;"><b>Cargando más resultados de
                                imagen...</b></p>
                            </div>
                          </template>
                          <template v-else>
                            <div class=" my-3 py-3  text-center">
                              <h4 class="center text-search">
                                No tienes resultados de imagen.
                              </h4>
                            </div>
                          </template>
                        </template>
                        <template v-else>
                          <div @click.exact="goToZeroCtrl()" @click.ctrl="goToZeroCtrl()"
                               class=" my-1 p-4 row text-left border-result hover-list-element cursor-pointer">
                            <p class="title-results m-4"><b>Ver Exámenes (Zero FootPrint GE)</b>
                            </p>
                          </div>
                          <div @click="seeImages = true;"
                               class=" my-1 p-4 row cursor-pointer text-left border-result hover-list-element">
                            <p class="title-results m-4"><b>Ver Informes</b>
                            </p>
                          </div>
                        </template>

                      </template>


                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterMedico/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-link {
  padding: 0.5rem 1rem 0.4rem 0 !important;
}

.pill {
  border-radius: 15px;
  background-color: #ff8201;
  color: white;
  font-weight: 500
}

.select-result {
  height: 50px;
  border: 1px solid #e6eaee;
  box-shadow: 0px 6px 20px rgb(10 30 80 / 15%);
}

.cursor-pointer {
  cursor: pointer;
}

p.text-results {
  color: #6b6969;
  margin-bottom: 4px;
}

p.title-results {
  color: #05305d;
}

img.img-metrovirtual {
  width: 160px;
  height: 20px;
}

.text-icon-color {
  text-align: center;
  color: #05305d;
  font-weight: 600;
  line-height: 18px;
}

.border-result {
  border: 1px solid #e6eaee;
  box-shadow: 0px 6px 20px rgb(10 30 80 / 15%);
  border-radius: 6px;
  margin-top: 25px !important;
  background: white;
  padding-top: 15px !important;
  padding-left: 7px;
}

.row.d-block:hover {
  background: #0B72D8 !important;
}


.img-icon-color {
  width: 105px;
  height: 105px;
  margin: 0 auto;
  display: block;
  padding: 20px;
  margin-top: 1px;
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

.nav-tabs .nav-link.active {
  color: #05305d !important;
  background-color: #f8f9fc;
  border-color: #f8f9fc;
  font-size: 18px;
  font-weight: 700;
  border-bottom: 3px solid #2392da !important;
}

.nav-tabs .nav-link {
  color: #818181 !important;
  background-color: #f8f9fc;
  border-color: #f8f9fc;
  font-size: 18px;
  font-weight: 700;
  border-radius: 2px;
}

h4.text-header {
  padding-left: 10%;
  margin-top: 14%;
}

h4.center.text-search {
  color: #818181 !important;
  font-weight: 500 !important;
  margin-top: 12%;
  padding-bottom: 8%;
}

.text-search span {
  color: #1d74d4;
  font-size: 1.8rem;
  font-weight: 600;
}

h3.title-search {
  color: #1d74d4;
}

input.search {
  height: 55px;
  width: 100%;
  border-radius: 20px;
  border: 2px solid #989899;
}

.icon-device {
  color: #05305d;
  cursor: pointer;
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
.btn-search {
  background: linear-gradient(90deg, rgba(11, 114, 216, 1) 0%, rgba(42, 157, 255, 1) 0%, rgba(11, 114, 216, 1) 100%) !important;
  border-radius: 50px;
  min-width: 100%;
  height: 50px;
  padding: 15px 20px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  transition: all .30s linear;
  margin-top: -50px;
}
/*
 * Hide the last image on hover
*/
.img-border:hover > img:last-of-type {
  opacity: 0;
}

.text-headerv2 {
  font-size: 16px;
}

.hover-list-element:hover {
  background-color: #edf6fb;
  box-shadow: 0px 6px 20px rgb(10 30 80 / 15%);
}

.btn-red {
  background: red !important;
  width: 100%;
  color: #fff;
  padding: 9px 20px;
  min-width: 100%;
  text-align: center;
  border-radius: 20px;
  border: none;
}

.btn-red:hover {
  background: red !important;
  transition: all .30s linear;
}

</style>
