import { createRouter, createWebHistory } from "vue-router";


import IngresoView from "../views/IngresoView.vue";
import LostPassView from "../views/LostPassView.vue";
import VerifyRegistrationView from "../views/VerifyRegistrationView.vue";
import DashboardView from "../views/DashboardView.vue";
import ResultadosImagenLaboratorioView from "../views/ResultadosImagenLaboratorioView.vue";
import LabResultView from "../views/LabResultView.vue";
import ShareLabResultView from "../views/ShareLabResultView.vue";
import ImageResultView from "../views/ImageResultView.vue";
import ShareImageResultView from "../views/ShareImageResultView.vue";
import ZeroView from "../views/ZeroView.vue";
import ShareZeroView from "../views/ShareZeroView.vue";
import ZeroItemView from "../views/ZeroItemView.vue";
import ShareZeroItemView from "../views/ShareZeroItemView.vue";
import BuzonDeSugerenciasView from "../views/BuzonDeSugerenciasView.vue";
import MiPerfilView from "../views/MiPerfilView.vue";
import MisPacientesView from "../views/RutaDelPaciente.vue";
import MisFacturasView from "../views/MisFacturasView.vue";
import FacturaView from "../views/FacturaView.vue";
import MisPlanesDeEgresoView from "../views/MisPlanesDeEgresoView.vue";
import AgendarCitaView from "../views/AgendarCitaView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import { useAuthStore } from "../stores/auth";
import { computed } from "vue";
import { medicAuthSetToken } from "../services/medicAuth";
import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();

