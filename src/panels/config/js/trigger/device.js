import { h, Component } from "preact";

import "@polymer/paper-input/paper-input";
import "../../../../components/device/ha-device-picker";
import "../../../../components/device/ha-device-trigger-picker";
import "../../../../components/device/ha-device-trigger-picker2";

import { onChangeEvent } from "../../../../common/preact/event";

export default class DeviceTrigger extends Component {
  constructor() {
    super();
    this.deviceId = "a64b668813a6445c838ef924d32dda5d";
    this.onChange = onChangeEvent.bind(this, "trigger");
    this.devicePicked = this.devicePicked.bind(this);
    this.deviceTriggerPicked = this.deviceTriggerPicked.bind(this);
  }

  devicePicked(ev) {
    console.log(ev);
    console.log(ev.target.value);
    console.log(this.props);
    this.deviceId = ev.target.value;
    this.props.onChange(
      this.props.index,
      Object.assign({}, this.props.trigger, {
        device_id: ev.target.value,
        //foo: "bar",
      })
    );
  }

  deviceTriggerPicked(ev) {
    console.log(ev);
    console.log(ev.target.value);
    console.log(ev.target.dataset);
    let deviceTrigger = JSON.parse(ev.target.value);
    this.props.onChange(
      this.props.index,
      Object.assign({}, this.props.trigger, deviceTrigger)
    );
  }

  /* eslint-disable camelcase */
  render({ trigger, hass, localize }) {
    const { device_id, to } = trigger;
    const trgFrom = trigger.from;
    let trgFor = trigger.for;

    if (trgFor && (trgFor.hours || trgFor.minutes || trgFor.seconds)) {
      // If the trigger was defined using the yaml dict syntax, convert it to
      // the equivalent string format
      let { hours = 0, minutes = 0, seconds = 0 } = trgFor;
      hours = hours.toString();
      minutes = minutes.toString().padStart(2, "0");
      seconds = seconds.toString().padStart(2, "0");

      trgFor = `${hours}:${minutes}:${seconds}`;
    }
    return (
      <div>
        <ha-device-picker
          value={device_id}
          onChange={this.devicePicked}
          hass={hass}
          label="Device"
          allowCustomEntity
        />
        <ha-device-trigger-picker
          deviceId={this.deviceId}
          onChange={this.deviceTriggerPicked}
          onValueChanged={this.deviceTriggerPicked}
          on-value-changed={this.deviceTriggerPicked}
          hass={hass}
          label="Trigger"
          allowCustomEntity
        />
        <paper-input
          label={localize(
            "ui.panel.config.automation.editor.triggers.type.state.from"
          )}
          name="from"
          value={trgFrom}
          onvalue-changed={this.onChange}
        />
        <paper-input
          label={localize(
            "ui.panel.config.automation.editor.triggers.type.state.to"
          )}
          name="to"
          value={to}
          onvalue-changed={this.onChange}
        />
        <paper-input
          label={localize(
            "ui.panel.config.automation.editor.triggers.type.state.for"
          )}
          name="for"
          value={trgFor}
          onvalue-changed={this.onChange}
        />
      </div>
    );
  }
}

DeviceTrigger.defaultConfig = {
  device_id: "",
};
