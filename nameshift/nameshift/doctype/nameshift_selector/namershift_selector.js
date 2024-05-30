frappe.pages['nameshift_selector'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'NameShift Selector',
        single_column: true
    });

    $(frappe.render_template('nameshift_selector', {})).appendTo(page.body);

    page.add_field({
        fieldname: 'select_doctype',
        label: 'Select DocType',
        fieldtype: 'Link',
        options: 'DocType',
        change: function() {
            let doctype = this.get_value();
            if (doctype) {
                frappe.call({
                    method: 'nameshift.nameshift.page.nameshift_selector.nameshift_selector.get_fields',
                    args: {
                        doctype: doctype
                    },
                    callback: function(r) {
                        let fields = r.message || [];
                        let field_select = page.fields_dict.select_field.$wrapper;
                        field_select.empty();
                        fields.forEach(field => {
                            $('<option>', { value: field.fieldname, text: field.label }).appendTo(field_select);
                        });
                    }
                });
            }
        }
    });

    page.add_field({
        fieldname: 'select_field',
        label: 'Select Field',
        fieldtype: 'Select'
    });

    page.add_field({
        fieldname: 'new_field_name',
        label: 'New Field Name',
        fieldtype: 'Data'
    });

    page.add_field({
        fieldname: 'rename_field',
        label: 'Rename Field',
        fieldtype: 'Button',
        click: function() {
            let doctype = page.fields_dict.select_doctype.get_value();
            let field = page.fields_dict.select_field.get_value();
            let new_field_name = page.fields_dict.new_field_name.get_value();

            if (doctype && field && new_field_name) {
                frappe.call({
                    method: 'nameshift.nameshift.page.nameshift_selector.nameshift_selector.rename_field',
                    args: {
                        doctype: doctype,
                        field: field,
                        new_field_name: new_field_name
                    },
                    callback: function(r) {
                        if (r.message === 'success') {
                            frappe.msgprint('Field renamed successfully');
                        } else {
                            frappe.msgprint('Error renaming field');
                        }
                    }
                });
            } else {
                frappe.msgprint('Please fill in all fields');
            }
        }
    });
};
