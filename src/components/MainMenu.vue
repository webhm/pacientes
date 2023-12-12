<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { computed, onMounted, ref } from "vue";

const router = useRouter();
const authStore = useAuthStore();
const user = computed(() => authStore.user);
const language = ref("es");
const opened = ref(false);

const logout = async () => {
  try {
    opened.value = !opened.value;
    await authStore.logout();
    await router.replace({ name: "ingreso" });
  } catch (e) {
    console.log("error", e);
  }
};
const goTo = async (name) => {
  opened.value = !opened.value;
  await router.replace({
    name: name
  }).catch((e) => {
    console.log("e", e);
  });
};
const hashCode = (string) => {
  let hash = 0,
    i, chr;
  if (string.length === 0) return hash;
  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};
const hash = computed(() => hashCode(user.value?.name ? user.value?.name : "123456"));
onMounted(() => {

});
</script>

<template>
  <div class="inside-menu text-white">
    <div @click="goTo('mi-perfil')"
         class="cursor-pointer p-3 d-flex justify-content-center item-first">
      <img class="icon icon--small mx-2"
           src="@/assets/icon-pacientes-blanco.png" width="24" height="22"
           alt="perfil">
      <span
        class="">{{
          language === "es" ? "Mi Perfil" : "My Profile"
        }}</span>
    </div>
    <template v-if="user">

      <div @click="goTo('resultados-imagen-y-laboratorio')"
           class="cursor-pointer p-2 d-flex justify-content-end item-header">
        <img class="icon icon--small my-3 mx-2"
             src="@/assets/icon-menu-rersultados.png"
             width="22" height="25" alt="Phone">
        <span class="inside-item p-2 mx-2">{{
            language === "es" ? "Resultados de Imagen y Laboratorio" : "Image and Lab Results"
          }}</span>
      </div>

      <div @click="goTo('mis-facturas')"
           class="cursor-pointer p-2 d-flex justify-content-end item-header">
        <img class="icon icon--small my-2 mx-2"
             src="@/assets/icon-menu-factura.png"
             width="25" height="28" alt="Phone">
        <span
            class="inside-item p-2 mx-2">{{
            language === "es" ? "Mis Facturas" : "My Invoices"
          }}</span>
      </div>

<!--      <div @click="goTo('agendar-cita')"-->
<!--           class="cursor-pointer p-2 d-flex justify-content-end item-header">-->
<!--        <img class="icon icon&#45;&#45;small my-2 mx-2"-->
<!--             src="@/assets/icon-menu-agendar.png"-->
<!--             width="23" height="26" alt="Phone">-->
<!--        <span-->
<!--            class="inside-item p-2 mx-2">{{-->
<!--            language === "es" ? "Agendar Cita" : "Make An Appointment"-->
<!--          }}</span>-->
<!--      </div>-->

<!--      <div @click="goTo('ruta-del-paciente')"-->
<!--           class="cursor-pointer p-2 d-flex justify-content-end item-header">-->
<!--        <img class="icon icon&#45;&#45;small my-2 mx-2"-->
<!--             src="@/assets/ruta-del-paciente.png"-->
<!--             width="23" height="26" alt="Phone">-->
<!--        <span-->
<!--            class="inside-item p-2 mx-2">{{-->
<!--            language === "es" ? "Ruta del Paciente" : "Patient Path"-->
<!--          }}</span>-->
<!--      </div>-->

<!--      <div @click="goTo('mis-planes-de-egreso')"-->
<!--           class="cursor-pointer p-2 d-flex justify-content-end item-header">-->
<!--        <img class="icon icon&#45;&#45;small my-2 mx-2"-->
<!--             src="@/assets/post-egresos.png"-->
<!--             width="23" height="26" alt="Phone">-->
<!--        <span-->
<!--            class="inside-item p-2 mx-2">{{-->
<!--            language === "es" ? "Mis Planes de Egreso" : "My Checkout Plans"-->
<!--          }}</span>-->
<!--      </div>-->

