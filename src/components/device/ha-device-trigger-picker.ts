import "@polymer/paper-icon-button/paper-icon-button";
import "@polymer/paper-input/paper-input";
import "@polymer/paper-item/paper-icon-item";
import "@polymer/paper-item/paper-item-body";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu-light";
import "@polymer/paper-listbox/paper-listbox";
import memoizeOne from "memoize-one";
import {
  LitElement,
  TemplateResult,
  html,
  css,
  CSSResult,
  property,
} from "lit-element";
import { HomeAssistant } from "../../types";
import { fireEvent } from "../../common/dom/fire_event";
import { compare } from "../../common/string/compare";

export interface DeviceTrigger {
  platform: string;
  domain: string;
  //device_id: string;
  device_id2: string;
  entity_id?: string;
  type?: string; // Make non optional
  topic?: string;
  // Store below in an optional data dict?
  /*payload?: string;
  encoding?: string;
  name?: string;*/
}

const fetchDeviceTriggers = (hass, deviceId) =>
  hass.callWS<DeviceTrigger[]>({
    type: "device_automation/list_triggers",
    device_id: deviceId,
  });
/*conn.sendMessagePromise({
    type: "device_automation/list_triggers",
    device_id: deviceId,
  });*/

class HaEntityPicker extends LitElement {
  public hass?: HomeAssistant;
  @property() public label?: string;
  @property() public value?: string;
  @property() public deviceId?: string;
  @property() public triggers?: DeviceTrigger[];

  private _sortedTriggers = memoizeOne((triggers?: DeviceTrigger[]) => {
    console.log(triggers);
    return triggers || [];
    /*if (!triggers || triggers.length === 1) {
      return triggers || [];
    }
    const sorted = [...triggers];
    //sorted.sort((a, b) => compare(a.name, b.name));
    sorted.sort((a, b) => compare(a.domain, b.domain)); // Do something smarter
    return sorted;*/
  });

  protected render(): TemplateResult | void {
    return html`
      <paper-dropdown-menu-light .label=${this.label}>
        <paper-listbox
          slot="dropdown-content"
          .selected=${this._value}
          attr-for-selected="data-trigger"
          @iron-select=${this._triggerChanged}
        >
          <paper-icon-item data-trigger="">
            No trigger
          </paper-icon-item>
          ${this._sortedTriggers(this.triggers).map(
            (trigger) => html`
              <paper-icon-item data-trigger=${JSON.stringify(trigger)}>
                <ha-user-badge
                  .user=${trigger}
                  slot="item-icon"
                ></ha-user-badge>
                ${trigger.entity_id} ${trigger.type} ${trigger.name}
              </paper-icon-item>
            `
          )}
        </paper-listbox>
      </paper-dropdown-menu-light>
    `;
  }

  private get _value() {
    return this.value || "";
  }

  protected firstUpdated(changedProps) {
    console.log("firstUpdated");
    super.firstUpdated(changedProps);
    if (this.triggers === undefined) {
      console.log(this.deviceId);
      fetchDeviceTriggers(this.hass!, this.deviceId).then((trigger) => {
        console.log(trigger);
        this.triggers = trigger.triggers;
      });
    }
  }

  protected updated(oldProps) {
    console.log("updated");
    console.log(oldProps);
    console.log(this.deviceId);
    console.log(oldProps["deviceId"]);
    console.log(oldProps.deviceId);
    if (oldProps.has("deviceId") && oldProps.get("deviceId") != this.deviceId) {
      fetchDeviceTriggers(this.hass!, this.deviceId).then((trigger) => {
        console.log(trigger);
        this.triggers = trigger.triggers;
      });
    }
  }

  componentDidUpdate(oldProps) {
    console.log("componentDidUpdate");
    console.log(oldProps);
    //const newProps = this.props
    //if(oldProps.field !== newProps.field) {
    //  this.setState({ ...something based on newProps.field... })
    //}
  }

  private _triggerChanged(ev) {
    console.log("_triggerChanged");
    console.log(ev);
    console.log(ev.detail.item.dataset.trigger);
    const newValue = JSON.parse(ev.detail.item.dataset.trigger);

    if (newValue !== this._value) {
      //this.value = newValue;
      setTimeout(() => {
        fireEvent(this, "value-changed", { value: newValue });
        fireEvent(this, "change");
      }, 0);
    }
  }

  static get styles(): CSSResult {
    return css`
      :host {
        display: inline-block;
      }
      paper-dropdown-menu-light {
        display: block;
      }
      paper-listbox {
        min-width: 200px;
      }
      paper-icon-item {
        cursor: pointer;
      }
    `;
  }
}

customElements.define("ha-device-trigger-picker", HaEntityPicker);
