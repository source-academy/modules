import React from 'react';

/**
 * React Component props for the Tab.
 */
type Props = {
  children?: never;
  className?: never;
  state?: any;
};

/**
 * React Component state for the Tab.
 */
type State = {
  isAnimationEnded: boolean;
};

type Point = {
  x: number;
  y: number;
};

type Polygon = Point[];

export default class Canvas extends React.Component<Props, State> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private animationFrameId: number | null = null;
  private speed: number = 2; // Speed of the movement
  private points: Point[];
  private xPos: number;
  private yPos: number;
  private pointIndex: number = 1;
  private walls: Polygon[];

  private CANVAS_WIDTH: number = 500;
  private CANVAS_HEIGHT: number = 500;

  constructor(props) {
    super(props);
    this.state = {
      isAnimationEnded: false
    };

    // setting some variables in what may or may not be good practice
    this.CANVAS_WIDTH = this.props.state.width;
    this.CANVAS_HEIGHT = this.props.state.height;
    this.points = this.props.state.movePoints; // a series of points is passed back from the modules which determines the path of robot
    this.walls = this.props.state.walls;
    this.xPos = this.points[0].x;
    this.yPos = this.points[0].y;

    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.setupCanvas();
  }

  componentWillUnmount() {
    this.stopAnimation();
  }

  setupCanvas = () => {
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = this.CANVAS_WIDTH;
    canvas.height = this.CANVAS_HEIGHT;

    ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    this.drawWalls(ctx);
    this.drawGrid(ctx);
    this.drawRobot(ctx, this.xPos, this.yPos);
  };

  startAnimation = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  stopAnimation = () => {
    if (this.animationFrameId) {
      this.setState({isAnimationEnded: true});
      cancelAnimationFrame(this.animationFrameId);
    }
  };

  animate = () => {
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (this.pointIndex >= this.points.length) return;

    ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    this.drawWalls(ctx);
    this.drawGrid(ctx);

    // Update position
    const targetPoint = this.points[this.pointIndex];
    const dx = targetPoint.x - this.xPos;
    const dy = targetPoint.y - this.yPos;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 1) {
      this.xPos += (dx / distance) * this.speed;
      this.yPos += (dy / distance) * this.speed;
    }

    // if distance to target point is small
    if (distance <= 1) {
      // snap to the target point
      this.xPos = targetPoint.x;
      this.yPos = targetPoint.y;

      // set target to the next point in the array
      this.pointIndex+= 1;

      if (this.pointIndex >= this.points.length) {
        this.stopAnimation();
      }
    }

    this.drawRobot(ctx, this.xPos, this.yPos);
    // Request the next frame
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  drawRobot(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.beginPath(); // Begin a new path

    ctx.arc(x, y, 20, 0, Math.PI * 2, false); // Full circle (0 to 2π radians)

    ctx.fillStyle = 'black'; // Set the fill color
    ctx.fill(); // Fill the circle
  }

  drawWalls(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.walls.length; i++) {
      // assumption is made that p1 is going to be the top left corner, might make some error checks for that later on
      const wall: Polygon = this.walls[i];

      ctx.beginPath();
      ctx.moveTo(wall[0].x, wall[0].y);
      for (let j = 1; j < wall.length; j++) {
        ctx.lineTo(wall[j].x, wall[j].y);
      }
      ctx.closePath();

      ctx.fillStyle = 'rgba(169, 169, 169, 0.5)'; // Set the fill color
      ctx.fill(); // Fill the polygon

      ctx.strokeStyle = 'rgb(53, 53, 53)'; // Set the stroke color
      ctx.lineWidth = 2; // Set the border width
      ctx.stroke(); // Stroke the polygon
    }
  }

  drawGrid(ctx: CanvasRenderingContext2D) {
    // Draw grid
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, this.CANVAS_HEIGHT);
    ctx.lineTo(this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    ctx.lineTo(this.CANVAS_WIDTH, 0);
    ctx.closePath();

    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  public render() {
    return (
      <>
        <button onClick={this.startAnimation}>Start</button>
        <p>{this.state.isAnimationEnded ? this.props.state.message : <></>}</p>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <canvas ref={this.canvasRef}/>
        </div>
      </>

    );
  }
}
