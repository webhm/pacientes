<script setup>
import {useAuthStore} from "../stores/auth";
import {computed, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useNotification} from "@kyvg/vue3-notification";
import {
  medicAuthSetToken,
  patientAuthAccount,
  patientAuthLogin, patientAuthLostPassChange, patientAuthRegister,
  patientAuthValidate,
  patientLostPass,
  patientQuestions, patientSendEmail
} from "../services/medicAuth";
import {sendEmailIco} from "../services/mail";

const {notify} = useNotification();
const router = useRouter();

const authStore = useAuthStore();
const user = computed(() => authStore.user);
let location = ref("login");
let language = ref("es");
const loginForm = ref({
  DNI: null,
  PASS: null
});
const registerForm = ref({
  PASS: null,
  PASSCOMFIRM: null,
});
const selectedQuestions = ref([null, null]);
const selectedAnswers = ref([null, null]);
const valid = ref(false);
const noPassword = ref(false);
const isRegister = ref(false);
const hasQuestions = ref(false);
const emails = ref([]);
const blurredEmails = ref([]);
const error = ref(false);
const errorMessage = ref(null);
const initialError = ref(false);
const goToRegister = ref(false);
const userIsNotActivated = ref(false);
const errorVars = ref({});
const registerStep = ref(1);
const firstStepDirty = ref(false);
const firstStepValid = computed(() => registerForm.value.PASS !== null && registerForm.value.PASSCOMFIRM !== null && registerForm.value.PASS === registerForm.value.PASSCOMFIRM && registerForm.value.PASS?.length > 5);
const secondStepDirty = ref(false);
const firstSelectedQuestionValid = computed(() => selectedQuestions.value[0] !== null && selectedAnswers.value[0] !== null);
const secondSelectedQuestionValid = computed(() => selectedQuestions.value[1] !== null && selectedAnswers.value[1] !== null);
const areDiferentValid = computed(() => selectedQuestions.value[0] !== selectedQuestions.value[1]);
const questions = ref({});
const userQuestions = ref({});
const lostPassDirty = ref(false);
const questionAnswer = ref({});
//livejournalsucks
const goToSecondStepRegister = (e) => {
  e.preventDefault();
  if (!firstStepValid.value) {
    firstStepDirty.value = true;
    return;
  }
  registerStep.value = 2;
}

const register = (e) => {
  e.preventDefault();
  if (!firstSelectedQuestionValid.value || !secondSelectedQuestionValid.value) {
    secondStepDirty.value = true;
    return;
  }
  registerUser();
}
const sendEmail = async (email, token) => {
  try {
    const data = {
      email: email,
      token: token,
      type: 'registration',
    };
    const emailResponse = await patientSendEmail(data);
    console.log('email', emailResponse);
  } catch (e) {
    console.log('e' + email, e);
  }
}
const sendResetVerificationEmail = async (email, token, verify) => {
  try {
    const data = {
      email: email,
      token: token,
      verify: verify,
      type: 'password-reset',
    };
    const emailResponse = await patientSendEmail(data);
    console.log('email', emailResponse);
  } catch (e) {
    console.log('e' + email, e);
  }
}
const goToLostPass = () => {
  location.value = 'lost-pass';
}
const registerUser = async () => {
  try {
    location.value = 'loading';
    const form = {
      DNI: loginForm.value.DNI,
      PASS: registerForm.value.PASS,
    };
    form[selectedQuestions.value[0]] = selectedAnswers.value[0];
    form[selectedQuestions.value[1]] = selectedAnswers.value[1];

    console.log('form', form);
    const registerResponse = await patientAuthRegister(form);
    if (registerResponse.status) {
      notify({
        title: "Registro exitoso",
        text: registerResponse.message,
        type: 'success'
      });
      //TODO: send emails
      const emails = registerResponse.emails;
      const token = registerResponse.verify;
      for (const email of emails) {
        try {
          await sendEmail(email, token);
        } catch (e) {
          console.log('error de email' + email, e);
        }
      }
      isRegister.value = false;
      location.value = 'login';
      isRegister.value = false;
      blurredEmails.value = [];
      emails.value = [];
      errorMessage.value = null;
      location.value = 'login';
      registerForm.value.PASS = null;
      registerForm.value.PASSCOMFIRM = null;
      firstStepDirty.value = false;
      registerStep.value = 1;
      secondStepDirty.value = false;
      selectedQuestions.value = [null, null];
      selectedAnswers.value = [null, null];
    } else {
      if (registerResponse.errorCode === 4011) {
        //registerCount++;
      }
      location.value = 'register';
      notify({
        title: "Hubo un error",
        text: registerResponse.message,
        type: 'error'
      });
    }
  } catch (e) {
    location.value = 'register';
    console.log('e', e);
    notify({
      title: "Hubo un error",
      text: e,
      type: 'error'
    });
  }


}
const backFromRegister = () => {
  isRegister.value = false;
  blurredEmails.value = [];
  emails.value = [];
  errorMessage.value = null;
  location.value = 'login';
  registerForm.value.PASS = null;
  registerForm.value.PASSCOMFIRM = null;
  firstStepDirty.value = false;
}
const backSecondStep = () => {
  registerStep.value = 1;
  secondStepDirty.value = false;
  selectedQuestions.value = [null, null];
  selectedAnswers.value = [null, null];
}
const getFullQuestions = async () => {
  try {
    getUserQuestions();
    const questionsResponse = await patientQuestions(loginForm.value.DNI);
    console.log('questionsResponse', questionsResponse);
    if (questionsResponse.status) {
      questions.value = questionsResponse.data;
      console.log('questions.value', questions.value);
    } else {
      switch (questionsResponse.errorCode) {
          // User has no questions
        case 4014:
          /*  vm.noPassword = true;
            vm.isRegister = false;
            vm.hasQuestions = false;*/
          /*vm.error = 'REQUEST.ERROR.' + data.errorCode;*/
          break;
          // User dont exist
          // TODO: is registering or has no password
        case 4004:
          /*vm.error = 'REQUEST.ERROR.' + data.errorCode;*/
          /* goToSupport();*/
          break;
        default:
          /*vm.error = 'REQUEST.ERROR.' + data.errorCode;*/
      }
    }
  } catch (e) {
    console.log('e', e);
  }
}

