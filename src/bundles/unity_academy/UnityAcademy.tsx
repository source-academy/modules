/**
 * Source Academy's Unity Academy module
 * This module needs to use together with Unity Academy, an external project outside Source Academy organization that is also made by myself
 * @module unity_academy
 * @author Wang Zihan
 */

import { UNITY_ACADEMY_BACKEND_URL, BUILD_NAME } from './config';
import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

type Vector3 = {
  x : number;
  y : number;
  z : number;
};

type Transform = {
  position : Vector3;
  rotation : Vector3;
  scale : Vector3;
};

type StudentGameObject = {
  startMethod : Function | null;
  updateMethod : Function | null;
  onCollisionEnterMethod : Function | null;
  onCollisionStayMethod : Function | null;
  onCollisionExitMethod : Function | null;
  transform : Transform;
  rigidbody : RigidbodyData | null;
  customProperties : any;
  isDestroyed : boolean; // [set by interop]
};

type InputData = {
  keyboardInputInfo : { [key : string] : number };
};

type RigidbodyData = {
  velocity : Vector3;
  angularVelocity : Vector3;
  mass : number;
  useGravity : boolean;
  drag : number;
  angularDrag : number;
};

declare const createUnityInstance : Function; // This function comes from Build.loader.js in Unity Academy Application

export function getInstance() : UnityAcademyJsInteropContext {
  return (window as any).unityAcademyContext as UnityAcademyJsInteropContext;
}

export class GameObjectIdentifier { // A wrapper class to store identifier string and prevent users from using arbitrary string for idenfitier
  gameObjectIdentifier : string;
  constructor(gameObjectIdentifier : string) {
    this.gameObjectIdentifier = gameObjectIdentifier;
  }
}

// Information of the special React component for this module:
// I can not simply put Unity component into the module's tab, and here are the reasons:
// This is because Unity Academy instance runs in the background once it's loaded until user refreshes or closes the web page.
// Also, unlike loading most other SA modules, loading Unity Academy app and prefab asset bundles requires more network traffic.
// Since it may take some time to load if the network situation is not good, I can't make it just simply reload the Unity instance everytime students rerun their program.
// But when put in tab, every time the tab component is recreated, the current Unity Academy WASM app instance will lost its canvas to draw and causing errors.
// So I need the Unity app instance, Unity canvas and its container, this Unity React component, to always exist in the current HTML content until user refreshes or closes the web page.
// Also, the display space in the Tab area is relatively small for holding a game window.
// Another reason of using separated React component is to let Unity Academy be able to fill the whole page to give students higher resolution graphics and more fancy visual effects.
class UnityComponent extends React.Component<any> {
  render() {
    const moduleInstance = getInstance();
    return (
    // <div style={{ width: '90%', height: '90%', position: 'absolute', left: '5%', top: '0%', visibility: `${ this.moduleInstance.showUnityComponent ? 'visible' : 'hidden'}` }}>
      <div style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        left: '0%',
        top: '0%',
        zIndex: '9999',
      }}>
        <div style={{
          backgroundColor: 'rgba(100,100,100,0.75)',
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: '-1',
        }}>
          <p id = "unity_load_info" style={{
            textAlign: 'center',
            lineHeight: '30',
            fontSize: '23px',
            color: 'cyan',
          }}>Preparing to load Unity Academy...</p>
        </div>
        <div id="unity-container">
          <canvas id="unity-canvas" style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
          }}></canvas>
        </div>
        <Button
          icon={IconNames.CROSS}
          active={true}
          onClick={() => { moduleInstance.setShowUnityComponent(0); }}// Note: Here if I directly use "this.moduleInstance......" instead using this lambda function, the "this" reference will become undefined and lead to a runtime error when user clicks the "Run" button
          text="Hide Unity Academy Window"
          style={{
            position: 'absolute',
            left: '0%',
            top: '0%',
            width: '15%',
          }}
        />
        <Button
          icon={IconNames.DISABLE}
          active={true}
          onClick={() => { moduleInstance.terminate(); }}
          text="Terminate Unity Academy Instance"
          style={{
            position: 'absolute',
            left: '17%',
            top: '0%',
            width: '20%',
          }}
        />
      </div>
    );
  }

  componentDidMount() {
    getInstance()
      .firstTimeLoadUnityApplication();
  }
}



