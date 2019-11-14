import { LightningElement, api, wire, track } from "lwc";
import { getRecord } from "lightning/uiRecordApi";
import getNearbyCustomers from "@salesforce/apex/NearbyCustomerController.getNearbyCustomers";

export default class NearbyCustomersImproved extends LightningElement {
  columns = [{ label: "Nearby Customers", fieldName: "Name" }];

  @track mapMarkers = [];
  @track fields;
  @track center;
  @track accounts;

  @api recordId;
  @api objectApiName;
  @api latField;
  @api lngField;
  @api maxDistance;

  connectedCallback() {
    // Create Fields to pull in the data service
    let fs = [];
    fs.push(this.objectApiName + ".Id");
    fs.push(this.objectApiName + "." + this.latField);
    fs.push(this.objectApiName + "." + this.lngField);
    this.fields = fs;
  }

  // Record Data Service
  @wire(getRecord, { recordId: "$recordId", fields: "$fields" })
  wiredRecord({ error, data }) {
    if (data) {
      // Define Map Center
      this.center = {
        Latitude: data.fields[this.latField].value,
        Longitude: data.fields[this.lngField].value
      };
    } else if (error) {
      // Handle Error
    }
  }

  // Retrieve List of Customer
  @wire(getNearbyCustomers, { center: "$center", maxDistance: "$maxDistance" })
  wiredAccounts({ error, data }) {
    //console.log(this.centerStr);
    if (data) {
      let mapAccounts = [];
      // Create Markers and List
      for (let i = 0; i < data.length; i++) {
        let location = {
          Longitude: data[i].Location__Longitude__s,
          Latitude: data[i].Location__Latitude__s
        };
        let mapAccount = { title: data[i].Name, location: location };
        mapAccounts.push(mapAccount);
      }
      this.accounts = data;
      this.mapMarkers = mapAccounts;
    } else if (error) {
      // Handle Error
    }
  }
}