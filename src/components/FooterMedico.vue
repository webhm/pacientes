<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const goTo = async (name) => {
  await router.replace({
    name: name
  }).catch((e) => {
    console.log("e", e);
  });
};
</script>

<template>
  <div class="row my-5 justify-content-center">
    <!--columna de iconos-->
    <div class=" col-6 col-md-3 d-block pb-5"
         v-if="authStore.hasRole('PERFIL_MEDICO_PACIENTES') || authStore.hasRole('PERFIL_MEDICO_RESIDENTES')">
      <div class="icon-img cursor-pointer" @click="goTo('mis-pacientes')">
        <div class="row d-block img-border">
          <img class="img-icon-color" src="@/assets/mis-pacientes-blanco.png" alt=" icon">
          <img class="img-icon-color" src="@/assets/mis-pacientes.png" style="margin-top: -105px"
               alt=" icon">
          <br>
        </div>
        <p class="d-block mt-3 text-icon-color">Mis pacientes
        </p>
      </div>
    </div>
    <div class=" col-6 col-md-3 d-block pb-5" v-if="authStore.hasRole('PERFIL_MEDICO_RESULTADOS')">
      <div class="icon-img cursor-pointer"
           @click="goTo('resultados-imagen-y-laboratorio-medicos')">
        <div class="row d-block img-border">
          <img class="img-icon-color" src="@/assets/resultados-blancos.png"
               alt=" icon">
          <img class="img-icon-color" src="@/assets/resultados.png" style="margin-top: -105px"
               alt=" icon">
          <br>
        </div>
        <p class="d-block mt-3 text-icon-color">Resultados de <br>
          imagen & <br>
          laboratorio
        </p>
      </div>
    </div>
    <div class=" col-6 col-md-3 d-block pb-5 " v-if="authStore.hasRole('PERFIL_MEDICO_BDOCU')">
      <a class="icon-img" href="https://appdocumentosdirmed.azurewebsites.net/DM/Inicio"
         target="_blank">
        <div class="row d-block img-border">
          <img class="img-icon-color" src="@/assets/biblioteca-blancov2.png" alt=" icon">
          <img class="img-icon-color" src="@/assets/bibliotecav2.png" style="margin-top: -105px"
               alt=" icon">
          <br>
        </div>
        <p class="d-block mt-3 text-icon-color">Biblioteca de<br>Credenciales
        </p>
      </a>
    </div>
    <div class=" col-6 col-md-3 d-block pb-5 " v-if="authStore.hasRole('PERFIL_MEDICO_HONORARIOS')">
      <div class="icon-img cursor-pointer" @click="goTo('honorarios')">
        <div class="row d-block img-border">
          <img class="img-icon-color" src="@/assets/honorarios-blancos.png" alt=" icon">
          <img class="img-icon-color" src="@/assets/honorarios.png" style="margin-top: -105px"
               alt=" icon">
          <br>
        </div>
        <p class="d-block mt-3 text-icon-color">Mis honorarios
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
