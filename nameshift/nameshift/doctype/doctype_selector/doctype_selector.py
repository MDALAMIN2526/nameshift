import frappe
from frappe.model.document import Document

class DocTypeSelector(Document):
    def on_update(self):
        if self.app and self.doctype and self.field and self.new_label:
            self.update_field_label()

    def update_field_label(self):
        # Fetch DocType details
        meta = frappe.get_meta(self.doctype)
        field = next((f for f in meta.fields if f.fieldname == self.field), None)
        
        if field:
            # Update field label
            field.label = self.new_label
            frappe.db.sql("""
                UPDATE `tabDocField`
                SET label=%s
                WHERE parent=%s AND fieldname=%s
            """, (self.new_label, self.doctype, self.field))
            frappe.clear_cache(doctype=self.doctype)

@frappe.whitelist()
def get_doctypes(app):
    doctypes = frappe.get_all('DocType', filters={'module': app}, pluck='name')
    return doctypes

@frappe.whitelist()
def get_fields(doctype):
    fields = frappe.get_meta(doctype).fields
    fieldnames = [f.fieldname for f in fields]
    return fieldnames

