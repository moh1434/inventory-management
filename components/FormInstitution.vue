<script setup lang='ts'>
import { Ref } from 'nuxt/dist/app/compat/capi';
import { institutionFormI, institutionResponseI, ministryWithId } from '~~/types';
import { vuetifyFormI } from '../types';

interface Props {
    loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
});

const emit = defineEmits(['success'])

const config = useRuntimeConfig();
const formRef = ref<vuetifyFormI>() as unknown as Ref<vuetifyFormI>; //vuetify <v-form ref="formRef"

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

    pending: props.loading,
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
        setTimeout(async () => {
            await formRef.value.validate();
        }, 1);
    });

}

const ministries = ref<ministryWithId[]>([]);

useWrapFetch<ministryWithId[]>('ministry').then(({ result }) => {
    if (!result) {
        ministries.value = [];
        return;
    };
    ministries.value = result;
    // console.log('ministries', ministries.value);

});

async function onCreateInstitutionClick() {
    const isValid = await formRef.value.validate();
    if (!isValid.valid) return

    form.value.pending = true

    const { result } = await useWrapFetch<institutionResponseI>('institution', {
        method: "POST",
        body: form.value.data
    });
    form.value.pending = false
    if (!result) return;
    // console.log('result', result);

    delete result['ministry'];
    form.value = initialForm();
    emit('success', result);

}

const { required, notEmpty, password } = useValidationRules();
const rules = {
    username: [
        required('Username'),
        (v: string) => !!v || 'Username is required',
        (v: string) => (v && v.length > 3) || 'Username must be more than 3 characters',
        (v: string) => (v && v.length <= 10) || 'Username must be less than 10 characters',
    ],
    password: [
        required('Password'),
        (v: string) => (v && password(v)) ||
            'Password must have at least 8 characters, at least one uppercase letter, one lowercase letter, one number and special character',
    ]
}
</script>

<template>
    <v-card class="mx-auto px-6 py-8 mt-14" max-width="560">
        <v-form ref="formRef">

            <v-card-title class="px-0">institution data:</v-card-title>

            <FormBaseInstitution :institution="form.data.institution" @name="form.data.institution.name = $event"
                @city="form.data.institution.city = $event" @phone-number="form.data.institution.phoneNumber = $event"
                @location="form.data.institution.location = $event" />
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

            <v-btn :disabled="form.pending" :loading="form.pending" block color="success" size="large"
                variant="elevated" @click.prevent="onCreateInstitutionClick">
                create the institution
            </v-btn>
        </v-form>
    </v-card>
</template>

<style>

</style>