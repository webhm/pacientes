<script setup>
import FooterMedico from "../components/FooterMedico.vue";
import { useAuthStore } from "../stores/auth";
import { useMyInvoicesStore } from "../stores/myInvoices";
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {notify} from "@kyvg/vue3-notification";
import {getInvoiceDoc} from "../services/myInvoices";
import dayjs from "dayjs";

const authStore = useAuthStore();
const user = computed(() => authStore.user);
// invoice stuff
const myInvoicesStore = useMyInvoicesStore();
const invoices = computed(() => myInvoicesStore.invoices);
const total = computed(() => myInvoicesStore.total);
const limit = computed(() => myInvoicesStore.limit);
const offset = computed(() => myInvoicesStore.offset);
const search = ref(null);
const start = ref(null);
const end = ref(null);
let isLoading = ref(false);
let isLoadingMore = ref(false);
//const route = useRoute();
const router = useRouter();

const goBack = async () => {
  await myInvoicesStore.clearInvoices();
  await router.back();
};

const getInvoices = async () => {
  try{
    isLoading.value = true;
    myInvoicesStore.limit = 25;
    myInvoicesStore.offset = 1;
    const form = {
      //'endDate':'13-07-2023',
      'limit': limit.value,
      'offset': offset.value,
      //'searchField': '',
      'sortField': 'FECHA_FACTURA',
      'sortType': 'desc',
      //'startDate': '13-04-2023'
    };
    if(search.value != null){
      form['searchField'] = search.value;
    }
    if(start.value != null){
      form['startDate'] = start.value;
    }
    if(end.value != null){
      form['endDate'] = end.value;
    }
    await myInvoicesStore.getInvoices(form);
    isLoading.value = false;
  }catch (e) {
    isLoading.value = false;
    console.log('error', e);
  }
};
const getMoreInvoices = async () => {
  try {
    isLoadingMore.value = true;
    const form = {
      //'endDate':'13-07-2023',
      'limit': limit.value,
      'offset': offset.value,
      //'searchField': '',
      'sortField': 'FECHA_FACTURA',
      'sortType': 'desc',
      //'startDate': '13-04-2023'
    };
    if(start.value != null){
      form['startDate'] = start.value;
    }
    if(end.value != null){
      form['endDate'] = end.value;
    }
    await myInvoicesStore.getMoreInvoices(form);
    isLoadingMore.value = false;
  } catch (e) {
    isLoadingMore.value = false;
    console.log('error', e);
  }
};