const UNITY_CONFIG = {
  loaderUrl: `${UNITY_ACADEMY_BACKEND_URL}frontend/${BUILD_NAME}.loader.js`,
  dataUrl: `${UNITY_ACADEMY_BACKEND_URL}frontend/${BUILD_NAME}.data.gz`,
  frameworkUrl: `${UNITY_ACADEMY_BACKEND_URL}frontend/${BUILD_NAME}.framework.js.gz`,
  codeUrl: `${UNITY_ACADEMY_BACKEND_URL}frontend/${BUILD_NAME}.wasm.gz`,
  streamingAssetsUrl: `${UNITY_ACADEMY_BACKEND_URL}webgl_assetbundles`,
  companyName: 'Wang Zihan @ NUS SoC 2026',
  productName: 'Unity Academy (Source Academy Embedding Version)',
  productVersion: 'prod-2023.4',
};


class UnityAcademyJsInteropContext {
  // private unityConfig : any;
  public unityInstance : any;
  private unityContainerElement : HTMLElement | null;
  private studentGameObjectStorage : { [gameObjectIdentifier : string] : StudentGameObject }; // [get by interop]
  private prefabInfo: any;
  private gameObjectIdentifierSerialCounter = 0;
  private studentActionQueue : any; // [get / clear by interop]
  private deltaTime = 0; // [set by interop]
  private input : InputData; // [set by interop] 0 = key idle, 1 = on key down, 2 = holding key, 3 = on key up
  public gameObjectIdentifierWrapperClass : any; // [get by interop] For interop to create the class instance with the correct type when calling users' Start and Update functions. Only the object with this class type can pass checkGameObjectIdentifierParameter in functions.ts
  private targetFrameRate : number;
  private unityInstanceState; // [set by interop]
  private guiData : any[]; // [get / clear by interop]
  public dimensionMode;

  constructor() {
    this.unityInstance = null;
    this.unityContainerElement = document.getElementById('unity_container');
    if (this.unityContainerElement === undefined || this.unityContainerElement === null) {
      this.unityContainerElement = document.createElement('div');
      this.unityContainerElement.id = 'unity_container';
    }

    this.loadPrefabInfo();
    this.studentActionQueue = [];
    this.studentGameObjectStorage = {};
    this.guiData = [];
    this.input = {
      keyboardInputInfo: {},
    };
    this.targetFrameRate = 30;


    // [ Why I don't put this into my module's own context? ]
    // Since Unity Academy application needs to access this from the WASM side, and the Unity Academy WASM side can not access the module context under the js-slang evaluation scope since Unity Academy app is running totally separated from js-slang in the WASM virtual machine.
    // It means Unity Academy WASM app has no access to 'context.moduleContexts.unity3d.state' or anything in js-slang scope.
    // So I put the context under the global window variable and this would be the easiest and most efficient way for Unity Academy WASM app to access it.
    (window as any).unityAcademyContext = this;

    // Load Unity Academy App
    document.body.appendChild(this.unityContainerElement);
    ReactDOM.render(<UnityComponent />, this.unityContainerElement);
    this.setShowUnityComponent(0);

    this.gameObjectIdentifierWrapperClass = GameObjectIdentifier;

    // Create javascript side data storage for primitive GameObjects
    this.makeGameObjectDataStorage('MainCameraFollowingTarget');
  }

  private loadPrefabInfo() {
    const jsonUrl = `${UNITY_ACADEMY_BACKEND_URL}webgl_assetbundles/prefab_info.json`;
    const xhr = new XMLHttpRequest();
    // Here I use sync request because this json file is very small in size and more importantly, this file must be loaded before continue evaluating students' code
    // because it's used for check the availability of prefab name when students call 'instantiate' in their code.
    xhr.open('GET', jsonUrl, false);
    xhr.send();
    if (xhr.status !== 200) {
      throw new Error(`Unable to get prefab list. Error code = ${xhr.status}`);
    }
    this.prefabInfo = JSON.parse(xhr.responseText);
  }