<!--      <div @click="goTo('buzon-de-sugerencias')"-->
<!--           class="cursor-pointer p-2 d-flex justify-content-end item-header">-->
<!--        <img class="icon icon&#45;&#45;small my-2 mx-2"-->
<!--             src="@/assets/icon-menu-buzon.png"-->
<!--             width="25" height="28" alt="Phone">-->
<!--        <span-->
<!--            class="inside-item p-2 mx-2">{{-->
<!--            language === "es" ? "Buzón de Sugerencias" : "Suggestions Mailbox"-->
<!--          }}</span>-->
<!--      </div>-->

      <div @click="logout()"
           class="cursor-pointer p-2 d-flex justify-content-end item-header"
           style="border-bottom-right-radius: 15px; border-bottom-left-radius: 15px;">
        <img class="icon icon--small my-2 mx-2"
             src="@/assets/icon-menu-logout.png"
             width="22" height="25" alt="Phone">
        <span class="inside-item p-2 mx-2">{{
            language === "es" ? "Cerrar Sesión" : "Log Out"
          }}</span>
      </div>
    </template>
    <template v-else>
      <div @click="goTo('resultados-imagen-y-laboratorio')"
           class="cursor-pointer p-2 d-flex justify-content-end item-header">
        <img class="icon icon--small my-3 mx-2"
             src="@/assets/icon-menu-rersultados.png"
             width="22" height="25" alt="Phone">
        <span class="inside-item p-2 mx-2">{{
            language === "es" ? "Resultados de Imagen y Laboratorio" : "Image and Lab Results"
          }}</span>
      </div>

      <div @click="goTo('mis-facturas')"
           class="cursor-pointer p-2 d-flex justify-content-end item-header">
        <img class="icon icon--small my-2 mx-2"
             src="@/assets/icon-menu-factura.png"
             width="25" height="28" alt="Phone">
        <span
            class="inside-item p-2 mx-2">{{
            language === "es" ? "Mis Facturas" : "My Invoices"
          }}</span>
      </div>

<!--      <div @click="goTo('agendar-cita')"-->
<!--           class="cursor-pointer p-2 d-flex justify-content-end item-header">-->
<!--        <img class="icon icon&#45;&#45;small my-2 mx-2"-->
<!--             src="@/assets/icon-menu-agendar.png"-->
<!--             width="23" height="26" alt="Phone">-->
<!--        <span-->
<!--            class="inside-item p-2 mx-2">{{-->
<!--            language === "es" ? "Agendar Cita" : "Make An Appointment"-->
<!--          }}</span>-->
<!--      </div>-->
<!--      <div @click="goTo('ruta-del-paciente')"-->
<!--           class="cursor-pointer p-2 d-flex justify-content-end item-header">-->
<!--        <img class="icon icon&#45;&#45;small my-2 mx-2"-->
<!--             src="@/assets/ruta-del-paciente.png"-->
<!--             width="23" height="26" alt="Phone">-->
<!--        <span-->
<!--            class="inside-item p-2 mx-2">{{-->
<!--            language === "es" ? "Ruta del Paciente" : "Patient Path"-->
<!--          }}</span>-->
<!--      </div>-->

<!--      <div @click="goTo('mis-planes-de-egreso')"-->
<!--           class="cursor-pointer p-2 d-flex justify-content-end item-header">-->
<!--        <img class="icon icon&#45;&#45;small my-2 mx-2"-->
<!--             src="@/assets/post-egresos.png"-->
<!--             width="23" height="26" alt="Phone">-->
<!--        <span-->
<!--            class="inside-item p-2 mx-2">{{-->
<!--            language === "es" ? "Mis Planes de Egreso" : "My Checkout Plans"-->
<!--          }}</span>-->
<!--      </div>-->


<!--      <div @click="goTo('buzon-de-sugerencias')"-->
<!--           class="cursor-pointer p-2 d-flex justify-content-end item-header">-->
<!--        <img class="icon icon&#45;&#45;small my-2 mx-2"-->
<!--             src="@/assets/icon-menu-buzon.png"-->
<!--             width="25" height="28" alt="Phone">-->
<!--        <span-->
<!--            class="inside-item p-2 mx-2">{{-->
<!--            language === "es" ? "Buzón de Sugerencias" : "Suggestions Mailbox"-->
<!--          }}</span>-->
<!--      </div>-->
    </template>
  </div>
</template>

<style scoped>
.wrapper {
  background-color: white;
  border-radius: 15px;
}

.item-first {
  background: #ff8300;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.inside-item {
  border-bottom: white 1px solid;
  width: 85%
}

.inside-menu {
  background-color: #28b6e8;
  border-radius: 15px;
}

.show-dropdown {
  display: block;
}

.hide-dropdown {
  display: none;
}

.btn-header {
  background: #ff8300;
  border-radius: 15px;
}

.dropdown-item {
  padding: 0.25rem 0.5rem;
}

.card-body {
  padding: 0.5rem !important;
}

.dropdown-item:active {
  background-color: #259ddb !important;
}

.btn:focus, .btn.focus {
  outline: 0;
  box-shadow: none !important;
}


@media screen and (max-width: 600px) {
  button.hamburger.hamburger--slider.hamburger-test {
    display: none;
  }

  .wrapper {
    min-width: 80vw;
  }

  img.icon.icon--small.mr-2.mr-md-2 {
    max-width: 23px;
    height: 26px;
    width: 23px !important;
  }

  img.icon.icon--small.mr-1.mr-md-1 {
    max-width: 24px;
    max-height: 22px;
  }
}

</style>