const downloadInvoice = (invoice) => {
  if (invoice.FACT) {
    notify({
      title: "Listo",
      text: "Se procederá con la descarga en unos segundos",
      type: "info"
    });
    getInvoiceDoc(invoice.TIPO, invoice.FACT).then(async (response) => {
      console.log('res', response);
      if (response.status) {
        const link = document.createElement("a");
        link.setAttribute("href", response.url);
        link.setAttribute("target", "_blank");
        const d = new Date();
        link.setAttribute("download", `${invoice.FACT}_${d.getTime()}.pdf`);
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        notify({
          title: "Listo",
          text: "Factura descargada",
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
const getNextInvoices = () => {
  window.onscroll = () => {
    // console.log('document.documentElement.scrollTop', document.documentElement.scrollTop);
    // console.log('window.innerHeight', window.innerHeight);
    // console.log('document.documentElement.offsetHeight', document.documentElement.offsetHeight);
    let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.offsetHeight;
    console.log('bottomOfWindow', bottomOfWindow);
    if (bottomOfWindow) {
      console.log('is bottom');
      console.log('limit.value', limit.value);
      console.log('offset.value', offset.value);
      if(total.value > limit.value){
        console.log('hay mas datos traerlos, sumarle al offset el limit');
        myInvoicesStore.offset += limit.value;
        getMoreInvoices();
      }else{
        console.log('no hay mas datos no hacer nada');
      }
    }
  }
}

const goToInvoice = async (invoice) => {
  // let url = router.resolve({
  //   name: "medic-lab-result-view",
  //   params: { url: split[3], nhc: nhc.value },
  //   query: { prev: "resultados" }
  // });
  // window.open(url.href, "_blank");
  await router.push({
    name: "invoice-view",
    params: {type: invoice.TIPO, id: invoice.FACT},
  });
};
const goToInvoiceCtrl = async (invoice) => {
  let url = router.resolve({
    name: "invoice-view",
    params: {type: invoice.TIPO, id: invoice.FACT},
  });
  window.open(url.href, "_blank");
  // await router.push({name: 'medic-lab-result-view', params: {url: split[3], nhc: user.value.NHC}});
};

onMounted(async () => {
  const now = dayjs();
  end.value = now.format('YYYY-MM-DD');
  start.value = now.subtract(6, 'month').format('YYYY-MM-DD');
  await getInvoices();
  getNextInvoices();
});

</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>Mis Facturas - Metrovirtual - Hospital Metropolitano</title>
    </teleport>
    <div class="justify-content-center py-1" style="background-color: rgb(229 237 241);">
      <!--login section-->
      <div class="container m-auto d-block">
        <div class="row mb-2  mt-2 justify-content-center">
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
                  <img class="img-header-icon ml-3" src="@/assets/facturas-pagadas.png" alt=" icon">
                </div>
                <br>
                <h4 class="d-flex text-headerv2 mt-2"
                    style="text-align:left; color: #05305d; font-weight: 600;">
                  Mis Facturas
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
            <div class="row justify-content-end">
              <div class="col-12 col-md-2">
                <p class="title-results"><b>Filtro por fechas:</b></p>
              </div>
              <div class="col-12 col-md-3">
                <label class="text-label " style="margin-top: -30px; display: block;">Desde:</label>
                <input type="date" v-model="start"
                       class="mt-1 form-control"
                       @keyup.enter="getInvoices()"
                       required>
              </div>
              <div class="col-12 col-md-3">
                <label class="text-label " style="margin-top: -30px; display: block;">Hasta:</label>
                <input type="date" v-model="end"
                       class="mt-1 form-control"
                       @keyup.enter="getInvoices()"
                       required>
              </div>
              <div class="col-12 col-md-2">
                <button class="text-center cursor-pointer pt-2 btn-search"
                        @click="getInvoices()">
                  Filtrar
                </button>
              </div>
            </div>
            <template v-if="isLoading">
              <div class="my-1 p-3 text-center">
                <img class="img-fluid" src="@/assets/loading.gif"
                     alt="Loading Hm">
              </div>
            </template>
            <template v-else>
              <template v-if="invoices.length > 0">

                <div class=" m-1 p-3 row text-left border-result hover-list-element"
                     v-for="(invoice, invoiceKey) in invoices"
                     :key="invoiceKey">
                  <div class="col-9 my-3">
                    <p class="title-results ">
                      <b>N° de Factura: {{ invoice?.FACT }}</b>
                    </p>

                    <p class="text-results"><b>Fecha:</b> {{ invoice?.FECHA_FACTURA }}</p>
                    <p class="text-results"><b>Pagador:</b> {{ invoice?.PAGADOR }}</p>
                    <p class="text-results"><b>Factura Total:</b> $ {{ invoice?.TOTAL }}</p>
                  </div>
                  <div class="col-3 d-flex justify-content-center">
                    <div class="cursor-pointer" title="Ver factura"
                         style="display: inline-block;"
                         @click.exact="goToInvoice(invoice)"
                         @click.ctrl="goToInvoiceCtrl(invoice)">
                      <div class="p-2 p-md-4">
                        <font-awesome-icon :icon="['fas', 'eye']" size="2x"
                                           class="icon-device"/>
                      </div>
                    </div>
                    <div @click="downloadInvoice(invoice)"
                      class="cursor-pointer"
                      :title="`Descargar factura`">
                      <div class="p-0 p-md-4 py-md-6">
                        <font-awesome-icon :icon="['fas', 'download']" size="2x"
                                           class="icon-device" />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class=" my-1 p-3  text-center">
                  <h4 class="center text-search">
                    No tienes facturas disponibles
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
</style>
