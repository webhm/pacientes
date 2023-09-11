import { mande } from 'mande';
const baseURLV1 = 'https://api.hospitalmetropolitano.org/v1';


export function resultadosLaboratorioPaciente(req) {
  const patients = mande(  `${baseURLV1}/resultados/lab`);
  return patients.post(req);
}

export function resultadosImagenPaciente(req) {
  const patients = mande(  `${baseURLV1}/resultados/imagen`);
  return patients.post(req);
}

export function historialAtencionesPaciente(req) {
  const patients = mande(  `${baseURLV1}/paciente/atenciones`);
  return patients.post(req);
}

export function urlDocumento(url) {
  const patients = mande(  url);
  return patients.get('');
}

