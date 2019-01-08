<template>
  <v-container>
    <section class="row">
        <div class="small-6 columns">
            <h1 class="text-center">JUGADOR {{currentPlayerWeapon}} </h1>
            <div class="healthbar">
                <div 
                  class="healthbar text-center" 
                  style="background-color: green; margin: 0; color: white;"
                  :style="{width: playerHealth + '%'}">
                  {{ playerHealth }}
                </div>
            </div>
            <div class="manabar">
              <div 
                class="manabar text-center" 
                style="background-color: rgb(0, 51, 128); margin: 0; color: white;"
                :style="{width: playerMana + '%'}">
                {{ playerMana }}
              </div>
          </div>
        </div>
        <div class="small-6 columns">
            <h1 class="text-center">MONSTRUO</h1>
            <div class="healthbar">
                <div 
                  :value="monsterHealth" 
                  class="healthbar text-center" 
                  style="background-color: green; margin: 0; color: white;"
                  :style="{width: monsterHealth + '%'}">
                  {{ monsterHealth }}
                </div>
            </div>
        </div>
    </section>
    <section class="row controls" v-if="!gameIsRunning">
        <div class="small-12 columns">
            <button id="start-game" @click="startGame">NUEVA PARTIDA</button>
        </div>
    </section>
    <section class="row controls" v-else="gameIsRunning">
        <div class="small-12 columns">
            <button @click="attack" id="attack">ATAQUE</button>
            <button @click="specialAttack" id="special-attack">ATAQUE ESPECIAL</button>
            <button @click="heal" id="heal">CURAR</button>
            <button @click="giveUp" id="give-up">RENDIRSE</button>
        </div>
    </section>
    <section class="row log" v-if="turns.length > 0">
        <div class="small-12 columns">
            <ul>
                <li 
                  v-for="turn in turns" :key="turn.id"
                  :class="{'player-turn': turn.isPlayer, 'monster-turn': !turn.isPlayer}">
                  {{ turn.text }}
                </li>
            </ul>
        </div>
    </section>
  </v-container>
</template>

<script>
import Vue from 'vue';
import { eventBus } from "../main.ts";

  export default Vue.extend({
    props: ['weaponsList'],
    data() {
    return{
      playerHealth: 100,
      monsterHealth: 100,
      playerMana: 100,
      gameIsRunning: false,
      currentPlayerWeapon: [],
      /*currentDamageBonus: Number,*/
      armorDefense: '',
      turns: [{id: '', isPlayer: false, text: ''}]
    };
  },
  /*mounted(){
    this.$root.$on('WeaponChanged', evt => {
      console.log(evt);
      console.log('Hola');
      
    });
  },*/
  methods:{
    startGame: function(){
      this.gameIsRunning = true;
      this.playerHealth = 100,
      this.monsterHealth = 100,
      this.playerMana = 100,
      this.turns = [{id: '', isPlayer: false, text: ''}]
    },
    attack: function(){
      this.checkWin();
      var damage = this.calculateDamage(3, 10, this.currentPlayerWeapon);
      this.turns.unshift({
        isPlayer: true,
        text: 'El jugador ataca al Monstruo por ' + damage
      });
      this.monsterHealth -= damage;
      if(this.checkWin()){
        return;
      }
      this.monsterAttack();
      this.manaRegenerate();
        
    },
    specialAttack: function(){
      this.checkWin();
      if (this.playerMana <= 20){
        alert('NO TIENES MANA SUFICIENTE Y EL MONSTRUO TE ATACA!!');
        this.monsterAttack();
        this.manaRegenerate();
      } else {
        var damage = this.calculateDamage(10, 20, this.currentPlayerWeapon);
        this.playerMana -= 40
        this.monsterHealth -= damage;
        this.turns.unshift({
          isPlayer: true,
          text: 'El jugador ataca al Monstruo con severidad, lujuria y sodomia por ' + damage
        });
        this.monsterAttack();
        this.manaRegenerate();
      }
      
      
    },
    heal: function(){
      let heal;
      if(this.playerMana > 20){
        if(this.playerHealth <= 90){
          heal = this.calculateDamage(4, 20);
          this.playerHealth += heal;
        } else {
          this.playerHealth = 100;
        }
        this.turns.unshift({
          isPlayer: true,
          text: 'El jugador se cura ' +heal+ ' puntos'
        });
        this.playerMana -= 40
        this.monsterAttack();
        this.manaRegenerate();
      } else {
        alert('NO TIENES MANA SUFICIENTE Y EL MONSTRUO TE ATACA!!');
        this.monsterAttack();
        this.manaRegenerate();
      }
      
       
    },
    giveUp: function (){
      this.gameIsRunning = false;
      alert('Te has rendido...');
    },
    calculateDamage : function(min, max, currentDamageBonus){
      
      min += currentDamageBonus;
      max += currentDamageBonus;
      console.log('min', min);
      console.log('max' ,max);
      var totalDamage = Math.max(Math.floor(Math.random() * max)+1, min)
      console.log('Daño total del ataque', totalDamage)
      return totalDamage
    },
    manaRegenerate: function(){
      if(this.playerMana < 100) this.playerMana += 5
    },
    monsterAttack : function (){
      this.checkWin();
      var currentMonsterDamageBonus = 0;
      var damage = this.calculateDamage(5, 12, currentMonsterDamageBonus);
      this.turns.unshift({
        isPlayer: false,
        text: 'El Monstruo ataca al Jugador por ' + damage
      });
      this.playerHealth -= damage;
       
    },
    checkWin: function(){
      if (this.monsterHealth <= 0){
        console.log('Ultimo turno', this.turns[this.turns.length-1].text)
        if ( confirm('TU GANAS! SIGUES JUGANDO?')){
          this.startGame();
        } else {
          this.gameIsRunning = false;
        }
        return true;
      } else if (this.playerHealth <= 0) {
        console.log('Ultimo turno', this.turns[this.turns.length -1].text)
        if ( confirm('PERDISTE PATAN! NUEVA ENCULADA?')){
          this.startGame();
        } else {
          this.gameIsRunning = false;
        }
        return true;
      }
      return false;
    }
  },
  created() {
    eventBus.$on('WeaponChanged', (weapon) => {
      this.currentPlayerWeapon = weapon;
      /*this.currentDamageBonus = weapon.damage;*/
    });
  }
});
</script>

<style>

</style>
