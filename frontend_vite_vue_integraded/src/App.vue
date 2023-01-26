<script setup>
import { ref } from 'vue'
import Typeahead from "./components/Typeahead.vue"


</script>

<template>
    <div class = "row">
      <div class = "col" id = "title"> Typeahead US States</div>
    </div>
    <div class = "row">
      <div class = "col" id = "input_box"> 
        <Typeahead />
      </div>
    </div>
</template>

<style scoped>
#title{
  font-size: 50px;
  font-weight: bold;
  color: rgb(45, 45, 45);
  text-align: center;
}
#input_box{
  text-align: center;
  width:90%;
}
</style>
