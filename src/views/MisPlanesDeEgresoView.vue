<script setup>
import FooterMedico from "../components/FooterMedico.vue";
import {useAuthStore} from "../stores/auth";
import {useMyHistoryStore} from "../stores/myHistory";
import {computed, ref, onMounted} from "vue";
import {useRouter} from "vue-router";
import PostEgresoViewer from "../components/PostEgresoViewer.vue";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
//const type = computed(() => authStore.type);
const myHistoryStore = useMyHistoryStore();
const history = computed(() => myHistoryStore.history);
const search = ref(null);
const start = ref(null);
const end = ref(null);
const total = computed(() => myHistoryStore.total);
const limit = computed(() => myHistoryStore.limit);
const offset = computed(() => myHistoryStore.offset);
let isLoading = ref(false);
let isLoadingMore = ref(false);
//const route = useRoute();
const router = useRouter();

const goBack = async () => {
  await myHistoryStore.clearHistory();
  await router.back();
};
const getHistoryForms = async (item, index) => {
  const form = {
    'NHC': user.value.NHC,
    'ADM': item.ATENCION
    //'startDate': '13-04-2023'
  };
  await myHistoryStore.getHistoryCheckouts(index, form);
}

const getHistory = async () => {
  isLoading.value = true;
  myHistoryStore.limit = 25;
  myHistoryStore.offset = 1;
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
  console.log('form', form);
  console.log('value nhc', user.value.NHC);
  await myHistoryStore.getHistory(form);
  isLoading.value = false;
};
const getMoreHistory = async () => {
  try {
    isLoadingMore.value = true;
    document.documentElement.scrollTop -= 5;
    const form = {
      //'endDate':'13-07-2023',
      'limit': limit.value,
      'offset': offset.value,
      //'searchField': '',
      'sortField': 'FACT',
      'sortType': 'desc',
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
    console.log('form', form);
    await myHistoryStore.getMoreHistory(form);
    isLoadingMore.value = false;
  } catch (e) {
    isLoadingMore.value = false;
    console.log('error', e);
  }
};

const goToCheckouts = async (history) => {
  console.log('history', history);
  // let url = router.resolve({
  //   name: "medic-lab-result-view",
  //   params: { url: split[3], nhc: nhc.value },
  //   query: { prev: "resultados" }
  // });
  // window.open(url.href, "_blank");
  await router.push({
    name: "mis-planes-de-egreso",
    params: {adm: history.ADM},
  });
};
const goToCheckoutsCtrl = async (history) => {
  console.log('history', history);
  let url = router.resolve({
    name: "mis-planes-de-egreso",
    params: {adm: history.ADM},
  });
  window.open(url.href, "_blank");
  // await router.push({name: 'medic-lab-result-view', params: {url: split[3], nhc: user.value.NHC}});
};
const getNextHistory = () => {
  window.onscroll = () => {
    if (isLoadingMore.value) return;
    // console.log('document.documentElement.scrollTop', document.documentElement.scrollTop);
    // console.log('window.innerHeight', window.innerHeight);
    // console.log('document.documentElement.offsetHeight', document.documentElement.offsetHeight);
    let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight + 2 >= document.documentElement.offsetHeight;
    console.log('bottomOfWindow', bottomOfWindow);
    if (bottomOfWindow) {
      console.log('is bottom');
      console.log('limit.value', limit.value);
      console.log('offset.value', offset.value);
      console.log('total.value', total.value);
      if (total.value > limit.value) {
        console.log('hay mas datos traerlos, sumarle al offset el limit');
        myHistoryStore.offset += (limit.value);
        getMoreHistory();
      } else {
        console.log('no hay mas datos no hacer nada');
      }
    }
  }
}

onMounted(async () => {
  await getHistory();
  // getNextHistory();
});

</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>Mis Planes de Egreso - Metrovirtual - Hospital Metropolitano</title>
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
                  <img class="img-header-icon ml-3" src="@/assets/post-egresos.png" alt=" icon">
                </div>
                <br>
                <h4 class="d-flex text-headerv2 mt-2"
                    style="text-align:left; color: #05305d; font-weight: 600;">
                  Mis Planes de Egreso
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

              <template v-if="history.length >0">
                <template v-for="(history, i) in history" v-bind:key="i">
                  <div
                      class="p-2 text-left border-result cursor-pointer" @click="getHistoryForms(history, i)">
                    <div class="row">
                      <div class="col-10">
                        <div class="p-3">
                          <p class="title-results title-colapse">
                            <b>Fecha Atención: </b>{{
                              history.FECHA_ATENCION
                            }}
                          </p>
                          <p class="title-results title-colapse">
                            <b>Médico: </b>{{
                              history.MED_FOR
                            }}
                          </p>
                          <p class="title-results title-colapse">
                            <b>Número Historia Clínica: </b>{{
                              history.NHC
                            }}
                          </p>
                          <p class="title-results title-colapse" v-if="history.ATENCION">
                            <b>Número de Atención: </b>{{
                              history.ATENCION
                            }}
                          </p>

                        </div>
                      </div>
                      <div class="col-2">
                        <div class="cursor-pointer" title="Ver resultado"
                             style="display: inline-block;"
                        >
                          <div class="p-2 p-md-4">
                            <font-awesome-icon :icon="['fas', 'eye']" size="2x"
                                               class="icon-device"/>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div :class="{'form-show': history.visible, 'form-hidden': !history.visible, }">
                      <template v-if="history.isLoading">
                        <div class="my-1 p-3 text-center">
                          <img class="img-fluid" src="@/assets/loading.gif"
                               alt="Loading Hm">
                        </div>
                      </template>
                      <template v-else>
                        <div class="p-3">
                          <template v-if="history.forms.length > 0">
                            <post-egreso-viewer :form="history.forms[0]"/>
                          </template>
                          <template v-else>
                            <p>No tienes atenciones recientes</p>
                          </template>

                        </div>
                      </template>
                    </div>
                  </div>
                </template>
                <div class="text-center py-3" v-if="isLoadingMore">
                  <p class="title-results " style="font-size: medium;"><b>Cargando más resultados...</b></p>
                </div>
              </template>
              <template v-else>
                <div class=" my-3 py-3  text-center">
                  <h4 class="center text-search">
                    No tienes atenciones.
                  </h4>
                </div>
              </template>
            </template>

          </div>
        </div>
        <FooterMedico/>
      </div>

    </div>
  </div>
</template>

<style scoped>
.form-show {
  display: block;
}

.form-hidden {
  display: none;
}

</style>
