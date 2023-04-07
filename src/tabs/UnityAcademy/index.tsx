/**
 * Tab for Source Academy's Unity Academy module
 * @module unity_academy
 * @author Wang Zihan
 */

import React from 'react';
import { type DebuggerContext } from '../../typings/type_helpers';
import { Button, NumericInput } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { UNITY_ACADEMY_BACKEND_URL } from '../../bundles/unity_academy/config';
import { getInstance } from '../../bundles/unity_academy/UnityAcademy';

type Props = { };

class Unity3DTab extends React.Component<Props> {
  render() {
    let highFPSWarning;
    const currentTargetFrameRate = getInstance()
      .getTargetFrameRate();
    if (currentTargetFrameRate > 30 && currentTargetFrameRate <= 60) {
      highFPSWarning = <div style={{ color: 'yellow' }}>[Warning] You are using a target fps higher than default value (30). Higher FPS will lead to more cost in your device's resources such as GPU, increace device temperature and battery usage and may even lead to browser not responding, crash the browser or even crash your operation system if your device really can not endure the high resource cost.</div>;
    } else if (currentTargetFrameRate > 60 && currentTargetFrameRate <= 120) {
      highFPSWarning = <div style={{ color: 'red' }}>[!!WARNING!!] You are using a target fps that is extremely high. This FPS may lead to large cost in your device's resources such as GPU, significantly increace device temperature and battery usage and have a large chance of making browser not responding, crash the browser or even crash your operation system if your device's performance is not enough.<br/><br/> ***ARE YOU REALLY CONFIDENT ABOUT THE PERFORMANCE OF YOUR OWN DEVICE?***</div>;
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
        <p>Otherwise it may lead to a potential waste to your device's resources (such as RAM) and battery.</p>
        <br/>
        <p><b>Note that you need to use a <u>'Native'</u> variant of Source language in order to use this module.</b> If any strange error happens when using this module, please check whether you are using the 'Native' variant of Source language or not.</p>
        <br/>
        <p>100% resolution will display Unity Academy in a larger area with more detailed graphics but requires higher GPU performance than 50% resolution.</p>
        <Button
          icon={IconNames.SEND_TO}
          active={true}
          onClick={() => {
            this.openUnityWindow(25);
          }}
          text="Open Unity Academy (25% Resolution / Recommended for low GPU performance devices)"
        />
        <Button
          icon={IconNames.SEND_TO}
          active={true}
          onClick={() => {
            this.openUnityWindow(50);
          }}
          text="Open Unity Academy (50% Resolution / Recommended for average GPU performance devices)"
        />
        <br/>
        <Button
          icon={IconNames.SEND_TO}
          active={true}
          onClick={() => {
            this.openUnityWindow(100);
          }}
          text="Open Unity Academy (100% Resolution / Best quality and high GPU performance cost)"
        />
        <br/>
        <br/>
        <p>Target Frame Rate: </p>
        <div style = {{ display: 'inline-flex' }}>
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
        {highFPSWarning}
        <br/>
        <br/>
        <div>3D Prefab Information: <a href = {`${UNITY_ACADEMY_BACKEND_URL}webgl_assetbundles/prefab_info.html`} rel="noopener noreferrer" target="_blank" >Click Here</a>{dimensionMode === '2d' && ' (You need 3D mode to use prefabs.)'}</div>
        <div>Code Examples: <a href = {`${UNITY_ACADEMY_BACKEND_URL}code_examples.html`} rel="noopener noreferrer" target="_blank" >Click Here</a></div>
      </div>
    );
  }

  openUnityWindow(resolution) {
    const INSTANCE = getInstance();
    if (INSTANCE === undefined) {
      alert('No running Unity application found. Please rerun your code and try again.');
      return;
    }
    INSTANCE.setShowUnityComponent(resolution);
  }
}


export default {
  /**
   * This function will be called to determine if the component will be
   * rendered.
   * @param {DebuggerContext} context
   * @returns {boolean}
   */
  toSpawn(_context: DebuggerContext) {
    return getInstance() !== undefined;
  },

  /**
   * This function will be called to render the module tab in the side contents
   * on Source Academy frontend.
   * @param {DebuggerContext} context
   */
  body(_context: DebuggerContext) {
    return <Unity3DTab />;
  },

  /**
   * The Tab's icon tooltip in the side contents on Source Academy frontend.
   */
  label: 'Unity Academy',

  /**
   * BlueprintJS IconName element's name, used to render the icon which will be
   * displayed in the side contents panel.
   * @see https://blueprintjs.com/docs/#icons
   */
  iconName: 'cube',
};
