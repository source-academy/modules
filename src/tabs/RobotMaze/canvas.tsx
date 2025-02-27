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

type Wall = {
  p1: Point;
  p2: Point
};

export default class Canvas extends React.Component<Props, State> {
  private canvasRef: React.RefObject<HTMLCanvasElement>;
  private animationFrameId: number | null = null;
  private speed: number = 2; // Speed of the movement
  private points: Point[];
  private xPos: number;
  private yPos: number;
  private pointIndex: number = 1;
  private walls: Wall[];

  private CANVAS_WIDTH: number = 500;
  private CANVAS_HEIGHT: number = 500;
  private GRID_SIZE: number = 20;

  constructor(props) {
    super(props);
    this.state = {
      isAnimationEnded: false
    };

    // setting some variables in what may or may not be good practice
    this.CANVAS_WIDTH = this.props.state.width * this.GRID_SIZE;
    this.CANVAS_HEIGHT = this.props.state.height * this.GRID_SIZE;
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
    ctx.fillStyle = 'black';
    ctx.fillRect(this.xPos, this.yPos, 20, 20);
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

    // Draw the moving square
    ctx.clearRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
    this.drawWalls(ctx);
    this.drawGrid(ctx);

    // Update position
    const targetPoint = this.points[this.pointIndex];
    const dx = targetPoint.x * this.GRID_SIZE - this.xPos;
    const dy = targetPoint.y * this.GRID_SIZE - this.yPos;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 1) {
      this.xPos += (dx / distance) * this.speed;
      this.yPos += (dy / distance) * this.speed;
    }

    // if distance to target point is small
    if (distance <= 1) {
      // snap to the target point
      this.xPos = targetPoint.x * this.GRID_SIZE;
      this.yPos = targetPoint.y * this.GRID_SIZE;

      // set target to the next point in the array
      this.pointIndex+= 1;

      if (this.pointIndex >= this.points.length) {
        this.stopAnimation();
      }
    }
    ctx.fillStyle = 'black';
    ctx.fillRect(this.xPos, this.yPos, 20, 20);

    // Request the next frame
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  drawWalls(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.walls.length; i++) {
      // assumption is made that p1 is going to be the top left corner, might make some error checks for that later on
      const p1 = this.walls[i].p1;
      const p2 = this.walls[i].p2;
      const width = (p2.x - p1.x) * this.GRID_SIZE + this.GRID_SIZE;
      const height = (p2.y - p1.y) * this.GRID_SIZE + this.GRID_SIZE;

      ctx.fillStyle = 'rgb(128, 128, 128)';
      ctx.fillRect(p1.x * this.GRID_SIZE, p1.y * this.GRID_SIZE, width, height);
    }
  }

  drawGrid(ctx: CanvasRenderingContext2D) {
    // Draw grid
    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= this.CANVAS_WIDTH; x += this.GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.CANVAS_HEIGHT);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= this.CANVAS_HEIGHT; y += this.GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.CANVAS_WIDTH, y);
      ctx.stroke();
    }
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
