/**
 * Tab for Source Academy's Unity Academy module
 * @module unity_academy
 * @author Wang Zihan
 */

import { Button, Checkbox, NumericInput } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { getInstance } from '@sourceacademy/bundle-unity_academy/UnityAcademy';
import { UNITY_ACADEMY_BACKEND_URL } from '@sourceacademy/bundle-unity_academy/config';
import { defineTab } from '@sourceacademy/modules-lib/tabs/utils';
import React from 'react';

type Props = {};

class Unity3DTab extends React.Component<Props> {
  private userAgreementCheckboxChecked: boolean;
  constructor(props: Props) {
    super(props);
    this.userAgreementCheckboxChecked = false;
  }
  render() {
    let highFPSWarning;
    const currentTargetFrameRate = getInstance()
      .getTargetFrameRate();
    if (currentTargetFrameRate > 30 && currentTargetFrameRate <= 60) {
      highFPSWarning = <div style={{ color: 'yellow' }}>[Warning] You are using a target FPS higher than default value (30). Higher FPS will lead to more cost in your device&apos;s resources such as GPU, increace device temperature and battery usage and may even lead to browser not responding, crash the browser or even crash your operation system if your device really can not endure the high resource cost.</div>;
    } else if (currentTargetFrameRate > 60 && currentTargetFrameRate <= 120) {
      highFPSWarning = <div style={{ color: 'red' }}>[!!WARNING!!] You are using a target FPS that is extremely high. This FPS may lead to large cost in your device&apos;s resources such as GPU, significantly increace device temperature and battery usage and have a large chance of making browser not responding, crash the browser or even crash your operation system if your device&apos;s performance is not enough.<br/><br/> ***ARE YOU REALLY CONFIDENT ABOUT THE PERFORMANCE OF YOUR OWN DEVICE?***</div>;
    } else {
      highFPSWarning = <div/>;
    }
    const dimensionMode = getInstance().dimensionMode;
    return (
      <div>
        <p>Click the button below to open the Unity Academy Window filling the page.</p>
        <p><b>Current Mode: {dimensionMode === '3d' ? '3D' : '2D'}</b></p>
        <br/>
        <p><b>Remember always terminate the Unity Academy application when you completely finish programming with this module</b> to clean up the engine and free up memory.</p>
        <p>Otherwise it may lead to a potential waste to your device&apos;s resources (such as RAM) and battery.</p>
        <br/>
        <p><b>Note that you need to use a <u>&apos;Native&apos;</u> variant of Source language in order to use this module.</b> If any strange error happens when using this module, please check whether you are using the &apos;Native&apos; variant of Source language or not.</p>
        <br/>
        <Button
          icon={IconNames.SEND_TO}
          active={true}
          onClick={() => {
            this.openUnityWindow(100);
          }}
          text="Open Unity Academy Embedded Frontend"
        />
        <br/>
        <br/>
        <p>If the frame rate is low when you are using Unity Academy with the default resolution, try using Unity Academy with 50% resolution here:</p>
        <p>50% resolution will display Unity Academy in a smaller area with lower quality and less detailed graphics but requires less device (especially GPU) performance than the default resolution.</p>
        <Button
          icon={IconNames.SEND_TO}
          active={true}
          onClick={() => {
            this.openUnityWindow(50);
          }}
          text="Open with 50% resolution"
        />
        <br/>
        <br/>
        <p>Target (Maximum) Frame Rate (Frames Per Second): </p>
        <div style={{ display: 'inline-flex' }}>
          <NumericInput
            style={{ width: 100 }}
            leftIcon={IconNames.REFRESH}
            value={currentTargetFrameRate}
            max={120}
            min={15}
            onValueChange={(x) => {
              getInstance()
                .setTargetFrameRate(x);
              this.setState({});
            }}
            stepSize={1}
          />
          <Button
            active={true}
            onClick={() => {
              getInstance()
                .setTargetFrameRate(30);
              this.setState({});
            }}
            text="30"
          />
          <Button
            active={true}
            onClick={() => {
              if (confirm('Set the target frame rate higher than the default recommended value (30) ?')) {
                getInstance()
                  .setTargetFrameRate(60);
                this.setState({});
              }
            }}
            text="60"
          />
          <Button
            active={true}
            onClick={() => {
              if (confirm('Set the target frame rate higher than the default recommended value (30) ?')) {
                getInstance()
                  .setTargetFrameRate(90);
                this.setState({});
              }
            }}
            text="90"
          />
          <Button
            active={true}
            onClick={() => {
              if (confirm('Set the target frame rate higher than the default recommended value (30) ?')) {
                getInstance()
                  .setTargetFrameRate(120);
                this.setState({});
              }
            }}
            text="120"
          />
        </div>
        <p>The actual frame rate depends on your device&apos;s performance.</p>
        {highFPSWarning}
        <br/>
        <div>Code Examples: <a href={`${UNITY_ACADEMY_BACKEND_URL}code_examples.html`} rel="noopener noreferrer" target="_blank" >Click Here</a></div>
        <div>3D Prefab Information: <a href={`${UNITY_ACADEMY_BACKEND_URL}webgl_assetbundles/prefab_info.html`} rel="noopener noreferrer" target="_blank" >Click Here</a>{dimensionMode === '2d' && ' (You need 3D mode to use prefabs.)'}</div>
        <br/>
        <div>Please note that before using Unity Academy and this module, you must agree to our <a href={`${UNITY_ACADEMY_BACKEND_URL}user_agreement.html`} rel="noopener noreferrer" target="_blank" >User Agreement</a></div>
        <br/>
        {getInstance()
          .getUserAgreementStatus() === 'new_user_agreement' && <div><b>The User Agreement has updated.</b><br/></div>}
        <Checkbox label="I agree to the User Agreement" inputRef={(e) => {
          if (e !== null) {
            e.checked = getInstance()
              .getUserAgreementStatus() === 'agreed';
            this.userAgreementCheckboxChecked = e.checked;
          }
        }} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          this.userAgreementCheckboxChecked = event.target.checked;
          getInstance()
            .setUserAgreementStatus(this.userAgreementCheckboxChecked);
        }} />
      </div>
    );
  }

  openUnityWindow(resolution: number): void {
    if (!this.userAgreementCheckboxChecked) {
      alert('You must agree to the our User Agreement before using Unity Academy and this module!');
      return;
    }
    const INSTANCE = getInstance();
    if (INSTANCE === undefined) {
      alert('No running Unity application found. Please rerun your code and try again.');
      return;
    }
    INSTANCE.setShowUnityComponent(resolution);
  }
}

export default defineTab({
  toSpawn() {
    return getInstance() !== undefined;
  },

  body() {
    return <Unity3DTab />;
  },

  label: 'Unity Academy',

  iconName: IconNames.CUBE
});