  private createUnityAcademyInstance() {
    this.unityInstanceState = 'LoadingInstance';
    const canvas = document.querySelector('#unity-canvas');
    const unity_load_info = document.querySelector('#unity_load_info');
    createUnityInstance(canvas, UNITY_CONFIG, (progress) => {
      unity_load_info!.innerHTML = `Loading Unity Academy ( ${Math.floor(progress * 100)}% )`;
    })
      .then((unityInstance) => {
        this.unityInstance = unityInstance;
        unity_load_info!.innerHTML = '';
      })
      .catch((message) => {
        alert(message);
      });
  }

  firstTimeLoadUnityApplication() {
    const script = document.createElement('script');
    script.src = UNITY_CONFIG.loaderUrl;
    script.onload = () => {
      this.createUnityAcademyInstance();
    };
    document.body.appendChild(script);
  }

  reloadUnityAcademyInstanceAfterTermination() {
    this.createUnityAcademyInstance();
  }


  setShowUnityComponent(resolution: number) {
    const toShow = resolution > 0;
    const sendMessageFunctionName = 'SendMessage';
    if (toShow) {
      (this.unityContainerElement as any).style.visibility = 'visible';
      if (this.unityInstance !== null) {
        this.unityInstance[sendMessageFunctionName]('GameManager', 'WakeUpApplication');
      }
    } else {
      (this.unityContainerElement as any).style.visibility = 'hidden';
      // Make Unity Academy Application sleep to conserve resources (pause rendering, etc)
      if (this.unityInstance !== null) {
        this.unityInstance[sendMessageFunctionName]('GameManager', 'DoApplicationSleep');
      }
    }
    const unityCanvas = document.getElementById('unity-canvas') as any;
    if (unityCanvas !== null) {
      unityCanvas.style.width = `${resolution.toString()}%`;
      unityCanvas.style.height = `${resolution.toString()}%`;
      unityCanvas.style.left = `${((100 - resolution) / 2).toString()}%`;
      unityCanvas.style.top = `${((100 - resolution) / 2).toString()}%`;
    }
  }

  terminate() {
    if (this.unityInstance === null) return;
    if (!confirm('Do you really hope to terminate the current Unity Academy instance? If so, everything need to reload when you use Unity Academy again.')) {
      return;
    }
    const quitFunctionName = 'Quit';
    this.unityInstance[quitFunctionName]();
    this.unityInstance = null;
    this.resetModuleData();
    this.setShowUnityComponent(0);
    const canvasContext = (document.querySelector('#unity-canvas') as HTMLCanvasElement)!.getContext('webgl2');
    canvasContext!.clearColor(0, 0, 0, 0);
    canvasContext!.clear(canvasContext!.COLOR_BUFFER_BIT);
    document.querySelector('#unity_load_info')!.innerHTML = 'Unity Academy app has been terminated. Please rerun your program with init_unity_academy_3d or init_unity_academy_2d for re-initialization.';
  }

  reset() {
    this.resetModuleData();
    if (this.unityInstance !== null) {
      const sendMessageFunctionName = 'SendMessage';
      // Reset Unity Academy app
      this.unityInstance[sendMessageFunctionName]('GameManager', 'ResetSession');
    }
  }

  private resetModuleData() {
    this.studentActionQueue = [];
    this.studentGameObjectStorage = {};
    this.gameObjectIdentifierSerialCounter = 0;
    this.input.keyboardInputInfo = {};
    this.guiData = [];
    // Make primitive game objects
    this.makeGameObjectDataStorage('MainCameraFollowingTarget');
  }

  isUnityInstanceReady() {
    return this.unityInstanceState === 'Ready';
  }

  instantiateInternal(prefabName : string) {
    let prefabExists = false;
    const len = this.prefabInfo.prefab_info.length;
    for (let i = 0; i < len; i++) {
      if (this.prefabInfo.prefab_info[i].name === prefabName) {
        prefabExists = true;
        break;
      }
    }
    if (!prefabExists) {
      throw new Error(`Unknown prefab name: '${prefabName}'. Please refer to this prefab list at [ ${UNITY_ACADEMY_BACKEND_URL}webgl_assetbundles/prefab_info.html ] for all available prefab names.`);
    }
    const gameObjectIdentifier = `${prefabName}_${this.gameObjectIdentifierSerialCounter}`;
    this.gameObjectIdentifierSerialCounter++;
    this.makeGameObjectDataStorage(gameObjectIdentifier);
    this.dispatchStudentAction(`instantiate|${prefabName}|${gameObjectIdentifier}`);
    return new GameObjectIdentifier(gameObjectIdentifier);
  }