const checkIsValid = () => {

  const keys = Object.keys(userQuestions.value);
  console.log('keys chek', keys);
  return !keys.some((key) => {
    return (
        questionAnswer.value[key] === null ||
        questionAnswer.value[key] === undefined ||
        questionAnswer.value[key] === ''
    );
  });
}
const resetPassword = async (event) => {
  try {
    event.preventDefault();
    if (!checkIsValid()) {
      lostPassDirty.value = true;
      return;
    }
    lostPassDirty.value = false;
    location.value = 'loading';
    const form = {
      DNI: loginForm.value.DNI,
    };
    const keys = Object.keys(userQuestions.value);
    keys.forEach((key) => {
      form[key] = questionAnswer.value[key];
    });

    console.log('form', form);
    const resetResponse = await patientAuthLostPassChange(form);

    if (resetResponse.status) {
      notify({
        title: "Reseteo Correcto",
        text: resetResponse.message,
        type: 'success'
      });
      location.value = 'login';
      valid.value = false;
      const emails = resetResponse.emails;
      for (const email of emails) {
        try {
          await sendResetVerificationEmail(email, resetResponse.token, resetResponse.verify);
        } catch (e) {
          console.log('error de email' + email, e);
        }
      }
    } else {
      notify({
        title: "Hubo un error",
        text: resetResponse.message,
        type: 'success'
      });
      if (resetResponse.errorCode === 4007) {

      } else {

      }
    }

  } catch (e) {
    console.log('e', e);
    notify({
      title: "Hubo un error",
      text: e,
      type: 'success'
    });
  }
}

const getUserQuestions = async () => {
  try {
    const userQuestionsResponse = await patientLostPass(loginForm.value.DNI);
    console.log('userQuestionsResponse', userQuestionsResponse);
    if (userQuestionsResponse.status) {
      userQuestions.value = userQuestionsResponse.data;

    } else {
      switch (userQuestionsResponse.errorCode) {

          // User has no questions
        case 4014:
          // vm.showLogin = true;
          // vm.focus.password = true;
          // vm.noPassword = true;
          // vm.isRegister = false;
          // vm.hasQuestions = false;
          /*  vm.isRegister = true;
            vm.showLogin = false;*/
          /*vm.error = 'REQUEST.ERROR.' + data.errorCode;*/
          break;
          // User dont exist
          // TODO: is registering or has no password
        case 4004:
          /*vm.error = 'REQUEST.ERROR.' + data.errorCode;*/
          /* goToSupport();*/
          break;
        default:
          /*vm.error = 'REQUEST.ERROR.' + data.errorCode;*/
      }
    }
  } catch (e) {
    console.log('e', e);
  }
}

