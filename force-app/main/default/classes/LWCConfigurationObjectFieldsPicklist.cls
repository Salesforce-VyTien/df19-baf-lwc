global class LWCConfigurationObjectFieldsPicklist extends VisualEditor.DynamicPickList{
    VisualEditor.DesignTimePageContext context;

    global LWCConfigurationObjectFieldsPicklist(VisualEditor.DesignTimePageContext context) {
       this.context = context;
    }

    // No Default
    global override VisualEditor.DataRow getDefaultValue() {
        return null;
    }

    static VisualEditor.DynamicPickListRows picklistRows;
    global override VisualEditor.DynamicPickListRows getValues() {
        // Get Picklist rows of every object field
        if (picklistRows == null) {
            List<PicklistSortHelper> fields = new List<PicklistSortHelper>();
            if (context.pageType == 'RecordPage') {
                // Get Fields from Object
                Schema.DescribeSobjectResult[] results = Schema.describeSObjects(new String[] { context.entityName });
                for (Schema.DescribeSobjectResult res : results) {
                    for (Schema.sObjectField field : res.fields.getMap().values()) {
                        Schema.DescribeFieldResult f = field.getDescribe();
                        fields.add(new PicklistSortHelper(f.getLabel(), f.getName()));
                    }
                }
            }
            fields.sort();

            // Add Rows to Picklist
            VisualEditor.DynamicPickListRows rows = new VisualEditor.DynamicPickListRows();
            for (PicklistSortHelper f : fields) {
                rows.addRow(new VisualEditor.DataRow(f.label, f.name));
            }
            picklistRows = rows;
        }
        return pickListRows;
    }

    // Sorting Helper for Picklist Items
    private class PicklistSortHelper implements Comparable {

        String name;
        String label;

        PicklistSortHelper(String label, String name) {
            this.label = label;
            this.name = name;
        }

        public Integer compareTo(Object compareTo) {
            return this.label.compareTo(((PicklistSortHelper)compareTo).label);
        }

    }
}