  instantiate2DSpriteUrlInternal(sourceImageUrl : string) {
    const gameObjectIdentifier = `2DSprite_${this.gameObjectIdentifierSerialCounter}`;
    this.gameObjectIdentifierSerialCounter++;
    this.makeGameObjectDataStorage(gameObjectIdentifier);
    this.dispatchStudentAction(`instantiate2DSpriteUrl|${sourceImageUrl}|${gameObjectIdentifier}`);
    return new GameObjectIdentifier(gameObjectIdentifier);
  }

  destroyGameObjectInternal(gameObjectIdentifier : GameObjectIdentifier) : void {
    this.dispatchStudentAction(`destroyGameObject|${gameObjectIdentifier.gameObjectIdentifier}`);
  }

  private makeGameObjectDataStorage(gameObjectIdentifier : string) {
    this.studentGameObjectStorage[gameObjectIdentifier] = {
      startMethod: null,
      updateMethod: null,
      onCollisionEnterMethod: null,
      onCollisionStayMethod: null,
      onCollisionExitMethod: null,
      transform: {
        position: {
          x: 0,
          y: 0,
          z: 0,
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0,
        },
        scale: {
          x: 1,
          y: 1,
          z: 1,
        },
      },
      rigidbody: null,
      customProperties: {},
      isDestroyed: false,
    };
  }

  getStudentGameObject(gameObjectIdentifier : GameObjectIdentifier) : StudentGameObject {
    const retVal = this.studentGameObjectStorage[gameObjectIdentifier.gameObjectIdentifier];
    if (retVal === undefined) {
      throw new Error(`Could not find GameObject with identifier ${gameObjectIdentifier}`);
    }
    return retVal;
  }

  setStartInternal(gameObjectIdentifier : GameObjectIdentifier, startFunction : Function) : void {
    const gameObject = this.getStudentGameObject(gameObjectIdentifier);
    gameObject.startMethod = startFunction;
  }

  setUpdateInternal(gameObjectIdentifier : GameObjectIdentifier, updateFunction : Function) : void {
    const gameObject = this.getStudentGameObject(gameObjectIdentifier);
    gameObject.updateMethod = updateFunction;
  }

  private dispatchStudentAction(action) : void {
    this.studentActionQueue[this.studentActionQueue.length] = action;
  }

  getGameObjectIdentifierForPrimitiveGameObject(name : string) : GameObjectIdentifier {
    const propName = 'gameObjectIdentifierWrapperClass';
    return new this[propName](name);
  }

  getGameObjectTransformProp(propName : string, gameObjectIdentifier : GameObjectIdentifier) : Array<number> {
    const gameObject = this.getStudentGameObject(gameObjectIdentifier);
    return [gameObject.transform[propName].x, gameObject.transform[propName].y, gameObject.transform[propName].z];
  }

  setGameObjectTransformProp(propName : string, gameObjectIdentifier : GameObjectIdentifier, x : number, y : number, z : number) : void {
    const gameObject = this.getStudentGameObject(gameObjectIdentifier);
    gameObject.transform[propName].x = x;
    gameObject.transform[propName].y = y;
    gameObject.transform[propName].z = z;
  }

  getDeltaTime() : number {
    return this.deltaTime;
  }

  translateWorldInternal(gameObjectIdentifier : GameObjectIdentifier, x : number, y : number, z : number) : void {
    const gameObject = this.getStudentGameObject(gameObjectIdentifier);
    gameObject.transform.position.x += x;
    gameObject.transform.position.y += y;
    gameObject.transform.position.z += z;
  }


