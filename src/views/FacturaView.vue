<script setup>
import FooterMedico from "../components/FooterMedico.vue";
import { useAuthStore } from "../stores/auth";
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import PdfViewer from "../components/PdfViewer.vue";
import { useNotification } from "@kyvg/vue3-notification";
import {getInvoiceDoc} from "../services/myInvoices";

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const route = useRoute();
const router = useRouter();
const { notify } = useNotification();
const isLoading = ref(false);
const isAvailable = ref(false);
const props = defineProps(["type", "id"]);
const src = ref(null);
const type = ref(props.type);
const id = ref(props.id);
const title = ref("Factura - Metrovirtual - Hospital Metropolitano");

onMounted(() => {
  getUrl();
});

const goBack = () => {
    console.log("route query", route.query);
    if (window.history.state.back === null) {
      router.replace({ name: "mis-facturas" });
    } else {
      router.back();
    }
  }
;

const getUrl = async () => {
  try {
    isLoading.value = true;
    let response = await getInvoiceDoc(type.value, id.value);
    console.log("response", response);
    if (response.status) {
      src.value = response.data._PDF;
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
                  <img class="img-header-icon my-3 my-md-1 ml-3" src="@/assets/facturas-pagadas.png" alt=" icon">
                </div>
                <h4 class="d-flex text-headerv2 mt-2" style="text-align:left; color: #05305d;
                                    font-weight: 600;">
                  Factura
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
                <pdf-viewer :url="src" :nhc="nhc" :name="'factura'" :id="url"
                            :type="'factura'" />
              </template>
              <template v-else>
                <div class=" my-3 py-3  text-center">
                  <h4 class="center text-search">
                    Factura no disponible
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
