<template>
  <div>
    <v-card>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex v-for="card in cards" v-bind="{ [`xs${card.flex}`]: true }" :key="card.title">
            <v-card>
              <v-img :src="card.src" height="200px">
                <v-container fill-height fluid pa-2>
                  <v-layout fill-height>
                    <v-flex xs12 align-end flexbox>
                      <span class="headline white--text" v-text="card.title"></span>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-img>

              <v-card-actions v-if="card.title === 'Armas'">
                <v-select 
                  :items="armas" 
                  item-text="name"
                  item-value="damage"
                  label="Armas" 
                  @change="onWeaponChanged($event)">
                </v-select>
              </v-card-actions>
              <v-card-actions v-else-if="card.title === 'Armaduras'">
                <v-select 
                  :items="armaduras"
                  item-text="name" 
                  item-value="defense"
                  label="Armaduras"
                  @change="onArmorChanged($event)">
                </v-select>
              </v-card-actions>
              <v-card-actions v-else-if="card.title === 'YOU'">

              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import Vue from "vue";
import { eventBus } from "../main.ts";
export default Vue.extend({
  data() {
    return {
      cards: [
        {
          title: "YOU",
          src:
            "https://cdn.wccftech.com/wp-content/uploads/2017/10/WCCFstreetfighterV1-740x429.jpg",
          flex: 12
        },
        {
          title: "Armas",
          src:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZNA2KFWbmPCd6JhHGn5-j7CMN2vLXdwL5Iw4AklBXh8L3yq6EJw",
          flex: 6
        },
        {
          title: "Armaduras",
          src:
            "http://icons.iconarchive.com/icons/chanut/role-playing/1024/Armor-icon.png",
          flex: 6
        }
      ],
      armas: [
          {
            id: 0,
            name: 'Espada Corta',
            damage: 5
          },
          {
            id: 1,
            name: 'Espada Larga',
            damage: 10
          }
        ],
      armaduras: [
        {
          id: 0,
          name: 'Cuero',
          defense: 3
        },
        {
          id: 1,
          name: 'Coraza',
          defense: 8
        },
      ]
    };
  },
  methods: {
    onWeaponChanged(evt){
      /*this.$emit('WeaponChanged', evt);*/
      eventBus.$emit('WeaponChanged', evt);
    },
    onArmorChanged(evt){
      eventBus.$emit('ArmorChanged', evt);
    }
  },
  watch:{

  }
});
</script>

<style scoped>
</style>