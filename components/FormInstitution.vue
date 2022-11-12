<script setup lang='ts'>import { institutionFormI, institutionResponseI, ministryI } from '~~/types';

const emit = defineEmits(['success'])

const config = useRuntimeConfig();
const formRef = ref<any>(null); //vuetify <v-form ref="formRef"
const isValidForm = ref(null);

const initialForm = (): { data: institutionFormI, pending: boolean } => ({
    data: {
        "institution": {
            "name": "",
            "city": "",
            "location": "",
            "image": "",
            "phoneNumber": "",
            "ministryId": ""
        },
        username: '',
        password: '',
    },

    pending: false,
});
const form = ref<{ data: institutionFormI, pending: boolean }>(initialForm());

// TODO: danger this printed in dist deploy files also!, remove it and use .env if you want, also it printed in github!
if (config.public.isDebug) {
    form.value.data = {
        institution: {
            name: "متوسطة المنصور للبنين",
            city: "بغداد",
            location: "المنصور قرب معرض بغداد",
            image: "https://upload.wikimedia.org/wikipedia/ar/7/76/%D8%B4%D8%B9%D8%A7%D8%B1_%D9%88%D8%B2%D8%A7%D8%B1%D8%A9_%D8%A7%D9%84%D8%AA%D8%B1%D8%A8%D9%8A%D8%A9_%D8%A7%D9%84%D8%B9%D8%B1%D8%A7%D9%82%D9%8A%D8%A9.jpg",
            phoneNumber: "07712345678",
            ministryId: "",
        },
        username: 'newuser_',
        password: 'aA@1bcdeff',
    }

    onMounted(() => {
        setTimeout(() => {
            formRef.value.validate();
        }, 1);
    });

}

const ministries = ref<ministryI[]>([]);

useWrapFetch<ministryI[]>('ministry').then(({ result }) => {
    if (!result) {
        ministries.value = [];
        return;
    };
    ministries.value = result;
    // console.log('ministries', ministries.value);

});

async function onCreateInstitutionClick() {
    formRef.value.validate();
    if (!isValidForm.value) return

    form.value.pending = true

    const { result } = await useWrapFetch<institutionResponseI>('institution', {
        method: "POST",
        body: form.value.data
    });
    form.value.pending = false
    if (!result) return;
    // console.log('result', result);

    form.value = initialForm();
    emit('success', result);

}

const required = (field = "this field") => (v: string) => !!v || `${field} is required`;
const notEmpty = (field = "this field") => (v: string) => (v && v.length > 0) || `${field} can't be empty`;
const phoneNumber = (v: string) => (typeof v === 'string' &&
    v.length == 11 && v.startsWith('07') &&
    !!Number(v)) || "Phone must starts with '07', and contains 11 number";

const rules = {
    username: [
        required('Username'),
        (v: string) => !!v || 'Username is required',
        (v: string) => (v && v.length > 3) || 'Username must be more than 3 characters',
        (v: string) => (v && v.length <= 10) || 'Username must be less than 10 characters',
    ],
    password: [
        required('Password'),
        (v: string) => (v && v.length > 7) || 'Password must have at least 8 characters',
        //TODO: Fix this from backend
        (v: string) => (v && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v)) ||
            'Password must have at least 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character',
        // (v: string) => (v && /[a-z]/.test(v)) || 'Password must have at least one lowercase letter',
    ]
}
</script>

<template>
    <v-card class="mx-auto px-6 py-8 mt-14" max-width="460">
        <v-form v-model="isValidForm" ref="formRef">

            <v-card-title class="px-0">institution data:</v-card-title>
            <v-text-field v-model="form.data.institution.name" class="mb-2" required label="name"
                :rules="[required('Name'), notEmpty('Name')]">
            </v-text-field>
            <v-text-field v-model="form.data.institution.city" class="mb-2" required label="City"
                :rules="[required('City'), notEmpty('City')]">
            </v-text-field>
            <v-text-field v-model="form.data.institution.location" class="mb-2" required label="Location"
                :rules="[required('Location'), notEmpty('Location')]">
            </v-text-field>

            <!-- TODO: replace with File Input or remove it -->
            <v-text-field v-model="form.data.institution.image" class="mb-2" required label="Image"
                :rules="[required('Image'), notEmpty('Image')]">
            </v-text-field>

            <v-text-field v-model="form.data.institution.phoneNumber" class="mb-2" required label="Phone number"
                :rules="[required('Phone'), notEmpty('Phone'), phoneNumber]">
            </v-text-field>

            <v-select item-title="name" item-value="id" :items="ministries" v-model="form.data.institution.ministryId"
                required label="ministries" :rules="[required('ministry'), notEmpty('ministry')]" />

            <br />
            <v-card-title class="px-0">manager account for this institution:</v-card-title>
            <v-text-field v-model="form.data.username" class="mb-2" :rules="rules.username" required label="Username">
            </v-text-field>

            <v-text-field v-model="form.data.password" :rules="rules.password" required label="Password"
                placeholder="Enter your password">
            </v-text-field>

            <br>

            <v-btn :disabled="!isValidForm || form.pending" :loading="form.pending" block color="success" size="large"
                variant="elevated" @click.prevent="onCreateInstitutionClick">
                create the institution
            </v-btn>
        </v-form>
    </v-card>
</template>

<style>

</style>