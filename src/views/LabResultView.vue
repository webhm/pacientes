<script setup>
import FooterMedico from "../components/FooterMedico.vue";
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { urlDocumento } from "../services/patient";
import { decryptId } from "../services/security";
import PdfViewer from "../components/PdfViewer.vue";
import { useNotification } from "@kyvg/vue3-notification";
import {useAuthStore} from "../stores/auth";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const route = useRoute();
const router = useRouter();
const { notify } = useNotification();
const isLoading = ref(false);
const isAvailable = ref(false);
const props = defineProps(["nhc", "url"]);
const src = ref(null);
const statusPaciente = ref(null);
// const encryptedNhc = ref(props.nhc);
const nhc = ref(user.value.NHC);
const url = ref(props.url);
const title = ref("Resultado de Laboratorio - Metrovirtual - Hospital Metropolitano");

onMounted(() => {
  getUrl(url.value);
});

const goBack = () => {
    console.log("route query", route.query);
    if (window.history.state.back === null) {
      router.replace({ name: "resultados-imagen-y-laboratorio" });
    } else {
      router.back();
    }
  }
;

const getUrl = async (url) => {
  try {
    if (url) {
      isLoading.value = true;
      let response = await urlDocumento(`https://api.hospitalmetropolitano.org/v2/pacientes/resultado/l/?id=${url}`);
      console.log("response", response);
      if (response.status) {
        src.value = response.url;
        isAvailable.value = true;
      } else {
        isAvailable.value = false;
        notify({
          title: "El archivo no esta disponible",
          text: response.message,
          type: "error"
        });

      }
      isLoading.value = false;
      console.log("src.value", src.value);
    }
  } catch (e) {
    console.log("error", e);
    isLoading.value = false;
    isAvailable.value = false;
    notify({
      title: "El archivo no esta disponible",
      text: e.message,
      type: "error"
    });
    if(e.message === 'Unauthorized'){
      await authStore.logout();
      await router.replace({ name: "ingreso" });
    }
  }
};
</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>{{title}}</title>
    </teleport>
    <div class="justify-content-center py-1" style="background-color: rgb(229 237 241);">
      <!--login section-->
      <div class="container m-auto d-block">
        <div class="row my-1 justify-content-center">
          <!--columna de text-->
          <div class=" col-6 " @click="goBack()">
            <div class="row mt-3">
              <h5 class="cursor-pointer ml-3" style=" color: #0f4470; font-size: 16px;">
                <font-awesome-icon :icon="['fas', 'chevron-left']" />
                Regresar
              </h5>
            </div>
          </div>
          <div class="col-6">
            <div class="d-block py-1">
              <div class="d-flex justify-content-end">
                <div class="img-div">
                  <img class="img-header-icon my-3 my-md-1 ml-3" src="@/assets/resultados.png" alt=" icon">
                </div>
                <h4 class="d-flex text-headerv2 mt-2" style="text-align:left; color: #05305d;
                                    font-weight: 600;">
                  Resultado de laboratorio <br>
                  {{ statusPaciente?.NOMBRE_PACIENTE }}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="justify-content-center py-2" style="background-color: #f8f9fc;">
      <div class="container m-auto d-block " style="background: #f8f9fc;">
        <div class="row my-2 pb-5 pt-1">
          <div class="col-sm-12">
            <template v-if="isLoading">
              <div class="d-flex justify-content-center">
                <img class="img-fluid" src="@/assets/loading.gif" alt="Loading Hm">
              </div>
            </template>
            <template v-else>
              <template v-if="isAvailable">
                <pdf-viewer :url="src" :nhc="nhc" :name="'resultado_laboratorio'" :id="url"
                            :type="'laboratorio'" :share="false"/>
              </template>
              <template v-else>
                <div class=" my-3 py-3  text-center">
                  <h4 class="center text-search">
                    Resultado de Laboratorio no disponible
                  </h4>
                </div>
              </template>
            </template>
          </div>
        </div>
        <FooterMedico />
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
