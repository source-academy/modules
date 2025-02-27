/* 
* Internally, the robot uses a grid based movement and collision system 
*/

import context from 'js-slang/context';

let robotPos: Point = {x: 0, y: 0};

let movePoints: Point[];

const DIRECTIONS = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
};

let robotRotation = 1;

// default grid width and height is 25
context.moduleContexts.robot_minigame.state = {
    isInit: false,
    width: 25,
    height: 25,
    walls: [],
    movePoints: [],
    message: "moved successfully",
    success: true
}

type Point = {x: number, y: number}
type Wall = {p1: Point, p2: Point}

export function set_pos(x: number, y: number): void {
  robotPos.x = x;
  robotPos.y = y;
}

export function set_grid_width(width: number) {
    context.moduleContexts.robot_minigame.state.width = width;
}

export function set_grid_height(height: number) {
    context.moduleContexts.robot_minigame.state.height = height;
}

export function init(gridWidth: number, gridHeight: number, posX: number, posY: number) {
    set_grid_width(gridWidth);
    set_grid_height(gridHeight);
    set_pos(posX, posY);
    context.moduleContexts.robot_minigame.state.movePoints.push({x: posX, y: posY});
    context.moduleContexts.robot_minigame.state.isInit = true;
}

export function turn_left() {
    if (alrCollided()) return;

    robotRotation -= 1;
    if (robotRotation < 0) {
        robotRotation = 3;
    }
}

export function turn_right() {
    if (alrCollided()) return;

    robotRotation = (robotRotation + 1) % 4;
}

// takes the top left and bottom right corners of walls 
// in terms of grid boxes
// grid starts from (0, 0) at the top left corner btw
export function set_wall(x1: number, y1: number, x2: number, y2: number) {
    let wall: Wall = {p1: {x: x1, y: y1}, p2: {x: x2, y: y2}};
    context.moduleContexts.robot_minigame.state.walls.push(wall);
}

export function move_forward(dist: number): void {
    if (alrCollided()) return;
    
    simulate(dist);
}

export function getX():number {
    return robotPos.x;
}

export function getY():number {
    return robotPos.y;
}

function simulate(moveDist: number) {
    let dx: number = 0;
    let dy: number = 0;
    switch (robotRotation) {
        case DIRECTIONS.UP:
            dy = -1;
            break;
        case DIRECTIONS.RIGHT:
            dx = 1;
            break;
        case DIRECTIONS.DOWN:
            dy = 1;
            break;
        case DIRECTIONS.LEFT:
            dx = -1;
            break;
    }

    // moves robot by one grid box and checks collision
    for (var i = 0; i < moveDist; i++) {
        robotPos.x += dx;
        robotPos.y += dy;
        
        var walls = context.moduleContexts.robot_minigame.state.walls;
        for (let j = 0; j < walls.length; j++) {
            if (checkWallCollision(walls[j], robotPos)) {
                context.moduleContexts.robot_minigame.state.success = false;
                context.moduleContexts.robot_minigame.state.message = "collided";
                context.moduleContexts.robot_minigame.state.movePoints.push({x: robotPos.x, y: robotPos.y});
                return;
            }
        }
    }

    context.moduleContexts.robot_minigame.state.movePoints.push({x: robotPos.x, y: robotPos.y});

    // OLD CODE
    // let destX = robotPos.x + moveDist * Math.cos(robotAngle);
    // let destY = robotPos.y + moveDist * Math.sin(robotAngle);
    // let destPoint: Point = {x: destX, y: destY}

    // for (let i = 0; i < steps; i++) {
    //     let distX: number = moveSpeed * Math.cos(robotAngle);
    //     let distY: number = moveSpeed * Math.sin(robotAngle);

    //     robotPos.x += distX;
    //     robotPos.y += distY;

    //     for (let j = 0; j < walls.length; j++) {
    //         if(checkWallCollision(walls[j], robotPos)) {
    //             addMessage("Collided with wall!!");
    //             addMessage(`Position: (${robotPos.x.toFixed(3)}, ${robotPos.y.toFixed(3)}), Rotation: ${robotAngle}\n`);
    //             return;
    //         }
    //     }

    //     if (distanceBetween(destPoint, robotPos) < robotRadius) {
    //         robotPos = destPoint;
    //         addMessage(`Robot moved forward by ${moveDist} at angle ${robotAngle} radians\n`);
    //         addMessage(`Position: (${robotPos.x.toFixed(3)}, ${robotPos.y.toFixed(3)}), Rotation: ${robotAngle}\n`);
    //         return;
    //     }        
    // }


}


function checkWallCollision(wall: Wall, pos: Point): boolean {
    // // Apply the distance formula
    // const p1 = wall.p1;
    // const p2 = wall.p2;

    // const numerator = Math.abs((p2.y - p1.y) * pos.x - (p2.x - p1.x) * pos.y + p2.x * p1.y - p2.y * p1.x);
    // const denominator = Math.sqrt((p2.y - p1.y) ** 2 + (p2.x - p1.x) ** 2);
    
    // return numerator / denominator < robotRadius;

    const p1 = wall.p1;
    const p2 = wall.p2;

    const minX = Math.min(p1.x, p2.x);
    const maxX = Math.max(p1.x, p2.x);
    const minY = Math.min(p1.y, p2.y);
    const maxY = Math.max(p1.y, p2.y);

    return pos.x >= minX && pos.x <= maxX && pos.y >= minY && pos.y <= maxY;
}

function alrCollided() {
    return !context.moduleContexts.robot_minigame.state.success;
}
