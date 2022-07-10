<template>
  <div id="main" v-if="groupObj !== false && !deleting">
      <router-link class="back-link" to="/home">Back to Groups</router-link>
      <div v-if="groupObj.groupPaidUp == true">
        <h1 class="title is-2 green">GROUP IS PAID UP</h1>
      </div>
      <div id="groupInfoContainer">
            <div id="outerInfoContainer">
                <h1 class="groupNameText title is-2 header"> {{groupObj.groupName}} </h1>
                <div id="descContainer">
                    <h2 id="descText">{{groupObj.groupDescription}}</h2>
                </div>
            </div>
      </div>
      <div>
        <button class="button button-main" @click="startEditDesc">Edit Group Info</button>
      </div>
        <div :class="{ 'is-active': editDescMode }" id="form-modal" class="modal">
            <div class="modal-background" @click="cancelEditDesc" />
            <div class="modal-content p-4">
            <div class="card">
                <header class="card-header">
                    <p class="card-header-title is-size-3">Edit Group Info</p>
                </header>
                <div class="card-content">
                    <form @submit.prevent="updateGroupInfo">
                        <div class="field">
                            <label class="label" for="gName">Group Name</label>
                            <div class="control" id="gName">
                                <input
                                v-model="newName"
                                class="input"
                                type="text"
                                :placeholder="groupObj.groupName"
                                minlength="1"
                                maxlength="30"
                                required
                                />
                            </div>
                        </div>
                        <div class="field">
                            <label class="label" for="gDesc">Group Description</label>
                            <div class="control" id="gDesc">
                                <input
                                v-model="newDesc"
                                class="input"
                                type="text"
                                :placeholder="groupObj.groupDescription"
                                minlength="1"
                                maxlength="100"
                                required
                                />
                            </div>
                        </div>
                        <footer class="card-footer">
                            <div class="field card-footer-item">
                                <div id="descButtonContainer" class="control">
                                    <button @click="updateGroupInfo" class="button button-main">
                                        Save
                                    </button>
                                    <button @click="cancelEditDesc" class="button button-main delete-button">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </form>
                </div>
            </div>
            </div>
                <button
                @click="cancelEditDesc"
                class="modal-close is-large"
                aria-label="close"
                ></button>
        </div>
      <!-- Display Expense Total -->
      <div>
        <span class="title is-5 header"> Group Expense Total: ${{expenseTotal}} </span> 
      </div>
      <!-- Add Expenses -->
      <div class="columns">
      <!-- Members Column -->
        <div class="column is-one-quarter membersBox">
            <button
            @click="memberFormActive = true"
            class="form-modal-trigger button button-main">
                Add a Member
            </button>
            <div :class="{ 'is-active': memberFormActive }" id="form-modal" class="modal">
                <div class="modal-background" @click="memberFormActive = false" />
                <div class="modal-content p-4">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title is-size-3">Add a Member</p>
                    </header>
                    <div class="card-content">
                        <form @submit.prevent="addMember">
                            <div class="field">
                                <label class="label" for="exName">Member Name</label>
                                <div class="control" id="exName">
                                    <input
                                    v-model="newMember"
                                    class="input"
                                    type="text"
                                    placeholder="Member Name"
                                    required
                                    />
                                </div>
                            </div>
                            <footer class="card-footer">
                                <div class="field card-footer-item">
                                    <div class="control">
                                        <button @click="memberFormActive = false" class="button button-main">
                                            Add Member
                                        </button>
                                    </div>
                                </div>
                            </footer>
                        </form>
                    </div>
                </div>
                </div>
                    <button
                    @click="memberFormActive = false"
                    class="modal-close is-large"
                    aria-label="close"
                    ></button>
            </div>
            <br><br>
            <h2 class="title header">Members</h2>
            <ul>
                <li v-for="groupMember in groupMemberObj" :key="groupMember.id">
                    <router-link :to="{ name: 'oneMember', params: { groupId: groupId, memberId: groupMember.id }}">
                        <h2 class="title is-4 nameOf">{{groupMember.memberName}}</h2> 
                    </router-link>
                    <h2 class="is-4 white">${{groupMember.totalOwe.toFixed(2)}}</h2>
                    <button @click="deleteMember(groupMember.id)" class="button is-small delete-button"> Delete member </button>
                </li>
            </ul>
        </div>

        <!-- Expenses Column -->
        <div class="column is-three-quarters expensesBox">
            <button
            @click="expenseFormActive = true"
            class="form-modal-trigger button button-main">
                Add an Expense
            </button>
            <div :class="{ 'is-active': expenseFormActive }" id="form-modal" class="modal">
                <div class="modal-background" @click="expenseFormActive = false" />
                <div class="modal-content p-4">
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title is-size-3">Add an Expense</p>
                    </header>
                    <div class="card-content">
                        <form @submit.prevent="addExpense">
                            <div class="field">
                                <label class="location" for="checkbox" >Enable Location</label>
                                <br>
                                <input type="checkbox" id="checkbox" v-model="locationToggle" @change="getLocation" />
                            </div>
                            <div class="field">
                                <label class="label" for="exName">Expense Name</label>
                                <div class="control" id="exName">
                                    <input
                                    v-model="newExpense"
                                    class="input"
                                    type="text"
                                    placeholder="Expense Name" 
                                    required
                                    />
                                </div>
                            </div>
                            <div class="field">
                                <label class="label" for="exDesc">Expense Description</label>
                                <div class="control" id="exDesc">
                                    <input
                                    v-model="newExpenseDesc"
                                    class="input"
                                    type="text"
                                    placeholder="Expense Description"
                                    />
                                </div>
                            </div>
                            <div class="field">
                                <label class="label" for="exTotal">Expense Total Cost</label>
                                <div class="control" id="exTotal">
                                    <input
                                    v-model="newExpenseTotalCost"
                                    class="input"
                                    type="number"
                                    />
                                </div>
                            </div>
                            <div class="field">
                                <label class="label" for="exSplit">Expense Split Method</label>
                                <div class="control" id="exSplit">
                                <!-- Commenting out old way in case we need it later.
                                    <input
                                        v-model="newExpenseSplitMethod"
                                        class="input"
                                        type="text"
                                        placeholder="Split Method"
                                        />
                                -->
                                    <select v-model="newExpenseSplitMethod" class="input" required>
                                        <option value="" disabled selected>Click to Choose a SplitMethod</option>
                                        <option value="Evenly"> Evenly </option>
                                        <option value="Percentage"> By Percentage </option>
                                        <option value="Manually"> Manually </option>
                                    </select>
                                </div>
                            </div>
                            <!--
                                SubMenu for splitting cost between members
                            -->
                            <div class="field"> 
                                <label class="label" for="exByMem">Split Cost Between Each Member</label>
                                
                                <div class="control indent" id="exByMem">
                                    
                                    <div class="control" id="exByMemEven" v-if="newExpenseSplitMethod == 'Evenly'">
                                        <div class="control" v-for="member in groupMemberObj" :key="member.id"> 
                                            <label class="label name" :for="member.id">{{member.memberName}}</label>
                                            <input type="number" class="input" :id="member.id" :value=splitEvenly() readonly/>
                                        </div>
                                    </div>
                                    
                                    <div class="control" id="exByMemPercent" v-else-if="newExpenseSplitMethod == 'Percentage'">
                                        <div class="control" v-for="member in groupMemberObj" :key="member.id"> 
                                            <label class="label name" :for="member.id">{{member.memberName}}</label>
                                            <input type="number" class="input" :id="member.id" min="0" max="100" step="1" placeholder="Enter a percentage" />
                                        </div>
                                    </div>
                                    
                                    <div class="control" id="exByMemManual" v-else-if="newExpenseSplitMethod == 'Manually'">
                                        <div class="control" v-for="member in groupMemberObj" :key="member.id"> 
                                            <label class="label name" :for="member.id">{{member.memberName}}</label>
                                            <input type="number" class="input" :id="member.id" placeholder="Enter a dollar amount" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="field">
                                <label class="label" for="exPaid">Expense Paid By</label>
                                <div class="control" id="exPaid">
                                <!-- Commenting out old way in case we need it later.    
                                    <input
                                    v-model="newExpensePaidBy"
                                    class="input"
                                    type="text"
                                    placeholder="Expense Paid By"
                                    />
                                -->
                                <select v-model="newExpensePaidBy" class="input" required>
                                        <option value="" disabled selected>Click to Choose who pays this expense</option>
                                        <option v-for="groupMember in groupMemberObj" :key="groupMember.id" :value="groupMember.memberName"> {{groupMember.memberName}} </option>
                                </select>
                                </div>
                            </div>
                            
                            <footer class="card-footer">
                                <div class="field card-footer-item">
                                    <div class="control">
                                        <button @click="expenseFormActive = false" class="button button-main">
                                            Add Expense
                                        </button>
                                    </div>
                                </div>
                            </footer>
                        </form>
                    </div>
                </div>
            </div>
                <button
                @click="expenseFormActive = false"
                class="modal-close is-large"
                aria-label="close"
                ></button>
            </div>
            <br><br>
            <h2 class="title header">Expenses</h2>
            <ul>
                <li v-for="expense in groupExpenseObj" :key="expense.id">
                    <router-link :to="{ name: 'oneExpense', params: { groupId: groupId, expenseId: expense.id}}">
                        <h2 class="title is-4 nameOf">{{expense.expenseName}} ${{expense.totalCost}}</h2>
                    </router-link>
                    <button class="button is-small delete-button" @click="deleteExpense(expense.id)"> Delete Expense </button>
                    <br><br>
                </li>
            </ul>
        </div>
      </div>
      <div>
        <button @click="deleteGroup" class="button delete-button">Delete Group</button>
      </div>
      <br>
  </div>

  <div v-else>
      LOADING
      <h1> {{groupObj.name}} </h1>
   </div>
