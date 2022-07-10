<template>
    <div v-if="groupObj !== false && !deleting">

        <router-link class="back-link" :to="{ name: 'oneGroup', params: { groupId: groupId }}">
            Back to {{groupObj.groupName}}
        </router-link>
        <br><br><br>

        <h1 class="title is-2 header">{{memberObj.memberName}}</h1>
        <br>

        <h2 class="title is-5 orange">Total Amount Owed: ${{memberObj.totalOwe.toFixed(2)}}</h2>
        <br>

        <div class="table-holder">
            <table class="table is-fullwidth">
                <thead>
                    <tr class="table-header">
                        <th class="table-header-text">EXPENSE NAME</th>
                        <th class="table-header-text">AMOUNT OWED</th>
                        <th class="table-header-text">TO WHO</th>
                        <th class="table-header-text">PAID UP</th>  
                    </tr>
                </thead>
                <tbody>
                    <tr class="table-row" v-for="expenseObj in expenseObjs" :key="expenseObj.id">
                        <!-- TODO: FINISH EXPENSE TABLE -->
                        <!-- ONLY IF MEMBER IS IN EXPENSEOBJ THEN DISPLAY ON TABLE-->
                        <th class="white">{{expenseObj.expenseName}}</th>
                        <td class="white">${{getAmount(expenseObj)}}</td> 
                        <td class="white">{{expenseObj.paidBy}}</td>
                        <td class="white"><input id="checked" type="checkbox" @click="togglePaid(expenseObj)" :checked="hasPaid(expenseObj)" :disabled="hasPaid(expenseObj)"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        

        <br><br>
        <button @click="deleteMember()" class="button delete-button"> Delete Member</button>
        <br><br><br>
    </div>
    <div v-else>
        LOADING ONE MEMBER VIEW
    </div>
</template>


<script>
import { db } from '@/firebaseConfig'
import firebase from "firebase/app";
export default {
    props:['groupId', 'memberId'],
    data: function() {
        return {
            groupObj: false,
            expenseObjs: false,
            memberObj: false,
            deleting: false
        }
    },
    firestore: function() {
        return {
            groupObj: db.collection("groups").doc(this.groupId),
            expenseObjs: db.collection("groups").doc(this.groupId).collection("groupExpenses"),
            memberObj: db.collection("groups").doc(this.groupId).collection("groupMembers").doc(this.memberId)
        }
    },
    methods: {
        deleteMember() {
            // delete a member from the group
            this.deleting = true
            firebase.firestore().collection("groups").doc(this.groupId).collection("groupMembers").doc(this.memberId).delete()
            this.$router.push({name: 'oneGroup', groupId: this.groupId})
        },
        getAmount(expObj) {
            console.log("EXPOBJ: ", expObj.expenseMembers)
            //console.log("MEMBER ID ", this.memberId)
            console.log("exp: ", expObj.expenseMembers[0])
            for(let i = 0; i < expObj.expenseMembers.length; i++) {
                console.log("expMembers[i]: ", expObj.expenseMembers[i])
                var arrKeys = Object.keys(expObj.expenseMembers[i])
                var arrVals = Object.values(expObj.expenseMembers[i])
                console.log("arrKeys[i] ", arrKeys[0])
                console.log("arrVals[i] ", arrVals[0])
                if(arrKeys[0] === this.memberId) {
                    return arrVals[0]
                    
                }
            }
        },
        async togglePaid(expenseObj) {
            const memberId = this.memberObj.id;
            const group = db.collection("groups").doc(this.groupId);
            const expense = group.collection("groupExpenses").doc(expenseObj.id);

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
        hasPaid(expenseObj) {
            return this.getAmount(expenseObj) == 0;
        },
        beforeUpdate: function() {
            if (this.groupObj === null && !this.deleting) {
                this.$router.replace({name: '404'})
            }
            else if (this.groupObj === null && this.deleting) {
                this.$router.push({name: 'oneGroup', groupId: this.groupId})
            }
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
    .grey{background-color: #676767;}
    .grey-hover{background-color: #E55A5C;}
    .white{color: #E7F2F8;}
    .white-hover{background-color: #BADAEB;}
</style>
