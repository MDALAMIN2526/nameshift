frappe.ui.form.on('DocType Selector', {
    app: function(frm) {
        // Fetch DocTypes for the selected app
        frappe.call({
            method: 'nameshift.nameshift.doctype.nameshift_selector.nameshift_selector.get_doctypes',
            args: {
                app: frm.doc.app
            },
            callback: function(r) {
                if(r.message) {
                    frm.set_df_property('doctype', 'options', r.message);
                }
            }
        });
    },
    doctype: function(frm) {
        // Fetch fields for the selected DocType
        frappe.call({
            method: 'nameshift.nameshift.doctype.nameshift_selector.nameshift_selector.get_fields',
            args: {
                doctype: frm.doc.doctype
            },
            callback: function(r) {
                if(r.message) {
                    frm.set_df_property('field', 'options', r.message);
                }
            }
        });
    }
});