let language = "es";
const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
  routes: [
    // medicos
    //medic login
    // will match everything and put it under `$route.params.pathMatch`
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFoundView,
      meta: {
        authRequired: false,
        userType: "generic"
      }
    },
    {
      path: language === "es" ? "/ingreso" : "/login",
      name: "ingreso",
      component: IngresoView,
      meta: {
        authRequired: false,
      }
    },
    {
      path: language === "es" ? "/verify/registration/:token" : "/verify/registration/:token",
      name: "verify-registration",
      component: VerifyRegistrationView,
      props: true,
      meta: {
        authRequired: false,
      }
    },
    {
      path: language === "es" ? "/lost-pass/:token/:verify" : "/lost-pass/:token/:verify",
      name: "lost-pass",
      component: LostPassView,
      props: true,
      meta: {
        authRequired: false,
      }
    },
    // //Ruta del paciente
    {
      path: language === "es" ? "/ruta-del-paciente" : "/route-patients",
      name: "ruta-del-paciente",
      component: MisPacientesView,
      meta: {
        authRequired: true,
      }
    },
    // patient zerofootprint view / medic
    {
      path: "/zerofootprint",
      name: "zerofootprint-view",
      component: ZeroView,
      props: true,
      meta: {
        authRequired: true,
      }
    },
    // share patient zerofootprint view / medic
    {
      path: "/compartir/zerofootprint/:nhc",
      name: "share-zerofootprint-view",
      component: ShareZeroView,
      props: true,
      meta: {
        authRequired: false,
      }
    },
    // // patient zerofootprint view / medic
    {
      path: "/zerofootprint-item/:id",
      name: "zerofootprint-item-view",
      component: ZeroItemView,
      props: true,
      meta: {
        authRequired: true,
      }
    },
    // share patient zerofootprint view / medic
    {
      path: "/compartir/zerofootprint-item/:id",
      name: "share-zerofootprint-item-view",
      component: ShareZeroItemView,
      props: true,
      meta: {
        authRequired: false,
      }
    },
    // // patient invoice / medic
    {
      path: language === "es" ? "/factura/:type/:id" : "/invoice/:type/:id",
      name: "invoice-view",
      component: FacturaView,
      props: true,
      meta: {
        authRequired: true,
      }
    },
    // // patient lab result / medic
    {
      path: language === "es" ? "/laboratorio/:url" : "/lab/:url",
      name: "lab-result-view",
      component: LabResultView,
      props: true,
      meta: {
        authRequired: true,
      }
    },
    // // patient image result / medic
    {
      path: language === "es" ? "/imagen/:url" : "/image/:url",
      name: "image-result-view",
      component: ImageResultView,
      props: true,
      meta: {
        authRequired: true,
      }
    },
    // // share lab result / medic
    {
      path: language === "es" ? "/compartir/:nhc/laboratorio/:url" : "/share/:nhc/lab/:url",
      name: "share-lab-result-view",
      component: ShareLabResultView,
      props: true,
      meta: {
        authRequired: false,
      }
    },
    // // share image result / medic
    {
      path: language === "es" ? "/compartir/:nhc/imagen/:url" : "/share/:nhc/image/:url",
      name: "share-image-result-view",
      component: ShareImageResultView,
      props: true,
      meta: {
        authRequired: false,
      }
    },
    // //patients medic results
    {
      path: language === "es" ? "/resultados-imagen-y-laboratorio/" : "/image-and-lab-results/",
      name: "resultados-imagen-y-laboratorio",
      component: ResultadosImagenLaboratorioView,
      // props: true,
      meta: {
        authRequired: true,
      }
    },

    // //Agendar cita
    {
      path: language === "es" ? "/agendar-cita" : "/schedule-appointment",
      name: "agendar-cita",
      component: AgendarCitaView,
      meta: {
        authRequired: false,
      }
    },
    // //mis facturas
    {
      path: language === "es" ? "/mis-facturas" : "/my-invoices",
      name: "mis-facturas",
      component: MisFacturasView,
      meta: {
        authRequired: true,
      }
    },
    // // //mis notas de egreso
    // {
    //   path: language === "es" ? "/mi-historial-de-atenciones" : "/my-history",
    //   name: "my-history",
    //   component: MiHistorialAtencionesView,
    //   meta: {
    //     authRequired: true,
    //   }
    // },
    // //mis notas de egreso
    {
      path: language === "es" ? "/mis-planes-de-egreso" : "/my-checkouts",
      name: "mis-planes-de-egreso",
      component: MisPlanesDeEgresoView,
      meta: {
        authRequired: true,
      }
    },

    // // my profie medic
    {
      path: language === "es" ? "/mi-perfil" : "/my-profile",
      name: "mi-perfil",
      component: MiPerfilView,
      meta: {
        authRequired: true,
      }
    },
    // //general
    // //dashboard
    {
      path: "/",
      name: "dashboard",
      component: DashboardView,
      meta: {
        authRequired: true,
      }
    },
    // //buzon
    {
      path: language === "es" ? "/buzon-de-sugerencias" : "/suggestions-mailbox",
      name: "buzon-de-sugerencias",
      component: BuzonDeSugerenciasView,
      meta: {
        authRequired: false,
      }
    }
  ]
});
router.beforeEach(async (to, from, next) => {

  const authStore = useAuthStore();
  const storeUser = computed(() => authStore.user);
  const storeToken = computed(() => authStore.token);
  const token = localStorage.getItem('patientMetrovirtualToken');
  const user = JSON.parse(localStorage.getItem('patientMetrovirtualUser'));
  console.log("user router", storeUser.value);
  console.log("storeToken router", storeToken.value);
  console.log("stored token", token);
  console.log("stored user", user);
  console.log("to", to);
  console.log("to.meta.authRequired", to.meta.authRequired);

  
  if (to.meta.authRequired) {
    console.log("auth es requerido");
    if (token) {
      await medicAuthSetToken(token);
      if(!storeToken.value){
        await authStore.setToken(token);
      }
      if (!user.value) {
        //  si no hayuser actualizo
        await authStore.setUser(user);
      }
      next();
    } else {
      //console.log("no hay token, volver a login", token);
      next({
        name: "ingreso"
      });
    }
  } else {
    if (to.name === "ingreso") {
      if (token) {
        next({
          name: "dashboard"
        });
      }
    }
    console.log("auth no es requerido");
    next();
  }
});

export default router;
