import { h, Component } from "preact";

import "../../../../components/device/ha-device-picker";
import "../../../../components/device/ha-device-trigger-picker";

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
    const deviceTrigger = ev.target.setTrigger;
    this.props.onChange(this.props.index, (this.props.trigger = deviceTrigger));
  }

  /* eslint-disable camelcase */
  render({ trigger, hass, localize }, { device_id }) {
    if (device_id === undefined) device_id = trigger.device_id;
    //const showFor = trigger.domain === "light";
    const showFor = false;

    return (
      <div>
        <ha-device-picker
          value={device_id}
          onChange={this.devicePicked}
          hass={hass}
          label="Device"
        />
        <ha-device-trigger-picker
          presetTrigger={trigger}
          deviceId={device_id}
          onChange={this.deviceTriggerPicked}
          hass={hass}
          label="Trigger"
        />
        <paper-input
          label={localize(
            "ui.panel.config.automation.editor.triggers.type.state.for"
          )}
          name="for"
          //value={trigger.domain}
          onvalue-changed={this.onChange}
          hidden={!showFor}
        />
      </div>
    );
  }
}

DeviceTrigger.defaultConfig = {
  device_id: "",
};
