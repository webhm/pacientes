import {defineStore} from 'pinia';
import {searchCheckouts} from '@/services/myCheckouts';
import { useNotification } from '@kyvg/vue3-notification';
const { notify }  = useNotification();
// searchPage
export let useMyCheckoutsStore;
useMyCheckoutsStore = defineStore({
    id: 'MyCheckouts',
    getters: {},
    actions: {
        async searchCheckouts(payload) {
            //get data from backend
            try {
                this.checkouts = await searchCheckouts(payload );
                console.log('response Checkouts', this.checkouts);
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
        clearCheckouts() {
            //get data from backend
            try {
                this.checkouts = [];
            } catch (e) {
                console.log('error', e);
            }
            //this.items = [];
        },
    },
    state: () => ({
        checkouts: [],
    }),
});
ATENCION
    :
    "81181"
FECHA_ATENCION
    :
    "13-07-2023"
MED_FOR
    :
    "ESPINOZA GONZALEZ CARLOS FRANCISCO"
NHC
    :
    "389039"
NUM
    :
    "1"
PTE
    :
    "ENRIQUEZ DE LA TORRE VALENTINA JAMILE"
forms
    :
    []
visible
    :
    false