  translateLocalInternal(gameObjectIdentifier : GameObjectIdentifier, x : number, y : number, z : number) : void {
    const gameObject = this.getStudentGameObject(gameObjectIdentifier);
    const rotation = gameObject.transform.rotation;

    // Some methematical stuff here for calcuating the actual world position displacement from local translate vector and current Euler rotation.
    const rx = rotation.x * Math.PI / 180;
    const ry = rotation.y * Math.PI / 180;
    const rz = rotation.z * Math.PI / 180;
    const cos = Math.cos;
    const sin = Math.sin;
    const rotationMatrix
      = [[cos(ry) * cos(rz), -cos(ry) * sin(rz), sin(ry)],
        [cos(rx) * sin(rz) + sin(rx) * sin(ry) * cos(rz), cos(rx) * cos(rz) - sin(rx) * sin(ry) * sin(rz), -sin(rx) * cos(ry)],
        [sin(rx) * sin(rz) - cos(rx) * sin(ry) * cos(rz), cos(rx) * sin(ry) * sin(rz) + sin(rx) * cos(rz), cos(rx) * cos(ry)]];
    const finalWorldTranslateVector = [
      rotationMatrix[0][0] * x + rotationMatrix[0][1] * y + rotationMatrix[0][2] * z,
      rotationMatrix[1][0] * x + rotationMatrix[1][1] * y + rotationMatrix[1][2] * z,
      rotationMatrix[2][0] * x + rotationMatrix[2][1] * y + rotationMatrix[2][2] * z,
    ];
    gameObject.transform.position.x += finalWorldTranslateVector[0];
    gameObject.transform.position.y += finalWorldTranslateVector[1];
    gameObject.transform.position.z += finalWorldTranslateVector[2];
  }

  rotateWorldInternal(gameObjectIdentifier : GameObjectIdentifier, x : number, y : number, z : number) : void {
    const gameObject = this.getStudentGameObject(gameObjectIdentifier);
    gameObject.transform.rotation.x += x;
    gameObject.transform.rotation.y += y;
    gameObject.transform.rotation.z += z;
  }

  getKeyState(keyCode : string) : number {
    return this.input.keyboardInputInfo[keyCode];
  }

  playAnimatorStateInternal(gameObjectIdentifier : GameObjectIdentifier, animatorStateName : string) {
    this.getStudentGameObject(gameObjectIdentifier); // Just to check whether the game object identifier is valid or not.
    this.dispatchStudentAction(`playAnimatorState|${gameObjectIdentifier.gameObjectIdentifier}|${animatorStateName}`);
  }

  applyRigidbodyInternal(gameObjectIdentifier : GameObjectIdentifier) {
    console.log(`Applying rigidbody to GameObject ${gameObjectIdentifier.gameObjectIdentifier}`);
    const gameObject = this.getStudentGameObject(gameObjectIdentifier);
    if (gameObject.rigidbody !== null) {
      throw new Error(`Trying to duplicately apply rigidbody on GameObject ${gameObjectIdentifier.gameObjectIdentifier}`);
    }
    gameObject.rigidbody = {
      velocity: {
        x: 0,
        y: 0,
        z: 0,
      },
      angularVelocity: {
        x: 0,
        y: 0,
        z: 0,
      },
      mass: 1,
      useGravity: true,
      drag: 0,
      angularDrag: 0.05,
    };
    this.dispatchStudentAction(`applyRigidbody|${gameObjectIdentifier.gameObjectIdentifier}`);
  }

  private getRigidbody(gameObject: StudentGameObject) : RigidbodyData {
    if (gameObject.rigidbody === null) throw new Error('You must call apply_rigidbody on the game object before using this physics function!');
    return gameObject.rigidbody;
  }

  getRigidbodyVelocityVector3Prop(propName : string, gameObjectIdentifier : GameObjectIdentifier) : Array<number> {
    const gameObject = this.getStudentGameObject(gameObjectIdentifier);
    const rigidbody = this.getRigidbody(gameObject);
    return [rigidbody[propName].x, rigidbody[propName].y, rigidbody[propName].z];
  }

  setRigidbodyVelocityVector3Prop(propName : string, gameObjectIdentifier : GameObjectIdentifier, x : number, y : number, z : number) : void {
    const gameObject = this.getStudentGameObject(gameObjectIdentifier);
    const rigidbody = this.getRigidbody(gameObject);
    rigidbody[propName].x = x;
    rigidbody[propName].y = y;
    rigidbody[propName].z = z;
  }

  getRigidbodyNumericalProp(propName : string, gameObjectIdentifier : GameObjectIdentifier) : number {
    const gameObject = this.getStudentGameObject(gameObjectIdentifier);
    const rigidbody = this.getRigidbody(gameObject);
    return rigidbody[propName];
  }

  setRigidbodyNumericalProp(propName : string, gameObjectIdentifier : GameObjectIdentifier, value : number) : void {
    const gameObject = this.getStudentGameObject(gameObjectIdentifier);
    const rigidbody = this.getRigidbody(gameObject);
    rigidbody[propName] = value;
  }