const validate = async () => {
  console.log('form', loginForm.value);
  try {
    getFullQuestions();
    location.value = 'loading';
    errorMessage.value = null;
    noPassword.value = false;
    isRegister.value = false;
    hasQuestions.value = false;
    initialError.value = false;
    goToRegister.value = false;
    emails.value = [];
    userIsNotActivated.value = false;
    const authResponse = await patientAuthValidate(loginForm.value);
    console.log('authResponseValidate', authResponse);
    if (authResponse.status) {
      if (authResponse.account) {
        valid.value = authResponse.account;
      } else {
        errorMessage.value = 'No tiene cuenta';
        noPassword.value = true;
        isRegister.value = true;
        emails.value = authResponse.data;
      }
      location.value = 'login';

    } else {
      valid.value = false;
      location.value = 'login';
      switch (authResponse.errorCode) {
          // Usuario no existe
        case 4023:
          noPassword.value = true;
          isRegister.value = true;
          errorMessage.value = 'Usuario no existe';
          notify({
            title: "Usuario no existe",
            text: authResponse.message,
            type: 'error'
          });
          break;
        case 4014:
          //usuario sin preguntas
          //vm.showLogin = true;
          noPassword.value = true;
          isRegister.value = false;
          hasQuestions.value = false;
          errorMessage.value = 'Usuario no tiene preguntas de seguridad';
          notify({
            title: "Usuario no tiene preguntas de seguridad",
            text: authResponse.message,
            type: 'error'
          });
          /*vm.error = 'REQUEST.ERROR.' + data.errorCode;*/
          break;

        case 4006:
          // sin cuenta electronica
          isRegister.value = true;
          blurredEmails.value = authResponse.data;
          emails.value = authResponse.data;
          errorMessage.value = 'Usuario sin cuenta electónica';
          location.value = 'register';
          notify({
            title: "Usuario sin cuenta electónica",
            text: authResponse.message,
            type: 'error'
          });
          /* vm.showLogin = false;*/
          /*vm.error = 'REQUEST.ERROR.' + data.errorCode;*/
          break;
        case 4002:
          errorMessage.value = 'Usuario con error';
          notify({
            title: "Usuario con error",
            text: authResponse.message,
            type: 'error'
          });
          error.value = true;
          break;
        case 4004:
          errorMessage.value = 'Contactar a soporte';
          notify({
            title: "Contactar a soporte",
            text: authResponse.message,
            type: 'error'
          });
          initialError.value = true;
          goToRegister.value = true;
          /* goToSupport();*/
          break;

          // User is registered but has not activated
        case 4007:
          errorMessage.value = authResponse.message;
          notify({
            title: "Usuario inactivo",
            text: authResponse.message,
            type: 'error'
          });
          isRegister.value = false;
          userIsNotActivated.value = true;
          emails.value = authResponse.data;
          console.log('vm.emails', emails.value);
          errorVars.value = {email: authResponse.data};
          break;
          // User exists but there is an error
        default:
          errorMessage.value = 'Hubo un error';
          notify({
            title: "Hubo un error",
            text: authResponse.message,
            type: 'error'
          });
          break;
      }

    }
  } catch (e) {
    location.value = 'login';
    console.log('e', e);
    notify({
      title: "Hubo un error",
      text: e,
      type: 'error'
    });
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
      if (accountResponse.status) {
        notify({
          title: "Credenciales correctas",
          text: authResponse.message,
          type: 'success'
        });
        await authStore.setUser(accountResponse.data);
      } else {
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

const testEmail = async (event) => {
  event.preventDefault();
  const test = {
    email: "pabloesteban2393@outlook.com",
    token: "3713696a3ffc380b4263872e072237c9ffcffe93223ca333f296f8186368b248&req=auth",
    type: "registration"
  }
  await sendEmail(test.email, test.token);
};


onMounted(async () => {

});
</script>
<template>
  <div>
    <teleport to="#page-title">
      <title>Ingreso - MetroVirtual - Hospital Metropolitano</title>
    </teleport>
    <div class="d-flex flex-column flex-grow-1 justify-content-center align-items-center py-1"
         style="background-color: #f8f9fc;">
      <div class="container m-auto ml-2">
        <div class="row mb-5 mb-md-2 justify-content-center">
          <!--columna de inputs-->
          <form class=" col-12 col-md-7 px-4 mb-0 mb-md-4">
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
            <div class="row" v-if="location === 'login'">
              <div class="col-12 col-md-10 col-lg-8 gray-color text-gray my-2">
                <h5 class="title-li">
                  <b>{{ language === "es" ? "Aquí encontrarás:" : "Here you will find:" }}</b></h5>
                <ul class="ul-option">
                  <li class="li-option">
                    {{
                      language === "es" ? "Agendar citas" :
                          "Book dates"
                    }}
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
                           @input="valid=false;"
                           :disabled="location === 'loading'"
                           :placeholder="language === 'es' ? 'Ingresa tu cédula o pasaporte' : 'Enter your user'">
                  </div>
                  <div class="col-3 col-lg-2">
                  </div>
                </div>
              </div>
              <div class="row my-1" v-if="userIsNotActivated">
                <div class="col-12 col-md-8">
                  <p class="text-right mb-0">
                    Se envió un correo electónico para activar tu cuenta a las siguientes direcciones:</p>
                  <ul class="my-1">
                    <li v-for="(email, key) in emails" v-bind:key="key">{{ email }}</li>
                  </ul>
                  <p class="text-right my-1">
                    Si no recibiste la confirmación, contáctese al <a href="tel:1800463876">1800 HMETRO</a> o a nuestro
                    <a href="https://api.whatsapp.com/send?text=Necesito%20ayuda&phone=593984789952" target="_blank">
                      <img src="@/assets/whatsapp.png" style="width: 22px;"> Whatsapp</a>
                  </p>

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
              <div class="row my-1" v-if="valid">
                <div class="col-12 col-md-6 col-lg-6 cursor-pointer"
                     @click="goToLostPass()">
                  <p class="text-center recover-password cursor-pointer text-reset-password"
                     translate>
                    ¿Olvidaste tu contraseña?
                  </p>
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
                  </div>
                  <div class="col-3 col-lg-2">
                  </div>
                </div>
              </div>
              <div class="row my-1 " v-if="errorMessage">
                <div class="col-12 col-md-7">
                  <p class="text-right text-error mb-0 pl-2"
                     translate>
                    {{ errorMessage }}
                  </p>
                </div>
              </div>
              <div class="row my-1 ">
                <div class="col-12 col-md-7">
                  <p class="text-right my-3 mt-4">
                    Si necesitas soporte o ayuda, llámanos al <a href="tel:1800463876">1800 HMETRO</a> o a nuestro
                    <a href="https://api.whatsapp.com/send?text=Necesito%20ayuda&phone=593984789952" target="_blank">
                      <img src="@/assets/whatsapp.png" style="width: 22px;"> Whatsapp</a>
                  </p>
                </div>
              </div>
<!--              <div class="row my-1 mt-4">-->
<!--                <div class="col-12 col-md-7">-->
<!--                  <p class="text-center my-2">-->
<!--                    <b>disponible en:</b>-->
<!--                  </p>-->
<!--                  <div class="row">-->
<!--                    <div class="col-6">-->
<!--                      <a class="d-flex justify-content-center cursor-pointer "-->
<!--                         href="#" target="_blank">-->
<!--                        <img src="@/assets/google_play.png" alt="Mundometro icon"-->
<!--                             width="100%" height="auto ">-->
<!--                      </a>-->
<!--                    </div>-->
<!--                    <div class="col-6">-->
<!--                      <a class="d-flex justify-content-center cursor-pointer" target="_blank"-->
<!--                         href="https://play.google.com/store/apps/details?id=com.metrovirtual.patients" >-->
<!--                        <img src="@/assets/app_store.png" alt="Mundometro icon"-->
<!--                             width="100%" height="auto ">-->
<!--                      </a>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->


            </template>
            <template v-if="location === 'register'">
              <template v-if="registerStep === 1">
                <div class="row" @click="backFromRegister()">
                  <h5 class="cursor-pointer ml-3" style=" color: #0f4470; font-size: 16px;">
                    <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                    Regresar
                  </h5>
                </div>
                <div class="row">
                  <div class="col-12 col-md-9">
                    <p class=" text-gray mb-2">Hemos agregado nuevos métodos de seguridad, por
                      favor completa tu nueva contraseña.</p>
                  </div>
                </div>
                <div class="form-group my-2 ">
                  <div class="row no-gutters no-margin">
                    <div class="col-12 col-md-7 col-lg-6">
                      <input type="password"
                             v-model="registerForm.PASS"
                             class="m-0 p-0 pl-3 form-control"
                             style="border-radius: 50px"
                             name="newPass"
                             :disabled="location === 'loading'"
                             :placeholder="language === 'es' ? 'Ingresa tu nueva contraseña' : 'Enter your new password'">
                    </div>
                    <div class="col-3 col-lg-2">
                    </div>
                  </div>
                </div>
                <div class="row my-1 ml-2" v-if="registerForm.PASS?.length < 6 && firstStepDirty">
                  <div class="col-12 col-md-6 col-lg-6">
                    <p class="text-right text-error">
                      las contraseñas deben tener mínimo de 6 dígitos
                    </p>
                  </div>
                </div>
                <div class="form-group my-2 ">
                  <div class="row no-gutters no-margin">
                    <div class="col-12 col-md-7 col-lg-6">
                      <input type="password"
                             v-model="registerForm.PASSCOMFIRM"
                             class="m-0 p-0 pl-3 form-control"
                             style="border-radius: 50px"
                             name="confirmPass"
                             :disabled="location === 'loading'"
                             :placeholder="language === 'es' ? 'Confirma tu contraeña' : 'Confirm your password'">
                    </div>
                    <div class="col-3 col-lg-2">
                    </div>
                  </div>
                </div>
                <div class="row my-1 ml-2" v-if="!firstStepValid && firstStepDirty">
                  <div class="col-12 col-md-6 col-lg-6">
                    <p class="text-right text-error">
                      las contraseñas deben ser iguales
                    </p>
                  </div>
                </div>
                <div class="form-group my-2">
                  <div class="row no-gutters no-margin">
                    <div class="col-12 col-md-7 col-lg-7 mt-1">
                      <button class="text-center cursor-pointer pt-2"
                              :class="[firstStepValid ? 'btn-loginv3' : 'left-button']"
                              @click="goToSecondStepRegister($event)">
                        {{ language === 'es' ? 'Siguiente' : 'Next' }}
                      </button>
                    </div>
                    <div class="col-3 col-lg-2">
                    </div>
                  </div>
                </div>
              </template>
              <template v-if="registerStep === 2">
                <div class="row" @click="backSecondStep()">
                  <h5 class="cursor-pointer ml-3" style=" color: #0f4470; font-size: 16px;">
                    <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                    Regresar
                  </h5>
                </div>
                <div class="row">
                  <div class="col-12 col-md-9">
                    <p class=" text-gray mb-2">Selecciona dos preguntas de seguridad, que te servirán para
                      recuperar tu contraseña, en caso de que la olvides.</p>
                  </div>
                </div>
                <div class="form-group my-2 ">
                  <div class="row no-gutters no-margin">
                    <div class="col-12 col-md-7 col-lg-6 my-1">
                      <label class="my-1"><b>Primera Pregunta</b></label>
                      <select v-model="selectedQuestions[0]"
                              class="m-0 p-2 pl-3 form-control"
                              style="border-radius: 50px">
                        <option :value="null">Selecciona tu primera pregunta</option>
                        <option v-for="(question, key) in questions" :value="key" v-bind:key="key">
                          {{ question }}
                        </option>
                      </select>
                    </div>
                    <div class="col-3 col-lg-2">
                    </div>
                  </div>
                </div>
                <div class="row my-1 ml-2" v-if="selectedQuestions[0] === null && secondStepDirty">
                  <div class="col-12 col-md-6 col-lg-6">
                    <p class="text-right text-error">
                      Selecciona tu primera pregunta
                    </p>
                  </div>
                </div>
                <div class="form-group my-2 " v-if="selectedQuestions[0]">
                  <div class="row no-gutters no-margin">
                    <div class="col-12 col-md-7 col-lg-6 my-1">
                      <input type="text"
                             v-model="selectedAnswers[0]"
                             class="m-0 p-0 pl-3 form-control"
                             style="border-radius: 50px"
                             name="selectedAnswers[0]"
                             :disabled="location === 'loading'"
                             placeholder="Responde a tu primera pregunta">
                    </div>
                    <div class="col-3 col-lg-2">
                    </div>
                  </div>
                </div>
                <div class="row my-1 ml-2"
                     v-if="selectedAnswers[0] === null && selectedQuestions[0] !== null && secondStepDirty">
                  <div class="col-12 col-md-6 col-lg-6">
                    <p class="text-right text-error">
                      Ingresa tu primera respuesta
                    </p>
                  </div>
                </div>
                <div class="form-group my-2 ">
                  <div class="row no-gutters no-margin">
                    <div class="col-12 col-md-7 col-lg-6 my-1">
                      <label class="my-1"><b>Segunda Pregunta</b></label>
                      <select v-model="selectedQuestions[1]"
                              class="m-0 p-2 pl-3 form-control"
                              style="border-radius: 50px">
                        <option :value="null">Selecciona tu segunda pregunta</option>
                        <option v-for="(question, key) in questions" :value="key" v-bind:key="key">
                          {{ question }}
                        </option>
                      </select>
                    </div>
                    <div class="col-3 col-lg-2">
                    </div>
                  </div>
                </div>
                <div class="row my-1 ml-2" v-if="selectedQuestions[1] === null && secondStepDirty">
                  <div class="col-12 col-md-6 col-lg-6">
                    <p class="text-right text-error">
                      Selecciona tu segunda pregunta
                    </p>
                  </div>
                </div>
                <div class="form-group my-2 " v-if="selectedQuestions[1]">
                  <div class="row no-gutters no-margin">
                    <div class="col-12 col-md-7 col-lg-6 my-1">
                      <input type="text"
                             v-model="selectedAnswers[1]"
                             class="m-0 p-0 pl-3 form-control"
                             style="border-radius: 50px"
                             name="selectedAnswers[0]"
                             :disabled="location === 'loading'"
                             placeholder="Responde a tu segunda pregunta">
                    </div>
                    <div class="col-3 col-lg-2">
                    </div>
                  </div>
                </div>
                <div class="row my-1 ml-2"
                     v-if="selectedAnswers[0] === null && selectedQuestions[1] !== null && secondStepDirty">
                  <div class="col-12 col-md-6 col-lg-6">
                    <p class="text-right text-error">
                      ingresa tu segunda respuesta
                    </p>
                  </div>
                </div>
                <div class="row my-1 ml-2" v-if="!areDiferentValid && secondStepDirty">
                  <div class="col-12 col-md-6 col-lg-6">
                    <p class="text-right text-error">
                      Las preguntas no pueden ser iguales
                    </p>
                  </div>
                </div>
                <div class="form-group my-2">
                  <div class="row no-gutters no-margin">
                    <div class="col-12 col-md-7 col-lg-7 mt-2">
                      <button class="text-center cursor-pointer pt-2"
                              :class="[firstSelectedQuestionValid && secondSelectedQuestionValid && areDiferentValid ? 'btn-loginv3' : 'left-button']"
                              @click="register($event)">
                        {{ language === 'es' ? 'Siguiente' : 'Next' }}
                      </button>
                    </div>
                    <div class="col-3 col-lg-2">
                    </div>
                  </div>
                </div>
                <div class="row my-1 ml-2">
                  <div class="col-12 col-md-8 col-lg-8">
                    <p class="text-right mb-0">
                      Se enviará un correo electónico para activar tu cuenta a las siguientes direcciones:</p>
                    <ul class="my-1">
                      <li v-for="(email, key) in emails" v-bind:key="key">{{ email }}</li>
                    </ul>
                    <p class="text-right mb-0 mt-2">
                      Si no recibes la confirmación, contáctese al <a href="tel:1800463876">1800 HMETRO</a> o a nuestro
                      <a href="https://api.whatsapp.com/send?text=Necesito%20ayuda&phone=593984789952" target="_blank">
                        <img src="@/assets/whatsapp.png" style="width: 22px;"> Whatsapp</a>
                    </p>
                  </div>
                </div>
              </template>

            </template>
            <template v-if="location === 'lost-pass'">
              <div class="row" @click="location = 'login'">
                <h5 class="cursor-pointer ml-3" style=" color: #0f4470; font-size: 16px;">
                  <font-awesome-icon :icon="['fas', 'chevron-left']"/>
                  Regresar
                </h5>
              </div>
              <div class="row">
                <div class="col-12 col-md-9">
                  <p class=" text-gray mb-2">Responde tus preguntas de seguridad para modificar tu contraseña.</p>
                </div>
              </div>
              <div class="form-group my-2 " v-for="(question, key) in userQuestions" v-bind:key="key">
                <div class="row no-gutters no-margin">
                  <div class="col-12 col-md-7 col-lg-6 my-1">
                    <label><b>{{ questions[key] }}</b></label>
                    <input type="text"
                           v-model="questionAnswer[key]"
                           class="m-0 p-0 pl-3 form-control"
                           style="border-radius: 50px"
                           name="questionAnswer"
                           :disabled="location === 'loading'"
                           placeholder="Responde tu pregunta de seguridad">

                    <p class="text-right text-error my-0" v-if="lostPassDirty && (questionAnswer[key] === null || questionAnswer[key] === undefined || questionAnswer[key] === '')">
                      Responde esta la pregunta
                    </p>
                  </div>
                  <div class="col-3 col-lg-2">
                  </div>
                </div>
              </div>

              <div class="row my-1 ml-2">
                <div class="col-12 col-md-8 col-lg-8">
                  <p class="text-right mb-0">
                    Se enviará un correo electrónico a tus direcciones registradas con los pasos para cambiar la
                    contraseña</p>
                  <p class="text-right mb-0">
                    Si no recibiste la confirmación, contáctese al <a href="tel:1800463876">1800 HMETRO</a> o a nuestro
                    <a href="https://api.whatsapp.com/send?text=Necesito%20ayuda&phone=593984789952" target="_blank">
                      <img src="@/assets/whatsapp.png" style="width: 22px;"> Whatsapp</a>
                  </p>
                </div>
              </div>

              <div class="form-group my-2">
                <div class="row no-gutters no-margin">
                  <div class="col-12 col-md-7 col-lg-7 mt-2">
                    <button class="text-center cursor-pointer pt-2"
                            :class="[checkIsValid() ? 'btn-loginv3' : 'left-button']"
                            @click="resetPassword($event)">
                      {{ language === 'es' ? 'Resetear' : 'Reset' }}
                    </button>
                  </div>
                  <div class="col-3 col-lg-2">
                  </div>
                </div>
              </div>
            </template>

          </form>
          <!--columna de iframe-->
          <div class="col-12 col-md-5 mb-md-4">
            <div class="px-2 mt-5 pt-8">
              <iframe width="100%" height="300" src="https://www.youtube.com/embed/NJ7BgrZY_4I?controls=0"
                      title="MetroVirtual" frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowfullscreen></iframe>
              <p style="text-align: center;">¿Qué es MetroVirtual pacientes?</p>
            </div>
          </div>
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
    <div class="row mb-4 mb-md-2 justify-content-center  pb-5 mt-5 my-5">
      <!--columna de iconos-->
<!--      <div class=" col-6 col-md-3 d-block pb-5 ">-->
<!--        <div class="icon-img cursor-pointer" @click="goTo('agendar-cita')">-->
<!--          <div class="row d-block img-border">-->
<!--            <span class="color-active"><i class="fa fa-circle" aria-hidden="true"></i></span>-->
<!--            <img class="img-icon-color" src="@/assets/agendar-blanco.png" alt=" icon">-->
<!--            <img class="img-icon-color color-margin" src="@/assets/agendar.png" alt=" icon" >-->
<!--            <br>-->
<!--          </div>-->
<!--          <p class="d-block text-icon-color mt-3">-->
<!--            Agendar Cita <br>-->
<!--            <span>*Examen de Imagen</span> <br>-->
<!--            <span>*Laboratorio a Domicilio</span>-->
<!--          </p>-->
<!--        </div>-->
<!--      </div>-->

      <!--columna de iconos-->
<!--      <div class=" col-6 col-md-3 d-block pb-5">-->
<!--        <div class="icon-img cursor-pointer" @click="goTo('buzon-de-sugerencias')">-->
<!--          <div class="row d-block img-border">-->
<!--            <img class="img-icon-color" src="@/assets/buzon-blanco.png" alt=" icon">-->
<!--            <img class="img-icon-color color-margin" src="@/assets/buzon.png" alt=" icon">-->
<!--            <br>-->
<!--          </div>-->
<!--          <p class="d-block mt-3 text-icon-color">Buzón<br>-->
<!--            de Sugerencias-->
<!--          </p>-->
<!--        </div>-->
<!--      </div>-->
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
  font-size: 14px;
  color: #0d9cde;
}

.text-error {
  font-size: 14px;
  color: red;
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
