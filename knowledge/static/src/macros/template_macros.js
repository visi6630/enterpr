/** @odoo-module */

import { AbstractMacro } from "@knowledge/macros/abstract_macro";
import { pasteElements } from "@knowledge/macros/utils";

export class SendAsMessageMacro extends AbstractMacro {
    /**
     * @override
     * @returns {Array[Object]}
     */
    macroAction() {
        const action = super.macroAction();
        let sendMessageLastClickedEl = null;
        action.steps.push({
            trigger: function() {
                this.validatePage();
                const el = this.getFirstVisibleElement('.o_ChatterTopbar_buttonSendMessage:not([disabled])');
                if (el) {
                    if (el.classList.contains('o-active')) {
                        return el;
                    } else if (el !== sendMessageLastClickedEl) {
                        el.click();
                        sendMessageLastClickedEl = el;
                    }
                } else {
                    this.searchInXmlDocNotebookTab('.oe_chatter');
                }
                return null;
            }.bind(this),
            action: () => {},
        }, {
            trigger: function() {
                this.validatePage();
                return this.getFirstVisibleElement('.o_Composer_buttonFullComposer:not([disabled])');
            }.bind(this),
            action: 'click',
        }, {
            trigger: function () {
                this.validatePage();
                const dialog = this.getFirstVisibleElement('.o_dialog_container.modal-open .o_mail_composer_form');
                if (dialog) {
                    return this.getFirstVisibleElement(dialog.querySelector('.o_field_html[name="body"] > .odoo-editor-editable'));
                }
                return null;
            }.bind(this),
            action: pasteElements.bind(this, this.data.dataTransfer),
        }, this.unblockUI);
        return action;
    }
}

export class UseAsDescriptionMacro extends AbstractMacro {
    /**
     * @override
     * @returns {Array[Object]}
     */
    macroAction() {
        const action = super.macroAction();
        action.steps.push({
            trigger: function () {
                const readonly = this.getFirstVisibleElement('.o_form_readonly');
                if (readonly) {
                    const editButton = this.getFirstVisibleElement('.o_form_view .o_form_button_edit');
                    return editButton;
                }
                return this.getFirstVisibleElement('.o_form_editable');
            }.bind(this),
            action: (el) => {
                if (el.classList.contains('o_form_button_edit')) {
                    el.click();
                }
            },
        }, {
            trigger: function () {
                return this.getFirstVisibleElement('.o_form_editable');
            }.bind(this),
            action: () => {},
        }, {
            trigger: function () {
                this.validatePage();
                const el = this.getFirstVisibleElement(
                    `.o_field_html[name="${this.data.fieldName}"]`,
                    (element) => element.querySelector('.odoo-editor-editable'),
                );
                if (el) {
                    return el;
                }
                if (this.data.pageName) {
                    this.searchInXmlDocNotebookTab(`page[name="${this.data.pageName}"]`);
                }
                return null;
            }.bind(this),
            action: 'click',
        }, {
            trigger: function () {
                this.validatePage();
                return this.getFirstVisibleElement(`.o_field_html[name="${this.data.fieldName}"] > .odoo-editor-editable`);
            }.bind(this),
            action: function (el) {
                pasteElements(this.data.dataTransfer, el);
            }.bind(this),
        }, this.unblockUI);
        return action;
    }
}