  setUseGravityInternal(gameObjectIdentifier : GameObjectIdentifier, useGravity : boolean) : void {
    const gameObject = this.getStudentGameObject(gameObjectIdentifier);
    const rigidbody = this.getRigidbody(gameObject);
    rigidbody.useGravity = useGravity;
  }

  addImpulseForceInternal(gameObjectIdentifier : GameObjectIdentifier, x : number, y : number, z : number) : void {
    this.dispatchStudentAction(`addImpulseForce|${gameObjectIdentifier.gameObjectIdentifier}|${x.toString()}|${y.toString()}|${z.toString()}`);
  }

  removeColliderComponentsInternal(gameObjectIdentifier : GameObjectIdentifier) : void {
    this.dispatchStudentAction(`removeColliderComponents|${gameObjectIdentifier.gameObjectIdentifier}`);
  }

  setOnCollisionEnterInternal(gameObjectIdentifier : GameObjectIdentifier, eventFunction : Function) {
    const gameObject = this.getStudentGameObject(gameObjectIdentifier);
    gameObject.onCollisionEnterMethod = eventFunction;
  }

  setOnCollisionStayInternal(gameObjectIdentifier : GameObjectIdentifier, eventFunction : Function) {
    const gameObject = this.getStudentGameObject(gameObjectIdentifier);
    gameObject.onCollisionStayMethod = eventFunction;
  }

  setOnCollisionExitInternal(gameObjectIdentifier : GameObjectIdentifier, eventFunction : Function) {
    const gameObject = this.getStudentGameObject(gameObjectIdentifier);
    gameObject.onCollisionExitMethod = eventFunction;
  }

  requestForMainCameraControlInternal() : GameObjectIdentifier {
    const name = 'MainCamera';
    if (this.studentGameObjectStorage[name] !== undefined) {
      return this.getGameObjectIdentifierForPrimitiveGameObject('MainCamera');
    }
    this.makeGameObjectDataStorage(name);
    this.dispatchStudentAction('requestMainCameraControl');
    return this.getGameObjectIdentifierForPrimitiveGameObject('MainCamera');
  }

  onGUI_Label(content : string, x : number, y : number) : void {
    content = content.replaceAll('|', ''); // operator '|' is reserved as gui data separator in Unity Academy
    const newLabel = {
      type: 'label',
      content,
      x,
      y,
    };
    this.guiData.push(newLabel);
  }

  onGUI_Button(text : string, x: number, y : number, onClick : Function) : void {
    text = text.replaceAll('|', ''); // operator '|' is reserved as gui data separator in Unity Academy
    const newButton = {
      type: 'button',
      text,
      x,
      y,
      onClick,
    };
    this.guiData.push(newButton);
  }

  setTargetFrameRate(newTargetFrameRate : number) : void {
    newTargetFrameRate = Math.floor(newTargetFrameRate);
    if (newTargetFrameRate < 15) return;
    if (newTargetFrameRate > 120) return;
    this.targetFrameRate = newTargetFrameRate;
  }

  setCustomPropertyInternal(gameObjectIdentifier : GameObjectIdentifier, propName : string, value : any) : void{
    const gameObject = this.getStudentGameObject(gameObjectIdentifier);
    gameObject.customProperties[propName] = value;
  }

  getCustomPropertyInternal(gameObjectIdentifier : GameObjectIdentifier, propName : string) : any{
    const gameObject = this.getStudentGameObject(gameObjectIdentifier);
    return gameObject.customProperties[propName];
  }

  getTargetFrameRate() {
    return this.targetFrameRate;
  }
}

export function initializeModule(dimensionMode : string) {
  let INSTANCE = getInstance();
  if (INSTANCE !== undefined) {
    if (!INSTANCE.isUnityInstanceReady()) {
      throw new Error('Unity instance is not ready to accept a new Source program now. Please try again later.');
    }
    if (INSTANCE.unityInstance === null) {
      INSTANCE.reloadUnityAcademyInstanceAfterTermination();
    }
    INSTANCE.dimensionMode = dimensionMode;
    INSTANCE.reset();
    return;
  }

  INSTANCE = new UnityAcademyJsInteropContext();
  INSTANCE.dimensionMode = dimensionMode;
}
