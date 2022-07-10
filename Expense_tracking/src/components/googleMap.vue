<template>
  <div class="map">
    <!-- draw the map         style='width:30%;  height:400px;'-->
      <GmapMap
        :center="{lat: expenseObj.location.latitude, lng: expenseObj.location.longitude}"
        :zoom='14'
        style='width:45%; height:300px; margin: auto;'
      >
        <GmapMarker
            :position="{lat: expenseObj.location.latitude, lng: expenseObj.location.longitude}"
            :clickable="true"
            @click="center={lat: expenseObj.location.latitude, lng: expenseObj.location.longitude}"
          />
      </GmapMap>
  </div>
</template>

<script>
import { db } from '@/firebaseConfig'
export default {
  name: 'googleMap',
  props: ['groupID', 'expenseID'],

  data() {
    return {
      expenseObj: false,
      test:false,
      center: { lat: 0, lng: 0},
    }
  },

  firestore: function() {
        return {
            expenseObj: db.collection("groups").doc(this.groupID).collection("groupExpenses").doc(this.expenseID),
        }
  }

};
</script>

