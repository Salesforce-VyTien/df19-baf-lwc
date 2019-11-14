public with sharing class NearbyCustomerController {

    @AuraEnabled(cacheable = true)
    public static List<Account> getNearbyCustomers(Location center, Integer count) {

        system.debug(center);
        List<Account> accounts = new List<Account>([select Id, Name,
            Location__Latitude__s, Location__Longitude__s 
            from Account where Location__Latitude__s <> null
            order by DISTANCE(Location__c, GEOLOCATION(:center.Latitude, :center.Longitude), 'mi') 
            limit :count]);
        return accounts;

    }

    public class Location {

        @AuraEnabled public Decimal Latitude {get; set;}
        @AuraEnabled public Decimal Longitude {get; set;}

        public Location() {}
    }

}
