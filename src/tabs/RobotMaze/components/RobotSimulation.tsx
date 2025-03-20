import React, { useEffect, useRef, useState } from 'react';
import {
  type Area, type Action, type PointWithRotation, type StateData
} from '../../../bundles/robot_minigame/functions';

/**
 * Draw the borders of the map
 * @param ctx for the canvas to draw on
 * @param width of the map
 * @param height of the map
 */
const drawBorders = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, height);
  ctx.lineTo(width, height);
  ctx.lineTo(width, 0);
  ctx.closePath();

  ctx.strokeStyle = 'gray';
  ctx.lineWidth = 3;
  ctx.stroke();
}

// Draw the areas of the map
const drawAreas = (ctx: CanvasRenderingContext2D, areas: Area[]) => {
  for (const { vertices } of areas) {
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (const vertex of vertices.slice(1)) {
      ctx.lineTo(vertex.x, vertex.y);
    }
    ctx.closePath();

    ctx.fillStyle = 'rgba(169, 169, 169, 0.5)'; // Set the fill color
    ctx.fill(); // Fill the polygon

    ctx.strokeStyle = 'rgb(53, 53, 53)'; // Set the stroke color
    ctx.lineWidth = 2; // Set the border width
    ctx.stroke(); // Stroke the polygon
  }
}

// Draw the robot
const drawRobot = (ctx: CanvasRenderingContext2D, { x, y, rotation } : PointWithRotation, size: number) => {
  const centerX = x;
  const centerY = y;

  ctx.save();

  // translates the origin of the canvas to the center of the robot, then rotate
  ctx.translate(centerX, centerY);
  ctx.rotate(-rotation);

  ctx.beginPath(); // Begin drawing robot

  ctx.arc(0, 0, size, 0, Math.PI * 2, false); // Full circle (0 to 2π radians)

  ctx.fillStyle = 'black'; // Set the fill color
  ctx.fill(); // Fill the circle
  ctx.closePath();

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(0, 0);
  ctx.stroke();

  // restore state of the background
  ctx.restore();
}

// The speed to move at
const ANIMATION_SPEED : number = 2;

/**
 * React Component props for the Tab.
 */
interface MapProps {
  children?: never
  className?: never
  state: StateData
};

const RobotSimulation : React.FC<MapProps> = ({
  state: {
    isInit,
    width,
    height,
    areas,
    // areaLog,
    actionLog,
    message,
    // success,
    // messages,
    robotSize
  }
}) => {
  // Store the robot status
  const [x, setX] = useState<number>(actionLog[0].position.x);
  const [y, setY] = useState<number>(actionLog[0].position.y);
  const [rotation, setRotation] = useState<number>(actionLog[0].position.rotation);

  // Whether the animation has ended
  const [isAnimationEnded, setAnimationEnded] = useState<boolean>(false);

  // Whether the animation is paused
  const [animationUnpauseTime, setAnimationUnpauseTime] = useState<number>(-1);

  // Store the animation frame
  const [animationFrame, setAnimationFrame] = useState<number>();

  // Store the next animation
  const [currentAction, setCurrentAction] = useState<number>(1);

  // Select the next action
  const nextAction = () => setCurrentAction(a => a + 1);

  // Animate the next frame
  const nextFrame = () => setAnimationFrame(requestAnimationFrame(animate));

  // Run the animation
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (currentAction >= actionLog.length) return;

    // temporary pausing thing for the sensor
    if (animationUnpauseTime < 0) {
      if (Date.now() > animationUnpauseTime) {
        setAnimationUnpauseTime(-1);
        nextAction();
      }
      return nextFrame();
    }

    // Draw the map
    ctx.reset();
    drawBorders(ctx, width, height);
    drawAreas(ctx, areas);

    // Get current action
    const { type, position }: Action = actionLog[currentAction];

    switch(type) {
      case 'move':
        const targetPoint = {x: position.x, y: position.y};
        const dx = targetPoint.x - x;
        const dy = targetPoint.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance > 1) {
          setX(v => v + (dx / distance) * ANIMATION_SPEED);
          setY(v => v + (dy / distance) * ANIMATION_SPEED);
        }
  
        // if distance to target point is small
        if (distance <= 1) {
          // snap to the target point
          setX(targetPoint.x);
          setY(targetPoint.y);
  
          // set target to the next point in the array
          nextAction();
        }
        break;
      case 'rotate':
        const targetRotation = position.rotation;
        setRotation(v => v - 0.1);

        if (Math.abs(rotation - targetRotation) <= 0.1) {
          setRotation(targetRotation);
          nextAction();
        } else {
          if (rotation > Math.PI) {
            setRotation(v => v - 2 * Math.PI);
          }

          if (rotation < -Math.PI) {
            setRotation(v => v + 2 * Math.PI);
          }

          if (Math.abs(rotation - targetRotation) <= 0.1) {
            setRotation(targetRotation);
            nextAction();
          }
        }
        break;
      case 'sensor':
        setAnimationUnpauseTime(Date.now() + 500);
        break;
    }

    if (currentAction >= actionLog.length) {
      stopAnimation();
    }

    drawRobot(ctx, {x, y, rotation}, robotSize);

    // Request the next frame
    nextFrame();
  };

  // Stop the current animation
  const stopAnimation = () => {
    if (animationFrame) {
      setAnimationEnded(true);
      cancelAnimationFrame(animationFrame);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    ctx.reset();
    drawBorders(ctx, width, height);
    drawAreas(ctx, areas);
    drawRobot(ctx, {x, y, rotation}, robotSize);

    return stopAnimation;
  }, []);

  // Store a reference to the HTML canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <>
      <button onClick={nextFrame}>Start</button>
      <p>{isAnimationEnded ? message : <></>}</p>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <canvas ref={canvasRef}/>
      </div>
    </>
  );
}

export default RobotSimulation;