</template>

<script>
import { db } from '@/firebaseConfig'
import firebase from "firebase/app";

export default {
  props:['groupId'],
  data: function() {
      return {
          expenseFormActive: false,
          memberFormActive: false,
          editDescMode: false,

          groupObj: false,
          deleting: false,
          groupExpenseObj: false,
          groupMemberObj: false,
          locationToggle: false,

          newMember: "",
          newName: "",
          newDesc: "",
          newExpense: "",
          newExpenseDesc: "",
          newExpensePaidBy: "",
          newExpenseSplitMethod: "",
          newExpenseTotalCost: 0,
          Lat: 0,
          Long: 0
      }
  },
  computed: {
      expenseTotal() {
          var sum = 0;
          for(var i = 0; i < this.groupExpenseObj.length; i++){
              var obj = this.groupExpenseObj[i];
              sum+= parseInt(obj.totalCost);
          }
          return sum;
      }
  },
  firestore: function() {
    return {
        groupObj: db.collection("groups").doc(this.groupId),
        groupExpenseObj: db.collection("groups").doc(this.groupId).collection("groupExpenses"),
        groupMemberObj: db.collection("groups").doc(this.groupId).collection("groupMembers") 
    }
  },
  beforeUpdate: function() {
    if (this.groupObj === null && !this.deleting) {
        this.$router.replace({name: '404'})
    }
    else if (this.groupObj === null && this.deleting) {
        this.$router.push({name: 'home'})
    }
  },
  methods: {
      startEditDesc() {
          this.editDescMode = true;
      },
      cancelEditDesc() {
          this.editDescMode = false;
      },
      // Updates the group description
      updateGroupInfo: function() {
            this.$firestoreRefs.groupObj.update({groupName: this.newName});
            this.$firestoreRefs.groupObj.update({groupDescription: this.newDesc});
            this.editDescMode = false;
      },
      deleteGroup() {
          this.deleting = true
          this.$firestoreRefs.groupObj.delete()
      },
      deleteMember(memberObjId) {
          db.collection("groups").doc(this.groupId).collection("groupMembers").doc(memberObjId).delete()
     },

      async deleteExpense(expenseObjId) {
          const group = db.collection("groups").doc(this.groupId);
          const expense = group.collection("groupExpenses").doc(expenseObjId);
          const doc = await expense.get();
            if (doc.exists) {
                let members = doc.data().expenseMembers;
                // decrease amount owed for each member by expense amount
                members.forEach(function(mem) {
                    for (var id in mem) {
                        group.collection("groupMembers").doc(id).update({totalOwe: firebase.firestore.FieldValue.increment(-mem[id])});
                    }
                });
            }
          expense.delete();
      },
      // Updates the members array field to the text
      addMember() {
        let addNewMember = {
            memberName: this.newMember,     // Name of the member
            totalOwe: 0,                    // How much they owe total
            totalPaidUp: false              // Have they have paid off everything
        }
        db.collection("groups").doc(this.groupId).collection("groupMembers").add(addNewMember)
        this.newMember = ""
      },
      //get locatoin
      getLocation: function(){
          if(this.locationToggle){
            if(!navigator.geolocation) {
                console.log('Geolocation is not supported by your browser');
            } 
            else {
                navigator.geolocation.getCurrentPosition((location)=> {
                        this.Lat = location.coords.latitude;
                        this.Long = location.coords.longitude;
                });
            }
            

          }
          else{
              this.Lat = 0;
              this.Long = 0;
          }
      },
      // Updates the expenses array field to the text
      addExpense() {
        let expenseSplit = this.getExpenseSplit();
        let addNewExpense = {
            expenseName: this.newExpense,                   // Name of the expense
            expenseDescription: this.newExpenseDesc,        // Description of the expense
            location: new firebase.firestore.GeoPoint(this.Lat, this.Long),                                   // Location of the expense
            paidBy: this.newExpensePaidBy,                  // The index of the member from the groups/groupMembers array
            splitMethod: this.newExpenseSplitMethod,        // How the expense is split
            totalCost: this.newExpenseTotalCost,            // Total cost of the expense
            expenseMembers: expenseSplit,                    // Array of members taking part in this expense
            mapToggle: this.locationToggle
        }

        // add expense and update total amount owed for each group member
        const group = db.collection("groups").doc(this.groupId);
        group.collection("groupExpenses").add(addNewExpense);
        expenseSplit.forEach(function(expense) { 
            for (var member in expense) {
                group.collection("groupMembers").doc(member).update({totalOwe: firebase.firestore.FieldValue.increment(expense[member])});
            }
        });

        // reset
        this.newExpense = "",
        this.newExpenseDesc = "",
        this.newExpensePaidBy = "",
        this.newExpenseSplitMethod = "",
        this.newExpenseTotalCost = 0
      },
      getExpenseSplit() {
          const expenseMembers = []
          var inputs;
          if(this.newExpenseSplitMethod === 'Evenly') {
              inputs = document.getElementById('exByMemEven').getElementsByTagName('input')
              for(let i = 0; i < inputs.length; i++) {
                var obj = {}
                var userID = inputs[i].id
                obj[userID] = inputs[i].value
                expenseMembers.push(obj)
                //expenseMembers.push("{" + inputs[i].id + ":" + inputs[i].value + "}");
              }
          } else if(this.newExpenseSplitMethod === 'Percentage') { 
              inputs = document.getElementById('exByMemPercent').getElementsByTagName('input')
              
              console.log("Check Percent() returned:" + this.checkPercent(inputs))
              if(this.checkPercent(inputs)) {
                for(let i = 0; i < inputs.length; i++) {
                    var json = {}
                    var id = inputs[i].id
                    json[id] = (inputs[i].value / 100) * this.newExpenseTotalCost;
                    //expenseMembers.push("{" + inputs[i].id + ":" + (inputs[i].value / 100) * this.newExpenseTotalCost + "}")
                    expenseMembers.push(json)
                }
              } else {
                  //Do something error related
              }              
              
          } else if(this.newExpenseSplitMethod === 'Manually') {
              inputs = document.getElementById('exByMemManual').getElementsByTagName('input')
              
              console.log("Check Manually() returned:" + this.checkManually(inputs))
              if(this.checkManually(inputs)) {
                for(let i = 0; i < inputs.length; i++) {
                    var json2 = {}
                    var id2 = inputs[i].id
                    json2[id2] = inputs[i].value
                    expenseMembers.push(json2)
                    //expenseMembers.push("{" + inputs[i].id + ":" + inputs[i].value + "}")
                }
              } else {
                  //Do something error related
              } 
          } else {
              //do nothing
          }
          return expenseMembers;
      },
      splitEvenly: function() {
          var size = this.groupMemberObj.length
          var val = this.newExpenseTotalCost / size
          return val.toFixed(2)
      },
      checkPercent: function(inputs) {
          let total = Number(0)
          for(let i = 0; i < inputs.length; i++) {
              total = total + Number(inputs[i].value)
            //   console.log("Iteration: " + i + " Value: " + inputs[i].value + " Total: " + total)
          }
          if (total === 100) {
              return true
          } else {
              return false
          }
      },
      checkManually: function(inputs) {
          let total = Number(0)
          for(let i = 0; i < inputs.length; i++) {
              total = total + Number(inputs[i].value)
            console.log("Iteration: " + i + " Value: " + inputs[i].value + " Total: " + total + " NewExpenseTotalCost: " + this.newExpenseTotalCost)
          }
          if (Number(total) === Number(this.newExpenseTotalCost)) {
              return true
          } else {
              return false
          }
      },
      isAllPaidOff() {
            const gId = this.groupId;
            this.groupMemberObj.forEach(async function(member) {
                console.log(member.id);
                const doc = await db.collection("groups").doc(gId).collection("groupMembers").doc(member.id).get();
                if (doc.exists) {
                    let amountOwed = doc.data().totalOwe;
                    if (amountOwed > 0) {
                        console.log(amountOwed);
                        return false;
                    }
                }
            });
            return true;
      }

      
   }
}
</script>


