import type { DefaultEv3 } from '../../controllers';
import type { Controller } from '../Core/Controller';
import type { PhysicsTimingInfo } from '../Physics';
import type { Renderer } from '../Render/Renderer';

export class FpsMonitor implements Controller {
  render: Renderer;
  overlayDiv: HTMLDivElement;
  textContainer: HTMLDivElement;
  ev3: DefaultEv3;
  added = false;

  constructor(render: Renderer, ev3: DefaultEv3) {
    this.ev3 = ev3;
    this.render = render;
    this.overlayDiv = document.createElement('div');
    this.overlayDiv.style.position = 'absolute';
    this.overlayDiv.style.color = 'black';
    this.overlayDiv.style.top = '0';
    this.overlayDiv.style.left = '0';
    this.overlayDiv.style.width = '100%'; // Cover the full area of the container
    this.overlayDiv.style.height = '100%';
    this.overlayDiv.style.pointerEvents = 'none'; // Allows clicking through the div if needed
    this.overlayDiv.id = 'fpsMonitor';
    this.textContainer = document.createElement('div');
    this.textContainer.style.position = 'absolute';
    this.textContainer.style.fontSize = '20px';
    this.textContainer.style.top = '300px';
    this.textContainer.style.left = '700px';
    this.textContainer.style.backgroundColor = 'white';

    this.overlayDiv.appendChild(this.textContainer);
  }

  fixedUpdate(timingInfo: PhysicsTimingInfo): void {
    const fps = timingInfo.framesPerSecond.toFixed(2);
    const distance = this.ev3.get('ultrasonicSensor')
      .sense();
    const canvas = this.render.getElement();

    if (timingInfo.stepCount % 2 === 0) {
      this.textContainer.innerHTML = `FPS: ${fps}<br>Distance: ${distance}`;
    }

    if (!this.added) {
      canvas.parentNode!.appendChild(this.overlayDiv);
      this.added = true;
    }
  }
}
