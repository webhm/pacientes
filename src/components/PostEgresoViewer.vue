<script setup>
import {computed} from "vue";

const props = defineProps(["form"]);
const form = computed(() => props.form);


const searchInForm = (key) => {
  let items = Object.values(form.value.data);
  let response = items.find((item) => item.name === key);
  if (response) {
    return response.answer?.replace(/(\r\n|\r|\n)/g, "<br/>");
  } else {
    return "No encontrado";
  }
};
const searchInFormById = (key) => {
  let items = Object.values(form.value.data);
  let response = items.find((item) => item.identifier === key);
  if (response) {
    return response.answer?.replace(/(\r\n|\r|\n)/g, "<br/>");
  } else {
    return "No encontrado";
  }
};


</script>

<template>
  <div class="container cells d-none d-md-block">
    <div class="row">
      <div class="col-12 cells" style="text-align: center;">
        <img src="@/assets/evlouciones-logo.png" style="width: 30%; padding:5px; display: block; margin: auto">
        <h3 class="py-3"><b>HOJA DE CUIDADO POST-EGRESO</b></h3>
      </div>
    </div>
    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6 ">
        <div class="row">
          <div class="col-6 cells text-informe"><b>UNIDAD OPERATIVA</b></div>
          <div class="col-6 cells text-informe"><b>PARROQUIA</b></div>
        </div>
      </div>
      <div class="col-6 ">
        <div class="row">
          <!--          <div class="col-12 cells text-informe"><b>COD. LOCALIZACION</b></div>-->

          <div class="col-6 cells text-informe"><b>CANTÓN</b></div>
          <div class="col-6 cells text-informe"><b>PROVINCIA</b></div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <div class="row">

          <div class="col-6 cells text-informe">{{ searchInForm("Unidad Operativa") }}</div>
          <div class="col-6 cells text-informe">{{ searchInForm("parroquia") }}</div>
        </div>
      </div>
      <div class="col-6 ">
        <div class="row">

          <div class="col-6 cells text-informe">{{ searchInForm("canton_empresa") }}</div>
          <div class="col-6 cells text-informe">{{ searchInForm("provincia_empresa") }}</div>
        </div>
      </div>
    </div>
    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6 ">
        <div class="row">
          <div class="col-6 cells text-informe"><b>PRIMER APELLIDO</b></div>
          <div class="col-6 cells text-informe"><b>SEGUNDO APELLIDO</b></div>

        </div>
      </div>
      <div class="col-6">
        <div class="row">
          <div class="col-6 cells text-informe"><b>PRIMER NOMBRE</b></div>
          <div class="col-6 cells text-informe"><b>SEGUNDO NOMBRE</b></div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <div class="row">
          <div class="col-6 cells text-informe">{{ searchInForm("primero_nombre_paciente") }}</div>
          <div class="col-6 cells text-informe">{{ searchInForm("segundo_apellido_paciente") }}</div>

        </div>
      </div>
      <div class="col-6">
        <div class="row">
          <div class="col-6 cells text-informe">{{ searchInForm("Primer nomb Pcte") }}</div>
          <div class="col-6 cells text-informe">{{ searchInForm("segundo_nombre_paciente") }}</div>
        </div>
      </div>
    </div>
    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6">
        <div class="row">
          <div class="col-4 cells text-informe"><p><b>FECHA DE REFERENCIA</b></p></div>
          <div class="col-4 cells text-informe"><p><b>HORA</b></p></div>
          <div class="col-4 cells text-informe"><p><b>EDAD</b></p></div>

        </div>
      </div>
      <div class="col-6">
        <div class="row">
          <div class="col-6 cells text-informe"><b>NO. CEDULA CIUDADANÍA</b></div>
          <div class="col-6 cells text-informe"><p><b>ESTADO CIVIL</b></p></div>

        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <div class="row">
          <div class="col-4 cells text-informe "><p>{{ searchInForm("fecha_alta") }}</p></div>
          <div class="col-4 cells text-informe "><p>{{ searchInForm("hora_alta") }}</p></div>
          <div class="col-4 cells text-informe "><p>{{ searchInForm("edad_paciente") }}</p></div>

        </div>
      </div>
      <div class="col-6 ">
        <div class="row">
          <div class="col-6 cells text-informe">{{ searchInForm("identificacion_paciente") }}</div>
          <div class="col-6 cells text-informe "><p>{{ searchInForm("estado_civil_paciente") }}</p></div>

        </div>
      </div>
    </div>
    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6">
        <div class="row">
          <div class="col-6 cells text-informe"><p><b>GÉNERO</b></p></div>
          <div class="col-6 cells text-informe"><p><b>INSTRUCCIÓN</b></p></div>
        </div>
      </div>
      <div class="col-6">
        <div class="row">
          <div class="col-6 cells text-informe"><p><b>EMPRESA DONDE TRABAJA</b></p></div>
          <div class="col-6 cells text-informe"><p><b>SEGURO DE SALUD</b></p></div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <div class="row">
          <div class="col-6 cells text-informe"><p>{{ searchInForm("sexo_X_paciente") }}</p></div>
          <div class="col-6 cells text-informe "><p>{{ searchInForm("instruccion_paciente") }}</p></div>
        </div>
      </div>
      <div class="col-6 ">
        <div class="row">

          <div class="col-6 cells text-informe "><p>{{ searchInForm("lugar_trabajo_paciente") }}</p></div>
          <div class="col-6 cells text-informe "><p>{{ searchInForm("Seguro atencion") }}</p></div>
        </div>
      </div>
    </div>
    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6 cells text-informe"><b>DIAGNÓSTICO DE INGRESO</b></div>
      <div class="col-6 cells text-informe"><b>DIAGNÓSTICO DE EGRESO</b></div>
    </div>
    <div class="row">
      <div class="col-6 cells text-informe" v-html="searchInForm('diagnostico_ingreso_texto')"></div>
      <div class="col-6 cells text-informe">
        <div v-html="searchInForm('diagnosticos_egreso_texto')"></div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 cells text-informe" v-html="searchInForm('madetso')+searchInForm('madetso_2')+searchInForm('madetso_1')"></div>
    </div>
    <div class="row" style="background-color:#edfbf5;">
      <div class="col-12 cells text-informe"><b>EDUCACIÓN AL CUIDADOR</b></div>
    </div>
    <div class="row">
      <div class="col-4">
        <div class="row">
          <div class="col-12 cells text-informe"><p><b>Equipamento:</b> {{ searchInFormById("RB_1494___V177") }}</p>
          </div>
          <div class="col-12 cells text-informe"><p><b>Terapia lenguaje:</b> {{ searchInFormById("RB_1494___V178") }}
          </p></div>
          <div class="col-12 cells text-informe"><p><b>Otros:</b> {{ searchInFormById("RB_1494___V179") }}</p></div>
        </div>
      </div>
      <div class="col-8 ">
        <div class="row">
          <div class="col-6 cells text-informe"><p><b>Terapia respiratoria:</b> {{ searchInFormById("RB_1494___V180") }}
          </p></div>
          <div class="col-6 cells text-informe"><p><b>Terapia física:</b> {{ searchInFormById("RB_1494___V181") }}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-6 cells text-informe"><p><b>Curación de heridas:</b> {{ searchInFormById("RB_1494___V182") }}
          </p></div>
          <div class="col-6 cells text-informe"><p><b>Manejo de ostomías:</b> {{ searchInFormById("RB_1494___V183") }}
          </p></div>

        </div>
        <div class="row">
          <div class="col-12 cells text-informe"><p>{{ searchInForm("txt_otros") }}</p></div>
        </div>
      </div>

    </div>
    <div class="row" style="background-color:#edfbf5;">
      <div class="col-12 cells text-informe"><b>CITA MÉDICA</b></div>
    </div>
    <div class="row">
      <div class="col-3 cells text-informe">
        <p><b>FECHA:</b> {{ searchInForm("fecha_cita") }}</p>
      </div>
      <div class="col-9 cells text-informe">
        <p><b>MÉDICO:</b> {{ searchInForm("profesional_18") }}</p>
      </div>
    </div>
    <div class="row" style="background-color:#edfbf5;">
      <div class="col-12 cells text-informe"><b>NOTA</b></div>
    </div>
    <div class="row">
      <div class="col-12 cells text-informe" v-html="searchInForm('NOTA')"></div>
    </div>
    <div class="row" style="background-color:#edfbf5;">
      <div class="col-12 cells text-informe"><b>INFORME DE EGRESO DE ENFERMERÍA</b></div>
    </div>
    <div class="row">
      <div class="col-12 cells text-informe" v-html="searchInForm('informe_enfermera_post')"></div>
    </div>
    <div class="row" style="background-color:#edfbf5;">
      <div class="col-12 cells text-informe"><b>SIGNOS VITALES</b></div>
    </div>
    <div class="row">
      <div class="col-3 cells text-informe py-3"><p><b>TEMPERATURA:</b> {{ searchInForm("temperatura_vi") }}</p></div>
      <div class="col-3 cells text-informe py-3"><p><b>FRECUENCIA CARDIACA:</b> {{ searchInForm("PESO ACTUAL") }}</p>
      </div>
      <div class="col-3 cells text-informe py-3"><p><b>TENSIÓN ARTERIAL:</b> {{ searchInForm("presion_arterial_u") }} /
        {{ searchInForm("presion_arterial_d_u") }}</p></div>
      <div class="col-3 cells text-informe py-3"><p><b>RESPIRACIÓN:</b> {{ searchInForm("frecuencia_respiratoria_u") }}
      </p></div>
    </div>
    <div class="row">
      <div class="col-12 cells text-informe py-3"><p>La medicina no es una ciencia exacta y los procesos de una
        enfermedad pueden tener respuestas variables al tratamiento, pueden tener cambios repentinos en su curso o
        pueden evolucionar de modo imprevisible. Si su estado de salud no mejora, o por alguna causa usted tuviera
        alguna duda respecto a su diagnóstico, indicaciones o tratamiento médico, por favor comuníquese inmediatamente
        con Emergencia; solicite hablar con uno de los Médicos de la Unidad o acuda nuevamente para su valoración.
        Telf.: 3998000 Ext 2028/2110/2310/2289</p></div>
    </div>
  </div>


  <div class="container d-block d-md-none ct-mobile">
    <div class="row">
      <div class="col-12 cells" style="text-align: center;">
        <img src="@/assets/evlouciones-logo.png" style="width: 90%; padding:5px; display: block; margin: auto">
        <p class="py-2"><b>HOJA DE CUIDADO POST-EGRESO</b></p>
      </div>
    </div>

    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6 cells text-informe">
        <b>UNIDAD OPERATIVA</b>
      </div>
      <div class="col-6 cells text-informe">
        <b>PARROQUIA</b>
      </div>
    </div>
    <div class="row">
      <div class="col-6 cells text-informe">
        {{ searchInForm("Unidad Operativa") }}
      </div>
      <div class="col-6 cells text-informe">
        {{ searchInForm("parroquia") }}
      </div>
    </div>

    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6 cells text-informe">
        <b>CANTÓN</b>
      </div>
      <div class="col-6 cells text-informe">
        <b>PROVINCIA</b>
      </div>
    </div>
    <div class="row">
      <div class="col-6 cells text-informe">
        {{ searchInForm("canton_empresa") }}
      </div>
      <div class="col-6 cells text-informe">
        {{ searchInForm("provincia_empresa") }}
      </div>
    </div>

    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6 cells text-informe">
        <b>PRIMER APELLIDO</b>
      </div>
      <div class="col-6 cells text-informe">
        <b>SEGUNDO APELLIDO</b>
      </div>
    </div>
    <div class="row">
      <div class="col-6 cells text-informe">
        {{ searchInForm("primero_nombre_paciente") }}
      </div>
      <div class="col-6 cells text-informe">
        {{ searchInForm("segundo_apellido_paciente") }}
      </div>
    </div>

    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6 cells text-informe">
        <b>PRIMER NOMBRE</b>
      </div>
      <div class="col-6 cells text-informe">
        <b>SEGUNDO NOMBRE</b>
      </div>
    </div>
    <div class="row">
      <div class="col-6 cells text-informe">
        {{ searchInForm("Primer nomb Pcte") }}
      </div>
      <div class="col-6 cells text-informe">
        {{ searchInForm("segundo_nombre_paciente") }}
      </div>
    </div>

    <div class="row" style="background-color:#edfbf5;">
      <div class="col-4 cells text-informe"><b>FECHA DE REFERENCIA</b></div>
      <div class="col-4 cells text-informe"><b>HORA</b></div>
      <div class="col-4 cells text-informe"><b>EDAD</b></div>
    </div>
    <div class="row">
      <div class="col-4 cells text-informe">{{ searchInForm("fecha_alta") }}</div>
      <div class="col-4 cells text-informe">{{ searchInForm("hora_alta") }}</div>
      <div class="col-4 cells text-informe">{{ searchInForm("edad_paciente") }}</div>
    </div>

    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6 cells text-informe">
        <b>NO. CÉDULA CIUDADANÍA</b>
      </div>
      <div class="col-6 cells text-informe">
        <b>ESTADO CIVIL</b>
      </div>
    </div>
    <div class="row">
      <div class="col-6 cells text-informe">
        {{ searchInForm("identificacion_paciente") }}
      </div>
      <div class="col-6 cells text-informe">
        {{ searchInForm("estado_civil_paciente") }}
      </div>
    </div>

    <div class="row" style="background-color:#edfbf5;">
      <div class="col-6 cells text-informe">
        <b>GÉNERO</b>
      </div>
      <div class="col-6 cells text-informe">
        <b>INSTRUCCIÓN</b>
      </div>
    </div>
    <div class="row">
      <div class="col-6 cells text-informe">
        {{ searchInForm("sexo_X_paciente") }}
      </div>
      <div class="col-6 cells text-informe">
        {{ searchInForm("instruccion_paciente") }}
      </div>
    </div>

    <div class="row" style="background-color:#edfbf5;">
      <div class="col-12 cells text-informe">
        <b>EMPRESA DONDE TRABAJA</b>
      </div>

    </div>
    <div class="row">
      <div class="col-12 cells text-informe">
        {{ searchInForm("lugar_trabajo_paciente") }}
      </div>

    </div>
    <div class="row" style="background-color:#edfbf5;">
      <div class="col-12 cells text-informe">
        <b>SEGURO DE SALUD</b>
      </div>
    </div>
    <div class="row">
      <div class="col-12 cells text-informe">
        {{ searchInForm("Seguro atencion") }}
      </div>
    </div>


    <div class="row">
      <div class="col-12 cells text-informe" style="background-color:#edfbf5;">
        <b>DIAGNÓSTICO DE INGRESO</b>
      </div>
      <div class="col-12 cells text-informe">
        <div v-html="searchInForm('diagnostico_ingreso_texto')"></div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 cells text-informe" style="background-color:#edfbf5;">
        <b>DIAGNÓSTICO DE EGRESO</b>
      </div>
      <div class="col-12 cells text-informe">
        <div v-html="searchInForm('diagnosticos_egreso_texto')"></div>
      </div>
      <div class="col-12 cells text-informe">
        <div v-html="searchInForm('madetso')+searchInForm('madetso_2')+searchInForm('madetso_1')"></div>
      </div>
    </div>

    <div class="row">
      <div class="col-12 cells text-informe" style="background-color:#edfbf5;">
        <b>EDUCACIÓN AL CUIDADOR</b>
      </div>
      <div class="col-12 cells text-informe">
        <b>Equipamento:</b> {{ searchInFormById("RB_1494___V177") }}
      </div>
      <div class="col-12 cells text-informe">
        <b>Terapia respiratoria:</b> {{ searchInFormById("RB_1494___V178") }}
      </div>
      <div class="col-12 cells text-informe">
        <b>Curación de heridas:</b> {{ searchInFormById("RB_1494___V179") }}
      </div>
      <div class="col-12 cells text-informe">
        <b>Terapia lenguaje:</b> {{ searchInFormById("RB_1494___V180") }}
      </div>
      <div class="col-12 cells text-informe">
        <b>Terapia física:</b> {{ searchInFormById("RB_1494___V181") }}
      </div>
      <div class="col-12 cells text-informe">
        <b>Manejo de ostomías:</b> {{ searchInFormById("RB_1494___V182") }}
      </div>
      <div class="col-12 cells text-informe">
        <b>Otros:</b> {{ searchInFormById("RB_1494___V183") }}
      </div>
      <div class="col-12 cells text-informe">
        {{ searchInForm("txt_otros") }}
      </div>

    </div>

    <div class="row" style="background-color:#edfbf5;">
      <div class="col-12 cells text-informe">
        <b>CITA MÉDICA</b>
      </div>
    </div>
    <div class="row">
      <div class="col-12 cells text-informe">
        <b>FECHA:</b> {{ searchInForm("fecha_cita") }}
      </div>
      <div class="col-12 cells text-informe">
        <b>MÉDICO:</b> {{ searchInForm("profesional_18") }}
      </div>
    </div>
    <div class="row">
      <div class="col-12 cells text-informe" style="background-color:#edfbf5;">
        <b>NOTA</b>
      </div>
      <div class="col-12 cells text-informe">
        <div v-html="searchInForm('NOTA')"></div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 cells text-informe" style="background-color:#edfbf5;">
        <b>INFORME DE EGRESO DE ENFERMERÍA</b>
      </div>
      <div class="col-12 cells text-informe">
        <div v-html="searchInForm('informe_enfermera_post')"></div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 cells text-informe" style="background-color:#edfbf5;">
        <b>SIGNOS VITALES</b>
      </div>
      <div class="col-12 cells text-informe">
        <b>TEMPERATURA:</b> {{ searchInForm("temperatura_vi") }}
      </div>
      <div class="col-12 cells text-informe">
        <b>FRECUENCIA CARDIACA:</b> {{ searchInForm("PESO ACTUAL") }}
      </div>
      <div class="col-12 cells text-informe">
        <b>TENSIÓN ARTERIAL:</b> {{ searchInForm("presion_arterial_u") }} / {{ searchInForm("presion_arterial_d_u") }}
      </div>
      <div class="col-12 cells text-informe">
        <b>RESPIRACIÓN:</b> {{ searchInForm("frecuencia_respiratoria_u") }}
      </div>
    </div>
    <div class="row">
      <div class="col-12 cells text-informe">
        La medicina no es una ciencia exacta y los procesos de una enfermedad pueden tener respuestas variables al
        tratamiento, pueden tener cambios repentinos en su curso o pueden evolucionar de modo imprevisible. Si su estado
        de salud no mejora, o por alguna causa usted tuviera alguna duda respecto a su diagnóstico, indicaciones o
        tratamiento médico, por favor comuníquese inmediatamente con Emergencia; solicite hablar con uno de los Médicos
        de la Unidad o acuda nuevamente para su valoración. Telf.: 3998000 Ext 2028/2110/2310/2289
      </div>
    </div>
  </div>
