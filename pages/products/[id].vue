<script setup lang='ts'>import { productWithId } from '~~/types';
import { institutionWithIdI } from '../../types';


//same as products/index.vue
definePageMeta({
    middleware: ['user-only'],
});
const params = useRoute().params as { id: string };

type productWithIdAndInstitution = productWithId & { Institution: institutionWithIdI };
const product = ref<productWithIdAndInstitution>();
useWrapFetch<productWithIdAndInstitution>(`/products/${params.id}`).then(({ result }) => {
    if (result) product.value = result;
});

</script>

<template>
    <v-container>
        <v-card v-if="product">
            <v-card class="ma-6 pb-6">
                <v-card-title>Product data</v-card-title>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-left">
                                name
                            </th>
                            <th class="text-left">
                                category
                            </th>
                            <th class="text-left">
                                phone
                            </th>
                            <th class="text-left">
                                description
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ product.name }}</td>
                            <td>{{ product.category.name }}</td>
                            <td>{{ product.description }}</td>
                            <td>{{ product.description }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card>
            <v-card class="ma-6 pb-6">
                <v-card-title>Images:</v-card-title>
                <template v-if="product.images.length">
                    <div class="flex justify-evenly">
                        <Image v-for="(image, index) in product.images" :key="index" class="text-center image"
                            :src="image" />
                    </div>
                </template>
                <template v-else>
                    No images
                </template>
            </v-card>
            <v-card class="ma-6 pb-6">
                <v-card-title>Items:</v-card-title>
                <template v-if="product.items.length">
                    <v-table>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    n
                                </th>
                                <th class="text-left">
                                    code
                                </th>
                                <th class="text-left">
                                    status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in product.items" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.code }}</td>
                                <td>{{ item.status }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </template>
                <template v-else>
                    No items
                </template>
            </v-card>
            <v-card class="ma-6 pb-6">
                <v-card-title>Product's institution:</v-card-title>
                <v-table>
                    <thead>
                        <tr>
                            <th class="text-left">
                                name
                            </th>
                            <th class="text-left">
                                city
                            </th>
                            <th class="text-left">
                                location
                            </th>
                            <th class="text-left">
                                phone
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ product.Institution.name }}</td>
                            <td>{{ product.Institution.city }}</td>
                            <td>{{ product.Institution.location }}</td>
                            <td>{{ product.Institution.phoneNumber }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-card>
        </v-card>
        <v-card v-else>
            <v-card-title>Loading...</v-card-title>
        </v-card>
    </v-container>
</template>

<style>
.flex {
    display: flex;
    flex-wrap: wrap;
}

.justify-evenly {
    justify-content: space-evenly;
}

.image {
    max-width: 250px;
}
</style>