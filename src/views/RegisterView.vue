<script setup>
import { useAuthStore } from "../stores/auth";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useNotification } from "@kyvg/vue3-notification";
import {medicAuthSetToken, patientAuthAccount, patientAuthLogin, patientAuthValidate} from "../services/medicAuth";

const { notify } = useNotification();
const router = useRouter();

const authStore = useAuthStore();
// const user = computed(() => authStore.user);
let location = ref("login");
let language = ref("es");

const loginForm = ref({
  DNI: null,
  PASS: null
});
const valid = ref(false);

const validate = async () => {
  console.log('form', loginForm.value);
  try {
    location.value = 'loading';
    const authResponse = await patientAuthValidate(loginForm.value);
    console.log('authResponseValidate', authResponse);
    if (authResponse.status) {
      location.value = 'login';
      valid.value = authResponse.account;
    } else {
      valid.value =  false;
      location.value = 'login';
      notify({
        title: "Usuario invalido",
        text: authResponse.message,
        type: 'error'
      });
    }
  } catch (e) {
    location.value = 'login';
    console.log('e', e);
  }
}
const login = async () => {
  console.log('form', loginForm.value);
  try {
    location.value = 'loading';
    const authResponse = await patientAuthLogin(loginForm.value);
    console.log('authResponseLogin', authResponse);
    if (authResponse.status) {
      console.log('authResponse.user_token', authResponse.user_token);
      await authStore.setToken(authResponse.user_token);
      await medicAuthSetToken(authResponse.user_token);
      const accountResponse = await patientAuthAccount();
      location.value = 'login';
      if(accountResponse.status){
        notify({
          title: "Credenciales correctas",
          text: authResponse.message,
          type: 'success'
        });
        await authStore.setUser(accountResponse.data);
      }else{
        notify({
          title: "No hay account",
          text: accountResponse.message,
          type: 'error'
        });
      }
      console.log('accountResponse', accountResponse);
      await router.push({name: 'dashboard'});

    } else {
      location.value = 'login';
      //valid.value =  false;
      notify({
        title: "Credenciales invalidas",
        text: authResponse.message,
        type: 'error'
      });
    }
  } catch (e) {
    location.value = 'login';
    console.log('e', e);
  }
}

const goTo = async (name) => {
  await router.push({name: name});

};

