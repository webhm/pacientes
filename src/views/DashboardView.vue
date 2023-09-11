<script setup>
import {useAuthStore} from "../stores/auth";
import {computed} from "vue";
import {useRouter} from "vue-router";

//const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const goTo = async (name) => {
  await router.push({name: name});
};
</script>
<template>
  <div class="justify-content-center py-1"
       style="background-color: #f8f9fc;">
    <teleport to="#page-title">
      <title>Dashboard - Metrovirtual - Hospital Metropolitano</title>
    </teleport>
    <div class="container m-auto d-block">
      <div class="mb-2 mb-md-2 mt-2 ml-3 px-3">
        <div class="row mt-4 ">
          <img class="img-metrovirtuald" src="@/assets/metrovirtual_logo.svg" alt="Mundometro icon"
               width="100%" height="auto ">
        </div>
        <div class="row mt-4">
          <h5 style=" color: #44bdf0; font-size: 20px; font-weight: 500;">Bienvenido/a</h5><br>
        </div>
        <div class="row">
          <p class="title-user" style=" color: #05305d; font-size: 20px; font-weight: 600;">
            Sr/a {{ user?.NOMBRES }} {{ user?.APELLIDOS }}</p><br>
          <!--            <p class="title-user" style=" color: #05305d; font-size: 24px; font-weight: 600;">-->
          <!--              Pablo Aguilar </p><br>-->
        </div>
        <div class="row my-3">
          <p class="black-colorv2" style="font-size: 18px;">¿En que podemos ayudarte hoy?</p>
        </div>
      </div>
    </div>

    <div class="container m-auto d-block">
      <div class="row my-1 my-md-3 justify-content-center">
        <!--columna de resultados-->
        <div class=" col-6 col-md-3 d-block pb-5 ">
          <div class="icon-img cursor-pointer" @click="goTo('resultados-imagen-y-laboratorio')">
            <div class="row d-block img-border">
              <img class="img-icon-color" src="@/assets/resultados-blancos.png"
                   alt=" icon">
              <img class="img-icon-color color-margin" src="@/assets/resultados.png" alt=" icon">
              <br>
            </div>
            <p class="d-block mt-3 text-icon-color">
              Resultados de <br>
              Imagen & <br>
              Laboratorio
            </p>

          </div>
        </div>
        <!--columna de facturas-->
        <div class=" col-6 col-md-3 d-block pb-5">
          <div class="icon-img cursor-pointer" @click="goTo('mis-facturas')">
            <div class="row d-block img-border">
              <img class="img-icon-color" src="@/assets/facturas-blanco.png" alt=" icon">
              <img class="img-icon-color color-margin" src="@/assets/facturas.png" alt=" icon" >
              <br>
            </div>
            <p class="d-block mt-3 text-icon-color pt-3">Mis Facturas
            </p>
          </div>
        </div>
        <!--columna de agendar-->
        <div class=" col-6 col-md-3 d-block pb-5 ">
          <div class="icon-img cursor-pointer" @click="goTo('agendar-cita')">
            <div class="row d-block img-border">
              <span class="color-active"><i class="fa fa-circle" aria-hidden="true"></i></span>
              <img class="img-icon-color" src="@/assets/agendar-blanco.png" alt=" icon">
              <img class="img-icon-color color-margin" src="@/assets/agendar.png" alt=" icon" >
              <br>
            </div>
            <p class="d-block text-icon-color mt-3">
              Agendar Cita <br>
              <span>*Examen de Imagen</span> <br>
              <span>*Laboratorio a Domicilio</span>
            </p>
          </div>
        </div>
        <!--columna de ruta-->
        <div class=" col-6 col-md-3 d-block pb-5 ">
          <div class="icon-img cursor-pointer" @click="goTo('ruta-del-paciente')">
            <div class="row d-block img-border">
              <img class="img-icon-color" src="@/assets/ruta-del-paciente-blanco.png"
                   alt=" icon">
              <img class="img-icon-color color-margin" src="@/assets/ruta-del-paciente.png"
                   alt=" icon" >
              <br>
            </div>
            <p class="dd-block text-icon-color mt-3 pt-3">
              Ruta del Paciente
            </p>
          </div>
        </div>
      </div>
      <div class="row mb-2 justify-content-center  pb-2 my-3">
        <!--columna de planes de egreso-->
        <div class=" col-6 col-md-3 d-block pb-5">
          <div class="icon-img cursor-pointer" @click="goTo('mis-planes-de-egreso')">
            <div class="row d-block img-border">
              <img class="img-icon-color" src="@/assets/post-egresos-blanco.png" alt=" icon">
              <img class="img-icon-color color-margin" src="@/assets/post-egresos.png" alt=" icon" >
              <br>
            </div>
            <p class="d-block mt-3 text-icon-color">Mis Planes<br>
              de Egreso
            </p>
          </div>
        </div>
        <!--columna de iconos-->
        <div class=" col-6 col-md-3 d-block pb-5">
          <div class="icon-img cursor-pointer" @click="goTo('buzon-de-sugerencias')">
            <div class="row d-block img-border">
              <img class="img-icon-color" src="@/assets/buzon-blanco.png" alt=" icon">
              <img class="img-icon-color color-margin" src="@/assets/buzon.png" alt=" icon" >
              <br>
            </div>
            <p class="d-block mt-3 text-icon-color">Buzón<br>
              de Sugerencias
            </p>
          </div>
        </div>
      </div>
      <div class="row mb-4 mb-md-2 justify-content-center  pb-5 my-2">
        <!--columna de text-->
        <div class=" col-12 col-md-4">
          <div class="row mt-2 mt-md-5 justify-content-center">
            <a href="https://www.hospitalmetropolitano.org/es/terminos-condiciones-y-uso-de-medios" target="_blank">
              <h5 class="title-terminos">
                Términos y Condiciones
              </h5>
            </a>
          </div>
        </div>
        <div class=" col-12 col-md-4">
          <div class="row mt-2 mt-md-5 justify-content-center">
            <a href="https://www.hospitalmetropolitano.org/es/politicas-de-privacidad" target="_blank">
              <h5 class="title-terminos">
                Políticas de Privacidad
              </h5>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
