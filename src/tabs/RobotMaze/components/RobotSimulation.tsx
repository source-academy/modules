import React, { useEffect, useRef, useState } from 'react';
import type { Area, Action, PointWithRotation, Robot, RobotMinigame } from '../../../bundles/robot_minigame/functions';

/**
 * Calculate the acute angle between 2 angles
 *
 * @param target rotation
 * @param current rotation
 * @returns the acute angle between
 */
const smallestAngle = (target, current) => {
  const dr = (target - current) % (2 * Math.PI);

  if (dr > 0 && dr > Math.PI) return dr - (2 * Math.PI);

  if (dr < 0 && dr < -Math.PI) return dr + (2 * Math.PI);

  return dr;
};

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
};

// Draw the areas of the map
const drawAreas = (ctx: CanvasRenderingContext2D, areas: Area[]) => {
  for (const { vertices, isObstacle, flags } of areas) {
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for (const vertex of vertices.slice(1)) {
      ctx.lineTo(vertex.x, vertex.y);
    }
    ctx.closePath();

    ctx.fillStyle = isObstacle // Obstacles are gray
      ? 'rgba(169, 169, 169, 0.5)'
      : flags.color || 'none'; // Areas may have color
    ctx.fill(); // Fill the polygon

    ctx.strokeStyle = 'rgb(53, 53, 53)'; // Set the stroke color
    ctx.lineWidth = 2; // Set the border width
    ctx.stroke(); // Stroke the polygon
  }
};

// Draw the robot
const drawRobot = (ctx: CanvasRenderingContext2D, { x, y, rotation } : PointWithRotation, size: number) => {
  // Save the background state
  ctx.save();

  // translates the origin of the canvas to the center of the robot, then rotate
  ctx.translate(x, y);
  ctx.rotate(rotation);

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

  // Restore the background state
  ctx.restore();
};

/**
 * Render the current game state
 */
const drawAll = (
  ctx : CanvasRenderingContext2D,
  width : number,
  height : number,
  areas: Area[],
  {x, y, rotation, radius: robotSize} : Robot
) => {
  ctx.reset();
  drawBorders(ctx, width, height);
  drawAreas(ctx, areas);
  drawRobot(ctx, {x, y, rotation}, robotSize);
};

// The speed to move at
const ANIMATION_SPEED : number = 2;

/**
 * React Component props for the Tab.
 */
interface MapProps {
  children?: never
  className?: never
  state: RobotMinigame,
}

const RobotSimulation : React.FC<MapProps> = ({
  state: { 
    width,
    height,
    robot: {radius: robotSize},
    areas,
    actionLog,
    message
  }
}) => {
  // Store animation status
  // 0 => Loaded / Loading
  // 1 => Running
  // 2 => Paused
  // 3 => Finished
  const [animationStatus, setAnimationStatus] = useState<0 | 1 | 2 | 3>(0);

  // Store animation pause
  const animationPauseUntil = useRef<number | null>(null);

  // Store current action id
  const currentAction = useRef<number>(1);

  // Store robot status
  const robot = useRef<Robot>({x: 0, y: 0, rotation: 0, radius: 1});

  // Ensure canvas is preloaded correctly
  useEffect(() => {
    // Only load if animationStatus is 0
    if (animationStatus !== 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset current action
    currentAction.current = 1;

    // Reset robot position if action log has actions
    if (actionLog.length > 0) robot.current = Object.assign({}, {radius: robotSize}, actionLog[0].position);

    // Update canvas dimensions
    canvas.width = width;
    canvas.height = height;

    drawAll(ctx, width, height, areas, robot.current);
  }, [animationStatus]);

  // Handle animation
  useEffect(() => {
    if (animationStatus !== 1) return;

    const interval = setInterval(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // End animation after action log complete
      if (currentAction.current >= actionLog.length) return setAnimationStatus(3);

      // Skip animation if paused
      if (animationPauseUntil.current !== null) {
        if (Date.now() > animationPauseUntil.current) {
          animationPauseUntil.current = null;
          currentAction.current++;
        }
        return;
      }

      // Get current action
      const { type, position: target }: Action = actionLog[currentAction.current];

      switch(type) {
        case 'move': {
          // Calculate the distance to target point
          const dx = target.x - robot.current.x;
          const dy = target.y - robot.current.y;
          const distance = Math.sqrt(
            (target.x - robot.current.x) ** 2 +
            (target.y - robot.current.y) ** 2);

          // If distance to target point is small
          if (distance <= ANIMATION_SPEED) {
            // Snap to the target point
            robot.current.x = target.x;
            robot.current.y = target.y;

            // Move on to next action
            currentAction.current++;
            break;
          }

          // Move the robot towards the target
          robot.current.x += (dx / distance) * ANIMATION_SPEED;
          robot.current.y += (dy / distance) * ANIMATION_SPEED;
          break;
        } case 'rotate':
          // If rotation is close to target rotation
          if (Math.abs((target.rotation - robot.current.rotation) % (2 * Math.PI)) < 0.1) {
            // Snap to the target point
            robot.current.rotation = target.rotation;

            // Move on to next action
            currentAction.current++;
            break;
          }

          robot.current.rotation += smallestAngle(target.rotation, robot.current.rotation) > 0 ? 0.1 : -0.1;

          if (robot.current.rotation > Math.PI) {
            robot.current.rotation -= 2 * Math.PI;
          }

          if (robot.current.rotation < Math.PI) {
            robot.current.rotation += 2 * Math.PI;
          }
          break;
        case 'sensor':
          animationPauseUntil.current = Date.now() + 500;
          break;
        default:
          robot.current = Object.assign({}, {radius: robot.current.radius}, target);
      }

      drawAll(ctx, width, height, areas, robot.current);
    }, 10);

    return () => clearInterval(interval);
  }, [animationStatus]);

  // Store a reference to the HTML canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <>
      <div>
        
        {animationStatus === 0
          ? <button onClick={() => {setAnimationStatus(1);}}>Start</button>
          : animationStatus === 1
            ? <button onClick={() => {setAnimationStatus(2);}}>Pause</button>
            : animationStatus === 2
              ? <button onClick={() => {setAnimationStatus(1);}}>Resume</button>
              : <button onClick={() => {setAnimationStatus(0);}}>Reset</button>}
        {animationStatus === 3 && <span style={{marginLeft: '5px'}}>{message}</span>}
      </div>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <canvas ref={canvasRef}/>
      </div>
    </>
  );
};

export default RobotSimulation;
