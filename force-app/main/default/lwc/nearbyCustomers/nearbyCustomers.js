import { LightningElement, api, wire, track } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getNearbyCustomers from '@salesforce/apex/NearbyCustomerController.getNearbyCustomers';

export default class NearbyCustomers extends LightningElement {

    columns = [
       { label: "Name", fieldName: "Name" }
    ];

    

    @track mapMarkers = [];
    @track center;
    @track accounts;

    @api recordId;

    @wire(getRecord, { recordId: "$recordId", fields: [ "Account.Location__Longitude__s", "Account.Location__Latitude__s" ] })
    wiredRecord({ error, data }) {
        if (data) {
            this.center = { 
                Longitude: data.fields.Location__Longitude__s.value, 
                Latitude: data.fields.Location__Latitude__s.value
            }
            this.centerStr = JSON.stringify(this.center);
        } else if (error) {
            // Handle Error
            console.log(JSON.stringify(error));
        }
    }

    @wire(getNearbyCustomers, { center: "$center", count: 6 })
    wiredAccounts({ error, data }) {
        if (data) {
            let mapAccounts = [];
            for (let i=0; i<data.length; i++) {
                let location = { Longitude: data[i].Location__Longitude__s, 
                    Latitude: data[i].Location__Latitude__s };
                let mapAccount = { title: data[i].Name, location: location };
                mapAccounts.push(mapAccount);
            }
            this.accounts = data;
            this.mapMarkers = mapAccounts;
        } else if (error) {
            // Handle Error
            console.log(error);
        }

    }
}