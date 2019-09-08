import { h, Component } from "preact";

import "../../../../components/device/ha-device-picker";
import "../../../../components/device/ha-device-trigger-picker";
import "../../../../components/paper-time-input";

import { onChangeEvent } from "../../../../common/preact/event";

export default class DeviceTrigger extends Component {
  constructor() {
    super();
    this.onChange = onChangeEvent.bind(this, "trigger");
    this.devicePicked = this.devicePicked.bind(this);
    this.deviceTriggerPicked = this.deviceTriggerPicked.bind(this);
    this.state.device_id = undefined;
  }

  devicePicked(ev) {
    this.setState({ device_id: ev.target.value });
  }

  deviceTriggerPicked(ev) {
    const deviceTrigger = ev.target.value;
    console.log("deviceTriggerPicked: ", deviceTrigger);
    const trgFor = this.props.trigger.for;
    this.props.onChange(
      this.props.index,
      Object.assign({}, (this.props.trigger = deviceTrigger), { for: trgFor })
    );
  }

  /* eslint-disable camelcase */
  render({ trigger, hass }, { device_id }) {
    console.log(trigger);
    if (device_id === undefined) device_id = trigger.device_id;
    const showFor = trigger.domain === "light";
    let trgFor = trigger.for;

    if (trgFor && (trgFor.hours || trgFor.minutes || trgFor.seconds)) {
      // If the trigger was defined using the yaml dict syntax, convert it to
      // the equivalent string format
      let { hours = 0, minutes = 0, seconds = 0 } = trgFor;
      hours = hours.toString();
      minutes = minutes.toString().padStart(2, "0");
      seconds = seconds.toString().padStart(2, "0");

      //trgFor = `${hours}:${minutes}:${seconds}`;
    }
    console.log(trgFor);

    return (
      <div>
        <ha-device-picker
          value={device_id}
          onChange={this.devicePicked}
          hass={hass}
          label="Device"
        />
        <ha-device-trigger-picker
          value={trigger}
          deviceId={device_id}
          onChange={this.deviceTriggerPicked}
          hass={hass}
          label="Trigger"
        />
        <paper-time-input
          label={hass.localize(
            "ui.panel.config.automation.editor.triggers.type.state.for"
          )}
          name="for"
          format={24}
          //value={trigger.domain}
          value={{ trgFor }}
          onvalue-changed={this.onChange}
          hidden={!showFor}
        />
      </div>
    );
  }
}

DeviceTrigger.defaultConfig = {
  device_id: "",
  domain: "",
  entity_id: "",
};