</template>

<style scoped>
.ct-mobile {
  padding: 0px;
  margin-top: 10px;

}

.text-informe p {
  margin-bottom: 0px;
}

.text-informe b {
  font-weight: 600;
  color: #05305d;
}

.text-informe {
  font-size: 14px;
  padding: 4px 10px;
  color: #42494a;
}

.cells {
  border: solid 1px black;
}

.img-icon-colorv3 {
  width: 26px;
  height: 26px;
  margin: 0 auto;
  display: block;
  margin-top: 1px;
}

.img-borderv3 {
  background: #E9EDF8;
  padding: 5px 5px;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  text-align: center;
  border: 2px solid white;
  box-shadow: -6px 4px 13px 3px #e4e5e7;
}

.img-borderv3 > img {
  position: absolute;
  top: 10px;
  left: 12px;
}

.img-borderv3 > img:last-of-type {
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
  -moz-transition: opacity 0.3s ease-in-out;
  -webkit-transition: opacity 0.3s ease-in-out;
}

/*
 * Hide the last image on hover
*/
.img-borderv3:hover > img:last-of-type {
  opacity: 0;
}

.paginator {
  text-align: center;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  -webkit-align-items: center;
}

p.text-paginator {
  margin-bottom: 0px;
  padding: 10px;
}

button.prevew {
  border: none;
  color: #2392da;
}

.row.share {
  text-align: right;
  justify-content: end;
}

.img-borderv3:hover {
  background: #0B72D8 !important;
}

.share button {
  border: none;
  border-right: 1px solid #d0d4d2;
  color: #6b6969;
}

@media screen and (max-width: 600px) {
  .row.share {
    display: none;
  }
}


</style>
