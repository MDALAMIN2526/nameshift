import frappe

@frappe.whitelist()
def get_fields(doctype):
    meta = frappe.get_meta(doctype)
    fields = [{'fieldname': df.fieldname, 'label': df.label} for df in meta.fields]
    return fields

@frappe.whitelist()
def rename_field(doctype, field, new_field_name):
    try:
        frappe.db.sql(f"""
            UPDATE `tabDocField`
            SET fieldname=%s
            WHERE parent=%s AND fieldname=%s
        """, (new_field_name, doctype, field))

        # Also update in custom fields if exists
        frappe.db.sql(f"""
            UPDATE `tabCustom Field`
            SET fieldname=%s
            WHERE dt=%s AND fieldname=%s
        """, (new_field_name, doctype, field))

        # Commit the changes
        frappe.db.commit()

        # Reload the DocType to apply changes
        frappe.reload_doctype(doctype)
        return 'success'
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), 'nameshift_selector.rename_field')
        return str(e)