onMounted(async () => {

});
</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>Registro - MetroVirtual - Hospital Metropolitano</title>
    </teleport>
    <div class="d-flex flex-column flex-grow-1 justify-content-center align-items-center py-1"
         style="background-color: #f8f9fc;">
      <div class="container m-auto ml-2">
        <div class="row mb-5 mb-md-2 justify-content-center">
          <!--columna de inputs-->
          <form class=" col-12 col-md-7 px-3 mb-0 mb-md-4">
            <div class=" my-4 row">
              <div class="col-md-8 col-lg-6 col-10 mt-4">
                <img class="img-metrovirtualv1" src="@/assets/metrovirtual_logo.svg" alt="Mundometro icon"
                     width="100%" height="auto ">
                <div class="row">
                  <div class="col d-flex pt-2">
                    <img class="icono-user" src="@/assets/icon-pacientes.png"
                         alt="Mundometro icon" width="30px" height="28px">
                    <h3 class="text-principal">{{ language === "es" ? "Pacientes" : "Patients" }}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-md-10 col-lg-8 gray-color text-gray my-2">
                <h5 class="title-li">
                  <b>{{ language === "es" ? "Aquí encontrarás:" : "Here you will find:" }}</b></h5>
                <ul class="ul-option">
                  <li class="li-option">
                    {{ language === "es" ? "Agendar citas" :
                      "Book dates" }}
                  </li>
                  <li class="li-option">
                    {{ language === "es" ? "Resultados de imagen y laboratorio" : "Image and lab results" }}
                  </li>
                  <li class="li-option">
                    {{ language === "es" ? "Mis facturas" : "My invoices" }}
                  </li>
                </ul>
              </div>
            </div>
            <template v-if="location === 'loading'">
              <div class="col-12 col-md-7 col-lg-6 row justify-content-center">
                <img class="loading-gif" src="@/assets/loading.gif"
                     alt="Loading Hm">
              </div>
            </template>
            <template v-if="location === 'login'">
              <div class="form-group my-2 ">
                <div class="row no-gutters no-margin">
                  <div class="col-12 col-md-7 col-lg-6">
                    <input type="text"
                           v-model="loginForm.DNI"
                           class="m-0 p-0 pl-3 form-control"
                           style="border-radius: 50px"
                           required
                           name="user"
                           :disabled="location === 'loading'"
                           :placeholder="language === 'es' ? 'Ingresa tu usuario' : 'Enter your user'">
                  </div>
                  <div class="col-3 col-lg-2">
                  </div>
                </div>
              </div>
              <div class="form-group my-2 " v-if="valid">
                <div class="row no-gutters no-margin">
                  <div class="col-12 col-md-7 col-lg-6">
                    <input type="password"
                           v-model="loginForm.PASS"
                           class="m-0 p-0 pl-3 form-control"
                           style="border-radius: 50px"
                           required name="password"
                           :disabled="location === 'loading'"
                           :placeholder="language === 'es' ? 'Ingresa tu contraseña' : 'Enter your password'"
                           @keyup.enter="login()">
                  </div>
                  <div class="col-3 col-lg-2">
                  </div>
                </div>
              </div>
              <div class="form-group my-2">
                <div class="row no-gutters no-margin">
                  <div class="col-12 col-md-7 col-lg-7 mt-2">
                    <template v-if="!valid">
                      <button class="text-center cursor-pointer pt-2"
                              :class="[loginForm.DNI ? 'btn-loginv3' : 'left-button']"
                              @click="validate()">
                        {{ language === 'es' ? 'Validar' : 'Validate' }}
                      </button>
                    </template>
                    <template v-else>
                      <button class="text-center cursor-pointer pt-2"
                              :class="[loginForm.DNI && loginForm.PASS ? 'btn-loginv3' : 'left-button']"
                              @click="login()">
                        {{ language === 'es' ? 'Ingresar' : 'Log In' }}
                      </button>
                    </template>


<!--                    <span class="span-text mt-2">-->
<!--                      Ingrese con el usuario proporcionado por el hospital seguido de @hmetro.med.ec <br>-->
<!--                      Su contraseña es la misma proporcionada por el hospital.<br>-->
<!--                      Ej: Si su usario es pperez ustede deberá ingresar pperez@hmetro.med.ec-->
<!--                    </span>-->
                  </div>
                  <div class="col-3 col-lg-2">
                  </div>
                </div>
              </div>
              <!--                            <div class="row my-1">-->
              <!--                                <div class="col-12 col-md-6 col-lg-6 cursor-pointer"-->
              <!--                                     @click="forgetUser">-->
              <!--                                    <p class="text-right recover-password cursor-pointer text-reset-password"-->
              <!--                                       translate>-->
              <!--                                        Olvidar usuario en este navegador-->
              <!--                                    </p>-->
              <!--                                </div>-->
              <!--                            </div>-->
            </template>


          </form>
          <!--columna de iframe-->
          <div class="col-12 col-md-5 mb-md-4">
            <div class="px-2 mt-5 pt-8">
              <iframe width="100%" height="300" src="https://www.youtube.com/embed/t0zKd0QUxyY?controls=0"
                      title="MetroVirtual" frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowfullscreen></iframe>
              <p style="text-align: center;">¿Qué es MetroVirtual pacientes?</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-4 mb-md-2 justify-content-center  pb-5 mt-5 my-5">
      <!--columna de text-->
      <div class="termi">
        <div class="mt-2 mt-md-5 justify-content-center">
          <a href="https://www.hospitalmetropolitano.org/es/terminos-y-condiciones-metrovirtual" target="_blank">
            <h5 class="title-terminos">
              Términos y Condiciones
            </h5>
          </a>
        </div>
      </div>
    </div>
    <div class="row mb-4 mb-md-2 justify-content-center  pb-5 mt-5 my-5">
      <!--columna de iconos-->
      <div class=" col-6 col-md-3 d-block pb-5 ">
        <div class="icon-img cursor-pointer" @click="goTo('agendar-cita')">
          <div class="row d-block img-border">
            <span class="color-active"><i class="fa fa-circle" aria-hidden="true"></i></span>
            <img class="img-icon-color" src="@/assets/agendar-blanco.png" alt=" icon">
            <img class="img-icon-color" src="@/assets/agendar.png" alt=" icon" style="margin-top: -105px;">
            <br>
          </div>
          <p class="d-block text-icon-color mt-3">
            Agendar Cita <br>
            <span>*Examen de Imagen</span> <br>
            <span>*Laboratorio a Domicilio</span>
          </p>
        </div>
      </div>

      <!--columna de iconos-->
      <div class=" col-6 col-md-3 d-block pb-5">
        <div class="icon-img cursor-pointer" @click="goTo('buzon-de-sugerencias')">
          <div class="row d-block img-border">
            <img class="img-icon-color" src="@/assets/buzon-blanco.png" alt=" icon">
            <img class="img-icon-color" src="@/assets/buzon.png" alt=" icon" style="margin-top: -105px;">
            <br>
          </div>
          <p class="d-block mt-3 text-icon-color">Buzón<br>
            de Sugerencias
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>