<style scoped>
    #main {
        display: flex;
        flex-direction: column;
        gap: 24px;
    }
    option[value=""][disabled] {
        display: none;
        color: rgba(0, 0, 0, 0.5);
    }
    .back-link{
        color: #74BDCB;
    }
    .back-link:hover{
        color: #FFA384;
    }
    #groupInfoContainer {
        width: 100%;
        padding: 0 20%;
    }
    .header {
        color: #676767;
        margin-bottom: 0;
    }
    #outerInfoContainer {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    #descContainer {
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 8px;
    }
    #descText {
        color: #FFA384;
        font-weight: bold;
    }
    #descButtonContainer {
        display: flex;
        gap: 8px;
        margin: auto;
    }
    .membersBox{
        background: #FFA384;
        text-align: right;
        margin-right: 1em;
    }
    .expensesBox{
        background: #74BDCB;
        text-align: left;
        margin-left: 1em;
    }
    @media only screen and (max-width: 768px) {
    /* For mobile phones: */
        .membersBox{
            background: #FFA384;
            text-align: right;
            margin-right: 0;
        }
        .expensesBox{
            background: #74BDCB;
            text-align: left;
            margin-left: 0;
        }
    }
    .button-main{
        background-color: #676767;
        color: #E7F2F8;
        border: none;
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
    .location{
        color: #74BDCB;
        font-weight: bold;

    }
    .card{
        background-color: #EFE8D8;
    }
    .name{
        color: #FFA384;
    }
    .nameOf{
        color: #E7F2F8;
        font-size: larger;
    }
    .nameOf:hover{
        color: #BADAEB;
    }
    .delete-button{
        background-color: #676767;
        color: #E7F2F8;
        border: none;
    }
    .delete-button:hover{
        background-color: #E55A5C;
        color: #E7F2F8;
    }
    .is-small{
        height: 2em;
        width: 7.75em;
    }
    .green{
        color: #71DB85;
    }
</style>