import {defineStore} from 'pinia';
import {searchPaths} from '@/services/myPaths';
import {useNotification} from '@kyvg/vue3-notification';
import {addSubscribed, getSubscribed, updateSubscribed} from "../services/myPaths";

const {notify} = useNotification();
// searchPage
export let usePatientPathStore;
usePatientPathStore = defineStore({
    id: 'PatientPath',
    getters: {},
    actions: {
        async searchPatientPath(payload, nhc) {
            //get data from backend
            try {
                const response = await searchPaths(payload, nhc);
                console.log('response PatientPath', response);
                if (response.status) {
                    this.paths = response.data.map((element) => {
                        return {
                            ...element,
                            isLoading: false,
                            subscribed: [],
                        }
                    });
                    console.log('paths', this.paths);
                    this.total = response.total;
                } else {
                    this.paths = [];
                    notify({
                        title: 'Hubo un error',
                        text: response.message,
                        type: 'error'
                    });
                }

            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
        async getSubscribed(index, nhc) {
            console.log('index', index);
            //get data from backend
            try {
                this.paths[index].isLoading = true;
                const response = await getSubscribed(nhc);
                console.log('response PatientPath subscribed', response);
                if (response.status) {
                    this.notificationObject = response.data;
                    this.paths[index].subscribed = this.notificationObject[0].RUTA_DEL_PACIENTE;

                    this.isNew = false;
                } else {
                    this.isNew = true;
                    this.notificationObject = null;
                    notify({
                        title: 'No hay',
                        text: response.message,
                        type: 'error'
                    });
                }
                console.log('this.notificationObject', this.notificationObject);
                console.log(' this.paths', this.paths);
                this.paths[index].isLoading = false;
            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
        async updateSubscribed(index, payload, nhc) {
            //get data from backend
            try {
                this.paths[index].isLoading = true;
                let newArray = this.paths[index].subscribed;
                newArray.push(payload);

                if (this.notificationObject) {
                    let form = {
                        ...this.notificationObject[0],
                        NHC: nhc,
                        RUTA_DEL_PACIENTE: newArray
                    };
                    const response = await updateSubscribed(form, nhc);
                    console.log('response add subs update', response);
                    if (response.status) {
                        this.notificationObject = response.data;
                    } else {
                        notify({
                            title: 'Hubo un error',
                            text: response.message,
                            type: 'error'
                        });
                    }
                } else {
                    let form = {
                        NHC: nhc,
                        RUTA_DEL_PACIENTE: newArray
                    };
                    const response = await addSubscribed(form, nhc);
                    console.log('response add subs create', response);
                    if (response.status) {
                        this.notificationObject = response.data;
                    } else {
                        notify({
                            title: 'Hubo un error',
                            text: response.message,
                            type: 'error'
                        });
                    }

                }
                this.paths[index].isLoading = false;
            } catch (e) {
                this.paths[index].isLoading = false;
                console.log('error', e);
                notify({
                    title: 'Hubo un error',
                    text: e,
                    type: 'error'
                });
            }
            //this.items = [];
        },
        async deleteSubscribed(pathIndex, index, nhc) {
            //get data from backend
            try {
                console.log('pathIndex', pathIndex);
                console.log('index', index);
                console.log('nhc', nhc);
                this.paths[pathIndex].isLoading = true;
                let newArray = this.paths[pathIndex].subscribed;
                newArray.splice(index, 1);
                if (this.notificationObject) {
                    let form = {
                        ...this.notificationObject[0],
                        NHC: nhc,
                        RUTA_DEL_PACIENTE: newArray
                    };
                    const response = await updateSubscribed(form, nhc);
                    console.log('response add subs update', response);
                    if (response.status) {
                        this.notificationObject = response.data;
                    } else {
                        notify({
                            title: 'Hubo un error',
                            text: response.message,
                            type: 'error'
                        });
                    }
                } else {
                    let form = {
                        NHC: nhc,
                        RUTA_DEL_PACIENTE: newArray
                    };
                    const response = await addSubscribed(form, nhc);
                    console.log('response add subs create', response);
                    if (response.status) {
                        this.notificationObject = response.data;
                    } else {
                        notify({
                            title: 'Hubo un error',
                            text: response.message,
                            type: 'error'
                        });
                    }
                }
                this.paths[pathIndex].isLoading = false;
            } catch (e) {
                this.paths[pathIndex].isLoading = false;
                console.log('error', e);
                notify({
                    title: 'Hubo un error',
                    text: e,
                    type: 'error'
                });
            }
            //this.items = [];
        },
        clearPatientPath() {
            //get data from backend
            try {
                this.paths = [];
                this.total = 0;
                this.isNew = true;
                this.notificationObject = null;
            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
    },
    state: () => ({
        paths: [],
        total: 0,
        isNew: true,
        notificationObject: null
    }),
});