.title-li {
  color: #05305d;
  font-size: 16px
}

ul.ul-option li {
  color: #6b6969;
}

iframe {
  border-radius: 15px;
}

p.services-text {
  font-size: 20px;
  color: #2392da;
  font-weight: 600;
}

.text-reset-password {
  font-size: 13px;
  color: #0d9cde;
}

img.icono-user {
  margin-top: 5px;
  width: 30px;
  height: 28px;
  margin-right: 1rem;
}


/*Icons style*/

h3.text-principal {
  padding-top: 12px;
  color: #14437a;
  letter-spacing: 1px;
  font-size: 22px;

}

.loading-gif {
  width: 150px;
  height: auto;
}

input.form-control {
  height: 50px;
  margin-bottom: 10px !important;
  box-shadow: 0px 6px 20px rgb(10 30 80 / 15%);
  background: white;
  padding: 22px 22px 22px 22px !important;
  border: 1px solid #e6eaee;
}


.text-search span {
  color: #1d74d4;
  font-size: 1.8rem;
  font-weight: 600;
}


input.search {
  height: 55px;
  width: 100%;
  border-radius: 20px;
  border: 2px solid #989899;
}

img.icono-user {
  margin-top: 5px;
}

.row.d-block:hover {
  background: linear-gradient(90deg, rgba(11, 114, 216, 1) 0%, rgba(42, 157, 255, 1) 0%, rgba(11, 114, 216, 1) 100%) !important;
  transition: all .30s linear;
}

.btn-loginv2 {
  background: linear-gradient(90deg, rgba(11, 114, 216, 1) 0%, rgba(42, 157, 255, 1) 0%, rgba(11, 114, 216, 1) 100%) !important;
  border-radius: 0 50px 50px 0 !important;
  min-width: 100%;
  height: 50px;
  padding: 15px 20px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  transition: all .30s linear;
}


.btn-loginv3 {
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
}

.btn-full-loginv2 {
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
}

.btn-loginv2:hover {
  background: linear-gradient(90deg, rgba(42, 157, 255, 1) 0%, rgba(11, 114, 216, 1) 0%, rgba(42, 157, 255, 1) 100%) !important;
  transition: all .30s linear;
}

.btn-full-loginv2:hover {
  background: linear-gradient(90deg, rgba(42, 157, 255, 1) 0%, rgba(11, 114, 216, 1) 0%, rgba(42, 157, 255, 1) 100%) !important;
  transition: all .30s linear;
}

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

.left-button-full {
  background-color: #989899;
  border-radius: 50px;
  height: 50px;
  padding: 15px 20px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  transition: all .30s linear;
}

input.special {
  border-radius: 30px 0px 0px 30px;
}


</style>
