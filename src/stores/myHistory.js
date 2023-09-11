import {defineStore} from 'pinia';
import {searchCheckouts} from '@/services/myCheckouts';
import {historialAtencionesPaciente} from '@/services/patient';
import { useNotification } from '@kyvg/vue3-notification';
const { notify }  = useNotification();
// searchPage
export let useMyHistoryStore;
useMyHistoryStore = defineStore({
    id: 'MyHistory',
    getters: {},
    actions: {
        async getHistory(payload) {
            //get data from backend
            try {
                const response = await historialAtencionesPaciente(payload );
                if(response.status){
                    this.history = response.data.map((element) => {
                        return {
                            ...element,
                            visible: false,
                            isLoading: true,
                            forms: []
                        }
                    });
                    this.total = response.total;
                    this.limit = response.limit;
                    this.offset = response.offset;
                }else{
                    this.history = [];
                    notify({
                        title: 'Hubo un error',
                        text: response.message,
                        type: 'error'
                    });
                }
                console.log('response Checkouts', this.history);
            } catch (e) {
                console.log('error', e);
                notify({
                    title: 'Hubo un error',
                    text: e,
                    type: 'error'
                });
            }
            //this.items = [];
        },
        async getMoreHistory(payload) {
            //get data from backend
            try {
                const response = await historialAtencionesPaciente(payload );
                if(response.status){
                    this.history.concat(response.data.map((element) => {
                        return {
                            ...element,
                            visible: false,
                            isLoading: true,
                            forms: []
                        }
                    }));
                    this.total = response.total;
                    this.limit = response.limit;
                    this.offset = response.offset;
                }else{

                    notify({
                        title: 'Hubo un error',
                        text: response.message,
                        type: 'error'
                    });
                }
                console.log('response Checkouts', this.history);
            } catch (e) {
                console.log('error', e);
                notify({
                    title: 'Hubo un error',
                    text: e,
                    type: 'error'
                });
            }
            //this.items = [];
        },
        async getHistoryCheckouts(index, payload){
            if(this.history[index].visible){
                this.history[index].visible = !this.history[index].visible;
            }else{
                this.history[index].visible = !this.history[index].visible;
                this.history[index].isLoading = true;
                this.history[index].forms = await searchCheckouts(payload );
                this.history[index].isLoading = false;
            }

        },
        clearHistory() {
            //get data from backend
            try {
                this.history = [];
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
        history: [],
    }),
});
