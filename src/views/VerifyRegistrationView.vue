<script setup>
import {useAuthStore} from "../stores/auth";
import {onMounted, computed, ref} from "vue";
import {useRouter} from "vue-router";
import {useNotification} from "@kyvg/vue3-notification";
import {
  medicAuthSetToken,
  patientAuthAccount,
  patientAuthLogin,
  patientAuthValidate,
  patientRegisterValidation
} from "../services/medicAuth";

const {notify} = useNotification();
const router = useRouter();

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const props = defineProps(['token']);
let location = ref("loading");
let token = ref(props.token);
let language = ref("es");
const message = ref(null);

const validate = async () => {
  console.log('token', token.value);
  try {
    location.value = 'loading';
    const authResponse = await patientRegisterValidation(token.value);
    console.log('authResponseValidate', authResponse);
    if (authResponse.status) {
      location.value = 'login';
      message.value = authResponse.message;
      notify({
        title: "Cuenta verificada",
        text: authResponse.message,
        type: 'success'
      });
      await router.replace({name: 'ingreso'});
    } else {
      location.value = 'login';
      message.value = authResponse.message;
      notify({
        title: "Token invalido",
        text: authResponse.message,
        type: 'error'
      });

    }
  } catch (e) {
    location.value = 'login';
    console.log('e', e);
    // notify({
    //   title: "Hubo un error",
    //   text: e,
    //   type: 'error'
    // });
  }
}

const goTo = async (name) => {
  await router.replace({name: name});
};


onMounted(async () => {
  if (token.value) {
    validate();
  } else {
    notify({
      title: "Token invalido",
      text: 'Acción inapropiada',
      type: 'error'
    });
  }
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
                  <b>{{ language === "es" ? "Activación de Usuario" : "User Activation" }}</b></h5>
              </div>
            </div>
            <template v-if="location === 'loading'">
              <div class="col-12 col-md-7 col-lg-6 row justify-content-center">
                <img class="loading-gif" src="@/assets/loading.gif"
                     alt="Loading Hm">
              </div>
            </template>
            <template v-if="location === 'login'">

<!--              <div class="row my-1" v-if="message">-->
<!--                <div class="col-12 col-md-7 col-lg-7 cursor-pointer">-->
<!--                  <p class="text-center recover-password cursor-pointer py-2 text-reset-password">-->
<!--                    {{message}}-->
<!--                  </p>-->
<!--                </div>-->
<!--              </div>-->
              <p class="text-right mb-0">
                Si necesitas soporte o ayuda, llámanos al <a href="tel:1800463876">1800 HMETRO</a> o a nuestro
                <a href="https://api.whatsapp.com/send?text=Necesito%20ayuda&phone=593984789952" target="_blank"><img src="@/assets/whatsapp.png" style="width: 22px;"> Whatsapp</a>
              </p>
              <div class="form-group my-2">
                <div class="row no-gutters no-margin">
                  <div class="col-12 col-md-7 col-lg-7 mt-2">
                    <button class="text-center cursor-pointer pt-2 btn-loginv3"
                            @click="goTo('ingreso')">
                      {{ language === 'es' ? 'Ir al login' : 'Log In' }}
                    </button>
                  </div>
                  <div class="col-3 col-lg-2">
                  </div>
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


</style>
