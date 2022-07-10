<template>
  <div class="home">
    <div class="columns">
      <div class="column">
        <h1 class="title is-2 group-header">Your Groups:</h1>
      </div>
      <div class="column">
        <button
          @click="groupFormActive = true"
          class="form-modal-trigger button button-main is-small">
          Add a new Group
        </button>
      </div>
    </div>

    <div :class="{ 'is-active': groupFormActive }" id="form-modal" class="modal">
      <div class="modal-background" @click="groupFormActive = false" />
        <div class="modal-content p-4">
          <div class="card">
            <header class="card-header">
                <p class="card-header-title is-size-3">Add a New Group</p>
            </header>
            <div class="card-content">
              <form @submit.prevent="addNewGroup">
                <div class="field">
                  <label class="label" for="groupName">Group Name</label>
                  <div class="control" id="groupName">
                    <input
                    v-model="newGroup"
                    class="input"
                    type="text"
                    placeholder="New Group Name" 
                    required
                    />
                  </div>
                </div>
                <div class="field">
                  <label class="label" for="groupDesc">Group Description</label>
                  <div class="control" id="groupDesc">
                    <input
                    v-model="newGroupDescription"
                    class="input"
                    type="text"
                    placeholder="New Group Description"
                    />
                  </div>
                </div>
                <footer class="card-footer">
                  <div class="field card-footer-item">
                    <div class="control">
                      <button @click="groupFormActive = false" class="button button-main">
                          Add Group
                      </button>
                    </div>
                  </div>
                </footer>
              </form>
            </div>
          </div>
        </div>
    </div>


    <ul v-if="groups !== false">
      <li class="group-box" v-for="groupObj in groups" :key="groupObj.id">
        <router-link :to="{ name: 'oneGroup', params: { groupId: groupObj.id }}">
          <p v-if="groupObj.groupPaidUp == true" class="title group-name">{{groupObj.groupName}} - PAID UP</p>
          <p v-else class="title group-name">{{groupObj.groupName}}</p>
          <p class="subtitle is-6 group-desc">{{groupObj.groupDescription}}</p>
        </router-link>
      </li>
    </ul>
    <br><br><br>
  </div>
</template>


<script>
import { db, auth } from '@/firebaseConfig'

export default {
  name: 'HomeView',
  data: function() {
    return {
      groups: false,
      groupFormActive: false,
      newGroup: "",
      newGroupDescription: "",
      newGroupId: ""
    }
  },
  firestore: function() {
    return {
      groups: db.collection("groups").where('owner', '==', auth.currentUser.uid)
    }
  },
  methods: {
    addNewGroup: function() {
      let newGroup = {
        groupName: this.newGroup,
        groupDescription: this.newGroupDescription,
        groupPaidUp: false,
        owner: auth.currentUser.uid
      };
      this.newGroup = "",
      this.newGroupDescription = "",
      db.collection("groups").add(newGroup)
    }
  }
}
</script>


<style scoped>
  li {
    list-style-type: none;
  }
  .group-header {
    color: #676767;
  }
  .group-name {
    color: #676767;
  }
  .group-name:hover{
    color: #8A8A8A;
  }
  .group-box:nth-child(odd){
    background-color: #74BDCB;
    padding: 1em;
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 1em;
  }
  .group-box:nth-child(even){
    background-color: #FFA384;
    padding: 1em;
    margin-left: 5%;
    margin-right: 5%;
    margin-top: 1em;
  }
  .group-desc{
    color: #E7F2F8;
  }
  .button-main{
    background-color: #676767;
    color: #E7F2F8;
    border: none;
    margin: 0;
    top: 25%;
  }
  .button-main:hover{
    background-color: #8A8A8A;
    color: #E7F2F8;
  }
  .card-header-title{
    color: #676767;
  }
  .label{
    color: #74BDCB;
    text-align: left;
  }
  .card{
    background-color: #EFE8D8;
  }
  .blue{color: #74BDCB;}
  .orange{color: #FFA384;}
  .grey{color: #676767;}
  .grey-hover{color: #E55A5C;}
  .white{color: #E7F2F8;}
  .white-hover{color: #BADAEB;}
</style>