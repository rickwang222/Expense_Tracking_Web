<template>
    <div v-if="groupObj !== false && !deleting">
        
        <router-link class="back-link" :to="{ name: 'oneGroup', params: { groupId: groupId }}">
            Back to {{groupObj.groupName}}
        </router-link>
        <br><br><br>

        <h1 class="title is-2 header">{{expenseObj.expenseName}}</h1>

        <p class="orange">{{expenseObj.expenseDescription}}</p>
        <br>
        <h2 class="title is-5 blue">Total Cost: ${{expenseObj.totalCost}}</h2>
        <h2 class="title is-5 header">Paid By: {{expenseObj.paidBy}}</h2>

        <div v-if="expenseObj.mapToggle" vid="app" >
            <h2 class="title is-5 header">Location:</h2>
            <div >
                <google-map :groupID="groupId" :expenseID="expenseId"/>
            </div>
        </div>

        <br>
        <div class="table-holder">
            <table class="table is-fullwidth">
                <thead>
                    <tr class="table-header">
                        <th class="table-header-text">MEMBER NAME</th>
                        <th class="table-header-text">AMOUNT OWE</th>
                        <th class="table-header-text">DEBT PAID?</th>
                    </tr>
                </thead>
                <tbody>        
                
                    <tr class="table-row" v-for="member in expenseObj.expenseMembers" :key="member.id">
                        <!-- TODO: FINISH MEMBER TABLE -->
                        <th class="white" id="name">{{getName(member)}}</th>
                        <td class="white">${{getOwed(member)}}</td>
                        <td class="white"><input type="checkbox" @click="togglePaid(member)" :checked="hasPaid(member)" :disabled="hasPaid(member)"></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <br><br>
        <button @click="deleteExpense()" class="button delete-button"> Delete Expense</button>
        <br><br><br>

        
    </div>
    <div v-else>
        LOADING ONE EXPENSE VIEW
    </div>
    
</template>


<script>
import { db } from '@/firebaseConfig'
import firebase from "firebase/app";
import googleMap from '@/components/googleMap.vue';
export default {
  components: { googleMap },
    props:['groupId', 'expenseId', 'mapToggle'],
    data: function() {
        return {
            groupObj: false,
            deleting: false,
            expenseObj: false,
            newExpenseMember: "",
            groupMembersObj: false,
            coord: {},
            names: [],
            displayName: ""
        }
    },
    firestore: function() {
        return {
            groupObj: db.collection("groups").doc(this.groupId),
            expenseObj: db.collection("groups").doc(this.groupId).collection("groupExpenses").doc(this.expenseId),
            groupMembersObj: db.collection("groups").doc(this.groupId).collection("groupMembers")
        }
    },
    methods: {
        async deleteExpense() {
            // delete an expense from the group
            this.deleting = true
            const group = db.collection("groups").doc(this.groupId);
            const expense = group.collection("groupExpenses").doc(this.expenseId);
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
            // this.deleting = true
            // firebase.firestore().collection("groups").doc(this.groupId).collection("groupExpenses").doc(this.expenseId).delete()
            this.$router.push({name: 'oneGroup', groupId: this.groupId})
        },
        beforeUpdate: function() {
            if (this.groupObj === null && !this.deleting) {
                this.$router.replace({name: '404'})
            }
            else if (this.groupObj === null && this.deleting) {
                this.$router.push({name: 'oneGroup', groupId: this.groupId})
            }
        },
        addExpenseMember() {
            // let addNewExpenseMember = {
            //     expenseMemberName: this.newExpenseMember,           // Name of the new member
            //     owe: 0,                                             // how much they owe
            //     paidUp: false                                       // if they have paid up yet
            // }
            
            // db.collection("groups").doc(this.id).groupExpenses.where("expenseName", "==", this.expense).update({
            //         expenseDescription: firebase.firestore.FieldValue.arrayUnion("greater_virginia")
            //     // expenseMembers: firebase.firestore.FieldValue.arrayUnion(addNewExpenseMember)
            // })

            this.newExpenseMember = ""
        },
    
        getOwed(member) {
            // return the amount owed in the member object
            var arrVals = Object.values(member)
            return arrVals[0]
        },
        getName(member) {
                var arrKeys = Object.keys(member)
                for (let i = 0; i < this.groupMembersObj.length; i++){
                    if(this.groupMembersObj[i].id === arrKeys[0]){
                        return this.groupMembersObj[i].memberName;
                    }
                }
                return -1;
        },
        async togglePaid(member) {
            const memberId = Object.keys(member)[0];
            const group = db.collection("groups").doc(this.groupId);
            const expense = group.collection("groupExpenses").doc(this.expenseId);

            const doc = await expense.get();
            if (doc.exists) {
                let members = doc.data().expenseMembers;
                console.log(members);
                // decrease amount owed for each member by expense amount
                members.forEach(function(mem) {
                    for (var id in mem) {
                        if (id == memberId) {
                            group.collection("groupMembers").doc(id).update({totalOwe: firebase.firestore.FieldValue.increment(-mem[id])});
                            mem[id] = 0;
                            break;
                        }
                    }
                });
                expense.update({expenseMembers: members});
            }
        },
        hasPaid(member) {
            return this.getOwed(member) == 0;
        }
        
    }
}
</script>


<style scoped>
    .back-link{
        color: #74BDCB;
    }
    .back-link:hover{
        color: #FFA384;
    }
    .header {
        color: #676767;
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
    .table-holder{
        margin-left: 5%;
        margin-right: 5%;
    }
    .table-header-text{
        color: #E7F2F8;
    }
    .table-header{
        background-color: #676767;
    }
    .table-row:nth-child(odd){
        background-color: #74BDCB;
        color: #676767;
    }
    .table-row:nth-child(even){
        background-color: #FFA384;
        color: #676767;
    }
    .table{
        background-color:rgba(0, 0, 0, 0);
        border-collapse:separate;
        border-spacing:0 0.25em;
    }

    .blue{color: #74BDCB;}
    .orange{color: #FFA384;}
    .grey{color: #676767;}
    .grey-hover{color: #E55A5C;}
    .white{color: #E7F2F8;}
    .white-hover{color: #BADAEB;}
</style>
