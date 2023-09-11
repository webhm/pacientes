import {defineStore} from 'pinia';
// import {searchPatients} from '@/services/searchPatients';
import {useNotification} from '@kyvg/vue3-notification';
import {resultadosImagenPaciente} from "@/services/patient";

const {notify} = useNotification();
// searchPage
export let useMyImageResultsStore;
useMyImageResultsStore = defineStore({
    id: 'MyImageResults',
    getters: {},
    actions: {
        async getResults(payload) {
            try {
                const response = await resultadosImagenPaciente(payload);
                console.log('response image result', response);
                if (response.status) {
                    this.results = response.data;
                    this.limit = response.limit;
                    this.offset = response.offset;
                    if(response.data.length > 0){
                        this.total = response.total;
                    }else{
                        this.total = 0;
                    }
                } else {
                    this.results = [];
                    this.total = 0;
                    notify({
                        title: 'Hubo un error',
                        text: response.message,
                        type: 'error'
                    });
                }

            } catch (e) {
                console.log('error', e);
            }
        },
        async getMoreResults(payload) {
            try {
                const response = await resultadosImagenPaciente(payload);
                console.log('response image more', response);
                if (response.status) {
                    this.results.concat(response.data);
                    this.total = response.total;
                    this.limit = response.limit;
                    this.offset = response.offset;
                } else {
                    notify({
                        title: 'Hubo un error',
                        text: response.message,
                        type: 'error'
                    });
                }

            } catch (e) {
                console.log('error', e);
            }
        },
        clearResults() {
            //get data from backend
            try {
                this.results = [];
                this.total = 0;
                this.limit = 25;
                this.offset = 1;
            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
    },
    state: () => ({
        results: [],
        total: 0,
        limit: 25,
        offset: 1,
    }),
});
