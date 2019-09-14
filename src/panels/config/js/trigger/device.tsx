import { h, Component } from "preact";

import "../../../../components/device/ha-device-picker";
import "../../../../components/device/ha-device-trigger-picker";
import "../../../../components/paper-time-input";

export default class DeviceTrigger extends Component<any, any> {
  constructor() {
    super();
    this.devicePicked = this.devicePicked.bind(this);
    this.deviceTriggerPicked = this.deviceTriggerPicked.bind(this);
    this.durationChanged = this.durationChanged.bind(this);
    this.state = { device_id: undefined };
  }

  public devicePicked(ev) {
    this.setState({ device_id: ev.target.value });
  }

  public deviceTriggerPicked(ev) {
    const trgFor = this.props.trigger.for;
    const deviceTrigger = Object.assign(
      {},
      ev.target.value/*, { for: trgFor }*/
    );
    //const showFor = deviceTrigger.domain === "light";
    const showFor = deviceTrigger.hasOwnProperty("for");
    if (showFor) {
        deviceTrigger.for = trgFor;
    }
    console.log("showFor: ", showFor, " deviceTrigger: ", deviceTrigger);
    this.props.onChange(
      this.props.index,
      deviceTrigger
    );
  }

  public durationChanged(ev) {
    console.log('durationChanged: "', ev, '"');
    let duration = ev.detail.value;
    if (duration) {
      duration = duration + ":" + "00";
    }
    this.props.onChange(
      this.props.index,
      Object.assign({}, this.props.trigger, { for: duration })
    );
  }

  /* eslint-disable camelcase */
  public render({ trigger, hass }, { device_id }) {
    console.log(hass);
    console.log(trigger);
    if (device_id === undefined) {
      device_id = trigger.device_id;
    }
    const showFor = deviceTrigger.hasOwnProperty("for");
    let trgFor = trigger.for;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (trgFor && (trgFor.hours || trgFor.minutes || trgFor.seconds)) {
      // If the trigger was defined using the yaml dict syntax, extract hours, minutes and seconds
      { hours = 0, minutes = 0, seconds = 0 } = trgFor;
    }
    if (trgFor && trgFor.split(":")) { // TODO: Check instead if trgFor is string and ':' in trgFor
      // Parse hours, minutes and seconds from ':'-delimited string
      [ hours = 0, minutes = 0, seconds = 0 ] = trgFor.split(":");
    }
    hours = hours.toString().padStart(2, "0");
    minutes = minutes.toString().padStart(2, "0");
    seconds = seconds.toString().padStart(2, "0");

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
          hour={hours}
          min={minutes}
          format={24}
          onvalue-changed={this.durationChanged}
          hidden={!showFor} //TODO: Doesn't work, fix
        />
      </div>
    );
  }
}

(DeviceTrigger as any).defaultConfig = {
  device_id: "",
  domain: "",
  entity_id: "",
};
