<script setup>
import {useAuthStore} from "../stores/auth";
import {onMounted, computed, ref} from "vue";
import {useRouter} from "vue-router";
import {useNotification} from "@kyvg/vue3-notification";
import {
  medicAuthSetToken,
  patientAuthAccount,
  patientAuthLogin,
  patientAuthValidate, patientChangePass, patientSendSuccessPasswordEmail,
  patientVerifyValidation
} from "../services/medicAuth";

const {notify} = useNotification();
const router = useRouter();

const authStore = useAuthStore();
const user = computed(() => authStore.user);
let location = ref("change-pass");
let language = ref("es");
const props = defineProps(['token', 'verify']);
let token = ref(props.token);
let verify = ref(props.verify);
let dirty = ref(false);
let message = ref(null);

const loginForm = ref({
  PASS: null,
  PASSCOMFIRM: null
});
const finalForm = ref({
  PASS: null,
  TOKEN: token.value
});
const valid = ref(false);

const validate = async () => {
  console.log('verify', verify.value);
  try {
    const verifyResponse = await patientVerifyValidation(verify.value);
    console.log('verifyResponse', verifyResponse);
    if (verifyResponse.status) {
    } else {
    }
  } catch (e) {
    console.log('e', e);
  }
}
const changePass = async (e) => {
  e.preventDefault();
  if(loginForm.value.PASS === null || loginForm.value.PASSCOMFIRM === null || loginForm.value.PASS !== loginForm.value.PASSCOMFIRM){
    dirty.value = true;
    return;
  }
  dirty.value = false;
  console.log('form', loginForm.value);
  try {
    location.value = 'loading';
    finalForm.value.PASS = loginForm.value.PASS;
    const changePassResponse = await patientChangePass(finalForm.value);
    console.log('changePassResponse', changePassResponse);
    if (changePassResponse.status) {
      message.value = changePassResponse.message;

      notify({
        title: "Contraseña modificada correctamente",
        text: changePassResponse.message,
        type: 'success'
      });
      location.value = 'change-pass';
      await router.replace({name: 'ingreso'});
      try{
        const successEmailResponse = await patientSendSuccessPasswordEmail(changePassResponse);
        console.log('successEmailResponse', successEmailResponse);
      }catch (e) {
        console.log('error ', e);
      }

    } else {
      message.value = changePassResponse.message;
      location.value = 'change-pass';
      //valid.value =  false;
      notify({
        title: "No se pudo cambiar",
        text: changePassResponse.message,
        type: 'error'
      });
    }
  } catch (e) {
    location.value = 'change-pass';
    message.value = e;
    console.log('e', e);
  }
}

const goTo = async (name) => {
  await router.replace({name: name});
};


onMounted(async () => {
  validate();
});
</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>Recuperar contraseña - MetroVirtual - Hospital Metropolitano</title>
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
                  <b>{{ language === "es" ? "Cambia tu contraseña:" : "Reset password:" }}</b></h5>
              </div>
            </div>
            <template v-if="location === 'loading'">
              <div class="col-12 col-md-7 col-lg-6 row justify-content-center">
                <img class="loading-gif" src="@/assets/loading.gif"
                     alt="Loading Hm">
              </div>
            </template>
            <template v-if="location === 'change-pass'">
              <div class="form-group my-2 ">
                <div class="row no-gutters no-margin">
                  <div class="col-12 col-md-7 col-lg-6">
                    <input type="text"
                           v-model="loginForm.PASS"
                           class="m-0 p-0 pl-3 form-control"
                           style="border-radius: 50px"
                           name="pass"
                           :disabled="location === 'loading'"
                           :placeholder="language === 'es' ? 'Ingresa tu nueva contraseña' : 'Enter your new password'">
                  </div>
                  <div class="col-3 col-lg-2">
                  </div>
                </div>
              </div>
              <div class="row my-1 ml-2" v-if="(loginForm.PASS?.length < 6 || loginForm.PASS === null) && dirty">
                <div class="col-12 col-md-6 col-lg-6">
                  <p class="text-right text-error">
                    las contraseñas deben tener mínimo de 6 dígitos
                  </p>
                </div>
              </div>

              <div class="form-group my-2 ">
                <div class="row no-gutters no-margin">
                  <div class="col-12 col-md-7 col-lg-6">
                    <input type="text"
                           v-model="loginForm.PASSCOMFIRM"
                           class="m-0 p-0 pl-3 form-control"
                           style="border-radius: 50px"
                           name="pass"
                           :disabled="location === 'loading'"
                           :placeholder="language === 'es' ? 'Confirma contraseña' : 'confirm your password'">
                  </div>
                  <div class="col-3 col-lg-2">
                  </div>
                </div>
              </div>
              <div class="row my-1 ml-2"
                   v-if="(loginForm.PASSCOMFIRM !== loginForm.PASS || loginForm.PASSCOMFIRM === null) && dirty">
                <div class="col-12 col-md-6 col-lg-6">
                  <p class="text-right text-error">
                    las contraseñas deben ser iguales
                  </p>
                </div>
              </div>
              <div class="row my-1 ml-2"
                   v-if="message">
                <div class="col-12 col-md-6 col-lg-6">
                  <p class="text-right text-error">
                    {{message}}
                  </p>
                </div>
              </div>
              <p class="text-right mb-0">
                Si necesitas soporte o ayuda, llámanos al <a href="tel:1800463876">1800 HMETRO</a> o a nuestro
                <a href="https://api.whatsapp.com/send?text=Necesito%20ayuda&phone=593984789952" target="_blank"><img src="@/assets/whatsapp.png" style="width: 22px;"> Whatsapp</a>
              </p>
              <div class="form-group my-2">
                <div class="row no-gutters no-margin">
                  <div class="col-12 col-md-7 col-lg-7 mt-2">
                    <button class="text-center cursor-pointer pt-2"
                            :class="[loginForm.PASSCOMFIRM === loginForm.PASS && loginForm.PASSCOMFIRM !== null && loginForm.PASSCOMFIRM !== null ? 'btn-loginv3' : 'left-button']"
                            @click="changePass($event)">
                      {{ language === 'es' ? 'Cambiar Contraseña' : 'Change pass' }}
                    </button>
                  </div>
                  <div class="col-3 col-lg-2">
                  </div>
                </div>
              </div>
              <div class="row my-1">
                <div class="col-12 col-md-7 cursor-pointer"
                     @click="goTo('ingreso')">
                  <p class="text-center recover-password cursor-pointer text-reset-password"
                     translate>
                    Ir al login
                  </p>
                </div>
              </div>

            </template>


          </form>
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
  font-size: 15px;
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

.text-error {
  font-size: 14px;
  color: red;
}
</style>
